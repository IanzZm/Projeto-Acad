import { LoginForm } from "./components/LoginForm";
import loginHero from "../../assets/loginHero.png";
import styles from "./styles.module.css";

export function Login() {
  return (
    <main className={styles.loginPage}>
      <section className={styles.formSide}>
        <LoginForm />
      </section>

      <section className={styles.imageSide}>
        <img src={loginHero} alt="Atleta em movimento" />
      </section>
    </main>
  );
}