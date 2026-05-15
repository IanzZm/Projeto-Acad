import { Link } from "react-router-dom";
import styles from "./styles.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <a href="#programas">Programas</a>
        <Link to="/inscricao">Inscreva-se</Link>
        <a href="#sobre">Sobre</a>
        <a href="#topo">Home</a>
      </nav>

      <Link to="/login" className={styles.loginButton}>
        Entrar
      </Link>
    </header>
  );
}
