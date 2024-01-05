# Gestor de IndexedDB

El Gestor de IndexedDB es un módulo que facilita la gestión de la base de datos IndexedDB en aplicaciones JavaScript.

## Uso

### Instalación
#### NPM
```
npm i indexed-db-module
```
#### CDN estable
https://rawcdn.githack.com/OrozcoOscar/IndexedDBModule/d54fb4785e5c9b2c5fba66b8820fe84284aa40f9/indexedDb.js
#### CDN desarrollo
https://raw.githack.com/OrozcoOscar/IndexedDBModule/main/indexedDb.js

```
<script src="https://raw.githack.com/OrozcoOscar/IndexedDBModule/main/indexedDb.js"></script>
```
## Uso

### Crear una instancia de la base de datos

```javascript
const databaseName = 'miBaseDeDatos';
const databaseVersion = 1;
const miBaseDeDatos = new IndexDB(databaseName, databaseVersion);
```

### Crear tablas en la base de datos

```javascript
const tables = [
    { tabla: 'usuarios', key: 'id' },
    { tabla: 'productos', key: 'codigo' }
];

miBaseDeDatos.createTables(tables);
```

### Agregar un elemento a una tabla

```javascript
const usuario = { id: 1, nombre: 'Usuario Ejemplo' };
miBaseDeDatos.set('usuarios', usuario)
    .then(result => {
        console.log(result.message); // Elemento agregado
    })
    .catch(error => {
        console.error(error);
    });
```

### Obtener un elemento por su clave primaria

```javascript
miBaseDeDatos.get('usuarios', 1)
    .then(result => {
        if (result.status) {
            console.log(result.data); // { id: 1, nombre: 'Usuario Ejemplo' }
        } else {
            console.log('Usuario no encontrado');
        }
    })
    .catch(error => {
        console.error(error);
    });
```

### Obtener todos los elementos de una tabla

```javascript
miBaseDeDatos.getAll('usuarios')
    .then(result => {
        if (result.status) {
            console.log(result.data); // Array de objetos de usuarios
        } else {
            console.log('Error al obtener usuarios');
        }
    })
    .catch(error => {
        console.error(error);
    });
```

### Actualizar un elemento en una tabla

```javascript
const usuarioActualizado = { id: 1, nombre: 'Nuevo Nombre de Usuario' };
miBaseDeDatos.update('usuarios', usuarioActualizado)
    .then(result => {
        if (result.status) {
            console.log(result.message); // Elemento actualizado
        } else {
            console.log('Usuario no encontrado');
        }
    })
    .catch(error => {
        console.error(error);
    });
```

### Eliminar un elemento de una tabla

```javascript
miBaseDeDatos.remove('usuarios', 1)
    .then(result => {
        if (result.status) {
            console.log(result.message); // Elemento eliminado
        } else {
            console.log('Usuario no encontrado');
        }
    })
    .catch(error => {
        console.error(error);
    });
```

### Buscar canciones por nombre

```javascript
miBaseDeDatos.getSongByName('canciones', 'cancion')
    .then(result => {
        if (result.status) {
            console.log(result.data); // Array de canciones que coinciden con el nombre de búsqueda
        } else {
            console.log('Error al buscar canciones');
        }
    })
    .catch(error => {
        console.error(error);
    });
```

## Contribución

Si deseas contribuir a este proyecto, siéntete libre

 de enviar pull requests o abrir issues en el repositorio.

## Licencia

Este módulo se distribuye bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.
