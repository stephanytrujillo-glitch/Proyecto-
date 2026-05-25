import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Pencil, Trash2, RefreshCw, Plus, X, Star, LayoutDashboard } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

const ESTADOS = ['pendiente','confirmado','en_camino','entregado','cancelado'];
const ESTADO_BADGE = {
  pendiente: 'badge-yellow', confirmado: 'badge-blue',
  en_camino: 'badge-pink',  entregado:  'badge-green',
  cancelado: 'badge-red',
};

const PRODUCTO_VACIO = {
  nombre:'', descripcion:'', precio:'', stock:'',
  imagen_url:'', categoria_id:'', marca:'', destacado: false
};

export default function Admin() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loadingProds, setLoadingProds] = useState(true);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(PRODUCTO_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loadingPeds, setLoadingPeds] = useState(false);

  useEffect(() => {
    if (!usuario || usuario.rol !== 'admin') { navigate('/'); return; }
  }, [usuario, navigate]);

  useEffect(() => {
    if (tab === 'productos') cargarProductos();
    if (tab === 'pedidos') cargarPedidos();
  }, [tab]);

  const cargarProductos = async () => {
    setLoadingProds(true);
    try {
      const [p, c] = await Promise.all([api.get('/productos'), api.get('/categorias')]);
      setProductos(p.data);
      setCategorias(c.data);
    } catch (e) { console.error(e); }
    finally { setLoadingProds(false); }
  };

  const cargarPedidos = async () => {
    setLoadingPeds(true);
    try {
      const { data } = await api.get('/admin/pedidos');
      setPedidos(data);
    } catch (e) { console.error(e); }
    finally { setLoadingPeds(false); }
  };

  const abrirModal = (prod = null) => {
    setEditando(prod);
    setForm(prod ? {
      nombre: prod.nombre, descripcion: prod.descripcion || '',
      precio: prod.precio, stock: prod.stock,
      imagen_url: prod.imagen_url || '', categoria_id: prod.categoria_id || '',
      marca: prod.marca || '', destacado: prod.destacado
    } : PRODUCTO_VACIO);
    setModal(true);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      if (editando) {
        await api.put(`/productos/${editando.id}`, { ...form, activo: true });
      } else {
        await api.post('/productos', form);
      }
      setModal(false);
      cargarProductos();
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    await api.delete(`/productos/${id}`);
    cargarProductos();
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await api.put(`/admin/pedidos/${id}`, { estado });
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
    } catch (e) { alert('Error al actualizar estado'); }
  };

  const eliminarPedido = async (id) => {
    if (!window.confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) return;
    try {
      await api.delete(`/admin/pedidos/${id}`);
      setPedidos(prev => prev.filter(p => p.id !== id));
    } catch (e) { alert('Error al eliminar el pedido'); }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1><LayoutDashboard size={26} style={{verticalAlign:'middle', marginRight:8}} />Panel de administración</h1>
          <p>Gestiona productos y pedidos de Beauty by Salomé</p>
        </div>

        <div className="admin-tabs">
          <button className={`tab-btn ${tab === 'productos' ? 'active' : ''}`} onClick={() => setTab('productos')}>
            <ShoppingBag size={16} /> Productos ({productos.length})
          </button>
          <button className={`tab-btn ${tab === 'pedidos' ? 'active' : ''}`} onClick={() => setTab('pedidos')}>
            <Package size={16} /> Pedidos ({pedidos.length})
          </button>
        </div>

        {tab === 'productos' && (
          <div className="admin-section">
            <div className="admin-section-head">
              <h3>Catálogo de productos</h3>
              <button className="btn btn-primary btn-sm" onClick={() => abrirModal()}>
                <Plus size={15} /> Agregar producto
              </button>
            </div>
            {loadingProds ? (
              null
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Destacado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="prod-cell">
                            <img
                              src={p.imagen_url || 'https://placehold.co/40x40/fce8ed/c4687c?text=B'}
                              alt=""
                              onError={e => { e.target.src = 'https://placehold.co/40x40/fce8ed/c4687c?text=B'; }}
                            />
                            <div>
                              <strong>{p.nombre}</strong>
                              <small>{p.marca}</small>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge badge-pink">{p.categoria_nombre || '—'}</span></td>
                        <td>${Number(p.precio).toLocaleString('es-CO')}</td>
                        <td><span className={`badge ${p.stock > 0 ? 'badge-green' : 'badge-red'}`}>{p.stock}</span></td>
                        <td>{p.destacado ? <Star size={16} fill="#c4687c" color="#c4687c" /> : '—'}</td>
                        <td>
                          <div className="table-acciones">
                            <button className="btn btn-ghost btn-sm" onClick={() => abrirModal(p)}>
                              <Pencil size={14} /> Editar
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(p.id)}>
                              <Trash2 size={14} /> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'pedidos' && (
          <div className="admin-section">
            <div className="admin-section-head">
              <h3>Todos los pedidos</h3>
              <button className="btn btn-ghost btn-sm" onClick={cargarPedidos}>
                <RefreshCw size={14} /> Actualizar
              </button>
            </div>
            {loadingPeds ? (
              null
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Cliente</th>
                      <th>Total</th>
                      <th>Pago</th>
                      <th>Ciudad</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map(p => (
                      <tr key={p.id}>
                        <td><strong>#{p.id}</strong></td>
                        <td>
                          <div>
                            <strong>{p.cliente_nombre}</strong>
                            <small>{p.cliente_correo}</small>
                          </div>
                        </td>
                        <td>${Number(p.total).toLocaleString('es-CO')}</td>
                        <td><span className="badge badge-pink">{p.metodo_pago}</span></td>
                        <td>{p.ciudad_entrega}</td>
                        <td>{new Date(p.creado_en).toLocaleDateString('es-CO')}</td>
                        <td>
                          <select
                            className={`estado-select badge ${ESTADO_BADGE[p.estado]}`}
                            value={p.estado}
                            onChange={e => cambiarEstado(p.id, e.target.value)}
                          >
                            {ESTADOS.map(s => (
                              <option key={s} value={s}>{s.replace('_', ' ')}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => eliminarPedido(p.id)}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-card card" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editando ? 'Editar producto' : 'Nuevo producto'}</h3>
              <button onClick={() => setModal(false)} className="modal-close"><X size={16} /></button>
            </div>
            <form onSubmit={guardarProducto} className="modal-form">
              <div className="form-row">
                <div className="input-group">
                  <label>Nombre *</label>
                  <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Marca</label>
                  <input value={form.marca} onChange={e => setForm({...form, marca: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Precio *</label>
                  <input type="number" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required min="0" />
                </div>
                <div className="input-group">
                  <label>Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} min="0" />
                </div>
              </div>
              <div className="input-group">
                <label>Categoría</label>
                <select value={form.categoria_id} onChange={e => setForm({...form, categoria_id: e.target.value})}>
                  <option value="">Sin categoría</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>URL de imagen</label>
                <input value={form.imagen_url} onChange={e => setForm({...form, imagen_url: e.target.value})} placeholder="https://..." />
              </div>
              <div className="input-group">
                <label>Descripción</label>
                <textarea rows={3} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
              </div>
              <label className="check-label">
                <input type="checkbox" checked={form.destacado} onChange={e => setForm({...form, destacado: e.target.checked})} />
                <Star size={15} color="#c4687c" fill={form.destacado ? "#c4687c" : "none"} /> Marcar como destacado
              </label>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={guardando}>
                  {guardando ? 'Guardando...' : (editando ? 'Actualizar' : 'Crear producto')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}