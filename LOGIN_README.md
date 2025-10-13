# Vista de Login con Bootstrap - Lambda Web

Este proyecto incluye una vista de login completamente funcional usando Bootstrap, organizados en una estructura de carpetas clara y modular.

## 📁 Estructura de Carpetas

```
src/app/
├── components/
│   └── auth/
│       └── login/
│           ├── login.component.ts
│           ├── login.component.html
│           └── login.component.scss
├── services/
│   └── auth.service.ts
├── models/
│   └── user.model.ts
├── app.config.ts
├── app.routes.ts
├── app.html
├── app.scss
└── app.ts
```

## 🎯 Características Implementadas

### Vista de Login
- ✅ Diseño responsivo con Bootstrap 5
- ✅ Validación de formularios en tiempo real
- ✅ Mostrar/ocultar contraseña
- ✅ Estados de carga y error
- ✅ Diseño atractivo con gradientes
- ✅ Iconos de Bootstrap Icons
- ✅ Animaciones CSS

### Dashboard CRUD de Usuarios
- ✅ Sidebar navegación colapsable
- ✅ Tabla de usuarios con filtros y búsqueda
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Modal para crear/editar usuarios
- ✅ Toggle de estado activo/inactivo
- ✅ Estadísticas en tiempo real
- ✅ Interfaz responsiva
- ✅ Datos simulados realistas

### Arquitectura
- ✅ Componentes standalone
- ✅ Servicio de autenticación
- ✅ Servicio de gestión de usuarios
- ✅ Modelos de datos TypeScript
- ✅ Guards de protección de rutas
- ✅ Rutas configuradas
- ✅ Gestión de estado con RxJS

### Funcionalidades
- ✅ Simulación de autenticación
- ✅ CRUD completo de usuarios
- ✅ Filtros y búsqueda avanzada
- ✅ Almacenamiento local de credenciales
- ✅ Manejo de errores
- ✅ Feedback visual al usuario
- ✅ Navegación protegida

## 🔑 Credenciales de Prueba

Para probar el login con la API de Laravel, usa estas credenciales:

```
Email: admin@gmail.com
Contraseña: (mínimo 8 caracteres según la API)
```

## 🌐 Configuración de API

La aplicación consume una API Laravel en:
```
URL Base: http://127.0.0.1:8000/api
Endpoint Login: /login
```

**Datos que envía al backend:**
```json
{
  "USR_Email": "admin@gmail.com",
  "USR_Password": "tu_contraseña"
}
```

**Respuesta esperada del backend:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "USR_ID": 1,
    "USR_Name": "Admin",
    "USR_LastName": "Roblox",
    "USR_Email": "admin@gmail.com",
    "USR_Phone": "8713574926",
    "USR_UserRole": "admin",
    "USR_FCM": "token_fcm",
    "created_at": "2025-10-02T17:34:46.000000Z",
    "updated_at": "2025-10-02T17:34:46.000000Z"
  },
  "token": "jwt_token_aqui"
}
```

## 🚀 Cómo Ejecutar

### Prerrequisitos
1. **API Laravel funcionando** en `http://127.0.0.1:8000`
2. **Node.js** instalado
3. **Angular CLI** instalado

### Pasos de instalación:

1. Instalar dependencias:
```bash
npm install
```

2. **Importante**: Asegúrate de que tu API Laravel esté ejecutándose:
```bash
# En tu proyecto Laravel
php artisan serve
```

3. Ejecutar Angular en modo desarrollo:
```bash
npm start
```

4. Abrir el navegador en `http://localhost:4200`

### 🔧 Configuración de CORS (Laravel)

Si tienes problemas de CORS, asegúrate de configurar tu Laravel correctamente:

1. Instala Laravel Sanctum o configura CORS:
```bash
php artisan config:publish cors
```

2. En `config/cors.php`:
```php
'allowed_origins' => ['http://localhost:4200'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

## 🎨 Tecnologías Utilizadas

- **Angular 20** - Framework principal
- **Bootstrap 5** - Framework CSS
- **Bootstrap Icons** - Iconografía
- **RxJS** - Programación reactiva
- **TypeScript** - Tipado estático
- **SCSS** - Preprocesador CSS

## 📦 Dependencias Agregadas

```json
{
  "bootstrap": "^5.3.x",
  "bootstrap-icons": "^1.11.x"
}
```

## 🔧 Configuración

### Estilos Globales
Los estilos de Bootstrap están importados en `src/styles.scss`:

```scss
@import '~bootstrap/dist/css/bootstrap.min.css';
@import '~bootstrap-icons/font/bootstrap-icons.css';
```

### Rutas
El sistema de rutas está configurado en `src/app/app.routes.ts` con redirección automática al login.

### Servicio de Autenticación
El `AuthService` maneja:
- Login/logout
- Almacenamiento de credenciales
- Estado de autenticación
- Gestión de errores

## 🎨 Personalización

### Colores
Los colores principales están definidos en las variables CSS:

```scss
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Responsive Design
La vista se adapta automáticamente a diferentes tamaños de pantalla:
- Desktop: Panel dividido (info + formulario)
- Mobile: Vista de una sola columna

## 🔐 Seguridad

⚠️ **Nota Importante**: Este es un ejemplo de desarrollo. En producción debes:

1. Usar HTTPS
2. Implementar autenticación real con JWT
3. Validar credenciales en el backend
4. Implementar rate limiting
5. Use bibliotecas de encriptación apropiadas

## 📱 Características del Diseño

### Panel Izquierdo (Desktop)
- Logo y branding
- Información de la empresa
- Lista de características
- Gradiente de fondo atractivo

### Panel Derecho
- Formulario de login centrado
- Validación en tiempo real
- Botón con estado de carga
- Enlaces adicionales

### Efectos Visuales
- Animaciones suaves
- Efectos hover
- Transiciones CSS
- Estados de validación visuales

## 🔄 Próximos Pasos

Para expandir este proyecto, considera agregar:

1. **Registro de usuarios**
2. **Recuperación de contraseña**
3. **Autenticación de dos factores**
4. **Dashboard post-login**
5. **Guards de rutas**
6. **Interceptores HTTP**
7. **Manejo avanzado de errores**
8. **Tests unitarios**

---

🚀 **¡El proyecto está listo para usar!** Simplemente ejecuta `npm start` y ve a `http://localhost:4200` para ver el login en acción.