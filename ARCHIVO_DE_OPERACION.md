# ARCHIVO DE OPERACIÓN — SmartDaily & Tools

## Identidad y límites
- Nombre visible: **SmartDaily & Tools**.
- Repositorio: `macabro10000/Manual---jugador`, rama `main`.
- Servicio Render independiente: `manual-jugador`, Static Site, URL https://manual-jugador.onrender.com.
- No modificar VELOX!!!/Libres1, ALFA OMEGA ni OJOS DE TRAILER.
- Arquitectura sin backend: HTML, CSS y JavaScript vanilla; publicación estática sin build.

## Implementación actual
- `index.html`: landing responsive, navegación por secciones, desafío diario, herramientas, quiz, privacidad y placeholders publicitarios.
- `styles.css`: sistema visual oscuro, acentos menta/lila, modo claro, breakpoints móviles, focus visible y reduced-motion.
- `app.js`: reto rotativo según fecha local, elección IA/humano, explicación educativa, racha local, Web Share/portapapeles, prompt builder, limpiador de texto, calculadora de páginas/impresiones/RPM y quiz de cinco preguntas.
- Persistencia local únicamente mediante `localStorage`; sin cuenta ni backend.
- Espacios de anuncios son placeholders sin scripts ni ingresos reales. Se separó el placeholder in-content de los botones de acción para reducir clics accidentales.
- La autoría IA/humano no se presenta como detección científica. La calculadora muestra hipótesis, no ingresos garantizados.

## Despliegue
- Render Static Site: servicio `manual-jugador`.
- Repo conectado: `macabro10000/Manual---jugador`.
- Rama `main`, Build Command vacío, Publish Directory `.`.
- Un commit en `main` debe disparar el despliegue automático; verificar el estado del deploy antes de afirmar que está live.
- URL: https://manual-jugador.onrender.com.

## Verificación pendiente
1. Confirmar que el último deploy de Render termina con estado `live`.
2. Probar en Android: navegación, reto y persistencia diaria, reabrir resultado, tabs, copiar prompt/texto, calculadora, cinco preguntas, compartir, modo claro y cierre del banner fijo.
3. Revisar consola del navegador en un dispositivo real y contraste/teclado.
4. Antes de monetizar, añadir políticas de privacidad/cookies apropiadas, consentimiento donde aplique y código oficial del proveedor tras aprobación; no insertar anuncios que imiten controles ni garantizar RPM.

## Reglas de operación
- No afirmar pruebas que no se hayan ejecutado.
- No tocar otros proyectos ni cambiar el servicio Render sin autorización.
- Mantener esta bitácora actualizada en cambios sustanciales.
