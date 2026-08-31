/* ============================================================================
   PHANTOM ONLINE — Глобальный UI: шапка, корзина, карточки, утилиты
   Подключается на всех страницах перед их собственным скриптом.
   ============================================================================ */

/* ---------- Утилиты ---------- */
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

/* Префикс пути до корня сайта. Файлы лежат либо в корне (index.html + css/js),
   либо в pages/. На file:// location.pathname включает весь путь с диском,
   поэтому определяем вложенность просто: если текущий файл лежит в подпапке
   pages — поднимаемся одним "../" до корня сайта, иначе остаёмся в корне. */
const ROOT = (function () {
  const dirs = location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
  dirs.pop(); // имя файла
  return dirs[dirs.length - 1] === 'pages' ? '../' : '';
})();

function placeholderHTML(icon, cls) {
  const phclass = cls ? ' ' + cls : '';
  return '<div class="thumb-placeholder' + phclass + '"><div class="ph-icon">' + esc(icon || '⚽') + '</div></div>';
}

/* ============================================================================
   Фото товаров: параметрическая генерация SVG-изображения по данным товара.
   Рисует "картинку товара по имени" — с цветовой схемой клуба/бренда.
   ============================================================================ */
function clubColor(club) {
  const C = {
    'Manchester United':['#da291c','#fbe122'], 'Liverpool':['#c8102e','#35d0a0'],
    'Arsenal':['#ef0107','#ffffff'], 'Chelsea':['#034694','#ffffff'], 'Manchester City':['#6cabdd','#1c2c5b'],
    'Tottenham Hotspur':['#132257','#ffffff'], 'Newcastle United':['#241f20','#ffffff'], 'Aston Villa':['#95bfe5','#670e36'],
    'Real Madrid':['#febe10','#00529f'], 'Barcelona':['#a50044','#004d98'], 'Atlético Madrid':['#cb3524','#ffffff'],
    'Inter':['#0068a8','#1b1b1b'], 'AC Milan':['#fb090b','#1b1b1b'], 'Juventus':['#ffffff','#1b1b1b'], 'Napoli':['#12a0d7','#003f7f'],
    'Bayern Munich':['#dc052d','#0066b2'], 'Borussia Dortmund':['#fde100','#1b1b1b'],
    'Paris Saint-Germain':['#004170','#da291c'], 'Marseille':['#2faee0','#ffffff'],
    'Brazil':['#feca00','#009c3b'], 'Germany':['#ffffff','#1b1b1b']
  };
  if (C[club]) return C[club];
  return ['#6366f1','#0ea5e9'];
}
function brandColor(brand) {
  const b = (brand||'').toLowerCase();
  if (b.indexOf('nike')>=0) return '#111827';
  if (b.indexOf('adidas')>=0) return '#004b93';
  if (b.indexOf('puma')>=0) return '#1b1b1b';
  return '#1c1528';
}

function productArt(p) {
  // Возвращает SVG-строку (фото товара) - тип определяется типом продукта.
  const cat = p.category;
  let art = '';
  const [c1, c2] = p.club ? clubColor(p.club) : ['#8b5cf6', '#0ea5e9'];
  const accent = p.club ? c1 : '#a78bfa';
  const accent2 = p.club ? c2 : '#22d3ee';

  if (cat === 'jersey' || cat === 'retro') {
    const jfile = p.club ? (jerseyPhotoMap[p.club] || '') : '';
    if (jfile) {
      art = '<img loading="lazy" src="' + ROOT + 'assets/img/jerseys/' + jfile + '" alt="' + esc(p.name) + '" ' +
        'onerror="jerseyPhotoFail(this,\'' + p.id + '\')" ' +
        'style="width:100%;height:100%;object-fit:cover;display:block">';
    } else {
      art = jerseySVG(c1, c2, p.kind === 'long-sleeve', p.club ? p.club : 'PHANTOM', p.season||'');
    }
  } else if (cat === 'boots' || cat === 'analogue' || cat === 'street') {
    const sf = p.surface ? p.surface[0] : 'FG';
    const model = detectBootModel(p);
    const pfile = model ? (bootPhotoMap[model] || '') : '';
    if (pfile) {
      art = '<img loading="lazy" src="' + ROOT + 'assets/img/boots/' + pfile + '" alt="' + esc(p.name) + '" ' +
        'onerror="bootPhotoFail(this,\'' + model + '\',\'' + sf + '\')" ' +
        'style="width:100%;height:100%;object-fit:cover;display:block">';
    } else {
      art = model ? bootCoverSVG(model, sf) : bootSVG(accent, accent2, sf);
    }
  } else if (cat === 'balls') {
    art = ballSVG(accent, accent2);
  } else if (cat === 'gk') {
    art = gloveSVG(accent, accent2);
  } else if (cat === 'socks') {
    art = sockSVG(accent, accent2, p.grip === 'Yes');
  } else if (cat === 'shorts') {
    art = shortsSVG(accent, accent2);
  } else if (cat === 'training') {
    const t = (p.productType||'').toLowerCase();
    const tfile = p.club ? (trainingPhotoMap[p.club] || '') : '';
    if (tfile) {
      art = '<div style="position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden">' +
        '<img loading="lazy" src="' + ROOT + 'assets/img/training/' + tfile + '" alt="' + esc(p.name) + '" ' +
        'onerror="trainingPhotoFail(this,\'' + p.id + '\')" ' +
        'style="width:100%;height:135%;object-fit:cover;object-position:center 0%;display:block">' +
        '</div>';
    } else if (t.indexOf('hoodie')>=0) art = hoodieSVG(accent, accent2);
    else if (t.indexOf('track')>=0) art = tracksuitSVG(accent, accent2);
    else if (t.indexOf('wind')>=0) art = windbreakerSVG(accent, accent2);
    else if (t.indexOf('pants')>=0) art = pantsSVG(accent, accent2);
    else if (t.indexOf('shorts')>=0) art = shortsSVG(accent, accent2);
    else if (t.indexOf('sweat')>=0) art = hoodieSVG(accent, accent2);
    else if (t.indexOf('top')>=0) art = trainingTopSVG(accent, accent2);
    else art = jacketSVG(accent, accent2); // jacket / default
  } else if (cat === 'accessories') {
    const t = (p.productType||'').toLowerCase() + (p.subcategory||'').toLowerCase();
    if (t.indexOf('ball')>=0) art = ballSVG(accent, accent2);
    else if (t.indexOf('shin')>=0) art = shinSVG(accent, accent2);
    else if (t.indexOf('glove')>=0) art = gloveSVG(accent, accent2);
    else if (t.indexOf('bag')>=0 || t.indexOf('duffel')>=0) art = bagSVG(accent, accent2);
    else if (t.indexOf('bottle')>=0) art = bottleSVG(accent, accent2);
    else if (t.indexOf('headband')>=0) art = headbandSVG(accent, accent2);
    else art = accSVG(accent, accent2);
  } else {
    // дефолт
    art = bootSVG(accent, accent2, 'FG');
  }
  return art;
}

