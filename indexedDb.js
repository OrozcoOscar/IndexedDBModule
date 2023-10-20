/**
 * OrozcoOscar
 * v2.0
 * 20/10/23
 */ 

class IndexDB {
    /** 
    * Gestor de IndexDB
     * @param nameDB Nombre de la DB.
     * @param ver Version de la DB.
     */
    constructor(nameDB, ver) {
        this.tables = [];
        this.db = null;
        this.nameDB = nameDB;
        this.ver = 1;


        this.openDatabase(nameDB, ver)
            .then(db => {
                this.db = db;
            })
            .catch(error => {
                console.error('Error al abrir la base de datos:', error);
            });
    }
    static databases(){
        return indexedDB.databases()
    }
    openDatabase(nameDB, ver) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(nameDB, ver);

            request.onupgradeneeded = () => {
                const db = request.result;
                this.tables.forEach(table => {
                    const options = {
                        keyPath: table.key || 'id',
                        autoIncrement: table.autoIncrement === undefined ? true : table.autoIncrement,
                    };
                    db.createObjectStore(table.tabla, options);
                });
            };

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async createTables(tables) {
        this.tables = tables;

        if (this.db) {
            this.tables?.forEach(table => {
                const options = {
                    keyPath: table.key || 'id',
                    autoIncrement: table.autoIncrement === undefined ? true : table.autoIncrement,
                };
                this.db?.createObjectStore(table.tabla, options);
            });
        }
    }

    async connect(callback) {
        await this.openDatabase(this.nameDB, this.ver)
        return new Promise((resolve, reject) => {
            resolve(callback())
        })
    }

    async removeAll(tabla) {
        await this.openDatabase(this.nameDB, this.ver)
        if (!this.db) {
            return new Promise((resolve, reject) => {
                resolve({ status: false, error: "NO SE ENCONTRÓ DB" });
            });
        }
        if (!this.db) {
            return new Promise((resolve, reject) => {
                resolve({ status: false, error: "NO SE ENCONTRÓ DB" });
            });
        }
        try {
            const transaction = this.db?.transaction([tabla], 'readwrite');
            const store = transaction?.objectStore(tabla);
            return new Promise(async (resolve, reject) => {
                await store.clear()
                resolve({ status: true, message: 'TABLA ELIMINADA' })
            });
        } catch (error) {
            return { status: false, error };
        }
    }

    async remove(tabla, id) {
        await this.openDatabase(this.nameDB, this.ver)
        if (!this.db) {
            return new Promise((resolve, reject) => {
                resolve({ status: false, error: "NO SE ENCONTRÓ DB" });
            });
        }
        try {
            const transaction = this.db?.transaction([tabla], 'readwrite');
            const store = transaction?.objectStore(tabla);
            return new Promise((resolve, reject) => {
                const request = store.get(id);

                request.onsuccess = async (e) => {
                    if (e.target.result) {
                        await store?.delete(id);
                        resolve({ status: true, data: e.target.result, message: 'Elemento eliminado' });
                    } else {
                        resolve({ status: false, data: null, message: 'El elemento NO existe' });
                    }
                };
                request.onerror = (e) => {
                    reject({ status: false, error: e });
                };
            });
        } catch (error) {
            return { status: false, error };
        }
    }

    async get(tabla, id) {
        await this.openDatabase(this.nameDB, this.ver)
        if (!this.db) {
            return new Promise((resolve, reject) => {
                resolve({ status: false, error: "NO SE ENCONTRÓ DB" });
            });
        }
        const transaction = this.db?.transaction([tabla], 'readwrite');
        const store = transaction?.objectStore(tabla);

        return new Promise((resolve, reject) => {
            const request = store.get(id);

            request.onsuccess = (e) => {
                if (e.target.result) {
                    resolve({ status: true, data: e.target.result });
                } else {
                    resolve({ status: false, data: null });
                }
            };
            request.onerror = (e) => {
                reject({ status: false, error: e });
            };
        });
    }


    async getAll(tabla) {
        await this.openDatabase(this.nameDB, this.ver)
        if (!this.db) {
            return new Promise((resolve, reject) => {
                resolve({ status: false, error: "NO SE ENCONTRÓ DB" });
            });
        }
        const transaction = this.db?.transaction([tabla]);
        const store = transaction?.objectStore(tabla);

        return new Promise((resolve, reject) => {
            const request = store?.getAll();
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
        await this.openDatabase(this.nameDB, this.ver)
        if (!this.db) {
            return new Promise((resolve, reject) => {
                resolve({ status: false, error: "NO SE ENCONTRÓ DB" });
            });
        }
        try {
            const transaction = this.db?.transaction([tabla], 'readwrite');
            const store = transaction?.objectStore(tabla);
            return new Promise((resolve, reject) => {
                const request = store.get(data._id);

                request.onsuccess = async (e) => {
                    if (e.target.result) {
                        resolve({ status: false, data: e.target.result, message: 'El elemento ya existe' });
                    } else {
                        let result = await store?.add(data);
                        resolve({ status: true, data, message: 'Elemento agregado' });
                    }
                };
                request.onerror = (e) => {
                    reject({ status: false, error: e });
                };
            });
        } catch (error) {
            return { status: false, error };
        }
    }

    async update(tabla, data) {
        await this.openDatabase(this.nameDB, this.ver)
        if (!this.db) {
            return new Promise((resolve, reject) => {
                resolve({ status: false, error: "NO SE ENCONTRÓ DB" });
            });
        }
        try {
            const transaction = this.db?.transaction([tabla], 'readwrite');
            const store = transaction?.objectStore(tabla);

            return new Promise((resolve, reject) => {
                const request = store.get(data._id);

                request.onsuccess = async (e) => {
                    if (e.target.result) {
                        let result = await store?.put(data);
                        resolve({ status: true, data, message: 'Elemento actualizado' });
                    } else {
                        resolve({ status: false, data: null, message: 'El elemento NO existe' });
                    }
                };
                request.onerror = (e) => {
                    reject({ status: false, error: e });
                };
            });
        } catch (error) {
            return { status: false, error };
        }
    }

    async getSongByName(tabla, name) {
        await this.openDatabase(this.nameDB, this.ver);
      
        if (!this.db) {
          return new Promise((resolve, reject) => {
            resolve({ status: false, error: "NO SE ENCONTRÓ DB" });
          });
        }
      
        return new Promise((resolve, reject) => {
          const transaction = this.db?.transaction([tabla], "readonly");
          const store = transaction?.objectStore(tabla);
      
          const request = store.openCursor();
      
          const results = [];
      
          // Convierte el nombre de búsqueda a minúsculas
          const searchNameLowercase = name.toLowerCase();
      
          request.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
              const song = cursor.value;
              // Convierte el nombre de la canción a minúsculas antes de comparar
              if (song.name.toLowerCase().includes(searchNameLowercase)) {
                results.push(song);
              }
              cursor.continue();
            } else {
              resolve({ status: true, data: results });
            }
          };
      
          request.onerror = (e) => {
            reject({ status: false, error: e });
          };
        });
      }
      


}
