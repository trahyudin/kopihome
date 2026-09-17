/**
 * KOPIWEB - Fullstack Application Client Logic
 * Theme Switcher, i18n ID/EN, REST API Sync, Category Filter, Search,
 * Sneak Peek Live Preview Modal, and Lead Capture Consultation Form.
 */

(function() {
  'use strict';

  const root = document.documentElement;

  // Global Config
  let WA_NUMBER = "6281234567890";
  let WA_MSG = {
    id: "Halo KopiWeb! Saya ingin konsultasi gratis tentang pembuatan website untuk coffee shop saya.",
    en: "Hi KopiWeb! I'd like a free consultation about building a website for my coffee shop."
  };

  // Local Fallback Templates (Semua 45 item dari data)
  let templatesData = [];
  let currentFilter = 'all';
  let searchQuery = '';

  // Language & i18n
  function lang() {
    return root.dataset.lang === 'en' ? 'en' : 'id';
  }

  function T(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (Array.isArray(obj)) return obj;
    return obj[lang()] || obj.id || '';
  }

  // BUG-01 & BUG-02 FIX: Apply i18n without destroying child nodes like #year
  function applyI18n() {
    const currentLang = lang();
    document.querySelectorAll('[data-en]').forEach(el => {
      // Khusus elemen bersarang seperti tombol yang punya span, kita hanya ganti jika tidak merusak anak
      if (currentLang === 'en') {
        if (!el.dataset.orig) el.dataset.orig = el.innerHTML;
        // Jika el punya child span#year, jangan timpa node-nya
        if (el.querySelector('#year')) {
          const yearVal = new Date().getFullYear();
          el.innerHTML = el.dataset.en.replace('{year}', yearVal);
        } else {
          el.innerHTML = el.dataset.en;
        }
      } else if (el.dataset.orig) {
        el.innerHTML = el.dataset.orig;
      }
    });

    const pillId = document.getElementById('langId');
    const pillEn = document.getElementById('langEn');
    if (pillId) pillId.classList.toggle('on', currentLang === 'id');
    if (pillEn) pillEn.classList.toggle('on', currentLang === 'en');

    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      themeIcon.setAttribute('href', root.dataset.theme === 'espresso' ? '#ic-moon' : '#ic-sun');
    }

    // Update year text
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function setLang(l) {
    root.dataset.lang = l;
    document.documentElement.lang = l;
    localStorage.setItem('kw-lang', l);
    applyI18n();
    renderShowcase();
    updateWa();
  }

  function setTheme(t) {
    root.dataset.theme = t;
    localStorage.setItem('kw-theme', t);
    applyI18n();
  }

  // Event Listeners for Theme and Language
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      setTheme(root.dataset.theme === 'espresso' ? 'latte' : 'espresso');
    });
  }

  const langIdBtn = document.getElementById('langId');
  if (langIdBtn) langIdBtn.addEventListener('click', () => setLang('id'));

  const langEnBtn = document.getElementById('langEn');
  if (langEnBtn) langEnBtn.addEventListener('click', () => setLang('en'));

  // WhatsApp Deep Links
  function updateWa() {
    const msg = encodeURIComponent(WA_MSG[lang()]);
    document.querySelectorAll('[data-wa]').forEach(a => {
      a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + msg;
    });
  }

  // Generator screenshot fallback
  function perchanceShot(url) {
    if (!url) return null;
    const m = url.match(/perchance\.org\/([^\/?#]+)/);
    return m ? 'https://perchance.org/api/getGeneratorScreenshot?generatorName=' + m[1] : null;
  }

  // Fetch Settings from API
  async function loadSettings() {
    try {
      const res = await fetch('api/settings.php');
      if (!res.ok) return;
      const json = await res.json();
      if (json.status === 'success' && json.data) {
        if (json.data.wa_number) WA_NUMBER = json.data.wa_number;
        if (json.data.wa_msg_id) WA_MSG.id = json.data.wa_msg_id;
        if (json.data.wa_msg_en) WA_MSG.en = json.data.wa_msg_en;
        updateWa();
      }
    } catch (e) {
      // Gunakan nilai default jika offline
    }
  }

  // Fetch Templates from REST API or fallback to local JSON
  async function loadTemplates() {
    try {
      const res = await fetch('api/templates.php');
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
          templatesData = json.data;
          renderShowcase();
          populateTemplateSelect();
          return;
        }
      }
    } catch (e) {
      console.warn('API fetch failed, loading local fallback data.', e);
    }

    // Fallback ke data/templates.json jika API offline
    try {
      const res2 = await fetch('data/templates.json');
      if (res2.ok) {
        templatesData = await res2.json();
        renderShowcase();
        populateTemplateSelect();
      }
    } catch (err) {
      console.error('Failed to load templates fallback:', err);
    }
  }

  // Render Showcase Cards with Filters & Sneak Peek Trigger
  function renderShowcase() {
    const grid = document.getElementById('tplGrid');
    if (!grid) return;

    let filtered = templatesData;

    // Filter Kategori
    if (currentFilter !== 'all') {
      filtered = filtered.filter(t => {
        const tags = Array.isArray(t.tags) ? t.tags : [];
        return tags.some(tag => tag.toLowerCase() === currentFilter.toLowerCase());
      });
    }

    // Filter Pencarian
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => {
        const nameId = (t.name && t.name.id ? t.name.id : '').toLowerCase();
        const nameEn = (t.name && t.name.en ? t.name.en : '').toLowerCase();
        const descId = (t.desc && t.desc.id ? t.desc.id : '').toLowerCase();
        const descEn = (t.desc && t.desc.en ? t.desc.en : '').toLowerCase();
        const tags = (Array.isArray(t.tags) ? t.tags.join(' ') : '').toLowerCase();
        return nameId.includes(q) || nameEn.includes(q) || descId.includes(q) || descEn.includes(q) || tags.includes(q);
      });
    }

    grid.innerHTML = '';

    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--muted);">' +
        (lang() === 'en' ? 'No coffee shop templates found matching your filter.' : 'Tidak ada template yang cocok dengan pencarian.') +
        '</div>';
      return;
    }

    filtered.forEach((t, i) => {
      const card = document.createElement('div');
      card.className = 'tpl-card reveal';
      const hasUrl = !!t.url;
      const shot = hasUrl ? (t.shot || perchanceShot(t.url)) : null;

      let screenHtml = '';
      if (shot) {
        screenHtml = '<img src="' + shot + '" alt="' + T(t.name) + '" loading="lazy">';
      } else if (hasUrl) {
        // Render preview frame
        screenHtml = '<iframe src="' + t.url + '" loading="lazy" title="' + T(t.name) + '"></iframe>';
      } else {
        screenHtml = '<div class="tpl-ph"><svg class="ic"><use href="#ic-cup"/></svg><b>' +
          (lang() === 'en' ? 'Website will appear here' : 'Website akan tampil di sini') +
          '</b><span>' + (lang() === 'en' ? 'URL not set' : 'URL belum diisi') + '</span></div>';
      }

      const orderMsg = encodeURIComponent(
        (lang() === 'en' ? "Hi KopiWeb! I'm interested in ordering the template: " : "Halo KopiWeb! Saya berminat memesan template: ") + T(t.name)
      );
      const orderWaLink = 'https://wa.me/' + WA_NUMBER + '?text=' + orderMsg;

      card.innerHTML =
        '<div class="tpl-frame" data-peek-idx="' + i + '" title="' + (lang() === 'en' ? 'Click for Sneak Peek Live Preview' : 'Klik untuk Sneak Peek Preview') + '">' +
          '<div class="tpl-chrome"><div class="tpl-dots"><i></i><i></i><i></i></div><div class="tpl-url">' + (hasUrl ? t.url : 'https://website-anda.co.id') + '</div></div>' +
          '<div class="tpl-screen">' +
            screenHtml +
            (hasUrl ? '<span class="tpl-peek-badge"><svg class="ic" style="width:14px;height:14px"><use href="#ic-search"/></svg> Sneak Peek</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="tpl-body">' +
          '<div class="tpl-title">' + T(t.name) + '</div>' +
          '<div class="tpl-tags">' + (Array.isArray(t.tags) ? t.tags.map(x => '<span class="tag">' + x + '</span>').join('') : '') + '</div>' +
          '<p class="tpl-desc">' + T(t.desc) + '</p>' +
          '<div class="tpl-btns">' +
            '<button class="btn btn-ghost' + (hasUrl ? '' : ' btn-dis') + '" data-btn-peek="' + i + '">' +
              '<svg class="ic" style="font-size:1.1em"><use href="#ic-search"/></svg>' +
              (lang() === 'en' ? 'Sneak Peek' : 'Sneak Peek') +
            '</button>' +
            '<a class="btn btn-primary" href="' + orderWaLink + '" target="_blank" rel="noopener">' +
              (lang() === 'en' ? 'Order Template' : 'Pesan Template') +
            '</a>' +
          '</div>' +
        '</div>';

      // Event Click Sneak Peek
      if (hasUrl) {
        const frameEl = card.querySelector('.tpl-frame');
        const peekBtn = card.querySelector('[data-btn-peek]');
        const openPeek = () => openSneakPeek(t);
        if (frameEl) frameEl.addEventListener('click', openPeek);
        if (peekBtn) peekBtn.addEventListener('click', openPeek);
      }

      grid.appendChild(card);
    });

    revealAll();
    if (window.__kwBindHover) window.__kwBindHover(grid);
  }

  // Populate Template Selection in Consultation Form
  function populateTemplateSelect() {
    const sel = document.getElementById('inquiryTemplate');
    if (!sel) return;
    sel.innerHTML = '<option value="">-- ' + (lang() === 'en' ? 'Select Template (Optional)' : 'Pilih Template (Opsional)') + ' --</option>';
    templatesData.forEach(t => {
      const opt = document.createElement('option');
      opt.value = T(t.name);
      opt.textContent = T(t.name) + (t.tags && t.tags[0] ? ' (' + t.tags[0] + ')' : '');
      sel.appendChild(opt);
    });
  }

  // ============================================================================
  // SNEAK PEEK LIVE PREVIEW MODAL
  // ============================================================================
  const peekModal = document.getElementById('peekModal');
  const peekFrame = document.getElementById('peekFrame');
  const peekTitle = document.getElementById('peekTitle');
  const peekDirectLink = document.getElementById('peekDirectLink');
  const peekOrderBtn = document.getElementById('peekOrderBtn');
  const peekCloseBtn = document.getElementById('peekCloseBtn');
  const peekWrap = document.getElementById('peekWrap');
  const peekLoading = document.getElementById('peekLoading');

  function openSneakPeek(t) {
    if (!peekModal || !t.url) return;
    peekTitle.textContent = T(t.name);
    peekDirectLink.href = t.url;

    // WA direct order for this template
    const orderMsg = encodeURIComponent(
      (lang() === 'en' ? "Hi KopiWeb! I'm interested in ordering the template: " : "Halo KopiWeb! Saya berminat memesan template: ") + T(t.name)
    );
    peekOrderBtn.href = 'https://wa.me/' + WA_NUMBER + '?text=' + orderMsg;

    // Iframe loading
    if (peekLoading) peekLoading.style.display = 'flex';
    peekFrame.src = t.url;
    peekFrame.onload = () => {
      if (peekLoading) peekLoading.style.display = 'none';
    };

    // Reset to desktop view
    setPeekDevice('desktop');

    peekModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Track sneak peek click via API
    if (t.id) {
      fetch('api/track.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_id: t.id })
      }).catch(() => {});
    }
  }

  function closeSneakPeek() {
    if (!peekModal) return;
    peekModal.classList.remove('open');
    peekFrame.src = 'about:blank';
    document.body.style.overflow = '';
  }

  function setPeekDevice(device) {
    if (!peekWrap) return;
    peekWrap.className = 'peek-frame-wrap device-' + device;
    document.querySelectorAll('.peek-dev-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.device === device);
    });
  }

  if (peekCloseBtn) peekCloseBtn.addEventListener('click', closeSneakPeek);
  if (peekModal) {
    peekModal.addEventListener('click', (e) => {
      if (e.target === peekModal) closeSneakPeek();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && peekModal && peekModal.classList.contains('open')) {
      closeSneakPeek();
    }
  });

  document.querySelectorAll('.peek-dev-btn').forEach(btn => {
    btn.addEventListener('click', () => setPeekDevice(btn.dataset.device));
  });

  // Filter Buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter || 'all';
      renderShowcase();
    });
  });

  // Search Input
  const searchInput = document.getElementById('tplSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderShowcase();
    });
  }

  // ============================================================================
  // CONSULTATION / LEAD CAPTURE FORM HANDLER
  // ============================================================================
  const inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = inquiryForm.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="peek-spinner" style="width:16px;height:16px;border-width:2px;display:inline-block"></span> Mengirim...';
      }

      const formData = {
        name: inquiryForm.name.value.trim(),
        coffee_shop: inquiryForm.coffee_shop.value.trim(),
        whatsapp: inquiryForm.whatsapp.value.trim(),
        package: inquiryForm.package.value,
        template_interest: inquiryForm.template_interest.value,
        notes: inquiryForm.notes.value.trim()
      };

      try {
        const res = await fetch('api/inquiries.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const json = await res.json();
        if (res.ok && json.status === 'success') {
          showToast(json.message || 'Permohonan konsultasi berhasil dikirim!', 'success');
          inquiryForm.reset();

          // Berikan opsi direct redirect ke WhatsApp dengan pesan lengkap
          if (json.data && json.data.whatsapp_redirect) {
            setTimeout(() => {
              const openWa = confirm(lang() === 'en' ? 'Would you also like to open WhatsApp chat now?' : 'Ingin langsung meneruskan pesan ke WhatsApp sekarang?');
              if (openWa) {
                window.open(json.data.whatsapp_redirect, '_blank');
              }
            }, 500);
          }
        } else {
          showToast(json.message || 'Gagal mengirim data. Silakan coba lagi.', 'error');
        }
      } catch (err) {
        // Fallback jika API backend offline: arahkan langsung ke WhatsApp
        console.warn('API error, falling back to direct WhatsApp redirect', err);
        const msg = "Halo KopiWeb! Saya ingin konsultasi website:\n" +
          "Nama: " + formData.name + "\n" +
          (formData.coffee_shop ? "Coffee Shop: " + formData.coffee_shop + "\n" : "") +
          "Paket: " + formData.package + "\n" +
          (formData.template_interest ? "Template: " + formData.template_interest + "\n" : "") +
          (formData.notes ? "Catatan: " + formData.notes + "\n" : "");
        window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
        showToast('Meneruskan pesan langsung ke WhatsApp...', 'success');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
        }
      }
    });
  }

  // Toast Notification System
  function showToast(message, type = 'success') {
    let container = document.querySelector('.kw-toasts');
    if (!container) {
      container = document.createElement('div');
      container.className = 'kw-toasts';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'kw-toast ' + type;
    toast.innerHTML = '<svg class="ic"><use href="' + (type === 'success' ? '#ic-check' : '#ic-info') + '"/></svg><span>' + message + '</span>';
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Mobile Menu
  const burger = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // Navbar Blur on Scroll
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 12);
    }, { passive: true });
  }

  // Scroll Reveal IntersectionObserver
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealObserver.unobserve(e.target);
        if (window.__kwReveal) window.__kwReveal(e.target);
      }
    });
  }, { threshold: 0.12 });

  function revealAll() {
    document.querySelectorAll('.reveal:not(.revealed)').forEach(el => revealObserver.observe(el));
  }

  // INIT
  document.addEventListener('DOMContentLoaded', () => {
    applyI18n();
    loadSettings();
    loadTemplates();
    updateWa();
  });

  // Export functions to window if needed
  window.__kopiweb = {
    setTheme,
    setLang,
    openSneakPeek,
    showToast
  };

})();
