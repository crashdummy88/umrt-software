/**
 * UMRT Software breadcrumb + JSON-LD helper.
 * Used by functions/_middleware.js (visible crumbs) and static page schema.
 * Names are plain UTF-8 — never HTML entities (&amp; &#8217;).
 */

export const SOFTWARE_ORIGIN = "https://software.unitedmobilerv.com";
export const SOFTWARE_HOME = `${SOFTWARE_ORIGIN}/`;
export const PUBLISHER_URL = "https://unitedmobilerv.com/";
export const ORGANIZATION_NAME = "United Mobile RV LLC";
export const WEBSITE_NAME = "UMRT Software";
export const CRUMB_HOME_NAME = "United Mobile RV";
export const CRUMB_SOFTWARE_NAME = "Software";

/** Path → breadcrumb label. Keep UTF-8 em dashes / middots, no &amp; / &#8230;. */
export const PAGE_NAMES = {
  "/": CRUMB_SOFTWARE_NAME,
  "/policy.html": "Download policy",
  "/victron/": "Victron — Official Links",
  "/peplink/": "Peplink — Official Links",
  "/weboost/": "weBoost — Official Links",
  "/starlink/": "Starlink — Official Links",
  "/dometic/": "Dometic — Official Links",
  "/winegard/": "Winegard — Official Links",
  "/king/": "KING — Official Links",
  "/surecall/": "SureCall — Official Links",
  "/celfi/": "Cel-Fi — Official Links",
  "/glinet/": "GL.iNet — Official Links",
  "/teltonika/": "Teltonika — Official Links",
  "/foss/": "FOSS — Official Links",
  "/nodered/": "Node-RED — Official Links",
  "/node-red/": "Node-RED — Official Links",
  "/openwrt/": "OpenWrt · FOSS firmware",
  "/cradlepoint/": "Cradlepoint / NetCloud — Official Links",
  "/sierra/": "Semtech / Sierra Wireless — Official Links",
  "/antennas/": "Antennas / PoE",
  "/troubleshoot/": "Troubleshoot",
  "/troubleshoot/no-power/": "No power",
  "/troubleshoot/no-water/": "No water",
  "/troubleshoot/roof-leak/": "Roof leak",
  "/troubleshoot/generator-wont-start/": "Generator won't start",
  "/troubleshoot/victron-connect/": "VictronConnect · Venus · VRM",
  "/troubleshoot/peplink/": "Peplink / Pepwave",
  "/troubleshoot/weboost/": "weBoost",
  "/troubleshoot/starlink-app/": "Starlink app",
  "/troubleshoot/node-red/": "Node-RED / Signal K",
  "/troubleshoot/starlink-offline/": "Starlink offline",
  "/troubleshoot/weboost-no-boost/": "weBoost no boost",
  "/troubleshoot/peplink-wan-flapping/": "Peplink WAN flapping",
};

const ENTITY_NAMED = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  mdash: "—",
  ndash: "–",
  hellip: "…",
};

/** Decode leftover HTML entities so JSON-LD names stay plain UTF-8. */
export function utf8Name(value) {
  return String(value ?? "")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body) => {
      const code = body.toLowerCase();
      if (code.startsWith("#x")) {
        const n = parseInt(code.slice(2), 16);
        return Number.isFinite(n) ? String.fromCodePoint(n) : match;
      }
      if (code.startsWith("#")) {
        const n = parseInt(code.slice(1), 10);
        return Number.isFinite(n) ? String.fromCodePoint(n) : match;
      }
      return Object.prototype.hasOwnProperty.call(ENTITY_NAMED, code)
        ? ENTITY_NAMED[code]
        : match;
    })
    .trim();
}

export function normalizePath(pathname) {
  let path = String(pathname || "/").split("?")[0].split("#")[0];
  if (!path.startsWith("/")) path = `/${path}`;
  path = path.replace(/\/index\.html$/i, "/");
  if (path.length > 1 && !path.endsWith(".html") && !path.endsWith("/")) {
    path += "/";
  }
  return path;
}

export function isHomePath(pathname) {
  return normalizePath(pathname) === "/";
}

