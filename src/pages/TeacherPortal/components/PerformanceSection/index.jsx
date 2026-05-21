import styles from "./styles.module.css";

const Cards = [
  {
    label: "Alunos ativos",
    value: "18 alunos",
    tone: "teacher",
    status: "2 novos alunos este mês",
  },
  {
    label: "Agendamentos semanais",
    value: "12 agendamentos", 
    tone: "teacher",
    status: "3 agendamentos este mês",
  },
  {
    label: "Pendências",
    value: "2 pendências", 
    tone: "teacher",
    status: "1 pendência resolvida esta semana",
  },

];

export function PerformanceSection() {
  return (
    <section className={styles.performance}>

      <div className={styles.metricsGrid}>
        {Cards.map((card) => (
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
