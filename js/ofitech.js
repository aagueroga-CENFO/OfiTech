document.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('js/data.json');
    const data = await res.json();

    renderCategorias(data.categorias);
    renderOfertas(data.ofertasDestacadas);
    renderProductos(data.productosMasVendidos);
    renderBeneficios(data.beneficios);
    setupCarousel();
});

function renderCategorias(categorias) {
    const container = document.getElementById('categorias-container');
    container.innerHTML = categorias.map(cat =>
        `<button class="categoria-btn">${cat.nombre}</button>`
    ).join('');
}

function renderOfertas(ofertas) {
    const slider = document.getElementById('ofertas-slider');
    slider.innerHTML = ofertas.map(p => renderProductCard(p, 'oferta')).join('');
}

function renderProductos(productos) {
    const grid = document.getElementById('productos-grid');
    grid.innerHTML = productos.map(p => renderProductCard(p, 'producto')).join('');
}

function renderProductCard(p, tipo) {
    const formatter = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 });
    return `
    <div class="product-card ${tipo}-card">
        <div class="product-img-wrap">
            <img src="${p.imagen}" alt="${p.nombre}">
            ${p.precioOferta ? `<span class="badge-oferta">${formatter.format(p.precioOferta)}</span>` : ''}
        </div>
        <div class="product-info">
            <span class="product-price-old">${formatter.format(p.precioOriginal)}</span>
            <span class="product-price">${formatter.format(p.precioOferta || p.precioOriginal)}</span>
            <p class="product-name">${p.nombre}</p>
        </div>
    </div>`;
}

function renderBeneficios(beneficios) {
    const grid = document.getElementById('beneficios-grid');
    grid.innerHTML = beneficios.map(b => `
        <div class="beneficio-item">
            <i class="${b.icono}"></i>
            <span>${b.titulo}</span>
        </div>
    `).join('');
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
