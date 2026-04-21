/* ===== PEP MOTORS — ADMIN AUTH ===== */

const Auth = {
  SESSION_KEY: 'pep_session',

  getSession() {
    try { return JSON.parse(sessionStorage.getItem(this.SESSION_KEY)); }
    catch { return null; }
  },

  setSession(user) {
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
  },

  clearSession() {
    sessionStorage.removeItem(this.SESSION_KEY);
  },

  require(allowedRoles = null) {
    const session = this.getSession();
    if (!session) {
      window.location.href = '../admin/index.html';
      return null;
    }
    if (allowedRoles && !allowedRoles.includes(session.rol)) {
      window.location.href = '../admin/dashboard.html';
      return null;
    }
    return session;
  },

  async login(email, password) {
    const users = await Storage.get('usuarios');
    const user = users.find(u => u.email === email && u.password === password && u.activo);
    if (!user) return null;
    const session = { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol };
    this.setSession(session);
    return session;
  },

  logout() {
    this.clearSession();
    window.location.href = '../admin/index.html';
  },

  canEdit(session) {
    return session && ['admin', 'gerente'].includes(session.rol);
  },

  isAdmin(session) {
    return session && session.rol === 'admin';
  },

  isGerente(session) {
    return session && ['admin', 'gerente'].includes(session.rol);
  }
};

// ---- Apply session UI ----
function applySessionUI(session) {
  const nameEl = document.getElementById('session-name');
  const roleEl = document.getElementById('session-role');
  const avatarEl = document.getElementById('session-avatar');
  if (nameEl) nameEl.textContent = session.nombre;
  if (roleEl) roleEl.textContent = session.rol;
  if (avatarEl) avatarEl.textContent = session.nombre.charAt(0).toUpperCase();
}

// ---- Toast (admin version) ----
window.showToast = function(message, type = 'info', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-text">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>`;
  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
};

// ---- Format helpers ----
window.formatPrice = n => n || n === 0 ? '$' + Number(n).toLocaleString('es-AR') : '—';
window.formatKm = n => n === 0 ? '0 km' : Number(n).toLocaleString('es-AR') + ' km';
window.formatDate = d => d ? new Date(d).toLocaleDateString('es-AR') : '—';
window.formatDateTime = d => d ? new Date(d).toLocaleString('es-AR') : '—';

// ---- Confirm modal helper ----
window.confirmAction = function(message, onConfirm) {
  const existing = document.getElementById('_confirm-modal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = '_confirm-modal';
  overlay.className = 'modal-overlay active';
  overlay.innerHTML = `
    <div class="modal modal-sm">
      <div class="modal-body" style="text-align:center; padding: 32px 24px;">
        <div class="confirm-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </div>
        <p style="font-size:15px; font-weight:600; color:var(--color-white); margin-bottom:8px">¿Estás seguro?</p>
        <p style="font-size:13px; color:var(--color-gray); margin-bottom:24px">${message}</p>
        <div style="display:flex; gap:10px; justify-content:center">
          <button class="btn btn-secondary" onclick="document.getElementById('_confirm-modal').remove()">Cancelar</button>
          <button class="btn btn-danger" id="_confirm-ok">Eliminar</button>
        </div>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  document.getElementById('_confirm-ok').addEventListener('click', () => {
    overlay.remove();
    onConfirm();
  });
};

// ---- Sidebar collapse ----
function initSidebar() {
  const layout = document.querySelector('.admin-layout');
  const toggleBtn = document.getElementById('sidebar-toggle');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const sidebar = document.querySelector('.sidebar');

  if (!layout) return;

  const isMobile = () => window.innerWidth <= 768;

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (isMobile()) {
        sidebar.classList.toggle('mobile-open');
        if (mobileOverlay) mobileOverlay.classList.toggle('active');
      } else {
        layout.classList.toggle('collapsed');
        sidebar.classList.toggle('collapsed');
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      mobileOverlay.classList.remove('active');
    });
  }

  window.addEventListener('resize', () => {
    if (!isMobile()) {
      sidebar.classList.remove('mobile-open');
      if (mobileOverlay) mobileOverlay.classList.remove('active');
    }
  });
}
