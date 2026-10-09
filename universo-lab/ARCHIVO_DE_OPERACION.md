# ARCHIVO DE OPERACIÓN — VyROX (antes UNIVERSO)

Última actualización: 2026-10-09

> **Documento maestro de continuidad:** antes de cambiar código, abrir una tarea nueva o continuar en otro chat, leer primero la sección **Estado actual y continuidad entre chats** al final de este archivo. Después de cada tarea, actualizar estado, verificaciones y siguiente paso en este mismo archivo y guardar el cambio en esta rama.

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

## Navegación de una sola pantalla — 2026-10-09
- Se sustituyó el diseño de página larga por una vista de exploración a pantalla completa.
- El contenido se recorre verticalmente con ajuste por escena; el menú inferior abre desde la rayita/asa.
- Dentro del menú, las categorías y plataformas se recorren horizontalmente: Principal, YouTube, TikTok, Facebook, Instagram, Curiosidades, Noticias, Retos y Guardados.
- Las preferencias de gustos viven en el mismo menú y se guardan localmente en el dispositivo.
- Principal prioriza primero registros que tengan una métrica de viralidad disponible y verificada; luego aplica señales locales y gustos. No se fabrican vistas ni posiciones virales.
- Limitación importante: el catálogo todavía contiene nueve ejemplos, varios con enlaces genéricos. YouTube/TikTok/Instagram/Facebook aún no tienen feeds reales conectados, por lo que el distintivo informa que es una muestra y las categorías sin registros muestran un estado vacío honesto.
- No se añadió backend, servicio de pago ni scraping. Producción (manual-jugador en main) sigue separada; cambios solo en lab/universo-frontend.
- Commits del rediseño: HTML a90c6045cebff84c24e7fe3102a73f8171d0efb8, CSS 8bac48c320c8a697fc4636f788705386728ca5ab, JS 23f08a496e058827682e246d05818c7578113cdb.
- Pendiente: confirmar el despliegue automático de Render y revisar el flujo visual en navegador móvil real. La confirmación de despliegue no sustituye una prueba visual táctil.

## Navegación por gestos y título dinámico — 2026-10-09
- Se añadió el nombre de la categoría activa en la barra superior, con transición corta al cambiar.
- Gesto vertical sobre el feed: el contenedor usa scroll-snap por pantalla para avanzar o volver entre tarjetas.
- Gesto horizontal sobre el feed: izquierda avanza a la siguiente categoría; derecha vuelve a la categoría anterior, sin abrir el menú.
- El menú inferior sigue disponible mediante la rayita; se puede abrir/cerrar con toque y arrastre vertical en la rayita.
- La fila de categorías conserva desplazamiento horizontal y centra la categoría activa al navegar.
- Validación técnica: JavaScript pasó compilación sintáctica con `new Function`; se verificaron IDs de interfaz y se guardó el código solo en la rama lab/universo-frontend.
- Commits de esta iteración: HTML 28f3b5ba22be1bb71e4c7f50e5bc11553c31fd2a, CSS 09d0244abd1f56ff09e2a8e0aa1af65af78643d3, JS 84d4c3798da344eb7b055847bd10a1dd3c65cd84.
- Pendiente de esta iteración: confirmar el despliegue del último commit en Render y validar los gestos en el navegador táctil. La prueba sintáctica no sustituye la comprobación en dispositivo real.

## Reparación de funcionalidad — 2026-10-09
- Causa raíz encontrada: tres lugares trataban el resultado de `querySelector(".menu-chip")` (un solo elemento) como si fuera una lista y llamaban `.forEach`. En `updateTopCategory()` eso podía detener el render inicial antes de mostrar las tarjetas; además, los botones de categorías no quedaban enlazados. Se corrigió para usar `querySelectorAll(".menu-chip")` en los tres puntos.
- Se reemplazó el manejo incompleto de gestos por Pointer Events explícitos: arriba avanza una tarjeta; abajo vuelve una tarjeta; izquierda avanza categoría; derecha retrocede categoría. Se excluyen botones y enlaces para preservar sus clics.
- CSS ahora usa `touch-action:none` sobre cada tarjeta para que el navegador no intercepte el gesto vertical antes de que la aplicación pueda interpretarlo. El cambio se limita al feed de laboratorio.
- Verificación: el archivo JS compila sintácticamente y las tres iteraciones de menú usan NodeList. Se confirmó el despliegue anterior, pero el despliegue de esta reparación debe confirmarse por separado.
- Commits correctivos: JS 7e94f4d8788c8b010bee8ab4e6b5d3bc1032914f; CSS ef3d7a63d4c13d7c35f951e712ca06f2c7f705a8.

## Categorías de entretenimiento y reproductor integrado — 2026-10-09
- Se ampliaron las categorías del menú: Entretenimiento, Infantil, Adultos, Dramas chinos, Comedia, Anime, Películas, Música, Deportes, Videojuegos, Ciencia y Animales, conservando las plataformas y secciones anteriores.
- Se añadió soporte de reproducción integrada para URL de inserción autorizadas de YouTube/Vimeo y el reproductor oficial de TikTok cuando el registro tiene un ID de video real. Los enlaces raíz de las plataformas no son videos y no se convierten mágicamente en reproductores.
- Limitación importante: el catálogo actual sigue teniendo 9 tarjetas de demostración y no contiene IDs de videos reales ni métricas virales. Por eso esta actualización prepara la interfaz y el reproductor, pero NO crea todavía un feed real de TikTok ni una selección real de los videos más virales. Para eso hacen falta URLs/IDs reales, fuentes oficiales o autorizadas y métricas accesibles. La reproducción integrada depende de que la plataforma permita insertar cada publicación.
- La categoría Infantil debe tener clasificación y filtros adecuados; la categoría Adultos significa contenido general para público adulto, no contenido sexual explícito.
- Cambios de interfaz/código en rama laboratorio; producción `main` no se modificó.


