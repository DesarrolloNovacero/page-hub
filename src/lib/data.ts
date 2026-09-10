export type Cliente = {
  id: string;
  nombre: string;
  segmento: "Corporativo" | "PYME" | "Retail" | "Gobierno";
  producto: "Analytics" | "Cloud" | "Soporte" | "Licencias";
  ciudad: "Quito" | "Guayaquil" | "Cuenca" | "Manta" | "Ambato";
  consumo: "Alto" | "Medio" | "Bajo";
  ingresos: number;
  contratos: number;
  satisfaccion: number;
  estado: "Activo" | "En riesgo" | "Nuevo";
  ultimaCompra: string;
};

const nombres = [
  "Andes Logistics","Marea Textiles","Nova Farmacéutica","Grupo Pacífico","Corporación Vinci",
  "Delta Alimentos","Sierra Digital","Astilleros Sur","Café del Valle","Metrópoli Seguros",
  "Vertex Ingeniería","Aurora Retail","Puerto Verde","Kuntur Energía","Rio Claro Aguas",
  "Cima Consultores","Frontera Motors","Bahía Turismo","Origen Agro","Cobre y Acero",
  "Lumen Educación","Tejido Andino","Nexo Telecom","Volcán Minería","Semilla Salud",
  "Pacífico Legal","Orbital Software","Mercado Fresco","Ruta Norte","Ceibo Constructora",
];

const segmentos: Cliente["segmento"][] = ["Corporativo", "PYME", "Retail", "Gobierno"];
const productos: Cliente["producto"][] = ["Analytics", "Cloud", "Soporte", "Licencias"];
const ciudades: Cliente["ciudad"][] = ["Quito", "Guayaquil", "Cuenca", "Manta", "Ambato"];
const consumos: Cliente["consumo"][] = ["Alto", "Medio", "Bajo"];
const estados: Cliente["estado"][] = ["Activo", "En riesgo", "Nuevo"];

// Generador determinista para que los datos sean estables entre SSR y cliente.
function pseudo(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export const clientes: Cliente[] = nombres.map((nombre, i) => {
  const r = (k: number) => pseudo(i + k * 7.13);
  return {
    id: `CL-${String(1024 + i)}`,
    nombre,
    segmento: segmentos[Math.floor(r(1) * segmentos.length)],
    producto: productos[Math.floor(r(2) * productos.length)],
    ciudad: ciudades[Math.floor(r(3) * ciudades.length)],
    consumo: consumos[Math.floor(r(4) * consumos.length)],
    ingresos: Math.round((12000 + r(5) * 188000) / 100) * 100,
    contratos: 1 + Math.floor(r(6) * 9),
    satisfaccion: Math.round((60 + r(7) * 40) * 10) / 10,
    estado: estados[Math.floor(r(8) * estados.length)],
    ultimaCompra: new Date(2026, Math.floor(r(9) * 9), 1 + Math.floor(r(10) * 27))
      .toISOString()
      .slice(0, 10),
  };
});

export const opciones = { segmentos, productos, ciudades, consumos };

export const formatoMoneda = (v: number) =>
  new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
