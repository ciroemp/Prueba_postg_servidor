const API = '/productos';
let productosGlobal = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

async function cargarProductos() {
  const res = await fetch(API);
  productosGlobal = await res.json();
  renderProductos(productosGlobal);
  actualizarCarrito();
}

function renderProductos(productos) {
  const cont = document.getElementById('productos');
  cont.innerHTML = '';

  productos.forEach(p => {
    // Si p.imagen_url no existe, intenta usar una ruta por defecto
    const rutaImagen = p.imagen_url ? p.imagen_url : 'public/img/placeholder.jpg';

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
// BUSCADOR
function filtrarProductos() {
  const texto = document.getElementById('buscador').value.toLowerCase();
  const filtrados = productosGlobal.filter(p =>
    p.nombre.toLowerCase().includes(texto)
  );
  renderProductos(filtrados);
}

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
  document.getElementById('contador').innerText = totalArticulos;

  const lista = document.getElementById('listaCarrito');
  lista.innerHTML = '';
  let total = 0;

  carrito.forEach(p => {
    total += p.precio * p.cantidad;
    lista.innerHTML += `
      <div class="item-carrito">
        <div class="item-info">
          <strong>${p.nombre}</strong>
          <span>$${parseFloat(p.precio).toFixed(2)} c/u</span>
        </div>
        <div class="item-controles">
          <div class="btn-group">
            <button onclick="restarCantidad(${p.id})">-</button>
            <span class="cantidad-display">${p.cantidad}</span>
            <button onclick="sumarCantidad(${p.id})">+</button>
          </div>
          <button class="btn-eliminar" onclick="eliminarItem(${p.id})">🗑️</button>
        </div>
      </div>
    `;
  });
  document.getElementById('total').innerText = `Total: $${total.toFixed(2)}`;
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
  carritoDiv.classList.toggle('carrito-abierto');
  carritoDiv.classList.toggle('carrito-cerrado');
}

function enviarWhatsApp() {
  if (carrito.length === 0) { alert("Tu carrito está vacío."); return; }
  let msg = "🛒 *Cotización de Productos:*\\n\\n";
  carrito.forEach(p => {
    msg += `▪️ ${p.nombre} (x${p.cantidad}) - $${(p.precio * p.cantidad).toFixed(2)}\\n`;
  });
  const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  msg += `\\n*Total a pagar: $${total.toFixed(2)}*`;
  window.open(`https://wa.me/503XXXXXXXX?text=${encodeURIComponent(msg)}`);
}

cargarProductos();