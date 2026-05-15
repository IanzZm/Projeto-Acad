import styles from "./styles.module.css";
import fotoPersonal from "../../assets/indio.png";
import { Link } from "react-router-dom";
export function HeroSection() {
  return (
    <main className={styles.home}>
      <section className={styles.hero} id="topo">
        <div className={styles.content}>
          <h1 className={styles.title}>
            Transforme seu corpo com <span>treino</span> e{" "}
            <span>estratégia</span>.
          </h1>

          <p className={styles.description}>
            Treinamento personalizado para hipertrofia, emagrecimento e
            performance.
          </p>

          <div className={styles.buttons}>
            
            <Link to="/login" className={styles.primaryButton}>
              Inscreva-se
            </Link>
            <a href="#sobre" className={styles.secondaryButton}>
              Saiba Mais
            </a>
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
  );
}
