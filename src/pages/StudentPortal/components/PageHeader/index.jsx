import styles from "./styles.module.css";

export function PageHeader() {
  return (
    <div className={styles.pageHeader}>
      <div>
        <span>Painel do aluno</span>
        <h2>Resumo da sua evolução</h2>
        <p>Acompanhe seus indicadores, avaliações e próximos passos.</p>
      </div>

      <p className={styles.welcome}>Bem-vindo de volta, João</p>
    </div>
  );
}
