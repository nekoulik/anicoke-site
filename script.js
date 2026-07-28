const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── звёзды ── */
(() => {
    const box = $('.stars');
    for (let i = 0; i < 70; i++) {
        const s = document.createElement('i');
        const sz = (Math.random() * 2 + 1).toFixed(1);
        s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${sz}px;height:${sz}px;animation-delay:${(Math.random() * 4).toFixed(2)}s;animation-duration:${(2 + Math.random() * 4).toFixed(2)}s`;
        box.appendChild(s);
    }
})();

/* ── лепестки сакуры ── */
const cv = $('#sakura'), cx = cv.getContext('2d');
let W, H, petals = [], bursts = [], speed = 1;
const COLORS = ['#ffb7d5', '#ff9ec7', '#ff8fb8', '#ffd3e4'];
function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight }
addEventListener('resize', resize); resize();
const makePetal = top => ({
    x: Math.random() * W, y: top ? -20 - Math.random() * 40 : Math.random() * H,
    s: 6 + Math.random() * 8, vy: .5 + Math.random() * 1.1, ph: Math.random() * 6.28, sw: .4 + Math.random() * .8,
    rot: Math.random() * 6.28, vr: (Math.random() - .5) * .04, c: COLORS[Math.random() * COLORS.length | 0], a: .45 + Math.random() * .45
});
function drawPetal(p) {
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
    cx.globalAlpha = p.a; cx.fillStyle = p.c; cx.beginPath(); const s = p.s;
    cx.moveTo(0, 0);
    cx.bezierCurveTo(s * .6, -s * .5, s * 1.1, -s * .1, s * .55, s * .5);
    cx.bezierCurveTo(s * .2, s * .75, -s * .1, s * .4, 0, 0);
    cx.fill(); cx.restore();
}
function burst(x, y, n = 30) {
    for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.28, sp = 2 + Math.random() * 5;
        bursts.push({
            x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, s: 5 + Math.random() * 8, rot: Math.random() * 6.28,
            vr: (Math.random() - .5) * .3, c: COLORS[Math.random() * COLORS.length | 0], a: 1, life: 60 + Math.random() * 40
        });
    }
}
if (!reduced) {
    const COUNT = Math.min(46, Math.floor(W / 28));
    for (let i = 0; i < COUNT; i++)petals.push(makePetal(false));
    (function loop() {
        cx.clearRect(0, 0, W, H);
        for (const p of petals) {
            p.ph += .02 * speed; p.y += p.vy * speed; p.x += Math.sin(p.ph) * p.sw * speed + .2; p.rot += p.vr;
            if (p.y > H + 24) Object.assign(p, makePetal(true)); if (p.x > W + 24) p.x = -20; drawPetal(p);
        }
        bursts = bursts.filter(b => b.life > 0);
        for (const b of bursts) {
            b.x += b.vx; b.y += b.vy; b.vx *= .985; b.vy = b.vy * .985 + .12; b.rot += b.vr; b.life--;
            b.a = Math.min(1, b.life / 40); drawPetal(b);
        }
        requestAnimationFrame(loop);
    })();
}

/* ── тост ── */
let toastT;
function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3400);
}

/* ── скролл: прогресс, нав, линия туториала ── */
const nav = $('#nav'), stepsEl = $('#steps'), railFill = $('#railFill');
function onScroll() {
    const sp = scrollY / Math.max(1, document.body.scrollHeight - innerHeight);
    $('#scrollProgress').style.width = (sp * 100) + '%';
    nav.classList.toggle('scrolled', scrollY > 30);
    const r = stepsEl.getBoundingClientRect();
    const passed = Math.min(Math.max(innerHeight * .5 - r.top, 0), r.height);
    railFill.style.height = passed + 'px';
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* ── появление блоков ── */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
$$('.rev,.step').forEach(el => io.observe(el));

/* ── счётчики ── */
const cio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
        const el = e.target, to = +el.dataset.to, t0 = performance.now();
        (function f(t) {
            const p = Math.min(1, (t - t0) / 1300);
            el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(f);
        })(t0);
        cio.unobserve(el);
    }
}), { threshold: .5 });
$$('[data-to]').forEach(el => cio.observe(el));

/* ── обратный отсчёт ── */
const OPEN_DATE = '2026-08-22T19:00:00+03:00';
const pad = n => String(n).padStart(2, '0');
function tickCd() {
    const d = new Date(OPEN_DATE) - Date.now();
    if (d <= 0) { $('#countdown').innerHTML = '<div class="open-msg">Мы уже открылись — залетай! 🎉</div>'; return; }
    $('#cd-d').textContent = pad(Math.floor(d / 864e5));
    $('#cd-h').textContent = pad(Math.floor(d / 36e5) % 24);
    $('#cd-m').textContent = pad(Math.floor(d / 6e4) % 60);
    $('#cd-s').textContent = pad(Math.floor(d / 1e3) % 60);
}
tickCd(); setInterval(tickCd, 1000);

/* ── печатающийся поиск ── */
(() => {
    const el = $('#typed'); if (!el) return; const word = 'Club Anicoke';
    if (reduced) { el.textContent = word; return; }
    let i = 0, dir = 1;
    (function type() {
        el.textContent = word.slice(0, i);
        if (dir === 1) { if (i < word.length) { i++; setTimeout(type, 95); } else { dir = -1; setTimeout(type, 1900); } }
        else { if (i > 0) { i--; setTimeout(type, 55); } else { dir = 1; setTimeout(type, 700); } }
    })();
})();

/* ── кнопка «Подписаться» ── */
(() => {
    const b = $('#subBtn'); let done = false;
    b.addEventListener('click', () => {
        if (done) return; done = true;
        b.classList.add('done'); b.textContent = '✓ Вы в клубе!';
        const r = b.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, 42);
        toast('Добро пожаловать в Club Anicoke! 🌸');
    });
})();

/* ── чат ── */
(() => {
    const box = $('#chatBox'), inp = $('#chatInput'), send = $('#chatSend'), inputRow = $('.chat-input');
    function go() {
        const v = inp.value.trim() || 'Привет, я новенький! 👋';
        const m = document.createElement('div'); m.className = 'msg me';
        const p = document.createElement('p'); p.textContent = v; m.appendChild(p);
        box.insertBefore(m, inputRow); inp.value = ''; box.scrollTop = box.scrollHeight;
    }
    send.addEventListener('click', go);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
})();

/* ── запись на ивент ── */
(() => {
    const b = $('#joinBtn'), c = $('#seatCount'); let done = false;
    b.addEventListener('click', () => {
        if (done) return; done = true;
        c.textContent = +c.textContent - 1; b.classList.add('done'); b.textContent = '✓ Вы в списке';
        toast('Записали! До встречи в субботу ✦');
    });
})();

/* ── FAQ (с синхронизацией aria-expanded) ── */
$$('.faq-q').forEach(q => q.addEventListener('click', () => {
    const item = q.parentElement, a = item.querySelector('.faq-a');
    const open = item.classList.toggle('open');
    q.setAttribute('aria-expanded', open);
    a.style.maxHeight = open ? a.scrollHeight + 'px' : 0;
}));

/* ── наклон билета ── */
(() => {
    const t = $('#ticket');
    if (reduced || !matchMedia('(pointer:fine)').matches) return;
    t.addEventListener('mousemove', e => {
        const r = t.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        t.style.transform = `rotate(3deg) perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    t.addEventListener('mouseleave', () => t.style.transform = 'rotate(3deg)');
})();

/* ── параллакс плаката-портрета ── */
(() => {
    const p = $('#portrait');
    if (!p || reduced || !matchMedia('(pointer:fine)').matches) return;
    p.addEventListener('mousemove', e => {
        const r = p.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        p.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
    });
    p.addEventListener('mouseleave', () => p.style.transform = '');
})();

/* ── кивок Юки по клику на плакат (оживляет обложку; можно убрать) ── */
(() => {
    const art = $('#portraitArt');
    if (!art || reduced) return;
    const portrait = art.closest('#portrait');
    portrait.addEventListener('click', () => {
        const svg = art.querySelector('svg');
        if (svg) svg.animate(
            [
                { transform: 'rotate(0deg) translateY(0)' },
                { transform: 'rotate(-2.5deg) translateY(-5px)' },
                { transform: 'rotate(1.5deg) translateY(0)' },
                { transform: 'rotate(0deg)' }
            ],
            { duration: 650, easing: 'ease-out' });
        const r = portrait.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height * .35, 18);
        toast('Юки: рада тебя видеть! 🌸');
    });
})();

