import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, ShoppingBag, Package, Droplets, Eye, Heart } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

export default function Home() {
  const [destacados, setDestacados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [prods, cats] = await Promise.all([
          api.get('/productos?destacado=true'),
          api.get('/categorias')
        ]);
        setDestacados(prods.data.slice(0, 4));
        setCategorias(cats.data);
      } catch (e) {
        console.error(e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const iconoCategoria = {
    'Labios':     <Heart size={32} strokeWidth={1.5} color="#c4687c" />,
    'Ojos':       <Eye size={32} strokeWidth={1.5} color="#c4687c" />,
    'Rostro':     <Sparkles size={32} strokeWidth={1.5} color="#c4687c" />,
    'Skincare':   <Droplets size={32} strokeWidth={1.5} color="#c4687c" />,
    'Accesorios': <Package size={32} strokeWidth={1.5} color="#c4687c" />,
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-text">
            <p className="hero-tag"><Sparkles size={14} /> Nueva colección disponible</p>
            <h1 className="hero-title">
              Tu belleza,<br />
              <em>tu esencia</em>
            </h1>
            <p className="hero-desc">
              Descubre nuestra selección de maquillaje, skincare y accesorios,
              curada con amor para realzar tu belleza natural.
            </p>
            <div className="hero-btns">
              <Link to="/catalogo" className="btn btn-primary">
                Ver catálogo <ArrowRight size={16} />
              </Link>
              <Link to="/catalogo?destacado=true" className="btn btn-outline">
                <Star size={15} /> Productos destacados
              </Link>
            </div>
            <div className="hero-stats">
              <div><strong>200+</strong><span>Productos</span></div>
              <div><strong>50+</strong><span>Marcas</span></div>
              <div><strong>5★</strong><span>Calificación</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-circle">
              <ShoppingBag size={90} color="#c4687c" strokeWidth={1.2} />
            </div>
            <div className="hero-float f1"><Sparkles size={28} color="#e8a0b0" /></div>
            <div className="hero-float f2"><Star size={24} color="#c4687c" fill="#fce8ed" /></div>
            <div className="hero-float f3"><Droplets size={26} color="#e8a0b0" /></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Explorar por categoría</h2>
          <p className="section-sub">Encuentra exactamente lo que necesitas</p>
          <div className="categorias-grid">
            {categorias.map(cat => (
              <Link key={cat.id} to={`/catalogo?categoria=${cat.id}`} className="categoria-card card">
                <span className="cat-icon">{iconoCategoria[cat.nombre] || <Package size={32} color="#c4687c" />}</span>
                <span className="cat-nombre">{cat.nombre}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-destacados">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Productos destacados</h2>
              <p className="section-sub">Los más amados de nuestra colección</p>
            </div>
            <Link to="/catalogo?destacado=true" className="btn btn-outline btn-sm">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          {cargando ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <div className="productos-grid">
              {destacados.map(p => <ProductCard key={p.id} producto={p} />)}
            </div>
          )}
        </div>
      </section>

      <section className="section section-insta">
        <div className="container">
          <div className="insta-banner card">
            <div className="insta-content">
              <Heart size={40} color="#e8a0b0" strokeWidth={1.5} />
              <h2>Síguenos en Instagram</h2>
              <p>Descubre tutoriales, novedades y promociones exclusivas</p>
              <a href="https://instagram.com/beautybysalomegalindo" target="_blank" rel="noreferrer" className="btn btn-primary">
                @beautybysalomegalindo <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
