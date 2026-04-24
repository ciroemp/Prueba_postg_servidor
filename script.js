// 1. Productos de RESPALDO (Los que siempre se verán si la DB falla)
const productosRespaldo = [
    {
        nombre: "Laptop Pro",
        descripcion: "Versión estándar de la tienda (Sin conexión a stock real)",
        precio: "1200.00",
        url_imagen: "https://picsum.photos/id/1/300/200"
    },
    {
        nombre: "Mouse Gamer",
        descripcion: "Versión estándar de la tienda (Sin conexión a stock real)",
        precio: "45.00",
        url_imagen: "https://picsum.photos/id/2/300/200"
    }
];

async function renderizarTienda() {
    const contenedor = document.getElementById('lista-productos');
    let productosAMostrar = productosRespaldo;
    let hayConexion = false;

    try {
        // Intentamos conectar con la base de datos
        const respuesta = await fetch('datos.php');
        if (respuesta.ok) {
            const productosDB = await respuesta.json();
            if (productosDB.length > 0) {
                productosAMostrar = productosDB; // Usamos los de la DB
                hayConexion = true;
            }
        }
    } catch (error) {
        console.warn("Usando productos de respaldo: No se pudo conectar al servidor.");
    }

    // Generar el HTML
    let html = '';
    productosAMostrar.forEach(p => {
        // Lógica de existencia (Solo si hay conexión)
        let infoStock = '';
        if (hayConexion) {
            const cantidad = parseInt(p.stock);
            if (cantidad > 0) {
                infoStock = `<span class="badge bg-success">En existencia: ${cantidad}</span>`;
            } else {
                infoStock = `<span class="badge bg-danger">Agotado</span>`;
            }
        }

        html += `
        <div class="col-md-4 mb-4">
            <div class="card shadow-sm h-100">
                <img src="${p.url_imagen}" class="card-img-top" alt="${p.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${p.nombre}</h5>
                    <p class="card-text small text-muted">${p.descripcion}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="h5 mb-0 text-primary">$${p.precio}</span>
                        ${infoStock} 
                    </div>
                    <button class="btn btn-dark w-100 mt-3" ${hayConexion && p.stock <= 0 ? 'disabled' : ''}>
                        ${hayConexion && p.stock <= 0 ? 'Sin Stock' : 'Comprar ahora'}
                    </button>
                </div>
            </div>
        </div>`;
    });

    contenedor.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderizarTienda);