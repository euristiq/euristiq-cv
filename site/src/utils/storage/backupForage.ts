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
  private readonly syncIntervalMs: number;
  private syncTimerId: ReturnType<typeof setInterval> | null = null;

  constructor(
    localStorage: DbService,
    backupStorage: DbService,
    syncIntervalMs: number = 20e3
  ) {
    this.localStorage = localStorage;
    this.backupStorage = backupStorage;
    this.syncIntervalMs = syncIntervalMs;
    if (typeof window !== "undefined") {
      this.syncTimerId = setInterval(() => {
        this.sync().catch((err) => {
          console.error("Background sync failed:", err);
        });
      }, this.syncIntervalMs);
    }
  }

  public destroy() {
    if (this.syncTimerId !== null) {
      clearInterval(this.syncTimerId);
      this.syncTimerId = null;
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
    await this.backupStorage.update(data, newUpdateTime);

    return result;
  }

  private async sync() {
    try {
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

      const local = localData.data || [];
      const backup = backupData.data || [];

      const map = new Map<number, DbResume>();
      for (const item of backup) {
        map.set(item.id, item);
      }

      // …then merge in local-only when also in backup, choosing the newest
      for (const item of local) {
        const existing = map.get(item.id);
        if (existing) {
          if (Number(item.updated_at) > Number(existing.updated_at)) {
            map.set(item.id, item);
          }
        }
        // else: local-only → skip
      }

      Array.from(map.values()).forEach((item) => {
        const localRest = this.localStorage.update(item, false);
        if (localRest.error) {
          this.localStorage.create(item);
        }
      });
      local.forEach((item) => {
        if (!map.has(item.id)) {
          this.localStorage.delete(item.id);
        }
      });
    } catch (e) {
      console.error("Failed to sync from backup:", e);
    }
  }
}
