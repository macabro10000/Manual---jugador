# ARCHIVO DE OPERACIÓN — UNIVERSO

Última actualización: 2026-10-09

## Objetivo
Construir UNIVERSO: un sitio móvil para descubrir videos, noticias, curiosidades y retos en un solo lugar, usando enlaces, identificadores, categorías y preferencias. No descargar ni almacenar copias de videos de terceros.

## Separación y seguridad
- Repositorio: `macabro10000/Manual---jugador`.
- Rama exclusiva de laboratorio: `lab/universo-frontend`.
- Carpeta del proyecto: `universo-lab/`.
- Servicio de prueba Render: `universo-explorador`.
- URL de prueba: https://universo-explorador.onrender.com
- Servicio de producción existente: `manual-jugador`, rama `main`, URL https://manual-jugador.onrender.com.
- Regla: no modificar `main` ni producción para desarrollar UNIVERSO. Mantener la rama y servicio separados.

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

## Reglas del producto
1. Usar reproductores oficiales y mecanismos permitidos por cada plataforma.
2. Si una publicación no admite inserción, mostrar un enlace a su fuente original.
3. No extraer contenido mediante scraping que infrinja condiciones de uso.
4. No almacenar archivos de video de terceros.
5. No inventar publicaciones, titulares, fechas, estadísticas ni disponibilidad de contenido.
6. Priorizar herramientas gratuitas y revisar límites/cuotas antes de activar APIs que requieran credenciales o facturación.
7. No pedir al usuario acciones manuales hasta que sean realmente necesarias; dar instrucciones Android concretas y una tarea por vez.
8. Verificar cambios y despliegues antes de declararlos terminados.

## Próximas tareas
1. Revisar la página desplegada en un teléfono y corregir cualquier fallo visual o de navegación.
2. Reemplazar los registros de demostración por publicaciones concretas y verificadas, con fecha y fuente comprobables.
3. Diseñar adaptadores separados por plataforma; empezar por fuentes oficiales y enlaces que no necesiten credenciales.
4. Investigar qué contenido puede mostrarse mediante embeds oficiales, o requiere API y autorización. No activar APIs con costo sin aprobación.
5. Añadir pruebas automatizadas de estructura, enlaces, errores de carga y diseño móvil.
6. Solo después de revisión, evaluar una publicación controlada; nunca fusionar automáticamente en producción.

## Último hito
- Se creó el servicio Render `universo-explorador` conectado a la rama `lab/universo-frontend`, con directorio publicado `universo-lab`. Servicio ID: `srv-db4js3id0e5s73ckoed0`.
- Se agregó `content.json` como catálogo independiente y se actualizó `app.js` para cargarlo. Catálogo: 9 registros demo; IDs únicos; campos requeridos presentes; sin campos antiguos `type/source/url/label` en el renderizado.
- Commit de catálogo: `200335f70fd66b6627e8a984c5a4d4d2f3aa21c0`.
- Commit de carga del catálogo: `099cd32b99a4970c8082f16524691167da4b6719`.
- Render confirmó como exitoso el despliegue del commit `099cd32b99a4970c8082f16524691167da4b6719` (carga del catálogo). La actualización de este archivo operativo también dispara el despliegue automático del nuevo commit.
