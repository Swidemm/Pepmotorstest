/* ===== PEP MOTORS — MAIN JS ===== */

// ---- Navbar scroll effect ----
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ---- Mobile menu ----
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
}

// ---- Active nav link ----
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.navbar-links a').forEach(link => {
  if (link.getAttribute('href') === currentPath) link.classList.add('active');
});

// ---- Toast system ----
window.showToast = function(message, type = 'info', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    warning: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span class="toast-text">${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'none';
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

// ---- Format price ARS ----
window.formatPrice = function(n) {
  if (!n && n !== 0) return '—';
  return '$' + Number(n).toLocaleString('es-AR');
};

// ---- Format km ----
window.formatKm = function(n) {
  if (n === 0) return '0 km';
  return Number(n).toLocaleString('es-AR') + ' km';
};

// ---- Favorites (localStorage) ----
window.Favorites = {
  get() { return JSON.parse(localStorage.getItem('pep_favs') || '[]'); },
  toggle(id) {
    const favs = this.get();
    const idx = favs.indexOf(id);
    if (idx === -1) favs.push(id);
    else favs.splice(idx, 1);
    localStorage.setItem('pep_favs', JSON.stringify(favs));
    return idx === -1;
  },
  has(id) { return this.get().includes(id); }
};

// ---- Vehicle card HTML ----
window.buildVehicleCard = function(v) {
  const isFav = Favorites.has(v.id);
  const badgeClass = v.condicion === '0km' ? 'badge-0km' : 'badge-usado';
  const badgeText = v.condicion === '0km' ? '0KM' : 'USADO';
  const imgHtml = v.fotos && v.fotos.length
    ? `<img src="${v.fotos[v.foto_principal || 0]}" alt="${v.marca} ${v.modelo}" loading="lazy">`
    : `<div class="vehicle-card-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
        <span style="font-size:12px">Sin foto</span>
      </div>`;

  return `
    <div class="vehicle-card" onclick="window.location.href='vehiculo.html?id=${v.id}'">
      <div class="vehicle-card-img">
        ${imgHtml}
        <span class="badge ${badgeClass}">${badgeText}</span>
        <button class="btn-fav ${isFav ? 'active' : ''}" data-id="${v.id}" onclick="event.stopPropagation(); toggleFav(this, '${v.id}')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        </button>
      </div>
      <div class="vehicle-card-body">
        <p class="vehicle-card-brand">${v.marca}</p>
        <h3 class="vehicle-card-name">${v.modelo}</h3>
        <p class="vehicle-card-version">${v.version}</p>
        <div class="vehicle-card-specs">
          <span class="vehicle-card-spec">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${v.anio}
          </span>
          <span class="vehicle-card-spec">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
            ${v.combustible}
          </span>
          <span class="vehicle-card-spec">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
            ${formatKm(v.km)}
          </span>
        </div>
        <div class="vehicle-card-footer">
          <span class="vehicle-card-price">${formatPrice(v.precio)}</span>
          <a href="vehiculo.html?id=${v.id}" class="btn btn-primary btn-sm" onclick="event.stopPropagation()">Ver más</a>
        </div>
      </div>
    </div>`;
};

window.toggleFav = function(btn, id) {
  const added = Favorites.toggle(id);
  const svg = btn.querySelector('svg');
  btn.classList.toggle('active', added);
  if (svg) svg.setAttribute('fill', added ? 'currentColor' : 'none');
  showToast(added ? 'Agregado a favoritos' : 'Eliminado de favoritos', added ? 'success' : 'info', 2000);
};

// ---- Counter animation ----
window.animateCounter = function(el, target, duration = 1800) {
  const start = performance.now();
  const startVal = 0;
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(startVal + (target - startVal) * ease).toLocaleString('es-AR');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

// ---- IntersectionObserver for counters ----
window.initCounters = function() {
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target, parseInt(e.target.dataset.counter));
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
};

// ---- Modal helpers ----
window.openModal = function(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
};

window.closeModal = function(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
};

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
  if (e.target.closest('[data-modal-close]')) {
    const modal = e.target.closest('.modal-overlay');
    if (modal) modal.classList.remove('active');
  }
});

// ---- WhatsApp link helper ----
window.waLink = function(phone, message = '') {
  return `https://wa.me/${phone}${message ? '?text=' + encodeURIComponent(message) : ''}`;
};

// ---- Scroll reveal ----
window.initReveal = function() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
};


document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  if (typeof initCounters === 'function') initCounters();
});
