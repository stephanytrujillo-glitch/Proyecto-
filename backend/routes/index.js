const express = require('express');
const router = express.Router();
const { verifyToken, esAdmin } = require('../middleware/auth');

// Auth
const { registro, login, perfil, actualizarPerfil, loginGoogle,
        recuperarContrasena, restablecerContrasena,
        obtenerDirecciones, crearDireccion, eliminarDireccion } = require('../controllers/authController');
router.post('/auth/registro', registro);
router.post('/auth/login', login);
router.get('/auth/perfil', verifyToken, perfil);
router.put('/auth/perfil', verifyToken, actualizarPerfil);
router.post("/auth/google", loginGoogle);

// HU016 - Recuperar contraseña
router.post('/auth/recuperar', recuperarContrasena);
router.post('/auth/restablecer', restablecerContrasena);

// HU017 - Direcciones guardadas
router.get('/auth/direcciones', verifyToken, obtenerDirecciones);
router.post('/auth/direcciones', verifyToken, crearDireccion);
router.delete('/auth/direcciones/:id', verifyToken, eliminarDireccion);

// Productos
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto, obtenerCategorias } = require('../controllers/productosController');
router.get('/productos', obtenerProductos);
router.get('/productos/:id', obtenerProducto);
router.post('/productos', verifyToken, esAdmin, crearProducto);
router.put('/productos/:id', verifyToken, esAdmin, actualizarProducto);
router.delete('/productos/:id', verifyToken, esAdmin, eliminarProducto);
router.get('/categorias', obtenerCategorias);

// Carrito
const { obtenerCarrito, agregarAlCarrito, actualizarCantidad, eliminarDelCarrito, vaciarCarrito } = require('../controllers/carritoController');
router.get('/carrito', verifyToken, obtenerCarrito);
router.post('/carrito', verifyToken, agregarAlCarrito);
router.put('/carrito/:id', verifyToken, actualizarCantidad);
router.delete('/carrito/:id', verifyToken, eliminarDelCarrito);
router.delete('/carrito', verifyToken, vaciarCarrito);

// Pedidos
const { crearPedido, misPedidos, detallePedido, todosPedidos, actualizarEstado } = require('../controllers/pedidosController');
router.post('/pedidos', verifyToken, crearPedido);
router.get('/pedidos', verifyToken, misPedidos);
router.get('/pedidos/:id', verifyToken, detallePedido);
router.get('/admin/pedidos', verifyToken, esAdmin, todosPedidos);
router.put('/admin/pedidos/:id', verifyToken, esAdmin, actualizarEstado);

module.exports = router;
