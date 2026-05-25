const db = require('../config/db');

// GET /api/productos
const obtenerProductos = async (req, res) => {
  try {
    const { categoria, marca, min_precio, max_precio, destacado, buscar } = req.query;
    let query = `
      SELECT p.*, c.nombre AS categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = TRUE
    `;
    const params = [];

    if (categoria) { query += ' AND p.categoria_id = ?'; params.push(categoria); }
    if (marca) { query += ' AND p.marca = ?'; params.push(marca); }
    if (min_precio) { query += ' AND p.precio >= ?'; params.push(min_precio); }
    if (max_precio) { query += ' AND p.precio <= ?'; params.push(max_precio); }
    if (destacado === 'true') { query += ' AND p.destacado = TRUE'; }
    if (buscar) { query += ' AND p.nombre LIKE ?'; params.push(`%${buscar}%`); }

    query += ' ORDER BY p.creado_en DESC';

    const [productos] = await db.query(query, params);
    res.json(productos);
  } catch (error) {
    console.error('Error obtener productos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// GET /api/productos/:id
const obtenerProducto = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.nombre AS categoria_nombre
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = ? AND p.activo = TRUE`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// POST /api/productos (admin)
const crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url, categoria_id, marca, destacado } = req.body;
  if (!nombre || !precio) return res.status(400).json({ mensaje: 'Nombre y precio son obligatorios' });
  try {
    const [result] = await db.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria_id, marca, destacado) VALUES (?,?,?,?,?,?,?,?)',
      [nombre, descripcion, precio, stock || 0, imagen_url, categoria_id, marca, destacado || false]
    );
    res.status(201).json({ mensaje: 'Producto creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// PUT /api/productos/:id (admin)
const actualizarProducto = async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url, categoria_id, marca, destacado, activo } = req.body;
  try {
    await db.query(
      'UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, imagen_url=?, categoria_id=?, marca=?, destacado=?, activo=? WHERE id=?',
      [nombre, descripcion, precio, stock, imagen_url, categoria_id, marca, destacado, activo, req.params.id]
    );
    res.json({ mensaje: 'Producto actualizado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// DELETE /api/productos/:id (admin - soft delete)
const eliminarProducto = async (req, res) => {
  try {
    await db.query('UPDATE productos SET activo = FALSE WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// GET /api/categorias
const obtenerCategorias = async (req, res) => {
  try {
    const [categorias] = await db.query('SELECT * FROM categorias');
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto, obtenerCategorias };
