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
