export abstract class BaseIndexedDB<T extends { id: string }> {
    protected dbName: string;
    protected storeName: string;
    protected version: number;

    private dbPromise: Promise<IDBDatabase>;

    constructor(dbName: string, storeName: string, version: number = 1) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.version = version;
        this.dbPromise = this.openDB();
    }

    protected abstract onUpgrade(
        db: IDBDatabase,
        oldVersion: number,
        newVersion: number | null,
    ): void;

    private openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = () => {
                this.onUpgrade(
                    request.result,
                    request.transaction?.db.version || 0,
                    request.result.version,
                );
            };

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    protected async withStore<R>(
        mode: IDBTransactionMode,
        cb: (store: IDBObjectStore) => IDBRequest<R>,
    ): Promise<R> {
        const db = await this.dbPromise;

        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, mode);
            const store = tx.objectStore(this.storeName);
            const req = cb(store);

            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async get(id: string): Promise<T | null> {
        return this.withStore("readonly", (s) => s.get(id));
    }

    async getAllKeys(): Promise<string[]> {
        return this.withStore("readonly", (s) => s.getAllKeys()) as Promise<
            string[]
        >;
    }

    async put(value: T): Promise<void> {
        await this.withStore("readwrite", (s) => s.put(value));
    }

    async add(value: T): Promise<void> {
        await this.withStore("readwrite", (s) => s.add(value));
    }

    async delete(id: string): Promise<void> {
        await this.withStore("readwrite", (s) => s.delete(id));
    }

    async clear(): Promise<void> {
        await this.withStore("readwrite", (s) => s.clear());
    }
}
