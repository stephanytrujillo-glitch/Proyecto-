const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// POST /api/auth/registro
const registro = async (req, res) => {
  const { nombre, correo, contrasena, telefono } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Nombre, correo y contraseña son obligatorios' });
  }

  try {
    const [existe] = await db.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (existe.length > 0) {
      return res.status(409).json({ mensaje: 'El correo ya está registrado' });
    }

    const hash = await bcrypt.hash(contrasena, 10);
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, correo, contrasena, telefono) VALUES (?, ?, ?, ?)',
      [nombre, correo, hash, telefono || null]
    );

    const token = jwt.sign(
      { id: result.insertId, correo, rol: 'cliente' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '7d' }
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: { id: result.insertId, nombre, correo, rol: 'cliente' }
    });
  } catch (error) {
    console.error('Error registro:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (rows.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const usuario = rows[0];
    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!coincide) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '7d' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol }
    });
  } catch (error) {
    console.error('Error login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// GET /api/auth/perfil
const perfil = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nombre, correo, telefono, rol, creado_en FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );
    if (rows.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// PUT /api/auth/perfil
const actualizarPerfil = async (req, res) => {
  const { nombre, telefono } = req.body;
  try {
    await db.query(
      'UPDATE usuarios SET nombre = ?, telefono = ? WHERE id = ?',
      [nombre, telefono, req.usuario.id]
    );
    res.json({ mensaje: 'Perfil actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// POST /api/auth/google
const loginGoogle = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ mensaje: 'Token requerido' });

  try {
    // Decodificar el JWT de Google (sin verificar firma — para prototipo)
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const { email, name, sub } = payload;

    if (!email) return res.status(400).json({ mensaje: 'No se pudo obtener el correo de Google' });

    // Buscar si ya existe
    let [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [email]);
    let usuario;

    if (rows.length > 0) {
      usuario = rows[0];
    } else {
      // Crear usuario nuevo con contraseña aleatoria
      const hash = await bcrypt.hash(sub + Date.now(), 10);
      const [result] = await db.query(
        'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)',
        [name, email, hash]
      );
      usuario = { id: result.insertId, nombre: name, correo: email, rol: 'cliente' };
    }

    const jwtToken = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '7d' }
    );

    res.json({
      mensaje: 'Login con Google exitoso',
      token: jwtToken,
      usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol }
    });
  } catch (error) {
    console.error('Error login Google:', error);
    res.status(500).json({ mensaje: 'Error al procesar login con Google' });
  }
};

// ============================================
// HU016 - RECUPERAR CONTRASEÑA
// ============================================

// POST /api/auth/recuperar  -> genera un código y lo "envía"
const recuperarContrasena = async (req, res) => {
  const { correo } = req.body;
  if (!correo) return res.status(400).json({ mensaje: 'El correo es obligatorio' });

  try {
    const [rows] = await db.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (rows.length === 0) {
      // Por seguridad, respondemos igual aunque no exista
      return res.json({ mensaje: 'Si el correo existe, recibirás un código de recuperación.' });
    }

    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardar el código y su expiración (15 min) en la base de datos
    await db.query(
      'UPDATE usuarios SET reset_codigo = ?, reset_expira = DATE_ADD(NOW(), INTERVAL 15 MINUTE) WHERE correo = ?',
      [codigo, correo]
    );

    // Intentar enviar el código por correo (si hay configuración de correo)
    let enviado = false;
    try {
      const { enviarCorreo } = require('../utils/email');
      await enviarCorreo(
        correo,
        'Recuperación de contraseña - Beauty by Salomé',
        `<h2>Recuperación de contraseña</h2>
         <p>Tu código de recuperación es:</p>
         <h1 style="letter-spacing:4px;color:#c4687c;">${codigo}</h1>
         <p>Este código expira en 15 minutos.</p>`
      );
      enviado = true;
    } catch (e) {
      console.error('❌ Error al enviar correo:', e.message);
      console.log('Código demo:', codigo);
    }

    // En modo demo (sin correo configurado) devolvemos el código para poder probar
    res.json({
      mensaje: 'Código de recuperación generado.',
      enviado,
      ...(enviado ? {} : { codigo_demo: codigo })
    });
  } catch (error) {
    console.error('Error recuperar contraseña:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// POST /api/auth/restablecer  -> valida el código y cambia la contraseña
const restablecerContrasena = async (req, res) => {
  const { correo, codigo, nueva_contrasena } = req.body;
  if (!correo || !codigo || !nueva_contrasena) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }
  if (nueva_contrasena.length < 6) {
    return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const [rows] = await db.query(
      'SELECT id, reset_codigo, reset_expira FROM usuarios WHERE correo = ?',
      [correo]
    );
    if (rows.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const usuario = rows[0];
    if (!usuario.reset_codigo || usuario.reset_codigo !== codigo) {
      return res.status(400).json({ mensaje: 'Código incorrecto' });
    }
    if (new Date(usuario.reset_expira) < new Date()) {
      return res.status(400).json({ mensaje: 'El código ha expirado' });
    }

    const hash = await bcrypt.hash(nueva_contrasena, 10);
    await db.query(
      'UPDATE usuarios SET contrasena = ?, reset_codigo = NULL, reset_expira = NULL WHERE id = ?',
      [hash, usuario.id]
    );

    res.json({ mensaje: 'Contraseña restablecida correctamente. Ya puedes iniciar sesión.' });
  } catch (error) {
    console.error('Error restablecer contraseña:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// ============================================
// HU017 - DIRECCIONES GUARDADAS
// ============================================

// GET /api/auth/direcciones
const obtenerDirecciones = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM direcciones WHERE usuario_id = ? ORDER BY es_principal DESC, id DESC',
      [req.usuario.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// POST /api/auth/direcciones
const crearDireccion = async (req, res) => {
  const { direccion, ciudad, departamento, codigo_postal, es_principal } = req.body;
  if (!direccion || !ciudad) {
    return res.status(400).json({ mensaje: 'Dirección y ciudad son obligatorias' });
  }
  try {
    // Si es principal, quitar el principal anterior
    if (es_principal) {
      await db.query('UPDATE direcciones SET es_principal = FALSE WHERE usuario_id = ?', [req.usuario.id]);
    }
    const [result] = await db.query(
      'INSERT INTO direcciones (usuario_id, direccion, ciudad, departamento, codigo_postal, es_principal) VALUES (?,?,?,?,?,?)',
      [req.usuario.id, direccion, ciudad, departamento || null, codigo_postal || null, es_principal || false]
    );
    res.status(201).json({ mensaje: 'Dirección guardada', id: result.insertId });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// DELETE /api/auth/direcciones/:id
const eliminarDireccion = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM direcciones WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuario.id]
    );
    res.json({ mensaje: 'Dirección eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = {
  registro, login, perfil, actualizarPerfil, loginGoogle,
  recuperarContrasena, restablecerContrasena,
  obtenerDirecciones, crearDireccion, eliminarDireccion
};