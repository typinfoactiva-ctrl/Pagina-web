(function() {
  'use strict';

  // ===== BARRA DE PROGRESO =====
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = (scrollTop / docHeight) * 100;
    if (progressBar) progressBar.style.width = percent + '%';
  });

  // ===== HEADER SCROLL =====
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }

  // ===== MOBILE MENU =====
  const menuToggle = document.getElementById('menuToggle');
  const navList = document.querySelector('.nav-list');

  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      navList.classList.toggle('active');
      menuToggle.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon) icon.className = navList.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
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

  // ===== HERO PARTICLES =====
  function initHeroParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = (100 + Math.random() * 20) + '%';
      particle.style.animationDuration = (8 + Math.random() * 12) + 's';
      particle.style.animationDelay = Math.random() * 10 + 's';
      particle.style.opacity = 0.3 + Math.random() * 0.6;
      particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
      container.appendChild(particle);
    }
  }

  // ===== TYPING EFFECT =====
  function initTypingEffect() {
    const el = document.getElementById('typingText');
    if (!el) return;

    const phrases = [
      'El 70% de las empresas pierde documentos por falta de custodia.',
      'Cada día sin custodia, tus documentos están en riesgo.',
      'Mientras tú dudas, tu competencia ya los protegió.',
      'Custodiamos lo que otros descuidan.'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = phrases[phraseIndex];
      if (!isDeleting) {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(type, 2200);
          return;
        }
        setTimeout(type, 55);
      } else {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 350);
          return;
        }
        setTimeout(type, 25);
      }
    }
    type();
  }

  // ===== CARRUSEL AUTOMÁTICO cada 2s =====
  function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    if (!track) return;

    const slides = track.querySelectorAll('.carousel-slide');
    const total = slides.length;
    let current = 0;
    let autoplayTimer = null;

    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

    function goTo(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      current = index;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function next() { goTo(current + 1); }

    function startAuto() {
      stopAuto();
      autoplayTimer = setInterval(next, 2000);
    }

    function stopAuto() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    const container = document.getElementById('custodiaCarousel');
    if (container) {
      container.addEventListener('mouseenter', stopAuto);
      container.addEventListener('mouseleave', startAuto);
    }

    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else goTo(current - 1);
      }
      isDragging = false;
    });

    startAuto();
  }

  // ===== WHATSAPP WIDGET =====
  const waWidget = document.getElementById('whatsappWidget');
  const waToggle = document.getElementById('whatsappToggle');
  const waClose = document.getElementById('whatsappClose');
  const waBadge = waWidget ? waWidget.querySelector('.whatsapp-badge') : null;

  const waTimeEl = document.getElementById('waTime');
  if (waTimeEl) {
    const now = new Date();
    waTimeEl.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  }

  if (waToggle && waWidget) {
    waToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      waWidget.classList.toggle('open');
      if (waWidget.classList.contains('open') && waBadge) waBadge.style.display = 'none';
    });
  }

  if (waClose && waWidget) {
    waClose.addEventListener('click', (e) => {
      e.stopPropagation();
      waWidget.classList.remove('open');
    });
  }

  document.addEventListener('click', (e) => {
    if (waWidget && waWidget.classList.contains('open') && !waWidget.contains(e.target)) {
      waWidget.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && waWidget) waWidget.classList.remove('open');
  });

  // ===== SMOOTH SCROLL =====
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

  // Iniciar
  initHeroParticles();
  initTypingEffect();
  initCarousel();

})();