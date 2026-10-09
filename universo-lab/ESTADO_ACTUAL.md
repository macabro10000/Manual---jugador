# VyROX — Estado actual y punto de recuperación

**Actualizado:** 2026-10-09  
**Repositorio:** `macabro10000/Manual---jugador`  
**Rama de trabajo:** `lab/universo-frontend`  
**Último HEAD verificado antes de esta actualización documental:** `0f4681328a261a5a815d6dd1fbbe145517a0f0ca`

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
- `vyrox-server/package.json` aún declara rangos `^5.1.0` para Express y `^8.1.0` para Helmet. No se ha verificado un `package-lock.json` versionado.
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

**VYR-004 — Dependencias reproducibles y CI.**

1. Inspeccionar workflow y estado real de la rama antes de cambiar nada.
2. Obtener un `package-lock.json` real generado por npm; no escribirlo manualmente ni afirmar que existe si no está versionado.
3. Ajustar CI para usar instalación reproducible con `npm ci` cuando el lockfile esté disponible.
4. Volver a ejecutar GitHub Actions y revisar el resultado real.
5. Registrar commit y evidencia en la bitácora.
6. No desplegar el backend ni integrar OAuth/base de datos todavía.

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
