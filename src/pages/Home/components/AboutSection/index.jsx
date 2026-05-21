import styles from "./styles.module.css";
import indio2 from "../../../../assets/indio2.png";

export function AboutSection() {
    return (
        <main className={styles.about}>
        <section id="sobre" className={styles.aboutSection}>
            <div className={styles.imageArea}>
                <img
                 src={indio2}
                 alt="Personal Indio"
                 className={styles.image}/>
            </div>
            <div className={styles.content}>
            <h2 className={styles.sectionTitle}>Conheça seu profissional</h2>
            <h1 className={styles.sectionSubtitle}>Luis Guilherme Tavares</h1>
            <p className={styles.description}>
                Luis é estudante de Educação Física pela UNINASSAU e atua com foco em treinos personalizados, ajudando alunos a evoluírem de forma consistente e segura. Mesmo em fase de formação, já aplica na prática os princípios mais atuais do treinamento físico, sempre buscando entregar resultados reais.
            </p>
            <p className={styles.description}>Seu trabalho é baseado em disciplina, acompanhamento próximo e adaptação individual, entendendo que cada pessoa possui objetivos, rotina e limitações diferentes.</p>
            <p className={styles.description}>Seja para emagrecimento, ganho de massa muscular ou melhora da performance, Luis desenvolve estratégias práticas e eficientes para que seus alunos evoluam com constância e qualidade.</p>
            </div>
        </section>
        </main>
    );
}