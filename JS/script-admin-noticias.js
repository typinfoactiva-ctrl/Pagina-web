(function() {
  'use strict';

  const API_URL = '../PHP/noticias-api.php';
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

  let noticiasData = [];

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
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          noticiasData = data.data;
          renderNoticias();
        } else {
          mostrarNotificacion('Error al cargar noticias: ' + data.error, 'error');
          if (data.error === 'No autorizado. Se requiere rol de administrador.') {
            setTimeout(() => {
              window.location.href = 'acceso-cliente.html';
            }, 3000);
          }
        }
      })
      .catch(error => {
        console.error('Error:', error);
        mostrarNotificacion('Error de conexión con el servidor', 'error');
      });
  }

  function renderNoticias() {
    const filtro = filtroNoticias.value.toLowerCase().trim();
    let filtered = noticiasData;

    if (filtro) {
      filtered = noticiasData.filter(n =>
        n.titulo.toLowerCase().includes(filtro) ||
        n.descripcion.toLowerCase().includes(filtro) ||
        n.categoria.toLowerCase().includes(filtro)
      );
    }

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
        <div class="noticia-card-image" style="background-image: url('${noticia.imagen_url || 'https://via.placeholder.com/400x200/163340/FFFFFF?text=Infoactiva'}');">
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

  window.eliminarNoticia = function(id) {
    if (!confirm('¿Estás seguro de eliminar esta noticia?')) return;

    fetch(API_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          mostrarNotificacion('Noticia eliminada correctamente', 'success');
          cargarNoticias();
        } else {
          mostrarNotificacion('Error: ' + data.error, 'error');
        }
      })
      .catch(error => {
        mostrarNotificacion('Error de conexión', 'error');
      });
  };

  window.editarNoticia = function(id) {
    const noticia = noticiasData.find(n => n.id === id);
    if (!noticia) return;

    noticiaId.value = noticia.id;
    tituloInput.value = noticia.titulo;
    categoriaSelect.value = noticia.categoria;
    descripcionInput.value = noticia.descripcion;
    imagenUrlInput.value = noticia.imagen_url || '';
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

    const id = parseInt(noticiaId.value);
    const titulo = tituloInput.value.trim();
    const categoria = categoriaSelect.value;
    const descripcion = descripcionInput.value.trim();
    const imagen_url = imagenUrlInput.value.trim();
    const fecha = fechaInput.value;

    if (!titulo || !descripcion || !fecha) {
      mostrarNotificacion('Por favor, completa todos los campos obligatorios.', 'error');
      return;
    }

    const method = id ? 'PUT' : 'POST';
    const body = id
      ? { id, titulo, categoria, descripcion, imagen_url, fecha }
      : { titulo, categoria, descripcion, imagen_url, fecha };

    fetch(API_URL, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          mostrarNotificacion(id ? 'Noticia actualizada' : 'Noticia agregada', 'success');
          cerrarFormulario();
          cargarNoticias();
        } else {
          mostrarNotificacion('Error: ' + data.error, 'error');
        }
      })
      .catch(error => {
        mostrarNotificacion('Error de conexión', 'error');
      });
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
  cargarNoticias();

  window.editarNoticia = editarNoticia;
  window.eliminarNoticia = eliminarNoticia;
  window.cargarNoticias = cargarNoticias;

})();