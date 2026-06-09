import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const quickActions = [
  {
    title: "Avaliação física",
    description: "Avaliação vencida",
    action: "Agendar avaliação",
    to: "/portal-aluno/agendamentos",
    icon: "chart",
    tone: "danger",
  },
  {
    title: "Falar com personal",
    description: "Tire dúvidas ou solicite ajustes",
    action: "Entre em contato",
    href: "https://wa.me/5584998588871?text=Ol%C3%A1%2C%20quero%20falar%20com%20meu%20personal",
    icon: "message",
    tone: "neutral",
  },
];

const icons = {
  chart: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20V4" />
      <path d="M9 20V9" />
      <path d="M14 20V6" />
      <path d="M19 20v-8" />
      <path d="M3 20h18" />
    </svg>
  ),
  message: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  ),
};

export function QuickActionsSection() {
  return (
    <section className={styles.quickActions}>
      <h2>Ações rápidas</h2>

      <div className={styles.actionsList}>
        {quickActions.map((item) => (
          <article
            key={item.title}
            className={`${styles.actionCard} ${styles[item.tone]}`}
          >
            <h3>
              <span className={styles.actionIcon}>{icons[item.icon]}</span>
              {item.title}
            </h3>

            <p>{item.description}</p>

            {item.to ? (
              <Link to={item.to} className={styles.actionButton}>
                {item.action}
              </Link>
            ) : item.href ? (
              <a
                href={item.href}
                className={styles.actionButton}
                target="_blank"
                rel="noreferrer"
              >
                {item.action}
              </a>
            ) : (
              <button type="button" className={styles.actionButton}>
                {item.action}
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
