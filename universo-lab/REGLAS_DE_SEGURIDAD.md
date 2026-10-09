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