function svgWrap(inner) {
  return '<svg viewBox="0 0 200 200" width="100%" height="100%" style="display:block">' +
    '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="rgba(255,255,255,0.06)"/><stop offset="1" stop-color="rgba(255,255,255,0.01)"/>' +
    '</linearGradient></defs>' +
    '<rect width="200" height="200" fill="url(#bg)"/>' + inner + '</svg>';
}

function jerseySVG(c1, c2, longSleeve, label, season) {
  const sleeveLen = longSleeve ? 128 : 84;
  return svgWrap(
    '<ellipse cx="100" cy="36" rx="46" ry="8" opacity="0.35" fill="#000"/>' +
    '<g transform="translate(100,120)">' +
      '<path d="M-34,-48 C-52,-58 -72,-58 -88,-46 L-86,-30 L-70,-22 L-50,-30 Z" fill="' + c2 + '" opacity="0.9"/>' +
      '<path d="M34,-48 C52,-58 72,-58 88,-46 L86,-30 L70,-22 L50,-30 Z" fill="' + c2 + '" opacity="0.9"/>' +
      '<rect x="-34" y="-48" width="68" height="92" rx="10" fill="' + c1 + '"/>' +
      '<path d="M-34,-10 L34,-10 L34,44 L-34,44 Z" fill="' + c2 + '"/>' +
      '<path d="M-20,-48 L0,-52 L20,-48 L20,44 L-20,44 Z" fill="' + c1 + '"/>' +
      // ворот
      '<path d="M-10,-52 L0,-46 L10,-52 L6,-36 L-6,-36 Z" fill="' + c1 + '" stroke="' + c2 + '" stroke-width="2"/>' +
      '<text x="0" y="2" text-anchor="middle" font-family="Arial,Helvetica" font-weight="bold" font-size="13" fill="#fff">' +
        esc(label || '') + '</text>' +
    '</g>' +
    '<ellipse cx="100" cy="30" rx="70" ry="10" opacity="0.12" fill="#fff"/>');
}

function bootSVG(c1, c2, surface) {
  return svgWrap(
    '<ellipse cx="100" cy="178" rx="60" ry="10" opacity="0.4" fill="#000"/>' +
    '<g transform="translate(100,150)">' +
      // подошва
      '<path d="M-36,-14 C-46,-6 -50,6 -50,24 L-18,24 C-18,6 -10,-2 20,-2 C40,-2 50,2 50,24 L50,22 C52,10 44,-12 6,-18 Z" fill="#111"/>' +
      // шипы: футзалка (IC) — плоская, сороконожка (AG/MG) — много мелких, иначе обычные
      (surface==='IC' ? '' :
        (surface==='AG' || surface==='MG' ?
          '<g fill="#2a2a2a">' +
          '<rect x="-44" y="18" width="6" height="7" rx="1.5"/><rect x="-37" y="20" width="6" height="7" rx="1.5"/><rect x="-30" y="20" width="6" height="7" rx="1.5"/><rect x="-23" y="21" width="6" height="7" rx="1.5"/>' +
          '<rect x="-16" y="22" width="6" height="7" rx="1.5"/><rect x="-9" y="22" width="6" height="6" rx="1.5"/><rect x="-2" y="22" width="6" height="6" rx="1.5"/>' +
          '<rect x="16" y="20" width="6" height="7" rx="1.5"/><rect x="23" y="20" width="6" height="7" rx="1.5"/><rect x="30" y="21" width="6" height="7" rx="1.5"/>' +
          '<rect x="37" y="22" width="6" height="6" rx="1.5"/></g>' :
          '<g fill="#2a2a2a">' +
          '<rect x="-40" y="18" width="8" height="10" rx="2"/><rect x="-30" y="20" width="8" height="10" rx="2"/><rect x="-20" y="20" width="8" height="10" rx="2"/>' +
          '<rect x="20" y="18" width="8" height="10" rx="2"/><rect x="30" y="20" width="8" height="10" rx="2"/><rect x="40" y="22" width="8" height="8" rx="2"/></g>')) +
      // корпус
      '<path d="M-38,-16 C-48,10 -10,24 22,20 C42,17 50,10 48,2 C44,-8 30,-16 10,-20 C-8,-23 -26,-22 -38,-16 Z" fill="' + c1 + '"/>' +
      '<path d="M-38,-16 C-44,-4 -30,6 -8,2 C10,-2 22,-10 20,-18 C14,-26 -24,-26 -38,-16 Z" fill="' + c2 + '" opacity="0.85"/>' +
      // детали
      '<path d="M-20,-14 L-6,-10" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>' +
      '<circle cx="22" cy="4" r="3" fill="#fff" opacity="0.9"/>' +
      '<path d="M-34,-14 C-30,4 10,16 34,8" stroke="' + c2 + '" stroke-width="2.5" fill="none" opacity="0.9"/>' +
    '</g>');
}