## Portada editorial tipo Discover — 2026-10-09
- Se redujo la navegación visible a Principal, Noticias y descubrimientos, y Guardados. Ya no hay botones separados de YouTube, TikTok, Instagram ni Facebook.
- Se reescribió `app.js` para eliminar reproductores incrustados de redes sociales, filtrar registros marcados como demostración y mostrar historias editoriales con titular, resumen, fuente, fecha y enlace seguro HTTPS cuando esos datos existan.
- Se corrigió la estructura del renderizado y se verificó que `app.js` compila sintácticamente; también se comprobó que el menú HTML contiene únicamente las tres secciones indicadas.
- CSS actualizado para mostrar tarjetas editoriales verticales, más parecidas a un feed de noticias y no a una pantalla de video a pantalla completa.
- El catálogo disponible solo contiene datos de demostración, que ahora se excluyen deliberadamente. La portada puede mostrar el estado de preparación hasta incorporar noticias reales con fuente y fecha verificables; no afirmar que ya hay noticias en vivo.
- Rama modificada: `lab/universo-frontend`. Producción `main` no se modificó.


## Tres pantallas laterales — 2026-10-09
- Se definió la navegación principal en tres pantallas: Principal · Videos, Noticias y Estados. Guardados queda como utilidad adicional y no forma parte del recorrido lateral.
- El gesto horizontal sobre el feed cambia entre Noticias ↔ Principal ↔ Estados; dentro de Principal, los videos se recorren verticalmente. Las noticias conservan tarjetas editoriales verticales.
- Principal incluye una herramienta de prueba local para elegir hasta tres archivos de video del teléfono y reproducirlos con el reproductor HTML5 integrado. Los archivos se usan mediante URL temporales del navegador, no se suben al servidor ni se comparten con otros usuarios; al cambiar los archivos se liberan las URL temporales anteriores.
- Estados tiene una pantalla inicial honesta. La publicación y visualización de estados entre usuarios requiere una futura capa de cuentas y almacenamiento; no se simula una comunidad activa.
- Las noticias siguen filtrando los registros de demostración. No hay todavía fuentes reales conectadas ni titulares inventados.
- Cambios aplicados únicamente en `lab/universo-frontend`; no se modificó `main` ni el servicio `manual-jugador`.
- Commits de esta etapa: HTML `2ff0fbc28764e13d04f847b0b1b84c716eb89217`, JS `88b1b5427fc5939f46c0f79f63f0fa227a5042cb`, CSS `57d4bd6f7bb5cc85f946729b721501c74d7e25c7`.
- Verificación técnica: `app.js` pasó compilación sintáctica con `new Function`; se confirmó presencia del gesto horizontal y del selector local de videos. Pendiente: confirmar despliegue final y probar el gesto y reproducción en el navegador Android real.


## Retiro de preferencias «Mis gustos» — 2026-10-09
- Se quitó del menú la sección «Mis gustos» y sus casillas de temas, tal como se pidió. El menú conserva Principal · Videos, Noticias, Estados y Guardados.
- Se mantiene la barra de filtros dentro de Noticias: Todos, Economía, Entretenimiento, Ciencia, Tecnología, Mundo y Virales.
- Cambio realizado únicamente en `lab/universo-frontend`; producción `main` no se modificó.
- Commit HTML: `3be60497e7cfccef20cfa626c74e4c0654241af2`.
- Pendiente: confirmar despliegue automático de este cambio en Render.


## Corrección de gestos accidentales — 2026-10-09
- Se endureció la detección del gesto lateral: ahora requiere desplazamiento horizontal de al menos 100 px y una relación horizontal/vertical de 1.8, en vez de 65 px y 1.35.
- Los gestos que comienzan sobre botones, enlaces, campos, videos o la barra de filtros no cambian de pantalla. Se limpia el gesto si Android cancela el toque.
- Objetivo: reducir cambios involuntarios de pantalla al intentar recorrer el contenido. Se mantiene la navegación lateral cuando el gesto es claramente horizontal.
- Commit JS: `6ade6e7839fe9db85fe0dd74c52d3738475f4c9b`.
- Pendiente: confirmar despliegue en Render y probar con el dedo en Android; no se afirma todavía que la prueba física se haya realizado.


## Noticias verificadas y lectura en voz alta — 2026-10-09
- Se reemplazaron registros de demostración por cinco resúmenes editoriales con enlaces directos a EFE, Reuters y Minuto60, publicados el 8–9 de octubre de 2026. Categorías: economía, entretenimiento, ciencia/medio ambiente, tecnología y mundo.
- Cada tarjeta indica fuente, fecha, resumen original y enlace al artículo. No se copian artículos completos ni se inventan métricas de visitas; el catálogo aclara que la selección es inicial y que el feed automático aún no está conectado.
- Se añadió botón «Escuchar» con SpeechSynthesis del navegador, idioma `es-CO`, que lee el titular y el resumen y permite detener la lectura. No requiere API de pago; depende de la compatibilidad y voces disponibles en el navegador Android.
- Se mejoró la tipografía de titulares y controles para móvil.
- Commits: catálogo `66d188f705d7ac77d943159d9fec5a8b05f984ea`; JS `c23ee645e08a96ce4b047a45c7fba17d070e1acb`; CSS `0329434c26ed6cd95c0be2af2820389da7d6b00a`.
- Pendiente: confirmar despliegue de Render, probar lectura en el teléfono y después automatizar la actualización mediante fuentes RSS/APIs permitidas con tareas programadas. La lectura en voz alta y estos artículos iniciales no equivalen todavía a un robot autónomo que actualiza noticias de forma continua.


