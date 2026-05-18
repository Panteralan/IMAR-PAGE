// ================================================
// IMAR Page — supabase.js
// Conexión a Supabase para manejo de visibilidad
// ================================================

const SUPABASE_URL = 'https://imrpdoxwthbilcgaksis.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltcnBkb3h3dGhiaWxjZ2Frc2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MDY1MzgsImV4cCI6MjA5NDI4MjUzOH0.j1UJBaz0EsWkW6QMPew6gZmo_OomOiOJzmRpvCU5oMk';

const DB = {

  // Obtener visibilidad de todas las tarjetas de un grado
  obtenerVisibilidad: async function(grado) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/visibilidad?grado=eq.${grado}&select=card_id,visible`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (!res.ok) return {};
      const data = await res.json();
      const mapa = {};
      data.forEach(row => { mapa[row.card_id] = row.visible; });
      return mapa;
    } catch(e) {
      console.error('Error obteniendo visibilidad:', e);
      return {};
    }
  },

  // Guardar o actualizar visibilidad — usa DELETE + INSERT para evitar el 409
  setVisibilidad: async function(grado, card_id, visible) {
    try {
      // 1. Borrar el registro si existe
      await fetch(
        `${SUPABASE_URL}/rest/v1/visibilidad?grado=eq.${grado}&card_id=eq.${card_id}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // 2. Insertar el nuevo valor
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/visibilidad`,
        {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ grado, card_id, visible })
        }
      );

      return res.ok;
    } catch(e) {
      console.error('Error guardando visibilidad:', e);
      return false;
    }
  },

  // Obtener visibilidad de TODOS los grados (para el panel admin)
  obtenerTodo: async function() {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/visibilidad?select=grado,card_id,visible`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (!res.ok) return {};
      const data = await res.json();
      const mapa = {};
      data.forEach(row => {
        if (!mapa[row.grado]) mapa[row.grado] = {};
        mapa[row.grado][row.card_id] = row.visible;
      });
      return mapa;
    } catch(e) {
      console.error('Error obteniendo todo:', e);
      return {};
    }
  }

};
