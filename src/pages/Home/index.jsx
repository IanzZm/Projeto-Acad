import { Header } from "../../components/Header";
import styles from "./styles.module.css";

export function Home() {
  return (
    <>
      <Header />

      <main className={styles.home}>
        <h1>Transforme seu corpo com treino e estratégia.</h1>
        <p>
          Treinamento personalizado para hipertrofia, emagrecimento e performance.
        </p>
      </main>
    </>
  );
}