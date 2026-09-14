(function() {
  'use strict';

  // ===== HEADER SCROLL =====
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ===== MOBILE MENU =====
  const menuToggle = document.getElementById('menuToggle');
  const navList = document.querySelector('.nav-list');

  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      navList.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (navList.classList.contains('active')) {
        icon.className = 'fas fa-times';
        navList.style.display = 'flex';
        navList.style.flexDirection = 'column';
        navList.style.position = 'absolute';
        navList.style.top = '70px';
        navList.style.left = '0';
        navList.style.width = '100%';
        navList.style.background = '#ffffff';
        navList.style.padding = '1.5rem 2rem';
        navList.style.gap = '0.8rem';
        navList.style.zIndex = '999';
        navList.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
        navList.style.alignItems = 'flex-start';
      } else {
        icon.className = 'fas fa-bars';
        navList.style.display = '';
        navList.style.flexDirection = '';
        navList.style.position = '';
        navList.style.top = '';
        navList.style.left = '';
        navList.style.width = '';
        navList.style.background = '';
        navList.style.padding = '';
        navList.style.gap = '';
        navList.style.zIndex = '';
        navList.style.boxShadow = '';
        navList.style.alignItems = '';
      }
    });

    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
        navList.style.display = '';
        navList.style.flexDirection = '';
        navList.style.position = '';
        navList.style.top = '';
        navList.style.left = '';
        navList.style.width = '';
        navList.style.background = '';
        navList.style.padding = '';
        navList.style.gap = '';
        navList.style.zIndex = '';
        navList.style.boxShadow = '';
        navList.style.alignItems = '';
      });
    });
  }

  // ===== ANIMACIONES SCROLL =====
  const animateElements = document.querySelectorAll(
    '.benefit-card, .use-case, .intro-feature, .intro-image-wrapper, .testimonial'
  );

  const observerScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observerScroll.observe(el);
  });

})();