(function () {
  var root = document.querySelector("[data-catalog]");
  if (!root) return;
  var brand = root.getAttribute("data-brand");
  var filterEl = document.getElementById("catalog-filter");

  function render(entries) {
    if (!entries.length) {
      root.innerHTML = "<p class=\"lede\">No matches — Text Now <a href=\"sms:+16166065277\">(616) 606-5277</a> if you need a link.</p>";
      return;
    }
    root.innerHTML = entries.map(function (e) {
      var badge =
        e.policy === "mirror" ? "badge-mirror" :
        e.policy === "mirror-candidate" ? "badge-candidate" : "badge-link";
      var links = Object.keys(e.links || {}).map(function (k) {
        return "<a href=\"" + e.links[k] + "\" rel=\"noopener noreferrer\" target=\"_blank\">" + k + "</a>";
      }).join(" · ");
      var lic = e.license ? "<p class=\"fine\">License: " + e.license + "</p>" : "";
      var pageHint = e.brand === "FOSS" && e.id && e.id.indexOf("node-red") === 0
        ? "<p class=\"fine\"><a href=\"/nodered/\">Open Node-RED page</a></p>" : "";
      return (
        "<article class=\"card catalog-card\" style=\"cursor:default\" data-title=\"" + (e.title || "").replace(/"/g, "") + "\" data-brand=\"" + (e.brand || "") + "\">" +
        "<p><span class=\"badge " + badge + "\">" + e.policy + "</span><span class=\"badge badge-link\">" + e.kind + "</span></p>" +
        "<h3>" + e.title + "</h3>" +
        "<p>" + (e.summary || "") + "</p>" + lic + pageHint +
        "<p style=\"margin-top:0.75rem\">" + links + "</p>" +
        "</article>"
      );
    }).join("");
  }

  fetch("/catalog/index.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var all = (data.entries || []).filter(function (e) {
        if (!brand) return true;
        if (brand === "FOSS") return e.brand === "FOSS" || e.policy === "mirror-candidate" || e.policy === "mirror";
        return e.brand === brand;
      });
      function apply() {
        var q = (filterEl && filterEl.value || "").trim().toLowerCase();
        var list = !q ? all : all.filter(function (e) {
          var hay = ((e.title || "") + " " + (e.brand || "") + " " + (e.summary || "") + " " + (e.id || "")).toLowerCase();
          return hay.indexOf(q) !== -1;
        });
        render(list);
      }
      if (filterEl) filterEl.addEventListener("input", apply);
      apply();
    })
    .catch(function () {
      root.innerHTML = "<p class=\"lede\">Catalog failed to load. Text Now <a href=\"sms:+16166065277\">(616) 606-5277</a>.</p>";
    });
})();
