import { MapPin, MessageCircle, Heart, Clock, Phone } from 'lucide-react';
import './Contacto.css';

export default function Contacto() {
  return (
    <div className="contacto-page">
      <div className="container">
        <div className="contacto-header">
          <h1>Contáctanos</h1>
          <p>Estamos aquí para ayudarte con cualquier duda sobre productos, pedidos o entregas.</p>
        </div>

        <div className="contacto-grid">
          <div className="contacto-info">
            <div className="info-card card">
              <MapPin size={28} color="#c4687c" strokeWidth={1.5} />
              <div>
                <h4>Ubicación</h4>
                <p>Ibagué / Espinal, Tolima, Colombia</p>
              </div>
            </div>
            <div className="info-card card">
              <MessageCircle size={28} color="#c4687c" strokeWidth={1.5} />
              <div>
                <h4>WhatsApp</h4>
                <a href="https://wa.me/573000000000" target="_blank" rel="noreferrer" className="contacto-link">
                  +57 300 000 0000
                </a>
              </div>
            </div>
            <div className="info-card card">
              <Heart size={28} color="#c4687c" strokeWidth={1.5} />
              <div>
                <h4>Instagram</h4>
                <a href="https://instagram.com/beautybysalomegalindo" target="_blank" rel="noreferrer" className="contacto-link">
                  @beautybysalomegalindo
                </a>
              </div>
            </div>
            <div className="info-card card">
              <Clock size={28} color="#c4687c" strokeWidth={1.5} />
              <div>
                <h4>Horario de atención</h4>
                <p>Lunes a Viernes: 8am – 6pm<br />Sábados: 9am – 2pm</p>
              </div>
            </div>
          </div>

          <div className="contacto-form card">
            <h3>Envíanos un mensaje</h3>
            <p className="form-nota">Completa el formulario y te responderemos lo más pronto posible.</p>
            <div className="input-group">
              <label>Nombre</label>
              <input type="text" placeholder="Tu nombre" />
            </div>
            <div className="input-group">
              <label>Correo electrónico</label>
              <input type="email" placeholder="tucorreo@ejemplo.com" />
            </div>
            <div className="input-group">
              <label>Asunto</label>
              <input type="text" placeholder="¿En qué te podemos ayudar?" />
            </div>
            <div className="input-group">
              <label>Mensaje</label>
              <textarea rows={5} placeholder="Escribe tu mensaje aquí..." />
            </div>
            <a
              href="https://wa.me/573000000000"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{ alignSelf: 'flex-start' }}
            >
              <MessageCircle size={16} /> Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
