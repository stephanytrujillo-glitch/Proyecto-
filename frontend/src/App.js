import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import DetalleProducto from './pages/DetalleProducto';
import { Login, Registro } from './pages/Auth';
import RecuperarContrasena from './pages/RecuperarContrasena';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import MisPedidos from './pages/MisPedidos';
import Perfil from './pages/Perfil';
import Contacto from './pages/Contacto';
import Admin from './pages/Admin';

// Ruta protegida - requiere login
function PrivateRoute({ children }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div className="spinner-wrap"><div className="spinner" /></div>;
  return usuario ? children : <Navigate to="/login" replace />;
}

// Ruta solo admin
function AdminRoute({ children }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (usuario.rol !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Públicas */}
          <Route path="/"             element={<Home />} />
          <Route path="/catalogo"     element={<Catalogo />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/contacto"     element={<Contacto />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/registro"     element={<Registro />} />
          <Route path="/recuperar"    element={<RecuperarContrasena />} />

          {/* Privadas */}
          <Route path="/carrito"      element={<PrivateRoute><Carrito /></PrivateRoute>} />
          <Route path="/checkout"     element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/mis-pedidos"  element={<PrivateRoute><MisPedidos /></PrivateRoute>} />
          <Route path="/perfil"       element={<PrivateRoute><Perfil /></PrivateRoute>} />

          {/* Admin */}
          <Route path="/admin"        element={<AdminRoute><Admin /></AdminRoute>} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <AppRoutes />
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
