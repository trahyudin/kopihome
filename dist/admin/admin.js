/**
 * KOPIWEB - Admin Dashboard Controller
 * Handles Authentication, Leads Processing, Template Management, and Settings
 */

(function() {
  'use strict';

  let token = localStorage.getItem('kw_admin_token') || '';
  let currentUser = null;
  let allInquiries = [];
  let allTemplates = [];

  // API Client with Auth
  async function api(endpoint, options = {}) {
    options.headers = options.headers || {};
    if (!options.headers['Content-Type'] && !(options.body instanceof FormData)) {
      options.headers['Content-Type'] = 'application/json';
    }
    if (token) {
      options.headers['Authorization'] = 'Bearer ' + token;
    }
    const res = await fetch('../api/' + endpoint, options);
    const json = await res.json().catch(() => ({ status: 'error', message: 'Invalid response from server' }));
    return { ok: res.ok, status: res.status, data: json };
  }

  // Toast in Admin
  function notify(msg, type = 'success') {
    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 10000;
      background: ${type === 'success' ? '#10b981' : '#ef4444'}; color: #fff;
      padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 700;
      box-shadow: 0 10px 25px rgba(0,0,0,.4); transition: all .3s;
    `;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      setTimeout(() => el.remove(), 300);
    }, 3500);
  }

  // Auth Check
  async function checkAuth() {
    const res = await api('auth.php?action=check');
    if (res.ok && res.data && res.data.authenticated) {
      currentUser = res.data.user;
      showApp();
    } else {
      showLogin();
    }
  }

  function showLogin() {
    document.getElementById('authView').style.display = 'flex';
    document.getElementById('appView').style.display = 'none';
  }

  function showApp() {
    document.getElementById('authView').style.display = 'none';
    document.getElementById('appView').style.display = 'block';
    document.getElementById('loggedUser').textContent = (currentUser && currentUser.username) || 'Admin';
    loadDashboardData();
  }

  // Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errEl = document.getElementById('loginError');
      errEl.style.display = 'none';

      const username = loginForm.username.value.trim();
      const password = loginForm.password.value;

      const res = await api('auth.php?action=login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      if (res.ok && res.data.status === 'success') {
        token = res.data.data.token;
        localStorage.setItem('kw_admin_token', token);
        currentUser = res.data.data;
        showApp();
      } else {
        errEl.textContent = res.data.message || 'Login gagal. Periksa username dan password.';
        errEl.style.display = 'block';
      }
    });
  }

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await api('auth.php?action=logout', { method: 'POST' });
      token = '';
      localStorage.removeItem('kw_admin_token');
      currentUser = null;
      showLogin();
    });
  }

  // Navigation Tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      tab.classList.add('active');
      const targetId = tab.dataset.target;
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.style.display = 'block';
    });
  });

  // Load All Dashboard Data
  async function loadDashboardData() {
    await Promise.all([loadInquiries(), loadTemplates(), loadSettings()]);
    updateStats();
  }

  // 1. INQUIRIES / LEADS
  async function loadInquiries() {
    const res = await api('inquiries.php');
    if (res.ok && res.data.status === 'success') {
      allInquiries = res.data.data;
      renderInquiriesTable(allInquiries);
      updateStats();
    }
  }

  function renderInquiriesTable(list) {
    const tbody = document.getElementById('inquiriesTableBody');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--muted)">Belum ada data leads/konsultasi masuk.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(item => {
      const waDigits = item.whatsapp.replace(/[^0-9]/g, '');
      const waLink = 'https://wa.me/' + (waDigits.startsWith('0') ? '62' + waDigits.slice(1) : waDigits);
      const dateStr = new Date(item.created_at).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      return `
        <tr>
          <td>
            <strong>${escapeHtml(item.name)}</strong>
            ${item.coffee_shop ? `<div style="font-size:12px;color:var(--muted)">☕ ${escapeHtml(item.coffee_shop)}</div>` : ''}
          </td>
          <td>
            <a href="${waLink}" target="_blank" class="btn btn-ghost btn-sm" style="padding:4px 10px;font-size:12px">
              💬 ${escapeHtml(item.whatsapp)}
            </a>
          </td>
          <td><span style="font-size:13px">${escapeHtml(item.package || '-')}</span></td>
          <td><span style="font-size:13px;color:var(--accent)">${escapeHtml(item.template_interest || '-')}</span></td>
          <td style="font-size:12px;color:var(--muted);white-space:nowrap">${dateStr}</td>
          <td>
            <select class="form-control" style="padding:4px 8px;font-size:12px;width:auto" onchange="updateInquiryStatus(${item.id}, this.value)">
              <option value="baru" ${item.status === 'baru' ? 'selected' : ''}>🔵 Baru</option>
              <option value="dihubungi" ${item.status === 'dihubungi' ? 'selected' : ''}>🟡 Dihubungi</option>
              <option value="deal" ${item.status === 'deal' ? 'selected' : ''}>🟢 Deal / Order</option>
              <option value="batal" ${item.status === 'batal' ? 'selected' : ''}>🔴 Batal</option>
            </select>
          </td>
          <td style="text-align:right">
            <button class="btn btn-danger btn-sm" onclick="deleteInquiry(${item.id})">Hapus</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.updateInquiryStatus = async function(id, status) {
    const res = await api('inquiries.php', {
      method: 'PATCH',
      body: JSON.stringify({ id, status })
    });
    if (res.ok) {
      notify('Status berhasil diperbarui!');
      loadInquiries();
    } else {
      notify('Gagal memperbarui status', 'error');
    }
  };

  window.deleteInquiry = async function(id) {
    if (!confirm('Hapus data konsultasi ini?')) return;
    const res = await api('inquiries.php?id=' + id, { method: 'DELETE' });
    if (res.ok) {
      notify('Data konsultasi dihapus');
      loadInquiries();
    }
  };

  // Filter inquiries by status
  const filterStatus = document.getElementById('filterInquiryStatus');
  if (filterStatus) {
    filterStatus.addEventListener('change', () => {
      const val = filterStatus.value;
      if (!val) {
        renderInquiriesTable(allInquiries);
      } else {
        renderInquiriesTable(allInquiries.filter(x => x.status === val));
      }
    });
  }

  // 2. TEMPLATES MANAGEMENT
  async function loadTemplates() {
    const res = await api('templates.php');
    if (res.ok && res.data.status === 'success') {
      allTemplates = res.data.data;
      renderTemplatesTable(allTemplates);
      updateStats();
    }
  }

  function renderTemplatesTable(list) {
    const tbody = document.getElementById('templatesTableBody');
    if (!tbody) return;

    tbody.innerHTML = list.map((t, idx) => {
      const shotUrl = t.shot || (t.url && t.url.includes('perchance.org') ? 'https://perchance.org/api/getGeneratorScreenshot?generatorName=' + (t.url.match(/perchance\.org\/([^\/?#]+)/) || ['',''])[1] : '');
      const tagsStr = Array.isArray(t.tags) ? t.tags.join(', ') : '';

      return `
        <tr>
          <td style="color:var(--muted);width:30px">${idx + 1}</td>
          <td style="width:64px">
            <div class="thumb-cell">
              ${shotUrl ? `<img src="${shotUrl}" alt="${escapeHtml(t.name.id)}" loading="lazy">` : `<div style="padding:6px;font-size:10px;text-align:center">No img</div>`}
            </div>
          </td>
          <td>
            <strong>${escapeHtml(t.name.id)}</strong>
            <div style="font-size:12px;color:var(--muted)">EN: ${escapeHtml(t.name.en)}</div>
          </td>
          <td>
            <span style="font-size:12px;color:var(--muted)">${escapeHtml(tagsStr)}</span>
          </td>
          <td>
            ${t.url ? `<a href="${t.url}" target="_blank" class="btn btn-ghost btn-sm" style="padding:3px 8px;font-size:11px">🔗 Buka Link</a>` : '-'}
          </td>
          <td style="font-weight:700;color:var(--accent)">
            ${t.clicks || 0}
          </td>
          <td style="text-align:right">
            <button class="btn btn-ghost btn-sm" onclick="editTemplateModal(${t.id})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteTemplate(${t.id})">Hapus</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Template Search in Admin
  const tplSearch = document.getElementById('adminTplSearch');
  if (tplSearch) {
    tplSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = allTemplates.filter(t =>
        (t.name.id || '').toLowerCase().includes(q) ||
        (t.name.en || '').toLowerCase().includes(q) ||
        (Array.isArray(t.tags) ? t.tags.join(' ') : '').toLowerCase().includes(q)
      );
      renderTemplatesTable(filtered);
    });
  }

  // Add / Edit Template Modal
  const tplModal = document.getElementById('templateModal');
  const tplForm = document.getElementById('templateForm');

  window.openAddTemplateModal = function() {
    tplForm.reset();
    document.getElementById('tplFormId').value = '';
    document.getElementById('tplModalTitle').textContent = 'Tambah Template Baru';
    tplModal.classList.add('open');
  };

  window.editTemplateModal = function(id) {
    const t = allTemplates.find(x => x.id === id);
    if (!t) return;
    document.getElementById('tplFormId').value = t.id;
    document.getElementById('tplNameId').value = t.name.id || '';
    document.getElementById('tplNameEn').value = t.name.en || '';
    document.getElementById('tplUrl').value = t.url || '';
    document.getElementById('tplShot').value = t.shot || '';
    document.getElementById('tplTags').value = Array.isArray(t.tags) ? t.tags.join(', ') : '';
    document.getElementById('tplDescId').value = t.desc.id || '';
    document.getElementById('tplDescEn').value = t.desc.en || '';
    document.getElementById('tplModalTitle').textContent = 'Edit Template #' + t.id;
    tplModal.classList.add('open');
  };

  window.closeTemplateModal = function() {
    tplModal.classList.remove('open');
  };

  if (tplForm) {
    tplForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('tplFormId').value;
      const tagsRaw = document.getElementById('tplTags').value.split(',').map(s => s.trim()).filter(Boolean);

      const payload = {
        name_id: document.getElementById('tplNameId').value.trim(),
        name_en: document.getElementById('tplNameEn').value.trim(),
        url: document.getElementById('tplUrl').value.trim(),
        shot: document.getElementById('tplShot').value.trim(),
        tags: tagsRaw,
        desc_id: document.getElementById('tplDescId').value.trim(),
        desc_en: document.getElementById('tplDescEn').value.trim(),
      };

      let res;
      if (id) {
        payload.id = parseInt(id);
        res = await api('templates.php', { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        res = await api('templates.php', { method: 'POST', body: JSON.stringify(payload) });
      }

      if (res.ok) {
        notify(id ? 'Template berhasil diperbarui!' : 'Template baru berhasil ditambahkan!');
        closeTemplateModal();
        loadTemplates();
      } else {
        notify(res.data.message || 'Gagal menyimpan template', 'error');
      }
    });
  }

  window.deleteTemplate = async function(id) {
    if (!confirm('Yakin ingin menghapus template ini dari katalog?')) return;
    const res = await api('templates.php?id=' + id, { method: 'DELETE' });
    if (res.ok) {
      notify('Template berhasil dihapus');
      loadTemplates();
    }
  };

  // 3. SETTINGS
  async function loadSettings() {
    const res = await api('settings.php');
    if (res.ok && res.data.status === 'success') {
      const s = res.data.data;
      if (document.getElementById('setWaNumber')) document.getElementById('setWaNumber').value = s.wa_number || '';
      if (document.getElementById('setWaMsgId')) document.getElementById('setWaMsgId').value = s.wa_msg_id || '';
      if (document.getElementById('setWaMsgEn')) document.getElementById('setWaMsgEn').value = s.wa_msg_en || '';
      if (document.getElementById('setContactEmail')) document.getElementById('setContactEmail').value = s.contact_email || '';
      if (document.getElementById('setContactInstagram')) document.getElementById('setContactInstagram').value = s.contact_instagram || '';
      if (document.getElementById('setSiteTitle')) document.getElementById('setSiteTitle').value = s.site_title || '';
    }
  }

  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        wa_number: document.getElementById('setWaNumber').value.trim(),
        wa_msg_id: document.getElementById('setWaMsgId').value.trim(),
        wa_msg_en: document.getElementById('setWaMsgEn').value.trim(),
        contact_email: document.getElementById('setContactEmail').value.trim(),
        contact_instagram: document.getElementById('setContactInstagram').value.trim(),
        site_title: document.getElementById('setSiteTitle').value.trim()
      };

      const res = await api('settings.php', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        notify('Pengaturan website berhasil disimpan!');
      } else {
        notify(res.data.message || 'Gagal menyimpan pengaturan', 'error');
      }
    });
  }

  // Update Stats Cards
  function updateStats() {
    const totalLeads = allInquiries.length;
    const newLeads = allInquiries.filter(x => x.status === 'baru').length;
    const dealLeads = allInquiries.filter(x => x.status === 'deal').length;
    const totalTpl = allTemplates.length;

    const elTotal = document.getElementById('statTotalLeads');
    if (elTotal) elTotal.textContent = totalLeads;

    const elNew = document.getElementById('statNewLeads');
    if (elNew) elNew.textContent = newLeads;

    const elDeal = document.getElementById('statDealLeads');
    if (elDeal) elDeal.textContent = dealLeads;

    const elTpl = document.getElementById('statTotalTemplates');
    if (elTpl) elTpl.textContent = totalTpl;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // INIT
  document.addEventListener('DOMContentLoaded', checkAuth);

})();
