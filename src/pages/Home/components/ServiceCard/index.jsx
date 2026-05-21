import styles from "./styles.module.css";
export function ServiceCard({ image, title, description, linkText }) {
  return (
    <article className={styles.card}>
      <img src={image} alt={title} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
        <a href="#" className={styles.cardLink}>{linkText}</a>
      </div>
    </article>
  );
}