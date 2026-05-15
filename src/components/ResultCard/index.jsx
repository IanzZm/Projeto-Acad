import styles from './styles.module.css';

export function ResultCard({ image, text, name }) {
  return (
    <article className={styles.card}>
      <img src={image} alt={name} className={styles.cardImage} />
      <p className={styles.cardText}>{text}</p>
      <h3 className={styles.cardName}>{name}</h3>
    </article>
  );
}