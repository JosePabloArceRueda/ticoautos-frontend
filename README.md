# TicoAutos - Frontend

TicoAutos es un marketplace de vehículos orientado al mercado costarricense. Permite publicar, buscar y consultar vehículos de forma sencilla, con un sistema de chat entre compradores y vendedores.

Este repositorio contiene el frontend de la aplicación. El backend es una API separada que expone tanto endpoints REST como una API GraphQL.

---

## Tecnologías utilizadas

- React 19
- Vite 8
- Tailwind CSS v4
- React Router v7
- Apollo Client (para consultas GraphQL)
- Axios (para llamadas REST)

---

## Requisitos previos

- Node.js 18 o superior
- El backend de TicoAutos corriendo localmente o en un servidor accesible

---

## Instalación

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
VITE_API_BASE_URL=http://localhost:3000
```

Ajustar la URL según donde esté corriendo el backend.

---

## Ejecutar en desarrollo

```bash
npm run dev
```

El servidor de desarrollo queda disponible en `http://localhost:5173`. Si se necesita acceso desde otros dispositivos en la red local, el archivo `vite.config.js` ya tiene `host: true` configurado.

---

## Compilar para producción

```bash
npm run build
```

La salida queda en la carpeta `dist/`.

---

## Funcionalidades

**Autenticación**

- Registro con cédula costarricense (validación automática contra el TSE)
- Inicio de sesión con email y contraseña
- Autenticación en dos pasos por SMS (2FA)
- Inicio de sesión y registro con Google (OAuth)
- Verificación de correo electrónico al registrarse
- Sesión persistente con token en localStorage

**Vehículos**

- Listado público con filtros por marca, modelo, año, precio y estado
- Detalle de vehículo con galería de imágenes
- Publicación, edición y eliminación de vehículos (usuarios autenticados)
- Subida y gestión de imágenes por vehículo

**Chat**

- Sistema de mensajes entre el interesado y el propietario del vehículo
- Validación de mensajes por inteligencia artificial (el backend rechaza contenido inapropiado)
- Actualización automática de mensajes cada 3 segundos
- Sistema de turnos: se alternan los mensajes entre ambas partes

**Perfil**

- Vista del perfil del usuario con información personal (nombre, cédula, correo, teléfono)
- Identificación del método de autenticación (cuenta propia o Google)

---

## Rutas de la aplicación

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Listado de vehículos con filtros |
| `/login` | Público | Inicio de sesión |
| `/register` | Público | Registro de nuevo usuario |
| `/verify-2fa` | Público | Verificación del código 2FA |
| `/check-email` | Público | Aviso de verificación de correo enviado |
| `/verify-email` | Público | Resultado de la verificación de correo |
| `/oauth/callback` | Público | Callback de Google OAuth |
| `/register/complete` | Público | Completar registro de usuario Google |
| `/vehicles/:id` | Público | Detalle de un vehículo |
| `/profile` | Autenticado | Perfil del usuario |
| `/vehicles/:vehicleId/chat/new` | Autenticado | Iniciar conversación sobre un vehículo |
| `/chats` | Autenticado | Listado de conversaciones |
| `/chats/:chatId` | Autenticado | Conversación individual |
| `/dashboard` | Autenticado | Mis vehículos publicados |
| `/dashboard/vehicles/new` | Autenticado | Publicar nuevo vehículo |
| `/dashboard/vehicles/:id/edit` | Autenticado | Editar vehículo y gestionar imágenes |
| `/dashboard/vehicles/:id/delete` | Autenticado | Confirmar eliminación de vehículo |

---

## Estructura del proyecto

```
src/
  components/     Componentes reutilizables (Navbar, ImageGallery, FilterForm, etc.)
  context/        AuthContext con estado global de autenticación
  graphql/        Cliente Apollo y definición de queries
  hooks/          useAuth
  pages/          Una página por ruta
  services/       Instancia de Axios con interceptores de token
  utils/          Funciones de formato de fecha
```

---

## Comunicación con el backend

Las operaciones de lectura (listado y detalle de vehículos, mensajes, perfil, chats) se realizan a través de GraphQL usando Apollo Client. Las escrituras (login, registro, crear vehículos, enviar mensajes, subir imágenes) usan la API REST a través de Axios.

El token de autenticación se adjunta automáticamente en cada petición, tanto en los headers de Axios como en el cliente Apollo.
