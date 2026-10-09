# VyROX — Bitácora histórica

Este documento conserva las entradas históricas trasladadas desde `ARCHIVO_DE_OPERACION.md`. Se mantienen las entradas originales para preservar decisiones, contexto y límites de verificación. El archivo maestro antiguo no se elimina en esta fase.

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
