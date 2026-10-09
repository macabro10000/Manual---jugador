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
- No hay todavía fuentes de contenido en vivo ni APIs conectadas.
- Las tarjetas actuales son ejemplos y algunos enlaces apuntan a páginas generales; no presentarlas como noticias o videos reales.
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
2. Sustituir tarjetas de ejemplo por un esquema de contenido real, identificando fuente, URL canónica, título, fecha, tipo de integración y permisos de inserción.
3. Diseñar adaptadores separados por plataforma; empezar por fuentes oficiales y enlaces que no necesiten credenciales.
4. Investigar qué contenido puede mostrarse legalmente mediante embeds, o requiere API y autorización. No activar APIs con costo sin aprobación.
5. Añadir pruebas de enlaces, errores de carga y diseño móvil.
6. Solo después de revisión, evaluar una publicación controlada; nunca fusionar automáticamente en producción.

## Último hito
Se creó el servicio Render `universo-explorador` conectado a la rama `lab/universo-frontend`, con directorio publicado `universo-lab`. Servicio ID: `srv-db4js3id0e5s73ckoed0`. Primer deploy ID: `dep-db4js42d0e5s73ckoh60`.
