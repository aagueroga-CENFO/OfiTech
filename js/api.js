const API_BASE = 'https://fakestoreapi.com';

const api = {
    getProductos() {
        return fetch(API_BASE + '/products').then(r => r.json());
    },
    getProducto(id) {
        return fetch(API_BASE + '/products/' + id).then(r => r.json());
    },
    getCategorias() {
        return fetch(API_BASE + '/products/categories').then(r => r.json());
    },
    getProductosPorCategoria(categoria) {
        return fetch(API_BASE + '/products/category/' + encodeURIComponent(categoria)).then(r => r.json());
    }
};
