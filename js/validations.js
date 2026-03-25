// js/validations.js

export function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

export function validarTelefono(tel) {
  return /^[0-9]{12}$/.test(tel);
}
