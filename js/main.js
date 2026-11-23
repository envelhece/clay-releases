(function () {
  "use strict";
  var doc = document, html = doc.documentElement;
  html.classList.add("mjs");
  var cfg = window.CLAY || {};
  var motion = html.classList.contains("motion");
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); };
  var raf = window.requestAnimationFrame.bind(window);
  var expoOut = function (t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); };

  // Download: todos os botões usam config.js
  if (cfg.DOWNLOAD_URL) {
    $$("[data-download]").forEach(function (a) {
      a.href = cfg.DOWNLOAD_URL;
      a.setAttribute("rel", "noopener");
    });
  }
  if (cfg.VERSION) {
    $$("[data-version]").forEach(function (el) { el.textContent = cfg.VERSION; });
  }
  // SHA-256 do arquivo oficial (preenchido por tools/release-integrity.ps1); só hex é aceito.
  if (/^[0-9a-f]{64}$/i.test(cfg.SHA256 || "")) {
    $$("[data-sha256]").forEach(function (el) { el.textContent = cfg.SHA256.toLowerCase(); });
    if (cfg.SHA256_FILE) $$("[data-sha256-file]").forEach(function (el) { el.textContent = cfg.SHA256_FILE; });
    $$("[data-sha256-wrap]").forEach(function (el) { el.hidden = false; });
  }

  // Barra superior: translúcida, com desfoque e linha fina depois de rolar
  var nav = doc.querySelector(".nav");
  if (nav) {
    var scrolled = null;
    var onScroll = function () {
      var s = window.scrollY > 8;
      if (s !== scrolled) { scrolled = s; nav.classList.toggle("scrolled", s); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Indicador deslizante dos seletores (FLIP só com transform)
  function indicator(seg) {
    if (!seg) return function () {};
    var ind = doc.createElement("span"), cur = null, last = null;
    ind.className = "seg-ind";
    ind.setAttribute("aria-hidden", "true");
    seg.insertBefore(ind, seg.firstChild);
    seg.classList.add("has-ind");
    function place(btn, animate) {
      if (!btn) return;
      last = btn;
      var x = btn.offsetLeft, w = btn.offsetWidth;
      if (!w) return;
      ind.style.width = w + "px";
      ind.style.transform = "translateX(" + x + "px)";
      if (animate && motion && cur && ind.animate && (cur.x !== x || cur.w !== w)) {
        ind.animate([
          { transform: "translateX(" + cur.x + "px) scaleX(" + (cur.w / w) + ")" },
          { transform: "translateX(" + x + "px) scaleX(1)" }
        ], { duration: 480, easing: "cubic-bezier(.3,1,.3,1)" });
      }
      cur = { x: x, w: w };
    }
    window.addEventListener("resize", function () { if (last) place(last, false); }, { passive: true });
    return place;
  }

  function countUp(el, to, dur, delay) {
    var start = null;
    function step(now) {
      if (start === null) start = now + delay;
      var t = (now - start) / dur;
      if (t < 0) { raf(step); return; }
      el.textContent = Math.round(to * expoOut(Math.min(t, 1))) + " FPS";
      if (t < 1) raf(step);
    }
    raf(step);
  }

  // Antes e depois
  $$("[data-compare]").forEach(function (root) {
    var buttons = $$("[data-shot]", root);
    var panels = $$("[data-shot-panel]", root);
    var bars = $$("[data-bar]", root);
    var place = indicator(root.querySelector(".seg"));
    function show(name, animate) {
      buttons.forEach(function (b) {
        var on = b.getAttribute("data-shot") === name;
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
        if (on) place(b, animate);
      });
      panels.forEach(function (p) { p.hidden = p.getAttribute("data-shot-panel") !== name; });
      bars.forEach(function (r) { r.classList.toggle("on", r.getAttribute("data-bar") === name); });
    }
    buttons.forEach(function (b) {
      b.addEventListener("click", function () { show(b.getAttribute("data-shot"), true); });
    });
    // Imagens lazy no painel escondido: carregar a segunda já
    panels.forEach(function (p) { var img = p.querySelector("img"); if (img) img.loading = "eager"; });
    show("default", false);

    // Barras crescem de 0 e os números contam até o valor real
    var fps = root.querySelector(".fps-bars");
    if (motion && fps) {
      var nums = $$(".bar-row .num", fps).map(function (el) {
        var v = parseInt(el.textContent, 10) || 0;
        el.textContent = "0 FPS";
        return { el: el, v: v };
      });
      var fio = new IntersectionObserver(function (en) {
        if (!en[en.length - 1].isIntersecting) return;
        fio.disconnect();
        fps.classList.add("go");
        nums.forEach(function (n, i) { countUp(n.el, n.v, 1700, 200 + i * 160); });
      }, { threshold: 0.6 });
      fio.observe(fps);
    }
  });

  // Abas da galeria (padrão WAI-ARIA, setas do teclado) com troca cruzada
  $$("[data-tabs]").forEach(function (root) {
    var tabs = $$('[role="tab"]', root);
    var place = indicator(root.querySelector(".seg"));
    var curPanel = null, timer = 0;
    function select(tab, focus, animate) {
      var next = null;
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle("on", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = doc.getElementById(t.getAttribute("aria-controls"));
        if (panel) { panel.hidden = !on; if (on) next = panel; }
      });
      if (animate && motion && curPanel && next && curPanel !== next) {
        var out = curPanel;
        $$(".pane", root).forEach(function (p) { p.classList.remove("pane-in", "pane-out"); });
        out.classList.add("pane-out");
        void next.offsetWidth; // reinicia a animação de entrada
        next.classList.add("pane-in");
        clearTimeout(timer);
        timer = setTimeout(function () { out.classList.remove("pane-out"); }, 320);
      }
      curPanel = next;
      place(tab, animate);
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t, false, true); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") n = tabs[0];
        else if (e.key === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true, true); }
      });
    });
    select(tabs[0], false, false);
  });

  if (!motion) return;

  // Entrada das seções, com cascata nos itens de lista
  var STAG = ".row, .prof-list > li, .steps > li, details, .changelog > li";
  var BARE = ".sec-head, .final-in, .faq, .changelog, .steps";
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target, kids = el._st || [];
      io.unobserve(el);
      el.classList.add("in");
      // tira o atraso da cascata depois que termina, para o hover responder na hora
      if (kids.length) setTimeout(function () {
        kids.forEach(function (k) { k.classList.remove("st"); k.style.removeProperty("--i"); });
      }, 1300 + kids.length * 65);
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0 });
  $$(".reveal").forEach(function (el) {
    var kids = el.matches(".sec-head, .final-in") ? Array.prototype.slice.call(el.children) : $$(STAG, el);
    kids = kids.filter(function (k) { return !k.classList.contains("final-mark"); });
    kids.forEach(function (k, i) { k.classList.add("st"); k.style.setProperty("--i", Math.min(i, 10)); });
    el._st = kids;
    if (kids.length && el.matches(BARE)) el.classList.add("st-only");
    io.observe(el);
  });

  // Janela do hero: inclinação suave seguindo o ponteiro (só desktop com mouse)
  var shot = doc.querySelector(".hero-shot"), hero = doc.querySelector(".hero");
  if (shot && hero && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var glare = doc.createElement("span");
    glare.className = "shot-glare";
    glare.setAttribute("aria-hidden", "true");
    shot.appendChild(glare);
    shot.classList.add("tilt");
    var tx = 0, ty = 0, x = 0, y = 0, rid = 0;
    var frame = function () {
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      shot.style.transform = "rotateX(" + (-y * 4).toFixed(3) + "deg) rotateY(" + (x * 6).toFixed(3) + "deg)";
      glare.style.transform = "translate(" + (x * 22).toFixed(2) + "%," + (y * 22).toFixed(2) + "%)";
      rid = (Math.abs(tx - x) > 0.0005 || Math.abs(ty - y) > 0.0005) ? raf(frame) : 0;
    };
    var kick = function () { if (!rid) rid = raf(frame); };
    hero.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      tx = e.clientX / window.innerWidth * 2 - 1;
      ty = e.clientY / window.innerHeight * 2 - 1;
      hero.classList.add("hovering");
      kick();
    }, { passive: true });
    hero.addEventListener("pointerleave", function () {
      tx = ty = 0;
      hero.classList.remove("hovering");
      kick();
    });
  }
})();