/* ── код сэнсэя ── */
(() => {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let ki = 0;
    addEventListener('keydown', e => {
        const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        ki = (k === code[ki]) ? ki + 1 : (k === code[0] ? 1 : 0);
        if (ki === code.length) {
            ki = 0;
            toast('🌸 Режим сэнсэя активирован! Лепестков ×2, вайб ×10');
            speed = 2.4; setTimeout(() => speed = 1, 7000);
            for (let j = 0; j < 5; j++)setTimeout(() => burst(Math.random() * W, Math.random() * H * .6, 26), j * 250);
        }
    });
})();

/* ═══════════════════════════════════════════════════════════
   ИЛЛЮСТРАТИВНЫЙ ГЕНЕРАТОР ПЕРСОНАЖЕЙ (чистый SVG)
   Свет сверху-слева: rim-light слева, core-shadow справа,
   ambient-occlusion в стыках. Вариативность: причёска,
   аксессуар, цвет глаз, гетерохромия, наушники, шарфик,
   лёгкий разворот головы в три четверти (turn).
   ═══════════════════════════════════════════════════════════ */
const PALETTES = [
    {
        hair: ['#ffd0e6', '#ff9ec7', '#cf6494'], skin: '#ffe7d8', skinSh: '#efbca2',
        cloth: ['#ff6482', '#c52f4d'], accent: '#ffd27a', eye: '#8a52e0'
    },
    {
        hair: ['#cfe8ff', '#8ecbff', '#4886cf'], skin: '#ffe7d8', skinSh: '#efbca2',
        cloth: ['#46356e', '#241a3d'], accent: '#7df0cc', eye: '#2f9a72'
    },
    {
        hair: ['#c8f6e6', '#6fe3c1', '#2fa483'], skin: '#ffe7d8', skinSh: '#efbca2',
        cloth: ['#ffce63', '#d4941f'], accent: '#ff6f8c', eye: '#cf5a3c'
    },
    {
        hair: ['#f7f1ff', '#d6c6f2', '#a389d4'], skin: '#ffe7d8', skinSh: '#efbca2',
        cloth: ['#c6b6e4', '#8a76b6'], accent: '#ff9ec7', eye: '#3f63c2'
    },
];
const HAIR_STYLES = ['long', 'bob', 'twintails'];
const ACCS = ['catears', 'bow', 'clip', 'none'];
const EYES = ['#8a52e0', '#2f9a72', '#cf5a3c', '#3f63c2', '#e0a93f', '#d6457f', '#39d0c8', '#5ad1ff'];
const TURNS = [-1, 0, 0, 1];
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.random() * a.length | 0];
let UID = 0;