/* ---------- Обложка бутс по модели ---------- */
function detectBootModel(p) {
  const n = (p.name || '').toLowerCase();
  if (n.indexOf('f50') >= 0) return 'f50';
  if (n.indexOf('predator') >= 0) return 'predator';
  if (n.indexOf('phantom') >= 0) return 'phantom';
  if (n.indexOf('superfly') >= 0) return 'superfly';
  if (n.indexOf('vapor') >= 0) return 'vapor';
  if (n.indexOf('ultra') >= 0) return 'ultra';
  if (n.indexOf('future') >= 0) return 'future';
  return '';
}

/* Файл фото для каждой модели. Положи реальные картинки в assets/img/boots/
   с ровно этими именами, чтобы они подхватились автоматически. */
const bootPhotoMap = {
  vapor: 'vapor17.avif', superfly: 'superfly11.avif', f50: 'f50.webp',
  predator: 'predator26.webp', phantom: 'phantom6.avif', ultra: 'ultra6.jpg', future: 'future9.avif'
};

function bootPhotoFail(imgEl, model, sf) {
  if (!imgEl) return;
  const fb = model ? bootCoverSVG(model, sf) : bootSVG('#a78bfa', '#22d3ee', sf || 'FG');
  imgEl.outerHTML = fb;
}

/* Фото форм по клубу. Положи реальные картинки в assets/img/jerseys/
   с ключами из этой таблицы, чтобы они подхватились автоматически. */
const jerseyPhotoMap = {
  'Manchester United': 'manutd.jpeg', 'Liverpool': 'liv.webp', 'Manchester City': 'mancity.webp',
  'Arsenal': 'arsenal.webp', 'Chelsea': 'chelsea.webp', 'Tottenham Hotspur': 'spurs.webp',
  'Newcastle United': 'newcastle.webp', 'Aston Villa': 'astonvilla.jpg',
  'Real Madrid': 'realmadrid.webp', 'Barcelona': 'barcelona.jpeg', 'Atlético Madrid': 'atletico.jpg',
  'Athletic Club': 'athletic.jpg', 'Real Sociedad': 'realsociedad.webp',
  'Inter': 'inter.jpg', 'AC Milan': 'amilan.jpeg', 'Juventus': 'juventus.jpg',
  'Napoli': 'napoli.jpg', 'Roma': 'roma.jpg',
  'Bayern Munich': 'bayern.jpg', 'Borussia Dortmund': 'dortmund.jpg',
  'Bayer Leverkusen': 'leverkusen.jpg', 'RB Leipzig': 'rbleipzig.jpg', 'Eintracht Frankfurt': 'frankfurt.jpg',
  'Paris Saint-Germain': 'psg.jpg', 'Marseille': 'om.jpg', 'Lyon': 'lyon.jpg',
  'Monaco': 'monaco.jpg', 'Lille': 'lille.webp'
};

function jerseyPhotoFail(imgEl, id) {
  if (!imgEl) return;
  const p = (typeof Catalog !== 'undefined') ? Catalog.getById(id) : null;
  if (!p) { if (imgEl.parentNode) imgEl.parentNode.removeChild(imgEl); return; }
  const [x1, x2] = p.club ? clubColor(p.club) : ['#8b5cf6', '#0ea5e9'];
  imgEl.outerHTML = jerseySVG(x1, x2, p.kind === 'long-sleeve', p.club || 'PHANTOM', p.season || '');
}

/* Фото тренировочных комплектов по клубу. Положи картинки в assets/img/training/
   с ключами из этой таблицы, чтобы они подхватились автоматически. */
const trainingPhotoMap = {
  'Manchester United': 'manutd.webp', 'Liverpool': 'liv.jpg', 'Manchester City': 'mancity.jpg',
  'Arsenal': 'arsenal.jpg', 'Chelsea': 'chelsea.jpg', 'Tottenham Hotspur': 'spurs.png',
  'Real Madrid': 'realmadrid.jpg', 'Barcelona': 'barcelona.jpg', 'Atlético Madrid': 'atletico.jpg',
  'Inter': 'inter.webp', 'AC Milan': 'amilan.jpg', 'Juventus': 'juventus.jpg',
  'Napoli': 'napoli.jpeg', 'Bayern Munich': 'bayern.jpg', 'Borussia Dortmund': 'dortmund.webp',
  'Paris Saint-Germain': 'psg.jpg', 'Marseille': 'om.jpg'
};

function trainingPhotoFail(imgEl, id) {
  if (!imgEl) return;
  const p = (typeof Catalog !== 'undefined') ? Catalog.getById(id) : null;
  if (!p) { if (imgEl.parentNode) imgEl.parentNode.removeChild(imgEl); return; }
  const [x1, x2] = p.club ? clubColor(p.club) : ['#8b5cf6', '#0ea5e9'];
  imgEl.outerHTML = tracksuitSVG(x1, x2);
}

