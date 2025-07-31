import type {
  DbResume,
  DbResumeEmpty,
  DbResumeUpdate,
  DbService,
  DbServiceResponse
} from "~/utils/storage/db";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  type ListObjectsV2Output
} from "@aws-sdk/client-s3";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { fromWebToken } from "@aws-sdk/credential-provider-web-identity";
import { now } from "@vueuse/core";
import {
  credentialsError,
  notFoundError,
  notFoundKeyError,
  storageError,
  success
} from "~/utils/storage/helpers";

export class S3DbService implements DbService {
  //TODO move to env variables
  private _bucketName = "euristiq-internal-cv-filestore";
  private _region = "us-east-1";
  private _roleArn = "arn:aws:iam::542402751712:role/EuristiqCvGoogleFederatedAccessRole";
  private _keyPrefix = "data";

  private _getCredentialsProvider() {
    const userStore = useUserStore();
    const user = userStore?.user;
    const token = userStore.idToken;
    if (!user || !token) throw new Error("No user or token");

    return fromWebToken({
      roleArn: this._roleArn,
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

  private async _getKey(name: string) {
    const awsUserId = await this._getUserId();
    return `${this._keyPrefix}/${awsUserId}/${name}.json`;
  }

  private async _getStorageIfIdExists(id: number, allowNotExist: boolean = false) {
    const storage = await this._s3Client();

    // Check storage
    if (!storage) return storageError();
    if (!(await this._existsByKey(storage, await this._getKey(id.toString()))))
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

    if ("id" in data) {
      const existingKey = await this._getKey(data.id.toString());

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

    const resume: DbResume = {
      updated_at: _now.toString(),
      created_at: _now.toString(),
      // owner_id: user?.sub,
      id: _now,
      ...data
    };
    const resumeKey = await this._getKey(resume.id.toString());

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

  public async delete(id: number): DbServiceResponse<DbResume> {
    const res = await this._getStorageIfIdExists(id);
    if (res.error || !res.data) return res;

    const existing = await this.queryById(id);

    try {
      await res.data.send(
        new DeleteObjectCommand({
          Bucket: this._bucketName,
          Key: await this._getKey(id.toString())
        })
      );
    } catch (err: any) {
      if (err.code === "NotFound" || err.code === "NoSuchKey") {
        return notFoundError(id);
      }
      throw err;
    }

    return success(existing.data!);
  }

  public async queryAll(): DbServiceResponse<Array<DbResume>> {
    const s3 = await this._s3Client();
    if (!s3) return storageError();

    const prefix = `${this._keyPrefix}/${await this._getUserId()}/`;
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

    for (const key of keys) {
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
    const key = await this._getKey(id.toString());

    return this._queryByKey(s3, key);
  }

  public async update(
    data: DbResumeUpdate,
    newUpdateTime: boolean
  ): DbServiceResponse<DbResume> {
    const res = await this._getStorageIfIdExists(data.id);
    if (res.error || !res.data) return res;

    const s3 = res.data!;
    const key = await this._getKey(data.id.toString());
    const getResponse = await s3.send(
      new GetObjectCommand({
        Bucket: this._bucketName,
        Key: key
      })
    );
    const jsonResponse = await new Response(getResponse.Body as any).json();
    const existing = jsonResponse as DbResume;

    const { id, ...updatedResume } = {
      ...existing,
      ...data,
      updated_at: newUpdateTime ? now().toString() : existing.updated_at
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

    return success({ id, ...updatedResume });
  }
}
