console.log("✅ JS 연결됨!");

// ✅ scroll-to-top 기능 (FIX: #main이든 window든 둘 다 올리도록 return 제거)
function scrollToTop() {
  const m = document.getElementById('main');

  // 1) #main 먼저 올리기(있을 때만)
  if (m) {
    try { m.scrollTo({ top: 0, behavior: 'smooth' }); }
    catch (e) { m.scrollTop = 0; }
  }

  // 2) window도 항상 시도 (메인에 스크롤이 없을 수도 있음)
  try { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  catch (e) {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}

// ✅ scroll-down 기능 (Intro로 이동)
function scrollToIntro() {
  const intro = document.querySelector('#intro-section');
  if (intro) {
    intro.scrollIntoView({ behavior: 'smooth' });
  }
}

// ✅ 컴포넌트 include (header, main, footer)
const includes = async () => {
  const path = window.location.pathname;
  const page = path.split('/').pop();

  const targets = [
    { id: 'header', file: './components/header.html' },
    { id: 'footer', file: './components/footer.html' }
  ];

  // ✅ 현재 페이지에 따라 main 콘텐츠 분기
  if (document.getElementById('main')) {
    if (page === '' || page === 'index.html') {
      targets.splice(1, 0, { id: 'main', file: './components/main.html' });
    } else if (page === 'about.html') {
      targets.splice(1, 0, { id: 'main', file: './components/about-main.html' });
    } else if (page === 'work.html') {
      targets.splice(1, 0, { id: 'main', file: './components/work-main.html' });
    }
  }

  for (let t of targets) {
    const res = await fetch(t.file);
    if (!res.ok) {
      console.error(`❌ ${t.file} 불러오기 실패`, res.status);
      continue;
    }
    const html = await res.text();
    const host = document.getElementById(t.id);
    if (host) host.innerHTML = html;
  }

  // ✅ include 완료 후 실행
  setTimeout(() => {
    setupScrollEvents();
    setupScrollAnimations();
  }, 200);
};

// ✅ 실행 시작
includes();

// ✅ scroll 이벤트 + 버튼 기능 (FIX: window와 #main 둘 다 감지)
function setupScrollEvents() {
  const scrollBtn = document.querySelector('#scrollToTopBtn');
  const scrollDownBtn = document.querySelector('.scroll-down');
  const introSection = document.querySelector('#intro-section');
  const triggerPoint = (introSection?.offsetTop || 300) - 100;

  if (scrollBtn) {
    const m = document.getElementById('main');

    const getY = () => {
      const wy = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const my = m ? m.scrollTop : 0;
      return Math.max(wy, my);
    };

    const onScroll = () => {
      if (getY() >= triggerPoint) scrollBtn.classList.add('active');
      else scrollBtn.classList.remove('active');
    };

    // 두 스크롤 소스 모두 감지
    window.addEventListener('scroll', onScroll, { passive: true });
    if (m) m.addEventListener('scroll', onScroll, { passive: true });

    // 버튼 클릭
    scrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToTop();
    });

    // 초기 상태 반영
    onScroll();
  }

  if (scrollDownBtn && introSection) {
    scrollDownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToIntro();
    });
  }
}

// ✅ 등장 애니메이션: 반복 적용 가능하도록 수정
function setupScrollAnimations() {
  const targets = document.querySelectorAll('main section .container > *');
  if (targets.length === 0) return;

  targets.forEach((el, i) => {
    el.classList.add('observe');
    el.style.transitionDelay = `${i * 0.1}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
      else entry.target.classList.remove('active');
    });
  }, { threshold: 0.3 });

  setTimeout(() => {
    document.querySelectorAll('.observe').forEach(el => observer.observe(el));
  }, 200);
}

// ✅ 원형 진행바 세팅
document.addEventListener('DOMContentLoaded', () => {
  const circles = document.querySelectorAll('.circle');
  circles.forEach((circle) => {
    const percent = parseInt(circle.dataset.percent, 10);
    const progress = circle.querySelector('.progress');
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - percent / 100);
    progress.style.strokeDashoffset = offset;
  });
});
