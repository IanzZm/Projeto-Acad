import { Link } from "react-router-dom";
import styles from "./styles.module.css";

export function LoginForm() {
  return (
    <div className={styles.formBox}>
      <h1>Bem vindo de volta</h1>

      <form className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Entrar com Email" />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Senha</label>
          <input id="password" type="password" placeholder="********" />
        </div>

        <div className={styles.formOptions}>
          <label className={styles.remember}>
            <input type="checkbox" />
            <span>Lembre-se</span>
          </label>

          <a href="#">Esqueci a senha</a>
        </div>

        <button type="submit" className={styles.loginButton}>
          Entrar
        </button>
      </form>

      <p className={styles.registerText}>
        Não tem conta? <Link to="/inscricao">Inscreva-se grátis!</Link>
      </p>
    </div>
  );
}