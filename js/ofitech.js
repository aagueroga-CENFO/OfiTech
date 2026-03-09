let productos

const categorias = [
    { nombre: 'Almacenamiento', icono: 'fa-hard-drive' },
    { nombre: 'Monitores', icono: 'fa-desktop' }
];

const beneficios = [
    { nombre: 'Garantía', icono: 'fa-shield-halved', descripcion: 'Productos garantizados' },
    { nombre: 'Envíos rápidos', icono: 'fa-truck-fast', descripcion: 'Entrega express' },
    { nombre: 'Soporte local', icono: 'fa-headset', descripcion: 'Atención personalizada' }
];

document.addEventListener('DOMContentLoaded', async () => {
    // Render beneficios first (doesn't depend on API)
    renderizarBeneficios();
    
    try {
        const res = await fetch('https://fakestoreapi.com/products/category/electronics');
        const data = await res.json();
        console.log(data);
        productos = data;
        
        renderizarProductos(productos);
        renderizarOfertas(productos);
        setupCarousel();
    } catch (err) {
        console.error('Error loading products:', err);
        document.getElementById('productos-grid').innerHTML = '<p style="color:#999;text-align:center;">Error al cargar productos</p>';
        document.getElementById('ofertas-slider').innerHTML = '<p style="color:#999;text-align:center;">Error al cargar ofertas</p>';
    }
});

function renderizarCategorias() {
    const container = document.getElementById('categorias-container');
    container.innerHTML = '<a href="catalogo.html" class="categoria-btn">Ver todo el catálogo</a>' + categorias.map(cat =>
        `<button class="categoria-btn">${cat.nombre}</button>`
    ).join('');
}

function renderizarBeneficios() {
    const container = document.getElementById('beneficios-grid');
    container.innerHTML = beneficios.map(b => 
        `<div class="beneficio-item">
            <i class="fa-solid ${b.icono}"></i>
            <span>${b.nombre}</span>
        </div>`
    ).join('');
}

function getRandomProducts(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

function renderProductCard(p) {
    return `
    <div class="product-card">
        <div class="product-img-wrap">
            <img src="${p.image}" alt="${p.title}">
        </div>
        <div class="product-info">
            <span class="product-price">$${p.price}</span>
            <p class="product-name">${p.title}</p>
        </div>
    </div>`;
}

function renderizarProductos(productos) {
    const productosGrid = document.getElementById('productos-grid');
    productosGrid.innerHTML = productos.map(producto => renderProductCard(producto)).join('');
}

function renderizarOfertas(productos) {
    const slider = document.getElementById('ofertas-slider');
    const ofertas = getRandomProducts(productos, 3);
    slider.innerHTML = ofertas.map(producto => renderProductCard(producto)).join('');
}

function setupCarousel() {
    const slider = document.getElementById('ofertas-slider');
    const prev = document.querySelector('.carousel-btn.prev');
    const next = document.querySelector('.carousel-btn.next');
    let idx = 0;
    const cards = slider.querySelectorAll('.product-card');
    const total = cards.length;

    function update() {
        slider.style.transform = `translateX(-${idx * 100}%)`;
    }

    prev.addEventListener('click', () => {
        idx = (idx - 1 + total) % total;
        update();
    });
    next.addEventListener('click', () => {
        idx = (idx + 1) % total;
        update();
    });
}

// Actualizar badge del carrito al cargar index
document.addEventListener('DOMContentLoaded', function() {
    if (typeof cartUtils_updateBadge === 'function') cartUtils_updateBadge();
});
