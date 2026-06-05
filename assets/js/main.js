/* ===========================================================
 * 赵健宏 · AI Product Resume - main.js
 * 轻量原生 JS，无依赖，注重性能
 * =========================================================== */

(() => {
  'use strict';

  // -------- 1. 顶部导航：滚动加背景 --------
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 60) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // -------- 2. IntersectionObserver 入场动画 --------
  const candidates = document.querySelectorAll(
    '.hero__content, .hero__panel, .hero-side, .summary, .section__head, .capability-card, .case-card, .timeline__item, .portfolio-banner, .work-tile, .contact__inner'
  );
  candidates.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i * 60, 360)}ms`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

  candidates.forEach((el) => io.observe(el));

  // -------- 3. 平滑锚点滚动（带导航高度补偿） --------
  const navLinks = document.querySelectorAll('.nav__menu a[href^="#"]');
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // -------- 4. 当前区块导航高亮 --------
  const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    navLinks.forEach((link) => {
      link.toggleAttribute('aria-current', link.getAttribute('href') === `#${visible.target.id}`);
    });
  }, { threshold: [0.28, 0.5], rootMargin: '-20% 0px -55% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));

  // -------- 5. 鼠标视差（仅桌面端，hero 内容轻微浮动） --------
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero__content');
  const canAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hero && heroContent && canAnimate && window.matchMedia('(pointer: fine)').matches) {
    let raf = null;
    hero.addEventListener('mousemove', (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        heroContent.style.setProperty('--parallax-x', `${x * -10}px`);
        heroContent.style.setProperty('--parallax-y', `${y * -8}px`);
      });
    });
    hero.addEventListener('mouseleave', () => {
      heroContent.style.removeProperty('--parallax-x');
      heroContent.style.removeProperty('--parallax-y');
    });
  }
})();
