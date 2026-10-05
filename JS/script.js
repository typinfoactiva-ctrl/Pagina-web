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

  // ===== LOADER =====
  const loader = document.getElementById('loader');
  const mainContent = document.getElementById('main-content');
  const loaderBar = document.getElementById('loaderBar');
  const loaderText = document.querySelector('.loader-text');
  const loaderPercentage = document.getElementById('loaderPercentage');

  let progress = 0;
  const duration = 2200;
  const startTime = performance.now();

  function updateLoader(currentTime) {
    const elapsed = currentTime - startTime;
    progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const percent = Math.floor(eased * 100);

    if (loaderBar) loaderBar.style.width = percent + '%';
    if (loaderPercentage) loaderPercentage.textContent = percent + '%';

    if (loaderText) {
      if (percent < 25) loaderText.textContent = 'Inicializando servicios...';
      else if (percent < 50) loaderText.textContent = 'Preparando experiencia...';
      else if (percent < 75) loaderText.textContent = 'Cargando información...';
      else if (percent < 100) loaderText.textContent = 'Casi listo...';
      else loaderText.textContent = '¡Listo!';
    }

    if (progress < 1) requestAnimationFrame(updateLoader);
    else {
      setTimeout(() => {
        if (loader) loader.classList.add('hidden');
        if (mainContent) mainContent.style.display = 'block';
        document.body.style.overflow = 'auto';
        initPageAnimations();
      }, 400);
    }
  }

  function initPageAnimations() {
    animateCounters();
    initTypingEffect();
    initHeroParticles();
    initStatTilt();
    initScheduleBadge();
    initScheduleSection();
    initFooterSchedule();
  }

  // ===== HEADER SCROLL =====
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  // ===== MOBILE MENU =====
  const menuToggle = document.getElementById('menuToggle');
  const navList = document.getElementById('navList');
  const navClose = document.getElementById('navClose');
  const navBackdrop = document.getElementById('navBackdrop');

  function openMenu() {
    if (!navList || !menuToggle) return;

    navList.classList.add('active');
    menuToggle.classList.add('active');
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';

    const icon = menuToggle.querySelector('i');
    if (icon) icon.className = 'fas fa-times';
  }

  function closeMenu() {
    if (!navList || !menuToggle) return;

    navList.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';

    const icon = menuToggle.querySelector('i');
    if (icon) icon.className = 'fas fa-bars';
  }

  if (menuToggle && navList) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navList.classList.contains('active')) closeMenu();
      else openMenu();
    });
  }

  if (navClose) {
    navClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMenu);
  }

  if (navList) {
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(closeMenu, 100);
      });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // ===== CONTADORES =====
  function animateCounters() {
    const counters = [
      { el: document.getElementById('counter1'), target: 27000000, suffix: 'M' },
      { el: document.getElementById('counter3'), target: 187523, suffix: '' },
      { el: document.getElementById('counter2'), target: 3, suffix: '' }
    ];

    counters.forEach((counter) => {
      if (!counter.el) return;
      let current = 0;
      const dur = 2000;
      const steps = 70;
      const stepValue = Math.ceil(counter.target / steps);

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= counter.target) {
          current = counter.target;
          clearInterval(timer);
        }
        let display = current;
        if (counter.suffix === 'M' && current >= 1000000) {
          display = (current / 1000000).toFixed(1) + 'M';
        } else if (counter.suffix === '+') {
          display = current + '+';
        } else if (counter.suffix === '') {
          display = current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        counter.el.textContent = display;
      }, dur / steps);
    });
  }

  // ===== TYPING EFFECT =====
  function initTypingEffect() {
    const el = document.getElementById('typingText');
    if (!el) return;

    const phrases = [
      'Cada día sin digitalizar, tu información corre más riesgo.',
      'Mientras tú dudas, tu competencia ya está en la nube.',
      'El 60% de las empresas pierden datos por no digitalizar.',
      'Atendemos de Lunes a Viernes y Sábados por la mañana.',
      'Protegemos lo que otros descuidan.'
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

  // ===== STAT TILT + SHINE =====
  function initStatTilt() {
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.03)`;
        card.style.setProperty('--mouse-x', (x / rect.width) * 100 + '%');
        card.style.setProperty('--mouse-y', (y / rect.height) * 100 + '%');
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ===== HORARIO DINÁMICO EN BADGE DEL HERO =====
  function initScheduleBadge() {
    const badge = document.querySelector('.hero-badge');
    if (!badge) return;

    const status = getScheduleStatus();
    const icon = badge.querySelector('i');
    const textNodes = Array.from(badge.childNodes).filter(n => n.nodeType === 3);

    if (status.isOpen) {
      if (icon) icon.className = 'fas fa-door-open';
      if (textNodes.length) textNodes[textNodes.length - 1].textContent = ' Estamos abiertos ahora';
      badge.classList.add('open');
    } else {
      if (icon) icon.className = 'fas fa-clock';
      if (textNodes.length) textNodes[textNodes.length - 1].textContent = ' Lun–Vie 08:00–17:00 · Sáb 09:00–12:30';
      badge.classList.remove('open');
    }
  }

  // ===== HORARIO DINÁMICO EN SECCIÓN =====
  function initScheduleSection() {
    const statusEl = document.getElementById('scheduleStatus');
    const statusText = document.querySelector('.schedule-status-text');
    const statusDot = document.querySelector('.schedule-status-dot');
    const weekdayTag = document.getElementById('scheduleStatusWeekday');
    const saturdayTag = document.getElementById('scheduleStatusSaturday');

    if (!statusEl || !statusText) return;

    const status = getScheduleStatus();

    if (status.isOpen) {
      statusEl.classList.add('open');
      statusEl.classList.remove('closed');
      if (statusDot) statusDot.classList.add('open');
      statusText.textContent = `Estamos abiertos ahora · Cerramos a las ${status.closeHour}`;
    } else {
      statusEl.classList.add('closed');
      statusEl.classList.remove('open');
      if (statusDot) statusDot.classList.remove('open');
      statusText.textContent = `Cerrado · Abrimos ${status.nextOpenText}`;
    }

    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();

    if (weekdayTag) {
      const isWeekday = day >= 1 && day <= 5;
      const isOpenWeekday = isWeekday && hour >= 8 && hour < 17;
      weekdayTag.textContent = isOpenWeekday ? 'Abierto ahora' : 'Horario laboral';
      weekdayTag.classList.toggle('open', isOpenWeekday);
    }

    if (saturdayTag) {
      const isSaturday = day === 6;
      const isOpenSat = isSaturday && ((hour === 9) || (hour > 9 && hour < 12) || (hour === 12 && minute <= 30));
      saturdayTag.textContent = isOpenSat ? 'Abierto ahora' : 'Medio día';
      saturdayTag.classList.toggle('open', isOpenSat);
    }
  }

  // ===== HORARIO EN FOOTER =====
  function initFooterSchedule() {
    const item = document.querySelector('.footer-schedule-item');
    if (!item) return;

    const status = getScheduleStatus();
    const color = status.isOpen ? '#4ade80' : 'rgba(255,255,255,0.6)';
    const label = status.isOpen ? 'Abierto ahora' : 'Cerrado';

    item.innerHTML = `<i class="fas fa-clock"></i> <span style="color:${color}">${label}</span> · Lun–Vie 08:00–17:00 · Sáb 09:00–12:30`;
  }

  // ===== UTILIDAD: ESTADO DEL HORARIO =====
  function getScheduleStatus() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();

    let isOpen = false;
    let closeHour = '';
    let nextOpenText = '';

    if (day >= 1 && day <= 5) {
      const beforeClose = hour < 17;
      const afterOpen = hour >= 8;
      isOpen = afterOpen && beforeClose;
      closeHour = '05:00 p.m.';

      if (!isOpen) {
        if (hour < 8) nextOpenText = 'hoy a las 08:00 a.m.';
        else nextOpenText = 'mañana a las 08:00 a.m.';
      }
    } else if (day === 6) {
      const afterOpen = hour >= 9;
      const beforeClose = hour < 12 || (hour === 12 && minute <= 30);
      isOpen = afterOpen && beforeClose;
      closeHour = '12:30 p.m.';

      if (!isOpen) {
        if (hour < 9) nextOpenText = 'hoy a las 09:00 a.m.';
        else nextOpenText = 'el lunes a las 08:00 a.m.';
      }
    } else {
      isOpen = false;
      nextOpenText = 'el lunes a las 08:00 a.m.';
    }

    return { isOpen, closeHour, nextOpenText };
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

  // Iniciar loader
  requestAnimationFrame(updateLoader);

})(); 