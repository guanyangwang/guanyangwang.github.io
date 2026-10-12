/* A persistent set of ink particles flows between hand lettering and animals.
 * Targets are precomputed: no canvas pixel reads, network calls or idle loop.
 */
(() => {
  'use strict';
  const root = document.getElementById('ink-animals');
  const data = window.GWInkMorphData;
  if (!root || !data) return;
  const sheet = root.querySelector('.ink-sheet');
  const art = root.querySelector('.ink-art');
  const live = root.querySelector('.ink-status');
  const ctx = art?.getContext('2d');
  if (!sheet || !ctx || !live) return;

  const count = data.count;
  const half = count / 2;
  const width = data.width;
  const height = data.height;
  const duration = 5400;
  const order = [0, 4, 1, 2, 6, 5, 3, 7];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const shapes = [data.wordmark, ...data.animals];
  const cache = new Map();
  const current = new Float32Array(count * 4);
  const from = new Float32Array(count * 4);
  const to = new Float32Array(count * 4);
  const velocity = new Float32Array(count * 2);
  const momentum = new Float32Array(count * 2);
  const bend = new Float32Array(count * 2);
  const buckets = Array.from({length: 16}, () => []);
  let phase = 'intro';
  let index = -1;
  let round = 0;
  let started = 0;
  let frame = 0;
  let pausedAt = null;
  let boxWidth = 0;
  let boxHeight = 0;
  let pixelRatio = 1;

  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const random = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

  // Compare matching regions at every subdivision, separately for each animal.
  function spatialOrder(points, ids, depth = 0) {
    if (ids.length <= 1) return ids;
    const axis = depth % 2;
    ids.sort((a, b) => points[a * 4 + axis] - points[b * 4 + axis]
      || points[a * 4 + 1 - axis] - points[b * 4 + 1 - axis]);
    const middle = ids.length >> 1;
    return spatialOrder(points, ids.slice(0, middle), depth + 1)
      .concat(spatialOrder(points, ids.slice(middle), depth + 1));
  }

  function pointOrder(points) {
    return [0, 1].flatMap(side => spatialOrder(points,
      Array.from({length: half}, (_, i) => side * half + i)));
  }

  function target(shapeIndex) {
    if (cache.has(shapeIndex)) return cache.get(shapeIndex);
    const binary = atob(shapes[shapeIndex].points);
    if (binary.length !== count * 6) throw new Error('Invalid ink shape');
    const points = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      const k = i * 6, p = i * 4;
      points[p] = (binary.charCodeAt(k) | binary.charCodeAt(k + 1) << 8) / 16;
      points[p + 1] = (binary.charCodeAt(k + 2) | binary.charCodeAt(k + 3) << 8) / 16;
      points[p + 2] = binary.charCodeAt(k + 4) / 32;
      points[p + 3] = binary.charCodeAt(k + 5) / 255;
    }
    const result = {points, order: pointOrder(points)};
    cache.set(shapeIndex, result);
    return result;
  }

  function updatePhase() { root.dataset.inkPhase = phase; }

  function finish() {
    phase = 'idle';
    current.set(to);
    velocity.fill(0);
    updatePhase();
    const name = data.animals[index].name;
    sheet.setAttribute('aria-label', `Two ink ${name}. Click to reshape the ink into another pair.`);
    live.textContent = `The ink has formed a pair of ${name}.`;
  }

  function advance(now) {
    if (phase !== 'drawing') return;
    const u = reduced.matches ? 1 : clamp((now - started) / duration, 0, 1);
    if (u >= 1) { finish(); return; }
    const e = u * u * u * (u * (u * 6 - 15) + 10);
    const de = 30 * u * u * (u - 1) * (u - 1);
    const loosen = 16 * u * u * (1 - u) * (1 - u);
    const dLoosen = 32 * u * (1 - u) * (1 - 2 * u);
    const carry = u * Math.pow(1 - u, 3);
    const dCarry = (1 - u) * (1 - u) * (1 - 4 * u);
    const seconds = duration / 1000;
    for (let i = 0; i < count; i++) {
      const p = i * 4, v = i * 2;
      for (let axis = 0; axis < 2; axis++) {
        const d = to[p + axis] - from[p + axis];
        current[p + axis] = from[p + axis] + d * e + bend[v + axis] * loosen
          + momentum[v + axis] * seconds * carry;
        velocity[v + axis] = (d * de + bend[v + axis] * dLoosen) / seconds
          + momentum[v + axis] * dCarry;
      }
      current[p + 2] = (from[p + 2] + (to[p + 2] - from[p + 2]) * e) * (1 - .35 * loosen);
      current[p + 3] = (from[p + 3] + (to[p + 3] - from[p + 3]) * e) * (1 - .12 * loosen);
    }
  }

  function draw() {
    if (!(boxWidth > 0 && boxHeight > 0)) return;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, boxWidth, boxHeight);
    const scale = Math.min(boxWidth / width, boxHeight / height);
    ctx.translate((boxWidth - width * scale) / 2, (boxHeight - height * scale) / 2);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#252d2c';
    buckets.forEach(bucket => { bucket.length = 0; });
    for (let i = 0; i < count; i++) buckets[clamp(Math.round(current[i * 4 + 3] * 15), 1, 15)].push(i);
    for (let b = 1; b < buckets.length; b++) {
      ctx.globalAlpha = b / 15;
      ctx.beginPath();
      for (const i of buckets[b]) {
        const p = i * 4, x = current[p], y = current[p + 1], r = current[p + 2];
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, Math.PI * 2);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function animate(now) {
    frame = 0;
    if (pausedAt !== null || document.hidden) return;
    advance(now);
    draw();
    if (phase === 'drawing') frame = requestAnimationFrame(animate);
  }

  function wake() {
    if (!frame && pausedAt === null && !document.hidden) frame = requestAnimationFrame(animate);
  }

  function reshape() {
    const now = pausedAt === null ? performance.now() : pausedAt;
    // Capture the actual in-flight positions and velocity before retargeting.
    advance(now);
    from.set(current);
    momentum.set(velocity);
    index = order[round % order.length];
    round++;
    const next = target(index + 1);
    const sourceOrder = pointOrder(from);
    for (let rank = 0; rank < count; rank++) {
      const i = sourceOrder[rank], p = i * 4, q = next.order[rank] * 4, v = i * 2;
      to.set(next.points.subarray(q, q + 4), p);
      const dx = to[p] - from[p], dy = to[p + 1] - from[p + 1];
      const length = Math.max(1, Math.hypot(dx, dy));
      const side = i < half ? -1 : 1;
      const bow = side * (12 + Math.min(28, length * .18));
      const angle = random(i + 71) * Math.PI * 2;
      const spread = 12 + random(i + 17) * 31;
      bend[v] = -dy / length * bow + Math.cos(angle) * spread;
      bend[v + 1] = dx / length * bow + Math.sin(angle) * spread;
      // Momentum remains visible on rapid clicks without flinging dots away.
      momentum[v] = clamp(momentum[v], -95, 95);
      momentum[v + 1] = clamp(momentum[v + 1], -95, 95);
    }
    phase = 'drawing';
    started = performance.now();
    updatePhase();
    const name = data.animals[index].name;
    sheet.setAttribute('aria-label', `Ink is reshaping into two ${name}. Click to choose the next pair.`);
    live.textContent = `The ink is reshaping into a pair of ${name}.`;
    if (reduced.matches) finish();
    draw();
    wake();
  }

  function resize() {
    const box = sheet.getBoundingClientRect();
    boxWidth = box.width;
    boxHeight = box.height;
    pixelRatio = Math.min(devicePixelRatio || 1, 2);
    art.width = Math.max(1, Math.round(boxWidth * pixelRatio));
    art.height = Math.max(1, Math.round(boxHeight * pixelRatio));
    draw();
  }

  function pause() {
    if (pausedAt === null) pausedAt = performance.now();
    cancelAnimationFrame(frame);
    frame = 0;
  }

  function resume() {
    if (document.hidden) return;
    if (pausedAt !== null) { started += performance.now() - pausedAt; pausedAt = null; }
    if (phase === 'drawing') wake();
  }

  try {
    current.set(target(0).points);
    updatePhase();
    resize();
    root.classList.add('is-ready');
    sheet.disabled = false;
  } catch (error) {
    live.textContent = 'The ink interaction is unavailable.';
    return;
  }
  sheet.addEventListener('click', reshape);
  document.addEventListener('visibilitychange', () => document.hidden ? pause() : resume());
  window.addEventListener('pagehide', pause);
  window.addEventListener('pageshow', resume);
  reduced.addEventListener('change', () => { if (phase === 'drawing') wake(); });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(sheet);
  else window.addEventListener('resize', resize);
})();
