"use client";
import { useEffect, useState } from "react";

interface Stats {
  total: number;
  porRuta: Record<string, number>;
  porUserAgent: Record<string, number>;
  porDia: Record<string, number>;
}

export default function EstadisticasVisitas() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/visitas-estadisticas")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Cargando estadísticas...</div>;
  if (!stats) return <div className="p-8">No hay datos de visitas.</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Estadísticas de Visitas</h1>
      <p className="mb-4"><b>Total de visitas:</b> {stats.total}</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Visitas por ruta</h2>
      <ul className="mb-4">
        {Object.entries(stats.porRuta).map(([ruta, count]) => (
          <li key={ruta}>{ruta}: {count}</li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Visitas por día</h2>
      <ul className="mb-4">
        {Object.entries(stats.porDia).map(([dia, count]) => (
          <li key={dia}>{dia}: {count}</li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Visitas por User-Agent</h2>
      <ul>
        {Object.entries(stats.porUserAgent).map(([ua, count]) => (
          <li key={ua}><span className="text-xs break-all">{ua}</span>: {count}</li>
        ))}
      </ul>
    </div>
  );
} 