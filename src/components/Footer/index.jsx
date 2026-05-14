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
          <p><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg> Natal - RN, Brasil</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2026 Luis Tavares Personal Trainer. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}