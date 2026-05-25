# Tallere-X

Tallere-X es una plataforma full stack para gestion de talleres automotrices. Incluye backend REST con Express, TypeScript, Prisma, PostgreSQL/Supabase, JWT y bcrypt; y frontend con Next.js, React, TypeScript, Context API y cliente HTTP centralizado.

## Estado Tecnico

- Autenticacion real con `POST /api/auth/register`, `POST /api/auth/login` y `GET /api/auth/me`.
- Passwords hasheadas con bcrypt.
- JWT con expiracion y middleware de autorizacion.
- Roles: `admin`, `client`, `mechanic`, `seller`.
- Proteccion de rutas frontend y backend.
- Validaciones con Zod para body, params y query.
- Manejo global de errores.
- Seguridad HTTP con Helmet, CORS estricto, rate limiting y sanitizacion basica.
- Swagger/OpenAPI disponible en `/api/docs`.
- Paginacion real en users, vehicles y appointments.
- Filtros backend para status, search, plate, clientId y fechas.
- Tests unitarios para auth use cases y auth middleware.

## Arquitectura

```txt
backend/src
  domain/            Modelos y contratos de repositorios
  application/       DTOs, casos de uso, servicios y errores de aplicacion
  infrastructure/    Prisma, repositorios concretos y conexion a BD
  presentation/      Controllers, routes, middlewares, validacion y docs

frontend/src
  domain/            Modelos y constantes
  application/       Hooks y casos de uso
  infrastructure/    HTTP client y repositorios API
  presentation/      Context, componentes, paginas y layouts
```

## Requisitos

- Node.js 18+
- npm 9+
- PostgreSQL o Supabase

## Variables de entorno

Usa los archivos de ejemplo:

- `backend/.env.example`
- `frontend/.env.example`

Variables backend principales:

```env
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=replace-with-a-strong-secret-at-least-32-chars
JWT_EXPIRES_IN=2h
```

Variables frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Instalacion

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run build
npm test

cd ../frontend
npm install
npm run build
npm run lint
```

## Migraciones

La migracion inicial para usuarios de aplicacion esta en:

```txt
backend/prisma/migrations/20260525000100_add_app_users/migration.sql
```

Si usas Supabase, ejecuta migraciones con una cadena `DIRECT_URL` que tenga permisos DDL sobre el schema `public`. Si la conexion pooler no tiene permisos, Prisma puede fallar antes de aplicar la migracion.

## Desarrollo

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

URLs:

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:3000`
- Swagger: `http://localhost:4000/api/docs`
- Health: `http://localhost:4000/api/health`

## Endpoints Principales

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Recursos protegidos:

- `GET /api/users?page=1&limit=10&search=&role=`
- `GET /api/vehicles?page=1&limit=10&status=&search=&plate=&clientId=`
- `GET /api/appointments?page=1&limit=10&status=&clientId=&vehicleId=&from=&to=`
- `GET /api/inventory`
- `GET /api/invoices`
- `GET /api/work-orders`
- `GET /api/feedback`

Todas las rutas protegidas requieren:

```http
Authorization: Bearer <jwt>
```

## Formato de Error

```json
{
  "success": false,
  "message": "Validation failed",
  "details": [
    { "path": "email", "message": "Invalid email address" }
  ]
}
```

## Formato Paginado

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 1
  }
}
```

## Sustentacion

Puntos clave para explicar:

- Flujo `route -> validation -> authMiddleware -> controller -> use case -> repository -> Prisma`.
- Diferencia entre autenticacion JWT y autorizacion por rol/propiedad.
- Uso de bcrypt para hash y compare seguro.
- Uso de Zod para DTOs y validacion centralizada.
- Manejo global de errores y errores Prisma.
- Paginacion y filtros backend.
- Swagger como contrato de API.

## Scripts

Backend:

- `npm run dev`
- `npm run build`
- `npm start`
- `npm test`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:push`
- `npm run seed`

Frontend:

- `npm run dev`
- `npm run build`
- `npm start`
- `npm run lint`
