// ================================================
// IMAR Page — visibilidad.js
// Aplica visibilidad desde Supabase en cada página
// ================================================

const VISIBILIDAD = {

  // Llamar esto al cargar cada página de alumno
  // grado: 'tercero', 'cuarto', 'quinto', 'sexto', 'secundaria'
  aplicar: async function(grado) {
    // Obtener estado desde Supabase
    const mapa = await DB.obtenerVisibilidad(grado);

    // Recorrer todas las tarjetas de la página
    document.querySelectorAll('[data-id]').forEach(card => {
      const cardId = card.dataset.id;

      // Si hay un registro en Supabase, usarlo
      // Si no hay registro, usar el data-bloqueado del HTML como fallback
      let bloqueado;
      if (cardId in mapa) {
        bloqueado = !mapa[cardId]; // visible=true → bloqueado=false
      } else {
        bloqueado = card.dataset.bloqueado === 'true';
      }

      if (bloqueado) {
        card.classList.add('bloqueado');

        // Primaria: candado en título
        const tituloPrim = card.querySelector('.card-titulo');
        if (tituloPrim && !tituloPrim.textContent.startsWith('🔒')) {
          tituloPrim.textContent = '🔒 ' + tituloPrim.textContent.replace(/^\S+\s/, '');
        }

        // Secundaria: texto diferente
        const tituloSec = card.querySelector('.card-titulo');
        if (tituloSec && !tituloSec.textContent.startsWith('[BLOQUEADO]')) {
          const esSec = card.classList.contains('sec-card');
          if (esSec) tituloSec.textContent = '[BLOQUEADO] ' + tituloSec.textContent;
        }

        // Deshabilitar botones
        card.querySelectorAll('.btn-ver, .btn-sec').forEach(btn => {
          btn.removeAttribute('href');
          btn.style.pointerEvents = 'none';
          const esSec = card.classList.contains('sec-card');
          btn.textContent = esSec ? '// ACCESO DENEGADO' : '🔒 No disponible';
        });

      } else {
        card.classList.remove('bloqueado');
      }
    });
  }

};
