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

  // ===== TABS =====
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remover active de todos los botones
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Remover active de todos los paneles
      tabPanels.forEach(panel => panel.classList.remove('active'));
      
      // Activar el botón clickeado
      button.classList.add('active');
      
      // Activar el panel correspondiente
      const tabId = button.getAttribute('data-tab');
      const activePanel = document.getElementById(tabId);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  // ===== ANIMACIONES SCROLL =====
  const animateElements = document.querySelectorAll(
    '.service-card, .benefit-item, .contact-item'
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

  // ===== EFECTO DE CONTADOR EN TABS (opcional) =====
  // Pequeño efecto visual al cambiar de tab
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Efecto sutil en el panel activo
      const activePanel = document.querySelector('.tab-panel.active');
      if (activePanel) {
        activePanel.style.animation = 'none';
        setTimeout(() => {
          activePanel.style.animation = 'fadeIn 0.5s ease';
        }, 10);
      }
    });
  });

})();