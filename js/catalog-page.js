/* ============================================================================
   PHANTOM ONLINE — Логика каталога: поиск + фильтры
   ============================================================================ */

const state = {
  search: '', cat: '', brand: '', league: '', surface: '', level: '', size: '', price: 0, sort: 'featured'
};

function pageParams() {
  const q = new URLSearchParams(location.search);
  if (q.get('cat')) state.cat = q.get('cat');
  if (q.get('league')) state.league = q.get('league');
  if (q.get('surf')) state.surface = q.get('surf');
  if (q.get('sort')) state.sort = q.get('sort');
}

function populateBrands() {
  const sel = document.getElementById('f-brand');
  const brands = new Set(Catalog.getAll().map(p => p.brand).filter(Boolean).sort());
  brands.forEach(b => { const o = document.createElement('option'); o.value = b; o.textContent = b; sel.appendChild(o); });
}

function applyFilters() {
  state.search = (document.getElementById('f-search').value || '').toLowerCase().trim();
  state.cat = document.getElementById('f-cat').value;
  state.brand = document.getElementById('f-brand').value;
  state.league = document.getElementById('f-league').value;
  state.surface = document.getElementById('f-surface').value;
  state.level = document.getElementById('f-level').value;
  state.size = (document.getElementById('f-size').value || '').trim().toUpperCase();
  state.price = parseFloat(document.getElementById('f-price').value) || 0;
  state.sort = document.getElementById('f-sort').value;
  renderResults();
}

function renderResults() {
  let list = Catalog.getAll();
  const q = state.search;

  if (q) {
    const tokens = q.split(' ').filter(Boolean);
    list = list.filter(p => {
      const hay = [p.name, p.brand, p.category, p.subcategory, p.productType, p.league, p.club, (p.surface||[]).join(' '), p.level, p.playerProfile, CATEGORIES_META[p.category] ? CATEGORIES_META[p.category].ru : ''].join(' ').toLowerCase();
      const norm = hay.replace(/ё/g, 'е').replace(/бутс/g, 'бутсы');
      return tokens.every(t => {
        const tn = t.replace(/ё/g, 'е');
        return hay.includes(tn) || norm.includes(tn.replace('бутс','бутсы'));
      });
    });
  }
  if (state.cat) list = list.filter(p => p.category === state.cat);
  if (state.brand) list = list.filter(p => p.brand === state.brand);
  if (state.league) list = list.filter(p => p.league === state.league);
  if (state.surface) list = list.filter(p => (p.surface||[]).includes(state.surface));
  if (state.level) list = list.filter(p => p.level === state.level);
  if (state.size) list = list.filter(p => (p.sizes||[]).some(s => s.toUpperCase().includes(state.size)));
  if (state.price) list = list.filter(p => p.price <= state.price);

  if (state.sort === 'new') list = list.filter(p => p.isNew);
  else if (state.sort === 'sale') list = list.filter(p => p.sale);
  else if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else {
    // featured first, then bestsellers
    list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
  }

  const grid = document.getElementById('catalog-grid');
  const empty = document.getElementById('catalog-empty');
  document.getElementById('result-count').textContent = list.length;
  if (list.length) { grid.innerHTML = list.map(productCard).join(''); empty.style.display = 'none'; grid.style.display = 'grid'; }
  else { grid.innerHTML = ''; grid.style.display = 'none'; empty.style.display = 'block'; }
}

function buildChips() {
  const bar = document.getElementById('chip-bar');
  const cats = Object.entries(CATEGORIES_META);
  bar.innerHTML = '<span class="chip' + (state.cat === '' ? ' on' : '') + '" onclick="setChipCat(\'\')">Все</span>' +
    cats.map(([k, m]) => '<span class="chip' + (state.cat === k ? ' on' : '') + '" onclick="setChipCat(\'' + k + '\')">' + m.code + '</span>').join('');
}

function setChipCat(k) { state.cat = k; document.getElementById('f-cat').value = k; renderResults(); buildChips(); }

function resetFilters() {
  state.search = ''; state.cat = pageParamsResolve(); state.brand=''; state.league=''; state.surface=''; state.level=''; state.size=''; state.price=0; state.sort='featured';
  document.getElementById('f-search').value=''; document.getElementById('f-brand').value=''; document.getElementById('f-league').value='';
  document.getElementById('f-surface').value=''; document.getElementById('f-level').value=''; document.getElementById('f-size').value='';
  document.getElementById('f-price').value=''; document.getElementById('f-sort').value='featured';
  const q = new URLSearchParams(location.search);
  document.getElementById('f-cat').value = q.get('cat') || '';
  document.getElementById('f-league').value = q.get('league') || '';
  buildChips(); renderResults();
}
function pageParamsResolve() { const q = new URLSearchParams(location.search); return q.get('cat') || ''; }

document.addEventListener('DOMContentLoaded', () => {
  pageParams();
  populateBrands();
  // set controls from state
  document.getElementById('f-cat').value = state.cat;
  document.getElementById('f-league').value = state.league;
  if (state.surface) document.getElementById('f-surface').value = state.surface;
  if (state.sort) document.getElementById('f-sort').value = state.sort;
  buildChips();
  renderResults();
});
