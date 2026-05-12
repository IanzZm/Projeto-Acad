import styles from "./styles.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <h2>
            Luis Tavares <span>Personal Trainer</span>
          </h2>

          <p>
            Consultoria personalizada focada em resultados reais, com
            acompanhamento profissional e estratégias adaptadas ao seu objetivo.
          </p>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.links}>
          <h3>Links rápidos</h3>

          <nav>
            <a href="#">Início</a>
            <a href="#">Sobre</a>
            <a href="#">Serviços</a>
            <a href="#">Resultados</a>
          </nav>
        </div>

        <div className={styles.contact}>
          <h3>Contato</h3>

          <p>☎ +55 84 9858-8872</p>
          <p>✉ luistavares.profissional@gmail.com</p>
          <p>⌖ Natal - RN, Brasil</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2026 Luis Tavares Personal Trainer. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}