# UNIVERSO — frontend de laboratorio

Este directorio es una prueba aislada dentro de `macabro10000/Manual---jugador`. No reemplaza el sitio publicado ni modifica las funciones de SmartDaily & Tools.

## Archivos
- `index.html`: estructura de la interfaz.
- `styles.css`: diseño responsive para móvil y escritorio.
- `app.js`: filtros por categoría, búsqueda local, guardados en el dispositivo, compartir enlaces y cambio de tema.
- `assets/`: imágenes de la interfaz.

## Vista previa
Una vez que esta rama se publique en un entorno de prueba, la ruta del frontend será `/universo-lab/`. La web usa HTML/CSS/JavaScript sin backend y no almacena archivos de video.

## Estado honesto
- Los elementos de contenido actuales son ejemplos visuales, no un feed vivo.
- Las tarjetas abren sitios originales de referencia. Para producción deben configurarse enlaces a publicaciones específicas y reproductores oficiales compatibles.
- No se han conectado APIs de TikTok, Meta ni YouTube.
- Las imágenes locales pueden faltar inicialmente; el diseño muestra fondos de reserva hasta que se suban.
- Las funciones de guardar usan `localStorage` del navegador, sin crear cuentas ni una base de datos.

## Regla de operación
No modificar `main` ni el servicio de producción para esta prueba. Revisar la experiencia móvil y las imágenes antes de considerar una publicación independiente.