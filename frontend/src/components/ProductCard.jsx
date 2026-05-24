import { Link } from 'react-router-dom';
import { ShoppingCart, Star, PackageX } from 'lucide-react';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const PLACEHOLDER = 'https://placehold.co/320x320/fce8ed/c4687c?text=Beauty';

export default function ProductCard({ producto }) {
  const { agregar } = useCarrito();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const handleAgregar = async (e) => {
    e.preventDefault();
    if (!usuario) { navigate('/login'); return; }
    try {
      await agregar(producto.id, 1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Link to={`/producto/${producto.id}`} className="product-card card">
      <div className="product-img-wrap">
        <img
          src={producto.imagen_url || PLACEHOLDER}
          alt={producto.nombre}
          onError={e => { e.target.src = PLACEHOLDER; }}
        />
        {producto.destacado && (
          <span className="product-badge badge badge-pink">
            <Star size={11} fill="#c4687c" /> Destacado
          </span>
        )}
        {producto.stock === 0 && (
          <div className="product-agotado">
            <PackageX size={20} /> Agotado
          </div>
        )}
      </div>
      <div className="product-info">
        <p className="product-marca">{producto.marca}</p>
        <h3 className="product-nombre">{producto.nombre}</h3>
        <p className="product-categoria">{producto.categoria_nombre}</p>
        <div className="product-footer">
          <span className="product-precio">${Number(producto.precio).toLocaleString('es-CO')}</span>
          <button
            className="btn btn-primary btn-sm add-btn"
            onClick={handleAgregar}
            disabled={producto.stock === 0}
          >
            <ShoppingCart size={14} />
            {producto.stock === 0 ? 'Agotado' : 'Agregar'}
          </button>
        </div>
      </div>
    </Link>
  );
}
