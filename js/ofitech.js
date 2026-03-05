let productos

const categorias = [
    { nombre: 'Computadoras', icono: 'fa-laptop' },
    { nombre: 'Todo en uno', icono: 'fa-desktop' },
    { nombre: 'Componentes', icono: 'fa-microchip' },
    { nombre: 'Memorias', icono: 'fa-memory' }
];

const beneficios = [
    { nombre: 'Garantía', icono: 'fa-shield-halved', descripcion: 'Productos garantizados' },
    { nombre: 'Envíos rápidos', icono: 'fa-truck-fast', descripcion: 'Entrega express' },
    { nombre: 'Soporte local', icono: 'fa-headset', descripcion: 'Atención personalizada' }
];

document.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('https://fakestoreapi.com/products/category/electronics');
    const data = await res.json();
    console.log(data);
    productos = data;
    
    renderizarCategorias();
    renderizarBeneficios();
    renderizarProductos(productos);
    renderizarOfertas(productos);

    setupCarousel();
});

function renderizarCategorias() {
    const container = document.getElementById('categorias-container');
    container.innerHTML = categorias.map(cat => 
        `<button class="categoria-btn"><i class="fa-solid ${cat.icono}"></i> ${cat.nombre}</button>`
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

