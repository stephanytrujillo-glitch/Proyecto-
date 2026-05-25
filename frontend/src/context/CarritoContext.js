import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const { usuario } = useAuth();
  const [carrito, setCarrito] = useState({ items: [], total: 0 });
  const [cargando, setCargando] = useState(false);

  const cargarCarrito = useCallback(async () => {
    if (!usuario) { setCarrito({ items: [], total: 0 }); return; }
    try {
      setCargando(true);
      const { data } = await api.get('/carrito');
      setCarrito(data);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  }, [usuario]);

  useEffect(() => { cargarCarrito(); }, [cargarCarrito]);

  const agregar = async (producto_id, cantidad = 1) => {
    await api.post('/carrito', { producto_id, cantidad });
    await cargarCarrito();
  };

  const actualizar = async (id, cantidad) => {
    await api.put(`/carrito/${id}`, { cantidad });
    await cargarCarrito();
  };

  const eliminar = async (id) => {
    await api.delete(`/carrito/${id}`);
    await cargarCarrito();
  };

  const vaciar = async () => {
    await api.delete('/carrito');
    setCarrito({ items: [], total: 0 });
  };

  const totalItems = carrito.items.reduce((sum, i) => sum + i.cantidad, 0);

  return (
    <CarritoContext.Provider value={{ carrito, agregar, actualizar, eliminar, vaciar, cargando, totalItems, cargarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);
