# VyROX — Contrato de autenticación y sesiones

**Estado:** diseño revisado en laboratorio; no implementado.  
**Rama:** `lab/universo-frontend`.  
**Alcance:** login Google, sesión de servidor, perfil `@usuario`, cambio de cuenta y logout. No incluye mensajería ni creación de infraestructura.

## 1. Evidencia de la auditoría

Archivos leídos en la rama antes de definir este contrato:

- `universo-lab/index.html`: SHA `12b79721a8340b90771bfb14d7ed10755e4003d4`.
- `universo-lab/app.js`: SHA `a922e05a2a6b8fb300f0563b29a22b2ec80cdd3c`.
- `vyrox-server/package.json`: SHA `1472eafc4b215acd50be9ad6b8d9eeb722486272`.
- `vyrox-server/src/config.js`: SHA `0f3e8563768db6b51ec85121f0e937c51c9d78ce`.
- `vyrox-server/src/server.js`: SHA `7f0f6aedf98c44ed88d1bb2a2e27a6045dce645c`.
- `vyrox-server/test/server.test.js`: SHA `3cf6902472f4ac1d6c2b2303cd277bbd202f3698`.

### Estado actual comprobado

1. El HTML no contiene botón de Google, pantalla de cuenta ni elementos de sesión.
2. El JavaScript mantiene preferencias, señales y guardados locales; no crea una identidad ni valida una sesión remota. Los guardados locales no son una cuenta sincronizada.
3. El servidor Express solo implementa `GET /api/health`, límites básicos del cuerpo JSON, Helmet, errores genéricos y filtro de origen.
4. El CORS actual solo anuncia `GET, OPTIONS` y no habilita credenciales. Por tanto, no soporta todavía el contrato autenticado propuesto.
5. `package.json` y el lockfile actual contienen las dependencias del esqueleto Express/Helmet; no hay biblioteca de verificación Google, almacenamiento de usuarios/sesiones ni limitador de peticiones.
6. No existe base de datos, credencial OAuth propia de VyROX ni backend desplegado. No se realizaron pruebas de autenticación porque la función no existe.

**Conclusión:** el trabajo actual es una maqueta estática más un esqueleto API. No se debe mostrar un botón como si el login ya funcionara ni simular una sesión.

## 2. Principios obligatorios

- La cuenta de Google se verifica en el servidor. El navegador nunca puede declarar por sí solo que una identidad está autenticada.
- Usar el `sub` verificado de Google como clave externa estable; no usar el correo como clave de identidad ni como nombre público.
- `@usuario` es un handle propio, único y normalizado de VyROX, separado del correo y del `sub`.
- El backend emite y revoca la sesión; el cliente solo recibe una cookie de sesión protegida.
- No guardar ID tokens, access tokens ni tokens de sesión en `localStorage` o `sessionStorage`.
- La sesión, el usuario y sus datos deben persistir en almacenamiento compartido duradero; nunca depender de memoria local del proceso o del disco efímero del contenedor.
- Los proyectos, OAuth, cookies, usuarios y datos de VyROX permanecen aislados de Libres1.
- No crear credenciales, secretos, base de datos ni servicio Render durante esta tarea de diseño.

## 3. Contrato de endpoints propuesto

Los códigos y formas siguientes son el contrato de diseño. No existen todavía, salvo `GET /api/health`.

### `GET /api/auth/google-config`

Devuelve solo la configuración pública necesaria para cargar Google Identity Services.

Respuesta `200`:
```json
{ "clientId": "CLIENT_ID_PUBLICO", "enabled": true }
```

- Nunca devuelve el client secret, secretos de sesión ni credenciales privadas.
- Si no está configurado, debe indicar que el login no está disponible sin revelar secretos.

### `POST /api/auth/google`

Entrada:
```json
{ "credential": "ID_TOKEN_DE_GOOGLE" }
```

Flujo requerido:
1. Aceptar solo HTTPS en el entorno publicado, JSON y tamaño limitado.
2. Rechazar `Origin` ausente/no permitido según la política definida para solicitudes de navegador; no habilitar CORS comodín.
3. Verificar en servidor la firma, el emisor, la expiración, el `aud` igual al Client ID exclusivo de VyROX y los claims requeridos. Exigir `email_verified === true`; validar también `nonce` si se incorpora al flujo GIS.
4. Obtener el identificador de cuenta únicamente del `sub` ya verificado. No aceptar `userId`, correo verificado, handle ni rol aportados por el cliente como prueba de identidad.
5. Buscar/crear el usuario de VyROX mediante una operación persistente segura; no registrar credenciales ni el ID token en logs.
6. Generar un token de sesión opaco, criptográficamente aleatorio y de alta entropía. Guardar en persistencia solo su hash, junto con usuario, creación, expiración y revocación.
7. Establecer cookie de sesión con `HttpOnly; Secure; Path=/`, sin atributo `Domain`, y una política `SameSite` decidida tras verificar el dominio real y los navegadores destino.
8. Responder solo con el perfil público mínimo y si hace falta escoger un handle.

Respuesta de éxito propuesta `200`:
```json
{
  "user": {
    "id": "ID_INTERNO_OPACO",
    "displayName": "Nombre visible",
    "avatarUrl": null,
    "handle": null
  },
  "handleRequired": true
}
```

- No devolver la cookie en JSON ni el token de sesión.
- Errores previsibles: `400` solicitud inválida, `401` credencial inválida/expirada, `403` origen no autorizado, `429` límite de frecuencia. Los mensajes no deben filtrar detalles de verificación.

### `GET /api/me`

