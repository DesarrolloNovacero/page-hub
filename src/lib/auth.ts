const KEY = "demo_session_user";

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
