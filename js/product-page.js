/* ============================================================================
   PHANTOM ONLINE — Страница товара
   ============================================================================ */

let currentProduct = null;
let selectedSize = '';
let detailQty = 1;
const customState = { player: '', number: '', customName: '', customNumber: '' };

const PLAYERS_PRESET = [
  'Без имени (blank)', 'Ronaldo', 'Messi', 'Haaland', 'Mbappé', 'Salah', 'De Bruyne',
  'Bellingham', 'Vinicius Jr', 'Kane', 'Foden', 'Saka'
];
const NUMBERS_PRESET = ['Без номера', '7', '9', '10', '11', '14', '17'];
const SIZES_JERSEYS = ['S','M','L','XL','XXL'];

function getP() { const id = new URLSearchParams(location.search).get('id'); return Catalog.getById(id); }

function renderSpecs(p) {
  const specs = [];
  if (p.brand) specs.push(['Бренд', p.brand]);
  if (p.surface && p.surface.length) specs.push(['Поверхность', p.surface.join(' / ')]);
  if (p.level) specs.push(['Уровень', p.level]);
  if (p.playerProfile) specs.push(['Профиль игрока', p.playerProfile]);
  if (p.generation) specs.push(['Поколение', p.generation]);
  if (p.upper) specs.push(['Верх', p.upper]);
  if (p.soleplate) specs.push(['Подошва', p.soleplate]);
  if (p.material) specs.push(['Материал', p.material]);
  if (p.weight) specs.push(['Вес', p.weight]);
  if (p.fit) specs.push(['Посадка', p.fit]);
  if (p.club) specs.push(['Клуб', p.club]);
  if (p.league) { const l = LEAGUES.find(x => x.key === p.league); if (l) specs.push(['Лига', l.name]); }
  if (p.season) specs.push(['Сезон', p.season]);
  if (p.kind) specs.push(['Тип', p.kind === 'player' ? 'Игровая версия' : p.kind === 'fan' ? 'Фан-версия' : p.kind === 'long-sleeve' ? 'С длинным рукавом' : p.kind]);
  if (p.productType) specs.push(['Тип продукта', p.productType]);
  if (p.subcategory) specs.push(['Категория', p.subcategory]);
  if (p.purpose) specs.push(['Назначение', p.purpose]);
  if (p.stock !== undefined) specs.push(['Наличие', p.stock > 0 ? 'В наличии (' + p.stock + ')' : 'Под заказ']);
  return specs;
}

function starBackground(p) {
  // Полноэкранное фоновое фото игрока за бутсами (не блюрим, не обрезаем).
  // Охватывает FG, AG и IC. Страница живёт в pages/, поэтому путь ../assets/img/.
  const name = (p.name || '').toLowerCase();
  let file = '';
  if (name.indexOf('f50') >= 0) file = 'f50-bg.jpg';
  else if (name.indexOf('predator') >= 0) file = 'predator-bg.jpg';
  else if (name.indexOf('superfly') >= 0) file = 'superfly-bg.jpg';
  else if (name.indexOf('vapor') >= 0) file = 'vapor-bg.jpg';
  else if (name.indexOf('phantom') >= 0) file = 'phantom-bg.jpg';
  else if (name.indexOf('future') >= 0) file = 'future-bg.jpg';
  else if (name.indexOf('ultra') >= 0) file = 'ultra-bg.jpg';
  if (!file) return '';
  return '../assets/img/boots/' + file;
}

function setProductBackdrop(url) {
  var old = document.getElementById('product-backdrop');
  if (old) old.remove();
  if (!url) return;
  var bd = document.createElement('div');
  bd.id = 'product-backdrop';
  bd.innerHTML =
    '<div class="pb-img" style="background:url(' + url + ') center/contain no-repeat"></div>' +
    '<div class="pb-shade"></div>';
  document.body.appendChild(bd);
}

