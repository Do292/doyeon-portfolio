// assets/js/nav-toggle.js — waits for included header and attaches safely
(function () {
  function attach() {
    const header = document.querySelector('.site-header');
    const navBar  = document.querySelector('.site-header .main-nav');
    const burger  = document.querySelector('.site-header .hamburger');
    const nav     = document.querySelector('.site-header .nav-links');
    if (!header || !navBar || !burger || !nav) return false;

    // 중복 바인딩 방지
    if (burger.dataset.bound === '1') return true;
    burger.dataset.bound = '1';

    function openMenu() {
      burger.classList.add('active');
      nav.classList.add('active');
      navBar.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
      burger.classList.remove('active');
      nav.classList.remove('active');
      navBar.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }

    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.contains('active') ? closeMenu() : openMenu();
    });

    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.main-nav')) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });

    console.log('[nav-toggle] attached');
    return true;
  }

  // 1) DOM 준비되면 먼저 시도
  document.addEventListener('DOMContentLoaded', () => attach());

  // 2) include가 끝났다는 커스텀 이벤트가 있으면 그것도 듣기
  document.addEventListener('includes:ready', () => attach());

  // 3) 혹시 모르니 #header 영역 변화를 관찰해서 헤더가 들어오면 붙이기
  const host = document.getElementById('header');
  if (host) {
    const obs = new MutationObserver(() => {
      if (attach()) obs.disconnect();
    });
    obs.observe(host, { childList: true, subtree: true });
  }
})();
