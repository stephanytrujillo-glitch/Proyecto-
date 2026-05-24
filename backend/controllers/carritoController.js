const db = require('../config/db');

// GET /api/carrito
const obtenerCarrito = async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT c.id, c.cantidad, p.id AS producto_id, p.nombre, p.precio, p.imagen_url, p.stock
       FROM carrito c
       JOIN productos p ON c.producto_id = p.id
       WHERE c.usuario_id = ?`,
      [req.usuario.id]
    );
    const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
    res.json({ items, total });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// POST /api/carrito
const agregarAlCarrito = async (req, res) => {
  const { producto_id, cantidad = 1 } = req.body;
  try {
    const [existe] = await db.query(
      'SELECT id, cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?',
      [req.usuario.id, producto_id]
    );

    if (existe.length > 0) {
      await db.query(
        'UPDATE carrito SET cantidad = cantidad + ? WHERE id = ?',
        [cantidad, existe[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)',
        [req.usuario.id, producto_id, cantidad]
      );
    }
    res.json({ mensaje: 'Producto agregado al carrito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// PUT /api/carrito/:id
const actualizarCantidad = async (req, res) => {
  const { cantidad } = req.body;
  if (cantidad < 1) return res.status(400).json({ mensaje: 'Cantidad mínima es 1' });
  try {
    await db.query(
      'UPDATE carrito SET cantidad = ? WHERE id = ? AND usuario_id = ?',
      [cantidad, req.params.id, req.usuario.id]
    );
    res.json({ mensaje: 'Cantidad actualizada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// DELETE /api/carrito/:id
const eliminarDelCarrito = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM carrito WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuario.id]
    );
    res.json({ mensaje: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// DELETE /api/carrito (vaciar)
const vaciarCarrito = async (req, res) => {
  try {
    await db.query('DELETE FROM carrito WHERE usuario_id = ?', [req.usuario.id]);
    res.json({ mensaje: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = { obtenerCarrito, agregarAlCarrito, actualizarCantidad, eliminarDelCarrito, vaciarCarrito };
