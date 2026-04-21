/**
 * Storage — única capa de datos de PEP Motors
 * Lee de data/*.json (demo) y sobreescribe con localStorage (admin changes)
 * Al migrar a PHP: reemplazar fetch/localStorage por llamadas a API
 */

// Clear outdated cached config when brand version changes
(function() {
  const BRAND_VERSION = '2';
  if (localStorage.getItem('pep_brand_v') !== BRAND_VERSION) {
    localStorage.removeItem('pep_config');
    localStorage.setItem('pep_brand_v', BRAND_VERSION);
  }
})();

const Storage = {
  _prefix: 'pep_',

  async get(key) {
    const local = localStorage.getItem(this._prefix + key);
    if (local) {
      try { return JSON.parse(local); } catch {}
    }
    try {
      const base = window.location.pathname.includes('/admin/')
        ? '../data/' + key + '.json'
        : 'data/' + key + '.json';
      const res = await fetch(base + '?v=' + Date.now());
      if (!res.ok) return key === 'config' ? {} : [];
      return await res.json();
    } catch {
      return key === 'config' ? {} : [];
    }
  },

  async set(key, data) {
    localStorage.setItem(this._prefix + key, JSON.stringify(data));
    return data;
  },

  async add(key, item) {
    const data = await this.get(key);
    const arr = Array.isArray(data) ? data : [];
    arr.push(item);
    await this.set(key, arr);
    return item;
  },

  async update(key, id, changes) {
    const data = await this.get(key);
    const arr = Array.isArray(data) ? data : [];
    const idx = arr.findIndex(i => i.id === id);
    if (idx === -1) return null;
    arr[idx] = { ...arr[idx], ...changes };
    await this.set(key, arr);
    return arr[idx];
  },

  async delete(key, id) {
    const data = await this.get(key);
    const arr = Array.isArray(data) ? data : [];
    const filtered = arr.filter(i => i.id !== id);
    await this.set(key, filtered);
    return filtered;
  },

  generateId(prefix = 'id') {
    return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  },

  clear(key) {
    localStorage.removeItem(this._prefix + key);
  },

  clearAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(this._prefix))
      .forEach(k => localStorage.removeItem(k));
  }
};
