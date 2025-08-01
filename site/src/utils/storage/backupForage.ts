import type {
  DbResume,
  DbResumeEmpty,
  DbResumeUpdate,
  DbService,
  DbServiceResponse
} from "~/utils/storage/db";

export class BackupForageDBService implements DbService {
  private localStorage: DbService;
  private backupStorage: DbService;
  private readonly intervalId: number | null = null;

  constructor(
    localStorage: DbService,
    backupStorage: DbService,
    syncIntervalMs: number = 20e3
  ) {
    this.localStorage = localStorage;
    this.backupStorage = backupStorage;
    if (typeof window !== "undefined") {
      this.intervalId = window.setInterval(() => {
        this.sync().catch((err) => {
          console.error("Background sync failed:", err);
        });
      }, syncIntervalMs);
    }
  }

  beforeDestroy() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }

  public async create(data: DbResumeEmpty | DbResume): DbServiceResponse<DbResume> {
    const result = await this.localStorage.create(data);
    if (result.error) return result;

    await this.backupStorage.create(result.data!);

    return result;
  }

  public async delete(id: number): DbServiceResponse<DbResume> {
    const result = await this.localStorage.delete(id);
    await this.backupStorage.delete(id);

    return result;
  }

  public async queryAll(): DbServiceResponse<Array<DbResume>> {
    return this.localStorage.queryAll();
  }

  public async queryById(id: number): DbServiceResponse<DbResume> {
    return this.localStorage.queryById(id);
  }

  public async update(
    data: DbResumeUpdate,
    newUpdateTime: boolean
  ): DbServiceResponse<DbResume> {
    const result = await this.localStorage.update(data, newUpdateTime);
    if (result.error) return result;

    await this.backupStorage.update(result.data!, newUpdateTime);

    return result;
  }

  private async sync() {
    try {
      console.log("Syncing...");
      const localData = await this.localStorage.queryAll();
      if (localData.error) {
        console.error("Failed to local from local:", localData.error);
        return;
      }
      const backupData = await this.backupStorage.queryAll();
      if (backupData.error) {
        console.error("Failed to local from backup:", backupData.error);
        return;
      }

      console.log("Local:", localData.data);
      console.log("Backup:", backupData.data);

      const mergeHelper = new MergeHelper(localData.data, backupData.data);
      await mergeHelper.merge();
      await mergeHelper.upsertLocal(this.localStorage);
      await mergeHelper.deleteLocal(this.localStorage);
    } catch (e) {
      console.error("Failed to sync from backup:", e);
    }
  }
}

class MergeHelper {
  private readonly local: DbResume[];
  private readonly backup: DbResume[];
  private readonly merged: Map<number, DbResume>;

  constructor(
    local: DbResume[] | undefined | null,
    backup: DbResume[] | undefined | null
  ) {
    this.local = local || [];
    this.backup = backup || [];
    this.merged = new Map<number, DbResume>();
  }

  async merge() {
    for (const item of this.backup) {
      this.merged.set(item.id, item);
    }

    // …then merge in local-only when also in backup, choosing the newest
    for (const item of this.local) {
      const existing = this.merged.get(item.id);
      if (existing) {
        if (Number(item.updated_at) > Number(existing.updated_at)) {
          this.merged.set(item.id, item);
        }
      }
      // else: local-only → skip
    }
    console.log("Merged:", this.merged);
  }

  async upsertLocal(localStorage: DbService) {
    console.log("Upserting local...");
    for (const item of Array.from(this.merged.values())) {
      const localRest = await localStorage.update(item, false);
      if (localRest.error) {
        await localStorage.create(item);
      }
    }
  }

  async deleteLocal(localStorage: DbService) {
    console.log("Deleting local...");
    for (const item of this.local) {
      if (!this.merged.has(item.id)) {
        await localStorage.delete(item.id);
      }
    }
  }
}
