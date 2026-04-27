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
  // CAPTURAMOS EL NOMBRE DE LA IMAGEN
  const imagen = document.getElementById('imagen').value; 

  if (!nombre || !precio || !stock) {
    alert("Completa al menos nombre, precio y stock.");
    return;
  }

  await fetch('/productos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'rol': 'admin'
    },
    // ENVIAMOS LA IMAGEN EN EL PAQUETE DE DATOS
    body: JSON.stringify({ nombre, precio, stock, categoria, imagen }) 
  });

  // Limpiamos los campos
  document.getElementById('nombre').value = '';
  document.getElementById('precio').value = '';
  document.getElementById('stock').value = '';
  document.getElementById('categoria').value = '';
  document.getElementById('imagen').value = ''; // Limpiamos la imagen también

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