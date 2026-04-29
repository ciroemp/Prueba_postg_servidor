// public/js/productos.js

/**
 * FUNCIÓN ASÍNCRONA: cargarProductos
 * Se encarga de conectar con el servidor y gestionar el flujo de datos.
 */
async function cargarProductos() {
  try {
    // Intentamos obtener los datos del servidor local
    const res = await fetch('http://localhost:3000/productos');

    // Si la respuesta no es exitosa (ej. error 404 o 500), lanzamos un error
    if (!res.ok) throw new Error("Error en la respuesta del servidor");

    // Convertimos los datos recibidos a formato JSON
    const data = await res.json();

    // Actualizamos el indicador visual de estado en el HTML
    document.getElementById('estado').innerText = "🟢 Conectado";

    // Enviamos los datos obtenidos a la función encargada de dibujarlos
    mostrarProductos(data);

  } catch (error) {
    /**
     * BLOQUE CATCH: Manejo de errores
     * Si el servidor está apagado o hay un problema de red, se ejecuta este bloque.
     */
    console.error("Error al conectar:", error);

    // Cambiamos el indicador visual para avisar al usuario
    document.getElementById('estado').innerText = "🔴 Sin conexión";

    // Definimos un objeto de "respaldo" para que el usuario vea algo en pantalla
    const fallback = [
      { nombre: "Servidor no disponible", precio: 0, stock: 0 }
    ];

    // Mostramos el mensaje de respaldo en lugar de los productos reales
    mostrarProductos(fallback);
  }
}

/**
 * FUNCIÓN: mostrarProductos
 * Recibe un arreglo (array) de objetos y genera el HTML dinámicamente.
 * @param {Array} productos - Lista de objetos con nombre, precio y stock.
 */
function mostrarProductos(productos) {
  // Referenciamos el contenedor donde queremos insertar los productos
  const contenedor = document.getElementById('productos');
  
  // Limpiamos cualquier contenido previo para evitar duplicidad
  contenedor.innerHTML = '';

  // Iteramos sobre cada producto del arreglo
  productos.forEach(p => {
    // Insertamos un nuevo bloque HTML por cada producto usando Template Literals
    contenedor.innerHTML += `
      <div class="producto-card" style="border: 1px solid #ccc; padding: 10px; margin: 10px; border-radius: 5px;">
        <h3>${p.nombre}</h3>
        <p>Precio: $${p.precio}</p>
        <p>Stock: ${p.stock}</p>
      </div>
    `;
  });
}

/**
 * INICIO DEL SCRIPT
 * Llamamos a la función principal para que se ejecute en cuanto el navegador cargue el JS.
 */
cargarProductos();