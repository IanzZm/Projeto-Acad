import styles from "./styles.module.css";

export function ServiceCard({ image, title, description, tag }) {
  return (
    <article className={styles.card}>
      <img src={image} alt={title} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <span className={styles.tag}>{tag}</span>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
        <a href="#contato" className={styles.cardLink} aria-label={`Agendar ${title}`}>
          →
        </a>
      </div>
    </article>
  );
}
