import { Link } from "react-router-dom";
import styles from "./styles.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <a href="#topo" className={styles.brand}>
        <span className={styles.brandMark}>LT</span>
        <span>Luis Tavares</span>
      </a>

      <nav className={styles.nav}>
        <a href="#topo">Início</a>
        <a href="#programas">Programas</a>
        <a href="#sobre">Sobre</a>
        <a href="#resultados">Resultados</a>
        <a href="#contato">Contato</a>
      </nav>

      <div className={styles.actions}>
        <Link to="/login" className={styles.loginButton}>
          Entrar
        </Link>
        <Link to="/inscricao" className={styles.ctaButton}>
          Começar
        </Link>
      </div>
    </header>
  );
}