## Vigencia y orden de noticias — 2026-10-09
- Se agregó `addedAt` al catálogo para marcar cuándo entró cada noticia al feed. La regla de interfaz excluye noticias con más de 24 horas desde esa marca, incluso si están en Guardados; al expirar, dejan de mostrarse en el feed.
- Las noticias vigentes se ordenan por fecha de publicación, de más reciente a más antigua, para que las antiguas vayan quedando abajo cuando entren noticias nuevas.
- El vencimiento se calcula en el navegador y no borra físicamente el registro de `content.json`; para que el catálogo siga lleno después de 24 horas hace falta conectar la automatización de nuevas noticias, que todavía está pendiente.
- Verificación técnica: `app.js` pasó compilación sintáctica con `new Function`. Cambios solo en `lab/universo-frontend`; producción `main` no se modificó.
- Commits: expiración inicial `56695ab00975461c2638c8cb6ef29e1f235a35bc`, orden por fecha `455732595995c7917543f0a523bdce25cb98dba5`, catálogo con `addedAt` `6d274a410bd2c89f4d6f864db6a64e24617996b7`, expiración también en Guardados `2bfd9204c32eeade4cdfa023ccb7da1fc9a0c8d6`.
- Pendiente: confirmar el despliegue de Render y probar la expiración/orden en Android; no se afirma que la prueba física ya se realizó.


## Legibilidad de tarjetas de noticias — 2026-10-09
- Diagnóstico del código: las tarjetas sin imagen mostraban un pictograma de reserva grande (▤) dentro de `.story-fallback`, con apariencia de cuadro rayado detrás del contenido. No aporta información y compite visualmente con el titular/resumen.
- Corrección: ocultar ese pictograma solo en Noticias y Guardados; se conserva el fondo oscuro de la tarjeta para mantener contraste y legibilidad. No se alteran imágenes reales ni la estructura del texto.
- Cambio únicamente en `lab/universo-frontend`; no se modificó `main` ni producción.
- Commit CSS: `f163fd0e99b9168e81513f2016b88ab87169db74`.
- Pendiente: comprobar que Render publique este commit y revisar visualmente en el navegador Android; no se afirma que la pantalla física ya haya sido verificada.


## Miniaturas de noticias y soporte de video — 2026-10-09
- Las tarjetas de Noticias y Guardados muestran una miniatura circular discreta a la derecha de la fuente/fecha; la imagen se enlaza con la noticia original. Si falla la carga, la miniatura se oculta sin tapar el texto.
- El catálogo incorpora URLs de imágenes relacionadas y sus créditos descriptivos para las cinco noticias iniciales. Las imágenes se cargan de forma diferida.
- Se preparó soporte opcional para un video directo `.mp4`, `.webm` u `.ogg` en el campo `videoUrl`. No se añadieron videos porque no se verificó una URL directa de video para estas noticias; no se incrustan videos inventados ni reproductores vacíos.
- Verificación técnica: `app.js` pasa compilación sintáctica con `new Function` y `content.json` se puede analizar como JSON. No se ha comprobado la visualización física en Android.
- Cambios solo en `lab/universo-frontend`; no se modificó `main` ni producción. Commits de esta mejora: catálogo `498fe5265d0fbcdb56933aa11e39ac97978b00ab`, CSS `c1de4250887992ff788045e0d08955f3665f3572`, JS `efe852b6e3be81ec17584c45e81be6d3bb0bc2da`.


## Corrección de miniatura de la última noticia — 2026-10-09
- Incidencia: la miniatura de la noticia sobre el robot de Westcol podía no cargar porque se había usado una URL de imagen de otro medio que no estaba verificada como la imagen principal de Minuto60.
- Corrección: se reemplazó por la imagen enlazada directamente desde la noticia original de Minuto60 (`d33tk5b80rpokn.cloudfront.net/images/westcol-20261009-104502_20261009_104502_350.webp`) y se actualizó el crédito descriptivo.
- Verificación: `content.json` vuelve a analizarse correctamente como JSON y el registro `news-westcol-robot-20261009` contiene la nueva URL. La página original identifica esa imagen como foto del robot de Westcol. No se ha verificado todavía en el navegador Android que el CDN la entregue en el dispositivo.
- Commit de catálogo: `3f9004a4addb31a8a80c1187e6acbc793027f35c`.
- Solo rama `lab/universo-frontend`; producción (`main`) intacta.


## Regla nueva: revisión automática y notificaciones — 2026-10-09
- El sistema debe revisar fuentes de noticias cada 30 minutos.
- Debe detectar publicaciones nuevas, evitar duplicados, comprobar fecha y enlace original, clasificar por categoría y registrar la fuente.
- Solo debe publicar automáticamente noticias que superen las comprobaciones definidas; si no hay corroboración suficiente, deben quedar pendientes y no presentarse como verificadas.
- Cuando se publique una noticia nueva, debe intentar enviar una notificación al teléfono del usuario. Para notificación web push real se necesitarán permiso explícito en el navegador y una suscripción activa del dispositivo; no basta con que la página esté abierta.
- Mantener imágenes de la publicación original cuando se puedan obtener legalmente y comprobar que cargan. Si solo hay imagen ilustrativa, indicarlo expresamente. No descargar ni republicar videos de terceros; enlazar o insertar reproductores oficiales cuando esté permitido.
- Mantener la regla existente de ocultar del feed las noticias después de 24 horas desde su incorporación, sin borrar el histórico automáticamente.
- Restricción técnica: la interfaz actual sigue siendo estática y aún no tiene colector RSS, tarea programada, almacenamiento central de deduplicación ni servicio de notificaciones. Esta regla queda registrada como requisito pendiente; no afirmar que ya funciona hasta desplegar y probar cada componente.
- Diseño previsto: tarea programada separada en laboratorio cada 30 minutos, empezando por RSS/fuentes públicas gratuitas; validación de fecha/URL y deduplicación; salida controlada al catálogo; notificación web push con claves y suscripción configuradas. No modificar producción ni contratar APIs de pago sin aprobación.


