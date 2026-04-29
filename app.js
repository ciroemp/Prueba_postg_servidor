// Variable para la ruta de la API y almacenamiento global
const API = '/productos';
let productosGlobal = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

/**
 * FUNCIÓN AUXILIAR: VERIFICAR IMAGEN
 * Crea una imagen en memoria para comprobar si existe antes de mostrarla.
 * @param {string} url - La ruta de la imagen a verificar.
 * @returns {Promise<boolean>} - true si carga, false si falla (ej. 404).
 */
function verificarImagen(url) {
  return new Promise((resolve) => {
    // Si no hay URL o es el placeholder, no cuenta como carga exitosa
    if (!url || url.includes('placeholder.jpg')) {
      resolve(false);
      return;
    }

    const img = new Image(); 
    img.onload = () => resolve(true);   // La imagen existe y cargó bien
    img.onerror = () => resolve(false); // La imagen no existe
    img.src = url; 
  });
}

/**
 * FUNCIÓN CARGAR PRODUCTOS
 * Se conecta a la API, verifica físicamente las imágenes, ordena y muestra.
 */
async function cargarProductos() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    // 1. Verificamos cada imagen usando Promise.all para hacerlo en paralelo
    const productosVerificados = await Promise.all(data.map(async (p) => {
      // Determinamos la ruta que intentaremos cargar
      const imgPath = p.imagen_url ? p.imagen_url : 'public/img/placeholder.jpg';
      
      // Llamamos a nuestra función exploradora
      const cargaExitosa = await verificarImagen(imgPath);
      
      // Devolvemos el producto con una nueva propiedad 'cargaExitosa'
      return {
        ...p,
        cargaExitosa: cargaExitosa 
      };
    }));

    // 2. Lógica de ordenamiento basada en carga real
    productosVerificados.sort((a, b) => {
      if (a.cargaExitosa && !b.cargaExitosa) return -1; // 'a' sube
      if (!a.cargaExitosa && b.cargaExitosa) return 1;  // 'b' sube
      return 0; // Se mantienen igual
    });

    // Guardamos el array ya ordenado globalmente
    productosGlobal = productosVerificados;

    // Dibujamos los productos y actualizamos el estado del carrito
    renderProductos(productosGlobal);
    actualizarCarrito();

  } catch (error) {
    console.error("Error al cargar la tienda:", error);
  }
}

/**
 * FUNCIÓN RENDER PRODUCTOS
 * Crea las tarjetas de la tienda dinámicamente.
 */
function renderProductos(productos) {
  const cont = document.getElementById('productos');
  if (!cont) return;
  cont.innerHTML = '';

  productos.forEach(p => {
    // Definimos la ruta de la imagen o el placeholder si no existe
    const imgPath = p.imagen_url ? p.imagen_url : 'public/img/placeholder.jpg';

    cont.innerHTML += `
      <div class="card">
        <div class="img-container">
          <img src="${imgPath}" 
               alt="${p.nombre}" 
               class="card-img" 
               onerror="this.onerror=null; this.src='public/img/placeholder.jpg';">
        </div>
        <div class="card-content">
          <h3>${p.nombre}</h3>
          <p class="price">$${parseFloat(p.precio).toFixed(2)}</p>
          <p class="stock">Stock disponible: <strong>${p.stock}</strong></p>
          
          <div class="controles-agregar">
            <input type="number" id="cant-${p.id}" value="1" min="1" max="${p.stock}" class="input-cantidad">
            <button class="btn" onclick='agregarDesdeTarjeta(${JSON.stringify(p)})'>
              Agregar
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

/**
 * FUNCIÓN FILTRAR (BUSCADOR)
 * Filtra sobre el array 'productosGlobal' que ya está ordenado.
 */
function filtrarProductos() {
  const texto = document.getElementById('buscador').value.toLowerCase();
  const filtrados = productosGlobal.filter(p =>
    p.nombre.toLowerCase().includes(texto)
  );
  renderProductos(filtrados);
}

// --- LÓGICA DEL CARRITO (Se mantiene igual) ---

function agregarDesdeTarjeta(p) {
  const input = document.getElementById(`cant-${p.id}`);
  const cantidadDeseada = parseInt(input.value);
  const item = carrito.find(x => x.id === p.id);

  if (item) {
    item.cantidad += cantidadDeseada;
  } else {
    carrito.push({ ...p, cantidad: cantidadDeseada });
  }
  input.value = 1;
  guardarCarrito();
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarrito();
}

function actualizarCarrito() {
  const totalArticulos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const contador = document.getElementById('contador');
  if (contador) contador.innerText = totalArticulos;

  const lista = document.getElementById('listaCarrito');
  if (!lista) return;
  lista.innerHTML = '';
  let total = 0;

  carrito.forEach(p => {
    const subtotal = p.precio * p.cantidad;
    total += subtotal;

    lista.innerHTML += `
      <div class="item-carrito">
        <div class="item-info">
          <strong>${p.nombre}</strong>
          <span>$${parseFloat(p.precio).toFixed(2)} c/u</span>
        </div>
        <div class="item-controles">
          <div class="btn-group">
            <button onclick="restarCantidad(${p.id})">−</button>
            <span class="cantidad-display">${p.cantidad}</span>
            <button onclick="sumarCantidad(${p.id})">+</button>
          </div>
          <button class="btn-eliminar" onclick="eliminarItem(${p.id})" title="Eliminar">🗑️</button>
        </div>
      </div>
    `;
  });

  const totalElem = document.getElementById('total');
  if (totalElem) totalElem.innerText = `Total: $${total.toFixed(2)}`;
}

function sumarCantidad(id) {
  const item = carrito.find(x => x.id === id);
  if (item) { item.cantidad++; guardarCarrito(); }
}

function restarCantidad(id) {
  const item = carrito.find(x => x.id === id);
  if (item) {
    item.cantidad--;
    if (item.cantidad <= 0) eliminarItem(id);
    else guardarCarrito();
  }
}

function eliminarItem(id) {
  carrito = carrito.filter(x => x.id !== id);
  guardarCarrito();
}

function toggleCarrito() {
  const carritoDiv = document.getElementById('carrito');
  if (carritoDiv) {
    carritoDiv.classList.toggle('carrito-abierto');
    carritoDiv.classList.toggle('carrito-cerrado');
  }
}

function enviarWhatsApp() {
  if (carrito.length === 0) { alert("Tu carrito está vacío."); return; }
  let msg = "🛒 *Cotización de Productos:*\n\n";
  carrito.forEach(p => {
    msg += `▪️ ${p.nombre} (x${p.cantidad}) - $${(p.precio * p.cantidad).toFixed(2)}\n`;
  });
  const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  msg += `\n*Total a pagar: $${total.toFixed(2)}*`;
  // Reemplaza con tu número real de WhatsApp
  window.open(`https://wa.me/503XXXXXXXX?text=${encodeURIComponent(msg)}`);
}

// Ejecución inicial
cargarProductos();