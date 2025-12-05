# 🚀 Quick Start

## Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de Supabase

# 3. Generar Prisma Client
npm run prisma:generate

# 4. Aplicar migraciones (si es necesario)
npm run prisma:migrate

# 5. Iniciar servidor
npm run dev
```

## Verificación

```bash
# El servidor debe mostrar:
✅ Database connected
🚀 Server running on port 3001
📝 Environment: development
🔗 Health check: http://localhost:3001/health
```

## Probar API

```bash
# Health check
curl http://localhost:3001/health

# Debe devolver:
{"ok":true,"timestamp":"2025-12-05T..."}
```

## Obtener Token JWT

1. Abre tu frontend Next.js
2. Inicia sesión con Google/GitHub
3. El frontend obtendrá el token de Supabase
4. Usa ese token en el header: `Authorization: Bearer <token>`

## Ejemplo de Request con Token

```bash
# GET /api/auth/me
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer eyJhbG..."
```

## Comandos Útiles

```bash
npm run dev              # Desarrollo con hot-reload
npm run build            # Compilar para producción
npm start                # Ejecutar en producción
npm run prisma:studio    # Abrir Prisma Studio (DB GUI)
```

## Variables de Entorno Requeridas

```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://..."      # Puerto 6543 con ?pgbouncer=true
DIRECT_URL="postgresql://..."        # Puerto 5432
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."
FRONTEND_URL="http://localhost:3000"
```

## Troubleshooting

### Error de conexión a DB
- Verifica DATABASE_URL y DIRECT_URL
- Puerto 6543 para pooling, 5432 para directo
- Incluye `?pgbouncer=true` en DATABASE_URL

### Error de autenticación
- Verifica SUPABASE_URL y SUPABASE_ANON_KEY
- El token JWT debe ser válido
- El usuario debe existir en Supabase Auth

### Puerto en uso
```bash
# Cambiar PORT en .env o matar el proceso
netstat -ano | findstr :3001
taskkill /PID <pid> /F
```

## Documentación

- `README.md` - Documentación completa
- `API_EXAMPLES.md` - Ejemplos de endpoints
- `IMPLEMENTATION.md` - Resumen de implementación

## ¡Listo! 🎉

El backend está completo y funcionando. Conecta tu frontend Next.js y empieza a construir!
