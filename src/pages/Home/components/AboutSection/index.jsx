import indio2 from "../../../../assets/indio2.png";
import styles from "./styles.module.css";

const methodItems = [
  "Avaliação inicial com medidas e histórico",
  "Plano de treino compatível com sua rotina",
  "Ajustes de carga, frequência e execução",
  "Acompanhamento para manter evolução real",
];

export function AboutSection() {
  return (
    <section id="sobre" className={styles.aboutSection}>
      <div className={styles.imageArea}>
        <img src={indio2} alt="Luis Tavares" className={styles.image} />
        <div className={styles.coachCard}>
          <span>Coach</span>
          <strong>Luis Guilherme Tavares</strong>
          <p>Educação Física - UNINASSAU</p>
        </div>
      </div>

      <div className={styles.content}>
        <span className={styles.eyebrow}>Sobre o profissional</span>
        <h2>Guiado por experiência prática, dados e presença no processo.</h2>
        <p>
          Luis é estudante de Educação Física pela UNINASSAU e atua com foco em
          treinos personalizados, ajudando alunos a evoluírem de forma
          consistente e segura.
        </p>
        <p>
          O trabalho combina disciplina, acompanhamento próximo e adaptação
          individual, respeitando objetivos, rotina e limitações de cada aluno.
        </p>

        <div className={styles.methodList}>
          {methodItems.map((item) => (
            <div key={item} className={styles.methodItem}>
              <span>+</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
