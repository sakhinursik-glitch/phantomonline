/* ============================================================================
   PHANTOM ONLINE — API Adapter (optional, non-breaking)
   This script connects the frontend to the REST API backend.
   It overrides Catalog, cart, and checkout functions to use the API,
   falling back to the original localStorage behavior if the API is unavailable.

   USAGE: Add <script src="../js/api-adapter.js"></script> AFTER ui.js in HTML files.
   If the backend is unreachable, everything works as before (localStorage).
   ============================================================================ */

(function () {
  'use strict';

  const API = (typeof PHANTOM_API_URL !== 'undefined' ? PHANTOM_API_URL : 'http://localhost:3000/api');
  let authToken = localStorage.getItem('phantom_auth_token') || null;
  let currentUser = null;
  let apiAvailable = false;

  /* ---------- Auth helpers ---------- */
  function headers() {
    const h = { 'Content-Type': 'application/json' };
    if (authToken) h['Authorization'] = 'Bearer ' + authToken;
    return h;
  }

  async function apiFetch(path, opts = {}) {
    try {
      const res = await fetch(API + path, { headers: headers(), ...opts });
      const data = await res.json();
      if (!res.ok) throw { status: res.status, message: data.error || 'Ошибка сервера', data };
      return data;
    } catch (err) {
      if (err.status === 401) { logout(); }
      throw err;
    }
  }

  /* ---------- Auth API ---------- */
  async function register(name, email, password) {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    authToken = data.token;
    currentUser = data.user;
    localStorage.setItem('phantom_auth_token', authToken);
    localStorage.setItem('phantom_user', JSON.stringify(currentUser));
    updateAuthUI();
    return data;
  }

  async function login(email, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    authToken = data.token;
    currentUser = data.user;
    localStorage.setItem('phantom_auth_token', authToken);
    localStorage.setItem('phantom_user', JSON.stringify(currentUser));
    updateAuthUI();
    return data;
  }

  function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('phantom_auth_token');
    localStorage.removeItem('phantom_user');
    updateAuthUI();
  }

  function getUser() {
    if (currentUser) return currentUser;
    try {
      currentUser = JSON.parse(localStorage.getItem('phantom_user') || 'null');
    } catch (e) { currentUser = null; }
    return currentUser;
  }

  /* ---------- Cart API (overrides) ---------- */
  async function fetchCart() {
    if (!authToken) {
      // Fall back to localStorage cart
      return { items: getCart(), total: cartTotal(getCart()), count: getCart().reduce((s, x) => s + x.qty, 0) };
    }
    try {
      return await apiFetch('/cart');
    } catch (e) {
      return { items: getCart(), total: cartTotal(getCart()), count: getCart().reduce((s, x) => s + x.qty, 0) };
    }
  }

  async function apiAddToCart(id, opts) {
    if (!authToken) { addToCart(id, opts); return; }
    try {
      const data = await apiFetch('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId: id, size: opts?.size, qty: opts?.qty || 1, custom: opts?.custom }),
      });
      updateCartBadgeFromCount(data.count);
      toast('Добавлено в корзину ✓');
      openDrawer();
    } catch (e) {
      addToCart(id, opts); // fallback
    }
  }

  async function apiRemoveFromCart(itemId) {
    if (!authToken) { removeFromCart(itemId); return; }
    try {
      const data = await apiFetch('/cart/' + itemId, { method: 'DELETE' });
      renderCart();
      updateCartBadgeFromCount(data.count);
    } catch (e) { removeFromCart(itemId); }
  }

  async function apiChangeQty(itemId, delta) {
    if (!authToken) { changeQty(itemId, delta); return; }
    try {
      const cart = await fetchCart();
      const item = cart.items.find(x => x.id === itemId);
      if (!item) return;
      const newQty = Math.max(1, item.qty + delta);
      const data = await apiFetch('/cart/' + itemId, {
        method: 'PUT',
        body: JSON.stringify({ qty: newQty }),
      });
      renderCart();
      updateCartBadgeFromCount(data.count);
    } catch (e) { changeQty(itemId, delta); }
  }

  function updateCartBadgeFromCount(count) {
    const el = document.getElementById('cart-count');
    if (el) el.textContent = count;
  }

  /* ---------- Checkout API (overrides) ---------- */
  async function apiPlaceOrder() {
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

    submitting = true;
    const btn = document.querySelector('#checkout-form button[type="submit"]');
    if (btn) btn.disabled = true;

    if (authToken) {
      try {
        const orderData = {
          name, phone, city, address,
          delivery: delivery.name,
          deliveryFee: delivery.fee,
          comment,
          payment: PAY.system + ' · ' + PAY.card,
          items: cart.map(c => ({ id: c.id, name: c.name, brand: c.brand, price: c.price, size: c.size, qty: c.qty, custom: c.custom })),
        };
        const result = await apiFetch('/orders', { method: 'POST', body: JSON.stringify(orderData) });
        const order = result.order;
        showOrderSuccess(order);
        localStorage.setItem('phantom_orders', JSON.stringify([order, ...JSON.parse(localStorage.getItem('phantom_orders') || '[]')]));
        saveCart([]);
        return;
      } catch (e) {
        console.error('API order failed, falling back to Formspree:', e);
      }
    }

    // Fallback: original Formspree flow
    placeOrder();
  }

  function showOrderSuccess(order) {
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

  /* ---------- Auth UI ---------- */
  function updateAuthUI() {
    const user = getUser();
    const authArea = document.getElementById('auth-area');
    if (!authArea) return;

    if (user) {
      authArea.innerHTML =
        '<span class="auth-user">' + esc(user.name) + '</span>' +
        (user.role === 'admin' ? '<a class="btn btn-ghost btn-sm" href="' + ROOT + 'pages/cms.html">Админ</a>' : '') +
        '<button class="btn btn-ghost btn-sm" onclick="window.__phantomAdapter.logout()">Выйти</button>';
    } else {
      authArea.innerHTML =
        '<button class="btn btn-ghost btn-sm" onclick="window.__phantomAdapter.showAuthModal(\'login\')">Вход</button>' +
        '<button class="btn btn-primary btn-sm" onclick="window.__phantomAdapter.showAuthModal(\'register\')">Регистрация</button>';
    }
  }

  function showAuthModal(mode) {
    const existing = document.getElementById('auth-modal');
    if (existing) existing.remove();

    const isLogin = mode === 'login';
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px)';
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    modal.innerHTML =
      '<div style="background:var(--surface,#16171d);border:1px solid var(--border,#262730);border-radius:16px;padding:32px;max-width:400px;width:90%">' +
        '<h3 style="margin:0 0 20px">' + (isLogin ? 'Вход' : 'Регистрация') + '</h3>' +
        '<form id="auth-form">' +
          (!isLogin ? '<div class="form-field"><label>Имя</label><input class="fcontrol" id="auth-name" placeholder="Ваше имя" required></div>' : '') +
          '<div class="form-field"><label>Email</label><input class="fcontrol" id="auth-email" type="email" placeholder="email@example.com" required></div>' +
          '<div class="form-field"><label>Пароль</label><input class="fcontrol" id="auth-pass" type="password" placeholder="Минимум 6 символов" required></div>' +
          '<div id="auth-error" style="color:#ef4444;margin:8px 0;display:none"></div>' +
          '<button type="submit" class="btn btn-primary" style="width:100%;margin-top:8px">' + (isLogin ? 'Войти' : 'Зарегистрироваться') + '</button>' +
          '<p style="text-align:center;margin:12px 0 0;font-size:.85rem;color:var(--muted,#888)">' +
            (isLogin ? 'Нет аккаунта? <a href="#" onclick="window.__phantomAdapter.showAuthModal(\'register\');return false" style="color:var(--cyan)">Регистрация</a>' :
             'Есть аккаунт? <a href="#" onclick="window.__phantomAdapter.showAuthModal(\'login\');return false" style="color:var(--cyan)">Вход</a>') +
          '</p>' +
        '</form>' +
      '</div>';

    document.body.appendChild(modal);
    modal.querySelector('#auth-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const errEl = document.getElementById('auth-error');
      errEl.style.display = 'none';
      try {
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-pass').value;
        if (isLogin) {
          await login(email, password);
        } else {
          const name = document.getElementById('auth-name').value.trim();
          await register(name, email, password);
        }
        modal.remove();
        toast(isLogin ? 'Добро пожаловать!' : 'Регистрация прошла успешно!');
      } catch (err) {
        errEl.textContent = err.message || 'Ошибка';
        errEl.style.display = 'block';
      }
    });
  }

  /* ---------- Init: override globals ---------- */
  function init() {
    // Patch header to add auth area
    const header = document.getElementById('site-header');
    if (header) {
      // Add auth-area div to header-tools if not present
      const existing = document.getElementById('auth-area');
      if (!existing) {
        const tools = header.querySelector('.header-tools');
        if (tools) {
          const authDiv = document.createElement('div');
          authDiv.id = 'auth-area';
          authDiv.className = 'auth-area';
          authDiv.style.cssText = 'display:flex;align-items:center;gap:8px;margin-left:8px';
          tools.appendChild(authDiv);
        }
      }
    }

    // Override global functions
    if (typeof window !== 'undefined') {
      const origAddToCart = window.addToCart;
      window.addToCart = function (id, opts) {
        if (authToken) apiAddToCart(id, opts);
        else origAddToCart(id, opts);
      };

      if (typeof window.removeFromCart !== 'undefined') {
        const origRemove = window.removeFromCart;
        window.removeFromCart = function (i) {
          if (authToken) apiRemoveFromCart(i);
          else origRemove(i);
        };
      }

      if (typeof window.changeQty !== 'undefined') {
        const origChangeQty = window.changeQty;
        window.changeQty = function (i, d) {
          if (authToken) apiChangeQty(i, d);
          else origChangeQty(i, d);
        };
      }
    }

    // Check API availability
    fetch(API + '/health')
      .then(r => { if (r.ok) apiAvailable = true; })
      .catch(() => {});

    updateAuthUI();
  }

  // Expose for external use
  window.__phantomAdapter = {
    register, login, logout, getUser, fetchCart,
    showAuthModal, isApiAvailable: () => apiAvailable,
  };

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
