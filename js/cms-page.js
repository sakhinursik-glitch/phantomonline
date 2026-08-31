/* ============================================================================
   PHANTOM ONLINE — CMS панель
   Правки сохраняются в localStorage. Гибкая модель: массив override-объектов.
   ============================================================================ */

/* ---------- Защита админки простым паролем ----------
   Пароль по умолчанию: phantom2026
   Чтобы сменить — задай новый пароль в ADMIN_PASS (для локального открытия)
   и замени ADMIN_HASH новым SHA-256. На опубликованном сайте (https)
   проверка идёт по хешу, что скрывает пароль из исходника.
   Это защита от случайных людей, а НЕ от хакеров (статический сайт). */
const ADMIN_PASS = 'phantom2026';
const ADMIN_HASH = 'd083e22d890f85c31477435d4e75a7aafed5c1d309b020e3fd7278c479e5f01e'; // sha256('phantom2026')
const ADMIN_TS = 'phantom_admin_at';

async function sha256(str) {
  if (window.crypto && crypto.subtle) {
    const data = new TextEncoder().encode(str);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return null; // нет WebCrypto (напр. file://) — fallback ниже
}

async function adminCheck(pass) {
  const h = await sha256(pass);
  if (h) return h === ADMIN_HASH;
  return pass === ADMIN_PASS; // локальный fallback
}

function adminSession() {
  const saved = localStorage.getItem(ADMIN_TS) || 0;
  return (Date.now() - saved) < (12 * 60 * 60 * 1000); // 12 часов
}

async function adminLogin() {
  const input = document.getElementById('admin-pass');
  const err = document.getElementById('admin-err');
  const pass = input ? input.value : '';
  if (await adminCheck(pass)) {
    localStorage.setItem(ADMIN_TS, String(Date.now()));
    err.textContent = '';
    showAdminPanel();
  } else {
    err.textContent = 'Неверный пароль';
    if (input) input.value = '';
  }
}

function adminLogout() {
  localStorage.removeItem(ADMIN_TS);
  document.getElementById('admin-panel').style.display = 'none';
  document.getElementById('admin-login').style.display = 'block';
}

function showAdminPanel() {
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'block';
  showView('list');
}

let editionId = null;

function getOverrides() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch(e) { return []; } }
function setOverrides(o) { localStorage.setItem(STORAGE_KEY, JSON.stringify(o)); }

function showView(v) {
  document.querySelectorAll('.cms-side a').forEach(a => a.classList.remove('on'));
  if (v === 'list') { document.querySelectorAll('.cms-side a')[0].classList.add('on'); renderList(); }
  else if (v === 'add') { document.querySelectorAll('.cms-side a')[1].classList.add('on'); editionId = null; renderForm({}); }
}

function renderList() {
  const all = Catalog.getAll().slice(); //  copy (includes overrides)
  const over = getOverrides();
  const root = document.getElementById('cms-view');
  root.innerHTML =
    '<div class="table-wrap"><table class="table"><thead><tr>' +
    '<th>Товар</th><th>Бренд</th><th>Категория</th><th>Цена</th><th>Скидка</th><th>NEW</th><th>Хит</th><th>SALE</th><th>Действия</th></tr></thead>' +
    '<tbody>' + all.map(p => {
      const edited = over.some(o => o.id === p.id) ? '<span style="color:var(--lime)">·</span>' : '';
      return '<tr>' +
        '<td><b>' + esc(p.name) + '</b>' + edited + '<div class="faint" style="font-size:.75rem">' + esc(p.id) + '</div></td>' +
        '<td>' + esc(p.brand || '—') + '</td>' +
        '<td>' + esc(CATEGORIES_META[p.category] ? CATEGORIES_META[p.category].ru : p.category) + '</td>' +
        '<td>' + Catalog.fmt(p.price) + '</td>' +
        '<td>' + (p.discount ? p.discount + '%' : '—') + '</td>' +
        '<td>' + (p.isNew ? '✓' : '') + '</td>' +
        '<td>' + (p.bestseller ? '✓' : '') + '</td>' +
        '<td>' + (p.sale ? '✓' : '') + '</td>' +
        '<td><div class="cms-actions">' +
          '<button onclick="startEdit(\'' + esc(p.id) + '\')">Изменить</button>' +
          '<button class="del" onclick="deleteProduct(\'' + esc(p.id) + '\')">Удал.</button>' +
        '</div></td></tr>';
    }).join('') + '</tbody></table></div>';
}

function startEdit(id) {
  editionId = id;
  const p = Catalog.getById(id);
  document.querySelectorAll('.cms-side a').forEach((a, i) => a.classList.toggle('on', i === 0));
  renderForm(p);
  document.getElementById('cms-view').scrollIntoView({ behavior: 'smooth' });
}

