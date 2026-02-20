# Frontend Inventario - ServiEventos

## Requisitos
- Node.js 20+

## Configuración
```bash
cp .env.example .env
npm install
npm run dev
```

## Funcionalidades
- Login con JWT integrado al backend.
- Dashboard por rol.
- Vista de perfil (`/users/me`).
- CRUD completo de usuarios (solo ADMINISTRADOR):
  - listar, buscar, filtrar,
  - crear,
  - editar,
  - actualizar contraseña,
  - eliminar con confirmación.

## Endpoints backend usados
- `POST /auth/login`
- `GET /users`
- `POST /users`
- `PUT /users/{id}`
- `PATCH /users/{id}/password`
- `DELETE /users/{id}`
- `GET /users/me`
