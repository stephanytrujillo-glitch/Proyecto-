const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarCorreo(destinatario, asunto, html) {
  await resend.emails.send({
    from: 'Beauty by Salomé <onboarding@resend.dev>',
    to: destinatario,
    subject: asunto,
    html
  });
}

async function notificarEstadoPedido(correo, pedidoId, estado) {
  const estados = {
    pendiente:  'Tu pedido está pendiente de confirmación.',
    confirmado: '¡Tu pedido ha sido confirmado! Pronto lo prepararemos.',
    en_camino:  '¡Tu pedido va en camino! Ya casi llega.',
    entregado:  '¡Tu pedido ha sido entregado! Gracias por tu compra.',
    cancelado:  'Tu pedido ha sido cancelado.'
  };
  const mensaje = estados[estado] || `Estado actualizado: ${estado}`;
  await enviarCorreo(
    correo,
    `Actualización de tu pedido #${pedidoId} - Beauty by Salomé`,
    `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:30px;">
      <h2 style="color:#c4687c;">Beauty by Salomé Galindo</h2>
      <p>Hola, te informamos sobre tu pedido:</p>
      <div style="background:#fdf5f7;border-radius:10px;padding:20px;margin:20px 0;">
        <p><strong>Pedido #${pedidoId}</strong></p>
        <p>${mensaje}</p>
      </div>
      <p style="color:#9b7280;font-size:0.9rem;">Beauty by Salomé Galindo</p>
    </div>`
  );
}

module.exports = { enviarCorreo, notificarEstadoPedido };