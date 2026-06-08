import { Link } from "react-router-dom";
import fotoPersonal from "../../../../assets/indio.png";
import styles from "./styles.module.css";

export function HeroSection() {
  return (
    <section className={styles.home} id="topo">
      <div className={styles.hero}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>Personal trainer em Natal - RN</span>

          <h1 className={styles.title}>
            Treino inteligente para quem quer evoluir de verdade.
          </h1>

          <p className={styles.description}>
            Avaliação física, plano individual e acompanhamento próximo para
            transformar esforço em resultado mensurável.
          </p>

          <div className={styles.buttons}>
            <Link to="/inscricao" className={styles.primaryButton}>
              Agendar avaliação
            </Link>
            <a href="#sobre" className={styles.secondaryButton}>
              Ver método
            </a>
          </div>

          <div className={styles.metrics}>
            <div>
              <strong>10k+</strong>
              <span>treinos planejados</span>
            </div>
            <div>
              <strong>3</strong>
              <span>frentes de evolução</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>adaptado à sua rotina</span>
            </div>
          </div>
        </div>

        <div className={styles.heroImageArea}>
          <img
            src={fotoPersonal}
            alt="Luis Tavares, personal trainer"
            className={styles.heroImage}
          />

          <div className={styles.progressCard}>
            <strong>Plano semanal</strong>
            <span>Treino, medidas e ajustes no mesmo fluxo.</span>
            <div className={styles.progressBar}>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.methodStrip} aria-label="Pilares do acompanhamento">
        <span>Avaliação física</span>
        <span>Treino personalizado</span>
        <span>Ajustes semanais</span>
        <span>Consultoria online</span>
      </div>
    </section>
  );
}
