import { Link } from 'react-router-dom';
import { Heart, MessageCircle, MapPin, Flower2, ShoppingBag, User, Package, Phone } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">
            <Flower2 size={18} color="#e8a0b0" strokeWidth={1.8} /> Beauty by Salomé
          </span>
          <p>Maquillaje, skincare y accesorios<br />con amor desde Ibagué / Espinal</p>
          <div className="footer-socials">
            <a href="https://instagram.com/beautybysalomegalindo" target="_blank" rel="noreferrer" className="social-btn">
              <Heart size={14} /> Instagram
            </a>
            <a href="https://wa.me/573218187880" target="_blank" rel="noreferrer" className="social-btn">
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        </div>
        <div className="footer-links">
          <h4>Tienda</h4>
          <Link to="/catalogo"><ShoppingBag size={13} /> Catálogo</Link>
          <Link to="/catalogo?destacado=true"><Package size={13} /> Destacados</Link>
        </div>
        <div className="footer-links">
          <h4>Mi cuenta</h4>
          <Link to="/login"><User size={13} /> Iniciar sesión</Link>
          <Link to="/registro"><User size={13} /> Registrarme</Link>
          <Link to="/mis-pedidos"><Package size={13} /> Mis pedidos</Link>
        </div>
        <div className="footer-links">
          <h4>Ayuda</h4>
          <Link to="/contacto"><Phone size={13} /> Contacto</Link>
          <p style={{fontSize:'0.83rem', color:'#c9a0ab', display:'flex', alignItems:'center', gap:'6px'}}>
            <MapPin size={13} /> Ibagué / Espinal, Tolima
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Beauty by Salomé Galindo · Todos los derechos reservados</p>
      </div>
    </footer>
  );
}
