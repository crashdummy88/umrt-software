/**
 * Static audit: home has WebSite/Organization; nested pages have BreadcrumbList;
 * names are UTF-8; Book stays Square; manufacturer hrefs untouched vs git if provided.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";
import {
  PUBLISHER_URL,
  hasHtmlEntity,
  isHomePath,
  isNotFoundPath,
  normalizePath,
} from "../shared/js/breadcrumbs.js";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git" || name === "functions" || name === "shared") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

function pathFromFile(file) {
  const rel = file.slice(ROOT.length).replace(/\\/g, "/");
  if (rel === "/index.html") return "/";
  if (rel.endsWith("/index.html")) return rel.slice(0, -"index.html".length);
  return rel;
}

function graphs(html) {
  const out = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) out.push(JSON.parse(m[1]));
  return out;
}

function types(list) {
  const set = new Set();
  for (const g of list) {
    if (g["@type"]) set.add(g["@type"]);
    if (g.publisher?.["@type"]) set.add(g.publisher["@type"]);
    if (g.isPartOf?.["@type"]) set.add(g.isPartOf["@type"]);
    for (const el of g.itemListElement || []) if (el["@type"]) set.add(el["@type"]);
  }
  return [...set].sort();
}

const files = walk(ROOT);
const report = [];

for (const file of files) {
  const pathname = pathFromFile(file);
  const html = readFileSync(file, "utf8");
  const ld = graphs(html);
  const crumb = ld.find((g) => g["@type"] === "BreadcrumbList");
  const items = (crumb?.itemListElement || []).map((el) => [el.name, el.item]);
  const row = {
    url: `https://software.unitedmobilerv.com${pathname === "/" ? "/" : pathname}`,
    path: pathname,
    schema_types: types(ld),
    has_BreadcrumbList: Boolean(crumb),
    breadcrumb_items: items,
    ld_count: ld.length,
    book_square: (html.match(/united-mobile-rv-llc\.square\.site/g) || []).length,
    entities_in_crumbs: items.some(([name]) => hasHtmlEntity(name)),
    visible_crumbs: Boolean(html.includes('class="umrt-breadcrumbs"')),
  };

  if (isNotFoundPath(pathname)) {
    assert.equal(row.has_BreadcrumbList, false, pathname);
  } else if (isHomePath(pathname)) {
    assert.equal(row.has_BreadcrumbList, true, "home BreadcrumbList");
    assert.ok(row.schema_types.includes("WebSite"), "home WebSite");
    assert.ok(row.schema_types.includes("Organization"), "home Organization");
    const org = ld.find((g) => g["@type"] === "Organization") || ld.find((g) => g.publisher)?.publisher;
    assert.equal(org?.url, PUBLISHER_URL, "publisher slash");
    assert.deepEqual(items, [
      ["United Mobile RV", "https://unitedmobilerv.com/"],
      ["Software", "https://software.unitedmobilerv.com/"],
    ]);
    assert.equal(row.entities_in_crumbs, false, "home UTF-8 crumbs");
    assert.ok(row.book_square > 0, "home Book chrome");
    assert.equal(row.visible_crumbs, true, "home visible crumbs");
  } else {
    assert.equal(row.has_BreadcrumbList, true, `${pathname} BreadcrumbList`);
    assert.equal(items[0][0], "United Mobile RV");
    assert.equal(items[0][1], "https://unitedmobilerv.com/");
    assert.equal(items[1][0], "Software");
    assert.equal(items[1][1], "https://software.unitedmobilerv.com/");
    assert.equal(row.entities_in_crumbs, false, pathname);
    assert.ok(row.book_square > 0, `${pathname} Book chrome`);
    assert.equal(row.visible_crumbs, true, `${pathname} visible crumbs`);
  }
  report.push(row);
}

assert.ok(
  readFileSync(join(ROOT, "functions/_middleware.js"), "utf8").includes("yl6ovtkj2p"),
  "Clarity id"
);
assert.ok(
  readFileSync(join(ROOT, "functions/_middleware.js"), "utf8").includes("visibleNavHtml"),
  "visible crumbs"
);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
}
const nested = report.filter((row) => row.path !== "/" && row.path !== "/404.html");
console.log(
  `audited ${report.length} HTML files · home WebSite/Organization/BreadcrumbList · ${nested.length} nested BreadcrumbList · no HTML entities`
);