## Auditoría inicial de catálogo y persistencia — 2026-10-09
- Se leyó y analizó `universo-lab/content.json`: JSON válido, 5 registros, cada uno con ID, titular, fuente, URL canónica, fecha de publicación y `addedAt`.
- Comprobación web directa de las 5 URL canónicas: los artículos de EFE sobre El Niño, el robot Luka y el acuerdo de paz, el artículo de Reuters sobre la posible asistencia del FMI y el artículo de Minuto60 sobre el robot de Westcol existen y corresponden al tema descrito. Se detectó que el titular de El Niño en el catálogo no coincide exactamente con el titular publicado por EFE; la automatización debe conservar el titular original de la fuente o dejar claro que es un resumen editorial.
- Esta revisión confirma que los enlaces de origen existen, pero no constituye corroboración independiente de todos los hechos. El campo `contentStatus: verified` no debe asignarse automáticamente solo porque una URL responde; la futura regla debe distinguir `source_checked` de `independently_corrobated` (corroboración externa).
- Persistencia actual: el catálogo está versionado en GitHub, por lo que no depende de que Render esté despierto y puede recuperarse de versiones anteriores del repositorio. El sitio `universo-explorador` es estático y no ejecuta actualmente un backend ni una tarea programada; todavía no existe una base de datos central para noticias nuevas o suscripciones push.
- Decisión de arquitectura pendiente de implementación: el backend puede tener arranque en frío si se usa un servicio gratuito que duerme, pero la información crítica debe persistirse fuera de la memoria/disco efímero del proceso (por ejemplo, almacenamiento persistente externo o repositorio versionado controlado). La disponibilidad del backend y la durabilidad de los datos son problemas diferentes.
- No se creó ningún servicio nuevo ni se tocaron producción o la rama `main`. La automatización y las notificaciones siguen pendientes; no afirmar que ya funcionan.


## Costos de programación y decisión de persistencia — 2026-10-09
- Se inspeccionó el workspace Render: UNIVERSO solo tiene el servicio estático gratuito `universo-explorador`; no tiene backend, base de datos, cron ni worker. El servicio `manual-jugador` de producción sigue separado y no se toca.
- Se consultó la página oficial de precios de Render: los Cron Jobs se cobran por tiempo de ejecución; no son un servicio gratuito permanente. Por la regla de costo cero, NO crear un Cron Job de Render ni otro recurso facturable sin autorización explícita.
- Alternativa candidata sin costo adicional: GitHub Actions con programación `schedule` en la rama de laboratorio. El horario programado puede retrasarse y no debe considerarse un reloj de precisión; antes de habilitar escritura automática hay que validar fuentes RSS, controles de deduplicación, permisos mínimos del token y recuperación si una ejecución falla.
- Riesgo de datos: no guardar estado crítico solo en el filesystem de un servicio Render gratuito, porque es efímero. El catálogo versionado en GitHub es recuperable; las suscripciones Web Push contienen datos privados y no deben guardarse como contenido público del repositorio.
- Decisión por ahora: no crear servicios ni base de datos, no tocar `main`, no introducir secretos ni activar publicación automática. Próxima implementación segura: preparar un colector RSS de prueba que solo lea fuentes permitidas y genere un informe de candidatos sin modificar el catálogo; probar parseo, fechas, URL canónica y deduplicación antes de habilitar publicación.
- Fuentes oficiales consultadas: página de precios de Render y documentación de planes/servicios. Esta auditoría no crea cargos ni modifica servicios.


## Prototipo de auditoría RSS en solo lectura — 2026-10-09
- Se añadió `universo-lab/scripts/rss-audit.mjs`: consulta dos feeds públicos candidatos (BBC Mundo y DW Español), aplica límite de tiempo, valida título/fecha/URL HTTPS, normaliza parámetros de seguimiento y cuenta duplicados por URL canónica.
- El script genera `rss-audit-report.json` con el modo `READ_ONLY_DRY_RUN`; no modifica `content.json`, no publica noticias y no envía notificaciones. La existencia de un enlace RSS no se interpreta como prueba de veracidad.
- Se añadió `.github/workflows/universo-rss-audit.yml` con disparador manual (`workflow_dispatch`), permisos de contenido de solo lectura y retención del informe como artefacto durante 7 días.
- La ejecución programada cada 30 minutos NO se activó todavía. Primero hay que ejecutar la auditoría manual y revisar los resultados reales de los feeds. El workflow no se ha declarado probado hasta observar una ejecución satisfactoria.
- Cambios realizados exclusivamente en `lab/universo-frontend`; sin cambios a `main`, producción, catálogo ni servicios de Render. No se agregaron secretos ni recursos de pago.


## Identidad visual VyROX — 2026-10-09
- Se cambió el nombre visible de la experiencia de UNIVERSO a VyROX en título, metadatos, marca superior, accesibilidad y textos de interfaz.
- Se diseñó una identidad visual más divertida con gradiente multicolor animado en la «y», una órbita alrededor del símbolo, brillo suave y acentos coral, cian, violeta y amarillo.
- Las animaciones respetan `prefers-reduced-motion` para usuarios que reducen movimiento.
- Se mantuvieron los nombres técnicos internos, rutas, archivos, almacenamiento local y el servicio de laboratorio para no romper compatibilidad. El proyecto continúa en `lab/universo-frontend`; no se modificó `main` ni el servicio de producción.
- Estado: cambios de código aplicados; queda pendiente validar el despliegue en Render y comprobar visualmente la animación en Android. El nombre VyROX es un candidato de marca; su disponibilidad legal todavía debe investigarse.


