import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Lock, ArrowLeft, ArrowRight, Plus, Minus } from 'lucide-react';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import './Carrito.css';

const PLACEHOLDER = 'https://placehold.co/80x80/fce8ed/c4687c?text=B';

export default function Carrito() {
  const { carrito, actualizar, eliminar, cargando } = useCarrito();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  if (!usuario) {
    return (
      <div className="carrito-page">
        <div className="container carrito-empty">
          <Lock size={48} color="#e8a0b0" strokeWidth={1.5} />
          <h2>Inicia sesión para ver tu carrito</h2>
          <Link to="/login" className="btn btn-primary">Ingresar</Link>
        </div>
      </div>
    );
  }

  if (cargando) return <div className="spinner-wrap"><div className="spinner" /></div>;

  if (carrito.items.length === 0) {
    return (
      <div className="carrito-page">
        <div className="container carrito-empty">
          <ShoppingCart size={60} color="#e8a0b0" strokeWidth={1.2} />
          <h2>Tu carrito está vacío</h2>
          <p>¡Agrega productos del catálogo!</p>
          <Link to="/catalogo" className="btn btn-primary">
            Ir al catálogo <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-page">
      <div className="container">
        <h1 className="carrito-titulo">Mi carrito</h1>
        <div className="carrito-grid">
          <div className="carrito-items">
            {carrito.items.map(item => (
              <div key={item.id} className="carrito-item card">
                <img
                  src={item.imagen_url || PLACEHOLDER}
                  alt={item.nombre}
                  onError={e => { e.target.src = PLACEHOLDER; }}
                />
                <div className="item-info">
                  <h3>{item.nombre}</h3>
                  <p className="item-precio">${Number(item.precio).toLocaleString('es-CO')}</p>
                </div>
                <div className="item-cantidad">
                  <button onClick={() => actualizar(item.id, item.cantidad - 1)} disabled={item.cantidad <= 1}>
                    <Minus size={14} />
                  </button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => actualizar(item.id, item.cantidad + 1)} disabled={item.cantidad >= item.stock}>
                    <Plus size={14} />
                  </button>
                </div>
                <p className="item-subtotal">${(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
                <button className="item-del" onClick={() => eliminar(item.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="carrito-resumen card">
            <h3>Resumen del pedido</h3>
            <div className="resumen-filas">
              <div className="resumen-fila">
                <span>Subtotal ({carrito.items.reduce((s,i) => s+i.cantidad, 0)} artículos)</span>
                <span>${Number(carrito.total).toLocaleString('es-CO')}</span>
              </div>
              <div className="resumen-fila">
                <span>Envío</span>
                <span className="badge badge-green">A convenir</span>
              </div>
            </div>
            <hr />
            <div className="resumen-total">
              <span>Total</span>
              <span>${Number(carrito.total).toLocaleString('es-CO')}</span>
            </div>
            <button className="btn btn-primary btn-full" onClick={() => navigate('/checkout')}>
              Proceder al pago <ArrowRight size={16} />
            </button>
            <Link to="/catalogo" className="btn btn-ghost btn-full" style={{ marginTop: 10, justifyContent: 'center' }}>
              <ArrowLeft size={16} /> Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
