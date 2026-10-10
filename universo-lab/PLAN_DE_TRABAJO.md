# VyROX — Plan de trabajo

## Convenciones de estado
- `PENDIENTE`: no ejecutado.
- `EN_CURSO`: ejecución iniciada.
- `IMPLEMENTADO`: código escrito.
- `PRUEBAS_OK`: pruebas definidas ejecutadas y pasadas.
- `VERIFICADO_EN_RENDER`: despliegue comprobado.
- `VERIFICADO_EN_ANDROID`: comportamiento comprobado en el teléfono.
- `BLOQUEADO`: existe un impedimento sin resolver.

## Próxima tarea técnica

**VYR-006 — Resolver decisiones de infraestructura previas a autenticación.**
1. Determinar el dominio/origen final de la API y validar el comportamiento de cookies entre frontend/API en Android/Chrome.
2. Comparar opciones de persistencia duradera con límites gratuitos actuales, suspensión, copias de seguridad y requisito de tarjeta; no crear recursos todavía.
3. Definir el Client ID OAuth exclusivo de VyROX, la política de expiración de sesión y los nombres de handle reservados.
4. Cerrar criterios de aceptación y plan de pruebas antes de implementar rutas o interfaz.
5. Mantener la rama de laboratorio; no tocar `main`, producción ni proyectos ajenos.

## VYR-005 — Auditoría estática y contrato documentado

- Documento nuevo: `universo-lab/AUTENTICACION_Y_SESIONES.md`.
- Se verificó que no existe login Google ni sesión remota en el frontend.
- El backend actual solo implementa `GET /api/health`; CORS aún no habilita operaciones mutables ni credenciales.
- Se definieron contratos de login, `GET /api/me`, logout/revocación, `@usuario`, CSRF/CORS y cambio de cuenta.
- Estado: **DISEÑO DOCUMENTADO**, no implementación. Sin OAuth, base de datos, secretos, despliegue ni prueba Android.

## Tarea completada

**VYR-004 — Dependencias reproducibles y CI: PRUEBAS_OK.**
- Lockfile real generado por npm en GitHub Actions y versionado: commit `7d96ddb5e771ed1ce9edea32a05fe5221b4f1be7`.
- Workflow final usa Node.js 20, caché npm y `npm ci --no-audit --no-fund`.
- Run `38009544895`: `success`; instalación desde lockfile y `npm test` exitosos.
- CI no demuestra despliegue ni funcionamiento en Android.

## Orden posterior previsto
1. Implementar y verificar autenticación Google en el backend independiente.
2. Implementar sesión segura y persistente.
3. Implementar el identificador público único `@usuario`.
4. Integrar frontend: acceso, perfil, cambio de cuenta y cierre de sesión.
5. Probar la sesión y el aislamiento entre cuentas en Android/Chrome.
6. Diseñar e implementar mensajería solo después de validar autenticación y sesiones.

## Estado verificado
- Frontend HTML/CSS/JS creado.
- Interfaz adaptable a móvil con búsqueda local, categorías, guardados en localStorage, compartir enlaces y cambio de tema.
- Servicio estático de Render creado y primer despliegue reportado como exitoso por los eventos de Render.
- No requiere backend para la maqueta actual.
- `content.json` es ahora el catálogo de contenido independiente de la interfaz; contiene 9 registros de demostración con campos explícitos para categoría, plataforma, tipo, URL canónica, fecha, autor, integración y estado.
- `app.js` carga `content.json` y valida su estructura básica antes de renderizar. Si falla la carga, muestra un estado de error en vez de inventar contenido.
- No hay todavía fuentes de contenido en vivo ni APIs conectadas. Los nueve registros siguen marcados como `demo`; varios enlaces son páginas generales y no publicaciones concretas.
- Los archivos de imágenes locales son opcionales por ahora; la interfaz usa fondos de reserva si faltan.
- Los guardados se quedan en el navegador del usuario; no hay cuenta ni base de datos.

