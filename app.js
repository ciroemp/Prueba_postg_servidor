const API = '/productos';

let productosGlobal = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// CARGAR PRODUCTOS
async function cargarProductos() {
  const res = await fetch(API);
  productosGlobal = await res.json();
  renderProductos(productosGlobal);
  actualizarCarrito();
}

// RENDER PRODUCTOS
function renderProductos(productos) {
  const cont = document.getElementById('productos');
  cont.innerHTML = '';

  productos.forEach(p => {
    cont.innerHTML += `
      <div class="col-md-3 mb-3">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5>${p.nombre}</h5>
            <p class="text-success fw-bold">$${parseFloat(p.precio).toFixed(2)}</p>
            <p>Stock: ${p.stock}</p>

            <button class="btn btn-primary w-100" onclick='agregar(${JSON.stringify(p)})'>
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

// AGREGAR AL CARRITO
function agregar(p) {
  const item = carrito.find(x => x.id === p.id);

  if (item) item.cantidad++;
  else carrito.push({ ...p, cantidad: 1 });

  guardarCarrito();
}

// GUARDAR
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarrito();
}

// ACTUALIZAR UI CARRITO
function actualizarCarrito() {
  document.getElementById('contador').innerText = carrito.length;

  const lista = document.getElementById('listaCarrito');
  lista.innerHTML = '';

  let total = 0;

  carrito.forEach(p => {
    total += p.precio * p.cantidad;

    lista.innerHTML += `
      <p>${p.nombre} x${p.cantidad}</p>
    `;
  });

  document.getElementById('total').innerText = `Total: $${total.toFixed(2)}`;
}

// MOSTRAR / OCULTAR CARRITO

function toggleCarrito() {
  const carrito = document.getElementById('carrito');

  carrito.classList.toggle('carrito-abierto');
  carrito.classList.toggle('carrito-cerrado');
}

// WHATSAPP
function enviarWhatsApp() {
  let msg = "🛒 Cotización:\n\n";

  carrito.forEach(p => {
    msg += `${p.nombre} x${p.cantidad} - $${p.precio}\n`;
  });

  const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  msg += `\nTotal: $${total.toFixed(2)}`;

  const numero = "503XXXXXXXX";

  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`);
}



cargarProductos();