function chibiSVG(mode, o) {
    const id = 'c' + (UID++);
    const p = o.pal, hair = o.hair, acc = o.acc, hp = !!o.hp, scarf = !!o.scarf;
    const turn = o.turn || 0;                       // -1 / 0 / +1  (направление разворота)
    const bd = rnd(0, 4).toFixed(2), wd = rnd(0, 1).toFixed(2), rs = rnd(.3, .42).toFixed(2);
    const waver = mode === 'waver';
    const [hL, hM, hD] = p.hair, [cL, cD] = p.cloth;
    const eyeA = p.eye, eyeB = o.eye2 || p.eye;

    /* параметры три-четверти: сдвиг черт + сужение дальнего глаза */
    const dx = turn * 6;
    const sxL = turn > 0 ? .82 : (turn < 0 ? 1.04 : 1);   // левый глаз
    const sxR = turn < 0 ? .82 : (turn > 0 ? 1.04 : 1);   // правый глаз

    const defs = `<defs>
   <linearGradient id="${id}_h" x1=".2" y1="0" x2=".8" y2="1">
     <stop offset="0" stop-color="${hL}"/><stop offset=".45" stop-color="${hM}"/><stop offset="1" stop-color="${hD}"/></linearGradient>
   <linearGradient id="${id}_hd" x1="0" y1="0" x2="0" y2="1">
     <stop offset="0" stop-color="${hM}"/><stop offset="1" stop-color="${hD}"/></linearGradient>
   <radialGradient id="${id}_sk" cx=".38" cy=".32" r=".82">
     <stop offset="0" stop-color="#fff2e8"/><stop offset=".5" stop-color="${p.skin}"/><stop offset="1" stop-color="${p.skinSh}"/></radialGradient>
   <linearGradient id="${id}_cl" x1=".2" y1="0" x2=".8" y2="1">
     <stop offset="0" stop-color="${cL}"/><stop offset="1" stop-color="${cD}"/></linearGradient>
   <linearGradient id="${id}_ac" x1="0" y1="0" x2="0" y2="1">
     <stop offset="0" stop-color="${p.accent}"/><stop offset="1" stop-color="${cD}"/></linearGradient>
   <linearGradient id="${id}_sc" x1="0" y1="0" x2="1" y2="1">
     <stop offset="0" stop-color="${p.accent}"/><stop offset=".5" stop-color="${hM}"/><stop offset="1" stop-color="${cD}"/></linearGradient>
   <radialGradient id="${id}_eye0" cx=".4" cy=".3" r=".85">
     <stop offset="0" stop-color="${eyeA}"/><stop offset=".55" stop-color="${eyeA}"/><stop offset="1" stop-color="#140d24"/></radialGradient>
   <radialGradient id="${id}_eye1" cx=".4" cy=".3" r=".85">
     <stop offset="0" stop-color="${eyeB}"/><stop offset=".55" stop-color="${eyeB}"/><stop offset="1" stop-color="#140d24"/></radialGradient>
   <radialGradient id="${id}_bl" cx=".5" cy=".5" r=".5">
     <stop offset="0" stop-color="#ff7d9c" stop-opacity=".55"/><stop offset="1" stop-color="#ff7d9c" stop-opacity="0"/></radialGradient>
   <radialGradient id="${id}_sh" cx=".5" cy=".5" r=".5">
     <stop offset="0" stop-color="rgba(0,0,0,.42)"/><stop offset="1" stop-color="rgba(0,0,0,0)"/></radialGradient>
   <radialGradient id="${id}_ao" cx=".5" cy=".4" r=".6">
     <stop offset="0" stop-color="rgba(40,12,30,.5)"/><stop offset="1" stop-color="rgba(40,12,30,0)"/></radialGradient>
   <linearGradient id="${id}_rim" x1="0" y1="0" x2="1" y2="0">
     <stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
   <radialGradient id="${id}_ear" cx=".5" cy=".7" r=".7">
     <stop offset="0" stop-color="#ff8fb0"/><stop offset="1" stop-color="#d96f9c"/></radialGradient>
   <radialGradient id="${id}_hp" cx=".34" cy=".3" r=".85">
     <stop offset="0" stop-color="#4a4260"/><stop offset=".5" stop-color="#2a2438"/><stop offset="1" stop-color="#100c1a"/></radialGradient>
  </defs>`;

    const ears = acc === 'catears' ? `
   <g class="c-ear-l"><path d="M50,42 C44,16 52,8 60,14 C62,26 60,36 58,44 Z" fill="url(#${id}_h)"/>
     <path d="M52,38 C49,22 54,16 58,20 C59,28 58,34 56,40 Z" fill="url(#${id}_ear)"/>
     <path d="M52,38 C49,22 54,16 58,20" stroke="rgba(0,0,0,.18)" stroke-width="1" fill="none"/></g>
   <g class="c-ear-r"><path d="M90,42 C96,16 88,8 80,14 C78,26 80,36 82,44 Z" fill="url(#${id}_h)"/>
     <path d="M88,38 C91,22 86,16 82,20 C81,28 82,34 84,40 Z" fill="url(#${id}_ear)"/>
     <path d="M88,38 C91,22 86,16 82,20" stroke="rgba(0,0,0,.18)" stroke-width="1" fill="none"/></g>` : '';

    const hpBand = hp ? `
   <path d="M41,54 C44,22 96,22 99,54" stroke="url(#${id}_hp)" stroke-width="7.5" fill="none" stroke-linecap="round"/>
   <path d="M46,40 C52,25 88,25 94,40" stroke="#fff" stroke-width="1.6" fill="none" opacity=".3" stroke-linecap="round"/>
   <path d="M41,54 C44,22 96,22 99,54" stroke="${p.accent}" stroke-width="1.4" fill="none" opacity=".5"/>` : '';

    const backMass = `<path d="M40,56 C36,30 104,30 100,56 C100,72 96,84 92,92 L48,92 C44,84 40,72 40,56 Z" fill="url(#${id}_hd)"/>`;
    let sideHair = '';
    if (hair === 'long') {
        sideHair = `<path class="c-hairlong-l" d="M42,58 C30,92 30,134 44,160 C40,128 44,96 52,72 Z" fill="url(#${id}_hd)"/>
      <path class="c-hairlong-l" d="M44,60 C36,90 38,124 48,150 C46,120 50,92 56,72 Z" fill="url(#${id}_h)" opacity=".9"/>
      <path class="c-hairlong-r" d="M98,58 C110,92 110,134 96,160 C100,128 96,96 88,72 Z" fill="url(#${id}_hd)"/>
      <path class="c-hairlong-r" d="M96,60 C104,90 102,124 92,150 C94,120 90,92 84,72 Z" fill="url(#${id}_h)" opacity=".9"/>`;
    } else if (hair === 'twintails') {
        sideHair = `<path class="c-twintail-l" d="M40,60 C24,72 20,108 30,134 C26,104 32,80 44,68 Z" fill="url(#${id}_hd)"/>
      <path class="c-twintail-r" d="M100,60 C116,72 120,108 110,134 C114,104 108,80 96,68 Z" fill="url(#${id}_hd)"/>
      <circle cx="40" cy="62" r="5" fill="url(#${id}_ac)"/><circle cx="100" cy="62" r="5" fill="url(#${id}_ac)"/>`;
    }

    const tail = acc === 'catears' ? `
   <g class="c-tail"><path d="M92,150 C116,150 130,124 124,98 C122,86 112,84 110,96 C113,116 104,134 90,140 Z" fill="url(#${id}_hd)"/>
     <path d="M124,98 C122,86 112,84 110,96 C111,104 114,108 118,108 C122,108 125,104 124,98 Z" fill="${hL}"/></g>` : '';

    const leg = (cls, x) => `<g class="c-leg ${cls}">
     <path d="M${x},148 C${x - 2},166 ${x - 2},182 ${x},196 C${x + 4},198 ${x + 8},196 ${x + 8},190 C${x + 7},178 ${x + 7},162 ${x + 8},150 Z" fill="url(#${id}_sk)"/>
     <path d="M${x - 1},168 q5,2 10,0" stroke="${p.skinSh}" stroke-width="1.1" fill="none" opacity=".55"/>
     <path d="M${x - 4},192 q-3,9 7,10 q13,1 13,-6 q0,-6 -9,-7 q-8,-1 -11,3z" fill="url(#${id}_cl)"/>
     <path d="M${x - 4},199 q10,3 20,0" stroke="rgba(0,0,0,.32)" stroke-width="2" fill="none"/>
     <path d="M${x + 2},192 q3,-2 7,0" stroke="#fff" stroke-width="1.2" fill="none" opacity=".55"/></g>`;
    const legs = `<ellipse cx="70" cy="150" rx="14" ry="9" fill="url(#${id}_ao)"/>${leg('c-leg-l', 56)}${leg('c-leg-r', 64)}`;

    const torso = `<g class="c-torso">
     <path d="M50,92 C48,90 92,90 90,92 C97,114 99,134 94,150 C82,157 58,157 46,150 C41,134 43,114 50,92 Z" fill="url(#${id}_cl)"/>
     <path d="M50,92 C48,90 92,90 90,92 C92,100 92,104 90,108 C76,100 64,100 50,108 C48,104 48,100 50,92 Z" fill="rgba(255,255,255,.12)"/>
     <path d="M58,92 L70,106 L82,92 Z" fill="${p.accent}"/>
     <path d="M70,106 L70,150" stroke="rgba(0,0,0,.16)" stroke-width="1.6" fill="none"/>
     <path d="M52,108 q5,18 2,38 M88,108 q-5,18 -2,38" stroke="rgba(0,0,0,.13)" stroke-width="1.6" fill="none"/>
     <path d="M46,96 q24,10 48,0 q-6,10 -24,10 q-18,0 -24,-10z" fill="url(#${id}_ao)"/>
     <g transform="translate(70,124)" fill="${p.accent}"><path d="M0,-6 C2,-2 6,-2 4,1 C6,4 2,4 0,7 C-2,4 -6,4 -4,1 C-6,-2 -2,-2 0,-6 Z" opacity=".92"/></g>
     <circle cx="70" cy="114" r="2" fill="${p.accent}"/><circle cx="70" cy="138" r="2" fill="${p.accent}"/>
     <path d="M48,96 C44,110 44,128 48,146" stroke="url(#${id}_rim)" stroke-width="2" fill="none" opacity=".5"/>
   </g>`;

    const armL = `<g class="c-arm c-arm-l">
     <path d="M48,96 C38,102 35,120 40,134 C44,138 49,136 48,129 C46,118 48,106 53,99 Z" fill="url(#${id}_cl)"/>
     <circle cx="43" cy="134" r="6" fill="url(#${id}_sk)"/></g>`;
    const armR = waver ? `<g class="c-arm c-arm-wave">
     <path d="M92,96 C104,86 110,64 105,46 C100,40 93,43 94,52 C97,66 92,80 84,90 Z" fill="url(#${id}_cl)"/>
     <path d="M94,52 C97,66 92,80 84,90" stroke="rgba(0,0,0,.16)" stroke-width="1.6" fill="none"/>
     <circle cx="104" cy="44" r="7" fill="url(#${id}_sk)"/>
     <path d="M99,39 q1,-5 3,-4 M103,37 q1,-5 3,-3 M107,39 q2,-4 3,-2 M110,42 q2,-3 3,-1" stroke="${p.skinSh}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
     <path d="M97,46 q-3,0 -3,3" stroke="${p.skinSh}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
   </g>` : `<g class="c-arm c-arm-r">
     <path d="M92,96 C102,102 105,120 100,134 C96,138 91,136 92,129 C94,118 92,106 87,99 Z" fill="url(#${id}_cl)"/>
     <circle cx="97" cy="134" r="6" fill="url(#${id}_sk)"/></g>`;

    /* шарфик-лента: петля на шее + узел + два колышущихся конца */
    const scarfG = scarf ? `<g class="c-scarf">
     <g class="c-scarf-l"><path d="M62,98 C58,112 56,128 60,140 C64,142 67,140 66,134 C64,122 65,110 68,100 Z" fill="url(#${id}_sc)"/>
       <path d="M60,138 l2,4 M63,139 l1,4" stroke="${cD}" stroke-width="1.4" stroke-linecap="round"/></g>
     <g class="c-scarf-r"><path d="M78,98 C82,112 84,128 80,140 C76,142 73,140 74,134 C76,122 75,110 72,100 Z" fill="url(#${id}_sc)"/>
       <path d="M80,138 l-2,4 M77,139 l-1,4" stroke="${cD}" stroke-width="1.4" stroke-linecap="round"/></g>
     <path d="M48,90 C58,98 82,98 92,90 C94,96 92,102 88,104 C76,110 64,110 52,104 C48,102 46,96 48,90 Z" fill="url(#${id}_sc)"/>
     <path d="M48,90 C58,98 82,98 92,90" stroke="rgba(255,255,255,.25)" stroke-width="1.4" fill="none"/>
     <ellipse cx="70" cy="100" rx="6" ry="5" fill="url(#${id}_sc)"/>
     <ellipse cx="70" cy="100" rx="6" ry="5" fill="none" stroke="${cD}" stroke-width="1" opacity=".6"/>
   </g>` : '';

    const neck = `<path d="M62,82 h16 v12 q-8,6 -16,0z" fill="url(#${id}_sk)"/>
    <path d="M62,86 q8,6 16,0 q-2,7 -8,7 q-6,0 -8,-7z" fill="${p.skinSh}" opacity=".7"/>`;

    /* овал лица + асимметричная тень дальней щеки (иллюзия разворота) */
    const farCheek = turn !== 0 ? (turn > 0
        ? `<path d="M44,60 C44,46 50,38 58,36 C50,42 47,52 48,64 C48,74 51,82 57,88 C49,82 44,72 44,60 Z" fill="rgba(40,12,30,.22)"/>`
        : `<path d="M96,60 C96,46 90,38 82,36 C90,42 93,52 92,64 C92,74 89,82 83,88 C91,82 96,72 96,60 Z" fill="rgba(40,12,30,.22)"/>`) : '';
    const face = `<path d="M44,60 C44,34 96,34 96,60 C96,82 84,94 70,94 C56,94 44,82 44,60 Z" fill="url(#${id}_sk)"/>
    <path d="M70,36 C86,36 96,46 96,60 C96,80 86,92 74,93 C84,86 88,72 88,60 C88,48 82,40 70,38 Z" fill="rgba(60,20,40,.13)"/>
    <path d="M46,58 C46,46 52,40 60,38 C50,42 47,52 48,64 C48,72 50,80 56,86 C49,80 46,70 46,58 Z" fill="url(#${id}_rim)" opacity=".55"/>
    <path d="M48,56 C52,46 88,46 92,56 C84,50 78,56 72,48 C68,56 64,48 58,55 C52,50 50,54 48,56 Z" fill="rgba(40,12,30,.16)"/>
    ${farCheek}`;

    const frontHair = `<path d="M40,56 C38,28 102,28 100,56 C100,42 92,34 84,32 C90,44 84,50 78,42 C76,54 68,44 64,54 C60,44 52,54 50,42 C44,50 38,44 44,32 C48,34 40,42 40,56 Z" fill="url(#${id}_h)"/>
    <path class="c-fringe" d="M50,36 C52,50 56,56 58,46 C58,56 62,58 64,48 C64,58 68,58 70,48 C72,58 76,56 76,44 C78,56 82,50 82,40 C74,30 56,30 50,36 Z" fill="url(#${id}_h)"/>
    <path d="M46,32 C58,24 82,24 94,34 C82,29 58,29 46,37 Z" fill="#fff" opacity=".34"/>
    <path d="M40,56 C38,70 40,82 44,90 C42,76 43,66 46,58 Z" fill="url(#${id}_h)"/>
    <path d="M100,56 C102,70 100,82 96,90 C98,76 97,66 94,58 Z" fill="url(#${id}_h)"/>
    <path d="M38,70 C36,76 37,82 40,86 M102,70 C104,76 103,82 100,86" stroke="${hL}" stroke-width="1.4" fill="none" opacity=".7"/>`;

    let headAcc = '';
    if (acc === 'bow') headAcc = `<g class="c-fringe"><path d="M82,32 q-13,-12 -22,-2 q9,-1 13,6 q5,-8 14,3 q-1,-9 -5,-7z" fill="url(#${id}_ac)"/>
     <path d="M82,32 q13,-12 22,-2 q-9,-1 -13,6 q-5,-8 -14,3 q1,-9 5,-7z" fill="url(#${id}_ac)"/>
     <circle cx="82" cy="33" r="4.2" fill="${cD}"/></g>`;
    else if (acc === 'clip') headAcc = `<g class="c-fringe"><path d="M44,44 q5,-11 14,-11" stroke="url(#${id}_ac)" stroke-width="4.4" fill="none" stroke-linecap="round"/>
     <circle cx="58" cy="33" r="3.6" fill="${p.accent}"/><circle cx="58" cy="33" r="1.5" fill="#fff" opacity=".75"/></g>`;

    /* чашки наушников (параметр px — не путать с контекстом канваса cx) */
    const cup = (px, rot, ledCls) => `<g transform="rotate(${rot} ${px} 64)">
     <ellipse cx="${px}" cy="64" rx="10.5" ry="14.5" fill="url(#${id}_hp)"/>
     <ellipse cx="${px}" cy="64" rx="10.5" ry="14.5" fill="none" stroke="rgba(0,0,0,.4)" stroke-width="1"/>
     <ellipse cx="${px}" cy="64" rx="7.4" ry="11" fill="none" stroke="${p.accent}" stroke-width="1.6" opacity=".85"/>
     <ellipse cx="${px}" cy="64" rx="5" ry="8.4" fill="#0c0814"/>
     <ellipse cx="${px - 3}" cy="58" rx="2.4" ry="4.4" fill="#fff" opacity=".45"/>
     <circle class="${ledCls}" cx="${px}" cy="73" r="2" fill="${p.accent}"/>
   </g>`;
    const hpCups = hp ? `${cup(40, -8, 'hp-led')}${cup(100, 8, 'hp-led')}` : '';

    /* глаз с перспективным сжатием по X вокруг своего центра (sx); параметр ex */
    const eye = (ex, happy, grad, sx) => {
        const wrap = sx !== 1 ? `translate(${ex},0) scale(${sx},1) translate(${-ex},0)` : '';
        const inner = happy
            ? `<g class="c-eye"><path d="M${ex - 8},64 q8,-8 16,0" stroke="#2a1d3a" stroke-width="3.2" fill="none" stroke-linecap="round"/>
         <path d="M${ex - 8},64 q8,-8 16,0" stroke="#fff" stroke-width="1" fill="none" opacity=".25"/></g>`
            : `<g class="c-eye">
         <path d="M${ex - 9},58 q9,-8 18,0 q1,11 -3,15 q-6,5 -12,0 q-4,-4 -3,-15z" fill="#fff"/>
         <ellipse cx="${ex}" cy="65" rx="7" ry="8.4" fill="#160e26"/>
         <ellipse cx="${ex}" cy="65" rx="6.3" ry="7.7" fill="url(#${grad})"/>
         <path d="M${ex - 6.3},61 a6.3,7.7 0 0 1 12.6,0 q-6.3,-3.4 -12.6,0z" fill="rgba(0,0,0,.34)"/>
         <ellipse cx="${ex}" cy="65" rx="2.8" ry="3.8" fill="#120b22"/>
         <circle cx="${ex + 2.3}" cy="61" r="2.3" fill="#fff"/>
         <circle cx="${ex - 2.4}" cy="68.4" r="1.2" fill="#fff" opacity=".85"/>
         <path d="M${ex - 3.4},70 q3.4,2.6 6.8,0 q-3.4,1.6 -6.8,0z" fill="${p.accent}" opacity=".5"/>
         <path d="M${ex - 9.5},57 q9.5,-7 19,0" stroke="#1d1430" stroke-width="3" fill="none" stroke-linecap="round"/>
         <path d="M${ex + 7},58 l3,-2 M${ex + 8.5},61 l3,-1" stroke="#1d1430" stroke-width="1.8" fill="none" stroke-linecap="round"/>
       </g>`;
        return wrap ? `<g transform="${wrap}">${inner}</g>` : inner;
    };

    /* лицевые черты сдвинуты на dx (три четверти); глаза ещё и сжаты */
    const features = `<g transform="translate(${dx},0)">
     <path d="M50,52 q7,-3 13,-1" stroke="${hD}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
     <path d="M77,51 q7,-2 13,1" stroke="${hD}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
     ${eye(58, waver, id + '_eye0', sxL)}
     ${eye(82, waver, id + '_eye1', sxR)}
     <ellipse cx="52" cy="74" rx="6.5" ry="3.6" fill="url(#${id}_bl)"/>
     <ellipse cx="88" cy="74" rx="6.5" ry="3.6" fill="url(#${id}_bl)"/>
     <path d="M69,72 q1,3 3,3" stroke="${p.skinSh}" stroke-width="1.7" fill="none" stroke-linecap="round"/>
     <circle cx="69" cy="71" r=".9" fill="#fff" opacity=".5"/>
     ${waver
            ? `<path d="M63,79 q7,8 14,0 q-2,7 -7,7 q-5,0 -7,-7z" fill="#9c2740"/>
          <path d="M64,80 q6,3 12,0 q-2,2 -6,2 q-4,0 -6,-2z" fill="#ff8aa0"/>
          <path d="M65,79 h10" stroke="#fff" stroke-width="1.4" opacity=".8"/>`
            : `<path d="M64,79 q6,4 12,0" stroke="#b83350" stroke-width="2.2" fill="none" stroke-linecap="round"/>`}
   </g>`;

    return `<svg class="chibi" viewBox="0 0 140 240" style="--bd:${bd}s;--wd:${wd}s;--rs:${rs}s" aria-hidden="true">
  ${defs}
  <ellipse cx="70" cy="232" rx="30" ry="6" fill="url(#${id}_sh)"/>
  ${tail}
  ${backMass}
  ${sideHair}
  ${hpBand}
  ${ears}
  ${legs}
  ${torso}
  ${armL}
  ${armR}
  ${neck}
  ${scarfG}
  ${face}
  ${frontHair}
  ${headAcc}
  ${hpCups}
  ${features}
  </svg>`;
}