## Estado actual y continuidad entre chats — 2026-10-09 (fuente de verdad)

### Identidad y ubicación del proyecto
- Marca visible vigente: **VyROX** (se escribe exactamente así: V mayúscula, y minúscula, ROX mayúsculas). El nombre anterior era UNIVERSO; no volver a presentarlo como marca visible.
- Repositorio: `macabro10000/Manual---jugador`.
- Rama de trabajo permitida: `lab/universo-frontend`.
- Carpeta del frontend: `universo-lab/`.
- Archivos principales: `index.html`, `styles.css`, `app.js`, `content.json`.
- Archivo de continuidad: `universo-lab/ARCHIVO_DE_OPERACION.md` (este documento).
- Auditoría RSS de solo lectura: `universo-lab/scripts/rss-audit.mjs`.
- Workflow manual RSS: `.github/workflows/universo-rss-audit.yml`.
- La ruta técnica `universo-lab`, los nombres internos de almacenamiento local `universo_*` y nombres de archivos/workflow se mantienen por compatibilidad; no confundirlos con la marca visible.

### Servicios Render: distinguir el anterior del nuevo
- **Servicio nuevo VyROX:** nombre `vyrox`, ID `srv-db4msvjbc2fs73c07uig`, URL `https://vyrox.onrender.com`, rama `lab/universo-frontend`, publish path `universo-lab`, auto deploy activado. Dashboard: `https://dashboard.render.com/static/srv-db4msvjbc2fs73c07uig`.
- **Verificación del nuevo servicio:** Render devolvió estado de deploy `live` para deploy `dep-db4mt03bc2fs73c08000`, basado en commit `81cdae9e37eb660b641098b33f512939c4c3fae1`. Esto confirma el despliegue de Render, pero no reemplaza una comprobación visual de la página desde Android.
- **Servicio anterior conservado:** `universo-explorador`, ID `srv-db4js3id0e5s73ckoed0`, URL `https://universo-explorador.onrender.com`. Se conserva temporalmente para no perder la versión anterior. No eliminarlo hasta verificar el nuevo enlace con el usuario.
- **Producción ajena al laboratorio:** `manual-jugador`, rama `main`, URL `https://manual-jugador.onrender.com`. No modificarla para el desarrollo de VyROX.
- **Importante:** los dos servicios de laboratorio apuntan al mismo repositorio/rama/carpeta; el nuevo dominio no crea un proyecto de código distinto.

### Trabajo completado y límites reales
- Se actualizó el nombre visible a VyROX en título HTML, metadatos, marca superior, textos de accesibilidad y textos de interfaz.
- Se añadieron efectos visuales: gradiente animado en la letra «y», órbita/símbolo, brillo y acentos multicolor; se contempla `prefers-reduced-motion`.
- El despliegue con esos cambios está `live` en el servicio nuevo `vyrox`.
- Frontend actual: pantalla Principal · Videos, Noticias, Estados y Guardados; videos elegidos desde el teléfono solo se reproducen localmente, no se publican a otros usuarios.
- Noticias actuales: catálogo estático `content.json` con cinco resúmenes editoriales y enlaces a fuentes. El frontend oculta registros tras 24 horas desde `addedAt`; el catálogo versionado no se borra automáticamente.
- **No está implementado aún:** búsqueda/publicación automática cada 30 minutos, deduplicación avanzada de eventos, backend/base de datos para noticias, cuentas comunitarias, almacenamiento central, notificaciones push. No afirmar que esas funciones ya existen.
- Auditoría RSS creada en modo de solo lectura y workflow manual creados, pero su ejecución satisfactoria todavía no se ha confirmado. No habilitar escritura automática hasta validar feeds y deduplicación.
- No hay permiso para crear servicios facturables ni usar APIs pagas. No publicar artículos completos de terceros ni medios sin autorización; usar resúmenes propios y fuentes atribuidas.

### Reglas obligatorias de trabajo para cualquier chat nuevo
1. Leer esta sección completa y luego las secciones históricas pertinentes antes de editar.
2. Continuar desde el estado documentado; no reiniciar ni repetir tareas ya verificadas.
3. Trabajar en `lab/universo-frontend`; nunca tocar `main` ni `manual-jugador` sin una autorización explícita.
4. Un objetivo principal por iteración. Inspeccionar archivos actuales y causa raíz antes de modificar; no hacer parches especulativos.
5. No declarar algo terminado por haber escrito código: diferenciar **código cambiado**, **prueba técnica**, **deploy live** y **prueba real en Android**.
6. No crear otro servicio, eliminar servicios, cambiar dominios ni tocar configuración de producción sin revisar consecuencias y evitar duplicados. El servicio anterior se conserva por ahora.
7. Tras cada tarea, actualizar este archivo en el mismo branch, registrando fecha, cambios, archivos, commit, verificaciones reales, limitaciones y siguiente paso. Esa actualización es parte obligatoria de terminar la tarea.
8. Si hay error o se descubre una causa nueva, registrar evidencia y la corrección; no borrar el historial previo.
9. Preferir soluciones gratuitas. No activar recursos potencialmente facturables sin permiso.
10. En las instrucciones al usuario, ser directo, en español, una tarea a la vez; pedir acción manual solo cuando las herramientas disponibles no permitan ejecutarla.

### Siguiente paso exacto
1. Abrir `https://vyrox.onrender.com` en el teléfono Android y comprobar si carga, si la marca dice VyROX y si la animación de la «y»/órbita se ve correctamente. Si falla, registrar el síntoma concreto antes de editar.
2. No borrar ni desactivar `universo-explorador` hasta que el usuario confirme que el nuevo dominio funciona.
3. Después, continuar la auditoría RSS manual en modo de solo lectura; averiguar cómo ejecutar el workflow y revisar el artefacto real. Si no existe una herramienta de ejecución disponible, pedir al usuario únicamente la acción manual necesaria y explicar los pasos exactos.
4. Antes de terminar cada una de esas tareas, actualizar este documento y guardar un commit en `lab/universo-frontend`.

