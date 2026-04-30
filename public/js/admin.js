// public/js/admin.js

let productosAdmin = [];
// Variable global para almacenar las categorías extraídas del inventario
window.categoriasPermitidas = []; 


// --- PORTERO DE SEGURIDAD ---
const token = localStorage.getItem('tokenAdmin');

if (!token) {
  // Si no hay token guardado, lo redirigimos a la página de login
  window.location.href = '/public/login.html';
}

// Opcional: Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('tokenAdmin');
  window.location.href = '/public/login.html';
}
// ----------------------------

/**
 * FUNCIÓN CARGAR
 */
async function cargar() {
  try {
    const res = await fetch('/productos');
    const data = await res.json();

    data.sort((a, b) => {
      const tieneFotoA = a.imagen_url && a.imagen_url !== 'public/img/placeholder.jpg';
      const tieneFotoB = b.imagen_url && b.imagen_url !== 'public/img/placeholder.jpg';
      if (tieneFotoA && !tieneFotoB) return -1; 
      if (!tieneFotoA && tieneFotoB) return 1; 
      return 0; 
    });

    productosAdmin = data; 
    
    // Al cargar los productos, actualizamos las listas de categorías dinámicamente
    actualizarListasDeCategorias();
    
    renderLista(productosAdmin);
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

/**
 * NUEVA FUNCIÓN: ACTUALIZAR LISTAS DE CATEGORÍAS
 * Lee el inventario, saca categorías únicas y rellena los HTML <select>
 */
function actualizarListasDeCategorias() {
  // 1. Extraemos nombres únicos que no estén vacíos
  let categoriasUnicas = [...new Set(productosAdmin.map(p => p.categoria))];
  categoriasUnicas = categoriasUnicas.filter(c => c && c.trim() !== "");

  // Si la base de datos está vacía, ponemos una de ejemplo
  if (categoriasUnicas.length === 0) categoriasUnicas = ["General"];
  
  window.categoriasPermitidas = categoriasUnicas;

  // 2. Rellenamos el Filtro HTML
  const filtro = document.getElementById('filtroCategoria');
  if (filtro) {
    const valorPrevio = filtro.value;
    filtro.innerHTML = '<option value="todos">Todos los productos</option>';
    categoriasUnicas.forEach(c => filtro.innerHTML += `<option value="${c}">${c}</option>`);
    filtro.value = valorPrevio || 'todos';
  }

  // 3. Rellenamos el selector de Crear Producto HTML
  const selectCrear = document.getElementById('categoria');
  if (selectCrear) {
    const valorPrevio = selectCrear.value;
    selectCrear.innerHTML = '<option value="" disabled selected>Selecciona una categoría...</option>';
    categoriasUnicas.forEach(c => selectCrear.innerHTML += `<option value="${c}">${c}</option>`);
    // Agregamos la opción mágica para crear nuevas
    selectCrear.innerHTML += '<option value="NUEVA_CAT">✨ + Crear nueva categoría...</option>';
    selectCrear.value = valorPrevio || '';
  }
}

/**
 * ESCUCHADOR DE EVENTOS PARA CREAR NUEVA CATEGORÍA
 * Detecta cuando el usuario elige "✨ + Crear nueva categoría..." en el formulario
 */
document.getElementById('categoria')?.addEventListener('change', function(e) {
  const inputNueva = document.getElementById('nueva-categoria-input');
  
  if (e.target.value === 'NUEVA_CAT') {
    // Si selecciona "crear nueva", mostramos el input para que escriba
    inputNueva.style.display = 'block';
    inputNueva.focus(); // Ponemos el cursor ahí automáticamente
  } else {
    // Si selecciona una existente, ocultamos el input y lo vaciamos
    inputNueva.style.display = 'none';
    inputNueva.value = '';
  }
});

/**
 * NUEVA FUNCIÓN: GESTIONAR (RENOMBRAR) CATEGORÍAS MASIVAMENTE
 */
async function gestionarCategorias() {
  const disponibles = window.categoriasPermitidas.join("\n- ");
  const vieja = prompt(`Categorías actuales en tu sistema:\n- ${disponibles}\n\nEscribe el nombre EXACTO de la categoría que deseas editar:`);
  
  if (!vieja) return; // Canceló
  
  const nueva = prompt(`Escribe el nuevo nombre para reemplazar "${vieja}":`);
  if (!nueva || nueva.trim() === "") return;

  try {
    const res = await fetch(`http://localhost:3000/categorias/${encodeURIComponent(vieja.trim())}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'rol': 'admin' },
      body: JSON.stringify({ nueva: nueva.trim() })
    });
    
    if (res.ok) {
      alert(`✅ ¡Éxito! Todos los productos de "${vieja}" ahora son "${nueva}".`);
      cargar(); // Recargamos todo para ver los cambios
    } else {
      alert("❌ Hubo un error en el servidor al intentar renombrar.");
    }
  } catch(e) {
    console.error(e);
    alert("📡 No se pudo conectar con el servidor.");
  }
}

/**
 * FUNCIÓN RENDERLISTA
 */
function renderLista(productos) {
  const contenedor = document.getElementById('lista');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  const filtroCategoria = document.getElementById('filtroCategoria') ? document.getElementById('filtroCategoria').value : 'todos';
  let productosA_Mostrar = productos;
  
  if (filtroCategoria !== 'todos') {
    productosA_Mostrar = productos.filter(p => p.categoria === filtroCategoria);
  }

  productosA_Mostrar.forEach(p => {
    contenedor.innerHTML += `
      <div class="item-admin" style="display: flex; align-items: center; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; background: white; margin-bottom: 5px; border-radius: 8px;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <img src="${p.imagen_url}?v=${new Date().getTime()}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;" onerror="this.onerror=null; this.src='public/img/placeholder.jpg';">
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

/**
 * FUNCIÓN AGREGAR
 */
async function agregar() {
  const nombre = document.getElementById('nombre').value;
  const precio = document.getElementById('precio').value;
  const stock = document.getElementById('stock').value;
  const imagen = document.getElementById('imagen').value;
  
  let categoria = document.getElementById('categoria').value;
  
  // LOGICA CLAVE: Si eligió crear una nueva, tomamos el valor del input de texto
  if (categoria === 'NUEVA_CAT') {
    categoria = document.getElementById('nueva-categoria-input').value.trim();
  }

  if (!nombre || !precio || !stock || !categoria) {
    alert("Nombre, precio, stock y categoría son obligatorios");
    return;
  }

  try {
    const res = await fetch('/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'rol': 'admin' },
      // Enviamos el paquete al backend. Si es nueva, se guardará en la BD vinculada a este producto
      body: JSON.stringify({ nombre, precio, stock, categoria, imagen })
    });

    if (res.ok) {
      // Limpieza general
      document.getElementById('nombre').value = '';
      document.getElementById('precio').value = '';
      document.getElementById('stock').value = '';
      document.getElementById('categoria').value = '';
      document.getElementById('imagen').value = '';
      
      // Ocultamos el input de nueva categoría
      const inputNueva = document.getElementById('nueva-categoria-input');
      if (inputNueva) {
        inputNueva.style.display = 'none';
        inputNueva.value = '';
      }
      
      cargar(); // Al recargar, la base de datos detectará la nueva categoría y la pondrá en las listas
    } else {
      alert("Error al guardar en el servidor");
    }
  } catch(e) {
      console.error(e);
      alert("No se pudo conectar al servidor");
  }
}

/**
 * FUNCIÓN ELIMINAR
 */
async function eliminar(id) {
  if (!confirm("¿Eliminar este artículo permanentemente?")) return;
  try {
    const res = await fetch('/productos/' + id, {
      method: 'DELETE',
      headers: { 'rol': 'admin' }
    });
    if(res.ok) cargar(); 
  } catch(e) {
      console.error(e);
  }
}

/**
 * FUNCIÓN PREPARAR EDICIÓN (Actualizada con select dinámico)
 */
function prepararEdicion(id) {
  const p = productosAdmin.find(x => x.id === id);
  if(!p) return;

  cerrarModalEdicion();

  const modal = document.createElement('div');
  modal.id = 'modal-edicion';
  modal.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000;";

  // Generamos las opciones del select utilizando nuestras categorías permitidas
  let opcionesHTML = '';
  window.categoriasPermitidas.forEach(cat => {
    const seleccionada = (p.categoria === cat) ? 'selected' : '';
    opcionesHTML += `<option value="${cat}" ${seleccionada}>${cat}</option>`;
  });

  modal.innerHTML = `
    <div style="background: white; padding: 25px; border-radius: 10px; width: 300px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
      <h3 style="margin-top: 0; color: #2D2D2D;">Editar Producto</h3>
      
      <label style="font-weight: bold; font-size: 0.9rem;">Nombre:</label>
      <input type="text" id="edit-nombre" value="${p.nombre}" style="width: 100%; padding: 8px; margin: 5px 0 15px 0; box-sizing: border-box; border: 1px solid #ccc; border-radius: 5px;">
      
      <label style="font-weight: bold; font-size: 0.9rem;">Categoría:</label>
      <select id="edit-categoria" style="width: 100%; padding: 8px; margin: 5px 0 15px 0; border: 1px solid #ccc; border-radius: 5px;">
        ${opcionesHTML}
      </select>

      <label style="font-weight: bold; font-size: 0.9rem;">Precio ($):</label>
      <input type="number" id="edit-precio" value="${p.precio}" step="0.01" style="width: 100%; padding: 8px; margin: 5px 0 15px 0; box-sizing: border-box; border: 1px solid #ccc; border-radius: 5px;">
      
      <label style="font-weight: bold; font-size: 0.9rem;">Stock:</label>
      <input type="number" id="edit-stock" value="${p.stock}" style="width: 100%; padding: 8px; margin: 5px 0 15px 0; box-sizing: border-box; border: 1px solid #ccc; border-radius: 5px;">
      
      <label style="font-weight: bold; font-size: 0.9rem;">Imagen (ej. foto.jpg):</label>
      <input type="text" id="edit-imagen" value="${p.imagen || ''}" style="width: 100%; padding: 8px; margin: 5px 0 20px 0; box-sizing: border-box; border: 1px solid #ccc; border-radius: 5px;">
      
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button onclick="cerrarModalEdicion()" style="background: #f1f1f1; color: #333; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">Cancelar</button>
        <button onclick="guardarEdicion(${id})" style="background: #E5D0B1; color: #333; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">Guardar Cambios</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

/**
 * FUNCIÓN GUARDAR EDICIÓN
 */
async function guardarEdicion(id) {
  const nuevoNombre = document.getElementById('edit-nombre').value.trim();
  const nuevoPrecio = document.getElementById('edit-precio').value.trim();
  const nuevoStock = document.getElementById('edit-stock').value.trim();
  const nuevaImagen = document.getElementById('edit-imagen').value.trim(); 
  const nuevaCategoria = document.getElementById('edit-categoria').value; 

  if (!nuevoNombre || !nuevoPrecio || !nuevoStock) {
    alert("⚠️ El nombre, precio y stock son obligatorios.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'rol': 'admin' },
      body: JSON.stringify({
        nombre: nuevoNombre,
        precio: parseFloat(nuevoPrecio),
        stock: parseInt(nuevoStock),
        categoria: nuevaCategoria, 
        imagen: nuevaImagen 
      })
    });
    
    if(res.ok) {
        alert("✅ ¡Producto actualizado con éxito!");
        cerrarModalEdicion(); 
        cargar();             
    } else {
        alert("❌ Ocurrió un error al guardar en el servidor.");
    }
  } catch (e) {
      console.error(e);
      alert("📡 No se pudo conectar con el servidor.");
  }
}

function cerrarModalEdicion() {
  const modal = document.getElementById('modal-edicion');
  if (modal) modal.remove(); 
}

// Iniciar
cargar();