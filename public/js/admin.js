let productosAdmin = [];

async function cargar() {
  try {
    const res = await fetch('/productos');
    const data = await res.json();
    renderLista(data);
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

function renderLista(productos) {
  const contenedor = document.getElementById('lista');
  if (!contenedor) return;
  
  contenedor.innerHTML = '';

  productos.forEach(p => {
    contenedor.innerHTML += `
      <div class="item-admin" style="display: flex; align-items: center; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; background: white; margin-bottom: 5px; border-radius: 8px;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <img src="${p.imagen_url}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;">
          
          <div>
            <strong style="color: #2D2D2D;">${p.nombre}</strong> <br>
            <small style="color: #666;">${p.categoria} | $${parseFloat(p.precio).toFixed(2)} | Stock: ${p.stock}</small>
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <button onclick="prepararEdicion(${p.id})" style="background: #F7E7CE; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">Editar</button>
          <button onclick="eliminar(${p.id})" style="background: #ff4d4d; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">Borrar</button>
        </div>
      </div>
    `;
  });
}

async function agregar() {
  const nombre = document.getElementById('nombre').value;
  const precio = document.getElementById('precio').value;
  const stock = document.getElementById('stock').value;
  const categoria = document.getElementById('categoria').value;
  const imagen = document.getElementById('imagen').value;

  if (!nombre || !precio || !stock) {
    alert("Nombre, precio y stock son obligatorios");
    return;
  }

  const res = await fetch('/productos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'rol': 'admin' },
    body: JSON.stringify({ nombre, precio, stock, categoria, imagen })
  });

  if (res.ok) {
    // Limpiar formulario
    document.querySelectorAll('input').forEach(input => input.value = '');
    cargar(); // Recargar la lista inmediatamente
  }
}

async function eliminar(id) {
  if (!confirm("¿Eliminar este artículo?")) return;

  await fetch('/productos/' + id, {
    method: 'DELETE',
    headers: { 'rol': 'admin' }
  });
  cargar();
}

// Iniciar carga al entrar
cargar();

async function prepararEdicion(id) {
  const p = productosAdmin.find(x => x.id === id);
  const nuevoNombre = prompt("Nuevo nombre:", p.nombre);
  const nuevoPrecio = prompt("Nuevo precio:", p.precio);
  const nuevoStock = prompt("Nuevo stock:", p.stock);

  if (nuevoNombre && nuevoPrecio && nuevoStock) {
    await fetch(`/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'rol': 'admin' },
      body: JSON.stringify({
        nombre: nuevoNombre,
        precio: parseFloat(nuevoPrecio),
        stock: parseInt(nuevoStock),
        categoria: p.categoria
      })
    });
    cargar();
  }
}

cargar();