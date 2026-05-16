import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import app from "../app.js";

describe("backend smoke test", () => {
  let server;
  let baseUrl;

  before(async () => {
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));

    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
  });

  after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  });

  it("serves the API root", async () => {
    const response = await fetch(`${baseUrl}/`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.equal(body, "API Root");
  });

  it("serves a health endpoint for automation", async () => {
    const response = await fetch(`${baseUrl}/healthz`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, {
      status: "ok",
      service: "postify-backend",
    });
  });

  it("exposes Prometheus metrics", async () => {
    const response = await fetch(`${baseUrl}/metrics`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/plain/);
    assert.match(body, /# HELP postify_backend_info/);
    assert.match(body, /process_uptime_seconds/);
  });
});
