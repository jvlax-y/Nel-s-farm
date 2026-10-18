/* script.js — Nel's Farm Cilember */
'use strict';

/* ══════════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════════ */
const WA_NUMBER = '6281234567890';   // ← ganti nomor WA di sini
const SHOPEE_URL = 'https://shopee.co.id/nelsfarm.cilember';
const INITIAL_VISIBLE = 8;           // produk yang ditampilkan sebelum "Lihat Selengkapnya"

/* ══════════════════════════════════════════════════
   PRODUCT DATA
══════════════════════════════════════════════════ */
const PRODUCTS = [
  /* Tanaman & Perkebunan */
  { id: 1,  name: 'Taiwan Beauty',      price: 13000,  unit: null,     category: 'tanaman',    label: 'Tanaman',    img: 'images/taiwan_beauty.png',       available: true },
  { id: 2,  name: 'Cemara Natal',       price: 25000,  unit: null,     category: 'tanaman',    label: 'Tanaman',    img: 'images/cemara_natal.png',        available: true },
  { id: 3,  name: 'Agave Variegata',    price: 30000,  unit: null,     category: 'tanaman',    label: 'Tanaman',    img: 'images/agave_variegata.png',     available: true },
  { id: 4,  name: 'Anggrek Bulan',      price: 40000,  unit: null,     category: 'tanaman',    label: 'Tanaman',    img: 'images/anggrek_bulan.png',       available: true },
  { id: 5,  name: 'Cemara Pua Pua',     price: 17000,  unit: null,     category: 'tanaman',    label: 'Tanaman',    img: 'images/cemara_pua_pua.png',      available: true },
  { id: 6,  name: 'Cemara Inoki Putih', price: 20000,  unit: null,     category: 'tanaman',    label: 'Tanaman',    img: 'images/cemara_inoki_putih.png',  available: true },
  { id: 7,  name: 'Cemara Kipas',       price: 15000,  unit: null,     category: 'tanaman',    label: 'Tanaman',    img: 'images/cemara_kipas.png',        available: true },
  { id: 8,  name: 'Bibit Alpukat',      price: 40000,  unit: null,     category: 'tanaman',    label: 'Perkebunan', img: 'images/bibit_alpukat.png',       available: true },
  /* Peternakan */
  { id: 9,  name: 'Ayam Kampung',       price: 35000,  unit: '/ ekor', category: 'peternakan', label: 'Peternakan', img: 'images/ayam_kampung.png',        available: true },
  { id: 10, name: 'Telur Ayam Segar',   price: 30000,  unit: '/ kg',   category: 'peternakan', label: 'Peternakan', img: 'images/telur_ayam.png',          available: true },
  { id: 11, name: 'Kambing Ternak',     price: null,   unit: null,     category: 'peternakan', label: 'Peternakan', img: 'images/kambing_ternak.png',      available: true,  contactOnly: true },
  /* Perikanan */
  { id: 12, name: 'Ternak Ikan Nila',   price: 25000,  unit: '/ kg',   category: 'perikanan',  label: 'Perikanan',  img: 'images/ikan_nila.png',           available: true },
  { id: 13, name: 'Ternak Ikan Koi',    price: 30000,  unit: '/ ekor', category: 'perikanan',  label: 'Perikanan',  img: 'images/ikan_koi.png',            available: true },
  { id: 14, name: 'Ternak Ikan Lele',   price: 0,      unit: null,     category: 'perikanan',  label: 'Perikanan',  img: 'images/ikan_lele.png',           available: false, comingSoon: true },
];

/* ══════════════════════════════════════════════════
   TESTIMONIALS DATA
══════════════════════════════════════════════════ */
const TESTIMONIALS = [
  {
    name: 'Bpk. Hendra Wijaya',
    location: 'Bogor, Jawa Barat',
    rating: 5,
    text: '"Tanaman Taiwan Beauty dan Cemara Natal datang dalam kondisi sangat segar dan rimbun. Pengemasan sangat rapi dan aman sampai ke rumah! Pasti pesan lagi."',
    initials: 'HW',
  },
  {
    name: 'Ibu Rina Marlina',
    location: 'Jakarta Selatan',
    rating: 5,
    text: '"Telur ayam kampungnya beneran segar, kuning telurnya pekat. Rasanya jauh lebih enak dibandingkan beli di pasar biasa. Sudah jadi langganan tetap Nel\'s Farm!"',
    initials: 'RM',
  },
  {
    name: 'Dr. Dimas Santoso',
    location: 'Tangerang, Banten',
    rating: 5,
    text: '"Pesan bibit alpukat dan ikan koi lewat WhatsApp, respons cepat dan sangat ramah dalam memberi tips perawatan. Ikan koi sehat dan warnanya cerah banget!"',
    initials: 'DS',
  },
];

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
function fmt(n) {
  if (n === null || n === undefined) return 'Hubungi Penjual';
  return 'Rp\u00A0' + n.toLocaleString('id-ID');
}

