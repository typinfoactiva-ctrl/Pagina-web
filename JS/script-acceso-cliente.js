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

  // ===== TOGGLE PASSWORD (OJO) =====
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('mousedown', function(e) {
      e.preventDefault();
      passwordInput.type = 'text';
      this.querySelector('i').className = 'fas fa-eye-slash';
    });

    togglePassword.addEventListener('mouseup', function(e) {
      e.preventDefault();
      passwordInput.type = 'password';
      this.querySelector('i').className = 'fas fa-eye';
    });

    togglePassword.addEventListener('mouseleave', function(e) {
      e.preventDefault();
      passwordInput.type = 'password';
      this.querySelector('i').className = 'fas fa-eye';
    });

    togglePassword.addEventListener('touchstart', function(e) {
      e.preventDefault();
      passwordInput.type = 'text';
      this.querySelector('i').className = 'fas fa-eye-slash';
    });

    togglePassword.addEventListener('touchend', function(e) {
      e.preventDefault();
      passwordInput.type = 'password';
      this.querySelector('i').className = 'fas fa-eye';
    });
  }

  // ===== LOGIN =====
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      const usuario = document.getElementById('usuario').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!usuario || !password) {
        e.preventDefault();
        showError('Por favor, completa todos los campos.');
        return;
      }
    });
  }

  function showError(message) {
    const loginError = document.getElementById('loginError');
    const errorMessage = document.getElementById('errorMessage');
    const usuarioInput = document.getElementById('usuario');
    const passwordInput = document.getElementById('password');

    errorMessage.textContent = message;
    loginError.classList.add('show');
    loginError.style.display = 'flex';
    usuarioInput.classList.add('error');
    passwordInput.classList.add('error');

    setTimeout(() => {
      loginError.classList.remove('show');
      loginError.style.display = 'none';
      usuarioInput.classList.remove('error');
      passwordInput.classList.remove('error');
    }, 5000);
  }

  document.getElementById('usuario')?.addEventListener('input', function() {
    this.classList.remove('error');
    const loginError = document.getElementById('loginError');
    loginError.classList.remove('show');
    loginError.style.display = 'none';
  });

  document.getElementById('password')?.addEventListener('input', function() {
    this.classList.remove('error');
    const loginError = document.getElementById('loginError');
    loginError.classList.remove('show');
    loginError.style.display = 'none';
  });

})();