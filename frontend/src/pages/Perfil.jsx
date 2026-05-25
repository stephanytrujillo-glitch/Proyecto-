import { useState, useEffect } from 'react';
import { User, Phone, Mail, Save, Shield, MapPin, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Perfil.css';

export default function Perfil() {
  const { usuario, actualizarUsuario } = useAuth();
  const [form, setForm] = useState({ nombre: usuario?.nombre || '', telefono: usuario?.telefono || '' });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState('');

  // HU017 - Direcciones
  const [direcciones, setDirecciones] = useState([]);
  const [nuevaDir, setNuevaDir] = useState({ direccion: '', ciudad: '', departamento: '', es_principal: false });
  const [mostrarForm, setMostrarForm] = useState(false);

  useEffect(() => {
    api.get('/auth/perfil')
      .then(r => setForm({ nombre: r.data.nombre || usuario?.nombre || '', telefono: r.data.telefono || usuario?.telefono || '' }))
      .catch(() => setForm({ nombre: usuario?.nombre || '', telefono: usuario?.telefono || '' }))
      .finally(() => setCargando(false));
    cargarDirecciones();
  }, []);

  const cargarDirecciones = () => {
    api.get('/auth/direcciones')
      .then(r => setDirecciones(r.data))
      .catch(console.error);
  };

  const agregarDireccion = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/direcciones', nuevaDir);
      setNuevaDir({ direccion: '', ciudad: '', departamento: '', es_principal: false });
      setMostrarForm(false);
      cargarDirecciones();
    } catch {
      alert('Error al guardar la dirección');
    }
  };

  const eliminarDireccion = async (id) => {
    if (!window.confirm('¿Eliminar esta dirección?')) return;
    try {
      await api.delete(`/auth/direcciones/${id}`);
      cargarDirecciones();
    } catch {
      alert('Error al eliminar');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMsg('');
    try {
      await api.put('/auth/perfil', form);
      actualizarUsuario({ nombre: form.nombre, telefono: form.telefono });
      setMsg('success');
    } catch {
      setMsg('error');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return null;

  return (
    <div className="perfil-page">
      <div className="container">
        <div className="perfil-card card">
          <div className="perfil-avatar-wrap">
            <div className="perfil-avatar">
              {form.nombre[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h1>{form.nombre}</h1>
              <span className={`badge ${usuario?.rol === 'admin' ? 'badge-pink' : 'badge-blue'}`}>
                {usuario?.rol === 'admin'
                  ? <><Shield size={12} /> Administradora</>
                  : <><User size={12} /> Cliente</>
                }
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="perfil-form">
            <h3>Editar información</h3>
            {msg === 'success' && <div className="alert alert-success">Perfil actualizado correctamente</div>}
            {msg === 'error' && <div className="alert alert-error">Error al actualizar el perfil</div>}

            <div className="input-group">
              <label><User size={13} /> Nombre completo</label>
              <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div className="input-group">
              <label><Mail size={13} /> Correo electrónico</label>
              <input type="email" value={usuario?.correo || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div className="input-group">
              <label><Phone size={13} /> Teléfono</label>
              <input type="tel" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="3001234567" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={guardando}>
              <Save size={15} /> {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>

        {/* HU017 - Direcciones guardadas */}
        <div className="perfil-card card" style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}><MapPin size={18} color="#c4687c" style={{ verticalAlign: 'middle' }} /> Mis direcciones</h3>
            <button className="btn btn-outline btn-sm" onClick={() => setMostrarForm(!mostrarForm)}>
              <Plus size={15} /> Agregar
            </button>
          </div>

          {mostrarForm && (
            <form onSubmit={agregarDireccion} style={{ marginBottom: '1rem', padding: '1rem', background: '#fdf5f7', borderRadius: '12px' }}>
              <div className="input-group">
                <label>Dirección</label>
                <input type="text" value={nuevaDir.direccion} onChange={e => setNuevaDir({ ...nuevaDir, direccion: e.target.value })} placeholder="Calle 10 # 5-20" required />
              </div>
              <div className="input-group">
                <label>Ciudad</label>
                <input type="text" value={nuevaDir.ciudad} onChange={e => setNuevaDir({ ...nuevaDir, ciudad: e.target.value })} placeholder="Ibagué" required />
              </div>
              <div className="input-group">
                <label>Departamento (opcional)</label>
                <input type="text" value={nuevaDir.departamento} onChange={e => setNuevaDir({ ...nuevaDir, departamento: e.target.value })} placeholder="Tolima" />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={nuevaDir.es_principal} onChange={e => setNuevaDir({ ...nuevaDir, es_principal: e.target.checked })} />
                Marcar como principal
              </label>
              <button type="submit" className="btn btn-primary btn-sm">Guardar dirección</button>
            </form>
          )}

          {direcciones.length === 0 ? (
            <p style={{ color: '#9b7280' }}>No tienes direcciones guardadas.</p>
          ) : (
            <div>
              {direcciones.map(d => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', borderBottom: '1px solid #f0e0e5' }}>
                  <div>
                    <MapPin size={14} color="#c4687c" style={{ verticalAlign: 'middle' }} /> {d.direccion}, {d.ciudad}
                    {d.departamento ? `, ${d.departamento}` : ''}
                    {d.es_principal ? <span className="badge badge-pink" style={{ marginLeft: '0.5rem' }}>Principal</span> : ''}
                  </div>
                  <button className="btn btn-sm" style={{ background: 'none', color: '#e05252' }} onClick={() => eliminarDireccion(d.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}