(function() {
  'use strict';

  // ============================================================
  // HEADER SCROLL
  // ============================================================
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

  // ============================================================
  // MOBILE MENU
  // ============================================================
  const menuToggle = document.getElementById('menuToggle');
  const navList = document.querySelector('.nav-list');

  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      navList.classList.toggle('active');
      menuToggle.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.className = navList.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('active');
        menuToggle.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  // ============================================================
  // ANIMACIÓN DE ENTRADA DE CARDS
  // ============================================================
  const cards = document.querySelectorAll('.servicio-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = 'opacity 0.7s ease, transform 0.7s ease, box-shadow 0.5s ease, border-color 0.5s ease';
    observer.observe(card);
  });

  // ============================================================
  // WHATSAPP WIDGET
  // ============================================================
  const waWidget = document.getElementById('whatsappWidget');
  const waToggle = document.getElementById('whatsappToggle');
  const waClose = document.getElementById('whatsappClose');
  const waBadge = waWidget ? waWidget.querySelector('.whatsapp-badge') : null;

  const waTimeEl = document.getElementById('waTime');
  if (waTimeEl) {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    waTimeEl.textContent = `${hh}:${mm}`;
  }

  if (waToggle && waWidget) {
    waToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      waWidget.classList.toggle('open');
      if (waWidget.classList.contains('open') && waBadge) {
        waBadge.style.display = 'none';
      }
    });
  }

  if (waClose && waWidget) {
    waClose.addEventListener('click', (e) => {
      e.stopPropagation();
      waWidget.classList.remove('open');
    });
  }

  document.addEventListener('click', (e) => {
    if (waWidget && waWidget.classList.contains('open')) {
      if (!waWidget.contains(e.target)) {
        waWidget.classList.remove('open');
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && waWidget) {
      waWidget.classList.remove('open');
    }
  });

  // ============================================================
  // SMOOTH SCROLL
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();