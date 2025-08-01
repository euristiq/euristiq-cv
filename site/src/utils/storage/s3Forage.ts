import type {
  DbResume,
  DbResumeEmpty,
  DbResumeUpdate,
  DbServiceResponse,
  ExtendedDbService
} from "~/utils/storage/db";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  type ListObjectsV2Output,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import { GetCallerIdentityCommand, STSClient } from "@aws-sdk/client-sts";
import { fromWebToken } from "@aws-sdk/credential-provider-web-identity";
import { now } from "@vueuse/core";
import {
  credentialsError,
  notFoundError,
  notFoundKeyError,
  storageError,
  success
} from "~/utils/storage/helpers";

export class S3DbService implements ExtendedDbService {
  //TODO move to env variables
  private _bucketName = "euristiq-internal-cv-filestore";
  private _region = "us-east-1";
  private _roleArn = "arn:aws:iam::542402751712:role/EuristiqCvGoogleFederatedAccessRole";
  private _adminRoleArn =
    "arn:aws:iam::542402751712:role/EuristiqCvGoogleFederatedAdminAccessRole";
  private _keyPrefix = "data";

  private _getCredentialsProvider() {
    const userStore = useUserStore();
    const user = userStore?.user;
    const token = userStore.idToken;
    if (!user || !token) throw new Error("No user or token");

    return fromWebToken({
      roleArn: userStore.isAdmin ? this._adminRoleArn : this._roleArn,
      webIdentityToken: token,
      roleSessionName: user.email
    });
  }

  private async _s3Client(): Promise<S3Client | null> {
    return new S3Client({
      region: this._region,
      credentials: this._getCredentialsProvider()
    });
  }

  private async _getUserId(): Promise<string | undefined> {
    const userStore = useUserStore();
    if (!userStore) return undefined;
    if (userStore.awsUserId) return userStore.awsUserId;

    const sts = new STSClient({
      region: this._region,
      credentials: this._getCredentialsProvider()
    });

    const { UserId: identityId } = await sts.send(new GetCallerIdentityCommand({}));
    if (!identityId) throw new Error("Could not fetch aws:userid");

    userStore.startAwsSession(identityId);
    return identityId;
  }

  private async _getUserBoundKey(name: string) {
    const awsUserId = await this._getUserId();
    return `${this._keyPrefix}/${awsUserId}/${name}.json`;
  }

  private async _getStorageIfIdExists(
    id: number,
    path?: string,
    allowNotExist: boolean = false
  ) {
    const storage = await this._s3Client();

    // Check storage
    if (!storage) return storageError();
    if (
      !(await this._existsByKey(
        storage,
        path ?? (await this._getUserBoundKey(id.toString()))
      ))
    )
      return allowNotExist ? success(null) : notFoundError(id);

    return success(storage);
  }

  private async _existsByKey(s3: S3Client, key: string): Promise<boolean> {
    try {
      await s3.send(
        new HeadObjectCommand({
          Bucket: this._bucketName,
          Key: key
        })
      );
      return true;
    } catch (err: any) {
      if (err.$metadata?.httpStatusCode === 404) {
        return false;
      }

      throw err;
    }
  }

  public async create(data: DbResumeEmpty | DbResume): DbServiceResponse<DbResume> {
    const s3 = await this._s3Client();
    if (!s3) return storageError();

    if ("id" in data && "path" in data) {
      const existingKey = data.path ?? (await this._getUserBoundKey(data.id.toString()));

      if (await this._existsByKey(s3, existingKey)) {
        return {
          data: null,
          error: {
            message: `Resume ${data.id} already exists.`
          }
        };
      }
    }

    const _now = now();
    const userId = this._getUserId();
    if (!userId) return credentialsError();

    const id = _now;
    const resumeKey = await this._getUserBoundKey(id.toString());
    const resume: DbResume = {
      updated_at: _now.toString(),
      created_at: _now.toString(),
      path: resumeKey,
      id: id,
      ...data
    };

    await s3.send(
      new PutObjectCommand({
        Bucket: this._bucketName,
        Key: resumeKey,
        Body: JSON.stringify(resume),
        ContentType: "application/json"
      })
    );

    return success(resume);
  }

