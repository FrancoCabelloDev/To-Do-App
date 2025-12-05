# API Usage Examples

Ejemplos de uso de los endpoints del backend.

## Autenticación

Todos los endpoints (excepto `/health`) requieren un token JWT de Supabase en el header:

```
Authorization: Bearer <supabase-jwt-token>
```

El token se obtiene desde el frontend después del login con Supabase Auth.

---

## Auth Endpoints

### 1. Get Current User Profile

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "fullName": "John Doe",
  "avatarUrl": "https://...",
  "role": "CLIENT"
}
```

### 2. Sync Profile from Supabase

```http
POST /api/auth/sync
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "fullName": "John Doe",
  "avatarUrl": "https://...",
  "role": "CLIENT",
  "createdAt": "2025-12-05T00:00:00.000Z",
  "updatedAt": "2025-12-05T00:00:00.000Z"
}
```

---

## Projects Endpoints

### 1. Create Project

```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Project",
  "description": "Project description"
}
```

**Response 201:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "My Project",
  "description": "Project description",
  "archivedAt": null,
  "ownerId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2025-12-05T00:00:00.000Z",
  "updatedAt": "2025-12-05T00:00:00.000Z",
  "owner": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "fullName": "John Doe",
    "avatarUrl": "https://..."
  }
}
```

### 2. List Projects

```http
GET /api/projects
Authorization: Bearer <token>
```

**Response 200:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "My Project",
    "description": "Project description",
    "archivedAt": null,
    "ownerId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2025-12-05T00:00:00.000Z",
    "updatedAt": "2025-12-05T00:00:00.000Z",
    "owner": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "fullName": "John Doe",
      "avatarUrl": "https://..."
    },
    "_count": {
      "tasks": 5,
      "tags": 3
    }
  }
]
```

### 3. Get Project by ID

```http
GET /api/projects/:id
Authorization: Bearer <token>
```

**Response 200:** Same as single project above

**Response 403:** If user doesn't own project and is not ADMIN
```json
{
  "error": "Forbidden"
}
```

### 4. Update Project

```http
PATCH /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

**Response 200:** Updated project object

### 5. Delete Project

```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

**Response 204:** No content

---

## Tasks Endpoints

### 1. Create Task

```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Implement feature X",
  "description": "Detailed description",
  "status": "TODO",
  "priority": "HIGH",
  "dueAt": "2025-12-31T23:59:59.000Z",
  "assignedToId": "550e8400-e29b-41d4-a716-446655440000",
  "tagIds": ["tag-uuid-1", "tag-uuid-2"]
}
```

**Response 201:**
```json
{
  "id": "task-uuid",
  "projectId": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Implement feature X",
  "description": "Detailed description",
  "status": "TODO",
  "priority": "HIGH",
  "dueAt": "2025-12-31T23:59:59.000Z",
  "completedAt": null,
  "createdById": "550e8400-e29b-41d4-a716-446655440000",
  "assignedToId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2025-12-05T00:00:00.000Z",
  "updatedAt": "2025-12-05T00:00:00.000Z",
  "project": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "My Project",
    "ownerId": "550e8400-e29b-41d4-a716-446655440000"
  },
  "createdBy": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "fullName": "John Doe",
    "avatarUrl": "https://..."
  },
  "assignedTo": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "fullName": "John Doe",
    "avatarUrl": "https://..."
  },
  "tags": [
    {
      "tag": {
        "id": "tag-uuid-1",
        "name": "frontend",
        "color": "#ff0000"
      }
    }
  ]
}
```

### 2. List Tasks

```http
GET /api/tasks
Authorization: Bearer <token>
```

**With project filter:**
```http
GET /api/tasks?projectId=123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <token>
```

**Response 200:** Array of tasks

### 3. Get Task by ID

```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

**Response 200:** Single task object

### 4. Update Task

```http
PATCH /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "priority": "URGENT",
  "tagIds": ["new-tag-uuid"]
}
```

**Note:** When status changes to "DONE", `completedAt` is automatically set.

**Response 200:** Updated task object

### 5. Delete Task

```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

**Response 204:** No content

---

## Tags Endpoints

### 1. Create Tag

```http
POST /api/tags
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "frontend",
  "color": "#ff0000"
}
```

**Response 201:**
```json
{
  "id": "tag-uuid",
  "projectId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "frontend",
  "color": "#ff0000",
  "createdAt": "2025-12-05T00:00:00.000Z",
  "project": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "My Project",
    "ownerId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 2. List Tags

```http
GET /api/tags
Authorization: Bearer <token>
```

**With project filter:**
```http
GET /api/tags?projectId=123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <token>
```

**Response 200:**
```json
[
  {
    "id": "tag-uuid",
    "projectId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "frontend",
    "color": "#ff0000",
    "createdAt": "2025-12-05T00:00:00.000Z",
    "project": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "My Project",
      "ownerId": "550e8400-e29b-41d4-a716-446655440000"
    },
    "_count": {
      "tasks": 5
    }
  }
]
```

### 3. Delete Tag

```http
DELETE /api/tags/:id
Authorization: Bearer <token>
```

**Response 204:** No content

---

## Error Responses

### 400 Bad Request - Validation Error
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": "body.name",
      "message": "Name is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Missing or invalid authorization header"
}
```

```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not found"
}
```

```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Resource already exists"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Enums

### TaskStatus
- `TODO`
- `IN_PROGRESS`
- `DONE`
- `CANCELED`

### TaskPriority
- `LOW`
- `MEDIUM`
- `HIGH`
- `URGENT`

### UserRole
- `ADMIN` - Full access to all resources
- `CLIENT` - Access only to own projects and tasks

---

## Notes

1. **Authorization**: 
   - ADMIN users can access all resources
   - CLIENT users can only access their own projects and related tasks/tags

2. **Cascading Deletes**:
   - Deleting a project deletes all its tasks and tags
   - Deleting a tag removes it from all tasks

3. **Task Completion**:
   - When status changes to "DONE", `completedAt` is automatically set
   - When status changes from "DONE" to another, `completedAt` is cleared

4. **Tag Assignment**:
   - Tags must belong to the same project as the task
   - Tags are validated when creating/updating tasks

5. **Rate Limiting**:
   - 100 requests per 15 minutes per IP address
   - Applies to all `/api/*` routes