const FORM_FIELDS = [
  ['name','Название','text'],['brand','Бренд','text'],['category','Категория (категория)','select-cat'],
  ['subcategory','Подкатегория','text'],['productType','Тип продукта','text'],
  ['league','Лига','select-league'],['club','Клуб','text'],['season','Сезон','text'],['kind','Тип футболки (player/fan/long-sleeve)','text'],
  ['price','Цена ₸','number'],['oldPrice','Старая цена (0 = нет)','number'],['discount','Скидка %','number'],
  ['sizes','Размеры (через запятую)','text'],['surface','Поверхность (через запятую)','text'],
  ['level','Уровень (ELITE/PRO/ACADEMY/ENTRY)','text'],['playerProfile','Профиль игрока','text'],
  ['material','Материал','text'],['weight','Вес','text'],['fit','Посадка','text'],['upper','Верх','text'],
  ['soleplate','Подошва','text'],['generation','Поколение','text'],['purpose','Назначение','text'],
  ['image','Иконка/эмодзи','text'],['stock','Наличие (кол-во)','number'],
  ['featured','Показывать (featured)','checkbox'],['bestseller','Хит (bestseller)','checkbox'],
  ['isNew','Новинка (new)','checkbox'],['sale','Скидка (sale)','checkbox'],
  ['collection','Коллекция (speed/control/agility/matchday/training/street)','text'],
  ['description','Описание','textarea']
];

function renderForm(p) {
  const isEdit = !!editionId;
  const root = document.getElementById('cms-view');
  root.innerHTML = '<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:26px">' +
    '<h3 style="margin-bottom:22px">' + (isEdit ? 'Редактирование: ' + esc(p.name) : 'Новый товар') + '</h3>' +
    '<div class="form-grid">' +
    FORM_FIELDS.map(([key, label, type]) => {
      let val = p[key];
      let input = '';
      if (type === 'textarea') { input = '<textarea class="fcontrol" data-f="' + key + '" rows="3">' + esc(val || '') + '</textarea>'; }
      else if (type === 'checkbox') { input = '<label style="display:flex;align-items:center;gap:8px;font-size:.9rem"><input type="checkbox" data-f="' + key + '"' + (val ? ' checked' : '') + '> Да</label>'; }
      else if (type === 'select-cat') {
        input = '<select class="fcontrol" data-f="' + key + '">' + Object.entries(CATEGORIES_META).map(([k, m]) => '<option value="' + k + '"' + (val === k ? ' selected' : '') + '>' + m.ru + '</option>').join('') + '</select>';
      }
      else if (type === 'select-league') {
        input = '<select class="fcontrol" data-f="' + key + '"><option value="">— нет —</option>' + LEAGUES.map(l => '<option value="' + l.key + '"' + (val === l.key ? ' selected' : '') + '>' + l.name + '</option>').join('') + '</select>';
      }
      else { input = '<input class="fcontrol" type="' + (type === 'number' ? 'number' : 'text') + '" data-f="' + key + '" value="' + esc(val || '') + '">'; }
      const full = (key === 'description') ? ' full' : '';
      return '<div class="form-field' + full + '"><label>' + label + '</label>' + input + '</div>';
    }).join('') +
    '</div>' +
    '<div style="display:flex;gap:12px;margin-top:22px">' +
      '<button class="btn btn-primary" onclick="saveEdit()">Сохранить</button>' +
      '<button class="btn btn-ghost" onclick="showView(\'list\')">Отмена</button>' +
      (isEdit ? '<button class="btn btn-dark" style="margin-left:auto" onclick="duplicateProduct()">Дублировать</button>' : '') +
    '</div></div>';
}

function collectForm() {
  const root = document.getElementById('cms-view');
  const data = {};
  root.querySelectorAll('[data-f]').forEach(el => {
    const key = el.dataset.f;
    if (el.type === 'checkbox') { data[key] = el.checked; }
    else if (key === 'price' || key === 'oldPrice' || key === 'discount' || key === 'stock') { data[key] = el.value ? parseFloat(el.value) : (key === 'price' ? 0 : null); }
    else { data[key] = el.value.trim(); }
  });
  // parse arrays
  ['sizes','surface'].forEach(k => {
    if (data[k]) data[k] = data[k].split(',').map(s => s.trim()).filter(Boolean);
  });
  if (data.oldPrice === 0 || data.oldPrice === null) delete data.oldPrice;
  if (!data.category) data.category = 'accessories';
  return data;
}

function saveEdit() {
  const over = getOverrides();
  const data = collectForm();
  const obj = editionId ? Object.assign(Catalog.getById(editionId), data) : Object.assign(Object.assign({}, data), { id: 'custom-' + Date.now() });
  const idx = over.findIndex(o => o.id === obj.id);
  if (idx >= 0) over[idx] = obj; else over.push(obj);
  setOverrides(over);
  toast('Сохранено ✓');
  showView('list');
}

function duplicateProduct() {
  if (!editionId) return;
  const p = Catalog.getById(editionId);
  const copy = Object.assign({}, p, { id: p.id + '-copy-' + Date.now(), name: p.name + ' (копия)' });
  const over = getOverrides(); over.push(copy); setOverrides(over);
  toast('Создана копия');
  showView('list');
}

function deleteProduct(id) {
  const over = getOverrides();
  if (!over.some(o => o.id === id)) {
    // hardcode-удаление нет — вместо этого пометим как 'deleted'
    over.push({ id, _deleted: true });
  } else {
    // удалить override (тем самым вернуть исходный)
    const i = over.findIndex(o => o.id === id);
    over.splice(i, 1);
  }
  setOverrides(over);
  toast('Обновлено');
  renderList();
}

function resetAll() {
  if (!confirm('Сбросить ВСЕ изменения к исходному каталогу?')) return;
  localStorage.removeItem(STORAGE_KEY);
  toast('Каталог сброшен');
  showView('list');
}

document.addEventListener('DOMContentLoaded', () => {
  if (adminSession()) showAdminPanel();
  else {
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
  }
});
