/**
 * Rewrite static BreadcrumbList / home WebSite+Organization from the shared helper.
 * Safe: only touches application/ld+json script tags and inserts schema before </head>.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  crumbsFor,
  breadcrumbGraph,
  jsonLdScript,
  schemaScriptsFor,
  webpageGraph,
  utf8Name,
  visibleNavHtml,
} from "../shared/js/breadcrumbs.js";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const BREADCRUMB_RE =
  /[ \t]*<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"BreadcrumbList"[\s\S]*?<\/script>\n?/;
const WEBPAGE_RE =
  /<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"WebPage"[\s\S]*?<\/script>/;
const HOME_SCHEMA_RE =
  /<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"(?:WebSite|Organization)"[\s\S]*?<\/script>\n?/;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git" || name === "functions" || name === "shared") continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
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

function extractJson(scriptTag) {
  const m = scriptTag.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  return m ? JSON.parse(m[1]) : null;
}

function replacePublisherSlash(html) {
  return html.replace(
    /("publisher":\{"@type":"Organization","name":"United Mobile RV LLC","url":"https:\/\/unitedmobilerv\.com)"(\})/g,
    "$1/\"$2"
  );
}

function applyFile(file) {
  let html = readFileSync(file, "utf8");
  const original = html;
  const pathname = pathFromFile(file);

  if (pathname === "/404.html") return false;

  html = replacePublisherSlash(html);

  if (pathname === "/") {
    if (!html.includes('"@type":"WebSite"')) {
      html = html.replace("</head>", `  ${schemaScriptsFor("/")}\n</head>`);
    }
  } else {
    const crumbs = crumbsFor(pathname);
    if (crumbs.length) {
      const crumbScript = `  ${jsonLdScript(breadcrumbGraph(crumbs))}\n`;
      if (BREADCRUMB_RE.test(html)) {
        html = html.replace(BREADCRUMB_RE, crumbScript);
      } else {
        html = html.replace("</head>", `${crumbScript}</head>`);
      }
    }

    const webpageMatch = html.match(WEBPAGE_RE);
    if (webpageMatch) {
      const graph = extractJson(webpageMatch[0]);
      if (graph) {
        graph.name = utf8Name(graph.name);
        if (graph.description) graph.description = utf8Name(graph.description);
        if (graph.publisher && graph.publisher.url === "https://unitedmobilerv.com") {
          graph.publisher.url = "https://unitedmobilerv.com/";
        }
        html = html.replace(webpageMatch[0], jsonLdScript(graph));
      }
    } else if (crumbs.length) {
      const title = (html.match(/<title>([^<]*)<\/title>/) || [, ""])[1];
      const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [, ""])[1];
      const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [, ""])[1];
      const pageScript = `  ${jsonLdScript(
        webpageGraph({
          name: utf8Name(title),
          description: utf8Name(desc),
          url: canonical,
        })
      )}\n`;
      html = html.replace("</head>", `${pageScript}</head>`);
    }

    const visible = visibleNavHtml(pathname);
    if (visible && !html.includes('class="umrt-breadcrumbs"')) {
      html = html.replace(/<main\b/, `${visible}\n  <main`);
    }
  }

  if (html !== original) {
    writeFileSync(file, html);
    return true;
  }
  return false;
}

const files = walk(ROOT);
const changed = files.filter(applyFile);
console.log(`Updated ${changed.length} HTML files`);
changed.forEach((f) => console.log(" ", f.slice(ROOT.length)));
