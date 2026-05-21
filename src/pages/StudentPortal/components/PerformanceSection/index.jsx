import styles from "./styles.module.css";

const performanceCards = [
  {
    label: "Gordura corporal",
    value: "18%",
    status: "Ideal",
    tone: "good",
  },
  {
    label: "IMC",
    value: "22.5",
    status: "Normal",
    tone: "good",
  },
  {
    label: "Peso",
    value: "76 kg",
    status: "Atual",
    tone: "neutral",
  },
  {
    label: "Massa magra",
    value: "82 cm",
    status: "Atenção",
    tone: "warning",
  },
  {
    label: "Condicionamento",
    value: "Ruim",
    status: "Cardiorrespiratório",
    tone: "danger",
  },
  {
    label: "Última avaliação",
    value: "62 dias",
    status: "Desde a última medição",
    tone: "neutral",
  },
];

export function PerformanceSection() {
  return (
    <section className={styles.performance}>
      <h2>Meu desempenho</h2>

      <div className={styles.metricsGrid}>
        {performanceCards.map((card) => (
          <article
            key={card.label}
            className={`${styles.metricCard} ${styles[card.tone]}`}
          >
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.status}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
