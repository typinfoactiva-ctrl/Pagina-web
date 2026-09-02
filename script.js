(function() {
  'use strict';

   const loader = document.getElementById('loader');
  const mainContent = document.getElementById('main-content');
  const loaderBar = document.getElementById('loaderBar');
  const loaderText = document.querySelector('.loader-text');

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
    
    // Cambiar texto según progreso
    if (percent < 30) {
      loaderText.textContent = 'Inicializando servicios...';
    } else if (percent < 60) {
      loaderText.textContent = 'Preparando experiencia...';
    } else if (percent < 90) {
      loaderText.textContent = 'Cargando información...';
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
        // Iniciar animaciones de la página
        initPageAnimations();
      }, 300);
    }
  }

  function initPageAnimations() {
    // Aquí puedes inicializar los contadores, carrusel, etc.
    // Ya están en el script principal, solo los llamamos
    if (typeof initCounters === 'function') {
      initCounters();
    }
    if (typeof initCarousel === 'function') {
      initCarousel();
    }
  }

  // Iniciar loader
  requestAnimationFrame(updateLoader);

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
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() { goToSlide(currentIndex + 1); }
  function prevSlide() { goToSlide(currentIndex - 1); }

  prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
  nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

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
  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);
  startAutoPlay();

  // ===== CONTADORES =====
  const counters = [
    { id: 'counter1', target: 27000000 },
    { id: 'counter2', target: 3 },
    { id: 'counter3', target: 187523 }
  ];

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function animateCounter(element, target, duration = 2000) {
    if (!element) return;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      let progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = Math.floor(eased * target);
      element.textContent = formatNumber(currentValue);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = formatNumber(target);
      }
    }
    requestAnimationFrame(update);
  }

  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach((c) => {
            const el = document.getElementById(c.id);
            if (el) animateCounter(el, c.target);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsGrid);
  }

  // ===== ANIMACIONES SCROLL =====
  const animateElements = document.querySelectorAll(
    '.service-card, .testimonial-card, .contact-item'
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