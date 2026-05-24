import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Star, Package, Truck, CreditCard, Gift, ChevronRight, Plus, Minus } from 'lucide-react';
import api from '../services/api';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import './DetalleProducto.css';

const PLACEHOLDER = 'https://placehold.co/500x500/fce8ed/c4687c?text=Beauty';

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const { agregar } = useCarrito();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await api.get(`/productos/${id}`);
        setProducto(data);
      } catch {
        navigate('/catalogo');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id, navigate]);

  const handleAgregar = async () => {
    if (!usuario) { navigate('/login'); return; }
    try {
      await agregar(producto.id, cantidad);
      setMensaje('success');
      setTimeout(() => setMensaje(''), 3000);
    } catch {
      setMensaje('error');
    }
  };

  if (cargando) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!producto) return null;

  const agotado = producto.stock === 0;

  return (
    <div className="detalle-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Inicio</Link>
          <ChevronRight size={14} />
          <Link to="/catalogo">Catálogo</Link>
          <ChevronRight size={14} />
          <span>{producto.nombre}</span>
        </nav>

        <div className="detalle-grid">
          <div className="detalle-img">
            <img
              src={producto.imagen_url || PLACEHOLDER}
              alt={producto.nombre}
              onError={e => { e.target.src = PLACEHOLDER; }}
            />
            {producto.destacado && (
              <span className="badge badge-pink detalle-badge">
                <Star size={11} fill="#c4687c" /> Destacado
              </span>
            )}
          </div>

          <div className="detalle-info">
            <p className="detalle-marca">{producto.marca}</p>
            <h1 className="detalle-nombre">{producto.nombre}</h1>
            <span className="badge badge-pink">{producto.categoria_nombre}</span>
            <p className="detalle-precio">${Number(producto.precio).toLocaleString('es-CO')}</p>
            {producto.descripcion && <p className="detalle-desc">{producto.descripcion}</p>}

            <div className="detalle-stock">
              {agotado
                ? <span className="badge badge-red"><Package size={13} /> Agotado</span>
                : <span className="badge badge-green"><Package size={13} /> En stock ({producto.stock} disponibles)</span>
              }
            </div>

            {!agotado && (
              <div className="detalle-cantidad">
                <label>Cantidad:</label>
                <div className="cantidad-ctrl">
                  <button onClick={() => setCantidad(c => Math.max(1, c - 1))}><Minus size={14} /></button>
                  <span>{cantidad}</span>
                  <button onClick={() => setCantidad(c => Math.min(producto.stock, c + 1))}><Plus size={14} /></button>
                </div>
              </div>
            )}

            {mensaje === 'success' && <div className="alert alert-success">Producto agregado al carrito</div>}
            {mensaje === 'error' && <div className="alert alert-error">Error al agregar al carrito</div>}

            <div className="detalle-acciones">
              <button className="btn btn-primary" onClick={handleAgregar} disabled={agotado} style={{ flex: 1 }}>
                <ShoppingCart size={16} />
                {agotado ? 'Agotado' : 'Agregar al carrito'}
              </button>
              <Link to="/carrito" className="btn btn-outline">Ver carrito</Link>
            </div>

            <div className="detalle-extras">
              <div className="extra-item"><Truck size={16} color="#c4687c" /> <span>Envío a toda Colombia</span></div>
              <div className="extra-item"><CreditCard size={16} color="#c4687c" /> <span>Nequi / Transferencia / Contra entrega</span></div>
              <div className="extra-item"><Gift size={16} color="#c4687c" /> <span>Empaque especial incluido</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
