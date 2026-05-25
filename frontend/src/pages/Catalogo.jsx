import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import './Catalogo.css';

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [buscar, setBuscar] = useState('');

  const categoriaActual = searchParams.get('categoria') || '';
  const destacadoActual = searchParams.get('destacado') || '';
  const precioMin = searchParams.get('min_precio') || '';
  const precioMax = searchParams.get('max_precio') || '';

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const params = new URLSearchParams();
        if (categoriaActual) params.set('categoria', categoriaActual);
        if (destacadoActual) params.set('destacado', destacadoActual);
        if (precioMin) params.set('min_precio', precioMin);
        if (precioMax) params.set('max_precio', precioMax);
        if (buscar) params.set('buscar', buscar);

        const [prods, cats] = await Promise.all([
          api.get(`/productos?${params}`),
          api.get('/categorias')
        ]);
        setProductos(prods.data);
        setCategorias(cats.data);
      } catch (e) {
        console.error(e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [categoriaActual, destacadoActual, precioMin, precioMax, buscar]);

  const setFiltro = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    setSearchParams(p);
  };

  const limpiarFiltros = () => {
    setSearchParams({});
    setBuscar('');
  };

  const hayFiltros = categoriaActual || destacadoActual || precioMin || precioMax || buscar;

  return (
    <div className="catalogo-page">
      <div className="catalogo-header">
        <div className="container">
          <h1>Catálogo de productos</h1>
          <p>Encuentra todo lo que necesitas para brillar</p>
        </div>
      </div>

      <div className="container catalogo-body">
        {/* SIDEBAR FILTROS */}
        <aside className="filtros">
          <div className="filtros-head">
            <h3>Filtros</h3>
            {hayFiltros && (
              <button className="btn btn-ghost btn-sm" onClick={limpiarFiltros}>Limpiar</button>
            )}
          </div>

          {/* Búsqueda */}
          <div className="filtro-grupo">
            <label>Buscar</label>
            <input
              type="text"
              placeholder="Nombre del producto..."
              value={buscar}
              onChange={e => setBuscar(e.target.value)}
              className="filtro-input"
            />
          </div>

          {/* Categorías */}
          <div className="filtro-grupo">
            <label>Categoría</label>
            <div className="filtro-opciones">
              <button
                className={`filtro-chip ${!categoriaActual ? 'active' : ''}`}
                onClick={() => setFiltro('categoria', '')}
              >Todas</button>
              {categorias.map(c => (
                <button
                  key={c.id}
                  className={`filtro-chip ${categoriaActual == c.id ? 'active' : ''}`}
                  onClick={() => setFiltro('categoria', c.id)}
                >{c.nombre}</button>
              ))}
            </div>
          </div>

          {/* Precio */}
          <div className="filtro-grupo">
            <label>Rango de precio</label>
            <div className="precio-range">
              <input
                type="number"
                placeholder="Mín"
                value={precioMin}
                onChange={e => setFiltro('min_precio', e.target.value)}
                className="filtro-input"
              />
              <span>–</span>
              <input
                type="number"
                placeholder="Máx"
                value={precioMax}
                onChange={e => setFiltro('max_precio', e.target.value)}
                className="filtro-input"
              />
            </div>
          </div>

          {/* Destacados */}
          <div className="filtro-grupo">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={destacadoActual === 'true'}
                onChange={e => setFiltro('destacado', e.target.checked ? 'true' : '')}
              />
              Solo destacados 
            </label>
          </div>
        </aside>

        {/* PRODUCTOS */}
        <main className="catalogo-main">
          <div className="catalogo-info">
            <p>{productos.length} productos encontrados</p>
          </div>

          {cargando ? (
            null
          ) : productos.length === 0 ? (
            <div className="empty-state">
              <span>🔍</span>
              <h3>Sin resultados</h3>
              <p>Intenta cambiar los filtros de búsqueda</p>
              <button className="btn btn-primary" onClick={limpiarFiltros}>Ver todos los productos</button>
            </div>
          ) : (
            <div className="productos-grid">
              {productos.map(p => <ProductCard key={p.id} producto={p} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}