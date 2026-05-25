# Beauty by Salomé Galindo — Plataforma Web

Plataforma de e-commerce para maquillaje, skincare y accesorios.  
Proyecto universitario — Unibagué 2025.

## Stack tecnológico
| Capa | Tecnología |
|------|-----------|
| Frontend | React.js + React Router |
| Backend | Node.js + Express |
| Base de datos | MySQL |
| Autenticación | JWT (JSON Web Tokens) |
| Estilos | CSS3 personalizado |

---

## Cómo ejecutar el proyecto

### 1. Base de datos (MySQL)

```bash
# Abre MySQL Workbench o tu cliente MySQL y ejecuta:
mysql -u root -p < database/schema.sql
```

Esto crea la base de datos `beauty_salome` con todas las tablas y datos iniciales.

---

### 2. Backend

```bash
cd backend
npm install

# Configura las variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de MySQL
```

Edita `backend/.env`:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=beauty_salome
JWT_SECRET=beauty_salome_secret_key_2024
JWT_EXPIRES=7d
```

```bash
# Iniciar servidor backend
npm run dev     # Con auto-recarga (nodemon)
# o
npm start       # Producción
```

El backend corre en: **http://localhost:5000**

---

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

El frontend corre en: **http://localhost:3000**

---

## Usuarios de prueba

| Rol | Correo | Contraseña |
|-----|--------|-----------|
| Admin | admin@beautysalome.com | admin123 |

---

## Estructura del proyecto

```
beauty-salome/
├── database/
│   └── schema.sql              # Estructura BD + datos iniciales
├── backend/
│   ├── server.js               # Punto de entrada Express
│   ├── .env.example            # Variables de entorno ejemplo
│   ├── config/db.js            # Conexión MySQL
│   ├── middleware/auth.js      # Verificación JWT
│   ├── routes/index.js         # Todas las rutas API
│   └── controllers/
│       ├── authController.js   # Registro, login, perfil
│       ├── productosController.js
│       ├── carritoController.js
│       └── pedidosController.js
└── frontend/
    ├── public/index.html
    └── src/
        ├── App.js              # Router principal
        ├── index.js
        ├── index.css           # Estilos globales
        ├── services/api.js     # Cliente Axios
        ├── context/
        │   ├── AuthContext.js  # Estado de autenticación
        │   └── CarritoContext.js
        ├── components/
        │   ├── Navbar.jsx/css
        │   ├── Footer.jsx/css
        │   └── ProductCard.jsx/css
        └── pages/
            ├── Home.jsx/css
            ├── Catalogo.jsx/css
            ├── DetalleProducto.jsx/css
            ├── Auth.jsx/css       # Login + Registro
            ├── Carrito.jsx/css
            ├── Checkout.jsx/css
            ├── MisPedidos.jsx/css
            ├── Perfil.jsx/css
            ├── Contacto.jsx/css
            └── Admin.jsx/css
```

---

## Endpoints API

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/registro` | Crear cuenta |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/perfil` | Ver perfil |
| PUT | `/api/auth/perfil` | Editar perfil |

### Productos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/productos` | Listar productos (con filtros) |
| GET | `/api/productos/:id` | Detalle de producto |
| POST | `/api/productos` | Crear producto (admin) |
| PUT | `/api/productos/:id` | Editar producto (admin) |
| DELETE | `/api/productos/:id` | Eliminar producto (admin) |
| GET | `/api/categorias` | Listar categorías |

### Carrito
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/carrito` | Ver carrito  |
| POST | `/api/carrito` | Agregar al carrito  |
| PUT | `/api/carrito/:id` | Actualizar cantidad  |
| DELETE | `/api/carrito/:id` | Eliminar item  |
| DELETE | `/api/carrito` | Vaciar carrito  |

### Pedidos
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/pedidos` | Crear pedido |
| GET | `/api/pedidos` | Mis pedidos |
| GET | `/api/pedidos/:id` | Detalle pedido |
| GET | `/api/admin/pedidos` | Todos los pedidos (admin) |
| PUT | `/api/admin/pedidos/:id` | Cambiar estado (admin) |

---

## Historias de usuario implementadas

| HU | Descripción | Estado |
|----|-------------|--------|
| HU001 | Registrar usuario | 
| HU002 | Iniciar sesión |
| HU003 | Ver catálogo | 
| HU004 | Filtrar productos | 
| HU005 | Ver detalle producto | 
| HU006 | Agregar al carrito | 
| HU007 | Gestionar carrito | 
| HU008 | Realizar pedido | 
| HU009 | Ver redes sociales | 
| HU010 | Contactar tienda | 
| HU011 | Historial de pedidos | 
| HU012 | Productos destacados | 
| HU013 | Administrar productos | 
| HU014 | Gestionar pedidos (admin) |
| HU015 | Método de pago | 
| HU017 | Editar perfil | 
| HU019 | Ver resumen del pedido | 

---

## Subir a GitHub

```bash
# Desde la raíz del proyecto
git init
git add .
git commit -m "feat: prototipo inicial Beauty by Salomé - 50-60%"
git branch -M main
git remote add origin https://github.com/stephanytrujillo-glitch/Proyecto-.git
git push -u origin main
```

---

## Equipo

| Nombre | Código |
|--------|--------|
| Juan Camilo Acuña Rojas | 2220241115 |
| Stephany Trujillo | 2220241091 |
| Luis Miguel Hernández Bermeo | 2220241018 |

**Universidad de Ibagué — 2025**