function stars(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

/* ══════════════════════════════════════════════════
   CART STATE
══════════════════════════════════════════════════ */
let cart = [];

function cartLoad() {
  try { cart = JSON.parse(localStorage.getItem('nfCart') || '[]'); } catch { cart = []; }
}
function cartSave() {
  localStorage.setItem('nfCart', JSON.stringify(cart));
}
function cartAdd(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p || !p.available || p.contactOnly) return;
  const item = cart.find(x => x.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });
  cartSave();
  cartBadgeRefresh();
  cartBodyRefresh();
  cartOpen();
}
function cartQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  cartSave();
  cartBadgeRefresh();
  cartBodyRefresh();
}
function cartBadgeRefresh() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('cart-count');
  if (!el) return;
  el.textContent = total;
  el.classList.toggle('visible', total > 0);
}
function cartBodyRefresh() {
  const body   = document.getElementById('cart-body');
  const footer = document.getElementById('cart-footer');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <p>Keranjangmu masih kosong.<br>Yuk pilih hasil tani segar dulu!</p>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = '';
  let grand = 0;
  let html = '';

  cart.forEach(item => {
    const p   = PRODUCTS.find(x => x.id === item.id);
    if (!p) return;
    const line = (p.price || 0) * item.qty;
    grand += line;
    html += `
      <div class="cart-item">
        <img src="${p.img}" alt="${p.name}" class="cart-item-img" loading="lazy">
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">${fmt(p.price)}${p.unit ? ' ' + p.unit : ''}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="cartQty(${p.id},-1)" aria-label="Kurangi">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="cartQty(${p.id},+1)" aria-label="Tambah">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="cartQty(${p.id},-999)" aria-label="Hapus item">&times;</button>
      </div>`;
  });

  body.innerHTML = html;
  const tv = document.getElementById('cart-total-val');
  if (tv) tv.textContent = fmt(grand);
}
function cartOpen() {
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('open');
  document.getElementById('cart-drawer')?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function cartClose() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.getElementById('cart-drawer')?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
function cartOrder() {
  if (cart.length === 0) return;
  let msg = "Halo Nel's Farm, saya ingin memesan:\n";
  let total = 0;
  cart.forEach(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return;
    const line = (p.price || 0) * item.qty;
    total += line;
    msg += `• ${p.name} x${item.qty} = ${fmt(line)}\n`;
  });
  msg += `\nTotal: ${fmt(total)}\nMohon info ketersediaan dan pengiriman. Terima kasih!`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ══════════════════════════════════════════════════
   PRODUCT CATALOG
══════════════════════════════════════════════════ */
let _activeCategory = 'semua';
let _searchQuery    = '';
let _expanded       = false;

function filteredProducts() {
  return PRODUCTS.filter(p => {
    const catOk    = _activeCategory === 'semua' || p.category === _activeCategory;
    const searchOk = p.name.toLowerCase().includes(_searchQuery.toLowerCase());
    return catOk && searchOk;
  });
}

function renderProducts() {
  const grid  = document.getElementById('product-grid');
  const smWrap = document.getElementById('show-more-wrap');
  const smBtn  = document.getElementById('show-more-btn');
  if (!grid) return;

  const all = filteredProducts();
  const limited  = (_activeCategory === 'semua' && !_searchQuery && !_expanded && all.length > INITIAL_VISIBLE);
  const shown    = limited ? all.slice(0, INITIAL_VISIBLE) : all;

  // Show-more visibility
  if (smWrap) {
    smWrap.style.display = (all.length > INITIAL_VISIBLE && _activeCategory === 'semua' && !_searchQuery) ? '' : 'none';
    if (smBtn) smBtn.textContent = _expanded ? 'Tampilkan Lebih Sedikit' : 'Lihat Selengkapnya';
  }

  if (shown.length === 0) {
    grid.innerHTML = '<p class="no-results">Produk tidak ditemukan. Coba kata kunci lain.</p>';
    return;
  }

  grid.innerHTML = shown.map(p => productCard(p)).join('');
}

function productCard(p) {
  const priceHtml = p.contactOnly
    ? 'Hubungi Penjual'
    : fmt(p.price) + (p.unit ? ` <span class="card-price-unit">${p.unit}</span>` : '');

  let btnLabel, btnAttr;
  if (p.comingSoon) {
    btnLabel = 'Segera Hadir'; btnAttr = 'disabled';
  } else if (p.contactOnly) {
    btnLabel = 'Hubungi Penjual'; btnAttr = `onclick="contactSeller(${p.id})"`;
  } else if (!p.available) {
    btnLabel = 'Tidak Tersedia'; btnAttr = 'disabled';
  } else {
    btnLabel = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Tambah ke Keranjang';
    btnAttr = `onclick="cartAdd(${p.id})"`;
  }

  const imgWrapContent = p.comingSoon
    ? `<img src="${p.img}" alt="${p.name}" class="card-img" loading="lazy">
       <div class="coming-soon-overlay"><span class="coming-soon-label">COMING SOON</span></div>`
    : `<img src="${p.img}" alt="${p.name}" class="card-img" loading="lazy">`;

  return `
    <article class="product-card${p.comingSoon ? ' card-coming-soon' : ''}" role="listitem">
      <div class="card-img-wrap">
        ${imgWrapContent}
        <span class="card-badge">${p.label}</span>
      </div>
      <div class="card-body">
        <h3 class="card-name">${p.name}</h3>
        <div class="card-price">${priceHtml}</div>
        <button class="btn-add-cart" ${btnAttr}>${btnLabel}</button>
      </div>
    </article>`;
}

function contactSeller(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const msg = `Halo Nel's Farm, saya ingin bertanya tentang ${p ? p.name : 'produk Anda'}. Mohon info harga dan ketersediaannya.`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ══════════════════════════════════════════════════
   TESTIMONIALS SLIDER
══════════════════════════════════════════════════ */
let _testiIdx    = 0;
let _testiTimer  = null;
const TESTI_DELAY = 6000; // 6 seconds

function renderTesti() {
  const stage = document.getElementById('testi-stage');
  const dots  = document.getElementById('testi-dots');
  if (!stage || !dots) return;

  const prev = (_testiIdx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
  const next = (_testiIdx + 1) % TESTIMONIALS.length;

  const cardHtml = (t, role) => `
    <div class="testi-card testi-${role}" role="article" tabindex="${role === 'center' ? 0 : -1}"
         ${role !== 'center' ? `onclick="testiGoTo(${role === 'prev' ? prev : next})"` : ''}>
      <div class="testi-stars">${stars(t.rating)}</div>
      <p class="testi-quote">${t.text}</p>
      <div class="testi-author">
        <div class="testi-avatar" aria-hidden="true">${t.initials}</div>
        <div>
          <div class="testi-name">${t.name}</div>
          <div class="testi-meta">${t.location} · Pembeli Terverifikasi</div>
        </div>
      </div>
    </div>`;

  stage.innerHTML =
    cardHtml(TESTIMONIALS[prev], 'prev') +
    cardHtml(TESTIMONIALS[_testiIdx], 'center') +
    cardHtml(TESTIMONIALS[next], 'next');

  dots.innerHTML = TESTIMONIALS.map((_, i) =>
    `<button class="testi-dot${i === _testiIdx ? ' active' : ''}"
             role="tab" aria-selected="${i === _testiIdx}"
             aria-label="Ulasan ${i + 1}"
             onclick="testiGoTo(${i})"></button>`
  ).join('');
}

function testiGoTo(idx) {
  _testiIdx = (idx + TESTIMONIALS.length) % TESTIMONIALS.length;
  renderTesti();
  testiRestartTimer();
}

function testiStartTimer() {
  _testiTimer = setInterval(() => {
    _testiIdx = (_testiIdx + 1) % TESTIMONIALS.length;
    renderTesti();
  }, TESTI_DELAY);
}

function testiStopTimer()   { clearInterval(_testiTimer); _testiTimer = null; }
function testiRestartTimer() { testiStopTimer(); testiStartTimer(); }

/* ══════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════ */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-element').forEach(el => el.classList.add('is-revealed'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal-element').forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════════
   SCROLL-TO-TOP + HEADER SHADOW
══════════════════════════════════════════════════ */
function onScroll() {
  const y = window.scrollY;
  document.getElementById('scroll-top-btn')?.classList.toggle('visible', y > 400);
  document.getElementById('site-header')?.classList.toggle('scrolled', y > 20);

  // Active nav highlight
  const sections = ['beranda','katalog','ulasan','galeri','lokasi'];
  for (const id of [...sections].reverse()) {
    const sec = document.getElementById(id);
    if (!sec) continue;
    if (sec.getBoundingClientRect().top <= 90) {
      document.querySelectorAll('.nav-item').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
      break;
    }
  }
}

/* ══════════════════════════════════════════════════
   MOBILE NAV DRAWER
══════════════════════════════════════════════════ */
function drawerOpen() {
  document.getElementById('mobile-drawer')?.classList.add('open');
  document.getElementById('mobile-overlay')?.classList.add('active');
  document.getElementById('mobile-overlay')?.removeAttribute('aria-hidden');
  document.getElementById('hamburger-btn')?.setAttribute('aria-expanded', 'true');
  document.getElementById('mobile-drawer')?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function drawerClose() {
  document.getElementById('mobile-drawer')?.classList.remove('open');
  document.getElementById('mobile-overlay')?.classList.remove('active');
  document.getElementById('mobile-overlay')?.setAttribute('aria-hidden', 'true');
  document.getElementById('hamburger-btn')?.setAttribute('aria-expanded', 'false');
  document.getElementById('mobile-drawer')?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  cartLoad();
  cartBadgeRefresh();
  cartBodyRefresh();
  renderProducts();
  renderTesti();
  initScrollReveal();
  testiStartTimer();

  /* ─ Filter tabs ─ */
  document.getElementById('filter-tabs')?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-tab');
    if (!btn) return;
    document.querySelectorAll('.filter-tab').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    _activeCategory = btn.dataset.category;
    _expanded = false;
    renderProducts();
  });

  /* ─ Search ─ */
  let _debounce;
  document.getElementById('search-input')?.addEventListener('input', e => {
    clearTimeout(_debounce);
    _debounce = setTimeout(() => {
      _searchQuery = e.target.value.trim();
      _expanded = false;
      renderProducts();
    }, 280);
  });

  /* ─ Show more/less ─ */
  document.getElementById('show-more-btn')?.addEventListener('click', () => {
    _expanded = !_expanded;
    renderProducts();
  });

  /* ─ Cart ─ */
  document.getElementById('cart-btn')?.addEventListener('click', cartOpen);
  document.getElementById('cart-close')?.addEventListener('click', cartClose);
  document.getElementById('cart-overlay')?.addEventListener('click', cartClose);
  document.getElementById('btn-cart-order')?.addEventListener('click', cartOrder);

  /* ─ Mobile drawer ─ */
  document.getElementById('hamburger-btn')?.addEventListener('click', drawerOpen);
  document.getElementById('drawer-close')?.addEventListener('click', drawerClose);
  document.getElementById('mobile-overlay')?.addEventListener('click', drawerClose);
  document.querySelectorAll('[data-close-drawer]').forEach(el =>
    el.addEventListener('click', drawerClose)
  );

  /* ─ Scroll-to-top ─ */
  document.getElementById('scroll-top-btn')?.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  /* ─ Testimonial pause on hover/focus ─ */
  const stage = document.getElementById('testi-stage');
  stage?.addEventListener('mouseenter', testiStopTimer);
  stage?.addEventListener('mouseleave', testiStartTimer);
  stage?.addEventListener('focusin',    testiStopTimer);
  stage?.addEventListener('focusout',   testiStartTimer);

  /* ─ Scroll events ─ */
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial

  /* ─ Keyboard nav for carousel ─ */
  document.addEventListener('keydown', e => {
    if (document.activeElement?.closest('#testi-stage')) {
      if (e.key === 'ArrowRight') testiGoTo(_testiIdx + 1);
      if (e.key === 'ArrowLeft')  testiGoTo(_testiIdx - 1);
    }
    if (e.key === 'Escape') {
      cartClose();
      drawerClose();
    }
  });

  /* ─ Smooth scroll for anchor links ─ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-h') || '80');
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });
});