### Registro de continuidad — cambio de dominio y respaldo
- Fecha: 2026-10-09.
- Se creó el servicio estático Render `vyrox` (ID `srv-db4msvjbc2fs73c07uig`) con auto deploy desde `lab/universo-frontend`, publish path `universo-lab`.
- Render confirmó el deploy `dep-db4mt03bc2fs73c08000` como `live`, commit desplegado `81cdae9e37eb660b641098b33f512939c4c3fae1`.
- El servicio viejo `universo-explorador` sigue existiendo y no se eliminó.
- Esta actualización deja explícito que este archivo es el registro de estado para reanudar el trabajo en un chat nuevo.

## Auditoría de estructura y autenticación VyROX — 2026-10-09

### Evidencia inspeccionada
- Se inspeccionó el árbol completo del commit de la rama `lab/universo-frontend` (HEAD observado durante esta auditoría: `650a9ce50faa8bfd877943f3c5be495317bfd20a`). La aplicación publicada por el servicio `vyrox` está en `universo-lab/`.
- Dentro de `universo-lab/` solo existen HTML, CSS, JavaScript, catálogo JSON, documentación, assets y el prototipo RSS. No hay `package.json`, servidor Node/Express, rutas API, modelos de usuario, base de datos ni endpoints de autenticación.
- `universo-lab/index.html` no incluye el cliente de Google Identity Services ni un botón de inicio de sesión.
- `universo-lab/app.js` carga el catálogo desde `./content.json` y mantiene preferencias/guardados localmente en el navegador. No implementa autenticación ni sesiones remotas.
- Se inspeccionó, como referencia técnica separada, el repositorio `macabro10000/Librex1` en `main`: `package.json`, `server/routes/passenger.js`, `server/routes/driver.js`, `server/routes/admin.js`, `server/models/session.js`, `server/models/admin-session.js`, `server/server.js` y la configuración de Render.
- El patrón de autenticación existente en Libres1 utiliza Google Identity Services en el frontend, envía el ID token al backend, verifica la credencial en el servidor con `google-auth-library` y el `audience` correspondiente, exige `email_verified === true`, y crea una sesión del servidor mediante cookie. El servidor también contempla revocación de sesiones y separación por rol. Es una referencia de implementación, no una autorización para conectar VyROX a los datos o backend de Libres1.

### Conclusión técnica
- La autenticación con Google **no está implementada** en VyROX. Añadir solo un botón visual no sería suficiente ni seguro.
- Para mantener los proyectos aislados, la arquitectura recomendada para la siguiente fase es reutilizar el patrón técnico de verificación Google + sesión segura, pero crear para VyROX sus propias rutas, usuarios, sesiones, configuración OAuth y persistencia; no reutilizar la base de datos, las cookies, las identidades ni las rutas de Libres1.
- El identificador público `@usuario` debe ser un campo único propio de VyROX, separado del correo y del identificador interno de Google (`sub`). La asignación y comprobación de unicidad debe hacerse en el backend y en la base de datos, no solo en el navegador.
- La mensajería tipo WhatsApp requerirá cuentas verificadas, contactos/identidades, persistencia de conversaciones y mensajes, autorización por conversación y controles contra abuso. No está presente en el frontend actual.
- Antes de activar el inicio de sesión se deberá configurar el origen autorizado de VyROX en Google Cloud y las variables de entorno del backend independiente. No copiar secretos ni reutilizar automáticamente el cliente OAuth de otro proyecto.
- No se creó backend, base de datos, cliente OAuth ni servicio Render en esta auditoría. No se cambiaron archivos de la aplicación ni se modificó `main` o el servicio de producción.

### Estado y siguiente paso exacto
- Auditoría de estructura y método anterior: completada mediante lectura de archivos y metadatos de GitHub.
- Cambios de código: ninguno.
- Prueba de autenticación: no aplicable todavía; no existe implementación que probar.
- Próximo paso: diseñar y revisar en laboratorio la arquitectura mínima del backend independiente de VyROX (autenticación Google, sesiones, perfil con `@usuario` único y base para mensajería), incluyendo archivos, variables de entorno y límites del plan gratuito antes de crear recursos o desplegar. Mantener la rama `lab/universo-frontend` y no tocar `main` ni Libres1.



## Proceso 3 — Diseño de arquitectura del backend independiente de VyROX — 2026-10-09

### Alcance y aislamiento
- Se inspeccionó de nuevo el árbol recursivo de `lab/universo-frontend`: la raíz contiene el proyecto estático histórico y `universo-lab/`; el sitio `vyrox` publica únicamente `universo-lab`. No existe todavía carpeta ni paquete de backend.
- Decisión de laboratorio: cuando se autorice implementar, ubicar el servidor en `vyrox-server/` en la raíz del repositorio. El servicio web de Render deberá configurar `Root Directory = vyrox-server`, instalar dependencias allí y ejecutar el servidor allí. El servicio estático actual conserva `Publish Directory = universo-lab`; así el código del backend no queda dentro del directorio publicado por el sitio.
- El backend y sus datos serán exclusivamente de VyROX. No se reutilizan las rutas, cuentas, cookies, credenciales OAuth, secretos, base de datos ni colecciones de Libres1. No se modifica `main`, `manual-jugador` ni el servicio viejo `universo-explorador`.
- Este proceso es solo diseño y documentación: no crea archivos de aplicación, OAuth, base de datos ni servicios Render.

