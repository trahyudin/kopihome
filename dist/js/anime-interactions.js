/**
 * KOPIWEB - Anime.js Micro-Animations & Interactions
 * Timeline entrance, steam loop, floating cup, bean rotations, scroll-reveal & blend hovers
 */

(function(){
  if (!window.anime) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('has-anime');
  var animate = window.anime.animate, createTimeline = window.anime.createTimeline, stagger = window.anime.stagger;

  function safe(fn){ try { fn(); } catch (e) { console.error('anime init error:', e); } }

  /* ---- hero entrance (timeline) ---- */
  function heroEntrance(){
    var copy = document.querySelector('.hero-copy');
    if (!copy) return;
    var badge = copy.querySelector('.hero-badge');
    var h1 = copy.querySelector('h1');
    var sub = copy.querySelector('.hero-sub');
    var btns = copy.querySelectorAll('.hero-btns .btn');
    var trusts = copy.querySelectorAll('.trust li');
    var parts = [badge, h1, sub].filter(Boolean).concat(Array.prototype.slice.call(btns), Array.prototype.slice.call(trusts));
    parts.forEach(function(p){ p.style.opacity = '0'; });

    var art = document.querySelector('.hero-art');
    var glow = art && art.querySelector('#haGlow');
    var steam = art ? Array.prototype.slice.call(art.querySelectorAll('.ha-steam')) : [];
    var cupRig = art ? Array.prototype.slice.call(art.querySelectorAll('#haCup,#haRim,#haCoffee,#haFoam1,#haFoam2,#haHandle')) : [];
    var beans = art ? Array.prototype.slice.call(art.querySelectorAll('.ha-bean')) : [];
    [glow].concat(steam, cupRig, beans).forEach(function(el){ if (el) el.style.opacity = '0'; });

    var tl = createTimeline({ defaults: { ease: 'outExpo' } });
    if (badge) tl.add(badge, { opacity:[0,1], translateY:[-18,0], duration:620 });
    if (h1) tl.add(h1, { opacity:[0,1], translateY:[42,0], duration:880 }, '-=420');
    if (sub) tl.add(sub, { opacity:[0,1], translateY:[28,0], duration:720 }, '-=640');
    if (btns.length) tl.add(btns, { opacity:[0,1], scale:[0.82,1], translateY:[16,0], duration:620, delay:stagger(130) }, '-=520');
    if (trusts.length) tl.add(trusts, { opacity:[0,1], translateY:[12,0], duration:560, delay:stagger(120) }, '-=440');
    if (glow) tl.add(glow, { opacity:[0,1], scale:[0.55,1], duration:1000 }, '-=520');
    if (steam.length) tl.add(steam, { opacity:[0,0.75], translateY:[28,0], duration:820, delay:stagger(150) }, '-=780');
    if (cupRig.length) tl.add(cupRig, { opacity:[0,1], translateY:[52,0], scale:[0.82,1], duration:980 }, '-=840');
    if (beans.length) tl.add(beans, { opacity:[0,1], scale:[0,1], duration:820, delay:stagger(110), ease:'outBack(1.6)' }, '-=760');
  }

  /* ---- hero ambient loops (steam wisps, floating cup, drifting beans, breathing glow) ---- */
  function heroAmbient(){
    var steam = Array.prototype.slice.call(document.querySelectorAll('.ha-steam'));
    var cupRig = Array.prototype.slice.call(document.querySelectorAll('#haCup,#haRim,#haCoffee,#haFoam1,#haFoam2,#haHandle'));
    var beans = Array.prototype.slice.call(document.querySelectorAll('.ha-bean'));
    var glow = document.querySelector('#haGlow');
    if (steam.length) animate(steam, {
      translateY:[0,-34], opacity:[0.1,0.85], duration:2600, ease:'inOutSine',
      loop:true, alternate:true, delay:stagger(750, {start:1900})
    });
    if (cupRig.length){
      animate(cupRig, { translateY:[0,-9], duration:3000, ease:'inOutSine', loop:true, alternate:true, delay:2100 });
      animate(cupRig, { rotate:[-2,2], duration:3600, ease:'inOutSine', loop:true, alternate:true, delay:2100 });
    }
    if (beans.length){
      animate(beans, { rotate:[0,360], duration:32000, ease:'linear', loop:true, delay:stagger(2600,{start:2100}) });
      animate(beans, { translateY:[0,-7], duration:5200, ease:'inOutSine', loop:true, alternate:true, delay:stagger(1200,{start:2400}) });
    }
    if (glow) animate(glow, { scale:[1,1.15], opacity:[0.85,1], duration:3800, ease:'inOutSine', loop:true, alternate:true, delay:2400 });
  }

  /* ---- brand mark steam pulse ---- */
  function brandSteam(){
    Array.prototype.forEach.call(document.querySelectorAll('.brand .mark'), function(mark){
      var paths = mark.querySelectorAll('g[stroke] path');
      if (paths.length) animate(paths, {
        opacity:[0.55,1], translateY:[0,-2], duration:2400, ease:'inOutSine',
        loop:true, alternate:true, delay:stagger(420,{start:2200})
      });
    });
  }

  /* ---- scroll reveal (called by the IntersectionObserver in app.js) ---- */
  window.__kwReveal = function(el){
    if (!el || el.dataset.kwAnimated) return;
    el.dataset.kwAnimated = '1';
    function fail(){ el.style.opacity = ''; el.style.transform = ''; }
    try {
      if (el.classList.contains('sec-head')){
        var kids = Array.prototype.slice.call(el.children);
        el.style.opacity = '0';
        el.style.transform = 'translateY(26px)';
        kids.forEach(function(k){ if (k.dataset.kwSech !== '1'){ k.dataset.kwSech = '1'; k.style.opacity = '0'; } });
        animate(el, { opacity:[0,1], translateY:[26,0], duration:700, ease:'outExpo' });
        animate(kids, { opacity:[0,1], translateY:[16,0], duration:620, ease:'outExpo', delay:stagger(90,{start:130}) });
        return;
      }
      var isCard = el.classList.contains('card') || el.classList.contains('tpl-card') || el.classList.contains('price-card') || el.classList.contains('impact-item') || el.classList.contains('cta');
      var dist = isCard ? 30 : 22;
      var idx = (el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0);
      el.style.opacity = '0';
      el.style.transform = 'translateY(' + dist + 'px)';
      animate(el, {
        opacity:[0,1],
        translateY:[dist,0],
        scale: isCard ? [0.965,1] : [1,1],
        duration: isCard ? 820 : 620,
        delay: Math.min(idx, 10) * 70,
        ease:'outExpo'
      });
      bindHover(el);
    } catch (e) { fail(); }
  };

  /* ---- blend hover ---- */
  var HOVER_SEL = '.card,.impact-item,.tpl-card,.price-card,.contact-item,.hero-btns .btn,.cta-btns .btn,.preview-device-btn';
  var hoverBound = [];
  function bindHover(root){
    var scope = root && root.querySelectorAll ? root : document;
    Array.prototype.forEach.call(scope.querySelectorAll(HOVER_SEL), function(el){
      if (hoverBound.indexOf(el) !== -1) return;
      hoverBound.push(el);
      el.addEventListener('mouseenter', function(){
        animate(el, {
          scale:1.03,
          translateY: el.classList.contains('btn') || el.classList.contains('preview-device-btn') ? 0 : -5,
          duration:380, ease:'out(2.4)', composition:'blend'
        });
      });
      el.addEventListener('mouseleave', function(){
        animate(el, { scale:1, translateY:0, duration:560, ease:'out(3)', composition:'blend' });
      });
    });
  }

  window.__kwBindHover = bindHover;

  safe(heroEntrance);
  safe(brandSteam);
  safe(function(){ bindHover(document); });
  setTimeout(function(){ safe(heroAmbient); }, 2600);
})();
