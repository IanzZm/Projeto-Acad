import { Link } from "react-router-dom";
import logo from "../../../../assets/logo.svg";
import styles from "./styles.module.css";

export function PortalHeader() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand} aria-label="Voltar para home">
        <img src={logo} alt="Luis" />
      </Link>

      <h1>Area do Aluno</h1>
    </header>
  );
}
