import type { Consumption } from "../types/domain";
import { dateLabel, number } from "../utils/energy";

export function ConsumptionChart({ records }: { records: Consumption[] }) {
  if (!records.length)
    return (
      <p className="py-10 text-center text-sm text-slate-600">
        Registre um consumo para visualizar o gráfico.
      </p>
    );
  const shown = records.slice(-31);
  const max = Math.max(...shown.map((record) => record.consumoKwh), 1);
  const first = Date.parse(shown[0].data);
  const span = Math.max(86_400_000, Date.parse(shown.at(-1)!.data) - first);
  const width = Math.max(4, Math.min(24, 500 / (span / 86_400_000 + 1)));
  return (
    <figure>
      <svg
        viewBox="0 0 640 245"
        role="img"
        aria-labelledby="consumption-chart-title consumption-chart-desc"
        className="w-full"
      >
        <title id="consumption-chart-title">
          Consumo diário registrado em kWh
        </title>
        <desc id="consumption-chart-desc">
          Últimos {shown.length} registros do período. Dias sem registro não
          representam zero. Os valores estão no histórico abaixo.
        </desc>
        {[0, 0.5, 1].map((part) => (
          <g key={part}>
            <line
              x1="58"
              y1={195 - part * 155}
              x2="610"
              y2={195 - part * 155}
              stroke="#dfe6de"
            />
            <text
              x="48"
              y={200 - part * 155}
              textAnchor="end"
              fontSize="12"
              fill="#52645a"
            >
              {number(max * part, 1)}
            </text>
          </g>
        ))}
        {shown.map((record) => (
          <rect
            key={record.id}
            x={
              70 + ((Date.parse(record.data) - first) / span) * 520 - width / 2
            }
            y={195 - (record.consumoKwh / max) * 155}
            width={width}
            height={Math.max(2, (record.consumoKwh / max) * 155)}
            rx="3"
            fill={record.origem === "SIMULADO" ? "#8a9c71" : "#285c48"}
          >
            <title>
              {dateLabel(record.data)}: {number(record.consumoKwh)} kWh (
              {record.origem})
            </title>
          </rect>
        ))}
        <text x="60" y="225" fill="#52645a" fontSize="12">
          {dateLabel(shown[0].data)}
        </text>
        <text x="610" y="225" fill="#52645a" fontSize="12" textAnchor="end">
          {dateLabel(shown.at(-1)!.data)}
        </text>
      </svg>
      <figcaption className="text-xs leading-relaxed text-slate-500">
        Até 31 registros recentes do filtro. Verde claro indica dados simulados.
        Datas sem registro permanecem como lacunas.
      </figcaption>
    </figure>
  );
}