function renderDetail() {
  const p = currentProduct;
  const bg = starBackground(p);
  setProductBackdrop(bg);
  const main = document.getElementById('product-gallery');
  const thumbs = document.getElementById('product-thumbs');
  main.innerHTML = productImgHTML(p);
  thumbs.innerHTML = '<div class="g-thumb">' + productImgHTML(p) + '</div>' +
    '<div class="g-thumb">' + productImgHTML(p) + '</div>';

  document.getElementById('product-name').textContent = p.name;
  document.getElementById('product-brand').textContent = p.brand || 'PHANTOM';
  document.getElementById('product-price').textContent = Catalog.fmt(p.price);
  const oldEl = document.getElementById('product-old');
  if (p.oldPrice) oldEl.innerHTML = '<span class="old-price">' + Catalog.fmt(p.oldPrice) + '</span>' + (p.discount ? '<span class="detail-discount">−' + p.discount + '%</span>' : ''); else oldEl.innerHTML = '';
  document.getElementById('product-desc').textContent = p.description || '';

  document.getElementById('product-crumb').innerHTML = '<a href="../index.html">Главная</a> / <a href="catalog.html">Каталог</a> / <span>' + esc(p.subcategory || p.name) + '</span>';

  let chips = '';
  (p.surface || []).forEach(s => chips += '<span class="detail-chip surface">' + s + ' · ' + (SURFACES[s] ? SURFACES[s].split('—')[0].trim() : '') + '</span>');
  if (p.level) chips += '<span class="detail-chip level">' + p.level + '</span>';
  if (p.category === 'jersey' && p.club) chips += '<span class="detail-chip cat">' + p.club + '</span>';
  if (p.isNew) chips += '<span class="detail-chip" style="background:rgba(34,211,238,.12);color:var(--cyan)">NEW</span>';
  if (p.bestseller) chips += '<span class="detail-chip" style="background:rgba(255,209,102,.14);color:var(--gold)">BESTSELLER</span>';
  document.getElementById('product-chips').innerHTML = chips;

  document.getElementById('product-specs').innerHTML = renderSpecs(p).map(([k, v]) => '<div class="spec-item"><div class="k">' + k + '</div><div class="v">' + esc(v) + '</div></div>').join('');

  // sizes
  const sizesWrap = document.getElementById('product-sizes');
  sizesWrap.innerHTML = p.sizes.map(s => '<div class="size-opt' + (s === selectedSize ? ' on' : '') + '" onclick="pickSize(\'' + esc(s) + '\')">' + esc(s) + '</div>').join('') || '<span class="muted">One size</span>';
  if (!selectedSize && p.sizes && p.sizes.length) selectedSize = p.sizes[0];

  // customizer for jerseys
  renderCustomizer(p);
}

function renderCustomizer(p) {
  const wrap = document.getElementById('product-customizer');
  if (p.category === 'jersey' || p.category === 'retro') {
    wrap.innerHTML = '<div class="customizer"><h4>Кастомизация футболки</h4><div class="customizer-grid">' +
      '<div class="form-field"><label>Игрок</label><select class="fcontrol" onchange="customState.player=this.value">' +
        PLAYERS_PRESET.map(o => '<option' + (o === customState.player ? ' selected' : '') + '>' + o + '</option>').join('') +
      '</select></div>' +
      '<div class="form-field"><label>Номер</label><select class="fcontrol" onchange="customState.number=this.value">' +
        NUMBERS_PRESET.map(o => '<option' + (o === customState.number ? ' selected' : '') + '>' + o + '</option>').join('') +
      '</select></div>' +
      '<div class="form-field"><label>Своё имя</label><input class="fcontrol" placeholder="Custom name" oninput="customState.customName=this.value"></div>' +
      '<div class="form-field"><label>Свой номер</label><input class="fcontrol" placeholder="Custom number" oninput="customState.customNumber=this.value"></div>' +
      '<div class="form-field"><label>Размер футболки</label><select class="fcontrol" onchange="pickSize(this.value)">' +
        SIZES_JERSEYS.map(s => '<option' + (s === selectedSize ? ' selected' : '') + '>' + s + '</option>').join('') +
      '</select></div>' +
    '</div></div>';
  } else { wrap.innerHTML = ''; }
}

function pickSize(s) { selectedSize = s; const p = currentProduct; if (!p) return; document.getElementById('product-sizes').innerHTML = p.sizes.map(x => '<div class="size-opt' + (x === s ? ' on' : '') + '" onclick="pickSize(\'' + esc(x) + '\')">' + esc(x) + '</div>').join(''); }
function changeDetail(_, d) { detailQty = Math.max(1, detailQty + d); document.getElementById('product-qty').textContent = detailQty; }

function buyNow() {
  const p = currentProduct;
  if (!p) return;
  let custom = null;
  if (p.category === 'jersey' || p.category === 'retro') {
    const player = customState.customName || customState.player || '';
    const number = customState.customNumber || customState.number || '';
    if (player || number) custom = { player, number };
  }
  addToCart(p.id, { size: selectedSize || (p.sizes && p.sizes[0]) || '', qty: detailQty, custom });
}

function loadRelated(p) {
  let rel = Catalog.byCategory(p.category).filter(x => x.id !== p.id);
  if (rel.length < 4) { rel = Catalog.getAll().filter(x => x.id !== p.id).concat(rel); }
  document.getElementById('related').innerHTML = rel.slice(0, 4).map(productCard).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  currentProduct = getP();
  if (!currentProduct) { document.querySelector('#product-hero').innerHTML = '<div class="notfound container"><div class="nf">404</div><p>Товар не найден</p><a class="btn btn-primary" href="../index.html">На главную</a></div>'; return; }
  detailQty = 1;
  renderDetail();
  loadRelated(currentProduct);
});
