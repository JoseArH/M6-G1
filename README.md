# AE2 – CRUD de Productos

Ya que hemos realizado el CRUD de usuarios vamos a continuar armando nuestra tienda ecommerce. Ahora procederemos a culminar el CRUD de Productos y Categorías.
Desafío

En este desafío, deberás implementar un sistema de eCommerce organizado en controladores, servicios y rutas, utilizando UUID (identificadores únicos universales) y aplicando buenas prácticas de arquitectura en Node.js. Además, las rutas del sistema deberán devolver vistas utilizando el motor de plantillas Pug. Asimismo, deberás capturar los posibles errores durante el proceso y realizar las siguientes operaciones:

- Agregar un nuevo producto: Permitir que el sistema añada nuevos productos a la base de datos, con su respectiva categoría asignada.
- Consultar los productos registrados: Mostrar el listado completo de productos que se encuentran en la base de datos en una vista renderizada con Pug.
- Consultar productos por ID o categoría: Permitir buscar productos de manera específica, ya sea por su identificador único (ID) o por la categoría a la que pertenecen, devolviendo los resultados en una vista Pug.
- Actualizar la información de un producto: Actualizar la información de productos existentes, como su nombre, precio, categoría, etc., con un formulario renderizado en Pug.
- Eliminar un producto del sistema: Eliminar un producto por su ID de la base de datos, mostrando una confirmación en la vista.

## Consideraciones Generales

1. Identificadores UUID: Implementa la generación automática de UUID para identificar de manera única a los usuarios en el sistema, en lugar de usar números enteros o auto-incrementables.

2. Estructura del Proyecto: Organiza el código siguiendo una arquitectura modular, dividiendo las responsabilidades en las siguientes carpetas:
   - Controladores (controllers): Encargados de manejar las peticiones y respuestas HTTP.
   - Servicios (services): Contendrán la lógica del negocio, gestionando las interacciones con la base de datos.
   - Modelos (models): Definirán las estructuras de datos y las interacciones con la base de datos.
   - Rutas (routes): Encargadas de mapear las peticiones a los controladores correspondientes y devolver vistas utilizando Pug.

3. Manejo de Errores: Implementa mecanismos para capturar errores en todas las operaciones (agregar, consultar, actualizar y eliminar productos). Si ocurre algún error durante la ejecución o la conexión a la base de datos, el sistema deberá:
   - Mostrar un mensaje de error claro y comprensible.
   - Manejar adecuadamente las excepciones y evitar que el servidor se bloquee.

4. Vistas con Pug: Todas las rutas deben devolver vistas utilizando Pug. Por ejemplo:
   - Para mostrar el listado de productos, renderiza una plantilla Pug que muestre los detalles de cada producto en una tabla.
   - Los formularios de agregar y actualizar productos también deben ser renderizados como vistas Pug.

5. Retorno de Datos: Además de las vistas generadas con Pug, las consultas que soliciten datos deben retornar la información en formato de arreglo de objetos JSON en caso de peticiones API, estructurado para su posterior procesamiento o visualización en el frontend. Esto lo usaremos más adelante.
