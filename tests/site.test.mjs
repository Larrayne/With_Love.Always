import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const rootDirectory = fileURLToPath(new URL("../", import.meta.url));
const html = readFileSync(path.join(rootDirectory, "index.html"), "utf8");

test("site JavaScript passes Node syntax checking", () => {
  const result = spawnSync(process.execPath, ["--check", "script.js"], {
    cwd: rootDirectory,
    encoding: "utf8"
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("local HTML assets exist", () => {
  const localReferences = [...html.matchAll(/\b(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((reference) => !/^(?:[a-z]+:|#|\/\/)/i.test(reference));

  for (const reference of localReferences) {
    assert.ok(existsSync(path.join(rootDirectory, reference)), `Missing HTML asset: ${reference}`);
  }
});

test("product photos exist", () => {
  const script = readFileSync(path.join(rootDirectory, "script.js"), "utf8");
  const productImages = [...script.matchAll(/\bimage:\s*"([^"]+)"/g)]
    .map((match) => match[1]);

  assert.ok(productImages.length > 0, "No product image paths found in script.js");
  for (const imagePath of productImages) {
    assert.ok(existsSync(path.join(rootDirectory, imagePath)), `Missing product image: ${imagePath}`);
  }
});

test("in-page links point to existing elements", () => {
  const elementIds = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  const fragmentTargets = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);

  for (const target of fragmentTargets) {
    assert.ok(elementIds.has(target), `No element found for #${target}`);
  }
});