/* Юки — обложечный маскот: длинные волосы, ушки, наушники, гетерохромия, шарф, разворот */
const YUKI = { pal: PALETTES[0], hair: 'long', acc: 'catears', hp: true, eye2: '#39d0c8', scarf: true, turn: 1 };

function randChar() {
    const o = { pal: pick(PALETTES), hair: pick(HAIR_STYLES), acc: pick(ACCS), turn: pick(TURNS) };
    if (Math.random() < .4) o.hp = true;
    if (Math.random() < .32) o.scarf = true;
    if (Math.random() < .35) {
        let e2 = pick(EYES), guard = 0;
        while (e2 === o.pal.eye && guard++ < 6) e2 = pick(EYES);
        o.eye2 = e2;
    }
    return o;
}

/* слой бегунов */
let runnersLayer;
function ensureRunners() {
    if (runnersLayer) return runnersLayer;
    runnersLayer = document.createElement('div');
    runnersLayer.id = 'runners';
    document.body.appendChild(runnersLayer);
    return runnersLayer;
}
function spawnRunner() {
    if (reduced) return;
    const layer = ensureRunners();
    if (layer.children.length >= 2) return;
    const w = rnd(96, 128);
    const el = document.createElement('div');
    el.className = 'runner';
    el.style.width = w + 'px';
    el.style.bottom = rnd(0, 22) + 'px';
    el.innerHTML = chibiSVG('runner', randChar());
    layer.appendChild(el);
    const dir = Math.random() < .5 ? 1 : -1;
    const start = dir === 1 ? -w - 20 : W + 20, end = dir === 1 ? W + 20 : -w - 20;
    const anim = el.animate(
        [{ transform: `translateX(${start}px) scaleX(${dir})` },
        { transform: `translateX(${end}px) scaleX(${dir})` }],
        { duration: rnd(6500, 10500), easing: 'linear' });
    anim.onfinish = () => el.remove();
}
function scheduleRunners() {
    if (reduced) return;
    setTimeout(spawnRunner, 2200);
    const loop = () => { spawnRunner(); setTimeout(loop, rnd(innerWidth < 640 ? 8000 : 5500, innerWidth < 640 ? 12000 : 9000)); };
    setTimeout(loop, rnd(5000, 8000));
}

