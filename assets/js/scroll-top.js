// assets/js/scroll-top.js v2 — detect real scroller (window or nested)
(function () {
  function ensureBtn() {
    let btn = document.getElementById('scrollToTopBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'scrollToTopBtn';
      btn.setAttribute('aria-label', '맨 위로 이동');
      btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
      document.body.appendChild(btn);
    }
    return btn;
  }

  // 현재 레이아웃에서 실제로 스크롤되는 요소를 찾아요.
  function getScrollable() {
    const cands = [
      document.scrollingElement,
      document.documentElement,
      document.body,
      document.querySelector('#main'),
      document.querySelector('.site-main'),
      document.querySelector('.page-wrapper'),
    ].filter(Boolean);

    for (const el of cands) {
      const isWindowLike = (el === window || el === document.scrollingElement || el === document.documentElement || el === document.body);
      const st = isWindowLike ? (window.scrollY || document.documentElement.scrollTop || document.body.scrollTop) : el.scrollTop;
      const sh = isWindowLike ? Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) : el.scrollHeight;
      const ch = isWindowLike ? window.innerHeight : el.clientHeight;
      const styles = (el instanceof Element) ? getComputedStyle(el) : null;
      const overflowY = styles ? styles.overflowY : 'auto';
      const canScroll = isWindowLike || /auto|scroll/.test(overflowY);

      if (canScroll && sh > ch + 1) return { el, top: st };
    }
    return { el: window, top: window.scrollY || 0 };
  }

  function doScrollTop(target) {
    try {
      if (target.el === window || target.el === document.scrollingElement || target.el === document.documentElement || target.el === document.body) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        target.el.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e) {
      if (target.el && target.el !== window) target.el.scrollTop = 0;
      document.documentElement.scrollTop = 0; document.body.scrollTop = 0;
    }
  }

  function bind() {
    const btn = ensureBtn();
    if (btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';

    let current = getScrollable();

    const update = () => {
      current = getScrollable();                     // 레이아웃 변동 대응
      const y = current.top;
      if (y > 200) btn.classList.add('active');
      else btn.classList.remove('active');
    };

    btn.addEventListener('click', () => doScrollTop(current));
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    // 내부 스크롤러에도 리스너 추가
    const nested = current.el instanceof Element ? current.el : null;
    if (nested) nested.addEventListener('scroll', update, { passive: true });

    // include로 헤더/메인이 나중에 삽입되는 경우 대비
    document.addEventListener('includes:ready', update);

    // 전역 함수(인라인 onclick 호환)
    window.scrollToTop = () => doScrollTop(getScrollable());

    update();
  }

  if (document.readyState !== 'loading') bind();
  else document.addEventListener('DOMContentLoaded', bind);
  document.addEventListener('includes:ready', bind);
})();

(function () {
  // 히어로 섹션이 보일 때 body에 .hero-in-view 클래스 토글
  var hero = document.querySelector('.hero-section');
  if (!hero) { document.body.classList.remove('hero-in-view'); return; }

  // 내부 스크롤 컨테이너(#main)가 있으면 그것을 관찰 루트로 사용
  var rootEl = document.querySelector('#main') || null;

  var io = new IntersectionObserver(function (entries) {
    var vis = entries[0].isIntersecting && entries[0].intersectionRatio > 0.6;
    document.body.classList.toggle('hero-in-view', vis);
  }, { root: rootEl, threshold: 0.6 });

  io.observe(hero);
})();