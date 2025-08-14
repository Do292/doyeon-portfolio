// assets/js/portfolio-pdf.js
// Assemble selected sections into one page and trigger print
(async function () {
  const root = document.getElementById('pdf-root');
  if (!root) return;

  // 1) Define which sections to include (order matters)
  // You can add/remove items here.
  const parts = [
    { title: 'About', url: 'about-main.html', selector: '.about-section' },
    { title: 'Work Highlights', url: 'work-main.html', selector: '.work-section' },
    // { title: 'Case Study: Project 1', url: 'work-detail-1.html', selector: '.work-detail-section' },
  ];

  // 2) Load and append
  for (const part of parts) {
    try {
      const res = await fetch(part.url, { cache: 'no-store' });
      if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
      const html = await res.text();

      const tmp = document.createElement('div');
      tmp.innerHTML = html;

      const section = tmp.querySelector(part.selector) || tmp.firstElementChild;
      if (!section) continue;

      // Section title
      const h2 = document.createElement('h2');
      h2.textContent = part.title;
      h2.style.margin = '0 0 12px';
      root.appendChild(h2);

      // Append actual section
      root.appendChild(section);
    } catch (err) {
      console.warn('[PDF] Failed to load', part.url, err);
    }
  }

  // 3) Wait for images to load before printing
  const imgs = Array.from(root.querySelectorAll('img'));
  await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => {
    img.onload = img.onerror = r;
  })));

  // 4) Auto print (delay slightly to ensure styles apply)
  setTimeout(() => window.print(), 100);
})();