/* плакат-портрет в секции «О клубе» (рендерим всегда — это статичная иллюстрация) */
function buildPortrait() {
    const art = $('#portraitArt');
    if (art) art.innerHTML = chibiSVG('waver', YUKI);
}

/* маскот Юки в углу */
const LINES = ['Привет ещё раз! 🌸', 'Ты сегодня смотрел(а) аниме?', 'Не забудь про субботу! ✦',
    'Манга лучше — и точка 😤', 'Gurenge на репите, не спорь 🎤', 'Спойлер = бан, помни 😉',
    'Твой тай-лист — твои правила', 'Опенинги мы не скипаем!', 'Нарисуй фанарт, я оценю 🎨',
    'Мур~ залетай в чат 💬', 'Наушники на максимум 🔊', 'Шарфик поправлю и пойдём ✨'];
let greeterEl, speechT;
function buildGreeter() {
    greeterEl = document.createElement('div');
    greeterEl.id = 'greeter';
    greeterEl.setAttribute('role', 'button');
    greeterEl.setAttribute('tabindex', '0');
    greeterEl.setAttribute('aria-label', 'Маскот клуба Юки — нажать, чтобы поздороваться');
    greeterEl.innerHTML = `<div class="speech" id="speech"></div><div class="waver">${chibiSVG('waver', YUKI)}</div>`;
    document.body.appendChild(greeterEl);
    const speech = greeterEl.querySelector('.speech');
    function say(html) {
        speech.innerHTML = html; speech.classList.add('show');
        clearTimeout(speechT); speechT = setTimeout(() => speech.classList.remove('show'), 3800);
    }
    function hi() {
        say(LINES[Math.random() * LINES.length | 0]);
        const r = greeterEl.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height * .4, 22);
    }
    greeterEl.addEventListener('click', hi);
    greeterEl.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hi(); } });
    return { greeterEl, say };
}
let greeterApi;
function showGreeter() {
    if (reduced) return;
    greeterApi = greeterApi || buildGreeter();
    requestAnimationFrame(() => greeterApi.greeterEl.classList.add('show'));
    setTimeout(() => greeterApi.say('<b>Юки:</b> привет! Нажми на меня 🌸'), 1300);
}

/* ═══════════ ЗАПУСК ═══════════ */
buildPortrait();
function afterIntro() { showGreeter(); scheduleRunners(); }
(function introFlow() {
    const intro = $('#intro');
    document.documentElement.classList.remove('intro-lock');
    if (reduced || !intro) { if (intro) intro.style.display = 'none'; afterIntro(); return; }
    setTimeout(() => { for (let j = 0; j < 6; j++)setTimeout(() => burst(Math.random() * W, Math.random() * H * .7, 26), j * 110); }, 1850);
    setTimeout(() => { intro.style.display = 'none'; afterIntro(); }, 2750);
})();