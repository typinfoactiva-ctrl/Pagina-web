(function() {
  'use strict';

  // ===== LOADER MEJORADO CON DEGRADADO =====
  const loader = document.getElementById('loader');
  const mainContent = document.getElementById('main-content');
  const loaderBar = document.getElementById('loaderBar');
  const loaderText = document.querySelector('.loader-text');
  const loaderPercentage = document.getElementById('loaderPercentage');

  let progress = 0;
  const duration = 2200; // 2.2 segundos
  const startTime = performance.now();

  function updateLoader(currentTime) {
    const elapsed = currentTime - startTime;
    progress = Math.min(elapsed / duration, 1);
    
    // Easing easeOutQuart
    const eased = 1 - Math.pow(1 - progress, 3);
    const percent = Math.floor(eased * 100);
    
    loaderBar.style.width = percent + '%';
    
    // Actualizar porcentaje
    if (loaderPercentage) {
      loaderPercentage.textContent = percent + '%';
    }
    
    // Cambiar texto según progreso
    if (percent < 25) {
      loaderText.textContent = 'Inicializando servicios...';
    } else if (percent < 50) {
      loaderText.textContent = 'Preparando experiencia...';
    } else if (percent < 75) {
      loaderText.textContent = 'Cargando información...';
    } else if (percent < 100) {
      loaderText.textContent = 'Casi listo...';
    } else {
      loaderText.textContent = '¡Listo!';
    }

    if (progress < 1) {
      requestAnimationFrame(updateLoader);
    } else {
      // Ocultar loader y mostrar contenido
      setTimeout(() => {
        loader.classList.add('hidden');
        mainContent.style.display = 'block';
        document.body.style.overflow = 'auto';
        // Iniciar animaciones de la página
        initPageAnimations();
      }, 400);
    }
  }

  function initPageAnimations() {
    // Iniciar contadores
    animateCounters();
    // Iniciar carrusel si existe
    if (typeof initCarousel === 'function') {
      initCarousel();
    }
  }

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
        navList.style.padding = '1.5rem';
        navList.style.gap = '1.2rem';
        navList.style.backdropFilter = 'blur(12px)';
        navList.style.borderRadius = '0 0 24px 24px';
        navList.style.zIndex = '999';
        navList.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
        navList.style.alignItems = 'center';
        
        const links = navList.querySelectorAll('a');
        links.forEach(link => {
          link.style.color = '#1e2a33';
        });
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
        navList.style.backdropFilter = '';
        navList.style.borderRadius = '';
        navList.style.zIndex = '';
        navList.style.boxShadow = '';
        navList.style.alignItems = '';
        
        const links = navList.querySelectorAll('a');
        links.forEach(link => {
          link.style.color = '';
        });
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
        navList.style.backdropFilter = '';
        navList.style.borderRadius = '';
        navList.style.zIndex = '';
        navList.style.boxShadow = '';
        navList.style.alignItems = '';
        
        const links = navList.querySelectorAll('a');
        links.forEach(link => {
          link.style.color = '';
        });
      });
    });
  }

  // ===== CONTADORES ANIMADOS =====
  function animateCounters() {
    const counters = [
      { el: document.getElementById('counter1'), target: 27000000, suffix: 'M' },
      { el: document.getElementById('counter2'), target: 3, suffix: '' },
      { el: document.getElementById('counter3'), target: 187523, suffix: '' }
    ];

    counters.forEach((counter) => {
      if (!counter.el) return;
      let current = 0;
      const duration = 2000;
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
        } else if (counter.suffix === '') {
          display = current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        counter.el.textContent = display;
      }, duration / steps);
    });
  }

  // ===== CARRUSEL =====
  const track = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoPlayInterval = null;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentIndex = index;
    if (track) {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() { goToSlide(currentIndex + 1); }
  function prevSlide() { goToSlide(currentIndex - 1); }

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => { goToSlide(index); resetAutoPlay(); });
  });

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  const carousel = document.getElementById('heroCarousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    startAutoPlay();
  }

  // Iniciar loader
  requestAnimationFrame(updateLoader);

})();