import assert from "node:assert/strict";
import test from "node:test";
import {
  PAGE_NAMES,
  SOFTWARE_HOME,
  PUBLISHER_URL,
  absoluteUrl,
  breadcrumbGraph,
  crumbsFor,
  hasHtmlEntity,
  isHomePath,
  jsonLdScript,
  normalizePath,
  schemaScriptsFor,
  utf8Name,
  visibleNavHtml,
  websiteGraph,
} from "./breadcrumbs.js";

test("normalizePath canonicalizes index and trailing slashes", () => {
  assert.equal(normalizePath("/"), "/");
  assert.equal(normalizePath("/dometic"), "/dometic/");
  assert.equal(normalizePath("/dometic/index.html"), "/dometic/");
  assert.equal(normalizePath("/policy.html"), "/policy.html");
  assert.equal(normalizePath("/troubleshoot/roof-leak?x=1"), "/troubleshoot/roof-leak/");
});

test("home is United Mobile RV → Software with WebSite + Organization", () => {
  assert.equal(isHomePath("/"), true);
  assert.deepEqual(
    crumbsFor("/").map((c) => [c.name, c.item]),
    [
      ["United Mobile RV", PUBLISHER_URL],
      ["Software", SOFTWARE_HOME],
    ]
  );
  assert.deepEqual(crumbsFor("/index.html").map((c) => c.name), ["United Mobile RV", "Software"]);
  const html = schemaScriptsFor("/");
  assert.match(html, /"@type":"WebSite"/);
  assert.match(html, /"@type":"Organization"/);
  assert.match(html, /BreadcrumbList/);
  assert.equal(websiteGraph().publisher.url, PUBLISHER_URL);
  const visible = visibleNavHtml("/");
  assert.match(visible, /aria-label="Breadcrumb"/);
  assert.match(visible, /United Mobile RV/);
  assert.match(visible, /aria-current="page">Software/);
});

test("dometic trail is United Mobile RV → Software → Dometic", () => {
  const crumbs = crumbsFor("/dometic/");
  assert.deepEqual(
    crumbs.map((c) => [c.name, c.item]),
    [
      ["United Mobile RV", PUBLISHER_URL],
      ["Software", SOFTWARE_HOME],
      ["Dometic — Official Links", "https://software.unitedmobilerv.com/dometic/"],
    ]
  );
  for (const crumb of crumbs) {
    assert.equal(hasHtmlEntity(crumb.name), false);
  }
  const json = JSON.stringify(breadcrumbGraph(crumbs));
  assert.equal(json.includes("&amp;"), false);
  assert.equal(json.includes("&#"), false);
  assert.match(json, /Dometic — Official Links/);
});

test("troubleshoot nested pages keep the Troubleshoot step", () => {
  const crumbs = crumbsFor("/troubleshoot/victron-connect/");
  assert.deepEqual(
    crumbs.map((c) => c.name),
    ["United Mobile RV", "Software", "Troubleshoot", "VictronConnect · Venus · VRM"]
  );
  assert.equal(crumbs[2].item, "https://software.unitedmobilerv.com/troubleshoot/");
});

test("utf8Name strips HTML entities", () => {
  assert.equal(utf8Name("Official firmware, apps &amp; docs"), "Official firmware, apps & docs");
  assert.equal(utf8Name("RV Owner&#8217;s Field Guide"), "RV Owner’s Field Guide");
  assert.equal(utf8Name("Victron Fault Code &#038; Diagnostics Guide"), "Victron Fault Code & Diagnostics Guide");
});

test("json-ld script is inline and entity-free", () => {
  const script = jsonLdScript(breadcrumbGraph(crumbsFor("/victron/")));
  assert.match(script, /^<script type="application\/ld\+json">/);
  assert.equal(script.includes("&amp;"), false);
  assert.match(script, /Victron — Official Links/);
});

test("404 and unknown paths", () => {
  assert.deepEqual(crumbsFor("/404.html"), []);
  assert.equal(schemaScriptsFor("/404.html"), "");
  const crumbs = crumbsFor("/brand-new-shelf/");
  assert.equal(crumbs.at(-1).name, "brand new shelf");
  assert.equal(crumbs.at(-1).item, absoluteUrl("/brand-new-shelf/"));
});

test("visible nav is subtle and does not rewrite Book / downloads", () => {
  const html = visibleNavHtml("/dometic/");
  assert.match(html, /aria-label="Breadcrumb"/);
  assert.match(html, /unitedmobilerv\.com\/"/);
  assert.match(html, /software\.unitedmobilerv\.com\/"/);
  assert.doesNotMatch(html, /square\.site/);
  assert.doesNotMatch(html, /victronenergy|dometic\.com\/en-us/);
  assert.match(html, /aria-current="page"/);
  const home = visibleNavHtml("/");
  assert.doesNotMatch(home, /square\.site/);
  assert.match(home, /href="https:\/\/unitedmobilerv\.com\/"/);
});

test("every mapped product path has a UTF-8 name", () => {
  for (const [path, name] of Object.entries(PAGE_NAMES)) {
    assert.equal(hasHtmlEntity(name), false, path);
    const last = crumbsFor(path).at(-1);
    assert.equal(last.name, name);
    assert.equal(last.item, absoluteUrl(path));
  }
});
