/* ============================================================
   NOTICIAS PÚBLICAS - Versión SIN base de datos
   Las noticias viven directamente en el HTML (atributos data-*)
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // ELEMENTOS
  // ============================================================
  const grid          = document.getElementById('noticiasGrid');
  const filtro        = document.getElementById('filtroNoticias');
  const menuToggle    = document.getElementById('menuToggle');
  const navList       = document.querySelector('.nav-list');

  const modal         = document.getElementById('noticiaModal');
  const modalClose    = document.getElementById('modalClose');
  const btnCerrar     = document.getElementById('btnCerrarNoticia');
  const modalImg      = document.getElementById('modalImg');
  const modalCategoria= document.getElementById('modalCategoria');
  const modalFecha    = document.getElementById('modalFecha');
  const modalTitulo   = document.getElementById('modalTitulo');
  const modalDesc     = document.getElementById('modalDescripcion');

  if (!grid) return;

  // ============================================================
  // UTILIDADES
  // ============================================================
  const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  function formatearFecha(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    return `${String(d.getDate()).padStart(2,'0')} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
  }

  // Decodifica entidades HTML almacenadas en data-descripcion
  function decodificarHTML(str) {
    if (!str) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  // ============================================================
  // RENDER DINÁMICO DE FECHA EN TARJETAS
  // (Convierte data-fecha ISO a formato bonito al vuelo)
  // ============================================================
  function pintarFechasTarjetas() {
    grid.querySelectorAll('.noticia-card').forEach(card => {
      const fechaISO = card.dataset.fecha;
      const span = card.querySelector('.noticia-card-fecha');
      if (span && fechaISO) {
        span.innerHTML = `<i class="fas fa-calendar-alt"></i> ${formatearFecha(fechaISO)}`;
      }
    });
  }

  // ============================================================
  // MODAL
  // ============================================================
  function abrirModal(card) {
    const titulo     = card.dataset.titulo || '';
    const fechaISO   = card.dataset.fecha || '';
    const categoria  = card.dataset.categoria || '';
    const imagen     = card.dataset.imagen || '';
    const descripcion= decodificarHTML(card.dataset.descripcion || '');

    modalImg.src             = imagen;
    modalImg.alt             = titulo;
    modalCategoria.textContent = categoria;
    modalFecha.textContent   = formatearFecha(fechaISO);
    modalTitulo.textContent  = titulo;
    modalDesc.innerHTML      = descripcion;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function cerrarModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ============================================================
  // EVENTOS DE TARJETAS
  // ============================================================
  function enlazarTarjetas() {
    grid.querySelectorAll('.noticia-card').forEach(card => {
      if (card.dataset.bound === 'true') return;
      card.dataset.bound = 'true';

      const btn = card.querySelector('.btn-leer-mas');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          abrirModal(card);
        });
      }
    });
  }

  // ============================================================
  // FILTRO DE BÚSQUEDA
  // ============================================================
  function filtrar() {
    const texto = (filtro?.value || '').toLowerCase().trim();
    const cards = grid.querySelectorAll('.noticia-card');
    let visibles = 0;

    cards.forEach(card => {
      const titulo    = (card.dataset.titulo || '').toLowerCase();
      const categoria = (card.dataset.categoria || '').toLowerCase();
      const resumen   = (card.querySelector('.noticia-card-descripcion')?.textContent || '').toLowerCase();

      const coincide = !texto ||
        titulo.includes(texto) ||
        categoria.includes(texto) ||
        resumen.includes(texto);

      card.style.display = coincide ? '' : 'none';
      if (coincide) visibles++;
    });

    // Mensaje "sin resultados"
    let vacio = grid.querySelector('.noticias-empty');
    if (visibles === 0) {
      if (!vacio) {
        vacio = document.createElement('div');
        vacio.className = 'noticias-empty';
        vacio.innerHTML = `
          <i class="fas fa-search"></i>
          <h4>Sin resultados</h4>
          <p>No se encontraron noticias para "<strong>${texto}</strong>".</p>
        `;
        grid.appendChild(vacio);
      } else {
        vacio.querySelector('p').innerHTML =
          `No se encontraron noticias para "<strong>${texto}</strong>".`;
      }
      vacio.style.display = '';
    } else if (vacio) {
      vacio.style.display = 'none';
    }
  }

  // ============================================================
  // MENÚ RESPONSIVE
  // ============================================================
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      const abierto = navList.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon) icon.className = abierto ? 'fas fa-times' : 'fas fa-bars';

      if (abierto) {
        Object.assign(navList.style, {
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          top: '70px',
          left: '0',
          width: '100%',
          background: '#ffffff',
          padding: '1.5rem 2rem',
          gap: '0.8rem',
          zIndex: '999',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          alignItems: 'flex-start'
        });
      } else {
        navList.style.cssText = '';
      }
    });

    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
        navList.style.cssText = '';
      });
    });
  }

  // ============================================================
  // EVENTOS GLOBALES
  // ============================================================
  if (filtro)      filtro.addEventListener('input', filtrar);
  if (modalClose)  modalClose.addEventListener('click', cerrarModal);
  if (btnCerrar)   btnCerrar.addEventListener('click', cerrarModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) cerrarModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) cerrarModal();
  });

  // ============================================================
  // INICIALIZAR
  // ============================================================
  pintarFechasTarjetas();
  enlazarTarjetas();

})();