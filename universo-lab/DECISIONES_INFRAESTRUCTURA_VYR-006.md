# VyROX — VYR-006: decisiones de infraestructura previas a autenticación

**Estado:** propuesta técnica documentada; pendiente de ejecución y validación en el entorno real.  
**Rama:** `lab/universo-frontend`.  
**Fecha de revisión:** 2026-10-10.  
**Alcance:** dominio/origen, cookies, persistencia, OAuth, sesiones, handles y criterios de aceptación.  
**Restricción:** no crea recursos, no configura secretos y no implementa endpoints.

## 1. Evidencia de partida

- El frontend de laboratorio está en `https://vyrox.onrender.com`.
- El backend aislado existe en `vyrox-server/`, pero no está confirmado como servicio desplegado.
- La API actual solo ofrece `GET /api/health`; CORS no habilita credenciales ni métodos mutables.
- El frontend no tiene autenticación real y sus datos locales no equivalen a una cuenta.
- No hay base de datos, Client ID OAuth de VyROX ni sesiones persistentes.
- El proyecto conserva el nombre oficial **VyROX**. Las referencias técnicas históricas no autorizan a recuperar el nombre anterior como marca vigente.

## 2. Origen de la aplicación y política de cookies

### Decisión recomendada

**Usar un origen de navegador único para la interfaz y la API autenticada**, con rutas como `/` y `/api/*`. La opción preferida para el despliegue de laboratorio es que un servicio Node/Express de VyROX sirva la interfaz estática y la API desde el mismo origen, o que exista un proxy inverso verificado que presente la API bajo ese mismo origen.

