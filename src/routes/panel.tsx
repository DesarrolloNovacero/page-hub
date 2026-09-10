import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { clientes, opciones, formatoMoneda, type Cliente } from "@/lib/data";
import { cerrarSesion, usuarioActual } from "@/lib/auth";

export const Route = createFileRoute("/panel")({
  head: () => ({
    meta: [
      { title: "Panel de clientes y KPIs | Clientes 360" },
      {
        name: "description",
        content:
          "Vista general de clientes con filtros por segmento, producto, ciudad y consumo, KPIs y espacio para Power BI.",
      },
      { property: "og:title", content: "Panel de clientes y KPIs | Clientes 360" },
      {
        property: "og:description",
        content: "Tabla de clientes, filtros dinámicos, KPIs y dashboard de Power BI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Panel,
});

const TODOS = "Todos";

function Selector({
  etiqueta,
  valor,
  valores,
  onChange,
}: {
  etiqueta: string;
  valor: string;
  valores: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {etiqueta}
      </span>
      <select
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/25"
      >
        {[TODOS, ...valores].map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </label>
  );
}

function Kpi({ titulo, valor, detalle }: { titulo: string; valor: string; detalle: string }) {
  return (
    <div className="surface-card p-5">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{titulo}</p>
      <p className="mt-2 font-display text-3xl font-semibold">{valor}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detalle}</p>
    </div>
  );
}

function Estado({ estado }: { estado: Cliente["estado"] }) {
  const estilos: Record<Cliente["estado"], string> = {
    Activo: "bg-success/12 text-success",
    "En riesgo": "bg-destructive/12 text-destructive",
    Nuevo: "bg-primary/12 text-primary",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${estilos[estado]}`}>
      {estado}
    </span>
  );
}

function Panel() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<string | null>(null);
  const [segmento, setSegmento] = useState(TODOS);
  const [producto, setProducto] = useState(TODOS);
  const [ciudad, setCiudad] = useState(TODOS);
  const [consumo, setConsumo] = useState(TODOS);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const u = usuarioActual();
    if (!u) navigate({ to: "/" });
    else setUsuario(u);
  }, [navigate]);

  const filtrados = useMemo(
    () =>
      clientes.filter(
        (c) =>
          (segmento === TODOS || c.segmento === segmento) &&
          (producto === TODOS || c.producto === producto) &&
          (ciudad === TODOS || c.ciudad === ciudad) &&
          (consumo === TODOS || c.consumo === consumo) &&
          c.nombre.toLowerCase().includes(busqueda.toLowerCase()),
      ),
    [segmento, producto, ciudad, consumo, busqueda],
  );

  const ingresos = filtrados.reduce((a, c) => a + c.ingresos, 0);
  const contratos = filtrados.reduce((a, c) => a + c.contratos, 0);
  const satisfaccion = filtrados.length
    ? filtrados.reduce((a, c) => a + c.satisfaccion, 0) / filtrados.length
    : 0;
  const enRiesgo = filtrados.filter((c) => c.estado === "En riesgo").length;

  const porCiudad = useMemo(() => {
    const mapa = new Map<string, number>();
    filtrados.forEach((c) => mapa.set(c.ciudad, (mapa.get(c.ciudad) ?? 0) + c.ingresos));
    const max = Math.max(1, ...mapa.values());
    return [...mapa.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ k, v, pct: (v / max) * 100 }));
  }, [filtrados]);

  const limpiar = () => {
    setSegmento(TODOS);
    setProducto(TODOS);
    setCiudad(TODOS);
    setConsumo(TODOS);
    setBusqueda("");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="brand-gradient flex size-9 items-center justify-center rounded-lg font-display text-sm font-bold text-primary-foreground">
              C3
            </div>
            <div>
              <h1 className="text-base font-semibold">Clientes 360</h1>
              <p className="text-xs text-muted-foreground">Panel analítico de cartera</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{usuario}</span>
            <button
              onClick={() => {
                cerrarSesion();
                navigate({ to: "/" });
              }}
              className="rounded-lg border border-input px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8">
        <section className="surface-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Filtros</h2>
            <button onClick={limpiar} className="text-sm font-medium text-primary hover:underline">
              Limpiar filtros
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Selector etiqueta="Segmento" valor={segmento} valores={opciones.segmentos} onChange={setSegmento} />
            <Selector etiqueta="Producto" valor={producto} valores={opciones.productos} onChange={setProducto} />
            <Selector etiqueta="Ciudad" valor={ciudad} valores={opciones.ciudades} onChange={setCiudad} />
            <Selector etiqueta="Consumo" valor={consumo} valores={opciones.consumos} onChange={setConsumo} />
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Buscar
              </span>
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Nombre del cliente"
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/25"
              />
            </label>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi titulo="Ingresos" valor={formatoMoneda(ingresos)} detalle={`${filtrados.length} clientes en la selección`} />
          <Kpi titulo="Contratos activos" valor={String(contratos)} detalle="Suma de contratos vigentes" />
          <Kpi titulo="Satisfacción media" valor={`${satisfaccion.toFixed(1)}%`} detalle="Índice NPS interno" />
          <Kpi titulo="Clientes en riesgo" valor={String(enRiesgo)} detalle="Requieren seguimiento comercial" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="surface-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold">Vista general de clientes</h2>
              <span className="text-xs text-muted-foreground">{filtrados.length} resultados</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Cliente</th>
                    <th className="px-5 py-3 font-semibold">Segmento</th>
                    <th className="px-5 py-3 font-semibold">Producto</th>
                    <th className="px-5 py-3 font-semibold">Ciudad</th>
                    <th className="px-5 py-3 font-semibold">Consumo</th>
                    <th className="px-5 py-3 text-right font-semibold">Ingresos</th>
                    <th className="px-5 py-3 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((c) => (
                    <tr key={c.id} className="border-t border-border/70 hover:bg-secondary/40">
                      <td className="px-5 py-3">
                        <div className="font-medium">{c.nombre}</div>
                        <div className="text-xs text-muted-foreground">
                          {c.id} · última compra {c.ultimaCompra}
                        </div>
                      </td>
                      <td className="px-5 py-3">{c.segmento}</td>
                      <td className="px-5 py-3">{c.producto}</td>
                      <td className="px-5 py-3">{c.ciudad}</td>
                      <td className="px-5 py-3">{c.consumo}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{formatoMoneda(c.ingresos)}</td>
                      <td className="px-5 py-3">
                        <Estado estado={c.estado} />
                      </td>
                    </tr>
                  ))}
                  {filtrados.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                        No hay clientes con estos filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="surface-card p-5">
            <h2 className="text-sm font-semibold">Ingresos por ciudad</h2>
            <div className="mt-5 space-y-4">
              {porCiudad.map(({ k, v, pct }) => (
                <div key={k} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{k}</span>
                    <span className="tabular-nums text-muted-foreground">{formatoMoneda(v)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="brand-gradient h-2 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
              {porCiudad.length === 0 && (
                <p className="text-sm text-muted-foreground">Sin datos para graficar.</p>
              )}
            </div>
          </div>
        </section>

        <section className="surface-card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold">Dashboard Power BI</h2>
              <p className="text-xs text-muted-foreground">
                Sección preparada para embeber el informe (iframe seguro).
              </p>
            </div>
            <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent-foreground">
              Listo para integrar
            </span>
          </div>
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 bg-muted/40 p-10 text-center">
            <p className="max-w-md text-sm text-muted-foreground">
              Cuando tengas la URL de publicación del informe, se coloca aquí un{" "}
              <code className="rounded bg-card px-1.5 py-0.5 text-xs">iframe</code> con el enlace
              &ldquo;Insertar en un sitio web&rdquo; de Power BI y el panel queda embebido.
            </p>
            <div className="w-full max-w-2xl rounded-lg border border-dashed border-border bg-card p-8 text-xs text-muted-foreground">
              Área reservada para el informe · 16:9
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Demostración técnica · datos ficticios
      </footer>
    </div>
  );
}
