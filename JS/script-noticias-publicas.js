(function() {
  'use strict';

  // ============================================================
  // API URL - Usando la ruta correcta
  // ============================================================
  const API_URL = '../php/noticias-api.php';
  const noticiasGrid = document.getElementById('noticiasGrid');
  const filtroNoticias = document.getElementById('filtroNoticias');

  // ============================================================
  // MENÚ RESPONSIVE
  // ============================================================
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

  // ============================================================
  // FUNCIONES
  // ============================================================

  function formatearFecha(fecha) {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const d = new Date(fecha);
    return d.getDate() + ' ' + meses[d.getMonth()] + ' ' + d.getFullYear();
  }

  function cargarNoticias() {
    console.log('🔄 Cargando noticias...');
    
    // Mostrar mensaje de carga
    noticiasGrid.innerHTML = `
      <div class="noticia-card-empty">
        <i class="fas fa-spinner fa-spin"></i>
        <h4>Cargando noticias...</h4>
        <p>Por favor espera un momento.</p>
      </div>
    `;

    fetch(API_URL)
      .then(response => {
        console.log('📡 Respuesta del servidor:', response.status);
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('📦 Datos recibidos:', data);
        
        if (data.success) {
          if (data.data && data.data.length > 0) {
            console.log('✅ Noticias encontradas:', data.data.length);
            renderNoticias(data.data);
          } else {
            console.log('⚠️ No hay noticias disponibles');
            mostrarMensaje('No hay noticias disponibles', 'Pronto publicaremos nuevas noticias.');
          }
        } else {
          console.error('❌ Error en la API:', data.error);
          mostrarError(data.error || 'Error al cargar noticias');
        }
      })
      .catch(error => {
        console.error('❌ Error de conexión:', error);
        mostrarError('Error de conexión con el servidor: ' + error.message);
      });
  }

  function renderNoticias(noticias) {
    const filtro = filtroNoticias.value.toLowerCase().trim();
    let filtered = noticias;

    if (filtro) {
      filtered = noticias.filter(n =>
        n.titulo.toLowerCase().includes(filtro) ||
        n.descripcion.toLowerCase().includes(filtro) ||
        n.categoria.toLowerCase().includes(filtro)
      );
    }

    console.log('📊 Mostrando ' + filtered.length + ' noticias');

    if (filtered.length === 0) {
      noticiasGrid.innerHTML = `
        <div class="noticia-card-empty">
          <i class="fas fa-newspaper"></i>
          <h4>No hay noticias disponibles</h4>
          <p>${filtro ? 'No se encontraron noticias que coincidan con tu búsqueda.' : 'Pronto publicaremos nuevas noticias.'}</p>
        </div>
      `;
      return;
    }

    noticiasGrid.innerHTML = filtered.map(noticia => `
      <div class="noticia-card" data-id="${noticia.id}">
        <div class="noticia-card-image" style="background-image: url('${noticia.imagen_url || 'https://via.placeholder.com/400x200/163340/FFFFFF?text=Infoactiva'}');">
          <span class="noticia-card-categoria">${noticia.categoria}</span>
        </div>
        <div class="noticia-card-body">
          <span class="fecha"><i class="fas fa-calendar-alt"></i> ${formatearFecha(noticia.fecha)}</span>
          <h4>${noticia.titulo}</h4>
          <p>${noticia.descripcion}</p>
          <a href="#" class="ver-mas">Leer más <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    `).join('');
  }

  function mostrarMensaje(titulo, mensaje) {
    noticiasGrid.innerHTML = `
      <div class="noticia-card-empty">
        <i class="fas fa-newspaper"></i>
        <h4>${titulo}</h4>
        <p>${mensaje}</p>
      </div>
    `;
  }

  function mostrarError(mensaje) {
    noticiasGrid.innerHTML = `
      <div class="noticia-card-empty">
        <i class="fas fa-exclamation-circle" style="color: #c0392b;"></i>
        <h4>Error al cargar noticias</h4>
        <p>${mensaje}</p>
        <button class="btn-primary" onclick="cargarNoticias()" style="margin-top: 1rem; padding: 0.7rem 2rem; border-radius: 60px; background: #d84e1f; color: #fff; border: none; cursor: pointer;">
          <i class="fas fa-sync-alt"></i> Reintentar
        </button>
      </div>
    `;
  }

  // ============================================================
  // FILTRO DE NOTICIAS
  // ============================================================
  filtroNoticias.addEventListener('input', function() {
    // Si ya hay noticias cargadas, filtrar localmente
    const cards = document.querySelectorAll('.noticia-card');
    const filtro = this.value.toLowerCase().trim();

    if (cards.length === 0) return;

    let visibles = 0;
    cards.forEach(card => {
      const titulo = card.querySelector('h4')?.textContent?.toLowerCase() || '';
      const descripcion = card.querySelector('p')?.textContent?.toLowerCase() || '';
      const categoria = card.querySelector('.noticia-card-categoria')?.textContent?.toLowerCase() || '';

      const coincide = titulo.includes(filtro) || descripcion.includes(filtro) || categoria.includes(filtro);
      card.style.display = coincide ? '' : 'none';
      if (coincide) visibles++;
    });

    // Mostrar mensaje si no hay resultados
    const emptyMessage = document.querySelector('.noticia-card-empty');
    if (visibles === 0 && cards.length > 0) {
      if (!emptyMessage) {
        const grid = document.getElementById('noticiasGrid');
        const msg = document.createElement('div');
        msg.className = 'noticia-card-empty';
        msg.innerHTML = `
          <i class="fas fa-search"></i>
          <h4>No hay resultados</h4>
          <p>No se encontraron noticias que coincidan con tu búsqueda.</p>
        `;
        grid.appendChild(msg);
      }
    } else {
      if (emptyMessage && !emptyMessage.querySelector('.fa-search')) {
        // Solo eliminar si es el mensaje de búsqueda
      }
      const searchEmpty = document.querySelector('.noticia-card-empty .fa-search');
      if (searchEmpty) {
        const parent = searchEmpty.closest('.noticia-card-empty');
        if (parent) parent.remove();
      }
    }
  });

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
  // INICIALIZAR - Cargar noticias al cargar la página
  // ============================================================
  document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Página cargada, iniciando carga de noticias...');
    cargarNoticias();
  });

  // Exponer función para reintentar
  window.cargarNoticias = cargarNoticias;

})();