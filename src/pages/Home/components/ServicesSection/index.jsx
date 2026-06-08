import card1 from "../../../../assets/card1.png";
import card2 from "../../../../assets/card2.png";
import card3 from "../../../../assets/card3.png";
import { ServiceCard } from "../ServiceCard";
import styles from "./styles.module.css";

const services = [
  {
    id: 1,
    title: "Personal Training",
    description: "Treinos presenciais com execução acompanhada, progressão clara e foco em constância.",
    image: card1,
    tag: "Força",
  },
  {
    id: 2,
    title: "Avaliação física",
    description: "Mapeamento corporal para entender seu ponto de partida e ajustar metas com dados.",
    image: card2,
    tag: "Métricas",
  },
  {
    id: 3,
    title: "Consultoria Online",
    description: "Plano de treino, check-ins e ajustes para quem precisa de acompanhamento à distância.",
    image: card3,
    tag: "Online",
  },
];

export function ServicesSection() {
  return (
    <section id="programas" className={styles.services}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Programas</span>
        <h2>
          Escolha o ponto de partida. O plano se adapta ao seu objetivo.
        </h2>
        <p>
          Hipertrofia, emagrecimento e performance deixam de ser promessas vagas
          quando o treino acompanha sua rotina e seus dados.
        </p>
      </div>

      <div className={styles.servicesList}>
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
            image={service.image}
            tag={service.tag}
          />
        ))}
      </div>
    </section>
  );
}
