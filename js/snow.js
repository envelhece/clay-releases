/* Christmas theme: light snow from December 1st to January 6th (preview any day with ?natal=1).
   Still flakes for people who ask the system for less motion; pauses while the tab is hidden. */
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
      b.style.animationDelay = (i * 0.37 % 2.2).toFixed(2) + "s";
      lights.appendChild(b);
    }
    hero.insertBefore(lights, hero.firstChild);
  }

  // Less motion asked for: the flakes stay still (the theme shows, nothing moves).
  var still = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

  var canvas = document.createElement("canvas");
  canvas.className = "snow";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  var flakes = [], w = 0, h = 0, dpr = 1, last = 0, running = true;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var want = Math.min(110, Math.round(w / 14));
    while (flakes.length < want) flakes.push(make(Math.random() * h));
    flakes.length = want;
    if (still) draw();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      ctx.globalAlpha = f.a;
      ctx.beginPath();
      ctx.arc(f.x + Math.sin(f.p) * f.drift, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }
  }

  function make(y) {
    return {
      x: Math.random() * w, y: y,
      r: 0.8 + Math.random() * 1.9,
      v: 14 + Math.random() * 26,
      drift: 8 + Math.random() * 14,
      p: Math.random() * Math.PI * 2,
      a: 0.15 + Math.random() * 0.45
    };
  }

  function frame(t) {
    if (!running) return;
    var dt = last ? Math.min(0.1, (t - last) / 1000) : 0;
    last = t;
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.y += f.v * dt; f.p += dt * 0.8;
      if (f.y - f.r > h) flakes[i] = make(-4);
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
