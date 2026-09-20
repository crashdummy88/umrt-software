/**
 * Site-wide <head> injection for static HTML (no layout engine).
 * Canonical snippet: /shared/partials/head.html
 * Does not rewrite Book chrome, download links, or page bodies.
 */
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

export async function onRequest(context) {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  return new HTMLRewriter().on("head", new SharedHeadInjector()).transform(response);
}
