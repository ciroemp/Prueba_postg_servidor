// public/js/productos.js

async function cargarProductos() {
  try {
    const res = await fetch('http://localhost:3000/productos');

    if (!res.ok) throw new Error();

    const data = await res.json();

    document.getElementById('estado').innerText = "🟢 Conectado";
    mostrarProductos(data);

  } catch (error) {
    document.getElementById('estado').innerText = "🔴 Sin conexión";

    const fallback = [
      { nombre: "Sin conexión", precio: 0, stock: 0 }
    ];

    mostrarProductos(fallback);
  }
}

function mostrarProductos(productos) {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';

  productos.forEach(p => {
    contenedor.innerHTML += `
      <div>
        <h3>${p.nombre}</h3>
        <p>Precio: $${p.precio}</p>
        <p>Stock: ${p.stock}</p>
      </div>
    `;
  });
}

cargarProductos();