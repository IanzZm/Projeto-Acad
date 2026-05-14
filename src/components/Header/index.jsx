import styles from "./styles.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <a href="#programas">Programas</a>
        <a href="#inscricao">Inscreva-se</a>
        <a href="#sobre">Sobre</a>
        <a href="#topo">Home</a>
      </nav>

      <button className={styles.loginButton}>Entrar</button>
    </header>
  );
}