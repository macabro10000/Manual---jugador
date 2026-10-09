const VALID_ENVIRONMENTS = new Set(["development", "test", "production"]);

export function loadConfig(env = process.env) {
  const nodeEnv = env.NODE_ENV || "development";
  if (!VALID_ENVIRONMENTS.has(nodeEnv)) {
    throw new Error("NODE_ENV debe ser development, test o production.");
  }

  const portRaw = env.PORT || "3000";
  const port = Number(portRaw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT debe ser un entero entre 1 y 65535.");
  }

  const frontendOrigin = env.FRONTEND_ORIGIN ||
    (nodeEnv === "production" ? "" : "http://localhost:3000");
  if (!frontendOrigin) {
    throw new Error("Falta FRONTEND_ORIGIN; debe ser el origen exacto del frontend.");
  }

  let parsedOrigin;
  try {
    parsedOrigin = new URL(frontendOrigin);
  } catch {
    throw new Error("FRONTEND_ORIGIN debe ser una URL de origen válida.");
  }

  if (
    !["http:", "https:"].includes(parsedOrigin.protocol) ||
    parsedOrigin.origin !== frontendOrigin ||
    parsedOrigin.username ||
    parsedOrigin.password
  ) {
    throw new Error("FRONTEND_ORIGIN debe contener solo el origen, sin ruta ni credenciales.");
  }

  if (nodeEnv === "production" && parsedOrigin.protocol !== "https:") {
    throw new Error("FRONTEND_ORIGIN debe usar HTTPS en producción.");
  }

  return Object.freeze({ nodeEnv, port, frontendOrigin });
}
