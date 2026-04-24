async function cargar() {
  const res = await fetch('/productos');
  const data = await res.json();

  const contenedor = document.getElementById('lista');
  contenedor.innerHTML = '';

  data.forEach(p => {
    contenedor.innerHTML += `
      <div>
        ${p.nombre} - $${p.precio} - Stock: ${p.stock}
        <button onclick="eliminar(${p.id})">Eliminar</button>
      </div>
    `;
  });
}

async function agregar() {
  const nombre = document.getElementById('nombre').value;
  const precio = document.getElementById('precio').value;
  const stock = document.getElementById('stock').value;
  const categoria = document.getElementById('categoria').value;

  await fetch('/productos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'rol': 'admin'
    },
    body: JSON.stringify({ nombre, precio, stock, categoria })
  });

  cargar();
}

async function eliminar(id) {
  await fetch('/productos/' + id, {
    method: 'DELETE',
    headers: {
      'rol': 'admin'
    }
  });

  cargar();
}

cargar();