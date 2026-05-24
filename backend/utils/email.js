// ============================================
// Utilidad para enviar correos (HU016 y HU020)
// ============================================
// Usa nodemailer. Si no hay configuración de correo en el .env,
// las funciones simplemente lanzan un error controlado y el sistema
// sigue funcionando en "modo demo".

let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}

// Crea el "transporter" solo si hay credenciales configuradas en .env
function obtenerTransporter() {
  if (!nodemailer) {
    throw new Error('nodemailer no está instalado');
  }
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('No hay configuración de correo en el .env (EMAIL_USER / EMAIL_PASS)');
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// Envía un correo. Lanza error si no hay configuración (lo captura quien llama).
async function enviarCorreo(destinatario, asunto, html) {
  const transporter = obtenerTransporter();
  await transporter.sendMail({
    from: `"Beauty by Salomé" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: asunto,
    html
  });
}

// HU020 - Notificación de cambio de estado de pedido
async function notificarEstadoPedido(correo, pedidoId, estado) {
  const estados = {
    pendiente:  'Tu pedido está pendiente de confirmación.',
    confirmado: 'Tu pedido ha sido confirmado. ¡Pronto lo prepararemos!',
    en_camino:  'Tu pedido va en camino. ¡Ya casi llega!',
    entregado:  'Tu pedido ha sido entregado. ¡Gracias por tu compra!',
    cancelado:  'Tu pedido ha sido cancelado.'
  };
  const mensaje = estados[estado] || `Estado actualizado: ${estado}`;
  await enviarCorreo(
    correo,
    `Actualización de tu pedido #${pedidoId} - Beauty by Salomé`,
    `<h2>Actualización de tu pedido</h2>
     <p>Pedido <strong>#${pedidoId}</strong></p>
     <p>${mensaje}</p>
     <p style="color:#c4687c;">Beauty by Salomé Galindo 🌸</p>`
  );
}

module.exports = { enviarCorreo, notificarEstadoPedido };
