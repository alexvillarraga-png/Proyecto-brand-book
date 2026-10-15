/* =========================================================
   LA MOVIDA · Manual de marca interactivo
   Los trazos del logotipo, isotipo e íconos se extrajeron
   directamente del PDF original (assets/brand.js).
   ========================================================= */
(() => {
  document.documentElement.classList.add('js');

  const B = window.BRAND;
  const L = B.logo;
  const ORIG = L.letters.map(l => l.fill);
  const NOCHE = '#1F2445', BLANCO = '#FFFFFF';
  const X = 81; // unidad x: altura de mayúscula de «VIDA» (unidades del PDF)
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---------- Constructores SVG ---------- */
  const logoInner = (colors = ORIG, claim = NOCHE) =>
    L.letters.map((l, i) => `<path class="lt lt-${i}" d="${l.d}" fill="${colors[i]}"/>`).join('') +
    `<path class="claim" d="${L.claim}" fill="${claim}"/>`;

  const logoSVG = (colors, claim, label = 'LA MOVIDA — La infancia nos mueve.') =>
    `<svg viewBox="0 0 ${L.w} ${L.h}" role="img" aria-label="${label}">${logoInner(colors, claim)}</svg>`;

  const VARIANTS = {
    principal: [ORIG, NOCHE],
    negativa: [ORIG.slice(0, 4).concat(Array(4).fill(BLANCO)), BLANCO],
    mono: [Array(8).fill(NOCHE), NOCHE],
    monoBlanco: [Array(8).fill(BLANCO), BLANCO],
  };
  const logo = (v = 'principal', label) => logoSVG(VARIANTS[v][0], VARIANTS[v][1], label);

  const isoSVG = (label = 'Isotipo dinámico LA MOVIDA') =>
    `<svg viewBox="-2 -2 110 101" role="img" aria-label="${label}">` +
    B.iso.map((l, i) => `<path class="iso iso-${i}" d="${l.d}" fill="${l.fill}"/>`).join('') + `</svg>`;

  const unicefSVG = (fill = '#1CABE2') =>
    `<svg viewBox="0 0 174 88" role="img" aria-label="UNICEF para cada infancia"><path fill="${fill}" d="${B.unicef}"/></svg>`;

  const iconMap = Object.fromEntries(B.icons.map(i => [i.slug, i]));
  const iconSVG = (ic, strokeW = 7) =>
    `<svg viewBox="0 0 96 96" fill="none" stroke="${ic.color}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">` +
    ic.d.split(/(?=M)/).map(d => `<path d="${d}" pathLength="1"/>`).join('') + `</svg>`;

  /* ---------- Toast / copiar ---------- */
  const toast = $('#toast');
  let toastT;
  function showToast(msg, color) {
    toast.innerHTML = `<i style="--sw:${color || 'var(--verde)'}"></i>${msg}`;
    toast.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove('is-on'), 1800);
  }
  async function copy(text, color) {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const t = document.createElement('textarea');
      t.value = text; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch {}
      t.remove();
    }
    showToast(`Copiado: <b>${text}</b>`, color);
  }

  /* ---------- Inyección de marcas ---------- */
  $$('[data-iso]').forEach(el => (el.innerHTML = isoSVG()));
  $$('[data-unicef]').forEach(el => (el.innerHTML = unicefSVG()));
  $$('[data-icon]').forEach(el => { el.innerHTML = iconSVG(iconMap[el.dataset.icon]); el.classList.add('draw'); });

  /* ---------- HERO ---------- */
  const heroLogo = $('#heroLogo');
  heroLogo.innerHTML = logo('principal');
  const heroSvg = $('svg', heroLogo);
  // envolver cada letra en <g> para separar el movimiento del puntero del balanceo
  $$('.lt', heroSvg).forEach(p => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'ltw');
    p.replaceWith(g); g.appendChild(p);
  });
  const playful = $$('.lt-0, .lt-1, .lt-2, .lt-3', heroSvg);
  const steady = $$('.lt-4, .lt-5, .lt-6, .lt-7', heroSvg);

  // confeti con las letras del isotipo
  const confetti = $('#confetti');
  const pieces = [];
  const narrow = innerWidth < 820;
  for (let i = 0; i < (narrow ? 9 : 18); i++) {
    const l = B.iso[i % 8];
    const s = narrow ? rand(16, 28) : rand(18, 46);
    let x, y;
    if (narrow) do { x = rand(2, 94); y = i % 2 ? rand(3, 11) : rand(86, 95); } while (y < 12 && x > 60);
    else do { x = rand(2, 96); y = rand(4, 94); } while ((x > 6 && x < 90 && y > 22 && y < 80) || (x > 70 && y < 20));
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    el.setAttribute('viewBox', '-2 -2 110 101');
    el.innerHTML = `<path d="${l.d}" fill="${l.fill}"/>`;
    // cada letra del isotipo vive en su propia posición; recortamos el viewBox a la letra
    confetti.appendChild(el);
    const bb = el.firstChild.getBBox();
    el.setAttribute('viewBox', `${bb.x} ${bb.y} ${bb.width} ${bb.height}`);
    Object.assign(el.style, { left: x + '%', top: y + '%', width: s + 'px', height: s + 'px', transform: `rotate(${rand(-40, 40)}deg)` });
    pieces.push(el);
  }

  /* ---------- Navegación ---------- */
  const nav = $('#nav');
  const burger = $('#burger'), links = $('#navLinks');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open);
    links.classList.toggle('is-open', open);
  });
  $$('a', links).forEach(a => a.addEventListener('click', () => {
    burger.setAttribute('aria-expanded', 'false'); links.classList.remove('is-open');
  }));

  /* ---------- CONCEPTO ---------- */
  $('#conceptLogo').innerHTML = logo('principal');

  /* ---------- PLANIMETRÍA ---------- */
  (() => {
    const W = L.w, H = L.h, half = X / 2;
    const ln = (x1, y1, x2, y2, cls, extra = '') => `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" pathLength="1" ${extra}/>`;
    let grid = '';
    for (let x = 0; x <= W + 1; x += half) grid += ln(x, -half / 2, x, H + half / 2, 'gl');
    for (let y = 0; y <= H + 1; y += half) grid += ln(-half / 2, y, W + half / 2, y, 'gl');
    const capTop = 101.5, base = 181.9;
    $('#plan').innerHTML = `
    <svg viewBox="-70 -80 ${W + 150} ${H + 130}" role="img" aria-label="Construcción del logotipo sobre retícula modular de 0,5x; bloque de 5,5x por 3,2x">
      <g class="layer" data-l="grid" stroke="#6E77AA" stroke-opacity=".35" stroke-width="1" vector-effect="non-scaling-stroke">${grid}</g>
      <g class="plan-logo">${logoInner()}</g>
      <g class="layer" data-l="bounds">
        <rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="#0897F9" stroke-width="2" stroke-dasharray="7 6"/>
        <g stroke="#0897F9" stroke-width="2" fill="#0897F9" font-size="22" font-weight="600">
          ${ln(0, -38, W, -38, 'dim')}${ln(0, -48, 0, -28, 'dim')}${ln(W, -48, W, -28, 'dim')}
          <text x="${W / 2}" y="-50" text-anchor="middle" stroke="none">5,5x</text>
          ${ln(W + 38, 0, W + 38, H, 'dim')}${ln(W + 28, 0, W + 48, 0, 'dim')}${ln(W + 28, H, W + 48, H, 'dim')}
          <text x="${W + 52}" y="${H / 2 + 8}" stroke="none">3,2x</text>
        </g>
      </g>
      <g class="layer" data-l="cap" stroke="#ED1B23" stroke-width="2">
        ${ln(-30, capTop, W + 14, capTop, 'cap')}${ln(-30, base, W + 14, base, 'cap')}
        ${ln(-40, capTop, -40, base, 'cap')}
        <circle cx="-40" cy="${(capTop + base) / 2}" r="15" fill="#ED1B23" stroke="none"/>
        <text x="-40" y="${(capTop + base) / 2 + 6}" text-anchor="middle" fill="#fff" stroke="none" font-size="18" font-weight="600">x</text>
      </g>
    </svg>`;
    $$('[data-layer]').forEach(b => b.addEventListener('click', () => {
      b.classList.toggle('is-on');
      $(`#plan .layer[data-l="${b.dataset.layer}"]`).classList.toggle('is-off', !b.classList.contains('is-on'));
    }));
  })();

  /* ---------- ÁREA DE PROTECCIÓN ---------- */
  (() => {
    const stage = $('#protect');
    const ratio = X / L.w;
    stage.innerHTML = `
      <span class="protect__badge" id="pBadge">✓ Tamaño adecuado</span>
      <div class="protect__box" id="pBox">
        <div class="protect__zone" id="pZone"></div>
        <span class="protect__label" data-s="t">x</span><span class="protect__label" data-s="b">x</span>
        <span class="protect__label" data-s="l">x</span><span class="protect__label" data-s="r">x</span>
        <div id="pLogo">${logo('principal')}</div>
      </div>
      <div class="protect__iso" id="pIso" hidden>${isoSVG()}</div>`;
    const range = $('#sizeRange'), out = $('#sizeOut'), box = $('#pBox'), zone = $('#pZone');
    const iso = $('#pIso'), badge = $('#pBadge'), hint = $('#sizeHint');
    function update() {
      const v = +range.value;
      out.textContent = v + ' px';
      const avail = stage.clientWidth - 48;
      const w = Math.min(v, avail / (1 + 2 * ratio));
      const pad = w * ratio;
      const h = w * L.h / L.w;
      box.style.width = w + 'px';
      zone.style.inset = `${-pad}px`;
      const lab = $$('.protect__label', box);
      lab[0].style.cssText = `left:50%;top:${-pad}px;transform:translate(-50%,-2px) translateY(-100%)`;
      lab[1].style.cssText = `left:50%;top:${h + pad}px;transform:translate(-50%,2px)`;
      lab[2].style.cssText = `top:50%;left:${-pad}px;transform:translate(-100%,-50%) translateX(-6px)`;
      lab[3].style.cssText = `top:50%;left:${w + pad}px;transform:translate(6px,-50%)`;
      const small = v < 160;
      box.hidden = small; iso.hidden = !small;
      badge.classList.toggle('is-warn', small);
      badge.textContent = small ? '⚠ Menor a 160 px: usa el isotipo' : '✓ Tamaño adecuado';
      hint.innerHTML = small ? '<strong>Por debajo de 160 px</strong> el logotipo pierde legibilidad: se reemplaza por el isotipo dinámico.' : 'Por debajo de estas medidas, utilizar el isotipo dinámico.';
    }
    range.addEventListener('input', update);
    addEventListener('resize', update);
    update();
  })();

  /* ---------- PALETA ---------- */
  const PRIMARY = [
    { n: 'Verde Movida', hex: '#00D6A3', rgb: '0 · 214 · 163', cmyk: '65 · 0 · 50 · 0', m: 'Crecimiento, esperanza y naturaleza. Aporta frescura.', light: true },
    { n: 'Azul Movida', hex: '#0897F9', rgb: '8 · 151 · 249', cmyk: '75 · 35 · 0 · 0', m: 'Confianza y conexión. Dialoga con el azul de UNICEF.' },
    { n: 'Rojo Movida', hex: '#ED1B23', rgb: '237 · 27 · 35', cmyk: '0 · 95 · 90 · 0', m: 'Energía, pasión y la urgencia de actuar por la infancia.' },
    { n: 'Amarillo Movida', hex: '#FFB200', rgb: '255 · 178 · 0', cmyk: '0 · 35 · 100 · 0', m: 'Alegría, juego y optimismo. Es la luz de la marca.', light: true },
    { n: 'Azul Noche', hex: '#1F2445', rgb: '31 · 36 · 69', cmyk: '90 · 80 · 40 · 45', m: 'Color ancla: solidez, protección y legibilidad.' },
  ];
  const copyBtn = (label, val, color) =>
    `<button class="copy" data-copy="${val}" data-color="${color}" aria-label="Copiar ${label} ${val}"><small>${label}</small><span>${val}</span></button>`;
  $('#palette').innerHTML = PRIMARY.map(c => `
    <article class="color ${c.light ? 'color--light' : ''}" data-reveal style="--c:${c.hex};--fg:${c.light ? NOCHE : '#fff'}">
      <span class="color__blob"></span>
      <div><h3 class="color__name">${c.n}</h3><p class="color__meaning">${c.m}</p></div>
      <div class="color__vals">${copyBtn('HEX', c.hex, c.hex)}${copyBtn('RGB', c.rgb, c.hex)}${copyBtn('CMYK', c.cmyk, c.hex)}</div>
    </article>`).join('');

  const SECONDARY = [
    { n: 'Lavanda', hex: '#6E77AA', rgb: '110 · 119 · 170', u: 'Acentos y pliegue de etiquetas.' },
    { n: 'Cian UNICEF', hex: '#1CABE2', rgb: '28 · 171 · 226', u: 'Reservado a la firma institucional.' },
    { n: 'Menta', hex: '#C9F5EA', rgb: '201 · 245 · 234', u: 'Fondos suaves derivados del verde.' },
    { n: 'Cielo', hex: '#CFE9FE', rgb: '207 · 233 · 254', u: 'Fondos suaves derivados del azul.' },
    { n: 'Rosa', hex: '#FDD5D6', rgb: '253 · 213 · 214', u: 'Fondos suaves derivados del rojo.' },
    { n: 'Crema', hex: '#FFEDC2', rgb: '255 · 237 · 194', u: 'Fondos suaves derivados del amarillo.' },
    { n: 'Niebla', hex: '#F3F4F9', rgb: '243 · 244 · 249', u: 'Fondo neutro para documentos.' },
  ];
  $('#secondary').innerHTML = SECONDARY.map(c => `
    <article class="swatch" data-reveal style="--c:${c.hex}">
      <div class="swatch__chip"></div>
      <h4>${c.n}</h4>
      ${copyBtn('HEX', c.hex, c.hex)}${copyBtn('RGB', c.rgb, c.hex)}
      <p>${c.u}</p>
    </article>`).join('');

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-copy]');
    if (b) copy(b.dataset.copy, b.dataset.color);
  });

  /* ---------- TIPOGRAFÍA ---------- */
  const typeInput = $('#typeInput'), typeSize = $('#typeSize'), weights = $('#weights');
  const syncType = () => {
    const t = typeInput.value.trim() || 'La infancia nos mueve';
    $$('.sample', weights).forEach(s => (s.textContent = t));
  };
  typeInput.addEventListener('input', syncType);
  typeSize.addEventListener('input', () => weights.style.setProperty('--size', typeSize.value + 'px'));
  syncType();

  /* ---------- ICONOGRAFÍA ---------- */
  $('#icons').innerHTML = B.icons.map(ic => `
    <a class="ico" data-reveal href="assets/icons/${ic.slug}.svg" download="la-movida-${ic.slug}.svg" aria-label="Descargar ícono ${ic.name} (SVG)">
      <div class="ico__tile draw" style="--bg:${ic.bg}">${iconSVG(ic)}</div>
      <span>${ic.name}</span>
    </a>`).join('');
  $('#constructIcon').innerHTML = iconSVG(iconMap.cuidado);
  $('#constructIcon').classList.add('draw');

  /* ---------- VERSIONES ---------- */
  const VERS = [
    { n: 'Principal', d: 'Versión a color sobre fondo blanco o claro. Es la versión preferente.', bg: '#FFFFFF', html: logo('principal'), f: 'logo-principal.svg' },
    { n: 'Negativa', d: 'Sobre azul noche, «VIDA» y el claim pasan a blanco.', bg: NOCHE, html: logo('negativa'), f: 'logo-negativo.svg' },
    { n: 'Monocromática', d: 'A una tinta en azul noche para usos de bajo presupuesto o sellos.', bg: '#F3F4F9', html: logo('mono'), f: 'logo-monocromo.svg' },
    { n: 'Isotipo dinámico', d: 'Las letras dispersas de LA MOVIDA. Para avatares, piezas pequeñas y patrones.', bg: '#FFEDC2', html: isoSVG(), f: 'isotipo.svg', iso: true },
  ];
  const verStage = $('#verStage');
  verStage.innerHTML = VERS.map((v, i) => `<div class="v ${v.iso ? 'v--iso' : ''}" data-i="${i}" ${i ? 'style="opacity:0;visibility:hidden"' : ''}>${v.html}</div>`).join('');
  let curV = 0;
  function setVersion(i, animate = true) {
    const v = VERS[i];
    $$('#verTabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.v == i));
    $('#verName').textContent = v.n; $('#verDesc').textContent = v.d;
    const dl = $('#verDl'); dl.href = 'assets/' + v.f; dl.setAttribute('download', 'la-movida-' + v.f);
    verStage.style.backgroundColor = v.bg;
    const prev = $(`.v[data-i="${curV}"]`, verStage), next = $(`.v[data-i="${i}"]`, verStage);
    if (!hasGsap || RM || !animate) {
      $$('.v', verStage).forEach(el => { el.style.opacity = el === next ? 1 : 0; el.style.visibility = el === next ? 'visible' : 'hidden'; });
    } else if (prev !== next) {
      gsap.to(prev, { autoAlpha: 0, scale: .92, duration: .35, ease: 'power2.in' });
      gsap.fromTo(next, { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: .6, delay: .2, ease: 'power3.out' });
      const letters = $$('.lt-0,.lt-1,.lt-2,.lt-3,.iso', next);
      gsap.fromTo(letters, { y: -40, rotation: () => rand(-25, 25), transformOrigin: '50% 50%' },
        { y: 0, rotation: 0, duration: 1, delay: .25, ease: 'elastic.out(1,.45)', stagger: .05 });
    }
    curV = i;
  }
  $$('#verTabs button').forEach(b => b.addEventListener('click', () => setVersion(+b.dataset.v)));
  $('#verTabs').addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const n = (curV + (e.key === 'ArrowRight' ? 1 : 3)) % 4;
    setVersion(n); $(`#verTabs [data-v="${n}"]`).focus();
  });
  setVersion(0, false);

  /* ---------- USOS CORRECTOS ---------- */
  const OK = [
    { n: 'Fondo blanco', bg: '#FFFFFF', html: logo('principal') },
    { n: 'Fondo niebla', bg: '#F3F4F9', html: logo('principal') },
    { n: 'Fondo azul noche', bg: NOCHE, html: logo('negativa') },
    { n: 'Monocromo sobre crema', bg: '#FFEDC2', html: logo('mono') },
    { n: 'Monocromo blanco sobre lavanda', bg: '#6E77AA', html: logo('monoBlanco') },
    { n: 'Co-branding con UNICEF', bg: '#FFFFFF', html: `<div class="cobrand"><div class="lg">${logo('principal')}</div><span class="cobrand__sep"></span><div class="cobrand__u">${unicefSVG()}</div></div>`, raw: true },
  ];
  $('#usesOk').innerHTML = OK.map(u => `
    <figure class="use use--ok" data-reveal>
      <div class="use__stage" style="background:${u.bg}">${u.raw ? u.html : `<div class="lg">${u.html}</div>`}</div>
      <figcaption><span class="use__mark" aria-hidden="true"></span>${u.n}</figcaption>
    </figure>`).join('');

  /* ---------- USOS INCORRECTOS ---------- */
  const BAD = [
    { k: 'stretch', n: 'No deformar ni estirar' },
    { k: 'rotate', n: 'No rotar el bloque' },
    { k: 'colors', n: 'No cambiar los colores' },
    { k: 'font', n: 'No cambiar la tipografía', extra: '<div class="alt" aria-hidden="true"><span>LA</span><br>MOVIDA</div>' },
    { k: 'shadow', n: 'No aplicar sombras' },
    { k: 'outline', n: 'No agregar contornos' },
    { k: 'contrast', n: 'No usar fondos sin contraste' },
    { k: 'reorg', n: 'No reorganizar los elementos' },
  ];
  $('#usesBad').innerHTML = BAD.map(u => `
    <figure class="use use--bad bad-${u.k}" data-reveal tabindex="0" aria-label="${u.n}">
      <div class="use__stage"><div class="lg">${logo('principal')}</div>${u.extra || ''}</div>
      <figcaption><span class="use__mark" aria-hidden="true"></span>${u.n}</figcaption>
    </figure>`).join('');
  $$('.use--bad').forEach(card => {
    const fix = on => card.classList.toggle('is-wrong', !on);
    card.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') fix(true); });
    card.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') fix(false); });
    card.addEventListener('click', e => { if (e.pointerType !== 'mouse') fix(card.classList.contains('is-wrong')); });
    card.addEventListener('focus', () => fix(true));
    card.addEventListener('blur', () => fix(false));
  });

  /* ---------- GRACIAS ---------- */
  $('#thanksLogo').innerHTML = isoSVG();
  const tt = $('#thanksTitle');
  const COLS = ['#00D6A3', '#0897F9', '#ED1B23', '#FFB200'];
  tt.innerHTML = [...tt.textContent].map(ch => `<span aria-hidden="true">${ch}</span>`).join('');
  $$('span', tt).forEach((s, i) => s.addEventListener('mouseenter', () => {
    s.style.color = COLS[i % 4];
    if (hasGsap && !RM) gsap.fromTo(s, { y: 0, rotation: 0 }, { keyframes: [{ y: -18, rotation: -10, duration: .25, ease: 'power2.out' }, { y: 0, rotation: 0, duration: .7, ease: 'bounce.out' }], overwrite: true });
  }));

  /* =========================================================
     ANIMACIONES (GSAP + ScrollTrigger)
     ========================================================= */
  if (!hasGsap || RM) {
    $$('[data-reveal]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    $$('.draw path').forEach(p => (p.style.strokeDashoffset = 0));
    $$('.ratio__bar span').forEach(s => (s.style.width = s.style.getPropertyValue('--w')));
    $$('.use--bad').forEach(c => c.classList.add('is-wrong'));
    nav.classList.add('is-visible');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Entrada del hero: «LA MO» cae y rebota, «VIDA» se asienta firme
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from(playful, {
    y: () => -rand(320, 520), x: () => rand(-120, 120), rotation: () => rand(-120, 120),
    opacity: 0, duration: 1.5, ease: 'bounce.out', stagger: .14, transformOrigin: '50% 50%',
  })
    .from(steady, { y: 50, opacity: 0, duration: .9, stagger: .07 }, .35)
    .from($('.claim', heroSvg), { y: 20, opacity: 0, duration: .8 }, .9)
    .from('.hero__meta > *', { x: 40, opacity: 0, duration: .9, stagger: .12 }, .8)
    .from('.hero__unicef, .hero__scroll', { opacity: 0, duration: .8 }, 1.2)
    .from(pieces, { scale: 0, opacity: 0, duration: .8, stagger: .03, ease: 'back.out(2)' }, .6);

  // Balanceo perpetuo de las letras lúdicas
  tl.add(() => playful.forEach((p, i) => gsap.to(p, {
    rotation: (i % 2 ? 1 : -1) * rand(4, 8), y: -rand(3, 8), transformOrigin: '50% 80%',
    duration: rand(1.4, 2.2), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * .15,
  })));

  // Las letras siguen al puntero
  const hero = $('.hero');
  const wraps = $$('.ltw', heroSvg);
  const movers = wraps.map((g, i) => ({
    x: gsap.quickTo(g, 'x', { duration: .8, ease: 'power3' }),
    y: gsap.quickTo(g, 'y', { duration: .8, ease: 'power3' }),
    f: i < 4 ? [26, 34, 20, 30][i] : 4,
  }));
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
    movers.forEach(m => { m.x(nx * m.f); m.y(ny * m.f); });
    pieces.forEach((p, i) => gsap.to(p, { x: nx * (i % 5 + 1) * -10, y: ny * (i % 4 + 1) * -10, duration: 1, overwrite: 'auto' }));
  });
  hero.addEventListener('pointerleave', () => movers.forEach(m => { m.x(0); m.y(0); }));

  // Confeti flotando
  pieces.forEach(p => gsap.to(p, { rotation: `+=${rand(-30, 30)}`, duration: rand(3, 6), yoyo: true, repeat: -1, ease: 'sine.inOut' }));

  // Parallax de salida del hero
  gsap.to('.hero__inner', { yPercent: -18, opacity: .15, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to(confetti, { yPercent: -30, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });

  // Navegación: visible tras el hero, progreso y sección activa
  const navToggle = () => nav.classList.toggle('is-visible', scrollY > innerHeight * .6);
  addEventListener('scroll', navToggle, { passive: true }); navToggle();
  gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });
  const navMap = { concepto: 'concepto', planimetria: 'planimetria', proteccion: 'planimetria', color: 'color', secundarios: 'color', tipografia: 'tipografia', iconografia: 'iconografia', versiones: 'versiones', usos: 'usos', incorrectos: 'usos', descargas: 'descargas' };
  Object.keys(navMap).forEach(id => ScrollTrigger.create({
    trigger: '#' + id, start: 'top 50%', end: 'bottom 50%',
    onToggle: s => { if (s.isActive) $$('a', links).forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + navMap[id])); },
  }));

  // Revelado general
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%', once: true,
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'power3.out', overwrite: true }),
  });

  // Titular partido en palabras
  $$('[data-split]').forEach(h => {
    h.innerHTML = h.innerHTML.split(/(<br>|\s+)/).map(t => (t === '<br>' || !t.trim()) ? t : `<span class="w">${t}</span>`).join('');
    gsap.from($$('.w', h), { yPercent: 60, rotation: () => rand(-12, 12), opacity: 0, duration: 1, stagger: .1, ease: 'back.out(1.8)', scrollTrigger: { trigger: h, start: 'top 85%' } });
  });

  // Concepto: «LA MO» juega, «VIDA» se queda quieta
  const cLogo = $('#conceptLogo svg');
  ScrollTrigger.create({
    trigger: cLogo, start: 'top 80%', once: true,
    onEnter: () => $$('.lt-0,.lt-1,.lt-2,.lt-3', cLogo).forEach((p, i) => gsap.fromTo(p,
      { rotation: 0, y: 0 },
      { rotation: [-10, 8, -6, 9][i], y: [-14, -8, -10, -6][i], transformOrigin: '50% 90%', duration: .9, delay: i * .12, ease: 'sine.inOut', yoyo: true, repeat: -1, repeatDelay: .2 })),
  });

  // Trazos que se dibujan (íconos)
  const drawIn = (scope, delay = 0) => gsap.to($$('path', scope), { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: .08, delay });
  $$('.draw').forEach((d, i) => ScrollTrigger.create({ trigger: d, start: 'top 90%', once: true, onEnter: () => drawIn(d, (i % 6) * .08) }));
  $$('.ico').forEach(a => a.addEventListener('mouseenter', () => {
    const ps = $$('path', a);
    gsap.fromTo(ps, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .8, ease: 'power2.out', stagger: .05, overwrite: true });
  }));

  // Planimetría: la retícula y las cotas se trazan
  const plan = $('#plan svg');
  gsap.set($$('line', plan), { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.timeline({ scrollTrigger: { trigger: plan, start: 'top 75%' } })
    .from($$('.plan-logo path', plan), { opacity: 0, y: 14, duration: .6, stagger: .05 })
    .to($$('.gl', plan), { strokeDashoffset: 0, duration: .8, stagger: .025, ease: 'power2.out' }, .2)
    .from($$('[data-l="bounds"] rect, [data-l="bounds"] text', plan), { opacity: 0, duration: .6 }, .8)
    .to($$('.dim', plan), { strokeDashoffset: 0, duration: .6, stagger: .05 }, .8)
    .to($$('.cap', plan), { strokeDashoffset: 0, duration: .7, stagger: .1 }, 1)
    .from($$('[data-l="cap"] circle, [data-l="cap"] text', plan), { scale: 0, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(3)' }, 1.4);

  // Protección: el área «respira»
  gsap.fromTo('#pZone', { opacity: .35 }, { opacity: 1, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  // Proporción de uso
  const vertical = matchMedia('(max-width: 640px)').matches;
  gsap.to($$('.ratio__bar span'), {
    [vertical ? 'height' : 'width']: (i, el) => el.style.getPropertyValue('--w'),
    duration: 1.4, ease: 'expo.out', stagger: .12,
    scrollTrigger: { trigger: '#ratioBar', start: 'top 85%' },
  });

  // Usos incorrectos: el error aparece al entrar en pantalla
  ScrollTrigger.batch('.use--bad', {
    start: 'top 80%', once: true,
    onEnter: els => els.forEach((el, i) => setTimeout(() => el.classList.add('is-wrong'), 500 + i * 160)),
  });

  // Gracias
  gsap.from($$('.iso', $('#thanksLogo')), {
    y: -120, rotation: () => rand(-90, 90), opacity: 0, transformOrigin: '50% 50%',
    duration: 1.3, ease: 'bounce.out', stagger: .08, scrollTrigger: { trigger: '.thanks', start: 'top 75%' },
  });
  gsap.from($$('span', tt), { yPercent: 80, opacity: 0, duration: .8, stagger: .05, ease: 'back.out(2)', scrollTrigger: { trigger: tt, start: 'top 90%' } });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
