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


## Rediseño de navegación — 2026-10-09
- Se reorganizó el catálogo como carrusel horizontal: las tarjetas no se apilan en una columna larga.
- Se añadieron controles anterior/siguiente y desplazamiento lateral con ajuste de tarjeta (scroll snap).
- En móvil se compactaron portada y encabezado para que la exploración principal aparezca antes y requiera menos desplazamiento vertical.
- Se mantiene búsqueda, categorías, guardados y enlaces externos; no se añadieron APIs ni costos.
- Commits: HTML `61fbec55fef35bffa333886b36a0447344e6b0a6`, CSS `88a667039d2febe42a33df1adefe2e690e7b08fc`, JS `0b45b019308d442a84a342e8a9b58a6f86e09068`.
- Pendiente: confirmar el despliegue final y hacer revisión visual en el navegador móvil; el chequeo de eventos no sustituye esa inspección visual.


## Personalización e inmersión — 2026-10-09
- Se añadió un menú desplegable `Mis gustos` con temas seleccionables y persistencia local en el dispositivo.
- Se añadió una vista inmersiva a pantalla completa para abrir una tarjeta, marcar `Me interesa` y pedir otro descubrimiento.
- El orden de `Para ti` ahora pondera gustos seleccionados, señales locales (interés, apertura, omisión) y guardados. El aprendizaje es local y experimental, no un modelo entrenado ni una integración con los algoritmos internos de las plataformas.
- El campo de popularidad solo se considerará para registros verificados con una métrica de viralidad disponible. En el catálogo actual no existen métricas reales ni feeds conectados; no se debe afirmar que ya encuentra lo más viral de YouTube, TikTok, Instagram o Facebook.
- Nuevos commits: HTML `4cb95590e5ce2d33fe9d34fe1c565a270a8925d7`, CSS `c387c9ecb571d235fb7ff5718cd7fb15d2bc14fb`, JS `6e5023fcdc7a5b858071139e0a32f578c45ffc98`.
- Verificación parcial: elementos de menú y visor presentes; llaves JS balanceadas; Render inició despliegue de los cambios. Pendiente confirmar el despliegue final y probar el flujo visual en móvil.
