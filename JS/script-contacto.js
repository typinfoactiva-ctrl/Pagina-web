(function() {
  'use strict';

  // ===== CONFIG =====
const API_URL = '../php/contactos-api.php';

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
      'Escríbenos o llámanos al 78960750.',
      'Llena el formulario y te responderemos a la brevedad.',
      'Estamos listos para ayudarte con tu gestión documental.',
      'Tu información merece la mejor protección.'
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

  // ===== FORMULARIO =====
  function initForm() {
    const form = document.getElementById('contactForm');
    const successBox = document.getElementById('formSuccess');
    const btnNuevo = document.getElementById('btnNuevoMensaje');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        const group = field.closest('.form-group');
        let fieldValid = true;

        if (!field.value.trim()) fieldValid = false;

        if (field.type === 'email' && field.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value.trim())) fieldValid = false;
        }

        if (!fieldValid) {
          isValid = false;
          if (group) group.classList.add('has-error');
        } else {
          if (group) group.classList.remove('has-error');
        }
      });

      if (!isValid) {
        const firstError = form.querySelector('.has-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const input = firstError.querySelector('input, select, textarea');
          if (input) input.focus();
        }
        return;
      }

      const formData = {
        nombre: form.nombre.value.trim(),
        email: form.email.value.trim(),
        telefono: form.telefono.value.trim(),
        servicio: form.servicio.value,
        ciudad: form.ciudad.value,
        empresa: form.empresa.value.trim(),
        descripcion: form.descripcion.value.trim()
      };

      const submitBtn = form.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Enviando...</span> <i class="fas fa-spinner fa-spin"></i>';

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          try {
            const contactos = JSON.parse(localStorage.getItem('infoactiva_contactos') || '[]');
            contactos.push({ ...formData, id: result.id, fecha: new Date().toISOString() });
            localStorage.setItem('infoactiva_contactos', JSON.stringify(contactos));
          } catch (err) { /* ignorar */ }

          form.style.display = 'none';
          if (successBox) successBox.classList.add('active');
        } else {
          alert('Error: ' + (result.error || 'No se pudo enviar el mensaje'));
        }
      } catch (error) {
        console.error('Error al enviar:', error);
        alert('No se pudo conectar con el servidor. Verifica que XAMPP esté corriendo.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });

    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        const group = field.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
      field.addEventListener('change', () => {
        const group = field.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
    });

    if (btnNuevo) {
      btnNuevo.addEventListener('click', () => {
        form.reset();
        form.style.display = 'flex';
        if (successBox) successBox.classList.remove('active');
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
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

  initHeroParticles();
  initTypingEffect();
  initForm();

})();