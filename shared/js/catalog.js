(function () {
  var root = document.querySelector("[data-catalog]");
  if (!root) return;
  var brand = root.getAttribute("data-brand");
  fetch("/catalog/index.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var entries = (data.entries || []).filter(function (e) {
        if (!brand) return true;
        if (brand === "FOSS") return e.brand === "FOSS" || e.policy === "mirror-candidate" || e.policy === "mirror";
        return e.brand === brand;
      });
      if (!entries.length) {
        root.innerHTML = "<p class=\"lede\">No catalog entries yet for this brand.</p>";
        return;
      }
      root.innerHTML = entries.map(function (e) {
        var badge =
          e.policy === "mirror" ? "badge-mirror" :
          e.policy === "mirror-candidate" ? "badge-candidate" : "badge-link";
        var links = Object.keys(e.links || {}).map(function (k) {
          return "<a href=\"" + e.links[k] + "\" rel=\"noopener noreferrer\" target=\"_blank\">" + k + "</a>";
        }).join(" · ");
        return (
          "<article class=\"card\" style=\"cursor:default\">" +
          "<p><span class=\"badge " + badge + "\">" + e.policy + "</span><span class=\"badge badge-link\">" + e.kind + "</span></p>" +
          "<h3>" + e.title + "</h3>" +
          "<p>" + (e.summary || "") + "</p>" +
          "<p style=\"margin-top:0.75rem\">" + links + "</p>" +
          "</article>"
        );
      }).join("");
    })
    .catch(function () {
      root.innerHTML = "<p class=\"lede\">Catalog failed to load.</p>";
    });
})();
