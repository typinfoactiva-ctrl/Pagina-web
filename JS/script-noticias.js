(function() {
  'use strict';

  // ============================================================
  // DATOS DE NOTICIAS (SIMULACIÓN DE BASE DE DATOS)
  // ============================================================
  let noticias = [
    {
      id: 1,
      titulo: 'Infoactiva celebra 15 años de innovación documental',
      categoria: 'Eventos',
      descripcion: 'Infoactiva cumple 15 años transformando la gestión documental en Bolivia con tecnología de vanguardia y un equipo comprometido.',
      imagenUrl: '',
      fecha: '2026-09-01'
    },
    {
      id: 2,
      titulo: 'Nuevo sistema de digitalización con IA',
      categoria: 'Tecnología',
      descripcion: 'Lanzamos nuestro nuevo sistema de digitalización impulsado por Inteligencia Artificial, que reduce los tiempos de procesamiento en un 70%.',
      imagenUrl: '',
      fecha: '2026-08-25'
    },
    {
      id: 3,
      titulo: 'Infoactiva presente en el Congreso de Archivística 2026',
      categoria: 'Eventos',
      descripcion: 'Nuestro equipo participó como expositor en el Congreso Nacional de Archivística, compartiendo las últimas tendencias en gestión documental.',
      imagenUrl: '',
      fecha: '2026-08-15'
    }
  ];

  let nextId = 4;

  // ============================================================
  // ELEMENTOS DEL DOM
  // ============================================================
  const noticiasGrid = document.getElementById('noticiasGrid');
  const noticiasCount = document.getElementById('noticiasCount');
  const filtroNoticias = document.getElementById('filtroNoticias');

  const formWrapper = document.getElementById('noticiaFormWrapper');
  const formTitle = document.getElementById('formTitle');
  const noticiaForm = document.getElementById('noticiaForm');
  const noticiaId = document.getElementById('noticiaId');
  const tituloInput = document.getElementById('titulo');
  const categoriaSelect = document.getElementById('categoria');
  const descripcionInput = document.getElementById('descripcion');
  const imagenUrlInput = document.getElementById('imagenUrl');
  const fechaInput = document.getElementById('fechaPublicacion');

  const btnAgregar = document.getElementById('btnAgregarNoticia');
  const btnCerrarForm = document.getElementById('btnCerrarForm');
  const btnCancelarForm = document.getElementById('btnCancelarForm');
  const btnGuardar = document.getElementById('btnGuardarNoticia');

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
  // FUNCIONES DE RENDERIZADO
  // ============================================================

  function renderNoticias() {
    const filtro = filtroNoticias.value.toLowerCase().trim();
    let filtered = noticias;

    if (filtro) {
      filtered = noticias.filter(n =>
        n.titulo.toLowerCase().includes(filtro) ||
        n.descripcion.toLowerCase().includes(filtro) ||
        n.categoria.toLowerCase().includes(filtro)
      );
    }

    // Ordenar por fecha (más reciente primero)
    filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    noticiasCount.textContent = filtered.length + ' noticia' + (filtered.length !== 1 ? 's' : '');

    if (filtered.length === 0) {
      noticiasGrid.innerHTML = `
        <div class="noticia-card-empty">
          <i class="fas fa-newspaper"></i>
          <h4>No hay noticias</h4>
          <p>Comienza agregando una nueva noticia.</p>
        </div>
      `;
      return;
    }

    noticiasGrid.innerHTML = filtered.map(noticia => `
      <div class="noticia-card" data-id="${noticia.id}">
        <div class="noticia-card-image" style="background-image: url('${noticia.imagenUrl || 'https://via.placeholder.com/400x200/163340/FFFFFF?text=Infoactiva'}');">
          <span class="noticia-card-categoria">${noticia.categoria}</span>
        </div>
        <div class="noticia-card-body">
          <h4>${noticia.titulo}</h4>
          <p>${noticia.descripcion}</p>
        </div>
        <div class="noticia-card-footer">
          <span class="fecha"><i class="fas fa-calendar-alt"></i> ${formatearFecha(noticia.fecha)}</span>
          <div class="acciones">
            <button class="btn-edit" onclick="editarNoticia(${noticia.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-danger" onclick="eliminarNoticia(${noticia.id})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function formatearFecha(fecha) {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const d = new Date(fecha);
    return d.getDate() + ' ' + meses[d.getMonth()] + ' ' + d.getFullYear();
  }

  // ============================================================
  // CRUD OPERACIONES
  // ============================================================

  window.eliminarNoticia = function(id) {
    if (!confirm('¿Estás seguro de eliminar esta noticia?')) return;

    noticias = noticias.filter(n => n.id !== id);
    renderNoticias();
    mostrarNotificacion('Noticia eliminada correctamente', 'success');
  };

  window.editarNoticia = function(id) {
    const noticia = noticias.find(n => n.id === id);
    if (!noticia) return;

    noticiaId.value = noticia.id;
    tituloInput.value = noticia.titulo;
    categoriaSelect.value = noticia.categoria;
    descripcionInput.value = noticia.descripcion;
    imagenUrlInput.value = noticia.imagenUrl || '';
    fechaInput.value = noticia.fecha;

    formTitle.textContent = 'Editar Noticia';
    formWrapper.style.display = 'block';
    formWrapper.scrollIntoView({ behavior: 'smooth' });
  };

  function agregarNoticia() {
    noticiaId.value = '';
    tituloInput.value = '';
    categoriaSelect.value = 'Eventos';
    descripcionInput.value = '';
    imagenUrlInput.value = '';
    fechaInput.value = new Date().toISOString().split('T')[0];

    formTitle.textContent = 'Agregar Nueva Noticia';
    formWrapper.style.display = 'block';
    formWrapper.scrollIntoView({ behavior: 'smooth' });
  }

  function guardarNoticia(e) {
    e.preventDefault();

    const titulo = tituloInput.value.trim();
    const categoria = categoriaSelect.value;
    const descripcion = descripcionInput.value.trim();
    const imagenUrl = imagenUrlInput.value.trim();
    const fecha = fechaInput.value;

    if (!titulo || !descripcion || !fecha) {
      mostrarNotificacion('Por favor, completa todos los campos obligatorios.', 'error');
      return;
    }

    const id = parseInt(noticiaId.value);

    if (id) {
      // Editar
      const index = noticias.findIndex(n => n.id === id);
      if (index !== -1) {
        noticias[index] = {
          ...noticias[index],
          titulo,
          categoria,
          descripcion,
          imagenUrl: imagenUrl || noticias[index].imagenUrl,
          fecha
        };
        mostrarNotificacion('Noticia actualizada correctamente', 'success');
      }
    } else {
      // Agregar
      const nuevaNoticia = {
        id: nextId++,
        titulo,
        categoria,
        descripcion,
        imagenUrl: imagenUrl || '',
        fecha
      };
      noticias.push(nuevaNoticia);
      mostrarNotificacion('Noticia agregada correctamente', 'success');
    }

    cerrarFormulario();
    renderNoticias();
  }

  function cerrarFormulario() {
    formWrapper.style.display = 'none';
    noticiaForm.reset();
    noticiaId.value = '';
  }

  function mostrarNotificacion(mensaje, tipo) {
    const colores = {
      success: '#27ae60',
      error: '#c0392b',
      info: '#2980b9'
    };

    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${colores[tipo] || colores.info};
      color: #fff;
      border-radius: 12px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: 0.95rem;
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
      z-index: 9999;
      animation: slideDown 0.4s ease forwards;
      max-width: 400px;
    `;
    notificacion.textContent = mensaje;

    document.body.appendChild(notificacion);

    setTimeout(() => {
      notificacion.style.opacity = '0';
      notificacion.style.transition = 'opacity 0.4s ease';
      setTimeout(() => notificacion.remove(), 400);
    }, 3000);
  }

  // ============================================================
  // EVENT LISTENERS
  // ============================================================

  btnAgregar.addEventListener('click', agregarNoticia);
  btnCerrarForm.addEventListener('click', cerrarFormulario);
  btnCancelarForm.addEventListener('click', cerrarFormulario);
  noticiaForm.addEventListener('submit', guardarNoticia);
  filtroNoticias.addEventListener('input', renderNoticias);

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
  // INICIALIZAR
  // ============================================================
  renderNoticias();

})();