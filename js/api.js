const API_BASE = 'https://fakestoreapi.com';

const api = {
    getProductos() {
        return fetch(API_BASE + '/products/category/electronics').then(r => r.json());
    },
    getProducto(id) {
        return fetch(API_BASE + '/products/' + id).then(r => r.json());
    },
    getCategorias() {
        // Custom subcategories for electronics products
        return Promise.resolve(['Almacenamiento', 'Monitores']);
    },
    getProductosPorCategoria(categoria) {
        return fetch(API_BASE + '/products/category/' + encodeURIComponent(categoria)).then(r => r.json());
    }
};
