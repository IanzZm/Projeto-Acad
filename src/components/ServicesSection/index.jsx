import styles from "./styles.module.css";
import { ServiceCard } from "../ServiceCard";

import card1 from "../../assets/card1.png";
import card2 from "../../assets/card2.png";
import card3 from "../../assets/card3.png";

const services = [
  {
    id: 1,
    title: "Personal Training",
    description: "Evolua seu físico com um treino focado em hipertrofia.",
    image: card1,
  },
  {
    id: 2,
    title: "Mapeamento Corporal",
    description: "Mapeamento corporal estratégico para resultados precisos.",
    image: card2,
  },
  {
    id: 3,
    title: "Consultoria Online",
    description: "Consultoria online estratégica para performance.",
    image: card3,
  },
];


export function ServicesSection() {
    return (
        <main className={styles.services}>
        <section className={styles.servicesSection}>
          <h1 className={styles.sectionTitle}>Ajudamos você a cumprir sua <span>meta</span>.</h1>
          <div className={styles.servicesList}>
            {services.map((service) => (
            <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
            image={service.image}
            />
        ))}
           </div>
        </section>
        </main>
    )
}