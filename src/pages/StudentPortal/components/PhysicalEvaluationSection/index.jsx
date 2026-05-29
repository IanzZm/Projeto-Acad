import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../../../firebase";
import styles from "./styles.module.css";

// Define quais metricas podem aparecer para o aluno.
// Os IDs precisam ser iguais aos nomes salvos pelo professor em evaluation.metrics.
const metricDefinitions = [
  {
    id: "bodyFat",
    label: "Gordura corporal",
    unit: "%",
    tone: "good",
    range: "Percentual de gordura registrado pelo professor.",
    lowerIsBetter: true,
  },
  {
    id: "fatMass",
    label: "Massa gorda",
    unit: "kg",
    tone: "good",
    range: "Calculada a partir do peso e percentual de gordura.",
    lowerIsBetter: true,
  },
  {
    id: "weight",
    label: "Peso",
    unit: "kg",
    tone: "neutral",
    range: "Peso corporal registrado na avaliacao.",
    lowerIsBetter: false,
  },
  {
    id: "bmi",
    label: "IMC",
    unit: "",
    tone: "neutral",
    range: "Calculado pelo peso dividido pela altura ao quadrado.",
    lowerIsBetter: false,
  },
  {
    id: "leanMass",
    label: "Massa magra",
    unit: "kg",
    tone: "attention",
    range: "Peso total menos a massa gorda estimada.",
    lowerIsBetter: false,
  },
  {
    id: "vo2Max",
    label: "VO2 max",
    unit: "ml/kg/min",
    tone: "attention",
    range: "Capacidade cardiorrespiratoria registrada na avaliacao.",
    lowerIsBetter: false,
  },
  {
    id: "pushUps",
    label: "Flexoes",
    unit: "rep.",
    tone: "good",
    range: "Quantidade de repeticoes executadas no teste.",
    lowerIsBetter: false,
  },
  {
    id: "sitUps",
    label: "Abdominais",
    unit: "rep.",
    tone: "good",
    range: "Quantidade de repeticoes executadas no teste.",
    lowerIsBetter: false,
  },
  {
    id: "flexibility",
    label: "Flexibilidade",
    unit: "cm",
    tone: "attention",
    range: "Resultado do teste de flexibilidade.",
    lowerIsBetter: false,
  },
];

// Tabelas fixas de referencia para os testes de flexoes e abdominais.
// Elas continuam fixas porque sao tabelas de classificacao, nao dados do aluno.
const fitnessClassifications = [
  {
    id: "pushUps",
    title: "Flexoes",
    description: "Classificacao por numero de repeticoes executadas.",
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
    description: "Classificacao por numero de repeticoes executadas.",
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

// Medidas usadas para desenhar o grafico SVG.
const chartSize = {
  width: 720,
  height: 280,
  left: 54,
  right: 28,
  top: 30,
  bottom: 48,
};

// Transforma a data da avaliacao em timestamp para ordenar do registro mais antigo ao mais novo.
function getEvaluationTime(evaluation) {
  return new Date(`${evaluation.evaluationDate}T00:00:00`).getTime();
}

// Formata a data completa para os cards de resumo.
function formatDate(dateValue) {
  if (!dateValue) {
    return "Data nao informada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${dateValue}T00:00:00`));
}

// Formata a data curta para os pontos do grafico.
function formatShortDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "2-digit",
  }).format(new Date(`${dateValue}T00:00:00`));
}

// Formata valores numericos com virgula e unidade, por exemplo: 76,5 kg.
function formatValue(value, unit) {
  const formattedValue = Number(value).toFixed(1).replace(".", ",");
  const cleanValue = formattedValue.endsWith(",0")
    ? formattedValue.replace(",0", "")
    : formattedValue;

  return `${cleanValue}${unit ? ` ${unit}` : ""}`;
}

// Cria uma frase simples comparando o primeiro registro com o registro mais recente.
function getMetricStatus(history, lowerIsBetter) {
  if (history.length < 2) {
    return "Primeiro registro";
  }

  const firstValue = history[0].value;
  const latestValue = history[history.length - 1].value;
  const difference = latestValue - firstValue;

  if (difference === 0) {
    return "Sem variacao";
  }

  const improved = lowerIsBetter ? difference < 0 : difference > 0;
  const sign = difference > 0 ? "+" : "";
  const label = improved ? "evolucao positiva" : "acompanhar";

  return `${sign}${difference.toFixed(1).replace(".", ",")} desde o inicio, ${label}`;
}

