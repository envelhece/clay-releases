/* Christmas theme: snow crystals and soft distant flakes, December 1st to January 6th (preview with ?natal=1).
   Always falls (even with the Windows animation effects off); pauses while the tab is hidden. */
(function () {
  "use strict";
  var now = new Date();
  var season = now.getMonth() === 11 || (now.getMonth() === 0 && now.getDate() <= 6);
  if (!season && !/[?&]natal=1\b/.test(location.search)) return;

  var root = document.documentElement;
  root.classList.add("xmas");

  var meta = document.querySelector(".hero .meta");
  if (meta) {
    var tag = document.createElement("span");
    tag.className = "xmas-greet";
    tag.textContent = " · boas festas";
    meta.appendChild(tag);
  }

  // Santa hat on every CLAY "C" (same 24x24 space as the logo).
  var NS = "http://www.w3.org/2000/svg";
  function hat() {
    var g = document.createElementNS(NS, "g");
    g.setAttribute("class", "xmas-hat");
    g.setAttribute("transform", "rotate(-14 9 5)");
    [["path", { d: "M3.6 5.4C4.6.6 9.4-2.6 16.6-1.4 13.6.2 13.6 2.6 14.6 5.4Z", fill: "#E53935" }],
     ["path", { d: "M11.6 5.4C11.4 2.4 12.8.2 16.6-1.4 13.6.2 13.6 2.6 14.6 5.4Z", fill: "#B71C1C" }],
     ["rect", { x: "2.6", y: "4.2", width: "13", height: "2.8", rx: "1.4", fill: "#fff" }],
     ["circle", { cx: "16.9", cy: "-1.4", r: "1.7", fill: "#fff" }]].forEach(function (d) {
      var el = document.createElementNS(NS, d[0]);
      for (var k in d[1]) el.setAttribute(k, d[1][k]);
      g.appendChild(el);
    });
    return g;
  }
  document.querySelectorAll("svg.mark, svg.final-mark, svg.hero-mark").forEach(function (svg) {
    if (!svg.getAttribute("viewBox")) svg.setAttribute("viewBox", "0 0 24 24");
    svg.appendChild(hat());
  });

  var icon = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
  if (icon) icon.setAttribute("href", "favicon-xmas.svg");

  // A string of colored lights under the top bar.
  var hero = document.querySelector(".hero");
  if (hero) {
    var lights = document.createElement("div");
    lights.className = "xmas-lights";
    lights.setAttribute("aria-hidden", "true");
    var n = Math.max(8, Math.min(28, Math.round(window.innerWidth / 52)));
    for (var i = 0; i < n; i++) {
      var b = document.createElement("i");
      b.className = "b" + (i % 4);
      b.style.setProperty("animation-delay", (i * 0.37 % 2.2).toFixed(2) + "s", "important");
      lights.appendChild(b);
    }
    hero.insertBefore(lights, hero.firstChild);
  }

  // The snow always falls, like in the CLAY app (it ignores the Windows animation setting too).
  var still = false;

  var canvas = document.createElement("canvas");
  canvas.className = "snow";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  var flakes = [], w = 0, h = 0, dpr = 1, last = 0, running = true;

  // ---- crystals: six arms with side branches, each one different; drawn once, reused as images ----
  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  function crystal(seed, px) {
    var c = document.createElement("canvas");
    c.width = c.height = px;
    var g = c.getContext("2d"), r = px * 0.46, rnd = rng(1000 + seed * 7919);
    var lines = [[0, 0, 0, -r]];
    var pairs = 2 + Math.floor(rnd() * 2), ang = (50 + rnd() * 15) * Math.PI / 180;
    for (var i = 0; i < pairs; i++) {
      var t = 0.3 + 0.55 * (i + rnd() * 0.4) / pairs;
      var len = r * (0.42 - 0.3 * t) * (0.8 + rnd() * 0.45), y = -r * t;
      var dx = Math.sin(ang) * len, dy = -Math.cos(ang) * len;
      lines.push([0, y, dx, y + dy], [0, y, -dx, y + dy]);
      if (len > r * 0.2 && rnd() < 0.5) {
        var tx = dx * 0.55, ty = y + dy * 0.55;
        lines.push([tx, ty, tx + dx * 0.25, ty - len * 0.32], [-tx, ty, -tx - dx * 0.25, ty - len * 0.32]);
      }
    }
    if (rnd() < 0.6) { var f = r * 0.14; lines.push([0, -r * 0.88, f * 0.8, -r * 0.88 - f], [0, -r * 0.88, -f * 0.8, -r * 0.88 - f]); }
    g.translate(px / 2, px / 2);
    g.lineCap = "round"; g.lineJoin = "round";
    [[r * 0.16, "rgba(255,255,255,.22)"], [r * 0.06, "#fff"]].forEach(function (pass) {
      g.lineWidth = pass[0]; g.strokeStyle = pass[1];
      for (var k = 0; k < 6; k++) {
        g.save(); g.rotate(k * Math.PI / 3);
        g.beginPath();
        lines.forEach(function (l) { g.moveTo(l[0], l[1]); g.lineTo(l[2], l[3]); });
        g.stroke(); g.restore();
      }
    });
    var hr = r * (0.12 + rnd() * 0.08);
    g.fillStyle = "rgba(255,255,255,.8)";
    g.beginPath();
    for (var k2 = 0; k2 < 6; k2++) { var a = Math.PI / 3 * k2 + Math.PI / 6; g[k2 ? "lineTo" : "moveTo"](Math.cos(a) * hr, Math.sin(a) * hr); }
    g.closePath(); g.fill();
    return c;
  }
  var sprites = [];
  for (var sIdx = 0; sIdx < 8; sIdx++) sprites.push(crystal(sIdx, 96));

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var want = Math.min(120, Math.round(w / 13));
    while (flakes.length < want) flakes.push(make(Math.random() * h));
    flakes.length = want;
    if (still) draw();
  }

  function make(y) {
    var near = Math.random() < 0.42;
    return near ? {
      s: Math.floor(Math.random() * sprites.length),
      size: 8 + Math.random() * 12,            // 8–20 px crystals up close
      v: 22 + Math.random() * 26, drift: 12 + Math.random() * 18,
      a: 0.55 + Math.random() * 0.4, rot: Math.random() * Math.PI, spin: (Math.random() - 0.5) * 0.9,
      x: Math.random() * w, y: y, p: Math.random() * Math.PI * 2
    } : {
      s: -1, size: 0.7 + Math.random() * 1.6,  // far away: soft dots
      v: 9 + Math.random() * 14, drift: 5 + Math.random() * 9, a: 0.15 + Math.random() * 0.4,
      x: Math.random() * w, y: y, p: Math.random() * Math.PI * 2
    };
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i], x = f.x + Math.sin(f.p) * f.drift;
      ctx.globalAlpha = f.a;
      if (f.s < 0) {
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(x, f.y, f.size, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.save();
        ctx.translate(x, f.y); ctx.rotate(f.rot);
        ctx.drawImage(sprites[f.s], -f.size, -f.size, f.size * 2, f.size * 2);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
  }

  function frame(t) {
    if (!running) return;
    var dt = last ? Math.min(0.1, (t - last) / 1000) : 0;
    last = t;
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.y += f.v * dt; f.p += dt * 0.7;
      if (f.rot !== undefined) f.rot += f.spin * dt;
      if (f.y - f.size > h) flakes[i] = make(-20);
    }
    draw();
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  if (still) return;
  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running) { last = 0; requestAnimationFrame(frame); }
  });
  requestAnimationFrame(frame);
})();
