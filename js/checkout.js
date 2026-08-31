/* ============================================================================
   PHANTOM ONLINE — Оформление заказа (checkout)
   Отдельная страница: контакты, доставка, оплата картой, итог.
   ============================================================================ */

/* Реквизиты приёма оплаты (карта продавца) — меняются здесь в одном месте */
const PAY = {
  card: '4400 4300 6678 6242',
  system: 'Kaspi Gold',
  holder: 'Nursultan Sakhi',
  note: 'Переведите сумму на карту ниже и отправьте подтверждение перевода в комментарии к заказу.'
};

/* Куда слать заказы + контакт для связи с покупателем */
const FORMSPREE = 'https://formspree.io/f/xyeykdoj';   // ID формы: xyeykdoj
const STORE = {
  whatsapp: '+7 771 259 8932',  // Ваш WhatsApp для связи с клиентом
  minOrderGapMs: 120000        // мин. пауза между заказами с одного устройства (120 сек)
};

const DELIVERY = [
  { key: 'courier', name: 'Курьер по городу', fee: 2000 },
  { key: 'pickup', name: 'Самовывоз из магазина', fee: 0 }
];

function orderItemsHTML() {
  const cart = getCart();
  return cart.map((c, i) => {
    const p = Catalog.getById(c.id) || c;
    const custom = c.custom ? ' · ' + esc(c.custom.player || '') + (c.custom.number ? ' ' + c.custom.number : '') : '';
    return '<div class="oi-item">' +
      '<div class="oi-img" style="overflow:hidden">' + productImgHTML(p) + '</div>' +
      '<div class="oi-info"><div class="oi-name">' + esc(c.name) + '</div>' +
      '<div class="oi-meta">' + esc(c.brand || '') + (c.size ? ' · размер ' + esc(c.size) : '') + custom + ' · ' + c.qty + ' шт.</div></div>' +
      '<div class="oi-price">' + Catalog.fmt(c.price * c.qty) + '</div></div>';
  }).join('');
}

function renderOrderSummary() {
  const box = document.getElementById('co-summary');
  const cart = getCart();
  if (!cart.length) { if (box) box.innerHTML = ''; return; }
  const subtotal = cartTotal(cart);
  let fee = 0;
  const dEl = document.querySelector('input[name="delivery"]:checked');
  if (dEl) { const d = DELIVERY.find(x => x.key === dEl.value); if (d) fee = d.fee; }
  box.innerHTML =
    '<div class="co-summary-head"><h2>Ваш заказ</h2>' +
    '<a class="co-edit" href="' + ROOT + 'pages/catalog.html">изменить</a></div>' +
    orderItemsHTML() +
    '<div class="co-totals">' +
      '<div class="co-row"><span>Товары</span><span>' + Catalog.fmt(subtotal) + '</span></div>' +
      '<div class="co-row" id="co-delivery-row"><span>Доставка</span><span id="co-delivery-fee">' + Catalog.fmt(fee) + '</span></div>' +
      '<div class="co-row co-grand"><span>Итого</span><span id="co-grand">' + Catalog.fmt(subtotal + fee) + '</span></div>' +
    '</div>';
}

function recalcSummary() { renderOrderSummary(); }

function sendOrderToFormspree(order) {
  const itemsText = order.items.map(c =>
    '- ' + c.name + (c.size ? ' (р-р ' + c.size + ')' : '') +
    (c.custom && c.custom.player ? ' (' + c.custom.player + (c.custom.number ? ' ' + c.custom.number : '') + ')' : '') +
    ' x' + c.qty + ' = ' + Catalog.fmt(c.price * c.qty)
  ).join('\n');

  const data = {
    'Заказ №': order.id,
    'Дата': order.date,
    'Имя': order.name,
    'Телефон': order.phone,
    'Город': order.city,
    'Адрес': order.address,
    'Доставка': order.delivery,
    'Комментарий': order.comment,
    'Оплата': order.payment,
    'Состав': itemsText,
    'Итого': Catalog.fmt(order.total),
    'Сумма товаров': Catalog.fmt(order.subtotal)
  };
  const body = new URLSearchParams(Object.assign({}, data, { _subject: 'Новый заказ ' + order.id + ' — PHANTOM ONLINE' })).toString();

  fetch(FORMSPREE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
    body: body
  }).catch(() => {});
}

let submitting = false;