La URL pública actual `https://vyrox.onrender.com` se mantiene como origen de referencia del frontend de laboratorio. No se presume que el backend ya tenga URL pública ni se inventa una URL de API. Antes de implementar autenticación se debe probar qué configuración de servicio puede presentar `/api/*) en el mismo origen sin romper el frontend actual. No eliminar el servicio estático actual ni modificar `manual-jugador`.

### Motivo

Un frontend estático y una API alojados en subdominios distintos pueden ser *cross-origin* y, dependiendo de cómo el navegador clasifique el dominio, también *cross-site*. Esto añade complejidad de CORS, `SameSite` y bloqueo de cookies de terceros en navegadores móviles. No se debe confiar en una política de cookies entre subdominios `onrender.com` sin probarla en Chrome Android.

### Política de cookie cuando exista origen único HTTPS

- Cookie opaca de sesión con prefijo `__Host-` si la configuración final cumple sus requisitos: `Secure`, `Path=/`, sin `Domain`.
- `HttpOnly`; no accesible desde JavaScript.
- `SameSite=Lax` como valor inicial bajo origen único; revalidar durante las pruebas reales.
- El frontend usará solicitudes autenticadas al mismo origen; no necesita CORS para sus propias llamadas.
- El servidor comprobará `Origin` en operaciones mutables y aplicará defensa CSRF apropiada. CORS no se considera mecanismo de autorización.
- Si la arquitectura finalmente exige orígenes distintos, detener la implementación hasta documentar la política exacta y demostrar que funciona en Android/Chrome; no activar automáticamente `SameSite=None` como parche.

## 3. Persistencia: comparación y propuesta

La sesión, el usuario y el identificador público deben vivir en almacenamiento remoto duradero. No usar memoria del proceso, `localStorage`, ni disco efímero de Render como fuente de verdad.

| Opción | Evidencia de plan gratuito revisada | Riesgo/limitación | Resultado |
|---|---|---|---|
| Render Postgres Free | 1 GB; vence a los 30 días; no incluye backups administrados. | No apto para datos de cuentas que deban persistir indefinidamente sin migración/backup. | Descartado para persistencia duradera de VyROX. |
| Supabase Free | 500 MB por proyecto; se pausa tras una semana de inactividad; no incluye backups automáticos descargables del plan Free. | La pausa y la falta de backups administrados exigen recuperación/exportación propia. | Alternativa válida, pero no preferida para esta primera fase. |
| Neon Free Postgres | La documentación publicada el 2 de octubre de 2026 anuncia 1 GB por proyecto, 100 CU-horas/mes y ventana de restauración instantánea de 6 horas; el proveedor anuncia que no requiere tarjeta para iniciar. | Compute escala a cero/puede despertarse con latencia; límites gratuitos y restauración no sustituyen una copia externa. | **Candidata preferida para laboratorio**, pendiente de crearla solo con autorización y comprobar condiciones vigentes en la cuenta. |

Fuentes consultadas:
- Render Free: https://render.com/docs/free
- Supabase Free/pausas: https://supabase.com/pricing y https://supabase.com/docs/guides/platform/free-project-pausing
- Neon Free, actualización 2026-10-02: https://neon.com/blog/neon-free-plan-1-gb-per-project

### Condiciones antes de usar la base de datos

1. Proyecto y credenciales exclusivos de VyROX; nunca reutilizar conexión ni secretos de Libres1 u otros proyectos.
2. Guardar solo variables de entorno en el servicio backend; jamás incluir la cadena de conexión en el frontend, Git o logs.
3. Diseñar migraciones versionadas y restricciones únicas para identidad Google y handle.
4. Preparar exportación/restauración verificable fuera del proveedor. El plan gratuito no equivale a una estrategia de backup.
5. Definir qué hacer si se agotan las cuotas o el servicio duerme: fallar de forma segura, sin crear sesiones falsas ni perder silenciosamente cambios.
6. No almacenar datos sensibles innecesarios. La base inicial solo necesita identidad mínima, handle, sesiones hash y metadatos operativos.

## 4. OAuth Google exclusivo de VyROX

- Crear un proyecto OAuth separado y explícitamente identificado como **VyROX** en la consola correspondiente.
- Usar un Client ID propio de VyROX; no reutilizar credenciales de otros productos ni copiar secretos de otros proyectos.
- Registrar únicamente los orígenes HTTPS exactos que se vayan a usar en laboratorio y, posteriormente, los de producción que hayan sido aprobados.
- El Client ID puede ser público para el flujo web; ningún client secret, secreto de sesión o cadena de base de datos puede exponerse en el navegador.
- El backend verifica criptográficamente el ID token, emisor, audiencia, expiración y claims requeridos. Exigir `email_verified === true`; usar el `sub` verificado como identidad externa estable.
- No aceptar del cliente un `userId`, correo, rol o handle como prueba de identidad.
- No configurar el proveedor ni crear credenciales en esta tarea de documentación.

## 5. Política de sesión propuesta

- Token de sesión aleatorio, opaco y de alta entropía.
- Persistir en la base de datos solo el hash del token; asociarlo a usuario, creación, última actividad, expiración absoluta y revocación.
- Duración inicial propuesta: **7 días de inactividad y 30 días de duración absoluta**, sin renovación indefinida. La política se debe revisar antes del despliegue público y codificar como configuración explícita.
- Rotar la sesión al autenticar y en cambios de seguridad relevantes.
- `GET /api/me` valida la sesión del servidor; el frontend consulta este endpoint al abrir la aplicación.
- Logout revoca la sesión en persistencia y elimina la cookie con los mismos atributos con que se creó.
- Cambiar de cuenta revoca la sesión actual antes de abrir el selector de Google; requiere confirmar que la identidad seleccionada es la que el backend vincula a la nueva sesión.
- Nunca guardar ID tokens de Google ni tokens de sesión en `localStorage` o `sessionStorage`.

## 6. Identificador público `@usuario`

Formato inicial propuesto: 3–20 caracteres ASCII en minúscula, letras, números y guion bajo; normalizar antes de comprobar y guardar. La asignación definitiva debe estar protegida por una restricción única en la base de datos, para resolver también carreras concurrentes.

Nombres reservados iniciales: `admin`, `administrator`, `api`, `abuse`, `help`, `moderator`, `mod`, `official`, `root`, `security`, `staff`, `support`, `system`, `vyrox`, `null`, `undefined`. Esta lista debe ampliarse si aparecen rutas o funciones reservadas. Nunca derivar automáticamente el handle del correo ni exponer el `sub` de Google como nombre público.

## 7. Criterios de aceptación antes de declarar VYR-006 cerrada

- [ ] Confirmar en GitHub/Render la arquitectura capaz de servir `/api/*` bajo el origen del frontend sin modificar producción.
- [ ] Probar en Chrome Android: cookie creada, enviada y eliminada; persistencia tras recargar y cerrar/abrir el navegador.
- [ ] Verificar que un origen no autorizado recibe rechazo y que no se usa CORS comodín con credenciales.
- [ ] Confirmar proveedor, cuotas, suspensión, restauración y requisito de tarjeta en el momento de crear la base.
- [ ] Definir y probar exportación/restauración de una base de laboratorio antes de guardar cuentas reales.
- [ ] Aprobar el Client ID OAuth de VyROX y sus orígenes exactos; nunca mostrar credenciales privadas.
- [ ] Probar token Google inválido, expirado, audiencia incorrecta y correo no verificado.
- [ ] Probar expiración, revocación, logout, cambio de cuenta A→B y cancelación del selector.
- [ ] Probar handles repetidos, reservados, normalización y colisión concurrente.
- [ ] Confirmar que ningún token aparece en localStorage, sessionStorage, logs ni respuestas JSON.
- [ ] Separar los resultados: pruebas automatizadas, despliegue Render y prueba física en Android son evidencias distintas.

## 8. Fuera de alcance

Este documento no crea servicios, base de datos, OAuth, secretos ni rutas. No cambia el frontend, no altera la rama `main`, no toca el servicio `manual-jugador` y no habilita mensajería. La implementación empieza solo después de revisar las decisiones y confirmar el entorno real.

## 9. Estado de la decisión

**Propuesta para revisión:** origen único HTTPS; Neon Free Postgres como candidata de laboratorio con backups externos; OAuth Google exclusivo de VyROX; sesiones opacas con revocación; handle único con lista de reservas. Las condiciones del proveedor y la cookie quedan pendientes de verificación práctica antes de declarar autenticación funcional.


## 10. Auditoría real de Render y avance de implementación — 2026-10-10

La consulta de servicios de Render del workspace confirmó:

- `vyrox` (`srv-db4msvjbc2fs73c07uig`) es un **Static Site**, rama `lab/universo-frontend`, URL `https://vyrox.onrender.com`, publish path `universo-lab`.
- `universo-explorador` es otro Static Site de laboratorio. Se conserva sin cambios.
- `manual-jugador` es el Static Site separado conectado a `main`; queda fuera de alcance.
- No existe actualmente un Web Service de VyROX que ejecute `vyrox-server`.

La documentación de Render confirma que un Static Site sirve archivos y no ejecuta el servidor Node de la API. Un Web Service gratuito tiene su propio subdominio `onrender.com`, se suspende tras inactividad y no permite dominios personalizados en el plan gratuito. Por ello, el origen único no se consigue añadiendo rutas a la configuración actual del Static Site.

### Cambio de código en laboratorio

Se modificó `vyrox-server/src/server.js` para que el proceso Node pueda servir tanto la interfaz `universo-lab/` como `/api/health` bajo el mismo origen. Se ampliaron pruebas para verificar HTML, CSS, JavaScript, manifest, `content.json`, rechazo de orígenes no autorizados y 404 separado para rutas API inexistentes.

Commits de implementación:
- `46716fc10056941014183dd1507e14595ae6db11` — servidor sirve frontend y API en un origen.
- `ee639a7e4ab43c7f913d5b6be55c4a3e47f01d6a` — pruebas de integración del servidor.

**Límite de evidencia:** los commits existen, pero el estado CI aún debe confirmarse; no se ha creado ni desplegado un Web Service y no se ha probado en Android. El Static Site actual no se ha cambiado y permanece como referencia/rollback.

### Bloqueo de despliegue que requiere decisión explícita

Para probar la arquitectura integrada sin interrumpir el sitio actual, se necesita un Web Service de laboratorio con nombre temporal y URL propia, por ejemplo `vyrox-app-lab`. Eso cambia el origen usado durante la prueba y, más adelante, el Client ID OAuth debe registrar el origen que realmente se apruebe. No se debe renombrar ni retirar el Static Site actual hasta pasar CI y pruebas funcionales. La eventual migración del nombre/URL público es una operación separada con plan de rollback.
