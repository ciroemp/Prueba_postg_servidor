async function agregarProducto() {
  const nombre = document.getElementById('nombre').value;
  const precio = document.getElementById('precio').value;
  const stock = document.getElementById('stock').value;

  await fetch('https://api.tudominio.com/productos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'rol': 'admin' // 👈 esto activa el middleware
    },
    body: JSON.stringify({ nombre, precio, stock })
  });

  alert('Producto agregado');
}