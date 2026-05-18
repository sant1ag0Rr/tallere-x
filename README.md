# 🚗 Tallere-X - Sistema de Gestión de Talleres Automotrices

> **Plataforma integral para la gestión completa de talleres de reparación y mantenimiento de vehículos**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [API Documentation](#api-documentation)
- [Desarrollo](#desarrollo)
- [Deployment](#deployment)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## 🎯 Descripción General

**Tallere-X** es una solución completa basada en la nube para la gestión eficiente de talleres automotrices. Proporciona un ecosistema integrado que permite a talleres, clientes y vendedores gestionar citas, ordenes de trabajo, inventario de repuestos, facturación y retroalimentación de servicios desde una plataforma unificada.

### Usuarios Objetivo
- 👨‍🔧 **Mecánicos**: Gestión de órdenes de trabajo y reparaciones
- 👨‍💼 **Administradores**: Control total del taller y reportes
- 🧑‍💻 **Vendedores**: Gestión de inventario y ventas
- 👤 **Clientes**: Seguimiento de citas y vehículos

---

## ✨ Características Principales

### Gestión de Citas
- ✅ Agendar citas personalizadas
- ✅ Asignación automática de mecánicos
- ✅ Recordatorios automáticos
- ✅ Calendario interactivo
- ✅ Notificaciones en tiempo real

### Órdenes de Trabajo
- ✅ Creación y seguimiento de órdenes
- ✅ Asignación de tareas a mecánicos
- ✅ Control de tiempos
- ✅ Registro de actividades
- ✅ Historial completo

### Gestión de Inventario
- ✅ Catálogo de repuestos
- ✅ Control de stock en tiempo real
- ✅ Alertas de bajo inventario
- ✅ Categorización por tipo
- ✅ Seguimiento de proveedores

### Facturación
- ✅ Generación de facturas automáticas
- ✅ Cálculo de costos
- ✅ Registros de pagos
- ✅ Reportes de ingresos
- ✅ Descuentos y promociones

### Vehículos
- ✅ Registro completo de vehículos
- ✅ Historial de mantenimiento
- ✅ Datos técnicos
- ✅ Documentos adjuntos
- ✅ Estado de inspecciones

### Retroalimentación
- ✅ Encuestas de satisfacción
- ✅ Reseñas de clientes
- ✅ Ratings y puntuaciones
- ✅ Mejora continua

### Reportes y Análisis
- ✅ Dashboards interactivos
- ✅ Reportes personalizables
- ✅ Análisis de ingresos
- ✅ KPI's en tiempo real
- ✅ Exportación de datos

### Seguridad
- ✅ Autenticación con Supabase
- ✅ JWT tokens seguros
- ✅ Middleware de autorización
- ✅ Validación de datos
- ✅ Logs de auditoría

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalados:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **yarn** >= 3.0.0
- **PostgreSQL** >= 14.0
- **Git**

### Verificar versiones
```bash
node --version
npm --version
postgresql --version
git --version
```

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/tallere-x.git
cd tallere-x
```

### 2. Instalar Dependencias

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Crear Archivo de Configuración

En la carpeta `backend`, crea un archivo `.env`:

```bash
# Backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/tallere_x"
JWT_SECRET="tu-secreto-jwt-super-seguro"
SUPABASE_URL="https://tu-proyecto.supabase.co"
SUPABASE_KEY="tu-supabase-key"
NODE_ENV="development"
PORT=5000
```

En la carpeta `frontend`, crea un archivo `.env.local`:

```bash
# Frontend/.env.local
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_KEY="tu-supabase-key"
```

---

## ⚙️ Configuración

### Base de Datos

#### 1. Crear Base de Datos PostgreSQL

```bash
createdb tallere_x
```

#### 2. Ejecutar Migraciones de Prisma

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

#### 3. Seed de Datos (Opcional)

```bash
npm run seed
```

### Supabase

1. Crear cuenta en [Supabase](https://supabase.com)
2. Crear nuevo proyecto
3. Obtener URL y API Key
4. Agregar a variables de entorno

---

## 💻 Uso

### Desarrollo Local

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
El servidor estará disponible en: `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
La aplicación estará disponible en: `http://localhost:3000`

### Build para Producción

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm start
```

### Scripts Disponibles

#### Backend
| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor en modo desarrollo con hot-reload |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Inicia el servidor compilado |
| `npm run prisma:generate` | Genera el cliente de Prisma |
| `npm run prisma:migrate` | Ejecuta migraciones |
| `npm run seed` | Carga datos de prueba |

#### Frontend
| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor Next.js en desarrollo |
| `npm run build` | Compila para producción |
| `npm start` | Inicia el servidor en producción |
| `npm run lint` | Ejecuta ESLint |

---

## 🏗️ Estructura del Proyecto

```
tallere-x/
├── backend/                      # Servidor API
│   ├── src/
│   │   ├── app.ts               # Configuración de Express
│   │   ├── server.ts            # Punto de entrada
│   │   ├── application/         # Casos de uso (Use Cases)
│   │   │   └── useCases/
│   │   ├── domain/              # Modelos de dominio
│   │   │   ├── models/
│   │   │   └── repositories/    # Interfaces
│   │   ├── infrastructure/      # Implementación
│   │   │   ├── database/
│   │   │   └── repositories/
│   │   └── presentation/        # Controllers y rutas
│   │       ├── controllers/
│   │       ├── middlewares/
│   │       ├── routes/
│   │       └── utils/
│   ├── prisma/
│   │   ├── schema.prisma       # Esquema de BD
│   │   ├── seed.ts             # Datos iniciales
│   │   └── migrations/         # Migraciones
│   ├── .env                     # Variables de entorno
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                     # Aplicación Next.js
│   ├── src/
│   │   ├── app/                # Rutas y layouts
│   │   │   ├── (admin)/        # Rutas admin
│   │   │   ├── (client)/       # Rutas cliente
│   │   │   └── (seller)/       # Rutas vendedor
│   │   ├── application/        # Lógica de negocio
│   │   │   ├── hooks/
│   │   │   └── useCases/
│   │   ├── domain/             # Modelos
│   │   │   ├── constants/
│   │   │   └── models/
│   │   ├── infrastructure/     # Servicios
│   │   │   ├── http/
│   │   │   ├── repositories/
│   │   │   └── utils/
│   │   ├── presentation/       # UI Components
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── modules/
│   │   │   ├── pages/
│   │   │   └── styles/
│   │   └── shared/             # Recursos compartidos
│   ├── .env.local
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
└── README.md                     # Este archivo
```

---

## 🏛️ Arquitectura

### Arquitectura en Capas

El proyecto sigue la **Arquitectura Limpia** con separación en capas:

```
┌─────────────────────────────────┐
│      Presentation Layer         │
│    (Controllers, Routes, UI)    │
├─────────────────────────────────┤
│     Application Layer           │
│    (Use Cases, Interactors)     │
├─────────────────────────────────┤
│       Domain Layer              │
│   (Entities, Business Rules)    │
├─────────────────────────────────┤
│    Infrastructure Layer         │
│  (DB, External Services, etc)   │
└─────────────────────────────────┘
```

### Componentes Principales

#### Backend
- **Express.js**: Framework HTTP
- **Prisma**: ORM para acceso a datos
- **PostgreSQL**: Base de datos principal
- **JWT**: Autenticación y autorización
- **Supabase**: Autenticación y servicios en la nube

#### Frontend
- **Next.js**: Framework React con SSR
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos
- **React Context**: Estado global
- **Lucide React**: Iconos

---

## 📚 API Documentation

### Endpoints Disponibles

#### Usuarios
```
POST   /api/users              # Crear usuario
GET    /api/users              # Listar usuarios
GET    /api/users/:id          # Obtener usuario
PUT    /api/users/:id          # Actualizar usuario
DELETE /api/users/:id          # Eliminar usuario
```

#### Citas
```
POST   /api/appointments       # Crear cita
GET    /api/appointments       # Listar citas
GET    /api/appointments/:id   # Obtener cita
PUT    /api/appointments/:id   # Actualizar cita
DELETE /api/appointments/:id   # Eliminar cita
```

#### Vehículos
```
POST   /api/vehicles           # Crear vehículo
GET    /api/vehicles           # Listar vehículos
GET    /api/vehicles/:id       # Obtener vehículo
PUT    /api/vehicles/:id       # Actualizar vehículo
DELETE /api/vehicles/:id       # Eliminar vehículo
```

#### Órdenes de Trabajo
```
POST   /api/work-orders        # Crear orden
GET    /api/work-orders        # Listar órdenes
GET    /api/work-orders/:id    # Obtener orden
PUT    /api/work-orders/:id    # Actualizar orden
DELETE /api/work-orders/:id    # Eliminar orden
```

#### Inventario
```
POST   /api/inventory          # Crear producto
GET    /api/inventory          # Listar productos
GET    /api/inventory/:id      # Obtener producto
PUT    /api/inventory/:id      # Actualizar producto
DELETE /api/inventory/:id      # Eliminar producto
```

#### Facturas
```
POST   /api/invoices           # Crear factura
GET    /api/invoices           # Listar facturas
GET    /api/invoices/:id       # Obtener factura
PUT    /api/invoices/:id       # Actualizar factura
```

#### Retroalimentación
```
POST   /api/feedback           # Crear feedback
GET    /api/feedback           # Listar feedback
GET    /api/feedback/:id       # Obtener feedback
PUT    /api/feedback/:id       # Actualizar feedback
```

### Autenticación

Todos los endpoints requieren enviar el token JWT en el header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 🛠️ Desarrollo

### Configurar el Entorno de Desarrollo

1. **Instalar extensiones recomendadas en VS Code**
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - Thunder Client o Postman

2. **Configurar Git Hooks**
   ```bash
   npm install husky --save-dev
   npx husky install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   # Terminal 1
   cd backend && npm run dev
   
   # Terminal 2
   cd frontend && npm run dev
   ```

### Estándares de Código

- ✅ TypeScript estricto (tsconfig.json)
- ✅ ESLint para validación
- ✅ Prettier para formato
- ✅ Nomenclatura consistente

### Testing

```bash
# Backend (agregar cuando sea necesario)
npm run test

# Frontend (agregar cuando sea necesario)
npm run test
```

### Variables de Entorno

Consulta los archivos `.env.example` para las variables necesarias:

**Backend**:
```
DATABASE_URL
JWT_SECRET
SUPABASE_URL
SUPABASE_KEY
NODE_ENV
PORT
```

**Frontend**:
```
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_KEY
```

---

## 🚢 Deployment

### Opciones de Deployment

#### Heroku (Backend)
```bash
heroku login
heroku create tu-app-name
git push heroku main
heroku run npm run prisma:migrate
```

#### Vercel (Frontend)
```bash
npm install -g vercel
vercel
# Seguir los pasos interactivos
```

#### Docker

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

### Variables de Producción

Asegúrate de configurar correctamente en tu plataforma de hosting:

- Base de datos PostgreSQL en producción
- Dominio personalizado
- Certificados SSL/TLS
- Variables de entorno seguras
- Backups automáticos

---

## 🤝 Contribución

Nos encanta recibir contribuciones. Para contribuir:

1. **Fork el repositorio**
   ```bash
   git checkout -b feature/nueva-caracteristica
   ```

2. **Realiza tus cambios**
   ```bash
   git commit -m "Agregar nueva característica"
   ```

3. **Envía tu Pull Request**
   ```bash
   git push origin feature/nueva-caracteristica
   ```

### Pautas de Contribución

- 📝 Sigue el estilo de código del proyecto
- 🧪 Incluye tests cuando sea posible
- 📚 Actualiza la documentación
- 💬 Describe claramente tus cambios

---

## 📄 Licencia

Este proyecto está bajo licencia ISC. Ver archivo `LICENSE` para más detalles.

---

## 📞 Soporte

### Contacto

- 📧 Email: support@tallere-x.com
- 💬 Discord: [Enlace al servidor]
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/tallere-x/issues)

### FAQ

**P: ¿Cómo cambio la base de datos?**
A: Modifica `DATABASE_URL` en `.env` y ejecuta `npm run prisma:migrate`

**P: ¿Cómo agrego un nuevo módulo?**
A: Sigue la estructura en capas y crea los archivos correspondientes en cada capa

**P: ¿Cómo despliego a producción?**
A: Consulta la sección de Deployment para las opciones disponibles

---

## 🙏 Agradecimientos

- Equipo de desarrollo
- Comunidad open source
- Supabase por los servicios en la nube
- NextJS y Express comunidades

---

<div align="center">

**Hecho con ❤️ por el equipo de Tallere-X**

⭐ Si te gusta este proyecto, por favor dale una estrella en GitHub

[Arriba](#-tallere-x---sistema-de-gestión-de-talleres-automotrices)

</div>
