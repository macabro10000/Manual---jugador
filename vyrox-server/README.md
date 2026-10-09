# VyROX API — laboratorio

Esqueleto inicial aislado del frontend estático. Esta fase incluye únicamente configuración validada, cabeceras de seguridad, límites básicos de entrada, allowlist CORS y `GET /api/health`.

## Ejecutar

Requiere Node.js 20 o posterior.

```sh
npm install
npm test
npm start
```

En desarrollo, `FRONTEND_ORIGIN` usa `http://localhost:3000` por defecto. En producción debe definirse explícitamente con el origen HTTPS exacto del frontend. Render proporciona `PORT`.

## Límites actuales

No hay autenticación, sesiones, Google OAuth, base de datos, mensajería ni secretos. No conectar usuarios reales todavía. Este proyecto no está desplegado y no debe configurarse como producción hasta que las pruebas pasen y se revise el plan de hosting.
