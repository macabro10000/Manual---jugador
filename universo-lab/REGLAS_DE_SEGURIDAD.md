# VyROX — Reglas de seguridad y límites de cambios

## Reglas operativas consolidadas
- Trabajar en `lab/universo-frontend` salvo autorización expresa.
- No modificar `main` ni el servicio de producción `manual-jugador`.
- No modificar servicios de otros proyectos ni crear recursos de pago sin autorización explícita.
- Antes de editar, consultar HEAD, inspeccionar archivos relevantes y comprobar cambios posteriores a la auditoría.
- Después de editar, verificar commit, rama, archivos y resultado real de pruebas.
- No confundir código escrito con pruebas pasadas, CI con despliegue, ni despliegue con prueba en Android.
- No borrar el archivo histórico hasta verificar la conservación de la información.

## Separación y seguridad
- Repositorio: `macabro10000/Manual---jugador`.
- Rama exclusiva de laboratorio: `lab/universo-frontend`.
- Carpeta del proyecto: `universo-lab/`.
- Servicio de prueba Render: `universo-explorador`.
- URL de prueba: https://universo-explorador.onrender.com
- Servicio de producción existente: `manual-jugador`, rama `main`, URL https://manual-jugador.onrender.com.
- Regla: no modificar `main` ni producción para desarrollar UNIVERSO. Mantener la rama y servicio separados.


## Reglas de evidencia
- No afirmar que una función funciona si no se ha probado en el entorno correspondiente.
- No guardar secretos ni tokens de Google en el frontend o en `localStorage`.
- Verificar separación de sesiones, perfiles y datos entre cuentas antes de habilitar usuarios reales.

## Estándar obligatorio de ingeniería: calidad, diagnóstico y evidencia

Estas reglas son obligatorias para todo cambio de VyROX. No se consideran opcionales ni se sustituyen por rapidez.

1. **Diagnóstico de causa raíz antes de editar.** Reproducir o analizar el fallo, revisar el flujo completo y explicar la causa con evidencia. Si la causa no está demostrada, indicarlo y seguir investigando.
2. **Prohibidos los parches cosméticos o provisionales presentados como solución.** No ocultar errores, duplicar lógica, agregar excepciones arbitrarias ni desactivar validaciones para aparentar que funciona. Una mitigación temporal solo se permite si es imprescindible para contener un riesgo, queda identificada como temporal, tiene motivo y condición de retirada, y no se declara reparación definitiva.
3. **Solución profesional en el nivel correcto.** Corregir el componente y contrato responsables; revisar regresiones, manejo de errores, seguridad, accesibilidad y compatibilidad afectada. Evitar reescrituras ajenas al alcance.
4. **Inspección previa obligatoria.** Antes de cada escritura, leer HEAD de la rama objetivo, el archivo actual completo y sus dependencias relevantes; comprobar cambios concurrentes. No asumir que un SHA anterior sigue siendo HEAD.
5. **Cambios pequeños, coherentes y trazables.** Cada tarea tiene objetivo, alcance, criterio de aceptación, pruebas y commit identificable. No mezclar funciones independientes para ocultar qué cambió.
6. **Pruebas vinculadas al riesgo.** Añadir o actualizar pruebas que reproduzcan el fallo y cubran el comportamiento correcto, límites y regresiones relevantes. Una comprobación sintáctica no demuestra corrección funcional.
7. **Evidencia por entorno.** Informar por separado: análisis estático, pruebas automatizadas, CI, despliegue y comprobación real en navegador/Android. No inferir que una capa valida otra.
8. **Dependencias reproducibles.** Los lockfiles deben generarse con la herramienta y versión de paquete correspondiente; nunca inventarse ni editarse manualmente. CI debe usar instalación reproducible (npm ci) cuando haya un lockfile versionado.
9. **No falsificar estado ni datos.** No crear usuarios, métricas, contenido, sesiones, respuestas de API ni pruebas simuladas que se presenten como reales. Los fixtures de test deben estar claramente identificados y aislados.
10. **Seguridad por defecto.** No exponer secretos, tokens ni datos personales; no confiar en identidad del cliente sin verificación de servidor; validar entradas y autorización; comprobar separación de cuentas/sesiones y revocación antes de habilitar uso real.
11. **Protección de ramas y servicios.** Trabajar en lab/universo-frontend. No modificar main, manual-jugador ni servicios de otros proyectos. No desplegar backend, activar OAuth, conectar bases de datos ni crear recursos de pago sin cumplir la fase correspondiente y obtener autorización cuando aplique.
12. **Bloqueo ante evidencia insuficiente.** Si no se puede ejecutar una prueba, recuperar un artefacto o inspeccionar el entorno, registrar el bloqueo exacto. No declarar la tarea terminada ni sustituir la evidencia faltante por suposiciones.
13. **Registro de cierre obligatorio.** La bitácora debe indicar objetivo, causa identificada, archivos/commit, pruebas ejecutadas con resultado, pruebas pendientes, riesgos restantes y siguiente paso. El estado actual debe reflejar el HEAD real.
14. **Criterio de completitud.** Solo marcar una tarea como completada cuando se hayan satisfecho sus criterios de aceptación y se haya verificado la evidencia apropiada para ese alcance. Código escrito no equivale a código correcto.

### Secuencia de trabajo obligatoria

INSPECCIONAR → REPRODUCIR/AUDITAR → IDENTIFICAR CAUSA RAÍZ → DEFINIR CRITERIOS → IMPLEMENTAR → PROBAR REGRESIONES → VERIFICAR EVIDENCIA → DOCUMENTAR.

Si las pruebas fallan, se investiga la causa y no se avanza a la siguiente fase dependiente.


## Control de nomenclatura

- `NOMENCLATURA.md` define el nombre canónico del producto y los identificadores heredados que deben conservarse.
- El producto se denomina **VyROX**; «UNIVERSO» solo puede aparecer como contexto histórico.
- No renombrar ni sustituir globalmente el repositorio, la rama, la carpeta del frontend o servicios heredados sin una tarea de migración independiente y una auditoría de dependencias.
- VYR-006 no incluye migraciones de nombres ni cambios de infraestructura.
