/**
 * OrozcoOscar
 * v1.0
 * 22/08/23
 */

class IndexDB {
    /** 
    * Gestor de IndexDB
     * @param nameDB Nombre de la DB.
     * @param ver Version de la DB.
     */
    constructor(nameDB, ver) {
        this.tables = [];
        this.con = null;
        this.db = null;

        this.connectCallback = () => { };

        this.con = indexedDB.open(nameDB, ver);

        this.con.onupgradeneeded = () => {
            this.db = this.con.result;
            this.tables.forEach(table => {
                const options = {
                    keyPath: table.key || 'id',
                    autoIncrement: table.autoIncrement === undefined ? true : table.autoIncrement,
                };
                this.db.createObjectStore(table.tabla, options);
            });
        };

        this.con.onsuccess = () => {
            this.db = this.con.result;
            this.connectCallback(this);
        };
    }

    createTables(tables) {
        this.tables = tables;

        if (this.db) {
            this.tables.forEach(table => {
                const options = {
                    keyPath: table.key || 'id',
                    autoIncrement: table.autoIncrement === undefined ? true : table.autoIncrement,
                };
                this.db.createObjectStore(table.tabla, options);
            });
        }
    }

    connect(callback) {
        this.connectCallback = callback;
        this.connectCallback(this);
    }

    // Rest of the methods remain the same...

    async removeAll(tabla) {
        try {
            const transaction = this.db.transaction([tabla], 'readwrite');
            const store = transaction.objectStore(tabla);
            await store.clear();
            return { status: true };
        } catch (error) {
            return { status: false, error };
        }
    }

    async remove(tabla, id) {
        try {
            const transaction = this.db.transaction([tabla], 'readwrite');
            const store = transaction.objectStore(tabla);
            await store.delete(id);
            return { status: true };
        } catch (error) {
            return { status: false, error };
        }
    }

    async get(tabla, id) {
        const transaction = this.db.transaction([tabla], 'readwrite');
        const store = transaction.objectStore(tabla);

        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = (e) => {
                resolve({ status: true, data: e.target.result });
            };
            request.onerror = (e) => {
                reject({ status: false, error: e });
            };
        });
    }

    async getAll(tabla) {
        const transaction = this.db.transaction([tabla]);
        const store = transaction.objectStore(tabla);

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = (e) => {
                const t = e.target.result;
                const source = e.target.source;
                const r = this.tables.filter(table => table.tabla === source.name);
                if (r.length === 0) {
                    this.tables.push({
                        tabla: source.name,
                        key: source.keyPath,
                        autoIncrement: source.autoIncrement,
                    });
                }
                resolve({ status: true, data: t });
            };
            request.onerror = (e) => {
                reject({ status: false, error: e });
            };
        });
    }

    async set(tabla, data) {
        try {
            const transaction = this.db?.transaction([tabla], 'readwrite');
            const store = transaction?.objectStore(tabla);
            await store?.add(data);
            return { status: true, data };
        } catch (error) {
            return { status: false, error };
        }
    }

    async update(tabla, data) {
        try {
            const transaction = this.db.transaction([tabla], 'readwrite');
            const store = transaction.objectStore(tabla);
            await store.put(data);
            return { status: true };
        } catch (error) {
            return { status: false, error };
        }
    }
}
