import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, CreditCard, ChevronDown, ChevronUp, ShoppingBag, FileText, ArrowRight, Download } from 'lucide-react';
import api from '../services/api';
import './MisPedidos.css';

const ESTADOS = {
  pendiente:  { label: 'Pendiente',  clase: 'badge-yellow' },
  confirmado: { label: 'Confirmado', clase: 'badge-blue'   },
  en_camino:  { label: 'En camino',  clase: 'badge-pink'   },
  entregado:  { label: 'Entregado',  clase: 'badge-green'  },
  cancelado:  { label: 'Cancelado',  clase: 'badge-red'    },
};

const METODOS = {
  transferencia:  'Transferencia',
  nequi:          'Nequi',
  contra_entrega: 'Contra entrega',
};

export default function MisPedidos() {
  const [pedidos, setPedidos]   = useState([]);
  const [cargando, setCargando] = useState(true);
  const [abierto, setAbierto]   = useState(null);

  useEffect(() => {
    api.get('/pedidos')
      .then(r => setPedidos(r.data))
      .catch(console.error)
      .finally(() => setCargando(false));
  }, []);

  const descargarRecibo = (p, items) => {
    const fecha = new Date(p.creado_en).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    const filas = items.filter(i => i && i.nombre).map(item => `
      <tr>
        <td>${item.nombre}</td>
        <td style="text-align:center;">${item.cantidad}</td>
        <td style="text-align:right;">$${Number(item.precio).toLocaleString('es-CO')}</td>
        <td style="text-align:right;">$${Number(item.precio * item.cantidad).toLocaleString('es-CO')}</td>
      </tr>`).join('');

    const html = `
      <html><head><meta charset="utf-8"/>
      <title>Recibo Pedido #${p.id}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #3a2329; padding: 40px; max-width: 700px; margin: 0 auto; }
        h1 { color: #c4687c; text-align: center; margin-bottom: 4px; }
        .sub { text-align: center; color: #9b7280; margin-bottom: 30px; }
        .info { margin-bottom: 20px; line-height: 1.8; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f7e6ea; text-align: left; padding: 10px; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
        .total { text-align: right; font-size: 1.2rem; color: #c4687c; font-weight: bold; margin-top: 10px; }
        .footer { text-align: center; margin-top: 40px; color: #9b7280; font-size: 0.9rem; }
      </style></head><body>
        <div style="text-align:center;margin-bottom:6px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c4687c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <h1>Beauty by Salomé Galindo</h1>
        <p class="sub">Recibo de compra</p>
        <div class="info">
          <strong>Pedido #${p.id}</strong><br/>
          Fecha: ${fecha}<br/>
          Estado: ${(ESTADOS[p.estado] || { label: p.estado }).label}<br/>
          Dirección de entrega: ${p.direccion_entrega}, ${p.ciudad_entrega}<br/>
          Método de pago: ${METODOS[p.metodo_pago] || p.metodo_pago}
        </div>
        <table>
          <thead><tr>
            <th>Producto</th>
            <th style="text-align:center;">Cant.</th>
            <th style="text-align:right;">Precio</th>
            <th style="text-align:right;">Subtotal</th>
          </tr></thead>
          <tbody>${filas}</tbody>
        </table>
        <p class="total">Total: $${Number(p.total).toLocaleString('es-CO')}</p>
        <p class="footer">¡Gracias por tu compra!<br/>Beauty by Salomé Galindo</p>
      </body></html>`;

    // iframe oculto: dispara el diálogo de guardar PDF sin abrir ninguna ventana
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none;';
    document.body.appendChild(iframe);
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 2000);
  };

  if (cargando) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="pedidos-page">
      <div className="container">
        <h1 className="pedidos-titulo">Mis pedidos</h1>

        {pedidos.length === 0 ? (
          <div className="pedidos-empty">
            <Package size={60} color="#e8a0b0" strokeWidth={1.2} />
            <h3>Aún no tienes pedidos</h3>
            <p>¡Explora el catálogo y haz tu primera compra!</p>
            <Link to="/catalogo" className="btn btn-primary">
              Ir al catálogo <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="pedidos-lista">
            {pedidos.map(p => {
              const estado = ESTADOS[p.estado] || { label: p.estado, clase: 'badge-pink' };
              const items  = typeof p.items === 'string' ? JSON.parse(p.items) : (p.items || []);
              const isOpen = abierto === p.id;

              return (
                <div key={p.id} className="pedido-card card">
                  <div className="pedido-header" onClick={() => setAbierto(isOpen ? null : p.id)}>
                    <div className="pedido-meta">
                      <strong className="pedido-id">Pedido #{p.id}</strong>
                      <span className="pedido-fecha">
                        {new Date(p.creado_en).toLocaleDateString('es-CO', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="pedido-right">
                      <span className={`badge ${estado.clase}`}>{estado.label}</span>
                      <strong className="pedido-total">${Number(p.total).toLocaleString('es-CO')}</strong>
                      {isOpen ? <ChevronUp size={16} color="#9b7280" /> : <ChevronDown size={16} color="#9b7280" />}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="pedido-detalle">
                      <div className="pedido-info-row">
                        <div><MapPin size={14} /> {p.direccion_entrega}, {p.ciudad_entrega}</div>
                        <div><CreditCard size={14} /> {METODOS[p.metodo_pago] || p.metodo_pago}</div>
                      </div>
                      <div className="pedido-items-lista">
                        <h4>Productos:</h4>
                        {items.filter(i => i && i.nombre).map((item, idx) => (
                          <div key={idx} className="pi-row">
                            <ShoppingBag size={13} color="#c4687c" />
                            <span className="pi-nombre">{item.nombre}</span>
                            <span className="pi-qty">×{item.cantidad}</span>
                            <span className="pi-precio">${Number(item.precio).toLocaleString('es-CO')}</span>
                          </div>
                        ))}
                      </div>
                      {p.notas && (
                        <p className="pedido-notas"><FileText size={14} /> {p.notas}</p>
                      )}
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ marginTop: '1rem' }}
                        onClick={() => descargarRecibo(p, items)}
                      >
                        <Download size={15} /> Descargar recibo
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}