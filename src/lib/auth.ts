const KEY = "demo_session_user";

const CREDENCIAL_USUARIO = "joshuatunja@gmail.com";
const CREDENCIAL_CLAVE = "Joshua123";

export function validarCredenciales(usuario: string, clave: string): boolean {
  return usuario.trim().toLowerCase() === CREDENCIAL_USUARIO && clave === CREDENCIAL_CLAVE;
}


export function iniciarSesion(usuario: string) {
  if (typeof window !== "undefined") sessionStorage.setItem(KEY, usuario);
}

export function cerrarSesion() {
  if (typeof window !== "undefined") sessionStorage.removeItem(KEY);
}

export function usuarioActual(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(KEY);
}