// Calcula a posicao X/Y de cada ponto no grafico conforme os valores da metrica.
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

// Monta as metricas exibidas na tela a partir das avaliacoes vindas do Firebase.
function buildMetrics(evaluations) {
  return metricDefinitions
    .map((definition) => {
      // Para cada metrica definida, cria um historico usando todas as avaliacoes do aluno.
      const history = evaluations
        .map((evaluation) => {
          const value = evaluation.metrics?.[definition.id];

          // Se aquela metrica nao foi preenchida em uma avaliacao, ela nao entra no grafico.
          if (typeof value !== "number") {
            return null;
          }

          return {
            date: formatShortDate(evaluation.evaluationDate),
            value,
          };
        })
        .filter(Boolean);

      // Se nenhuma avaliacao tem essa metrica, o card dessa metrica nao aparece.
      if (history.length === 0) {
        return null;
      }

      // O valor principal do card e sempre o valor mais recente.
      const latestValue = history[history.length - 1].value;

      return {
        ...definition,
        value: formatValue(latestValue, definition.unit),
        status: getMetricStatus(history, definition.lowerIsBetter),
        history,
      };
    })
    .filter(Boolean);
}

// Componente separado para renderizar uma tabela de classificacao.
function ClassificationTable({ classification, table }) {
  return (
    <article className={styles.classificationTable}>
      <strong>{table.gender}</strong>

      <div className={styles.tableScroller}>
        <table>
          <thead>
            <tr>
              <th scope="col">Classificacao</th>
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
  // Avaliacoes fisicas reais do aluno logado.
  const [evaluations, setEvaluations] = useState([]);

  // Controla a mensagem de carregamento inicial.
  const [isLoading, setIsLoading] = useState(true);

  // Guarda mensagens de erro ou aviso, como usuario deslogado.
  const [feedback, setFeedback] = useState("");

  // Guarda qual metrica esta selecionada no grafico.
  const [selectedMetricId, setSelectedMetricId] = useState("");

  // Guarda qual tabela de classificacao esta selecionada.
  const [selectedClassificationId, setSelectedClassificationId] = useState(
    fitnessClassifications[0].id,
  );

  useEffect(() => {
    // Observa o usuario autenticado no Firebase.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Sem usuario logado, nao existe UID para filtrar as avaliacoes.
        setEvaluations([]);
        setFeedback("Entre com sua conta para visualizar suas avaliacoes.");
        setIsLoading(false);
        return;
      }

      try {
        // Busca somente avaliacoes em que o studentId e igual ao UID do aluno logado.
        // Esse studentId foi salvo pelo professor quando cadastrou a avaliacao.
        const evaluationsQuery = query(
          collection(db, "physicalEvaluations"),
          where("studentId", "==", user.uid),
        );
        const evaluationsSnapshot = await getDocs(evaluationsQuery);

        // Converte os documentos do Firestore em objetos comuns e ordena por data.
        const studentEvaluations = evaluationsSnapshot.docs
          .map((evaluationDoc) => ({
            id: evaluationDoc.id,
            ...evaluationDoc.data(),
          }))
          .sort((firstEvaluation, secondEvaluation) => {
            return getEvaluationTime(firstEvaluation) - getEvaluationTime(secondEvaluation);
          });

        setEvaluations(studentEvaluations);
        setFeedback("");
      } catch (error) {
        // Se o Firebase falhar, a tela mostra uma mensagem amigavel.
        console.error(error);
        setFeedback("Nao foi possivel carregar suas avaliacoes fisicas.");
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Cria os cards e historicos do grafico com base nas avaliacoes carregadas.
  const metrics = useMemo(() => buildMetrics(evaluations), [evaluations]);

  // Pega a metrica selecionada; se ainda nao houver selecao, usa a primeira disponivel.
  const selectedMetric =
    metrics.find((metric) => metric.id === selectedMetricId) ?? metrics[0];

  // Pega a tabela de classificacao selecionada.
  const selectedClassification =
    fitnessClassifications.find(
      (classification) => classification.id === selectedClassificationId,
    ) ?? fitnessClassifications[0];

  // Como as avaliacoes foram ordenadas por data, a ultima do array e a mais recente.
  const latestEvaluation = evaluations[evaluations.length - 1];

  useEffect(() => {
    // Quando as metricas chegam do Firebase, seleciona automaticamente a primeira.
    if (!selectedMetricId && metrics.length > 0) {
      setSelectedMetricId(metrics[0].id);
    }
  }, [metrics, selectedMetricId]);

  // Prepara os pontos e caminhos SVG do grafico.
  const chartPoints = selectedMetric ? getChartPoints(selectedMetric.history) : [];
  const linePath = chartPoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath =
    chartPoints.length > 0
      ? `${linePath} L ${chartPoints.at(-1).x} ${
          chartSize.height - chartSize.bottom
        } L ${chartPoints[0].x} ${chartSize.height - chartSize.bottom} Z`
      : "";

  return (
    <div className={styles.evaluation}>
      {/* Cabecalho da pagina de avaliacao fisica do aluno. */}
      <header className={styles.header}>
        <span>Painel do aluno</span>
        <h2>Avaliacao fisica</h2>
        <p>Acompanhe a evolucao das metricas cadastradas pelo professor.</p>
      </header>

      {/* Estados principais: carregando, erro/aviso, sem dados ou conteudo real. */}
      {isLoading ? (
        <section className={styles.emptyPanel}>
          <p>Carregando suas avaliacoes...</p>
        </section>
      ) : feedback ? (
        <section className={styles.emptyPanel}>
          <p>{feedback}</p>
        </section>
      ) : evaluations.length === 0 ? (
        <section className={styles.emptyPanel}>
          <p>Nenhuma avaliacao fisica foi cadastrada para o seu perfil.</p>
        </section>
      ) : (
        <>
          {/* Resumo geral baseado nas avaliacoes reais do aluno. */}
          <div className={styles.summaryGrid}>
            <article className={styles.summaryCard}>
              <span>Ultima avaliacao</span>
              <strong>{formatDate(latestEvaluation?.evaluationDate)}</strong>
              <small>Registro mais recente feito pelo professor</small>
            </article>
            <article className={styles.summaryCard}>
              <span>Total de avaliacoes</span>
              <strong>{evaluations.length} avaliacoes</strong>
              <small>Historico disponivel no seu perfil</small>
            </article>
          </div>

          {/* Grafico de evolucao aparece somente quando existe metrica disponivel. */}
          {selectedMetric && (
            <section className={styles.section} aria-labelledby="metrics-history">
              <div className={styles.sectionHeader}>
                <div>
                  <h3 id="metrics-history">Evolucao das metricas</h3>
                  <p>Selecione um indicador para comparar suas avaliacoes.</p>
                </div>

                {/* Botoes para alternar a metrica exibida no grafico. */}
                <div className={styles.metricPicker} aria-label="Metrica do grafico">
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
                {/* Resumo da metrica selecionada. */}
                <div className={styles.metricSummary}>
                  <span>{selectedMetric.label}</span>
                  <strong>{selectedMetric.value}</strong>
                  <small>{selectedMetric.status}</small>
                  <p>{selectedMetric.range}</p>
                </div>

                {/* Grafico SVG desenhado com os pontos calculados a partir do historico. */}
                <div className={styles.chart}>
                  <svg
                    key={selectedMetric.id}
                    viewBox={`0 0 ${chartSize.width} ${chartSize.height}`}
                    role="img"
                    aria-labelledby="chart-title chart-description"
                  >
                    <title id="chart-title">
                      Historico de {selectedMetric.label.toLowerCase()}
                    </title>
                    <desc id="chart-description">
                      Historico das avaliacoes cadastradas para este aluno.
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
                      <g key={`${point.date}-${point.value}`} className={styles.dataPoint}>
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
          )}

          {/* Cards com o ultimo valor de cada metrica cadastrada pelo professor. */}
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
        </>
      )}

      {/* Tabelas de referencia dos testes fisicos. */}
      <section
        className={styles.section}
        aria-labelledby="fitness-classifications"
      >
        <div className={styles.sectionHeader}>
          <div>
            <h3 id="fitness-classifications">Classificacoes de testes</h3>
            <p>Consulte as faixas por sexo e idade para cada exercicio.</p>
          </div>

          <div
            className={styles.metricPicker}
            aria-label="Teste fisico da tabela"
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
