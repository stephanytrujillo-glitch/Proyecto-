import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Banknote, Smartphone, Truck, CheckCircle, ShoppingBag, MapPin, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useCarrito } from '../context/CarritoContext';
import './Checkout.css';

export default function Checkout() {
  const { carrito, vaciar } = useCarrito();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    direccion_entrega: '',
    ciudad_entrega: '',
    metodo_pago: 'transferencia',
    notas: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const { data } = await api.post('/pedidos', form);
      setExito(data);
      await vaciar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al procesar el pedido');
    } finally {
      setCargando(false);
    }
  };

  if (exito) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="exito-card card">
            <CheckCircle size={64} color="#16a34a" strokeWidth={1.5} />
            <h2>¡Pedido confirmado!</h2>
            <p>Tu pedido <strong>#{exito.pedido_id}</strong> ha sido recibido exitosamente.</p>
            <p className="exito-total">Total: <strong>${Number(exito.total).toLocaleString('es-CO')}</strong></p>
            <p className="exito-nota">Nos pondremos en contacto contigo para coordinar el pago y la entrega.</p>
            <div className="exito-acciones">
              <Link to="/mis-pedidos" className="btn btn-primary">Ver mis pedidos <ArrowRight size={16} /></Link>
              <Link to="/catalogo" className="btn btn-outline">Seguir comprando</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-titulo">Finalizar pedido</h1>
        <div className="checkout-grid">
          <form className="checkout-form card" onSubmit={handleSubmit}>
            <h3><MapPin size={18} /> Información de entrega</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="input-group">
              <label>Dirección de entrega *</label>
              <input
                type="text"
                value={form.direccion_entrega}
                onChange={e => setForm({...form, direccion_entrega: e.target.value})}
                placeholder="Calle 123 # 45-67"
                required
              />
            </div>
            <div className="input-group">
              <label>Ciudad *</label>
              <input
                type="text"
                value={form.ciudad_entrega}
                onChange={e => setForm({...form, ciudad_entrega: e.target.value})}
                placeholder="Ibagué"
                required
              />
            </div>
            <h3 style={{ marginTop: 8 }}>Método de pago</h3>
            <div className="metodos-pago">
              {[
                { val: 'transferencia', icon: <Banknote size={22} />, label: 'Transferencia bancaria' },
                { val: 'nequi', icon: <Smartphone size={22} />, label: 'Nequi' },
                { val: 'contra_entrega', icon: <Truck size={22} />, label: 'Contra entrega' },
              ].map(m => (
                <label key={m.val} className={`metodo-option ${form.metodo_pago === m.val ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="metodo_pago"
                    value={m.val}
                    checked={form.metodo_pago === m.val}
                    onChange={e => setForm({...form, metodo_pago: e.target.value})}
                  />
                  <span className="metodo-icon">{m.icon}</span>
                  <span>{m.label}</span>
                </label>
              ))}
            </div>
            <div className="input-group">
              <label>Notas adicionales (opcional)</label>
              <textarea
                value={form.notas}
                onChange={e => setForm({...form, notas: e.target.value})}
                placeholder="Instrucciones especiales para la entrega..."
                rows={3}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={cargando}>
              {cargando ? 'Procesando...' : `Confirmar pedido — $${Number(carrito.total).toLocaleString('es-CO')}`}
            </button>
          </form>

          <div className="checkout-resumen card">
            <h3><ShoppingBag size={18} /> Resumen ({carrito.items.length} productos)</h3>
            <div className="resumen-items">
              {carrito.items.map(item => (
                <div key={item.id} className="resumen-item">
                  <span className="ri-nombre">{item.nombre}</span>
                  <span className="ri-cantidad">×{item.cantidad}</span>
                  <span className="ri-precio">${(item.precio * item.cantidad).toLocaleString('es-CO')}</span>
                </div>
              ))}
            </div>
            <hr />
            <div className="resumen-total">
              <strong>Total</strong>
              <strong>${Number(carrito.total).toLocaleString('es-CO')}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
