// ================================================
// IMAR Page — auth.js
// Maneja login, sesión y protección de páginas
// ================================================

const AUTH = {

  // Lee el JSON de usuarios y valida credenciales
  login: async function (usuario, password) {
    try {
      // Ruta relativa al JSON desde index.html
      const res = await fetch('./bd/usuarios.json');
      const usuarios = await res.json();

      const encontrado = usuarios.find(
        u => u.usuario === usuario.trim() && u.password === password.trim()
      );

      if (encontrado) {
        // Guardamos la sesión en sessionStorage (se borra al cerrar el navegador)
        sessionStorage.setItem('imar_usuario', encontrado.usuario);
        sessionStorage.setItem('imar_rol',     encontrado.rol);
        sessionStorage.setItem('imar_grado',   encontrado.grado);
        return { ok: true, usuario: encontrado };
      } else {
        return { ok: false };
      }
    } catch (e) {
      console.error('Error al leer usuarios:', e);
      return { ok: false, error: true };
    }
  },

  // Cierra sesión y vuelve al login
  logout: function () {
    sessionStorage.clear();
    // Detecta si estamos en una subcarpeta o en la raíz
    const profundidad = window.location.pathname.split('/').length - 2;
    const raiz = '../'.repeat(profundidad);
    window.location.href = raiz + 'index.html';
  },

  // Verifica si hay sesión activa — usar al inicio de cada página protegida
  verificar: function (rolRequerido = null) {
    const usuario = sessionStorage.getItem('imar_usuario');
    const rol     = sessionStorage.getItem('imar_rol');

    if (!usuario) {
      // No hay sesión → volver al login
      const profundidad = window.location.pathname.split('/').length - 2;
      const raiz = '../'.repeat(profundidad);
      window.location.href = raiz + 'index.html';
      return false;
    }

    if (rolRequerido && rol !== rolRequerido) {
      // Rol incorrecto (ej: alumno quiere entrar al admin)
      alert('No tenés permiso para acceder a esta página.');
      window.history.back();
      return false;
    }

    return { usuario, rol, grado: sessionStorage.getItem('imar_grado') };
  },

  // Devuelve los datos de la sesión actual
  sesion: function () {
    return {
      usuario: sessionStorage.getItem('imar_usuario'),
      rol:     sessionStorage.getItem('imar_rol'),
      grado:   sessionStorage.getItem('imar_grado')
    };
  }

};
