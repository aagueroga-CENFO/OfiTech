// Misma key que carrito.js para compartir el carrito entre páginas
var CART_KEY = 'carritoOfitech';

function cartUtils_getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function cartUtils_saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    cartUtils_updateBadge();
}

function cartUtils_add(producto) {
    var cart = cartUtils_getCart();
    var existing = cart.find(function(i) { return String(i.id) === String(producto.id); });
    if (existing) {
        existing.cantidad += producto.cantidad || 1;
    } else {
        cart.push({
            id:       producto.id,
            nombre:   producto.nombre,
            precio:   producto.precio,
            imagen:   producto.imagen,
            cantidad: producto.cantidad || 1
        });
    }
    cartUtils_saveCart(cart);
    cartUtils_showToast('"' + producto.nombre.substring(0, 28) + '…" agregado al carrito');
}

function cartUtils_updateBadge() {
    var badge = document.getElementById('cart-count');
    if (!badge) return;
    var total = cartUtils_getCart().reduce(function(s, i) { return s + i.cantidad; }, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
}

function cartUtils_showToast(msg) {
    var toast = document.getElementById('cart-toast');
    var span  = document.getElementById('cart-toast-msg');
    if (!toast || !span) return;
    span.textContent = msg;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 3000);
}

function cartUtils_getFavs() {
    return JSON.parse(localStorage.getItem('ofitechFavs') || '[]');
}

function cartUtils_toggleFav(id) {
    var favs = cartUtils_getFavs();
    var idx  = favs.indexOf(id);
    if (idx >= 0) favs.splice(idx, 1);
    else favs.push(id);
    localStorage.setItem('ofitechFavs', JSON.stringify(favs));
    return idx < 0;
}
