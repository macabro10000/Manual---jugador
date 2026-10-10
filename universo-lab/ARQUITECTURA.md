# VyROX — Arquitectura y alcance

> **Convención de nombres vigente:** el producto se llama **VyROX**. Este archivo conserva decisiones históricas redactadas cuando el proyecto se llamaba «UNIVERSO»; esas menciones son contexto histórico, no el nombre actual. Consultar `NOMENCLATURA.md` antes de modificar nombres técnicos. No renombrar rutas, ramas o servicios como limpieza cosmética.

Documento reorganizado desde `ARCHIVO_DE_OPERACION.md`. Las secciones históricas se han conservado en su redacción original; las propuestas se distinguen de lo implementado.

# ARCHIVO DE OPERACIÓN — VyROX (antes UNIVERSO)

Última actualización: 2026-10-09

> **Documento maestro de continuidad:** antes de cambiar código, abrir una tarea nueva o continuar en otro chat, leer primero la sección **Estado actual y continuidad entre chats** al final de este archivo. Después de cada tarea, actualizar estado, verificaciones y siguiente paso en este mismo archivo y guardar el cambio en esta rama.

## Objetivo
Construir UNIVERSO: un sitio móvil para descubrir videos, noticias, curiosidades y retos en un solo lugar, usando enlaces, identificadores, categorías y preferencias. No descargar ni almacenar copias de videos de terceros.

## Reglas del producto
1. Usar reproductores oficiales y mecanismos permitidos por cada plataforma.
2. Si una publicación no admite inserción, mostrar un enlace a su fuente original.
3. No extraer contenido mediante scraping que infrinja condiciones de uso.
4. No almacenar archivos de video de terceros.
5. No inventar publicaciones, titulares, fechas, estadísticas ni disponibilidad de contenido.
6. Priorizar herramientas gratuitas y revisar límites/cuotas antes de activar APIs que requieran credenciales o facturación.
7. No pedir al usuario acciones manuales hasta que sean realmente necesarias; dar instrucciones Android concretas y una tarea por vez.
8. Verificar cambios y despliegues antes de declararlos terminados.

## Auditoría de estructura y autenticación VyROX — 2026-10-09

### Evidencia inspeccionada
- Se inspeccionó el árbol completo del commit de la rama `lab/universo-frontend` (HEAD observado durante esta auditoría: `650a9ce50faa8bfd877943f3c5be495317bfd20a`). La aplicación publicada por el servicio `vyrox` está en `universo-lab/`.
- Dentro de `universo-lab/` solo existen HTML, CSS, JavaScript, catálogo JSON, documentación, assets y el prototipo RSS. No hay `package.json`, servidor Node/Express, rutas API, modelos de usuario, base de datos ni endpoints de autenticación.
- `universo-lab/index.html` no incluye el cliente de Google Identity Services ni un botón de inicio de sesión.
- `universo-lab/app.js` carga el catálogo desde `./content.json` y mantiene preferencias/guardados localmente en el navegador. No implementa autenticación ni sesiones remotas.
- Se inspeccionó, como referencia técnica separada, el repositorio `macabro10000/Librex1` en `main`: `package.json`, `server/routes/passenger.js`, `server/routes/driver.js`, `server/routes/admin.js`, `server/models/session.js`, `server/models/admin-session.js`, `server/server.js` y la configuración de Render.
- El patrón de autenticación existente en Libres1 utiliza Google Identity Services en el frontend, envía el ID token al backend, verifica la credencial en el servidor con `google-auth-library` y el `audience` correspondiente, exige `email_verified === true`, y crea una sesión del servidor mediante cookie. El servidor también contempla revocación de sesiones y separación por rol. Es una referencia de implementación, no una autorización para conectar VyROX a los datos o backend de Libres1.

### Conclusión técnica
- La autenticación con Google **no está implementada** en VyROX. Añadir solo un botón visual no sería suficiente ni seguro.
- Para mantener los proyectos aislados, la arquitectura recomendada para la siguiente fase es reutilizar el patrón técnico de verificación Google + sesión segura, pero crear para VyROX sus propias rutas, usuarios, sesiones, configuración OAuth y persistencia; no reutilizar la base de datos, las cookies, las identidades ni las rutas de Libres1.
- El identificador público `@usuario` debe ser un campo único propio de VyROX, separado del correo y del identificador interno de Google (`sub`). La asignación y comprobación de unicidad debe hacerse en el backend y en la base de datos, no solo en el navegador.
- La mensajería tipo WhatsApp requerirá cuentas verificadas, contactos/identidades, persistencia de conversaciones y mensajes, autorización por conversación y controles contra abuso. No está presente en el frontend actual.
- Antes de activar el inicio de sesión se deberá configurar el origen autorizado de VyROX en Google Cloud y las variables de entorno del backend independiente. No copiar secretos ni reutilizar automáticamente el cliente OAuth de otro proyecto.
- No se creó backend, base de datos, cliente OAuth ni servicio Render en esta auditoría. No se cambiaron archivos de la aplicación ni se modificó `main` o el servicio de producción.

