# VyROX — Estado actual y punto de recuperación

**Actualizado:** 2026-10-10  
**Repositorio:** `macabro10000/Manual---jugador`  
**Rama de trabajo:** `lab/universo-frontend`  
**Última actualización de reglas verificada:** `6b626a9fce8497bb5cec82455c2030b25363d3d8` (reglas de ingeniería; confirmar HEAD de rama antes de la siguiente modificación).

> Este archivo es el resumen rápido para recuperar el proyecto al cambiar de chat. No reemplaza la bitácora histórica: el detalle completo sigue temporalmente en `ARCHIVO_DE_OPERACION.md`. No borrar ni recortar ese archivo hasta terminar la migración y verificar que todo el contenido importante se haya conservado.

## 1. Protección obligatoria

- Trabajar en `lab/universo-frontend`.
- No modificar la rama `main` ni el servicio de producción `manual-jugador`.
- No cambiar servicios de otros proyectos.
- No crear ni desplegar recursos de pago sin autorización explícita.
- Antes de escribir: consultar HEAD actual, leer los archivos implicados y comprobar que la rama no cambió desde la auditoría.
- Después de escribir: verificar commit, rama, archivos y pruebas reales.
- No presentar implementación como prueba; no presentar CI como despliegue; no presentar despliegue como prueba en Android.

## 2. Estructura y servicios

- Frontend estático: `universo-lab/` (marca visible actual: **VyROX**).
- Backend aislado en laboratorio: `vyrox-server/`.
- Servicio estático de laboratorio nuevo: `vyrox`, URL `https://vyrox.onrender.com`, conectado a `lab/universo-frontend`, publish path `universo-lab`.
- Servicio estático de laboratorio anterior: `universo-explorador`; conservarlo, no eliminarlo.
- Producción ajena al laboratorio: `manual-jugador`, rama `main`, URL `https://manual-jugador.onrender.com`; no tocar.
- El frontend se publica desde `universo-lab/`; el backend no se publica desde esa carpeta.

## 3. Estado técnico verificado

- Existe frontend estático con `index.html`, `styles.css`, `app.js` y `content.json`.
- Existe el esqueleto inicial de API en `vyrox-server/`: Express, Helmet, configuración, CORS allowlist, `GET /api/health`, manejo de errores y pruebas.
- GitHub Actions workflow: `.github/workflows/vyrox-server-tests.yml`.
- GitHub Actions run `38005322983`, commit `69f965be53b35813b1b0de5dc2ff75d043c0d284`: estado reportado `success`; job `test` y pasos de instalación/pruebas exitosos; cinco pruebas automatizadas pasaron.
- Esto valida el esqueleto inicial en CI. **No** valida autenticación real, base de datos, despliegue del backend ni funcionamiento en Android.
- `vyrox-server/package.json` declara `express: ^5.1.0` y `helmet: ^8.1.0`. `vyrox-server/package-lock.json` fue generado por npm en GitHub Actions y quedó versionado en el commit `7d96ddb5e771ed1ce9edea32a05fe5221b4f1be7` (lockfileVersion 3; 66 paquetes registrados).
- No hay autenticación Google implementada, sesiones persistentes, usuarios, `@usuario`, conversaciones ni mensajería.
- No existe todavía un backend VyROX desplegado en Render; no se han añadido secretos ni credenciales OAuth de VyROX.

## 4. Requisitos de producto ya registrados

- Iniciar sesión con Google.
- Identificador público único `@usuario`, distinto del correo y de la identidad interna de Google.
- Mantener la sesión entre aperturas mientras siga válida.
- Opciones separadas para **Cambiar de cuenta** y **Cerrar sesión**.
- El cambio de cuenta debe permitir seleccionar explícitamente otra cuenta de Google y no mezclar perfiles ni datos.
- No guardar tokens de Google en `localStorage`; validar sesión en el backend mediante cookie segura y endpoint `GET /api/me`.
- Implementar mensajería solo después de verificar autenticación, sesión y aislamiento entre cuentas.

