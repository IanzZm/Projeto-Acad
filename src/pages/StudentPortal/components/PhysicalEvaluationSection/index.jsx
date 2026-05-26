import { useState } from "react";
import styles from "./styles.module.css";

const metrics = [
  {
    id: "bodyFat",
    label: "Gordura corporal",
    value: "18%",
    status: "Ideal",
    unit: "%",
    tone: "good",
    range: "Faixa alvo: 16% a 20%",
    history: [
      { date: "Jun/25", value: 23 },
      { date: "Set/25", value: 21 },
      { date: "Dez/25", value: 19 },
      { date: "Mar/26", value: 18 },
    ],
  },
  {
    id: "fatMass",
    label: "Massa gorda",
    value: "15 kg",
    status: "-4 kg desde junho",
    unit: "kg",
    tone: "good",
    range: "Calculada a partir do peso e percentual de gordura",
    history: [
      { date: "Jun/25", value: 18.9 },
      { date: "Set/25", value: 16.8 },
      { date: "Dez/25", value: 14.8 },
      { date: "Mar/26", value: 15 },
    ],
  },
  {
    id: "weight",
    label: "Peso",
    value: "76 kg",
    status: "-2 kg desde dezembro",
    unit: "kg",
    tone: "neutral",
    range: "Meta atual: 74 kg",
    history: [
      { date: "Jun/25", value: 82 },
      { date: "Set/25", value: 80 },
      { date: "Dez/25", value: 78 },
      { date: "Mar/26", value: 76 },
    ],
  },
  {
    id: "bmi",
    label: "IMC",
    value: "22.5",
    status: "Normal",
    unit: "",
    tone: "good",
    range: "Faixa saudável: 18.5 a 24.9",
    history: [
      { date: "Jun/25", value: 24.2 },
      { date: "Set/25", value: 23.7 },
      { date: "Dez/25", value: 23.1 },
      { date: "Mar/26", value: 22.5 },
    ],
  },
  {
    id: "leanMass",
    label: "Massa magra",
    value: "61 kg",
    status: "+1 kg no período",
    unit: "kg",
    tone: "attention",
    range: "Foco: preservar massa magra",
    history: [
      { date: "Jun/25", value: 60 },
      { date: "Set/25", value: 60.4 },
      { date: "Dez/25", value: 60.8 },
      { date: "Mar/26", value: 61 },
    ],
  },
  {
    id: "bodyDensity",
    label: "Densidade corporal",
    value: "1.056",
    status: "Dentro do esperado",
    unit: "",
    tone: "neutral",
    range: "Base para estimar a gordura corporal pelas dobras cutâneas",
    history: [
      { date: "Jun/25", value: 1.048 },
      { date: "Set/25", value: 1.051 },
      { date: "Dez/25", value: 1.054 },
      { date: "Mar/26", value: 1.056 },
    ],
  },
  {
    id: "vo2Max",
    label: "VO2 max",
    value: "46 ml/kg/min",
    status: "Boa capacidade",
    unit: "",
    tone: "attention",
    range: "Estimado pela distância percorrida no protocolo de Cooper",
    history: [
      { date: "Jun/25", value: 39 },
      { date: "Set/25", value: 42 },
      { date: "Dez/25", value: 44 },
      { date: "Mar/26", value: 46 },
    ],
  },
  {
    id: "pushUps",
    label: "Flexões",
    value: "31 rep.",
    status: "Muito bom",
    unit: "rep.",
    tone: "good",
    range: "Classificação por idade e sexo",
    history: [
      { date: "Jun/25", value: 22 },
      { date: "Set/25", value: 26 },
      { date: "Dez/25", value: 29 },
      { date: "Mar/26", value: 31 },
    ],
  },
  {
    id: "sitUps",
    label: "Abdominais",
    value: "34 rep.",
    status: "Muito bom",
    unit: "rep.",
    tone: "good",
    range: "Classificação por idade e sexo",
    history: [
      { date: "Jun/25", value: 24 },
      { date: "Set/25", value: 28 },
      { date: "Dez/25", value: 31 },
      { date: "Mar/26", value: 34 },
    ],
  },
];

const assessmentSummary = [
  {
    label: "Última avaliação",
    value: "12/03/2026",
    detail: "Realizada há 18 dias",
  },
  {
    label: "Total de avaliações",
    value: "4 avaliações",
    detail: "Histórico disponível",
  },
];