### Arquitectura propuesta para la primera versión
- Frontend estático: `https://vyrox.onrender.com`.
- API independiente: servicio web Node.js + Express dentro de `vyrox-server/`, con ruta de salud `GET /api/health`. Nombre/dominio final del API queda pendiente de disponibilidad y configuración del servicio; no se presupone que ya exista.
- Persistencia: base de datos exclusiva de VyROX, con índices únicos para identidad Google y `handle`. No usar memoria del proceso ni el disco efímero del contenedor para usuarios, sesiones o mensajes. Antes de elegir/provisionar proveedor, verificar cuota gratuita vigente, límites, política de suspensión, copias de seguridad y si exige tarjeta; no crear recursos facturables sin permiso.
- Dependencias iniciales previstas: `express`, `google-auth-library`, `helmet`, un limitador de peticiones mantenido y el controlador oficial de la base de datos que se seleccione. Fijar versiones compatibles y lockfile durante implementación; no instalar ni desplegar todavía.

### Inicio de sesión con Google
1. El frontend carga Google Identity Services y presenta el botón real de acceso.
2. El navegador recibe la credencial de Google y la envía por HTTPS a `POST /api/auth/google`; no guardar el ID token en `localStorage` ni en `sessionStorage`.
3. El backend verifica firma, emisor, caducidad, `audience` igual al OAuth Client ID exclusivo de VyROX y `email_verified === true`. No confiar en nombre, correo ni identificadores enviados por el navegador sin verificar.
4. El backend identifica la cuenta por el `sub` estable de Google y crea/actualiza el perfil mínimo. El `sub` no se expone como identificador público.
5. La sesión usa un token opaco aleatorio de alta entropía; la base de datos guarda solo su hash, fecha de expiración, revocación y metadatos mínimos. Cookie propuesta: `HttpOnly; Secure; SameSite=Lax; Path=/`, sin atributo `Domain`; validar el comportamiento real del navegador Android y el origen del API antes de darlo por probado. Las llamadas autenticadas usan `credentials: "include"`, CORS permite solo el origen exacto del frontend y credenciales, y se valida `Origin` en operaciones mutables. No usar `Access-Control-Allow-Origin: *` con credenciales.
6. `POST /api/auth/logout` revoca la sesión del servidor y elimina la cookie con los mismos atributos; `GET /api/me` devuelve solo el perfil autorizado.

### Identidad pública `@usuario`
- El handle se guarda normalizado sin el carácter `@`; la interfaz lo muestra con `@`.
- Propuesta de validación inicial: 3–20 caracteres, minúsculas ASCII, números y guion bajo; normalizar a minúsculas antes de comprobar. Definir y documentar palabras reservadas antes de habilitar cambios.
- La unicidad no se resuelve con una consulta previa solamente: debe existir un índice único en la base de datos y el backend debe manejar colisiones concurrentes.
- Tras el primer acceso, si la cuenta no tiene handle, el usuario pasa a una pantalla para elegirlo. `POST /api/handles/check` sirve únicamente para dar una indicación preliminar; `PUT /api/me/handle` realiza la asignación definitiva autenticada y maneja la respuesta de conflicto. No usar el correo de Google como handle automático.

### Modelo de datos inicial (diseño, no creado)
- `users`: `id` interno UUID, `googleSub` único, correo normalizado, nombre visible, avatar HTTPS opcional, `handle` normalizado único cuando esté asignado, estado y marcas de tiempo.
- `sessions`: hash del token único, `userId`, expiración, revocación, creación y último uso; retención acotada y limpieza de sesiones expiradas.
- Fase de mensajería posterior: `conversations`, `conversation_members` y `messages`, con pertenencia comprobada en cada lectura/escritura, paginación por cursor, límite de tamaño de mensaje y validación del remitente en el servidor. No aceptar un `senderId` elegido por el cliente.
- La mensajería en tiempo real, notificaciones, bloqueo/reportes, límites antiabuso y políticas de retención se diseñan después de probar y asegurar la autenticación básica.

### Contrato de API propuesto
- `GET /api/health`: estado técnico sin secretos ni datos personales.
- `GET /api/auth/google-config`: expone únicamente el Client ID público y estado de configuración; nunca el client secret.
- `POST /api/auth/google`: verifica credencial, registra/actualiza identidad y establece sesión.
- `GET /api/me`: perfil de la sesión válida.
- `POST /api/handles/check`: valida formato y disponibilidad aproximada.
- `PUT /api/me/handle`: asigna handle único a la cuenta autenticada.
- `POST /api/auth/logout`: revoca sesión.
- Futuro, fuera del MVP de autenticación: `GET/POST /api/conversations`, `GET /api/conversations/:id/messages`, `POST /api/conversations/:id/messages`; todas las rutas requieren autorización por miembro.

### Variables de entorno previstas
- `PORT`: puerto proporcionado por Render.
- `NODE_ENV=production` en el servicio publicado.
- `GOOGLE_CLIENT_ID`: Client ID exclusivo de VyROX; puede mostrarse en frontend, pero se configura y valida en backend.
- `MONGODB_URI` o la variable equivalente del proveedor que se elija: secreto privado, solo para el servicio API.
- `SESSION_SECRET`: secreto aleatorio de servidor para funciones criptográficas adicionales si se necesitan; nunca sustituye tokens aleatorios de sesión.
- `FRONTEND_ORIGIN=https://vyrox.onrender.com`: allowlist exacta.
- No incluir valores secretos en Git, archivos frontend, logs, respuestas API ni documentación. El nombre del proveedor y variables finales se decidirán tras verificar costes y límites.

