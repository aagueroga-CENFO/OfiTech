var PAGE_SIZE = 12;
var state = {
    todos:    [],
    filtrado: [],
    filtros:  { categoria: '', precioMin: '', precioMax: '', sort: '', buscar: '' },
    pagina:   0
};

function $id(id) { return document.getElementById(id); }

// ── Init ──
document.addEventListener('DOMContentLoaded', function() {
    cartUtils_updateBadge();

    var params = new URLSearchParams(window.location.search);
    if (params.get('categoria')) state.filtros.categoria = params.get('categoria');

    renderSkeletons();

    Promise.all([api.getProductos(), api.getCategorias()])
        .then(function(res) {
            state.todos = res[0];
            renderFiltrosCat(res[1]);
            aplicarFiltros();
        })
        .catch(function() {
            $id('catalogo-grid').innerHTML =
                '<div class="empty-state"><i class="fa-solid fa-circle-exclamation"></i><p>Error al cargar. Intenta de nuevo.</p></div>';
        });

    // Event listeners — dentro del DOMContentLoaded
    $id('sort-select').addEventListener('change', function(e) {
        state.filtros.sort = e.target.value;
        aplicarFiltros();
    });

    $id('btn-apply-price').addEventListener('click', function() {
        state.filtros.precioMin = $id('price-min').value;
        state.filtros.precioMax = $id('price-max').value;
        aplicarFiltros();
    });

    $id('btn-clear-filters').addEventListener('click', function() {
        state.filtros = { categoria: '', precioMin: '', precioMax: '', sort: '', buscar: '' };
        $id('price-min').value = '';
        $id('price-max').value = '';
        $id('sort-select').value = '';
        var r = document.querySelector('input[name="cat"]');
        if (r) r.checked = true;
        aplicarFiltros();
    });

    var searchTimer;
    $id('navbar-search').addEventListener('input', function(e) {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function() {
            state.filtros.buscar = e.target.value.trim().toLowerCase();
            aplicarFiltros();
        }, 350);
    });
});

// ── Filtros (todo client-side, fakestoreapi devuelve 20 productos) ──
function aplicarFiltros() {
    var f    = state.filtros;
    var lista = state.todos.slice();

    if (f.categoria) lista = lista.filter(function(p) { return p.category === f.categoria; });
    if (f.buscar)    lista = lista.filter(function(p) { return p.title.toLowerCase().indexOf(f.buscar) >= 0; });
    if (f.precioMin) lista = lista.filter(function(p) { return p.price >= Number(f.precioMin); });
    if (f.precioMax) lista = lista.filter(function(p) { return p.price <= Number(f.precioMax); });

    if (f.sort === 'price-asc')  lista.sort(function(a,b) { return a.price - b.price; });
    if (f.sort === 'price-desc') lista.sort(function(a,b) { return b.price - a.price; });
    if (f.sort === 'name-asc')   lista.sort(function(a,b) { return a.title.localeCompare(b.title); });

    state.filtrado = lista;
    state.pagina   = 0;
    $id('results-count').textContent = lista.length + ' producto' + (lista.length !== 1 ? 's' : '');
    renderPagina();
    renderPaginacion();
}

// ── Render grid ──
function renderPagina() {
    var inicio = state.pagina * PAGE_SIZE;
    var pagina = state.filtrado.slice(inicio, inicio + PAGE_SIZE);
    var grid   = $id('catalogo-grid');

    if (!pagina.length) {
        grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-box-open"></i><p>No se encontraron productos.</p></div>';
        return;
    }

    grid.innerHTML = pagina.map(function(p) {
        var title = p.title.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        var img   = p.image.replace(/'/g, "\\'");
        return '<div class="product-card">' +
            '<div class="product-img-wrap">' +
                '<span class="badge-cat">' + p.category + '</span>' +
                '<img src="' + p.image + '" alt="' + p.title + '" loading="lazy" ' +
                    'onerror="this.src=\'https://via.placeholder.com/200x190?text=OfiTech\'">' +
            '</div>' +
            '<div class="product-info">' +
                '<p class="product-name">' + p.title + '</p>' +
                '<p class="product-category">' + p.category + '</p>' +
                '<p class="product-price">$' + Number(p.price).toFixed(2) + '</p>' +
                '<div class="card-actions">' +
                    '<a href="detalle.html?id=' + p.id + '" class="btn-card-ver">' +
                        '<i class="fa-solid fa-eye"></i> Ver' +
                    '</a>' +
                    '<button class="btn-card-cart" data-id="' + p.id + '" ' +
                        'onclick="agregarDesdeCard(' + p.id + ',\'' + title + '\',' + p.price + ',\'' + img + '\',this)">' +
                        '<i class="fa-solid fa-cart-plus"></i>' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function renderFiltrosCat(cats) {
    var c = $id('categorias-filter');
    c.innerHTML = '<label><input type="radio" name="cat" value="" ' +
        (!state.filtros.categoria ? 'checked' : '') + '> Todas</label>';
    cats.forEach(function(cat) {
        var lbl = document.createElement('label');
        var inp = document.createElement('input');
        inp.type = 'radio'; inp.name = 'cat'; inp.value = cat;
        if (state.filtros.categoria === cat) inp.checked = true;
        inp.addEventListener('change', function() {
            state.filtros.categoria = cat;
            aplicarFiltros();
        });
        lbl.appendChild(inp);
        lbl.appendChild(document.createTextNode(' ' + cat));
        c.appendChild(lbl);
    });
    // Listener para "Todas"
    c.querySelector('input[value=""]').addEventListener('change', function() {
        state.filtros.categoria = '';
        aplicarFiltros();
    });
}

function renderSkeletons() {
    var html = '';
    for (var i = 0; i < 8; i++) {
        html += '<div class="product-card skeleton-card">' +
            '<div class="skeleton skeleton-img"></div>' +
            '<div class="skeleton skeleton-text"></div>' +
            '<div class="skeleton skeleton-text short"></div>' +
            '<div class="skeleton skeleton-price"></div>' +
        '</div>';
    }
    $id('catalogo-grid').innerHTML = html;
}

function renderPaginacion() {
    var pag   = $id('paginacion');
    var total = Math.ceil(state.filtrado.length / PAGE_SIZE);
    pag.innerHTML = '';
    if (total <= 1) return;

    var prev = document.createElement('button');
    prev.className = 'pag-btn'; prev.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    prev.disabled  = state.pagina === 0;
    prev.onclick   = function() { state.pagina--; renderPagina(); renderPaginacion(); window.scrollTo(0,0); };
    pag.appendChild(prev);

    for (var i = 0; i < total; i++) {
        (function(idx) {
            var btn = document.createElement('button');
            btn.className   = 'pag-btn' + (idx === state.pagina ? ' active' : '');
            btn.textContent = idx + 1;
            btn.onclick     = function() { state.pagina = idx; renderPagina(); renderPaginacion(); window.scrollTo(0,0); };
            pag.appendChild(btn);
        })(i);
    }

    var next = document.createElement('button');
    next.className = 'pag-btn'; next.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    next.disabled  = state.pagina >= total - 1;
    next.onclick   = function() { state.pagina++; renderPagina(); renderPaginacion(); window.scrollTo(0,0); };
    pag.appendChild(next);
}

// ── Agregar al carrito desde card ──
function agregarDesdeCard(id, nombre, precio, imagen, btn) {
    cartUtils_add({ id: id, nombre: nombre, precio: precio, imagen: imagen, cantidad: 1 });
    btn.classList.add('added');
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    setTimeout(function() {
        btn.classList.remove('added');
        btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i>';
    }, 1500);
}
