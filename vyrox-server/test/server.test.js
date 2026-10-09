import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { createApp } from "../src/server.js";

test("loads safe development defaults", () => {
  const config = loadConfig({ NODE_ENV: "development", PORT: "3000" });
  assert.equal(config.port, 3000);
  assert.equal(config.frontendOrigin, "http://localhost:3000");
});

test("rejects invalid port", () => {
  assert.throws(() => loadConfig({
    NODE_ENV: "test",
    PORT: "70000",
    FRONTEND_ORIGIN: "https://vyrox.onrender.com"
  }), /PORT/);
});

test("requires an exact HTTPS origin in production", () => {
  assert.throws(() => loadConfig({
    NODE_ENV: "production",
    PORT: "10000",
    FRONTEND_ORIGIN: "http://vyrox.onrender.com"
  }), /HTTPS/);
  assert.throws(() => loadConfig({
    NODE_ENV: "production",
    PORT: "10000",
    FRONTEND_ORIGIN: "https://vyrox.onrender.com/path"
  }), /origen/);
});

test("health route responds without exposing secrets", async () => {
  const config = {
    nodeEnv: "test",
    port: 3000,
    frontendOrigin: "https://vyrox.onrender.com"
  };
  const server = createApp(config).listen(0, "127.0.0.1");
  try {
    await new Promise((resolve, reject) => {
      server.once("listening", resolve);
      server.once("error", reject);
    });
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      status: "ok",
      service: "vyrox-api",
      environment: "test"
    });
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

test("rejects unapproved browser origins", async () => {
  const app = createApp({
    nodeEnv: "test",
    port: 3000,
    frontendOrigin: "https://vyrox.onrender.com"
  });
  const server = app.listen(0, "127.0.0.1");
  try {
    await new Promise((resolve, reject) => {
      server.once("listening", resolve);
      server.once("error", reject);
    });
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`, {
      headers: { Origin: "https://example.invalid" }
    });
    assert.equal(response.status, 403);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