### Controles mínimos antes de permitir cuentas reales
- HTTPS; CORS de origen exacto; Helmet; validación estricta del cuerpo y tamaño máximo; límites de frecuencia por IP y cuenta; errores sin stack traces; logs sin credenciales ni contenido privado; expiración y revocación de sesión; índices únicos; validación de `Origin`; protección contra abuso; comprobación de dependencias y lockfile.
- Probar en navegador Android: acceso, recarga, persistencia de sesión, cierre de sesión, cuenta sin handle, colisión de handle, credencial inválida/expirada, API dormida y errores de red. Verificar cookies en el contexto real de dos subdominios Render antes de decidir si se requiere un dominio propio.
- No declarar compatibilidad, seguridad ni disponibilidad de producción hasta ejecutar esas pruebas. Los planes gratuitos pueden tener límites o suspensión; no se promete gratuidad permanente.

### Resultado del Proceso 3
- Diseño de arquitectura documentado en este archivo operativo.
- Archivos de aplicación cambiados: ninguno.
- Servicios, base de datos y cliente OAuth creados: ninguno.
- Pruebas de autenticación: todavía no aplican.
- Siguiente paso exacto: implementar en la rama de laboratorio solo el esqueleto del backend en `vyrox-server/` (`package.json`, servidor Express, configuración validada y `GET /api/health`), sin conectar todavía Google ni una base de datos. Después probar localmente/CI y revisar el diff antes de crear el servicio API en Render.


## Proceso 4 — Esqueleto inicial del backend VyROX — 2026-10-09

### Archivos añadidos en laboratorio
- `vyrox-server/package.json`: paquete Node.js ES modules, scripts `start` y `test`, dependencias Express y Helmet, requisito Node.js 20+.
- `vyrox-server/src/config.js`: valida entorno, puerto y origen exacto del frontend; en producción exige `FRONTEND_ORIGIN` explícito y HTTPS.
- `vyrox-server/src/server.js`: aplicación Express con Helmet, límite JSON de 16 KB, CORS limitado al origen permitido, respuesta 403 para otros orígenes, ruta `GET /api/health`, JSON 404 y manejo básico de errores sin stack trace.
- `vyrox-server/test/server.test.js`: pruebas automatizadas de configuración, rechazo de puertos inválidos, validación de origen HTTPS, respuesta de salud y rechazo de origen web no autorizado.
- `vyrox-server/.env.example`: plantilla sin secretos.
- `vyrox-server/.gitignore`: excluye `.env`, dependencias instaladas y archivos de cobertura.
- `vyrox-server/README.md`: instrucciones de ejecución y límites de esta fase.
- `.github/workflows/vyrox-server-tests.yml`: ejecuta las pruebas con Node.js 20 cuando cambie el backend en esta rama o manualmente.

### Controles y límites
- No se implementó Google OAuth, sesiones, base de datos, usuarios, `@usuario`, conversaciones ni mensajes.
- No se añadieron credenciales ni secretos.
- No se creó ni configuró un servicio API en Render; no se modificó la configuración del servicio estático actual.
- El servidor no debe considerarse listo para producción: falta ejecutar y revisar CI, fijar dependencias mediante lockfile, revisar el comportamiento real de cookies/orígenes y realizar pruebas antes del despliegue.
- El origen permitido se configura por variable de entorno; la plantilla de desarrollo usa localhost y no contiene secretos.

### Verificación
- Archivos creados y commit de código: `8614aa6b43c073f904b0d39c526a36138993f66c`.
- Se añadió un workflow para que la rama de laboratorio ejecute las pruebas automáticamente; el resultado de CI debe consultarse después del commit que introduce el workflow.
- Prueba local desde este entorno: no ejecutada; no afirmar que los tests pasaron hasta ver el resultado real de GitHub Actions.
- Frontend y producción: sin cambios funcionales; `main` y el servicio `manual-jugador` permanecen fuera del alcance.

### Siguiente paso exacto
Comprobar el resultado real de GitHub Actions para `vyrox-server-tests.yml`. Si falla, inspeccionar el log y corregir la causa antes de seguir. Si pasa, revisar/fijar las dependencias y generar un lockfile reproducible; todavía no desplegar ni conectar OAuth/base de datos.


### Seguimiento CI — 2026-10-09
- Tras publicar el workflow, se consultó GitHub Actions para la rama `lab/universo-frontend`; la API devolvió `total_count: 0` para las últimas ejecuciones consultadas. Por tanto, **no hay evidencia de que GitHub Actions haya ejecutado las pruebas todavía**.
- Se verificó por lectura en GitHub que `vyrox-server/src/server.js`, `vyrox-server/test/server.test.js` y esta sección de continuidad están guardados en la rama.
- No se declara que las pruebas pasaron. Antes de continuar, hay que conseguir una ejecución real de CI o un entorno Node.js disponible para correr `npm install` y `npm test`.
- Siguiente paso exacto: investigar por qué no aparece una ejecución del workflow y conseguir una prueba ejecutada; no crear todavía el servicio API de Render.


### Resultado real de CI — actualización 2026-10-09
- La consulta posterior encontró la ejecución de GitHub Actions **VyROX API tests**, run ID `38005322983`, para el commit `69f965be53b35813b1b0de5dc2ff75d043c0d284`.
- Resultado del workflow: `success`. El job `test` terminó en `success`; los pasos `Install dependencies` y `Run tests` también terminaron en `success`.
- La consulta anterior se hizo antes de que la ejecución apareciera en la lista; la nota previa queda como registro temporal de esa consulta y no como el estado final.
- Confirmación: las cinco pruebas automatizadas del esqueleto inicial pasaron en GitHub Actions con Node.js 20. No equivale a prueba de despliegue ni a prueba física en Android.
- Siguiente paso exacto: fijar dependencias con un lockfile reproducible y volver a ejecutar CI. Mantener sin cambios el servicio Render hasta completar esa revisión.


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
