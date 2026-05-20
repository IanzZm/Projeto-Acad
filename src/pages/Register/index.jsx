import { RegisterForm } from "../../components/RegisterForm";
import loginHero from "../../assets/loginHero.png";
import styles from "./styles.module.css";

export function Register() {
  return (
    <main className={styles.loginPage}>
      <section className={styles.formSide}>
        <RegisterForm/>
      </section>
      <section className={styles.imageSide}>
        <img src={loginHero} alt="Atleta em movimento" />
      </section>
    </main>
  );
}