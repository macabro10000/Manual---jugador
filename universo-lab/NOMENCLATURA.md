# VyROX — Nomenclatura oficial y referencias heredadas

**Estado:** norma documental para el laboratorio.  
**Vigencia:** desde VYR-006.  
**Repositorio:** `macabro10000/Manual---jugador`.  
**Rama de laboratorio:** `lab/universo-frontend`.

## 1. Nombre canónico del producto

- **Marca y nombre del producto:** VyROX.
- En documentación activa, interfaz, mensajes, títulos nuevos y entregables, escribir **VyROX**.
- No llamar al producto «Universo», «UNIVERSO VyROX» ni «Universo VyROX».
- El nombre histórico puede aparecer en entradas antiguas cuando sea necesario para entender decisiones previas; debe identificarse como histórico, no como nombre actual.

## 2. Identificadores técnicos que se conservan por ahora

| Elemento | Identificador vigente | Regla |
|---|---|---|
| Repositorio GitHub | `macabro10000/Manual---jugador` | Conservar. Es el nombre real del repositorio; no renombrarlo como parte de VYR-006. |
| Rama de laboratorio | `lab/universo-frontend` | Conservar por ahora. Cambiarla exige una tarea de migración separada que revise integraciones y automatizaciones. |
| Carpeta del frontend | `universo-lab/` | Conservar por ahora porque Render publica desde ella. No hacer reemplazos globales ni moverla sin auditar configuración, rutas relativas y despliegue. |
| Carpeta del backend | `vyrox-server/` | Nombre técnico canónico del backend independiente. |
| Sitio estático de laboratorio | servicio `vyrox`, URL `https://vyrox.onrender.com` | Es el entorno de laboratorio del frontend; verificar el estado actual antes de declarar un despliegue saludable. |
| Sitio estático anterior de laboratorio | `universo-explorador` | Referencia heredada. Conservar y no eliminar sin auditoría y autorización. No usar como nombre actual del producto. |
| Servicio histórico separado | `manual-jugador`, URL `https://manual-jugador.onrender.com`, rama `main` | Proyecto/servicio separado y protegido. No modificarlo para VyROX. |
| Archivo histórico maestro | `ARCHIVO_DE_OPERACION.md` | Archivo de referencia histórica. No borrar ni sobrescribir durante la reorganización documental. |
| Documentación operativa activa | `ESTADO_ACTUAL.md`, `ARQUITECTURA.md`, `REGLAS_DE_SEGURIDAD.md`, `PLAN_DE_TRABAJO.md`, `BITACORA.md`, `AUTENTICACION_Y_SESIONES.md`, `NOMENCLATURA.md` dentro de `universo-lab/` | Fuente organizada de estado, arquitectura, reglas, plan, historial, contrato de autenticación y nombres. |

## 3. Regla para referencias históricas

1. No cambiar identificadores reales de GitHub, Render, carpetas o URLs solo para que el texto se vea uniforme.
2. En documentación nueva, separar claramente **nombre de producto** de **identificador técnico heredado**.
3. En documentación histórica, preservar la evidencia y el sentido original. Añadir una aclaración en vez de reescribir el pasado.
4. No hacer reemplazos globales de `Universo`, `universo-lab`, `lab/universo-frontend` o `universo-explorador`: algunos son referencias técnicas activas.
5. Toda futura migración de identificadores debe ser una tarea independiente con inventario de dependencias, plan de reversión, cambios de configuración y verificación posterior.

## 4. Alcance de VYR-006

VYR-006 debe usar los nombres canónicos anteriores al comparar dominio/origen de API, cookies, persistencia y OAuth. Esta norma no autoriza a crear servicios, bases de datos, credenciales, secretos ni cambios de producción.

## 5. Criterio de aceptación documental

- El producto se denomina VyROX en la documentación activa.
- Los identificadores heredados están explicados y no se cambian accidentalmente.
- La documentación histórica se conserva.
- VYR-006 comienza solo después de comprobar el HEAD real de la rama y leer este archivo junto con `ESTADO_ACTUAL.md`, `PLAN_DE_TRABAJO.md` y `AUTENTICACION_Y_SESIONES.md`.
