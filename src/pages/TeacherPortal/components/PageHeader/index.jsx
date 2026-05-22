import styles from "./styles.module.css";

export function PageHeader() {
  return (
    <div className={styles.pageHeader}>
      <div>
        <span>Painel do professor</span>
        <h2>Resumo das suas atividades</h2>
        <p>Acompanhe suas atividades e pendências.</p>
      </div>

      <p className={styles.welcome}>Bem-vindo de volta, Luís 👋</p>
    </div>
  );
}
