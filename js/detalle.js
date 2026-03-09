var productoActual = null;

function $id(id) { return document.getElementById(id); }

document.addEventListener('DOMContentLoaded', function() {
    cartUtils_updateBadge();

    var id = new URLSearchParams(window.location.search).get('id');
    if (!id) { mostrarError('Producto no especificado.'); return; }

    api.getProducto(id)
        .then(function(p) {
            if (!p || !p.id) throw new Error('not found');
            renderDetalle(p);
            api.getProductosPorCategoria(p.category)
                .then(function(lista) {
                    var rel = lista.filter(function(x) { return x.id !== p.id; }).slice(0, 4);
                    renderRelacionados(rel);
                })
                .catch(function() {});
        })
        .catch(function() { mostrarError('No se pudo cargar el producto.'); });
});

function renderDetalle(p) {
    productoActual = p;
    document.title = 'OfiTech - ' + p.title;
    var bn = $id('breadcrumb-nombre');
    if (bn) bn.textContent = p.title;

    var isFav   = cartUtils_getFavs().indexOf(p.id) >= 0;
    var estrellas = '';
    if (p.rating) {
        var r = Math.round(p.rating.rate);
        for (var i = 0; i < 5; i++) {
            estrellas += i < r ? '★' : '☆';
        }
    }

    $id('detalle-layout').innerHTML =
        '<div class="detalle-galeria">' +
            '<div class="galeria-principal">' +
                '<img src="' + p.image + '" alt="' + p.title + '" id="img-principal" ' +
                    'onerror="this.src=\'https://via.placeholder.com/440x360?text=OfiTech\'">' +
            '</div>' +
            '<div class="galeria-thumbs">' +
                '<div class="galeria-thumb active" onclick="cambiarImagen(\'' + p.image + '\',this)">' +
                    '<img src="' + p.image + '" alt="Principal">' +
                '</div>' +
                '<div class="galeria-thumb" onclick="cambiarImagen(\'https://via.placeholder.com/440x360/e5e7eb/001762?text=Vista+2\',this)">' +
                    '<img src="https://via.placeholder.com/68x68/e5e7eb/001762?text=2" alt="2">' +
                '</div>' +
                '<div class="galeria-thumb" onclick="cambiarImagen(\'https://via.placeholder.com/440x360/e5e7eb/001762?text=Vista+3\',this)">' +
                    '<img src="https://via.placeholder.com/68x68/e5e7eb/001762?text=3" alt="3">' +
                '</div>' +
            '</div>' +
        '</div>' +

        '<div class="detalle-info">' +
            '<span class="detalle-badge-cat">' + p.category + '</span>' +
            '<h1 class="detalle-titulo">' + p.title + '</h1>' +
            (p.rating ? '<div class="detalle-rating"><span class="stars">' + estrellas + '</span> ' +
                p.rating.rate + ' / 5 &nbsp;·&nbsp; ' + p.rating.count + ' reseñas</div>' : '') +
            '<div class="detalle-precio">$' + Number(p.price).toFixed(2) + '</div>' +

            '<div class="detalle-tabs">' +
                '<button class="detalle-tab-btn active" onclick="switchTab(\'desc\',this)">Descripción</button>' +
                '<button class="detalle-tab-btn" onclick="switchTab(\'spec\',this)">Especificaciones</button>' +
            '</div>' +
            '<div class="detalle-tab-panel active" id="tab-desc"><p>' + (p.description || '—') + '</p></div>' +
            '<div class="detalle-tab-panel" id="tab-spec">' +
                '<table class="specs-table">' +
                    '<tr><td>Categoría</td><td>' + p.category + '</td></tr>' +
                    '<tr><td>Precio</td><td>$' + Number(p.price).toFixed(2) + '</td></tr>' +
                    '<tr><td>Valoración</td><td>' + (p.rating ? p.rating.rate + ' / 5' : '—') + '</td></tr>' +
                    '<tr><td>SKU</td><td>#' + p.id + '</td></tr>' +
                '</table>' +
            '</div>' +

            '<hr class="detalle-divider">' +

            '<div class="cantidad-label">Cantidad</div>' +
            '<div class="cantidad-wrap">' +
                '<button class="qty-btn" onclick="cambiarCantidad(-1)">−</button>' +
                '<input type="number" class="qty-input" id="qty-input" value="1" min="1" max="99" readonly>' +
                '<button class="qty-btn" onclick="cambiarCantidad(1)">+</button>' +
            '</div>' +

            '<div class="detalle-acciones">' +
                '<button class="btn-agregar-carrito" id="btn-agregar" onclick="handleAgregar()">' +
                    '<i class="fa-solid fa-cart-plus"></i> Agregar al carrito' +
                '</button>' +
                '<button class="btn-fav ' + (isFav ? 'active' : '') + '" id="btn-fav" onclick="handleFav()">' +
                    '<i class="fa-' + (isFav ? 'solid' : 'regular') + ' fa-heart"></i>' +
                '</button>' +
            '</div>' +

            '<p class="detalle-meta">Categoría: <span>' + p.category + '</span> &nbsp;·&nbsp; ' +
                'SKU: <span>#' + p.id + '</span></p>' +
        '</div>';
}

