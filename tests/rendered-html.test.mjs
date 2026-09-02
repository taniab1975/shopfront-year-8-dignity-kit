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

test("server-renders the Human Dignity Kit builder app", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>\$100 Human Dignity Kit Builder<\/title>/i);
  assert.match(html, /The \$100 Human Dignity Kit Challenge/);
  assert.match(html, /Build the kit/);
  assert.match(html, /Live budget/);
  assert.match(html, /Decision evidence/);
  assert.match(html, /Curriculum engine/);
  assert.match(html, /Actual assessment/);
  assert.match(html, /Student task, required evidence and marking criteria/);
  assert.match(html, /Required submissions/);
  assert.match(html, /3 - Secure/);
  assert.match(html, /0 - Not demonstrated/);
  assert.match(html, /Clue 1/);
  assert.match(html, /Generated proposal/);
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