function placeOrder() {
  if (submitting) return;
  const cart = getCart();
  if (!cart.length) { toast('Корзина пуста'); return; }

  const name = document.getElementById('co-name').value.trim();
  const phone = document.getElementById('co-phone').value.trim();
  const city = document.getElementById('co-city').value.trim();
  const address = document.getElementById('co-address').value.trim();
  const dEl = document.querySelector('input[name="delivery"]:checked');
  const delivery = dEl ? DELIVERY.find(x => x.key === dEl.value) : DELIVERY[0];
  const comment = document.getElementById('co-comment').value.trim();

  if (!name) { toast('Укажите имя'); document.getElementById('co-name').focus(); return; }
  if (!phone) { toast('Укажите телефон'); document.getElementById('co-phone').focus(); return; }
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) { toast('Проверьте номер телефона'); document.getElementById('co-phone').focus(); return; }
  if (delivery.key === 'courier' && (!city || !address)) { toast('Укажите город и адрес доставки'); return; }

  // Защита от повторного/случайного нажатия и спама с одного устройства
  const now = Date.now();
  const lastOrderAt = parseInt(localStorage.getItem('phantom_last_order_at') || '0', 10);
  if (now - lastOrderAt < STORE.minOrderGapMs) {
    toast('Заказ уже отправлен. Подождите пару минут и повторите.');
    return;
  }
  submitting = true;
  localStorage.setItem('phantom_last_order_at', String(now));
  const btn = document.querySelector('#checkout-form button[type="submit"]');
  if (btn) btn.disabled = true;

  const subtotal = cartTotal(cart);
  const fee = delivery.fee;
  const order = {
    id: 'PH-' + Date.now().toString().slice(-6),
    date: new Date().toLocaleDateString('ru-RU'),
    name: name, phone: phone, city: city, address: address,
    delivery: delivery.name, deliveryFee: fee,
    comment: comment,
    payment: PAY.system + ' · ' + PAY.card,
    items: cart, subtotal: subtotal, total: subtotal + fee
  };

  let prev = []; try { prev = JSON.parse(localStorage.getItem('phantom_orders') || '[]'); } catch (e) {}
  prev.unshift(order);
  localStorage.setItem('phantom_orders', JSON.stringify(prev));
  saveCart([]);
  updateCartBadge();
  sendOrderToFormspree(order);

  const wrap = document.getElementById('checkout-wrap');
  const success = document.getElementById('checkout-success');
  const head = document.getElementById('checkout-head');
  const sect = document.getElementById('checkout-section');
  if (wrap) wrap.style.display = 'none';
  if (head) head.style.display = 'none';
  if (sect) sect.style.display = 'none';
  if (success) {
    document.getElementById('su-order').textContent = order.id;
    document.getElementById('su-total').textContent = Catalog.fmt(order.total);
    document.getElementById('su-card').textContent = PAY.system + ' ' + PAY.card;
    document.getElementById('su-holder').textContent = PAY.holder;
    const wa = document.getElementById('su-wa');
    if (wa) {
      const clean = STORE.whatsapp.replace(/[^0-9]/g, '');
      wa.innerHTML = 'Для подтверждения напишите нам: <a class="su-wa-link" href="https://wa.me/' + clean + '" target="_blank" rel="noopener">WhatsApp ' + esc(STORE.whatsapp) + '</a>';
    }
    success.style.display = 'block';
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  const cart = getCart();
  const wrap = document.getElementById('checkout-wrap');
  const empty = document.getElementById('checkout-empty');
  if (!cart.length) {
    if (wrap) wrap.style.display = 'none';
    if (empty) empty.style.display = 'block';
    return;
  }

  const pays = document.getElementById('co-card-req');
  if (pays) {
    pays.innerHTML =
      '<div class="pay-card">' +
        '<div class="pay-bank">' + esc(PAY.system) + '</div>' +
        '<div class="pay-number">' + esc(PAY.card) + '</div>' +
        '<div class="pay-holder">' + esc(PAY.holder) + '</div>' +
      '</div>' +
      '<p class="pay-note">' + esc(PAY.note) + '</p>';
  }

  const dList = document.getElementById('co-delivery-list');
  if (dList) {
    dList.innerHTML = DELIVERY.map((d, i) =>
      '<label class="co-radio">' +
        '<input type="radio" name="delivery" value="' + d.key + '" onchange="recalcSummary()"' + (i === 0 ? ' checked' : '') + '>' +
        '<div><div class="cr-name">' + esc(d.name) + '</div>' +
        '<div class="cr-fee">' + (d.fee ? Catalog.fmt(d.fee) : 'Бесплатно') + '</div></div>' +
      '</label>').join('');
  }

  renderOrderSummary();
});
