// Roda antes da pintura: marca que há JS e se animações são permitidas.
(function (d) {
  var c = d.documentElement.classList;
  c.add("js");
  if (window.matchMedia && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    c.add("motion");
    // Segurança: se o main.js não carregar, nada fica escondido.
    setTimeout(function () { if (!c.contains("mjs")) c.remove("motion"); }, 3000);
  }
})(document);
