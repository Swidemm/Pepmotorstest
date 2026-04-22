/* Sidebar HTML shared across all admin pages */
function renderSidebar(activePage) {
  const pages = [
    {
      section: 'Principal',
      items: [
        { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>` },
      ]
    },
    {
      section: 'Inventario',
      items: [
        { id: 'vehiculos', label: 'Vehículos', href: 'vehiculos.html', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>` },
      ]
    },
    {
      section: 'CRM',
      items: [
        { id: 'leads', label: 'CRM / Contactos', href: 'leads.html', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`, badge: true },
        { id: 'ventas', label: 'Ventas', href: 'ventas.html', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>` },
      ]
    },
    {
      section: 'Gestión',
      items: [
        { id: 'agenda', label: 'Agenda', href: 'agenda.html', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
        { id: 'reportes', label: 'Reportes', href: 'reportes.html', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`, roles: ['admin', 'gerente'] },
        { id: 'configuracion', label: 'Configuración', href: 'configuracion.html', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`, roles: ['admin'] },
      ]
    }
  ];

  const session = Auth.getSession();

  let html = `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <img src="../assets/img/logo.png" alt="PEP Motors">
        <span class="sidebar-logo-text">PEP Motors</span>
      </div>
      <nav class="sidebar-nav">`;

  pages.forEach(section => {
    const visibleItems = section.items.filter(item => {
      if (!item.roles) return true;
      return session && item.roles.includes(session.rol);
    });
    if (!visibleItems.length) return;

    html += `<div class="nav-section"><p class="nav-section-label">${section.section}</p>`;
    visibleItems.forEach(item => {
      const isActive = activePage === item.id ? 'active' : '';
      html += `
        <a href="${item.href}" class="nav-link ${isActive}">
          ${item.icon}
          <span>${item.label}</span>
          ${item.badge ? '<span class="nav-badge" id="leads-badge">0</span>' : ''}
        </a>`;
    });
    html += `</div>`;
  });

  html += `</nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-avatar" id="session-avatar">${session ? session.nombre.charAt(0) : 'A'}</div>
          <div class="sidebar-user-info">
            <p class="sidebar-user-name" id="session-name">${session ? session.nombre : ''}</p>
            <p class="sidebar-user-role" id="session-role">${session ? session.rol : ''}</p>
          </div>
        </div>
        <a href="#" onclick="Auth.logout()" class="nav-link" style="margin-top:4px; color:var(--color-gray)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Cerrar sesión</span>
        </a>
      </div>
    </aside>
    <div class="mobile-overlay" id="mobile-overlay"></div>`;

  return html;
}

function renderTopbar(title, subtitle) {
  return `
    <header class="admin-topbar">
      <button class="topbar-toggle" id="sidebar-toggle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <div class="topbar-breadcrumb">
        <span>PEP Motors</span>
        <span>/</span>
        <strong>${title}</strong>
      </div>
      <div class="topbar-actions">
        <a href="../index.html" target="_blank" class="topbar-btn" title="Ver sitio público">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>
    </header>`;
}
