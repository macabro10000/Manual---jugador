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

## 5. Próxima tarea exacta

**VYR-004 — Dependencias reproducibles y CI: COMPLETADA.**

- Lockfile real generado por npm en GitHub Actions y versionado.
- Workflow `.github/workflows/vyrox-server-tests.yml` usa Node.js 20, caché npm ligada al lockfile, `npm ci --no-audit --no-fund` y `npm test`.
- Run `38009516378` terminó en `success` con generación/commit del lockfile, instalación reproducible y pruebas.
- Run `38009544895` terminó en `success` con el workflow final limpio usando `npm ci` y `npm test`.
- Commits relevantes: lockfile `7d96ddb5e771ed1ce9edea32a05fe5221b4f1be7`; workflow final `061cc2858897493eff22b9ff4b2b1d7ca45c6d3e`.
- Esto confirma CI reproducible; no confirma despliegue de backend, OAuth ni prueba en Android.

**Siguiente tarea: VYR-005 — Auditar y definir el contrato de autenticación Google y sesiones antes de implementarlo.**

1. Inspeccionar frontend, backend, dependencias y pruebas existentes.
2. Definir OAuth, validación de identidad en servidor, cookie segura, CSRF, orígenes y revocación/cambio de cuenta.
3. Documentar contratos de inicio de sesión, `GET /api/me` y cierre de sesión, junto con pruebas de seguridad.
4. No crear credenciales OAuth, secretos ni base de datos, y no desplegar backend hasta revisar el diseño.

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
