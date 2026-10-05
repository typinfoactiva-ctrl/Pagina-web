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
        navList.style.cssText = '';
      }
    });

    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
        navList.style.cssText = '';
      });
    });
  }

  // ===== ACORDEÓN FAQ =====
  const faqCards = document.querySelectorAll('.faq-card');

  faqCards.forEach(card => {
    const header = card.querySelector('.faq-card-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');

      faqCards.forEach(other => {
        if (other !== card) other.classList.remove('open');
      });

      if (isOpen) {
        card.classList.remove('open');
      } else {
        card.classList.add('open');
      }
    });
  });

  // Abrir la primera card por defecto
  if (faqCards.length > 0) {
    faqCards[0].classList.add('open');
  }

  // ===== PARALLAX SUAVE EN HERO =====
  const hero = document.querySelector('.hero-preguntas');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      hero.style.backgroundPositionY = (scrolled * 0.25) + 'px';
    });
  }

})();