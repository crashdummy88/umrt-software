/**
 * Site-wide <head> injection for static HTML (no layout engine).
 * Canonical snippet: /shared/partials/head.html
 * Breadcrumbs: /shared/js/breadcrumbs.js
 * Does not rewrite Book chrome, download links, or page bodies.
 */
import { isHomePath, isNotFoundPath, visibleNavHtml } from "../shared/js/breadcrumbs.js";

const CLARITY_SNIPPET = `<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "yl6ovtkj2p");
</script>`;

class SharedHeadInjector {
  element(element) {
    element.append(CLARITY_SNIPPET, { html: true });
  }
}

class VisibleBreadcrumbInjector {
  constructor(html, seen) {
    this.html = html;
    this.seen = seen;
    this.injected = false;
  }
  element(element) {
    if (!this.html || this.injected || this.seen.hasCrumbs) return;
    this.injected = true;
    element.before(this.html, { html: true });
  }
}

class ExistingCrumbMarker {
  constructor(seen) {
    this.seen = seen;
  }
  element() {
    this.seen.hasCrumbs = true;
  }
}

export async function onRequest(context) {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const url = new URL(context.request.url);
  const rewriter = new HTMLRewriter().on("head", new SharedHeadInjector());
  const seen = { hasCrumbs: false };
  rewriter.on(".umrt-breadcrumbs", new ExistingCrumbMarker(seen));

  if (!isHomePath(url.pathname) && !isNotFoundPath(url.pathname)) {
    const crumbs = visibleNavHtml(url.pathname);
    if (crumbs) {
      rewriter.on("main#main", new VisibleBreadcrumbInjector(crumbs, seen));
    }
  }

  return rewriter.transform(response);
}
