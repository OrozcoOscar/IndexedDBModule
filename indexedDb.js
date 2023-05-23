/**
 * OrozcoOscar
 * v1.0
 * 19/09/22
 */
/**
/**
     * Gestor de IndexDB
     * @param nameDB Nombre de la DB.
     * @param ver Version de la DB.
     */
function DB(nameDB,ver){
    this.con
    this.db
    return {
        tables:[],
        createTables(tables){
            this.con=indexedDB.open(nameDB,ver)
            this.con.onupgradeneeded=()=>{
                this.db = this.con.result;
                this.tables=tables
                tables.map(t=>{
                    this.db.createObjectStore(t?.tabla, { keyPath: t?.key|| "id",autoIncrement:(t?.autoIncrement==undefined)?true:t?.autoIncrement});
                })
            }
        },
        removeAll(tabla){
            const transaction = this.db.transaction([tabla], 'readwrite');
            const store = transaction.objectStore(tabla);
            try{
                store.clear()
                return true
            }
            catch(e){return false}
            
        },
        remove(tabla,id){
            const transaction = this.db.transaction([tabla], 'readwrite');
            const store = transaction.objectStore(tabla);
            try{
                store.delete(id)
                return true
            }
            catch(e){return false}
            
        },
        get(tabla,id,f=()=>{}){
            const transaction = this.db.transaction([tabla], 'readwrite');
            const store = transaction.objectStore(tabla);
            store.get(id).onsuccess=async (e)=>{
                let t=await e.target.result
                f(t)
            }
        },
        getAll(tabla,f=()=>{}){
            (this.db.transaction([tabla]).objectStore(tabla).getAll()).onsuccess=async (e)=>{
                let t=await e.target.result
                let source=await e.target.source
                let r=this.tables.filter(t=>t.tabla==source.name)
                if(r.length==0)this.tables.push({
                    tabla:source.name,
                    key:source.keyPath,
                    autoIncrement:source.autoIncrement})

                f(t)
            }
        },
        set(tabla,data){
                const transaction = this.db.transaction([tabla], 'readwrite');
                const store = transaction.objectStore(tabla);
                try{
                    store.add(data)
                    return true
                }
                catch(e){return false}
        },
        update(tabla,data){
            const transaction = this.db.transaction([tabla], 'readwrite');
            const store = transaction.objectStore(tabla);
            try{
                store.put(data)
                return true
            }
            catch(e){return false}
        },
        connect(f=()=>{}){
            this.con.onsuccess=()=>{
                this.db = this.con.result;
                f()
            }
        } 
    }
}