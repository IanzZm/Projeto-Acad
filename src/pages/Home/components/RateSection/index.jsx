import pessoa1 from "../../../../assets/pessoa1.png";
import pessoa2 from "../../../../assets/pessoa2.png";
import pessoa3 from "../../../../assets/pessoa3.png";
import { ResultCard } from "../ResultCard";
import styles from "./styles.module.css";

const results = [
  {
    image: pessoa1,
    text: "A avaliação foi essencial para eu entender meus objetivos e seguir um treino realmente eficaz.",
    name: "Natália, 42 anos",
    metric: "Rotina ativa",
  },
  {
    image: pessoa2,
    text: "Depois da avaliação física, consegui seguir um plano mais eficiente e ganhei disposição no dia a dia.",
    name: "Marcos, 37 anos",
    metric: "9 kg em 3 meses",
  },
  {
    image: pessoa3,
    text: "O cuidado individualizado respeitou meus limites, mas sempre me colocou em evolução.",
    name: "Luisa, 27 anos",
    metric: "Mais constância",
  },
];

export function RateSection() {
  return (
    <section id="resultados" className={styles.rateSection}>
      <div className={styles.content}>
        <span className={styles.eyebrow}>Resultados</span>
        <h2>Evoluções reais começam com acompanhamento real.</h2>
        <p>
          Cada etapa é acompanhada com dados, percepção de esforço e ajustes
          práticos para o treino continuar fazendo sentido.
        </p>
      </div>

      <div className={styles.cards}>
        {results.map((item) => (
          <ResultCard
            key={item.name}
            image={item.image}
            text={item.text}
            name={item.name}
            metric={item.metric}
          />
        ))}
      </div>
    </section>
  );
}
