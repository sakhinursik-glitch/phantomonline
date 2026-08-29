/* ============================================================================
   PHANTOM ONLINE — Страница кастомизации игровых футболок
   Выбор футболки + кастомизация (имя/номер). Списки редактируются в CMS.
   ============================================================================ */

const custState = { league: 'all', player: 'blank', number: '0', customName: '', customNumber: '' };

const CUST_PLAYERS = [
  { name: 'Без имени', num: '0' },
  { name: 'Ronaldo', num: '7' }, { name: 'Messi', num: '10' },
  { name: 'Haaland', num: '9' }, { name: 'Mbappé', num: '10' },
  { name: 'Salah', num: '11' }, { name: 'De Bruyne', num: '17' },
  { name: 'Bellingham', num: '5' }, { name: 'Vinicius Jr', num: '7' },
  { name: 'Kane', num: '9' }, { name: 'Foden', num: '47' }, { name: 'Saka', num: '7' }
];

function renderCustomizerGrid() {
  const all = Catalog.byCategory('jersey');
  let list = custState.league === 'all' ? all : all.filter(p => p.league === custState.league);

  const bar = document.getElementById('cust-league-bar');
  bar.innerHTML = '<span class="chip' + (custState.league === 'all' ? ' on' : '') + '" style="cursor:pointer" onclick=\'setCustLeague("all")\'>Все лиги</span>' +
    LEAGUES.map(l => '<span class="chip' + (custState.league === l.key ? ' on' : '') + '" data-l="' + l.key + '" style="cursor:pointer" onclick=\'setCustLeague("' + l.key + '")\'>' + l.name + '</span>').join('');

  const grid = document.getElementById('cust-grid');
  const empty = document.getElementById('cust-empty');
  empty.style.display = list.length ? 'none' : 'block';
  grid.innerHTML = list.map((p) => {
    const players = CUST_PLAYERS.map(pl =>
      '<div class="size-opt" style="min-width:auto;height:auto;padding:10px 14px" onclick="pickPlayer(\'' + pl.name.replace(/'/g, "\\'") + '\',\'' + pl.num + '\')">' + pl.name + ' · ' + pl.num + '</div>').join('');
    const sizes = (p.sizes || []).map(s => '<div class="size-opt" onclick="pickCustSize(\'' + p.id + '\',\'' + esc(s) + '\')">' + esc(s) + '</div>').join('');

    return '<article class="product-card" style="padding:20px">' +
      '<div class="thumb" style="aspect-ratio:4/3">' + productImgHTML(p) +
        '<div class="surface-row" style="right:12px;left:auto">' + (p.club ? '<span class="surface-chip">' + esc(p.club) + '</span>' : '') + '</div>' +
      '</div>' +
      '<div class="product-body"><div class="brand-line"><span>' + esc(p.brand) + '</span></div>' +
      '<div class="product-title">' + esc(p.name) + '</div>' +
      '<div class="price-row"><span class="price">' + Catalog.fmt(p.price) + '</span></div></div>' +
      '<div class="customizer"><h4>Имя и номер</h4><div class="customizer-grid">' +
        '<div class="form-field full"><label>Игрок (blank или имя)</label><div class="size-options" style="margin-bottom:0">' + players + '</div></div>' +
        '<div class="form-field"><label>Своё имя</label><input class="fcontrol" placeholder="Custom" oninput="custState.customName=this.value; refreshCustBtn(\'' + p.id + '\')"></div>' +
        '<div class="form-field"><label>Свой номер</label><input class="fcontrol" placeholder="0" oninput="custState.customNumber=this.value; refreshCustBtn(\'' + p.id + '\')"></div>' +
        '<div class="form-field"><label>Размер</label><div class="size-options" style="margin-bottom:0" id="sizes-' + p.id + '">' + sizes + '</div></div>' +
      '</div>' +
      '<button class="btn btn-primary" style="width:100%;margin-top:16px" id="btn-' + p.id + '" onclick="addCustom(' + "'" + p.id + "'" + ')">В корзину</button>' +
      '</div></article>';
  }).join('');
}

function pickCustSize(id, s) { custState['size_' + id] = s; document.querySelectorAll('#sizes-' + id + ' .size-opt').forEach(o => o.classList.toggle('on', o.textContent === s)); }
function pickPlayer(name, num) { custState.player = name; custState.number = num; toast('Игрок: ' + name + ' · ' + num); }
function refreshCustBtn(id) { let el = document.getElementById('btn-' + id); if (el) el.textContent = 'В корзину'; }
function setCustLeague(k) { custState.league = k; renderCustomizerGrid(); }

function addCustom(id) {
  const p = Catalog.getById(id);
  const size = custState['size_' + id] || (p.sizes && p.sizes[0]) || '';
  const player = custState.customName || (custState.player === 'Без имени' ? '' : custState.player) || '';
  const number = custState.customNumber || (custState.number && custState.number !== '0' ? custState.number : '') || '';
  addToCart(id, { size, qty: 1, custom: (player || number) ? { player, number } : null });
}

document.addEventListener('DOMContentLoaded', () => { renderCustomizerGrid(); });
