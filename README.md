# Gestor de IndexDB

El Gestor de IndexDB es un módulo que facilita la gestión de la base de datos IndexDB en aplicaciones JavaScript.

## Uso

### Instalación

No se requiere ninguna instalación especial para utilizar este módulo. Puedes simplemente copiar y pegar el código en tu proyecto.

### Creación de una instancia

Para comenzar a utilizar el Gestor de IndexDB, crea una instancia del objeto `DB` pasando el nombre de la base de datos y la versión como parámetros:

```javascript
const gestorDB = new DB('nombreDB', 1);
```

### Creación de tablas

Puedes crear tablas en la base de datos utilizando el método `createTables`. Pasa un array de objetos que representen las tablas que deseas crear. Cada objeto debe contener las propiedades `tabla` (nombre de la tabla), `key` (clave primaria) y opcionalmente `autoIncrement` (valor booleano para indicar si la clave primaria debe ser autoincremental). Por ejemplo:

```javascript
const tablas = [
  { tabla: 'tabla1', key: 'id', autoIncrement: true },
  { tabla: 'tabla2', key: 'id' },
];

gestorDB.createTables(tablas);
```

### Operaciones en la base de datos

El Gestor de IndexDB proporciona métodos para realizar operaciones comunes en la base de datos, como insertar, actualizar, eliminar y consultar registros.

- `set(tabla, data)`: Inserta un nuevo registro en la tabla especificada.
- `update(tabla, data)`: Actualiza un registro existente en la tabla especificada.
- `remove(tabla, id)`: Elimina un registro de la tabla especificada por su ID.
- `removeAll(tabla)`: Elimina todos los registros de la tabla especificada.
- `get(tabla, id, callback)`: Obtiene un registro de la tabla especificada por su ID y ejecuta el callback con el resultado.
- `getAll(tabla, callback)`: Obtiene todos los registros de la tabla especificada y ejecuta el callback con el resultado.

Aquí hay un ejemplo de cómo usar algunos de estos métodos:

```javascript
// Insertar un nuevo registro
const nuevoRegistro = { id: 1, nombre: 'Ejemplo' };
gestorDB.set('tabla1', nuevoRegistro);

// Actualizar un registro existente
const registroActualizado = { id: 1, nombre: 'Nuevo Ejemplo' };
gestorDB.update('tabla1', registroActualizado);

// Eliminar un registro
gestorDB.remove('tabla1', 1);

// Obtener un registro por su ID
gestorDB.get('tabla1', 1, (registro) => {
  console.log(registro);
});

// Obtener todos los registros de una tabla
gestorDB.getAll('tabla1', (registros) => {
  console.log(registros);
});
```

### Conexión a la base de datos

Para establecer la conexión con la base de datos, utiliza el método `connect`. Puedes proporcionar una función de callback opcional que se ejecutará una vez que se haya establecido la conexión:

```javascript
gestorDB.connect(() => {
  console.log('Conexión exitosa');
  //   gestorDB.get("productos",1,(e)=>console.log(e))
  //   gestorDB.remove("productos",1)
  //   gestorDB.update("productos",{id:1,name:"arroz",price:1000})
  //   gestorDB.removeAll("productos")
});
```

## Contribución

Si deseas contribuir a este proyecto, siéntete libre

 de enviar pull requests o abrir issues en el repositorio.

## Licencia

Este módulo se distribuye bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.