- Requiere cookie de sesión válida y no revocada.
- `200`: perfil de la sesión actual y `handleRequired`.
- `401`: no hay sesión, expiró o fue revocada.
- No acepta un identificador de usuario de la URL ni del cuerpo para decidir quién es el usuario actual.
- No prolongar indefinidamente la sesión solo por consultar el endpoint; la política de expiración debe estar documentada y probada.

### `POST /api/auth/logout`

- Requiere sesión válida o maneja de forma idempotente la ausencia de sesión.
- Revoca la sesión en persistencia y elimina la cookie usando exactamente los mismos atributos de nombre, ruta, dominio (si alguno) y política aplicados al crearla.
- Respuesta propuesta: `204 No Content`.
- No basta con borrar estado del navegador: el token revocado debe dejar de funcionar en el servidor.

### `POST /api/handles/check` y `PUT /api/me/handle`

- `check` es una comprobación orientativa, no una reserva del nombre.
- `PUT` exige sesión y realiza la asignación definitiva en la base de datos con índice único; una colisión concurrente devuelve `409 Conflict`.
- Normalizar antes de validar y guardar. Propuesta inicial de formato: 3–20 caracteres ASCII, minúsculas, números y guion bajo; la lista de nombres reservados debe aprobarse antes de habilitarlo.
- Nunca generar automáticamente el handle a partir del correo. No exponer `googleSub` como handle.

## 4. Cookie, CORS y protección CSRF

- Las llamadas del frontend a la API usarán `fetch(..., { credentials: "include" })`; el servidor devolverá `Access-Control-Allow-Origin` con el origen exacto permitido y `Access-Control-Allow-Credentials: true`. No combinar credenciales con `*`.
- Validar estrictamente `Origin` en todos los endpoints mutables y usar `Content-Type: application/json`; CORS por sí solo no es autorización ni defensa CSRF completa.
- Para operaciones autenticadas mutables, añadir token CSRF ligado a la sesión y exigirlo en un encabezado dedicado, además de comprobar `Origin`. No guardar el token de sesión en JavaScript.
- La cookie propuesta es host-only, `HttpOnly`, `Secure`, `Path=/`; `SameSite` no se dará por decidido hasta confirmar los dominios del frontend y la API. Dos subdominios distintos pueden ser orígenes distintos y las políticas de cookies de terceros pueden afectar al navegador. Antes de declarar compatibilidad, probar Android/Chrome en el dominio real; valorar dominio propio compartido o proxy de mismo origen si la cookie falla.
- Configurar expiración absoluta y, si se desea, inactividad máxima; rotar el identificador de sesión al autenticar/cambiar identidad; revocar sesiones al cerrar sesión y disponer de mecanismo de revocación global.
- Limitar frecuencia por IP y por cuenta en endpoints de autenticación; no registrar credenciales, cookies, tokens, ni datos privados.

## 5. Cambio de cuenta sin mezclar perfiles

1. La interfaz ejecuta logout y espera confirmación de revocación.
2. Limpia del estado de la interfaz cualquier perfil, conversación o dato asociado a la cuenta anterior; los guardados locales actuales se identifican como datos locales del dispositivo y no se presentan como datos sincronizados.
3. Inicia el flujo real de Google con selección explícita de cuenta.
4. Envía la nueva credencial a `POST /api/auth/google` y carga el perfil desde la respuesta/`GET /api/me`.
5. No se muestra el perfil nuevo hasta que el servidor confirme la sesión nueva. Si el flujo falla, queda en estado no autenticado y no recupera datos privados de la cuenta anterior.

El cierre de sesión normal revoca la sesión de VyROX. No debe confundirse con cerrar la sesión global de Google en el teléfono.

## 6. Modelo persistente mínimo (sin proveedor elegido)

- Usuario: ID interno, `googleSub` único, correo verificado/normalizado, nombre visible, avatar opcional, handle normalizado único nullable, estado y marcas de tiempo.
- Sesión: hash del token, ID del usuario, creación, expiración, revocación y último uso mínimo necesario.
- Índices únicos obligatorios para `googleSub` y handle normalizado. Resolver colisiones de handle con el índice y manejar el conflicto; una consulta previa no garantiza unicidad.
- No escoger ni crear proveedor de base de datos hasta comparar límites gratuitos, persistencia, cuotas, suspensión, copias de seguridad y requisitos de tarjeta.

## 7. Criterios de aceptación para la futura implementación

1. Credencial inválida, expirada, con emisor o audiencia incorrectos: rechazada; no crea sesión.
2. Solicitud desde origen no autorizado: rechazada sin habilitar CORS.
3. ID token y token de sesión no aparecen en almacenamiento web persistente, logs ni respuestas JSON.
4. `GET /api/me` distingue correctamente sesión válida, ausente, expirada y revocada.
5. Logout revoca el token en servidor; reutilizar la cookie después devuelve `401`.
6. Un usuario no puede leer ni cambiar el perfil de otro enviando un ID distinto.
7. Handles duplicados, normalización y carreras concurrentes quedan cubiertos por pruebas y por índice único real.
8. Cambio de cuenta no reutiliza el perfil ni datos privados de la sesión anterior.
9. Cookie, CORS, CSRF y persistencia se prueban en un navegador Android real con los dominios que se vayan a publicar.
10. CI pasa con el lockfile versionado. CI no sustituye las pruebas de despliegue ni las pruebas Android.

## 8. Bloqueos y decisión para la siguiente fase

Antes de implementar se debe confirmar: dominio/origen final de la API; compatibilidad real de cookies; proveedor de persistencia y sus límites; Client ID OAuth exclusivo de VyROX; política de expiración de sesión; lista de handles reservados. Las credenciales y recursos se crean solo en una fase separada y aprobada.

**Resultado de VYR-005:** auditoría estática y contrato documentado. No se ha implementado autenticación, no se han creado recursos ni secretos, y no se afirma que el login funcione.