function renderRelacionados(productos) {
    var sec  = $id('relacionados-section');
    var grid = $id('relacionados-grid');
    if (!productos.length) { if (sec) sec.style.display = 'none'; return; }

    grid.innerHTML = productos.map(function(p) {
        var title = p.title.replace(/'/g, "\\'");
        var img   = p.image.replace(/'/g, "\\'");
        return '<div class="product-card">' +
            '<div class="product-img-wrap">' +
                '<img src="' + p.image + '" alt="' + p.title + '" loading="lazy" ' +
                    'onerror="this.src=\'https://via.placeholder.com/190x150?text=OfiTech\'">' +
            '</div>' +
            '<div class="product-info">' +
                '<p class="product-name">' + p.title + '</p>' +
                '<p class="product-price">$' + Number(p.price).toFixed(2) + '</p>' +
                '<div class="card-actions">' +
                    '<a href="detalle.html?id=' + p.id + '" class="btn-card-ver">' +
                        '<i class="fa-solid fa-eye"></i> Ver' +
                    '</a>' +
                    '<button class="btn-card-cart" ' +
                        'onclick="cartUtils_add({id:' + p.id + ',nombre:\'' + title + '\',precio:' + p.price + ',imagen:\'' + img + '\',cantidad:1})">' +
                        '<i class="fa-solid fa-cart-plus"></i>' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function cambiarImagen(src, thumb) {
    var img = $id('img-principal');
    img.classList.add('fade');
    setTimeout(function() { img.src = src; img.classList.remove('fade'); }, 200);
    document.querySelectorAll('.galeria-thumb').forEach(function(t) { t.classList.remove('active'); });
    thumb.classList.add('active');
}

function switchTab(tab, btn) {
    document.querySelectorAll('.detalle-tab-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.detalle-tab-panel').forEach(function(p) { p.classList.remove('active'); });
    btn.classList.add('active');
    $id('tab-' + tab).classList.add('active');
}

function cambiarCantidad(delta) {
    var inp = $id('qty-input');
    if (!inp) return;
    var v = parseInt(inp.value) + delta;
    if (v < 1) v = 1;
    if (v > 99) v = 99;
    inp.value = v;
}

function handleAgregar() {
    if (!productoActual) return;
    var qty = parseInt($id('qty-input').value) || 1;
    cartUtils_add({
        id:      productoActual.id,
        nombre:  productoActual.title,
        precio:  productoActual.price,
        imagen:  productoActual.image,
        cantidad: qty
    });
    var btn = $id('btn-agregar');
    btn.classList.add('added');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
    setTimeout(function() {
        btn.classList.remove('added');
        btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Agregar al carrito';
    }, 2000);
}

function handleFav() {
    if (!productoActual) return;
    var added = cartUtils_toggleFav(productoActual.id);
    var btn   = $id('btn-fav');
    btn.classList.toggle('active', added);
    btn.innerHTML = '<i class="fa-' + (added ? 'solid' : 'regular') + ' fa-heart"></i>';
}

function mostrarError(msg) {
    $id('detalle-layout').innerHTML =
        '<div class="empty-state" style="width:100%">' +
            '<i class="fa-solid fa-circle-exclamation"></i>' +
            '<p>' + msg + ' <a href="catalogo.html">Volver al catálogo</a></p>' +
        '</div>';
}
