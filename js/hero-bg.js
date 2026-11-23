// Fundo vivo do hero: "massinha" em tons de cinza (metaballs em baixa resolução, ampliadas pelo CSS).
// ~30 fps, pausa fora da tela e com a aba oculta; com "reduzir movimento" desenha um quadro parado.
(function () {
  "use strict";
  var hero = document.querySelector(".hero");
  if (!hero || !window.requestAnimationFrame) return;
  var cv = document.createElement("canvas");
  var ctx = cv.getContext && cv.getContext("2d");
  if (!ctx) return;
  cv.className = "hero-bg";
  cv.setAttribute("aria-hidden", "true");
  hero.insertBefore(cv, hero.firstChild);

  var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var still = !!(mq && mq.matches);
  var NAV = 60, SCALE = 8, MAXW = 200, PEAK = 78, FRAME_MS = 33;
  // x, y, amplitude x, amplitude y, freq x, freq y, fase, raio (fração do menor lado)
  var B = [
    [0.50, 0.30, 0.24, 0.08, 0.071, 0.093, 0.0, 0.135],
    [0.26, 0.40, 0.14, 0.12, 0.113, 0.067, 1.7, 0.105],
    [0.76, 0.24, 0.14, 0.10, 0.059, 0.121, 3.1, 0.115],
    [0.62, 0.50, 0.20, 0.07, 0.097, 0.083, 4.4, 0.095],
    [0.36, 0.16, 0.16, 0.06, 0.131, 0.104, 5.6, 0.085]
  ];
  var n = B.length, bx = new Float32Array(n), by = new Float32Array(n), rr = new Float32Array(n);
  var W = 0, H = 0, img, px, field, noise;
  var time = 40, running = false, visible = true, raf = 0, last = 0;

  function edge(f) { var t = (f - 0.9) / 1.3; t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }
  function halo(f) { var t = (f - 0.2) / 0.7; t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }

  function render(t) {
    var u = Math.min(W, H), i, x, y, k, f, dx, dy;
    for (i = 0; i < n; i++) {
      var b = B[i], r = b[7] * u * (1 + 0.1 * Math.sin(t * 0.13 + b[6]));
      bx[i] = (b[0] + b[2] * Math.sin(t * b[4] + b[6])) * W;
      by[i] = (b[1] + b[3] * Math.cos(t * b[5] + b[6] * 1.3)) * H;
      rr[i] = r * r;
    }
    for (k = 0, y = 0; y < H; y++) {
      for (x = 0; x < W; x++, k++) {
        for (f = 0, i = 0; i < n; i++) { dx = x - bx[i]; dy = y - by[i]; f += rr[i] / (dx * dx + dy * dy + 1); }
        field[k] = f;
      }
    }
    // luz vinda de cima: borda superior de cada bolha um pouco mais clara
    var off = Math.max(1, Math.round(u * 0.045)) * W;
    for (k = 0; k < W * H; k++) {
      f = field[k];
      var s = edge(f), rim = k >= off ? s - edge(field[k - off]) : 0;
      if (rim < 0) rim = 0;
      px[k * 4 + 3] = (s * 0.55 + rim * 0.6 + halo(f) * 0.12) * PEAK + noise[k];
    }
    ctx.putImageData(img, 0, 0);
  }

  function resize() {
    var w = hero.clientWidth, h = hero.offsetHeight + NAV;
    if (!w || !h) return;
    var nw = Math.max(24, Math.min(MAXW, Math.round(w / SCALE))), nh = Math.max(24, Math.round(nw * h / w));
    if (nw === W && nh === H) return;
    W = nw; H = nh; cv.width = W; cv.height = H;
    img = ctx.createImageData(W, H); px = img.data;
    field = new Float32Array(W * H); noise = new Float32Array(W * H);
    for (var k = 0; k < W * H; k++) {
      px[k * 4] = px[k * 4 + 1] = px[k * 4 + 2] = 255;
      noise[k] = (Math.random() - 0.5) * 2; // grão fixo contra faixas no degradê
    }
    render(time);
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    var dt = now - last;
    if (dt < FRAME_MS) return;
    last = now;
    time += Math.min(dt, 100) / 1000;
    render(time);
  }

  function update() {
    var go = !still && visible && !document.hidden;
    if (go && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
    else if (!go && running) { running = false; cancelAnimationFrame(raf); }
    hero.classList.toggle("is-off", !visible || document.hidden);
  }

  resize();
  void cv.offsetWidth; // aplica o estado inicial antes de ligar a transição
  cv.classList.add("on");

  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(hero);
  else window.addEventListener("resize", resize, { passive: true });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[en.length - 1].isIntersecting; update(); }).observe(hero);
  }
  document.addEventListener("visibilitychange", update);
  if (mq) {
    var onPref = function () { still = mq.matches; update(); };
    if (mq.addEventListener) mq.addEventListener("change", onPref); else if (mq.addListener) mq.addListener(onPref);
  }
  update();
})();