export function isNotFoundPath(pathname) {
  const path = normalizePath(pathname);
  return path === "/404.html" || path === "/404/";
}

export function pageName(pathname) {
  const path = normalizePath(pathname);
  if (PAGE_NAMES[path]) return PAGE_NAMES[path];
  const raw = path.replace(/\/$/, "").split("/").filter(Boolean).pop() || CRUMB_SOFTWARE_NAME;
  return utf8Name(raw.replace(/[-_]+/g, " "));
}

export function absoluteUrl(pathname) {
  const path = normalizePath(pathname);
  if (path === "/") return SOFTWARE_HOME;
  return `${SOFTWARE_ORIGIN}${path}`;
}

/**
 * Nested trail: United Mobile RV → Software → [Troubleshoot] → Page.
 * Home and 404 return [] so callers can skip BreadcrumbList.
 */
export function crumbsFor(pathname) {
  const path = normalizePath(pathname);
  if (isHomePath(path) || isNotFoundPath(path)) return [];

  const crumbs = [
    { name: CRUMB_HOME_NAME, item: PUBLISHER_URL },
    { name: CRUMB_SOFTWARE_NAME, item: SOFTWARE_HOME },
  ];

  if (path.startsWith("/troubleshoot/") && path !== "/troubleshoot/") {
    crumbs.push({ name: "Troubleshoot", item: absoluteUrl("/troubleshoot/") });
  }

  crumbs.push({ name: pageName(path), item: absoluteUrl(path) });
  return crumbs.map((crumb) => ({
    name: utf8Name(crumb.name),
    item: crumb.item,
  }));
}

export function organizationGraph() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION_NAME,
    url: PUBLISHER_URL,
  };
}

export function websiteGraph() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: WEBSITE_NAME,
    url: SOFTWARE_HOME,
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      url: PUBLISHER_URL,
    },
  };
}

export function breadcrumbGraph(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: utf8Name(crumb.name),
      item: crumb.item,
    })),
  };
}

export function webpageGraph({ name, description, url }) {
  const graph = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: utf8Name(name),
    url,
    isPartOf: {
      "@type": "WebSite",
      name: WEBSITE_NAME,
      url: SOFTWARE_HOME,
    },
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      url: PUBLISHER_URL,
    },
  };
  if (description) graph.description = utf8Name(description);
  return graph;
}

export function jsonLdScript(graph) {
  return `<script type="application/ld+json">${JSON.stringify(graph)}</script>`;
}

export function schemaScriptsFor(pathname, page = {}) {
  const path = normalizePath(pathname);
  if (isNotFoundPath(path)) return "";

  if (isHomePath(path)) {
    return `${jsonLdScript(websiteGraph())}\n  ${jsonLdScript(organizationGraph())}`;
  }

  const crumbs = crumbsFor(path);
  const parts = [];
  if (page.name || page.description) {
    parts.push(
      jsonLdScript(
        webpageGraph({
          name: page.name || pageName(path),
          description: page.description || "",
          url: page.url || absoluteUrl(path),
        })
      )
    );
  }
  if (crumbs.length) parts.push(jsonLdScript(breadcrumbGraph(crumbs)));
  return parts.join("\n  ");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Subtle visible trail. JSON-LD names stay UTF-8; HTML escaping is display-only. */
export function visibleNavHtml(pathname) {
  const crumbs = crumbsFor(pathname);
  if (!crumbs.length) return "";

  const items = crumbs
    .map((crumb, index) => {
      const last = index === crumbs.length - 1;
      const label = escapeHtml(crumb.name);
      if (last) {
        return `<li><span aria-current="page">${label}</span></li>`;
      }
      return `<li><a href="${escapeHtml(crumb.item)}">${label}</a></li>`;
    })
    .join("");

  return `<nav class="umrt-breadcrumbs" aria-label="Breadcrumb"><div class="wrap"><ol>${items}</ol></div></nav>`;
}

export function hasHtmlEntity(value) {
  return /&(?:[a-z]+|#\d+|#x[0-9a-f]+);/i.test(String(value));
}