### Estado y siguiente paso exacto
- Auditoría de estructura y método anterior: completada mediante lectura de archivos y metadatos de GitHub.
- Cambios de código: ninguno.
- Prueba de autenticación: no aplicable todavía; no existe implementación que probar.
- Próximo paso: diseñar y revisar en laboratorio la arquitectura mínima del backend independiente de VyROX (autenticación Google, sesiones, perfil con `@usuario` único y base para mensajería), incluyendo archivos, variables de entorno y límites del plan gratuito antes de crear recursos o desplegar. Mantener la rama `lab/universo-frontend` y no tocar `main` ni Libres1.

## Proceso 3 — Diseño de arquitectura del backend independiente de VyROX — 2026-10-09

### Alcance y aislamiento
- Se inspeccionó de nuevo el árbol recursivo de `lab/universo-frontend`: la raíz contiene el proyecto estático histórico y `universo-lab/`; el sitio `vyrox` publica únicamente `universo-lab`. No existe todavía carpeta ni paquete de backend.
- Decisión de laboratorio: cuando se autorice implementar, ubicar el servidor en `vyrox-server/` en la raíz del repositorio. El servicio web de Render deberá configurar `Root Directory = vyrox-server`, instalar dependencias allí y ejecutar el servidor allí. El servicio estático actual conserva `Publish Directory = universo-lab`; así el código del backend no queda dentro del directorio publicado por el sitio.
- El backend y sus datos serán exclusivamente de VyROX. No se reutilizan las rutas, cuentas, cookies, credenciales OAuth, secretos, base de datos ni colecciones de Libres1. No se modifica `main`, `manual-jugador` ni el servicio viejo `universo-explorador`.
- Este proceso es solo diseño y documentación: no crea archivos de aplicación, OAuth, base de datos ni servicios Render.

### Arquitectura propuesta para la primera versión
- Frontend estático: `https://vyrox.onrender.com`.
- API independiente: servicio web Node.js + Express dentro de `vyrox-server/`, con ruta de salud `GET /api/health`. Nombre/dominio final del API queda pendiente de disponibilidad y configuración del servicio; no se presupone que ya exista.
- Persistencia: base de datos exclusiva de VyROX, con índices únicos para identidad Google y `handle`. No usar memoria del proceso ni el disco efímero del contenedor para usuarios, sesiones o mensajes. Antes de elegir/provisionar proveedor, verificar cuota gratuita vigente, límites, política de suspensión, copias de seguridad y si exige tarjeta; no crear recursos facturables sin permiso.
- Dependencias iniciales previstas: `express`, `google-auth-library`, `helmet`, un limitador de peticiones mantenido y el controlador oficial de la base de datos que se seleccione. Fijar versiones compatibles y lockfile durante implementación; no instalar ni desplegar todavía.

### Inicio de sesión con Google
1. El frontend carga Google Identity Services y presenta el botón real de acceso.
2. El navegador recibe la credencial de Google y la envía por HTTPS a `POST /api/auth/google`; no guardar el ID token en `localStorage` ni en `sessionStorage`.
3. El backend verifica firma, emisor, caducidad, `audience` igual al OAuth Client ID exclusivo de VyROX y `email_verified === true`. No confiar en nombre, correo ni identificadores enviados por el navegador sin verificar.
4. El backend identifica la cuenta por el `sub` estable de Google y crea/actualiza el perfil mínimo. El `sub` no se expone como identificador público.
5. La sesión usa un token opaco aleatorio de alta entropía; la base de datos guarda solo su hash, fecha de expiración, revocación y metadatos mínimos. Cookie propuesta: `HttpOnly; Secure; SameSite=Lax; Path=/`, sin atributo `Domain`; validar el comportamiento real del navegador Android y el origen del API antes de darlo por probado. Las llamadas autenticadas usan `credentials: "include"`, CORS permite solo el origen exacto del frontend y credenciales, y se valida `Origin` en operaciones mutables. No usar `Access-Control-Allow-Origin: *` con credenciales.
6. `POST /api/auth/logout` revoca la sesión del servidor y elimina la cookie con los mismos atributos; `GET /api/me` devuelve solo el perfil autorizado.

### Identidad pública `@usuario`
- El handle se guarda normalizado sin el carácter `@`; la interfaz lo muestra con `@`.
- Propuesta de validación inicial: 3–20 caracteres, minúsculas ASCII, números y guion bajo; normalizar a minúsculas antes de comprobar. Definir y documentar palabras reservadas antes de habilitar cambios.
- La unicidad no se resuelve con una consulta previa solamente: debe existir un índice único en la base de datos y el backend debe manejar colisiones concurrentes.
- Tras el primer acceso, si la cuenta no tiene handle, el usuario pasa a una pantalla para elegirlo. `POST /api/handles/check` sirve únicamente para dar una indicación preliminar; `PUT /api/me/handle` realiza la asignación definitiva autenticada y maneja la respuesta de conflicto. No usar el correo de Google como handle automático.

