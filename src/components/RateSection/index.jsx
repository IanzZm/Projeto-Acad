import styles from "./styles.module.css";
import pessoa1 from "../../assets/pessoa1.png";
import pessoa2 from "../../assets/pessoa2.png";
import pessoa3 from "../../assets/pessoa3.png";

const results = [
  {
    image: pessoa1,
    text: "“Se você está em dúvida por onde começar, faz a avaliação com o Marcos. Foi essencial pra eu entender meus objetivos e seguir um treino realmente eficaz.”",
    name: "Natália, 42 anos",
  },
  {
    image: pessoa2,
    text: "“Depois da avaliação física com o Luis, consegui seguir um plano muito mais eficiente. Em 3 meses, perdi 9kg e ganhei muito mais disposição no dia a dia.”",
    name: "Marcos, 37 anos",
  },
  {
    image: pessoa3,
    text: "“O que mais me impressionou foi o equilíbrio entre o profissionalismo e o cuidado individualizado, respeitando meus limites, mas sempre me incentivando a evoluir.”",
    name: "Luisa, 27 anos",
  },
];

export function RateSection() {
  return (
    <main>
        <section className={styles.rateSection}>
            <div className={styles.content}>
            <h1 className={styles.title}>Evoluções reais dos nossos alunos</h1>
            <p className={styles.description}>Acompanhamos cada etapa da evolução com base em <span className={styles.highlight}>dados reais</span> e avaliações físicas contínuas.</p>
            </div>
            <div className={styles.cards}>
                
            
            </div>
        </section>
    </main>
  );
}