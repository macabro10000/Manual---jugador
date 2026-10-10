import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { createApp } from "../src/server.js";

const testConfig = {
  nodeEnv: "test",
  port: 3000,
  frontendOrigin: "https://vyrox.onrender.com"
};

async function withServer(run) {
  const server = createApp(testConfig).listen(0, "127.0.0.1");
  try {
    await new Promise((resolve, reject) => {
      server.once("listening", resolve);
      server.once("error", reject);
    });
    const address = server.address();
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve());
    });
  }
}

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
  await withServer(async baseUrl => {
    const response = await fetch(`${baseUrl}/api/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      status: "ok",
      service: "vyrox-api",
      environment: "test"
    });
  });
});

test("serves the VyROX frontend from the same server origin", async () => {
  await withServer(async baseUrl => {
    const response = await fetch(baseUrl);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") || "", /text\/html/);
    assert.match(await response.text(), /VyROX — Descubre lo que se mueve/);
  });
});

test("serves frontend assets from the same server origin", async () => {
  await withServer(async baseUrl => {
    const [css, js, manifest, content] = await Promise.all([
      fetch(`${baseUrl}/styles.css`),
      fetch(`${baseUrl}/app.js`),
      fetch(`${baseUrl}/manifest.webmanifest`),
      fetch(`${baseUrl}/content.json`)
    ]);
    for (const response of [css, js, manifest, content]) {
      assert.equal(response.status, 200);
    }
    assert.match(css.headers.get("content-type") || "", /text\/css/);
    assert.match(js.headers.get("content-type") || "", /javascript/);
    assert.match(await content.text(), /^\s*\{/);
  });
});

test("unknown API routes return API 404 and never the HTML app", async () => {
  await withServer(async baseUrl => {
    const response = await fetch(`${baseUrl}/api/not-a-real-route`);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), {
      error: "Ruta de API no encontrada."
    });
  });
});

test("rejects unapproved browser origins", async () => {
  await withServer(async baseUrl => {
    const response = await fetch(`${baseUrl}/api/health`, {
      headers: { Origin: "https://example.invalid" }
    });
    assert.equal(response.status, 403);
  });
});