## 5. Estado de autenticación y siguiente tarea

**VYR-004 — Dependencias reproducibles y CI: COMPLETADA / PRUEBAS_OK.**  
Lockfile real generado por npm y versionado; workflow final con Node.js 20, `npm ci` y `npm test`. Runs `38009516378` y `38009544895` concluyeron en `success`. Esto no verifica despliegue ni Android.

**VYR-005 — Auditoría estática y contrato de autenticación/sesiones: DISEÑO DOCUMENTADO.**

- Nuevo documento: `universo-lab/AUTENTICACION_Y_SESIONES.md`.
- Se confirmó que el HTML no tiene botón/login Google y el JavaScript no mantiene sesiones remotas.
- La API solo ofrece `GET /api/health`; su CORS actual permite `GET, OPTIONS` y no credenciales. No existe autenticación, persistencia de usuarios/sesiones ni OAuth VyROX.
- El contrato especifica verificación de ID token en servidor, cookie protegida, CORS/CSRF, `GET /api/me`, logout con revocación, `@usuario` único y cambio de cuenta sin mezclar perfiles.
- No se implementó login ni se crearon credenciales, secretos, base de datos o servicio API. No se hicieron pruebas de autenticación porque la función no existe.

**Siguiente tarea: VYR-006 — Resolver las decisiones de infraestructura antes de implementar autenticación.**

1. Determinar dominio/origen final de API y comprobar la política real de cookies entre frontend y API en Android/Chrome.
2. Comparar persistencia duradera con plan gratuito, cuotas, suspensión, copias de seguridad y requisito de tarjeta; no crear recursos aún.
3. Definir Client ID OAuth exclusivo de VyROX, expiración de sesión y nombres de handles reservados; no exponer ni reutilizar secretos de otros proyectos.
4. Preparar criterios de aceptación y plan de pruebas antes de implementar rutas o interfaz.
5. Mantener laboratorio; no tocar `main` ni producción.

## 6. Protocolo de cada tarea

1. **Recuperar:** leer este archivo y la sección relevante de `ARCHIVO_DE_OPERACION.md`.
2. **Verificar:** consultar HEAD, archivos y estado de CI/Render según corresponda.
3. **Auditar:** identificar causa raíz, alcance y riesgos antes de editar.
4. **Ejecutar:** una tarea acotada, solo en laboratorio.
5. **Probar:** diferenciar pruebas automatizadas, despliegue y prueba real en Android.
6. **Documentar:** guardar commit, evidencia, límites conocidos y siguiente paso.

## 7. Migración documental pendiente

El documento histórico `ARCHIVO_DE_OPERACION.md` tiene aproximadamente 54 KB y 446 líneas. Su contenido debe reorganizarse sin pérdida en documentos separados:

- `ESTADO_ACTUAL.md`: este resumen de recuperación.
- `ARQUITECTURA.md`: componentes, rutas, fronteras y contratos.
- `REGLAS_DE_SEGURIDAD.md`: protecciones y condiciones de cambio.
- `PLAN_DE_TRABAJO.md`: tareas ordenadas, estados y criterios de aceptación.
- `BITACORA.md`: historia de cambios, commits, pruebas y decisiones.

Hasta terminar esa migración, `ARCHIVO_DE_OPERACION.md` es la fuente histórica completa y no se debe borrar. Cada hecho técnico debe conservar su nivel de evidencia y sus limitaciones.


## Actualización de reglas de ingeniería — 2026-10-09

