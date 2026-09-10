import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { iniciarSesion } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clientes 360 | Acceso a la plataforma analítica" },
      {
        name: "description",
        content:
          "Ingresa a Clientes 360: panel de clientes con filtros, KPIs y dashboard de Power BI integrado.",
      },
      { property: "og:title", content: "Clientes 360 | Acceso a la plataforma analítica" },
      {
        property: "og:description",
        content: "Panel de clientes con filtros dinámicos, KPIs y Power BI embebido.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarCredenciales(usuario, clave)) {
      setError("Usuario o clave incorrectos. Revisa los datos e inténtalo de nuevo.");
      return;
    }
    iniciarSesion(usuario.trim());
    navigate({ to: "/panel" });
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="brand-gradient relative hidden flex-col justify-between p-12 text-primary-foreground lg:flex">
        <div className="font-display text-lg font-semibold tracking-tight">Clientes 360</div>
        <div className="max-w-md space-y-6">
          <h1 className="text-5xl leading-[1.05] font-semibold">
            Los datos de tus clientes, en una sola vista.
          </h1>
          <p className="text-base text-primary-foreground/75">
            Explora la cartera por segmento, producto, ciudad y consumo. Revisa KPIs en tiempo real y
            conecta tu dashboard de Power BI.
          </p>
          <div className="flex gap-8 border-t border-primary-foreground/20 pt-6">
            {[
              ["30", "clientes"],
              ["4", "dimensiones"],
              ["1", "dashboard BI"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-3xl font-semibold">{n}</div>
                <div className="text-xs tracking-widest uppercase text-primary-foreground/60">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-primary-foreground/50">Demostración técnica · React + TanStack</p>
      </section>

      <section className="flex items-center justify-center px-6 py-16">
        <form onSubmit={enviar} className="w-full max-w-sm space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-secondary-foreground uppercase">
              Acceso demo
            </span>
            <h2 className="text-3xl font-semibold">Iniciar sesión</h2>
            <p className="text-sm text-muted-foreground">
              Login de demostración: cualquier correo y clave funcionan.
            </p>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Usuario</span>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/25"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Clave</span>
            <input
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/25"
            />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Entrar al panel
          </button>
        </form>
      </section>
    </main>
  );
}
