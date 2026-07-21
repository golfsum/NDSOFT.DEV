import assert from "node:assert/strict";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://ndsoft.dev${pathname}`, {
      headers: { accept: "text/html" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished ND SOFT portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>ND SOFT \| Independent Software Studio<\/title>/i);
  assert.match(html, /Four products\./);
  assert.match(html, /One independent studio\./);
  assert.match(html, /AppsResolve/);
  assert.match(html, /Tranqly/);
  assert.match(html, /PawProof/);
  assert.match(html, /TeeLesson/);
  assert.match(html, /href="https:\/\/appsresolve\.com"/);
  assert.match(html, /href="https:\/\/tranqly\.app"/);
  assert.match(html, /href="https:\/\/pawproof\.app"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /rel="canonical" href="https:\/\/ndsoft\.dev\/"/);
  assert.doesNotMatch(html, /codex-preview|Starter Project|SkeletonPreview/);
  assert.doesNotMatch(html, /[\u2013\u2014]/);
});

test("publishes the social preview asset", async () => {
  const { stat } = await import("node:fs/promises");
  const image = await stat(new URL("../public/og.png", import.meta.url));
  assert.ok(image.size > 20_000);
});

test("has no disposable starter preview files", async () => {
  const { access } = await import("node:fs/promises");
  await assert.rejects(access(new URL("app/_sites-preview/SkeletonPreview.tsx", root)));
});
