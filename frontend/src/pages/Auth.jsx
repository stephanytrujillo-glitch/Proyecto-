import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import { Star, Heart } from 'lucide-react';

export function Login() {
  const [form, setForm] = useState({ correo: '', contrasena: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login, loginConGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await login(form.correo, form.contrasena);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Correo o contraseña incorrectos');
    } finally {
      setCargando(false);
    }
  };

  const handleGoogle = async (credentialResponse) => {
    try {
      await loginConGoogle(credentialResponse);
      navigate('/');
    } catch (err) {
      setError('Error al iniciar sesión con Google');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <span className="auth-icon"><Star size={32} color="#c4687c" /></span>
          <h1>Iniciar sesión</h1>
          <p>Bienvenida de vuelta</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={form.correo}
              onChange={e => setForm({...form, correo: e.target.value})}
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={form.contrasena}
              onChange={e => setForm({...form, contrasena: e.target.value})}
              placeholder="Tu contraseña"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar →'}
          </button>
          <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.9rem' }}>
            <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
          </p>
        </form>

        <div className="auth-divider">
          <span>o continúa con</span>
        </div>

        <div className="google-btn-wrap">
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setError('Error al iniciar sesión con Google')}
            text="signin_with"
            shape="rectangular"
            logo_alignment="left"
            width="100%"
            locale="es"
          />
        </div>

        <p className="auth-switch">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export function Registro() {
  const [form, setForm] = useState({ nombre: '', correo: '', contrasena: '', telefono: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { registro, loginConGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.nombre.trim())) {
      setError('El nombre solo puede contener letras'); return;
    }
    if (form.nombre.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(form.correo)) {
      setError('Ingresa un correo electrónico válido'); return;
    }
    if (!/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(form.contrasena)) {
      setError('La contraseña debe tener mínimo 8 caracteres, letras y números'); return;
    }

    setCargando(true);
    try {
      await registro(form.nombre, form.correo, form.contrasena, form.telefono);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  const handleGoogle = async (credentialResponse) => {
    try {
      await loginConGoogle(credentialResponse);
      navigate('/');
    } catch (err) {
      setError('Error al registrarse con Google');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <span className="auth-icon"><Heart size={32} color="#c4687c" /></span>
          <h1>Crear cuenta</h1>
          <p>Únete a nuestra comunidad beauty</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="input-group">
            <label>Nombre completo</label>
            <input
              type="text"
              value={form.nombre}
              onChange={e => setForm({...form, nombre: e.target.value})}
              placeholder="Tu nombre"
              required
            />
          </div>
          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={form.correo}
              onChange={e => setForm({...form, correo: e.target.value})}
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={form.contrasena}
              onChange={e => setForm({...form, contrasena: e.target.value})}
              placeholder="Mínimo 8 caracteres, letras y números"
              required
            />
          </div>
          <div className="input-group">
            <label>Teléfono (opcional)</label>
            <input
              type="tel"
              value={form.telefono}
              onChange={e => setForm({...form, telefono: e.target.value})}
              placeholder="3001234567"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Crear cuenta →'}
          </button>
        </form>

        <div className="auth-divider">
          <span>o regístrate con</span>
        </div>

        <div className="google-btn-wrap">
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setError('Error al registrarse con Google')}
            text="signup_with"
            shape="rectangular"
            logo_alignment="left"
            width="100%"
            locale="es"
          />
        </div>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}