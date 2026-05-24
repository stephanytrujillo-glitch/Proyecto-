import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Flower2, ChevronDown, Package, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import './Navbar.css';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const { totalItems } = useCarrito();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <Flower2 size={24} color="#c4687c" strokeWidth={1.8} />
          <span className="logo-text">
            <span className="logo-beauty">Beauty</span>
            <span className="logo-by"> by Salomé</span>
          </span>
        </Link>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>Inicio</Link></li>
          <li><Link to="/catalogo" className={isActive('/catalogo')} onClick={() => setMenuOpen(false)}>Catálogo</Link></li>
          <li><Link to="/contacto" className={isActive('/contacto')} onClick={() => setMenuOpen(false)}>Contacto</Link></li>
          {usuario?.rol === 'admin' && (
            <li><Link to="/admin" className={isActive('/admin')} onClick={() => setMenuOpen(false)}>Admin</Link></li>
          )}
        </ul>

        <div className="navbar-actions">
          <Link to="/carrito" className="cart-btn">
            <ShoppingCart size={20} strokeWidth={1.8} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {usuario ? (
            <div className="user-menu-wrap">
              <button className="user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <span className="user-avatar">{usuario.nombre[0].toUpperCase()}</span>
                <span className="user-name">{usuario.nombre.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/perfil" onClick={() => setUserMenuOpen(false)}>
                    <User size={15} /> Mi perfil
                  </Link>
                  <Link to="/mis-pedidos" onClick={() => setUserMenuOpen(false)}>
                    <Package size={15} /> Mis pedidos
                  </Link>
                  {usuario.rol === 'admin' && (
                    <Link to="/admin" onClick={() => setUserMenuOpen(false)}>
                      <Shield size={15} /> Panel admin
                    </Link>
                  )}
                  <hr />
                  <button onClick={handleLogout}>
                    <LogOut size={15} /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">Ingresar</Link>
              <Link to="/registro" className="btn btn-primary btn-sm">Registrarme</Link>
            </div>
          )}

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
