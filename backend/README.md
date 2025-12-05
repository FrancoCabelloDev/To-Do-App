# To-Do App Backend

Backend API para el sistema de gestión de tareas/proyectos construido con Express + TypeScript + Prisma + Supabase.

## Stack Tecnológico

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript (ESM)
- **ORM**: Prisma
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth (JWT validation)
- **Validation**: Zod

## Características

- ✅ Autenticación JWT con Supabase Auth
- ✅ Roles de usuario (ADMIN, CLIENT)
- ✅ CRUD completo de Proyectos, Tareas y Etiquetas
- ✅ Autorización basada en roles y propiedad de recursos
- ✅ Validación de requests con Zod
- ✅ Manejo centralizado de errores
- ✅ Rate limiting y seguridad con Helmet
- ✅ CORS configurado
- ✅ Logs con Morgan

## Requisitos Previos

- Node.js >= 18
- PostgreSQL (Supabase)
- Cuenta de Supabase con Auth configurado

## Instalación

1. **Instalar dependencias**:
```bash
npm install
```

2. **Configurar variables de entorno**:

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase:

```env
NODE_ENV=development
PORT=3001

# Database - Obtén estos valores de Supabase Dashboard > Settings > Database
DATABASE_URL="postgresql://postgres.project:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.project:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Supabase - Obtén estos de Supabase Dashboard > Settings > API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Frontend
FRONTEND_URL=http://localhost:3000
```

3. **Generar Prisma Client**:
```bash
npm run prisma:generate
```

4. **Aplicar migraciones** (si es necesario):
```bash
npm run prisma:migrate
```

O para producción:
```bash
npm run prisma:deploy
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con hot-reload
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Inicia el servidor en producción
- `npm run prisma:generate` - Genera Prisma Client
- `npm run prisma:migrate` - Crea y aplica migraciones
- `npm run prisma:deploy` - Aplica migraciones en producción
- `npm run prisma:studio` - Abre Prisma Studio

## Desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

Endpoints principales:
- `GET /health` - Health check
- `GET /api/auth/me` - Obtener perfil del usuario autenticado
- `POST /api/auth/sync` - Sincronizar perfil desde Supabase
- `GET|POST|PATCH|DELETE /api/projects` - CRUD de proyectos
- `GET|POST|PATCH|DELETE /api/tasks` - CRUD de tareas
- `GET|POST|DELETE /api/tags` - CRUD de etiquetas

## Estructura del Proyecto

```
backend/
├─ prisma/
│  └─ schema.prisma              # Schema de Prisma
├─ src/
│  ├─ server.ts                  # Entry point
│  ├─ app.ts                     # Configuración de Express
│  ├─ config/
│  │  ├─ env.ts                  # Validación de variables de entorno
│  │  └─ supabase.ts             # Cliente de Supabase
│  ├─ lib/
│  │  └─ prisma.ts               # Cliente de Prisma
│  ├─ middlewares/
│  │  ├─ requireAuth.ts          # Autenticación JWT
│  │  ├─ requireRole.ts          # Autorización por roles
│  │  ├─ validate.ts             # Validación con Zod
│  │  └─ errorHandler.ts         # Manejo de errores
│  ├─ modules/
│  │  ├─ auth/                   # Módulo de autenticación
│  │  ├─ projects/               # Módulo de proyectos
│  │  ├─ tasks/                  # Módulo de tareas
│  │  └─ tags/                   # Módulo de etiquetas
│  └─ types/
│     └─ express.d.ts            # Tipos de Express extendidos
├─ .env.example                  # Ejemplo de variables de entorno
├─ package.json
└─ tsconfig.json
```

## Autenticación

El backend valida tokens JWT de Supabase. Para hacer requests autenticados:

```bash
Authorization: Bearer <supabase-jwt-token>
```

El token se obtiene desde el frontend después de que el usuario se autentica con Supabase Auth (Google/GitHub OAuth).

## Autorización

### Roles

- **ADMIN**: Acceso completo a todos los recursos
- **CLIENT**: Solo puede acceder a sus propios proyectos y tareas

### Reglas

- Los proyectos solo son accesibles por su propietario (ownerId) o por ADMIN
- Las tareas solo son accesibles si el proyecto al que pertenecen es del usuario o es ADMIN
- Las etiquetas siguen las mismas reglas que los proyectos

## Deploy en Railway

1. **Conecta tu repositorio a Railway**

2. **Configura las variables de entorno** en Railway:
   - `NODE_ENV=production`
   - `DATABASE_URL` (de Supabase)
   - `DIRECT_URL` (de Supabase)
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `FRONTEND_URL` (URL de tu frontend en producción)

3. **Railway detectará automáticamente** el comando de build y start desde `package.json`

4. **Aplicar migraciones** en producción:
```bash
npm run prisma:deploy
```

## Consideraciones de Seguridad

- ✅ Tokens JWT validados con Supabase
- ✅ CORS configurado solo para frontend específico
- ✅ Helmet para headers de seguridad
- ✅ Rate limiting en rutas API
- ✅ Validación de inputs con Zod
- ✅ No se exponen detalles de errores en producción
- ✅ Autorización a nivel de repositorio

## Troubleshooting

### Error de conexión a base de datos

Verifica que:
1. Las URLs de conexión sean correctas (puerto 6543 para pooling, 5432 para directo)
2. El formato incluya `?pgbouncer=true` para DATABASE_URL
3. La contraseña sea correcta

### Error de autenticación

Verifica que:
1. SUPABASE_URL y SUPABASE_ANON_KEY sean correctos
2. El token JWT sea válido y no haya expirado
3. El usuario exista en Supabase Auth

## Licencia

Privado
