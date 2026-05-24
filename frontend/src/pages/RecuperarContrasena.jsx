import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, Lock, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import './Auth.css';

export default function RecuperarContrasena() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1); // 1: pedir correo, 2: ingresar código y nueva contraseña
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [cargando, setCargando] = useState(false);

  // Paso 1: solicitar código
  const solicitarCodigo = async (e) => {
    e.preventDefault();
    setError(''); setInfo(''); setCargando(true);
    try {
      const { data } = await api.post('/auth/recuperar', { correo });
      // En modo demo el backend devuelve el código en pantalla
      if (data.codigo_demo) {
        setInfo(`Modo demo: tu código es ${data.codigo_demo}`);
        setCodigo(data.codigo_demo);
      } else {
        setInfo('Te enviamos un código de recuperación a tu correo.');
      }
      setPaso(2);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al solicitar el código');
    } finally {
      setCargando(false);
    }
  };

  // Paso 2: restablecer contraseña
  const restablecer = async (e) => {
    e.preventDefault();
    setError(''); setInfo(''); setCargando(true);
    if (nuevaContrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setCargando(false);
      return;
    }
    try {
      await api.post('/auth/restablecer', {
        correo, codigo, nueva_contrasena: nuevaContrasena
      });
      setInfo('¡Contraseña cambiada! Redirigiendo al inicio de sesión...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al restablecer la contraseña');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <span className="auth-icon"><KeyRound size={32} color="#c4687c" /></span>
          <h1>Recuperar contraseña</h1>
          <p>{paso === 1 ? 'Ingresa tu correo para recibir un código' : 'Ingresa el código y tu nueva contraseña'}</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {info && <div className="alert alert-success">{info}</div>}

        {paso === 1 ? (
          <form onSubmit={solicitarCodigo}>
            <div className="input-group">
              <label><Mail size={13} /> Correo electrónico</label>
              <input
                type="email"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={cargando}>
              {cargando ? 'Enviando...' : 'Enviar código →'}
            </button>
          </form>
        ) : (
          <form onSubmit={restablecer}>
            <div className="input-group">
              <label><KeyRound size={13} /> Código de recuperación</label>
              <input
                type="text"
                value={codigo}
                onChange={e => setCodigo(e.target.value)}
                placeholder="123456"
                required
              />
            </div>
            <div className="input-group">
              <label><Lock size={13} /> Nueva contraseña</label>
              <input
                type="password"
                value={nuevaContrasena}
                onChange={e => setNuevaContrasena(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={cargando}>
              {cargando ? 'Cambiando...' : 'Cambiar contraseña →'}
            </button>
          </form>
        )}

        <p className="auth-switch">
          <Link to="/login"><ArrowLeft size={14} style={{ verticalAlign: 'middle' }} /> Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  );
}
