import styles from "./styles.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <a href="#">Programas</a>
        <a href="#">Inscreva-se</a>
        <a href="#">Sobre</a>
        <a href="#">Home</a>
      </nav>

      <button className={styles.loginButton}>Entrar</button>
    </header>
  );
}