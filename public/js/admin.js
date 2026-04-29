// public/js/admin.js

// Variable global para almacenar el inventario y poder editarlo
let productosAdmin = [];

async function cargar() {
  try {
    const res = await fetch('/productos');
    const data = await res.json();
    
    // Guardamos los datos en la variable global
    productosAdmin = data; 
    
    // Llamamos al renderizado y le pasamos los datos
    renderLista(productosAdmin);
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

function renderLista(productos) {
  const contenedor = document.getElementById('lista');
  if (!contenedor) return;
  
  contenedor.innerHTML = '';

  // Filtramos si el usuario seleccionó una categoría específica
  const filtroCategoria = document.getElementById('filtroCategoria') ? document.getElementById('filtroCategoria').value : 'todos';
  
  let productosA_Mostrar = productos;
  if (filtroCategoria !== 'todos') {
    productosA_Mostrar = productos.filter(p => p.categoria === filtroCategoria);
  }

  productosA_Mostrar.forEach(p => {
    contenedor.innerHTML += `
      <div class="item-admin" style="display: flex; align-items: center; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; background: white; margin-bottom: 5px; border-radius: 8px;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <img src="${p.imagen_url}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;" onerror="this.onerror=null; this.src='public/img/placeholder.jpg';">
          
          <div>
            <strong style="color: #2D2D2D;">${p.nombre}</strong> <br>
            <small style="color: #666;">${p.categoria || 'Sin Categoría'} | $${parseFloat(p.precio).toFixed(2)} | Stock: ${p.stock}</small>
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <button onclick="prepararEdicion(${p.id})" style="background: #E5D0B1; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; color: #333; font-weight: bold;">Editar</button>
          <button onclick="eliminar(${p.id})" style="background: #ff4d4d; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-weight: bold;">Borrar</button>
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

  try {
    const res = await fetch('/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'rol': 'admin' },
      body: JSON.stringify({ nombre, precio, stock, categoria, imagen })
    });

    if (res.ok) {
      // Limpiar formulario completo
      document.getElementById('nombre').value = '';
      document.getElementById('precio').value = '';
      document.getElementById('stock').value = '';
      document.getElementById('categoria').value = '';
      document.getElementById('imagen').value = '';
      
      cargar(); // Recargar la lista
    } else {
      alert("Error al guardar en el servidor");
    }
  } catch(e) {
      console.error(e);
      alert("No se pudo conectar al servidor");
  }
}

async function eliminar(id) {
  if (!confirm("¿Eliminar este artículo permanentemente?")) return;

  try {
    const res = await fetch('/productos/' + id, {
      method: 'DELETE',
      headers: { 'rol': 'admin' }
    });
    
    if(res.ok) {
        cargar();
    }
  } catch(e) {
      console.error(e);
  }
}

async function prepararEdicion(id) {
  // Ahora la variable productosAdmin sí tiene datos, así que p existirá
  const p = productosAdmin.find(x => x.id === id);
  
  if(!p) {
      alert("No se encontró el producto para editar");
      return;
  }

  const nuevoNombre = prompt("Nuevo nombre:", p.nombre);
  if (nuevoNombre === null) return; // Canceló
  
  const nuevoPrecio = prompt("Nuevo precio:", p.precio);
  if (nuevoPrecio === null) return; 

  const nuevoStock = prompt("Nuevo stock:", p.stock);
  if (nuevoStock === null) return;

  if (nuevoNombre && nuevoPrecio && nuevoStock) {
    try {
      const res = await fetch(`/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'rol': 'admin' },
        body: JSON.stringify({
          nombre: nuevoNombre,
          precio: parseFloat(nuevoPrecio),
          stock: parseInt(nuevoStock),
          categoria: p.categoria // Mantiene la categoría original
        })
      });
      
      if(res.ok){
          cargar();
      }
    } catch (e) {
        console.error(e);
    }
  }
}

// Iniciar carga al entrar a la página (solo llamarlo una vez al final)
cargar();