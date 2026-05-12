import { Header } from "../../components/Header";
import styles from "./styles.module.css";
import fotoPersonal from "../../assets/indio.png";

export function Home() {
  return (
    <>
      <Header />

       <main className={styles.home}>
        <section className={styles.hero}>
          <div className={styles.content}>
            <h1 className={styles.title}>
              Transforme seu corpo com <span>treino</span> e <span>estratégia</span>.
            </h1>

            <p className={styles.description}>
              Treinamento personalizado para hipertrofia, emagrecimento e performance.
            </p>

            <div className={styles.buttons}>
              <button className={styles.primaryButton}>Inscreva-se</button>
              <button className={styles.secondaryButton}>Saiba mais</button>
            </div>
          </div>

            <div className={styles.heroImageArea}>
              <img
                src={fotoPersonal}
                alt="Personal trainer"
                className={styles.heroImage}
              />
            </div>             
            
        </section>
      </main>
    </>
  );
}