## Próximas tareas
1. Revisar la página desplegada en un teléfono y corregir cualquier fallo visual o de navegación.
2. Reemplazar los registros de demostración por publicaciones concretas y verificadas, con fecha y fuente comprobables.
3. Diseñar adaptadores separados por plataforma; empezar por fuentes oficiales y enlaces que no necesiten credenciales.
4. Investigar qué contenido puede mostrarse mediante embeds oficiales, o requiere API y autorización. No activar APIs con costo sin aprobación.
5. Añadir pruebas automatizadas de estructura, enlaces, errores de carga y diseño móvil.
6. Solo después de revisión, evaluar una publicación controlada; nunca fusionar automáticamente en producción.

## Requisito pendiente de producto — sesión persistente y cambio sencillo de cuenta — 2026-10-09

### Comportamiento esperado
- Después de iniciar sesión correctamente con Google, VyROX debe mantener la sesión iniciada entre aperturas y recargas normales, hasta que la sesión expire por seguridad, sea revocada o el usuario elija cerrar sesión.
- No pedir al usuario que vuelva a autenticarse cada vez que abre la aplicación si su sesión sigue siendo válida.
- Mostrar dentro del perfil/menú una opción clara como **Cambiar de cuenta**, separada de **Cerrar sesión**.
- Al elegir **Cambiar de cuenta**, finalizar la sesión actual de VyROX de forma segura y abrir el flujo de Google que permita escoger otra cuenta; no quedarse usando silenciosamente la cuenta anterior. Debe funcionar para una persona que cambia a otra cuenta propia o para otro miembro de la familia que usa el mismo teléfono.
- Tras elegir la nueva cuenta, verificarla en el backend y cargar el perfil y el `@usuario` correspondientes a esa cuenta. No mezclar conversaciones, datos ni sesiones entre cuentas.
- **Cerrar sesión** debe revocar la sesión de VyROX y volver a la pantalla inicial. El siguiente acceso debe permitir seleccionar una cuenta de Google sin quedar atrapado en la cuenta anterior.
- La interfaz debe indicar qué cuenta está activa de forma prudente (por ejemplo, nombre/correo en el perfil), sin exponer tokens ni datos privados en almacenamiento local.

### Requisitos técnicos para implementar y probar
- Al arrancar, consultar `GET /api/me` para recuperar la sesión del servidor; mostrar la pantalla de acceso solo si la sesión no es válida.
- La persistencia debe depender de una cookie de sesión segura y de la validación del backend, no de guardar un ID token de Google en `localStorage`.
- El flujo de cambio de cuenta debe pedir selección explícita en Google Identity Services y verificar que la nueva identidad sea la que termina vinculada a la sesión recién creada. No asumir que mostrar el botón Google obliga por sí solo a elegir otra cuenta.
- Probar en Android/Chrome: cerrar y volver a abrir la página, recargar, cambiar de la cuenta A a la B, cerrar sesión y entrar de nuevo, cancelar el selector, y simular sesión expirada o revocada.
- Antes de cerrar la implementación, comprobar cómo se comportan las cookies entre el origen estático y el origen API en Render; no declarar persistencia correcta hasta validar en el navegador real.
- Las pruebas deben confirmar que al cambiar de cuenta no se muestran datos del usuario anterior ni se conservan permisos/conversaciones de la sesión anterior.

### Estado
- Este requisito queda registrado para la fase de autenticación del backend y la integración del frontend.
- No se implementó en este paso ni se modificó código funcional.
- Orden de trabajo: primero completar y verificar el esqueleto del backend y su lockfile; luego implementar autenticación Google y sesión persistente; después integrar interfaz de acceso/perfil/cambio de cuenta y probar el ciclo completo en Android; mensajería después.


## Condición de cierre de tarea
Una tarea solo se marca como completada cuando la prueba adecuada para su alcance tiene evidencia registrada. Si no se pudo ejecutar una prueba, debe quedar explícitamente pendiente.
