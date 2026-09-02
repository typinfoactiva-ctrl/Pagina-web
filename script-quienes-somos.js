(function() {
  'use strict';

  // ===== HEADER SCROLL =====
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ===== MOBILE MENU =====
  const menuToggle = document.getElementById('menuToggle');
  const navList = document.querySelector('.nav-list');

  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      navList.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      icon.className = navList.classList.contains('active') 
        ? 'fas fa-times' 
        : 'fas fa-bars';
    });

    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('active');
        menuToggle.querySelector('i').className = 'fas fa-bars';
      });
    });
  }

  // ===== ANIMACIONES SCROLL =====
  const animateElements = document.querySelectorAll(
    '.mv-card, .value-card, .city-card, .contact-item'
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

  // ===== CONTADOR DE AÑOS =====
  const yearElements = document.querySelectorAll('.intro-stat .stat-number');
  yearElements.forEach(el => {
    const target = el.textContent;
    if (target.includes('+')) return;
    
    const num = parseInt(target);
    if (!isNaN(num) && num > 0) {
      let current = 0;
      const duration = 1500;
      const startTime = performance.now();
      
      function updateYear(time) {
        const elapsed = time - startTime;
        let progress = Math.min(elapsed / duration, 1);
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const value = Math.floor(eased * num);
        el.textContent = value;
        if (progress < 1) {
          requestAnimationFrame(updateYear);
        } else {
          el.textContent = target;
        }
      }
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            requestAnimationFrame(updateYear);
            observer.disconnect();
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(el);
    }
  });

})();