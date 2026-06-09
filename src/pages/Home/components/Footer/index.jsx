import styles from "./styles.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>LT</span>
          <h2>Luis Tavares Personal Trainer</h2>
          <p>
            Consultoria personalizada focada em resultados reais, com
            acompanhamento profissional e estratégias adaptadas ao seu objetivo.
          </p>
        </div>

        <nav className={styles.links}>
          <a href="#topo">Início</a>
          <a href="#programas">Programas</a>
          <a href="#sobre">Sobre</a>
          <a href="#resultados">Resultados</a>
          <a href="#contato">Contato</a>
        </nav>

        <div className={styles.contact}>
          <a href="tel:+5584998588871">+55 84 99858-8871</a>
          <a href="mailto:luistavares.profissional@gmail.com">
            luistavares.profissional@gmail.com
          </a>
          <span>Natal - RN, Brasil</span>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2026 Luis Tavares Personal Trainer. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
