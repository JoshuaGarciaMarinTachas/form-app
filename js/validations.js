// js/validations.js

export function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

export function validarTelefono(telefono) {
  // Solo números (sin +, sin espacios, sin guiones)
  const soloNumeros = /^[0-9]+$/.test(telefono);

  if (!soloNumeros) return false;

  // Longitud válida: 10 o 12
  if (telefono.length === 10 || telefono.length === 12) {
    return true;
  }

  return false;
}
