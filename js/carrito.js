// js/carrito.js

// 1. INICIALIZACIÓN
let carritoDeCompras = JSON.parse(localStorage.getItem('carritoOfitech')) || [];

// 2. FUNCIONES DEL CARRITO

function guardarEnLocalStorage() {
    localStorage.setItem('carritoOfitech', JSON.stringify(carritoDeCompras));
}

function renderizarCarrito() {
    const contenedor = document.getElementById('contenedorCarrito');
    contenedor.innerHTML = ''; 

    if (carritoDeCompras.length === 0) {
        contenedor.innerHTML = '<tr><td colspan="5" class="text-center py-4">Tu carrito está vacío. ¡Ve a comprar!</td></tr>';
        actualizarTotal();
        return;
    }

    carritoDeCompras.forEach((producto) => {
        const fila = document.createElement('tr');
        
       
        fila.innerHTML = `
            <td style="max-width: 250px;">
                <div class="d-flex align-items-center">
                    <img src="${producto.imagen}" alt="Imagen de ${producto.nombre}" style="width: 50px; height: 50px; object-fit: contain; margin-right: 15px; flex-shrink: 0;">
                    <span class="d-inline-block text-truncate" style="max-width: 180px; cursor: help;" 
                          data-bs-toggle="tooltip" data-bs-placement="top" 
                          data-bs-title="${producto.nombre}">
                        ${producto.nombre}
                    </span>
                </div>
            </td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>
                <input type="number" class="form-control form-control-sm" style="width: 70px;" 
                       value="${producto.cantidad}" min="1" 
                       onchange="actualizarCantidad('${producto.id}', this.value)">
            </td>
            <td class="fw-bold">$${(producto.precio * producto.cantidad).toFixed(2)}</td>
            <td>
                <button class="btn btn-outline-danger btn-sm" onclick="eliminarProducto('${producto.id}')" title="Eliminar">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        contenedor.appendChild(fila);
    });

    actualizarTotal();
    activarTooltips(); 
}


 //NUEVO: Activa los tooltips de Bootstrap en los elementos recién creados.
 

function activarTooltips() {

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');

    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

function agregarProducto(productoNuevo) {
    const productoExistente = carritoDeCompras.find(item => String(item.id) === String(productoNuevo.id));

    if (productoExistente) {
        productoExistente.cantidad += 1; 
    } else {
        carritoDeCompras.push({ ...productoNuevo, cantidad: 1 }); 
    }

    guardarEnLocalStorage();
    renderizarCarrito();
}

function eliminarProducto(idProducto) {
    // Destruimos tooltips abiertos antes de eliminar para evitar tooltips "fantasma" 
    const tooltipsAbiertos = document.querySelectorAll('.tooltip');
    tooltipsAbiertos.forEach(t => t.remove());

    carritoDeCompras = carritoDeCompras.filter(producto => String(producto.id) !== String(idProducto));
    
    guardarEnLocalStorage();
    renderizarCarrito();
}

function actualizarCantidad(idProducto, nuevaCantidad) {
    const cantidad = parseInt(nuevaCantidad);
    if (cantidad < 1) return; 

    const producto = carritoDeCompras.find(item => String(item.id) === String(idProducto));
    if (producto) {
        producto.cantidad = cantidad;
        guardarEnLocalStorage();
        renderizarCarrito();
    }
}

function actualizarTotal() {
    const total = carritoDeCompras.reduce((acumulador, producto) => {
        return acumulador + (producto.precio * producto.cantidad);
    }, 0);

    document.getElementById('totalCarrito').textContent = `$${total.toFixed(2)}`;
}


// 3. CONSUMO DE FAKE STORE API
async function probarFakeStoreApi() {
    try {
        const respuesta = await fetch('https://fakestoreapi.com/products/category/electronics');
        const productosElectronicos = await respuesta.json();

        const indiceAleatorio = Math.floor(Math.random() * productosElectronicos.length);
        const dataApi = productosElectronicos[indiceAleatorio];

        const productoAdaptado = {
            id: `api-${dataApi.id}`, 
            nombre: dataApi.title,
            precio: dataApi.price * 500, 
            imagen: dataApi.image
        };

        agregarProducto(productoAdaptado);
        
    } catch (error) {
        console.error("Error al conectar con Fake Store API:", error);
        alert("Hubo un error al traer el producto de la API.");
    }
}

// 4. EJECUTAR AL CARGAR
document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrito();
});