const fitnessClassifications = [
  {
    id: "pushUps",
    title: "Flexões",
    description: "Classificação por número de repetições executadas.",
    columns: ["20 a 29", "30 a 39", "40 a 49", "50 a 59", "60 a 69"],
    tables: [
      {
        gender: "Homens",
        rows: [
          ["Muito fraco", "< 17", "< 12", "< 10", "< 7", "< 5"],
          ["Fraco", "17 a 21", "12 a 16", "10 a 12", "7 a 9", "5 a 7"],
          ["Bom", "22 a 28", "17 a 21", "13 a 16", "10 a 12", "8 a 10"],
          ["Muito bom", "29 a 35", "22 a 29", "17 a 24", "13 a 20", "11 a 17"],
          ["Excelente", "> 35", "> 29", "> 24", "> 20", "> 17"],
        ],
      },
      {
        gender: "Mulheres",
        rows: [
          ["Muito fraco", "< 10", "< 7", "< 5", "< 2", "< 2"],
          ["Fraco", "10 a 14", "7 a 12", "5 a 10", "2 a 6", "2 a 4"],
          ["Bom", "15 a 20", "13 a 19", "11 a 14", "7 a 10", "5 a 11"],
          ["Muito bom", "21 a 29", "20 a 26", "15 a 23", "11 a 20", "12 a 16"],
          ["Excelente", "> 29", "> 26", "> 23", "> 20", "> 16"],
        ],
      },
    ],
  },
  {
    id: "sitUps",
    title: "Abdominais",
    description: "Classificação por número de repetições executadas.",
    columns: ["15 a 19", "20 a 29", "30 a 39", "40 a 49", "50 a 59", "60 a 69"],
    tables: [
      {
        gender: "Homens",
        rows: [
          ["Muito fraco", "< 18", "< 17", "< 12", "< 10", "< 7", "< 5"],
          ["Fraco", "18 a 22", "17 a 21", "12 a 16", "10 a 12", "7 a 9", "5 a 7"],
          ["Bom", "23 a 28", "22 a 28", "17 a 21", "13 a 16", "10 a 12", "8 a 10"],
          ["Muito bom", "29 a 38", "29 a 35", "22 a 29", "17 a 21", "13 a 20", "11 a 17"],
          ["Excelente", "> 38", "> 35", "> 29", "> 21", "> 20", "> 17"],
        ],
      },
      {
        gender: "Mulheres",
        rows: [
          ["Muito fraco", "< 12", "< 10", "< 8", "< 5", "< 2", "< 1"],
          ["Fraco", "12 a 17", "10 a 14", "8 a 12", "5 a 10", "2 a 6", "1 a 4"],
          ["Bom", "18 a 24", "15 a 20", "13 a 19", "11 a 14", "7 a 10", "5 a 11"],
          ["Muito bom", "25 a 32", "21 a 29", "20 a 26", "15 a 23", "11 a 20", "12 a 16"],
          ["Excelente", "> 32", "> 29", "> 26", "> 23", "> 20", "> 16"],
        ],
      },
    ],
  },
];

const chartSize = {
  width: 720,
  height: 280,
  left: 54,
  right: 28,
  top: 30,
  bottom: 48,
};

function getChartPoints(history) {
  const values = history.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(max - min, 1);
  const floor = min - spread * 0.35;
  const ceiling = max + spread * 0.35;
  const chartWidth = chartSize.width - chartSize.left - chartSize.right;
  const chartHeight = chartSize.height - chartSize.top - chartSize.bottom;

  return history.map((item, index) => {
    const x =
      chartSize.left + (chartWidth * index) / Math.max(history.length - 1, 1);
    const y =
      chartSize.top +
      chartHeight -
      ((item.value - floor) / (ceiling - floor)) * chartHeight;

    return { ...item, x, y };
  });
}

function formatValue(value, unit) {
  return `${value}${unit ? ` ${unit}` : ""}`;
}

