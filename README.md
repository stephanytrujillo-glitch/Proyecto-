# Beauty by Salomé

Tienda virtual de maquillaje, skincare y accesorios.

## Links
- **Producción:** https://beauty-salome.vercel.app
- **Backend:** https://proyecto-production-5afd.up.railway.app

## Tecnologías
- **Frontend:** React 18, React Router, Axios
- **Backend:** Node.js, Express 4
- **Base de datos:** MySQL 8
- **Autenticación:** JWT, bcryptjs
- **Correos:** Resend
- **Despliegue:** Vercel (frontend), Railway (backend + BD)

## Variables de entorno

### Backend (.env)
- DB_HOST=
- DB_USER=
- DB_PASSWORD=
- DB_NAME=
- DB_PORT=
- JWT_SECRET=
- JWT_EXPIRES=7d
- EMAIL_USER=
- EMAIL_PASS=
- RESEND_API_KEY=
- FRONTEND_URL=https://beauty-salome.vercel.app
- PORT=5000

### Frontend (.env)
- REACT_APP_API_URL=https://proyecto-production-5afd.up.railway.app/api

## Instalación local

### Requisitos
- Node.js 18+
- MySQL 8

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Completa las variables de entorno
node server.js
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Completa REACT_APP_API_URL=http://localhost:5000/api
npm start
```

## Credenciales de prueba
- **Admin:** admin@beautysalome.com / admin123
- **Cliente:** cualquier cuenta registrada
