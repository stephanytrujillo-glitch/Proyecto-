const db = require('../config/db');

// POST /api/pedidos
const crearPedido = async (req, res) => {
  const { metodo_pago, direccion_entrega, ciudad_entrega, notas } = req.body;

  if (!direccion_entrega || !ciudad_entrega || !metodo_pago) {
    return res.status(400).json({ mensaje: 'Dirección, ciudad y método de pago son obligatorios' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Obtener items del carrito
    const [items] = await conn.query(
      `SELECT c.cantidad, p.id AS producto_id, p.precio, p.stock, p.nombre
       FROM carrito c JOIN productos p ON c.producto_id = p.id
       WHERE c.usuario_id = ?`,
      [req.usuario.id]
    );

    if (items.length === 0) {
      await conn.rollback();
      return res.status(400).json({ mensaje: 'El carrito está vacío' });
    }

    // Verificar stock
    for (const item of items) {
      if (item.stock < item.cantidad) {
        await conn.rollback();
        return res.status(400).json({ mensaje: `Stock insuficiente para: ${item.nombre}` });
      }
    }

    const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

    // Crear pedido
    const [pedido] = await conn.query(
      'INSERT INTO pedidos (usuario_id, total, metodo_pago, direccion_entrega, ciudad_entrega, notas) VALUES (?,?,?,?,?,?)',
      [req.usuario.id, total, metodo_pago, direccion_entrega, ciudad_entrega, notas]
    );

    // Insertar items y actualizar stock
    for (const item of items) {
      await conn.query(
        'INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?,?,?,?)',
        [pedido.insertId, item.producto_id, item.cantidad, item.precio]
      );
      await conn.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.producto_id]
      );
    }

    // Vaciar carrito
    await conn.query('DELETE FROM carrito WHERE usuario_id = ?', [req.usuario.id]);

    await conn.commit();
    res.status(201).json({ mensaje: 'Pedido creado exitosamente', pedido_id: pedido.insertId, total });
  } catch (error) {
    await conn.rollback();
    console.error('Error crear pedido:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
};

// GET /api/pedidos (mis pedidos)
const misPedidos = async (req, res) => {
  try {
    const [pedidos] = await db.query(
      `SELECT p.*, 
       JSON_ARRAYAGG(JSON_OBJECT('nombre', pr.nombre, 'cantidad', pi.cantidad, 'precio', pi.precio_unitario)) AS items
       FROM pedidos p
       LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
       LEFT JOIN productos pr ON pi.producto_id = pr.id
       WHERE p.usuario_id = ?
       GROUP BY p.id
       ORDER BY p.creado_en DESC`,
      [req.usuario.id]
    );
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// GET /api/pedidos/:id
const detallePedido = async (req, res) => {
  try {
    const [pedido] = await db.query(
      'SELECT * FROM pedidos WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuario.id]
    );
    if (pedido.length === 0) return res.status(404).json({ mensaje: 'Pedido no encontrado' });

    const [items] = await db.query(
      `SELECT pi.*, p.nombre, p.imagen_url FROM pedido_items pi
       JOIN productos p ON pi.producto_id = p.id WHERE pi.pedido_id = ?`,
      [req.params.id]
    );
    res.json({ ...pedido[0], items });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// GET /api/admin/pedidos (admin)
const todosPedidos = async (req, res) => {
  try {
    const [pedidos] = await db.query(
      `SELECT p.*, u.nombre AS cliente_nombre, u.correo AS cliente_correo
       FROM pedidos p JOIN usuarios u ON p.usuario_id = u.id
       ORDER BY p.creado_en DESC`
    );
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// PUT /api/admin/pedidos/:id (admin - cambiar estado)
const actualizarEstado = async (req, res) => {
  const { estado } = req.body;
  const estadosValidos = ['pendiente', 'confirmado', 'en_camino', 'entregado', 'cancelado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ mensaje: 'Estado no válido' });
  }
  try {
    await db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, req.params.id]);

    // HU020 - Notificar al cliente por correo (si hay correo configurado)
    try {
      const [info] = await db.query(
        `SELECT u.correo FROM pedidos p JOIN usuarios u ON p.usuario_id = u.id WHERE p.id = ?`,
        [req.params.id]
      );
      if (info.length > 0) {
        const { notificarEstadoPedido } = require('../utils/email');
        await notificarEstadoPedido(info[0].correo, req.params.id, estado);
      }
    } catch (e) {
      console.log('Notificación por correo no enviada (modo demo):', e.message);
    }

    res.json({ mensaje: 'Estado del pedido actualizado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// DELETE /api/admin/pedidos/:id (admin)
const eliminarPedido = async (req, res) => {
  try {
    await db.query('DELETE FROM pedido_items WHERE pedido_id = ?', [req.params.id]);
    await db.query('DELETE FROM pedidos WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Pedido eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminar pedido:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = { crearPedido, misPedidos, detallePedido, todosPedidos, actualizarEstado, eliminarPedido };