import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: {
        accept: "text/html",
        host: "localhost",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Human Dignity Kit proposal app", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>\$100 Human Dignity Kit Proposal<\/title>/i);
  assert.match(html, /The \$100 Human Dignity Kit Challenge/);
  assert.match(html, /Teacher pitch dossier/i);
  assert.match(html, /Curriculum legitimacy matrix/);
  assert.match(html, /Dignity Kit Puzzle Board/);
  assert.match(html, /One portfolio, separate legitimate assessment evidence/);
  assert.match(html, /MA-CN-001/);
  assert.match(html, /HS-EB-001/);
  assert.match(html, /SC-QP-001/);
  assert.match(html, /EN-CT-001/);
  assert.match(html, /Common Good/);
  assert.match(html, /og\.png/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/);
});

test("removes the disposable starter preview", async () => {
  await assert.rejects(access(new URL("app/_sites-preview", templateRoot)));
});
