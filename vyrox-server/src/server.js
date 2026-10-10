import express from "express";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config.js";

const SERVER_DIR = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = path.resolve(SERVER_DIR, "../../universo-lab");

export function createApp(config = loadConfig()) {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(express.json({ limit: "16kb", strict: true }));

  app.use((req, res, next) => {
    const origin = req.get("Origin");

    if (origin && origin !== config.frontendOrigin) {
      return res.status(403).json({ error: "Origen no permitido." });
    }

    if (origin === config.frontendOrigin) {
      res.setHeader("Access-Control-Allow-Origin", config.frontendOrigin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    if (req.method === "OPTIONS") {
      return origin === config.frontendOrigin
        ? res.status(204).end()
        : res.status(403).json({ error: "Origen no permitido." });
    }

    return next();
  });

  app.get("/api/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      service: "vyrox-api",
      environment: config.nodeEnv
    });
  });

  // API paths must never fall through to the static frontend.
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Ruta de API no encontrada." });
  });

  // Serve the frontend and API from the same web-service origin. This avoids
  // relying on cross-site cookies between separate *.onrender.com services.
  app.get("/", (_req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, "index.html"));
  });
  app.use(express.static(FRONTEND_DIR, {
    dotfiles: "deny",
    fallthrough: true,
    index: false,
    maxAge: 0
  }));

  app.use((_req, res) => {
    res.status(404).json({ error: "Ruta no encontrada." });
  });

  app.use((err, _req, res, _next) => {
    if (err?.type === "entity.parse.failed") {
      return res.status(400).json({ error: "JSON inválido." });
    }
    if (err?.type === "entity.too.large") {
      return res.status(413).json({ error: "Solicitud demasiado grande." });
    }
    return res.status(500).json({ error: "Error interno." });
  });

  return app;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const config = loadConfig();
  const app = createApp(config);
  app.listen(config.port, "0.0.0.0", () => {
    console.log(`VyROX application listening on port ${config.port}`);
  });
}