- Se amplió `REGLAS_DE_SEGURIDAD.md` con un estándar obligatorio contra parches cosméticos, con diagnóstico de causa raíz, pruebas de regresión, evidencia por entorno, dependencias reproducibles y documentación de cierre.
- Commit documental verificado: `6b626a9fce8497bb5cec82455c2030b25363d3d8`.
- Se comprobó que `vyrox-server/package-lock.json` no existe todavía en la rama.
- Primer intento documentado: la generación del lockfile excedió el límite de ejecución y no produjo `package-lock.json`.
- Reintento independiente con Node `v22.16.0` y npm `10.9.0`: falló con `EAI_AGAIN` al resolver `registry.npmjs.org`; tampoco produjo el archivo. Evidencia registrada en `BITACORA.md`, commit `66147ac0fbc4bb506f022642c7f88ba63e7bbd53`.
- VYR-004 permanece bloqueada por conectividad al registro npm desde el entorno disponible. No cambiar CI a `npm ci` sin un lockfile real versionado.
- Siguiente acción: obtener el lockfile mediante una ejecución npm real con acceso funcional al registro, guardarlo en la rama de laboratorio, cambiar CI a `npm ci` y verificar la ejecución de Actions. No desplegar backend ni tocar producción.


## Auditoría de nomenclatura — 2026-10-10

- Norma canónica: consultar `NOMENCLATURA.md` antes de cambiar nombres, rutas o referencias.
- El producto se llama **VyROX**. `universo-lab/`, `lab/universo-frontend` y `universo-explorador` son identificadores técnicos heredados que se conservan temporalmente; no son nombres del producto.
- El repositorio `macabro10000/Manual---jugador` y el servicio `manual-jugador` pertenecen a una separación técnica/histórica y quedan protegidos. No renombrar ni tocar durante VYR-006.
- `ARCHIVO_DE_OPERACION.md` sigue siendo archivo histórico maestro; no borrarlo durante la reorganización documental.
- **Nota de evidencia:** los párrafos anteriores de esta bitácora que registran el fallo inicial al generar el lockfile son históricos. El estado vigente indicado en la sección VYR-004 es `PRUEBAS_OK`; comprobar siempre los commits y ejecuciones CI citados antes de reutilizar estados antiguos.
- VYR-006 no autoriza cambios de infraestructura: primero debe resolver decisiones y criterios en documentación, sin crear servicios, credenciales ni bases de datos.


## Actualización VYR-006 — 2026-10-10

Se añadió `universo-lab/DECISIONES_INFRAESTRUCTURA_VYR-006.md` con una propuesta de origen único HTTPS para frontend/API, evaluación de persistencia gratuita, OAuth exclusivo de VyROX, sesión revocable y criterios de aceptación. La candidata de laboratorio es Neon Free Postgres, sujeta a comprobar cuotas y recuperación en el momento de crearla. No se creó ningún recurso ni se implementó autenticación. VYR-006 permanece **PENDIENTE DE VALIDACIÓN PRÁCTICA**: en especial, la arquitectura de despliegue que mantenga `/api/*` en el mismo origen y el comportamiento real de cookies en Chrome Android.


## VYR-006 — auditoría de Render y código integrado (2026-10-10)

- Render confirma que `vyrox.onrender.com` es Static Site; no hay Web Service VyROX desplegado. Los Static Sites no ejecutan el backend Node. `manual-jugador` en `main` sigue protegido y sin cambios.
- Se modificó `vyrox-server/src/server.js` para servir el frontend desde `universo-lab/` y la API desde el mismo proceso/origen. Se ampliaron pruebas de integración para raíz, assets, salud y 404 de API.
- Commits: `46716fc10056941014183dd1507e14595ae6db11` (servidor) y `ee639a7e4ab43c7f913d5b6be55c4a3e47f01d6a` (pruebas). Después se documentó la auditoría Render en `32805c8d936c68cfe42d1081261bb11a26419216`.
- Estado: **IMPLEMENTADO EN RAMA; CI PENDIENTE DE CONFIRMACIÓN; SIN DESPLIEGUE NI PRUEBA ANDROID**. El Static Site actual permanece intacto.
- El siguiente gate es confirmar CI. Solo si pasa, crear (con aprobación antes de ejecutar la creación) un Web Service gratuito temporal para probar el origen único; el subdominio será distinto y el servicio gratuito se duerme por inactividad. No cambiar la URL actual ni crear OAuth/base de datos todavía.