function bootCoverSVG(model, surface) {
  const S = {
    vapor:    { b1:'#b91c1c', b2:'#450a0a', a1:'#fecaca', a2:'#f87171', label:'VAPOR',    sub:'MERCURIAL',  theme:'speed',   t1:'#f87171', t2:'#7f1d1d' },
    superfly: { b1:'#dc2626', b2:'#7f1d1d', a1:'#fcd34d', a2:'#fbbf24', label:'SUPERFLY', sub:'MERCURIAL',  theme:'speed',   t1:'#fbbf24', t2:'#991b1b' },
    f50:      { b1:'#65a30d', b2:'#14532d', a1:'#a3e635', a2:'#22d3ee', label:'F50',      sub:'HYPERFAST',  theme:'speed',   t1:'#a3e635', t2:'#052e16' },
    predator: { b1:'#1f2937', b2:'#0b0f19', a1:'#ff5c8a', a2:'#b91c1c', label:'PREDATOR', sub:'CONTROL',    theme:'control', t1:'#ff5c8a', t2:'#111827' },
    phantom:  { b1:'#1e3a8a', b2:'#0b1026', a1:'#93c5fd', a2:'#1d4ed8', label:'PHANTOM',  sub:'CONTROL',    theme:'control', t1:'#93c5fd', t2:'#1e3a8a' },
    ultra:    { b1:'#facc15', b2:'#3f0d0d', a1:'#fde047', a2:'#eab308', label:'ULTRA',    sub:'LIGHTWEIGHT',theme:'speed',   t1:'#fde047', t2:'#422006' },
    future:   { b1:'#0d9488', b2:'#03312e', a1:'#99f6e4', a2:'#14b8a6', label:'FUTURE',   sub:'AGILITY',    theme:'agile',   t1:'#5eead4', t2:'#042f2e' }
  };
  const s = S[model] || { b1:'#6366f1', b2:'#1e1b4b', a1:'#c7d2fe', a2:'#818cf8', label:model.toUpperCase?model.toUpperCase():'BOOT', sub:surface||'FG', theme:'speed', t1:'#c7d2fe', t2:'#1e1b4b' };
  const surBadge = surface && surface !== 'FG' ? '<rect x="138" y="14" width="48" height="20" rx="10" fill="rgba(255,255,255,0.12)"/><text x="162" y="28" text-anchor="middle" font-family="Arial" font-weight="700" font-size="11" fill="#fff">' + surface + '</text>' : '';

  let motif = '';
  const tl = 20, ty = 40;
  if (s.theme === 'speed') {
    motif =
      '<g fill="none" stroke-linecap="round">' +
      '<path d="M8,' + (ty+78) + ' L64,' + (ty+18) + '" stroke="' + s.a2 + '" stroke-width="5" opacity="0.5"/>' +
      '<path d="M20,' + (ty+96) + ' L96,' + (ty+18) + '" stroke="' + s.a1 + '" stroke-width="4" opacity="0.75"/>' +
      '<path d="M40,' + (ty+110) + ' L132,' + (ty+18) + '" stroke="' + s.t1 + '" stroke-width="3" opacity="0.6"/>' +
      '</g>';
  } else if (s.theme === 'control') {
    motif =
      '<g stroke="' + s.a1 + '" stroke-width="1.6" opacity="0.5" fill="none">' +
      '<circle cx="100" cy="' + (ty+52) + '" r="34"/><circle cx="100" cy="' + (ty+52) + '" r="24"/><circle cx="100" cy="' + (ty+52) + '" r="14"/>' +
      '<path d="M66,' + (ty+52) + ' L134,' + (ty+52) + ' M100,' + (ty+18) + ' L100,' + (ty+86) + '" opacity="0.6"/>' +
      '</g>';
  } else {
    motif =
      '<g fill="none" stroke-linecap="round">' +
      '<path d="M30,' + (ty+96) + ' C60,' + (ty+60) + ' 84,' + (ty+72) + ' 120,' + (ty+26) + '" stroke="' + s.t1 + '" stroke-width="5" opacity="0.6"/>' +
      '<path d="M50,' + (ty+104) + ' C76,' + (ty+76) + ' 104,' + (ty+80) + ' 140,' + (ty+26) + '" stroke="' + s.a1 + '" stroke-width="4" opacity="0.5"/>' +
      '</g>';
  }

  return svgWrap(
    '<defs>' +
      '<linearGradient id="covbg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + s.b1 + '"/><stop offset="1" stop-color="' + s.b2 + '"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<rect width="200" height="200" fill="url(#covbg)"/>' +
    '<rect width="200" height="200" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="3"/>' +
    '<rect width="200" height="200" fill="rgba(8,9,15,0.25)"/>' +
    motif +
    // корпус бутсы
    bootSVG(s.a1, s.t1, surface) +
    // название модели
    '<text x="100" y="186" text-anchor="middle" font-family="Arial,Helvetica" font-weight="800" font-size="17" fill="#fff" letter-spacing="2">' + s.label + '</text>' +
    '<text x="100" y="22" text-anchor="middle" font-family="Arial,Helvetica" font-weight="700" font-size="9" fill="rgba(255,255,255,0.75)" letter-spacing="3">' + s.sub + ' · ' + esc(surface || 'FG') + '</text>' +
    surBadge
  );
}

function ballSVG(c1, c2) {
  return svgWrap(
    '<ellipse cx="100" cy="150" rx="55" ry="12" opacity="0.4" fill="#000"/>' +
    '<g transform="translate(100,95)">' +
      '<circle r="48" fill="#f5f5f5"/>' +
      '<path d="M0,-48 L0,48 M-42,-24 L42,24 M-42,24 L42,-24" stroke="#1b1b1b" stroke-width="2"/>' +
      '<path d="M0,-48 L-30,0 M0,-48 L30,0 M0,48 L-42,-24 M0,48 L42,-24" stroke="#1b1b1b" stroke-width="2" opacity="0.7"/>' +
      '<path d="M-30,0 L-42,24 M30,0 L42,24" stroke="#1b1b1b" stroke-width="2" opacity="0.7"/>' +
      '<circle r="48" fill="none" stroke="' + c1 + '" stroke-width="3"/>' +
      '<path d="M-20,-44 A48 48 0 0 1 20,-44" stroke="' + c2 + '" stroke-width="3" fill="none" opacity="0.8"/>' +
    '</g>');
}

function gloveSVG(c1, c2) {
  return svgWrap(
    '<ellipse cx="100" cy="168" rx="48" ry="8" opacity="0.4" fill="#000"/>' +
    '<g transform="translate(100,120)">' +
      '<path d="M-30,-70 C-46,-60 -50,-30 -46,-10 C-44,10 -40,26 -34,30 L-6,26 C2,10 2,-20 -14,-40 Z" fill="' + c1 + '"/>' +
      '<path d="M30,-70 C46,-60 50,-30 46,-10 C44,10 40,26 34,30 L6,26 C-2,10 -2,-20 14,-40 Z" fill="' + c1 + '"/>' +
      '<path d="M-28,-72 C-50,-40 -52,30 -40,40 L-8,34 C0,20 -6,-30 0,-52 Z" fill="' + c2 + '"/>' +
      '<path d="M28,-72 C50,-40 52,30 40,40 L8,34 C0,20 6,-30 0,-52 Z" fill="' + c2 + '"/>' +
      '<path d="M-46,34 L-6,30" stroke="#fff" stroke-width="2" opacity="0.7"/>' +
      '<path d="M46,34 L6,30" stroke="#fff" stroke-width="2" opacity="0.7"/>' +
      '<text x="0" y="10" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="9" fill="#fff" opacity="0.9">G−KEEP</text>' +
    '</g>');
}

function sockSVG(c1, c2, grip) {
  return svgWrap(
    '<g transform="translate(60,60)">' +
      '<path d="M0,0 L8,70 C10,90 12,120 50,120 L55,120 C55,90 50,60 46,0 Z" fill="' + c1 + '"/>' +
      '<path d="M0,0 C0,-20 10,-26 22,-26 C34,-26 46,-20 46,0 L42,28 L4,28 Z" fill="' + c2 + '"/>' +
      '<path d="M6,34 L42,34" stroke="' + c2 + '" stroke-width="3" opacity="0.8"/>' +
      (grip ? '<g fill="#1b1b1b"><rect x="10" y="70" width="26" height="4" rx="2"/><rect x="10" y="80" width="26" height="4" rx="2"/><rect x="10" y="90" width="26" height="4" rx="2"/></g>' : '') +
    '</g>');
}

function shortsSVG(c1, c2) {
  return svgWrap(
    '<g transform="translate(100,120)">' +
      '<path d="M-30,-40 L-12,-40 L-4,20 L-10,36 L-34,36 Z" fill="' + c1 + '"/>' +
      '<path d="M30,-40 L12,-40 L4,20 L10,36 L34,36 Z" fill="' + c1 + '"/>' +
      '<rect x="-12" y="-40" width="24" height="20" fill="' + c2 + '"/>' +
      '<rect x="-12" y="-20" width="24" height="12" fill="' + c2 + '" opacity="0.8"/>' +
      '<path d="M-30,-40 C-14,-10 -14,20 -10,36 M30,-40 C14,-10 14,20 10,36" stroke="' + c2 + '" stroke-width="2.5" fill="none"/>' +
      '<path d="M-8,-46 L8,-46 L6,-40 L-6,-40 Z" fill="' + c2 + '"/>' +
    '</g>');
}

function jacketSVG(c1, c2) {
  return svgWrap(
    '<g transform="translate(100,130)">' +
      '<path d="M-30,-52 C-42,-20 -44,20 -40,44 L-14,40 L-6,-40 Z" fill="' + c1 + '"/>' +
      '<path d="M30,-52 C42,-20 44,20 40,44 L14,40 L6,-40 Z" fill="' + c2 + '"/>' +
      '<path d="M-6,-52 L6,-52 L6,10 C0,20 -6,20 -6,10 Z" fill="' + c1 + '"/>' +
      '<path d="M-6,-52 L6,-52 L4,8 L-4,8 Z" fill="' + c2 + '" opacity="0.7"/>' +
      '<path d="M-30,-52 L30,-52 L24,-42 L-24,-42 Z" fill="' + c1 + '"/>' +
    '</g>');
}

function hoodieSVG(c1, c2) {
  return svgWrap(
    '<g transform="translate(100,130)">' +
      '<path d="M-32,-56 C-46,-30 -46,18 -40,44 L-14,40 L-6,-44 Z" fill="' + c1 + '"/>' +
      '<path d="M32,-56 C46,-30 46,18 40,44 L14,40 L6,-44 Z" fill="' + c1 + '"/>' +
      '<path d="M-6,-56 L6,-56 L6,14 C0,24 -6,24 -6,14 Z" fill="' + c2 + '"/>' +
      '<path d="M-14,-34 C-20,-10 -20,10 -14,30" stroke="' + c2 + '" stroke-width="2" fill="none"/>' +
      '<path d="M14,-34 C20,-10 20,10 14,30" stroke="' + c2 + '" stroke-width="2" fill="none"/>' +
      '<path d="M-6,-60 C-20,-70 20,-70 6,-60 L6,-56 L-6,-56 Z" fill="' + c2 + '"/>' +
      '<rect x="-8" y="-6" width="16" height="30" rx="4" fill="' + c2 + '" opacity="0.85"/>' +
    '</g>');
}

function tracksuitSVG(c1, c2) {
  return svgWrap(
    '<g transform="translate(70,55)">' +
      '<path d="M0,0 L6,60 C8,85 12,105 45,105 L50,105 L50,30 L14,0 Z" fill="' + c1 + '"/>' +
      '<path d="M0,0 C0,-8 8,-14 22,-14 L26,28 C20,34 4,34 0,24 Z" fill="' + c2 + '"/>' +
      '<rect x="10" y="40" width="24" height="22" rx="4" fill="' + c2 + '" opacity="0.8"/>' +
    '</g>');
}

function pantsSVG(c1, c2) {
  return svgWrap(
    '<g transform="translate(100,120)">' +
      '<path d="M-30,-44 L16,-44 L20,42 L-18,42 Z" fill="' + c1 + '"/>' +
      '<path d="M16,-44 L-22,-38 L-16,42 L-6,42 Z" fill="' + c2 + '" opacity="0.7"/>' +
      '<rect x="-14" y="-44" width="28" height="12" fill="' + c2 + '"/>' +
    '</g>');
}

function windbreakerSVG(c1, c2) {
  return svgWrap(
    '<g transform="translate(100,130)">' +
      '<path d="M-30,-56 C-44,-24 -46,16 -42,46 L-14,42 L-4,-44 Z" fill="' + c1 + '"/>' +
      '<path d="M30,-56 C44,-24 46,16 42,46 L14,42 L4,-44 Z" fill="' + c1 + '"/>' +
      '<path d="M-4,-46 L4,-46 L4,6 C0,12 -4,12 -4,6 Z" fill="' + c2 + '"/>' +
      '<path d="M-6,-14 C6,-8 6,8 -6,14" stroke="' + c2 + '" stroke-width="2" fill="none" opacity="0.8"/>' +
    '</g>');
}

function trainingTopSVG(c1, c2) {
  return svgWrap(
    '<g transform="translate(100,130)">' +
      '<rect x="-32" y="-50" width="64" height="92" rx="10" fill="' + c1 + '"/>' +
      '<path d="M-32,-10 L32,-10 L32,42 L-32,42 Z" fill="' + c2 + '" opacity="0.85"/>' +
      '<path d="M-12,-50 L12,-50" stroke="' + c2 + '" stroke-width="5" stroke-linecap="round"/>' +
    '</g>');
}

function shinSVG(c1, c2) {
  return svgWrap(
    '<g transform="translate(100,150)">' +
      '<path d="M-14,-40 C-24,-30 -26,10 -18,34 L18,34 C26,10 24,-30 14,-40 Z" fill="' + c1 + '"/>' +
      '<path d="M-18,34 L18,34 L14,44 L-14,44 Z" fill="' + c2 + '"/>' +
      '<path d="M-12,4 L12,4" stroke="' + c2 + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M-12,-20 L12,-20" stroke="' + c2 + '" stroke-width="3" stroke-linecap="round"/>' +
    '</g>');
}

function bagSVG(c1, c2) {
  return svgWrap(
    '<g transform="translate(100,120)">' +
      '<rect x="-40" y="-22" width="80" height="48" rx="12" fill="' + c1 + '"/>' +
      '<rect x="-40" y="-22" width="80" height="14" rx="7" fill="' + c2 + '"/>' +
      '<rect x="-12" y="-34" width="24" height="12" rx="5" fill="' + c2 + '"/>' +
      '<rect x="-44" y="-28" width="6" height="6" rx="3" fill="' + c2 + '"/><rect x="38" y="-28" width="6" height="6" rx="3" fill="' + c2 + '"/>' +
    '</g>');
}

function bottleSVG(c1, c2) {
  return svgWrap(
    '<g transform="translate(100,120)">' +
      '<rect x="-8" y="-46" width="16" height="12" rx="4" fill="' + c2 + '"/>' +
      '<path d="M-16,-34 L16,-34 L12,24 C12,32 -12,32 -12,24 Z" fill="rgba(34,211,238,0.5)" stroke="' + c1 + '" stroke-width="3"/>' +
      '<path d="M-12,0 L12,0" stroke="' + c1 + '" stroke-width="4" opacity="0.6"/>' +
    '</g>');
}

function headbandSVG(c1, c2) {
  return svgWrap(
    '<g transform="translate(100,100)">' +
      '<circle r="30" fill="none" stroke="' + c1 + '" stroke-width="14"/>' +
      '<circle r="30" fill="none" stroke="' + c2 + '" stroke-width="14" stroke-dasharray="30 40" stroke-dashoffset="10"/>' +
    '</g>');
}

function accSVG(c1, c2) {
  return svgWrap(
    '<circle cx="100" cy="100" r="42" fill="none" stroke="' + c1 + '" stroke-width="6"/>' +
    '<path d="M100,58 A42 42 0 0 1 142,100" stroke="' + c2 + '" stroke-width="6" fill="none"/>');
}

function productImgHTML(p) {
  return productArt(p);
}

function badgeRow(p) {
  let h = '<div class="badge-row">';
  if (p.isNew) h += '<span class="badge badge-new">NEW</span>';
  if (p.bestseller) h += '<span class="badge badge-best">BESTSELLER</span>';
  if (p.sale) h += '<span class="badge badge-sale">SALE</span>';
  h += '</div>';
  return h;
}

function surfaceRow(p) {
  if (!p.surface || !p.surface.length) return '';
  const chips = p.surface.map(s => '<span class="surface-chip">' + esc(s) + '</span>').join('');
  return '<div class="surface-row">' + chips + '</div>';
}

/* ---------- Карточка товара ---------- */
function productCard(p) {
  const sizes = (p.sizes || []).slice(0, 5).map(s => '<span>' + esc(s) + '</span>').join('');
  const price = Catalog.fmt(p.price);
  let old = '';
  if (p.oldPrice) { old = '<span class="old-price">' + Catalog.fmt(p.oldPrice) + '</span>'; }
  const level = p.level ? '<span class="level-chip">' + esc(p.level) + '</span>' : '';
  const brand = esc(p.brand || 'PHANTOM');
  const catName = p.subcategory || (CATEGORIES_META[p.category] ? CATEGORIES_META[p.category].ru : '');

  return '' +
    '<article class="product-card" data-id="' + esc(p.id) + '">' +
      '<div class="thumb">' +
        badgeRow(p) +
        productImgHTML(p) +
        surfaceRow(p) +
      '</div>' +
      '<div class="product-body">' +
        '<div class="brand-line"><span>' + brand + '</span>' + level + '</div>' +
        '<a class="product-title" href="' + ROOT + 'pages/product.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.name) + '</a>' +
        '<div class="product-cat">' + esc(catName) + '</div>' +
        (sizes ? '<div class="sizes">' + sizes + '</div>' : '') +
        '<div class="price-row"><span class="price">' + price + '</span>' + old + '</div>' +
      '</div>' +
      '<div class="card-actions">' +
        '<a class="btn btn-ghost" href="' + ROOT + 'pages/product.html?id=' + encodeURIComponent(p.id) + '">Подробнее</a>' +
        '<button class="btn btn-primary" onclick="addToCart(\'' + esc(p.id) + '\')">В корзину</button>' +
      '</div>' +
    '</article>';
}

/* ---------- Корзина (localStorage) ---------- */
function getCart() { try { return JSON.parse(localStorage.getItem('phantom_cart') || '[]'); } catch(e) { return []; } }
function saveCart(c) { localStorage.setItem('phantom_cart', JSON.stringify(c)); }

function addToCart(id, opts) {
  const p = Catalog.getById(id);
  if (!p) return;
  const o = opts || {};
  const line = { id: p.id, name: p.name, brand: p.brand, price: p.price, image: p.image,
    size: o.size || (p.sizes && p.sizes[0]) || '', qty: o.qty || 1, custom: o.custom || null, surface: p.surface || [], level: p.level || '' };
  const cart = getCart();
  const existing = cart.find(c => c.id === line.id && c.size === line.size && JSON.stringify(c.custom) === JSON.stringify(line.custom));
  if (existing) { existing.qty += line.qty; }
  else { cart.push(line); }
  saveCart(cart);
  updateCartBadge();
  openDrawer();
  toast('Добавлено в корзину ✓');
}

function removeFromCart(i) { const c = getCart(); c.splice(i, 1); saveCart(c); renderCart(); updateCartBadge(); }
function changeQty(i, d) { const c = getCart(); c[i].qty = Math.max(1, (c[i].qty||1) + d); saveCart(c); renderCart(); updateCartBadge(); }
function cartTotal(c) { return c.reduce((s, x) => s + x.price * x.qty, 0); }
function updateCartBadge() { const n = getCart().reduce((s, x) => s + x.qty, 0); const el = document.getElementById('cart-count'); if (el) el.textContent = n; /*el.style.display = n ? 'grid':'none';*/ }

/* ---------- Корзина: шторка ---------- */
let drawerEl, overlayEl;
function openDrawer() {
  drawerEl = document.getElementById('cart-drawer');
  overlayEl = document.getElementById('drawer-overlay');
  if (!drawerEl) return;
  renderCart();
  drawerEl.classList.add('open'); overlayEl.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() { if (!drawerEl) return; drawerEl.classList.remove('open'); overlayEl.classList.remove('open'); document.body.style.overflow = ''; }

function renderCart() {
  const body = document.getElementById('cart-items');
  const foot = document.getElementById('cart-footer');
  if (!body) return;
  const cart = getCart();
  if (!cart.length) {
    body.innerHTML = '<div class="empty"><div class="big">Корзина пуста</div><p>Добавьте товары из каталога</p></div>';
    if (foot) foot.innerHTML = '';
    return;
  }
  body.innerHTML = cart.map((c, i) => {
    const custom = c.custom ? '<div class="ci-meta">' + esc(c.custom.player || '') + ' · ' + esc(c.custom.number || '') + '</div>' : '';
    const cartP = Catalog.getById(c.id) || c;
    return '<div class="cart-item">' +
      '<div class="ci-img" style="overflow:hidden">' + productImgHTML(cartP) + '</div>' +
      '<div class="ci-info"><div class="ci-name">' + esc(c.name) + '</div>' +
      '<div class="ci-meta">' + esc(c.brand||'') + (c.size ? ' · размер ' + esc(c.size) : '') + custom + ' · ' + Catalog.fmt(c.price) + '</div></div>' +
      '<div class="qty-selector" style="margin:0;flex-direction:column;gap:4px">' +
        '<button class="qty-btn" style="width:26px;height:26px" onclick="changeQty(' + i + ',1)">+</button>' +
        '<span class="qty-val" style="font-size:.9rem">' + c.qty + '</span>' +
        '<button class="qty-btn" style="width:26px;height:26px" onclick="changeQty(' + i + ',-1)">−</button>' +
        '<button class="ci-remove" onclick="removeFromCart(' + i + ')">✕</button>' +
      '</div></div>';
  }).join('');
  if (foot) foot.innerHTML = '<div class="cart-total-row"><span>Итого</span><span class="v">' + Catalog.fmt(cartTotal(cart)) + '</span></div>' +
    '<button class="btn btn-primary" style="width:100%" onclick="checkout()">Оформить заказ</button>';
}

function checkout() { window.location.href = ROOT + 'pages/checkout.html'; }

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  clearTimeout(toastTimer);
  requestAnimationFrame(() => t.classList.add('show'));
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- Общий рендер шапки/футера ---------- */
function renderChrome() {
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');

  if (header) header.innerHTML = '' +
    '<div class="container header-inner">' +
      '<a class="brand" href="' + ROOT + 'index.html">' +
        '<div class="logo">P</div>' +
        '<div class="brand-text"><div class="word">PHANTOM<em> ONLINE</em></div><small>FOOTBALL CULTURE</small></div>' +
      '</a>' +
      '<nav class="nav" id="main-nav">' +
        '<a href="' + ROOT + 'index.html">Главная</a>' +
        '<a href="' + ROOT + 'pages/catalog.html">Каталог</a>' +
        '<a href="' + ROOT + 'pages/analogues.html">Аналоги</a>' +
        '<a href="' + ROOT + 'pages/jerseys.html">Футболки</a>' +
        '<a href="' + ROOT + 'pages/collections.html">Коллекции</a>' +
        '<a href="' + ROOT + 'pages/leagues.html">Лиги</a>' +
        '<a href="' + ROOT + 'pages/cms.html">Админ</a>' +
      '</nav>' +
      '<div class="header-tools">' +
        '<button class="menu-toggle icon-btn" onclick="toggleNav()" aria-label="Меню">☰</button>' +
        '<a class="icon-btn" href="' + ROOT + 'pages/catalog.html" aria-label="Поиск"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></a>' +
        '<button class="icon-btn" onclick="openDrawer()" aria-label="Корзина"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" style="fill:none"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><span class="cart-count" id="cart-count">0</span></button>' +
      '</div>' +
    '</div>';

  if (footer) footer.innerHTML = '' +
    '<div class="container footer-inner">' +
      '<div class="footer-col footer-brand">' +
        '<a class="brand" href="' + ROOT + 'index.html"><div class="logo">P</div><div class="brand-text"><div class="word">PHANTOM<em> ONLINE</em></div></div></a>' +
        '<p>Специализированный футбольный маркетплейс. PLAY WITH PURPOSE. BUILT FOR THE GAME. YOUR GAME. YOUR STYLE.</p>' +
        '<div class="social"><a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></a>' +
        '<a href="#" aria-label="Telegram"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.6 18.6 19.5c-.25 1.1-.9 1.37-1.83.85l-5.05-3.72-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.13L18.05 5.4c.4-.36-.09-.56-.63-.2L6.1 11.6l-4.93-1.54c-1.07-.33-1.09-1.07.23-1.58L20.6 3c.9-.33 1.68.2 1.3 1.6Z"/></svg></a>' +
        '<a href="#" aria-label="YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.6 3.6 12 3.6 12 3.6s-4.6 0-7.7.3c-.5.1-1.5.1-2.4 1-.7.7-.9 2.3-.9 2.3S.8 9.1.8 11v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.6 1 1.9.2 7.5.3 7.5.3s4.6 0 7.7-.3c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8V11c0-1.9-.2-3.8-.2-3.8ZM9.7 15V8.6l6.3 3.2-6.3 3.2Z"/></svg></a></div>' +
      '</div>' +
      '<div class="footer-col"><h4>Каталог</h4>' +
        '<a href="' + ROOT + 'pages/catalog.html?cat=boots">Бутсы</a>' +
        '<a href="' + ROOT + 'pages/analogues.html">Аналоги</a>' +
        '<a href="' + ROOT + 'pages/jerseys.html">Футболки</a>' +
        '<a href="' + ROOT + 'pages/catalog.html?cat=training">Тренировочная</a>' +
        '<a href="' + ROOT + 'pages/catalog.html?cat=accessories">Аксессуары</a>' +
        '<a href="' + ROOT + 'pages/catalog.html?cat=gk">Вратарская</a>' +
        '<a href="' + ROOT + 'pages/catalog.html?cat=balls">Мячи</a></div>' +
      '<div class="footer-col"><h4>Коллекции</h4>' +
        '<a href="' + ROOT + 'pages/collections.html?c=speed">SPEED</a>' +
        '<a href="' + ROOT + 'pages/collections.html?c=control">CONTROL</a>' +
        '<a href="' + ROOT + 'pages/collections.html?c=agility">AGILITY</a>' +
        '<a href="' + ROOT + 'pages/collections.html?c=matchday">MATCH DAY</a>' +
        '<a href="' + ROOT + 'pages/collections.html?c=training">TRAINING</a>' +
        '<a href="' + ROOT + 'pages/collections.html?c=street">STREET</a></div>' +
      '<div class="footer-col"><h4>Компания</h4>' +
        '<a href="' + ROOT + 'pages/catalog.html">Каталог</a>' +
        '<a href="' + ROOT + 'pages/leagues.html">Лиги</a>' +
        '<a href="' + ROOT + 'pages/cms.html">Админ-панель</a>' +
        '<a href="' + ROOT + 'pages/customizer.html">Кастомизация</a></div>' +
    '</div>' +
    '<div class="container footer-bottom"><div><div class="legal-note">PHANTOM ONLINE — независимый каталог футбольной экипировки. Мы не являемся официальным ретейлером Nike, adidas, Puma, FIFA, UEFA, Premier League или футбольных клубов и не имеем лицензий на их продукцию. Вся информация о продуктах, брендах и клубах носит ознакомительный характер и может быть заменена владельцем магазина актуальными данными.</div>© ' + new Date().getFullYear() + ' PHANTOM ONLINE. PLAY WITH PURPOSE.</div></div>';

  updateCartBadge();
  setActiveNav();
}

function setActiveNav() {
  const path = (location.pathname.split('/').pop() || 'index.html');
  const active = path === 'index.html' ? 'index' :
    path === 'catalog.html' ? 'catalog' :
    path === 'analogues.html' ? 'analogues' :
    path === 'jerseys.html' ? 'jerseys' :
    path === 'collections.html' ? 'collections' :
    path === 'leagues.html' ? 'leagues' :
    path === 'cms.html' ? 'cms' : '';
  if (!active) return;
  const links = (document.getElementById('main-nav') || document).querySelectorAll('.nav a');
  const map = { index: 0, catalog: 1, analogues: 2, jerseys: 3, collections: 4, leagues: 5, cms: 6 };
  const idx = map[active];
  if (links && links[idx]) links[idx].classList.add('active');
}

function toggleNav() { document.getElementById('main-nav').classList.toggle('open'); }

/* ---------- Инициализация ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderChrome();
  drawerEl = document.getElementById('cart-drawer');
  overlayEl = document.getElementById('drawer-overlay');
});