function ClassificationTable({ classification, table }) {
  return (
    <article className={styles.classificationTable}>
      <strong>{table.gender}</strong>

      <div className={styles.tableScroller}>
        <table>
          <thead>
            <tr>
              <th scope="col">Classificação</th>
              {classification.columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map(([label, ...values]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {values.map((value, index) => (
                  <td key={`${label}-${classification.columns[index]}`}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export function PhysicalEvaluationSection() {
  const [selectedMetricId, setSelectedMetricId] = useState(metrics[0].id);
  const [selectedClassificationId, setSelectedClassificationId] = useState(
    fitnessClassifications[0].id,
  );
  const selectedMetric =
    metrics.find((metric) => metric.id === selectedMetricId) ?? metrics[0];
  const selectedClassification =
    fitnessClassifications.find(
      (classification) => classification.id === selectedClassificationId,
    ) ?? fitnessClassifications[0];
  const chartPoints = getChartPoints(selectedMetric.history);
  const linePath = chartPoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = `${linePath} L ${chartPoints.at(-1).x} ${
    chartSize.height - chartSize.bottom
  } L ${chartPoints[0].x} ${chartSize.height - chartSize.bottom} Z`;

  return (
    <div className={styles.evaluation}>
      <header className={styles.header}>
        <span>Painel do aluno</span>
        <h2>Avaliação física</h2>
        <p>Acompanhe a evolução das suas métricas a cada avaliação.</p>
      </header>

      <div className={styles.summaryGrid}>
        {assessmentSummary.map((item) => (
          <article key={item.label} className={styles.summaryCard}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.detail}</small>
          </article>
        ))}
      </div>

      <section className={styles.section} aria-labelledby="metrics-history">
        <div className={styles.sectionHeader}>
          <div>
            <h3 id="metrics-history">Evolução das métricas</h3>
            <p>Selecione um indicador para comparar suas avaliações.</p>
          </div>

          <div className={styles.metricPicker} aria-label="Métrica do gráfico">
            {metrics.map((metric) => (
              <button
                key={metric.id}
                type="button"
                aria-pressed={metric.id === selectedMetric.id}
                className={
                  metric.id === selectedMetric.id
                    ? styles.selectedMetric
                    : styles.metricButton
                }
                onClick={() => setSelectedMetricId(metric.id)}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        <article
          className={`${styles.chartPanel} ${styles[selectedMetric.tone]}`}
        >
          <div className={styles.metricSummary}>
            <span>{selectedMetric.label}</span>
            <strong>{selectedMetric.value}</strong>
            <small>{selectedMetric.status}</small>
            <p>{selectedMetric.range}</p>
          </div>

          <div className={styles.chart}>
            <svg
              key={selectedMetric.id}
              viewBox={`0 0 ${chartSize.width} ${chartSize.height}`}
              role="img"
              aria-labelledby="chart-title chart-description"
            >
              <title id="chart-title">
                Histórico de {selectedMetric.label.toLowerCase()}
              </title>
              <desc id="chart-description">
                Quatro avaliações registradas entre junho de 2025 e março de
                2026.
              </desc>

              {[0, 1, 2].map((line) => {
                const y =
                  chartSize.top +
                  ((chartSize.height - chartSize.top - chartSize.bottom) *
                    line) /
                    2;

                return (
                  <line
                    key={line}
                    x1={chartSize.left}
                    y1={y}
                    x2={chartSize.width - chartSize.right}
                    y2={y}
                    className={styles.gridLine}
                  />
                );
              })}

              <path d={areaPath} className={styles.chartArea} />
              <path d={linePath} className={styles.chartLine} />

              {chartPoints.map((point) => (
                <g key={point.date} className={styles.dataPoint}>
                  <circle cx={point.x} cy={point.y} r="7" />
                  <text x={point.x} y={point.y - 16}>
                    {formatValue(point.value, selectedMetric.unit)}
                  </text>
                  <text
                    x={point.x}
                    y={chartSize.height - 18}
                    className={styles.dateLabel}
                  >
                    {point.date}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </article>
      </section>

      <div className={styles.metricCards}>
        {metrics.map((metric) => (
          <article
            key={metric.id}
            className={`${styles.metricCard} ${styles[metric.tone]}`}
          >
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.status}</small>
          </article>
        ))}
      </div>

      <section
        className={styles.section}
        aria-labelledby="fitness-classifications"
      >
        <div className={styles.sectionHeader}>
          <div>
            <h3 id="fitness-classifications">Classificações de testes</h3>
            <p>Consulte as faixas por sexo e idade para cada exercício.</p>
          </div>

          <div
            className={styles.metricPicker}
            aria-label="Teste físico da tabela"
          >
            {fitnessClassifications.map((classification) => (
              <button
                key={classification.id}
                type="button"
                aria-pressed={classification.id === selectedClassification.id}
                className={
                  classification.id === selectedClassification.id
                    ? styles.selectedMetric
                    : styles.metricButton
                }
                onClick={() => setSelectedClassificationId(classification.id)}
              >
                {classification.title}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.classificationPanel}>
          <div className={styles.classificationIntro}>
            <span>{selectedClassification.title}</span>
            <p>{selectedClassification.description}</p>
          </div>

          <div className={styles.classificationGrid}>
            {selectedClassification.tables.map((table) => (
              <ClassificationTable
                key={table.gender}
                classification={selectedClassification}
                table={table}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