### Modelo de datos inicial (diseño, no creado)
- `users`: `id` interno UUID, `googleSub` único, correo normalizado, nombre visible, avatar HTTPS opcional, `handle` normalizado único cuando esté asignado, estado y marcas de tiempo.
- `sessions`: hash del token único, `userId`, expiración, revocación, creación y último uso; retención acotada y limpieza de sesiones expiradas.
- Fase de mensajería posterior: `conversations`, `conversation_members` y `messages`, con pertenencia comprobada en cada lectura/escritura, paginación por cursor, límite de tamaño de mensaje y validación del remitente en el servidor. No aceptar un `senderId` elegido por el cliente.
- La mensajería en tiempo real, notificaciones, bloqueo/reportes, límites antiabuso y políticas de retención se diseñan después de probar y asegurar la autenticación básica.

### Contrato de API propuesto
- `GET /api/health`: estado técnico sin secretos ni datos personales.
- `GET /api/auth/google-config`: expone únicamente el Client ID público y estado de configuración; nunca el client secret.
- `POST /api/auth/google`: verifica credencial, registra/actualiza identidad y establece sesión.
- `GET /api/me`: perfil de la sesión válida.
- `POST /api/handles/check`: valida formato y disponibilidad aproximada.
- `PUT /api/me/handle`: asigna handle único a la cuenta autenticada.
- `POST /api/auth/logout`: revoca sesión.
- Futuro, fuera del MVP de autenticación: `GET/POST /api/conversations`, `GET /api/conversations/:id/messages`, `POST /api/conversations/:id/messages`; todas las rutas requieren autorización por miembro.

### Variables de entorno previstas
- `PORT`: puerto proporcionado por Render.
- `NODE_ENV=production` en el servicio publicado.
- `GOOGLE_CLIENT_ID`: Client ID exclusivo de VyROX; puede mostrarse en frontend, pero se configura y valida en backend.
- `MONGODB_URI` o la variable equivalente del proveedor que se elija: secreto privado, solo para el servicio API.
- `SESSION_SECRET`: secreto aleatorio de servidor para funciones criptográficas adicionales si se necesitan; nunca sustituye tokens aleatorios de sesión.
- `FRONTEND_ORIGIN=https://vyrox.onrender.com`: allowlist exacta.
- No incluir valores secretos en Git, archivos frontend, logs, respuestas API ni documentación. El nombre del proveedor y variables finales se decidirán tras verificar costes y límites.

### Controles mínimos antes de permitir cuentas reales
- HTTPS; CORS de origen exacto; Helmet; validación estricta del cuerpo y tamaño máximo; límites de frecuencia por IP y cuenta; errores sin stack traces; logs sin credenciales ni contenido privado; expiración y revocación de sesión; índices únicos; validación de `Origin`; protección contra abuso; comprobación de dependencias y lockfile.
- Probar en navegador Android: acceso, recarga, persistencia de sesión, cierre de sesión, cuenta sin handle, colisión de handle, credencial inválida/expirada, API dormida y errores de red. Verificar cookies en el contexto real de dos subdominios Render antes de decidir si se requiere un dominio propio.
- No declarar compatibilidad, seguridad ni disponibilidad de producción hasta ejecutar esas pruebas. Los planes gratuitos pueden tener límites o suspensión; no se promete gratuidad permanente.

### Resultado del Proceso 3
- Diseño de arquitectura documentado en este archivo operativo.
- Archivos de aplicación cambiados: ninguno.
- Servicios, base de datos y cliente OAuth creados: ninguno.
- Pruebas de autenticación: todavía no aplican.
- Siguiente paso exacto: implementar en la rama de laboratorio solo el esqueleto del backend en `vyrox-server/` (`package.json`, servidor Express, configuración validada y `GET /api/health`), sin conectar todavía Google ni una base de datos. Después probar localmente/CI y revisar el diff antes de crear el servicio API en Render.


## Aclaración de estado vigente — 2026-10-10

Este archivo conserva texto histórico de la primera arquitectura y algunos de sus estados/siguientes pasos ya quedaron superados. Para el estado vigente:

- El backend `vyrox-server/` sí existe como esqueleto Express con `GET /api/health`, configuración y pruebas.
- El lockfile ya está versionado y CI usa `npm ci`; consultar `ESTADO_ACTUAL.md` y `BITACORA.md` para la evidencia actual.
- El contrato más reciente y los gaps comprobados de autenticación se encuentran en `AUTENTICACION_Y_SESIONES.md`.
- El login Google, usuarios persistentes, sesiones, handles y mensajería siguen **sin implementar**. Los pasos de arquitectura que describen esos componentes son propuestas, no evidencia de funcionamiento.
- Antes de crear infraestructura o implementar autenticación, seguir el siguiente paso de `PLAN_DE_TRABAJO.md` (VYR-006). No desplegar ni crear credenciales durante la fase de diseño.