  public async deleteById(id: number): DbServiceResponse<DbResume> {
    const res = await this._getStorageIfIdExists(id);
    if (res.error || !res.data) return res;

    const existing = await this.queryById(id);
    if (existing.error) return existing;

    return await this.delete(existing.data!);
  }

  public async delete(resume: DbResume): DbServiceResponse<DbResume> {
    const s3 = await this._s3Client();
    if (!s3) return storageError();

    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: this._bucketName,
          Key: resume.path
        })
      );
    } catch (err: any) {
      if (err.code === "NotFound" || err.code === "NoSuchKey") {
        return notFoundError(resume.id);
      }
      throw err;
    }

    return success(resume!);
  }

  public async queryAll(): DbServiceResponse<Array<DbResume>> {
    const userStore = useUserStore();
    const s3 = await this._s3Client();
    if (!s3) return storageError();

    const prefix = userStore.isAdmin
      ? `${this._keyPrefix}/`
      : `${this._keyPrefix}/${await this._getUserId()}/`;
    let ContinuationToken: string | undefined = undefined;
    const keys: string[] = [];

    do {
      const resp: ListObjectsV2Output = await s3.send(
        new ListObjectsV2Command({
          Bucket: this._bucketName,
          Prefix: prefix,
          ContinuationToken
        })
      );
      resp.Contents?.forEach((o) => o.Key && keys.push(o.Key));
      ContinuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
    } while (ContinuationToken);

    const resumes: Array<DbResume> = [];

    for (const key of keys.filter((k) => k.endsWith(".json"))) {
      const res = await this._queryByKey(s3, key);
      if (res.data) resumes.push(res.data);
    }

    resumes.sort(
      (a, b) =>
        b.updated_at.localeCompare(a.updated_at) ||
        b.created_at.localeCompare(a.created_at)
    );

    return success(resumes);
  }

  private async _queryByKey(s3: S3Client, key: string): DbServiceResponse<DbResume> {
    try {
      const resp = await s3.send(
        new GetObjectCommand({
          Bucket: this._bucketName,
          Key: key
        })
      );
      const resume = await new Response(resp.Body as any).json();

      return success(resume as DbResume);
    } catch (err: any) {
      if (
        err.code === "NoSuchKey" ||
        err.code === "NotFound" ||
        err.$metadata?.httpStatusCode === 404
      ) {
        return notFoundKeyError(key);
      }
      throw err;
    }
  }

  public async queryById(id: number): DbServiceResponse<DbResume> {
    const res = await this._getStorageIfIdExists(id);
    if (res.error) return res;

    const s3 = res.data!;
    const key = await this._getUserBoundKey(id.toString());

    return this._queryByKey(s3, key);
  }

  public async update(
    data: DbResumeUpdate,
    newUpdateTime: boolean
  ): DbServiceResponse<DbResume> {
    const res = await this._getStorageIfIdExists(data.id, data.path);
    if (res.error || !res.data) return res;

    const s3 = res.data!;
    const key = data.path || (await this._getUserBoundKey(data.id.toString()));
    const getResponse = await s3.send(
      new GetObjectCommand({
        Bucket: this._bucketName,
        Key: key
      })
    );
    const jsonResponse = await new Response(getResponse.Body as any).json();
    const existing = jsonResponse as DbResume;

    const updatedResume = {
      ...existing,
      ...data,
      updated_at: newUpdateTime ? now().toString() : existing.updated_at,
      id: existing.id
    };

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: this._bucketName,
          Body: JSON.stringify(updatedResume),
          Key: key,
          ContentType: "application/json"
        })
      );
    } catch (err: any) {
      if (err.code === "NoSuchKey") {
        return notFoundError(data.id);
      }
      throw err;
    }

    return success(updatedResume);
  }
}
