import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../config/firebase";
import styles from "./styles.module.css";

export function ContactSection() {
  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await addDoc(collection(db, "messages"), {
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
        read: false,
        createdAt: serverTimestamp(),
      });

      form.reset();
      alert("Mensagem enviada com sucesso! Em breve entraremos em contato.");
    } catch (error) {
      console.error(error);
      alert("Não foi possível enviar a mensagem. Tente novamente.");
    }
  }

  return (
    <section id="contato" className={styles.contactSection}>
      <div className={styles.contactWrapper}>
        <div className={styles.contactInfo}>
          <span className={styles.eyebrow}>Contato</span>
          <h2>Pronto para começar seu plano?</h2>
          <p>
            Envie seus dados para agendar uma avaliação física e receber um
            direcionamento estratégico para seu objetivo.
          </p>

          <div className={styles.contactList}>
            <a href="tel:+5584998588871">+55 84 99858-8871</a>
            <a href="mailto:luistavares.profissional@gmail.com">
              luistavares.profissional@gmail.com
            </a>
            <span>Natal - RN, Brasil</span>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="phone">Telefone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="(84) 99999-9999"
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="seuemail@exemplo.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="subject">Objetivo</label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Hipertrofia, emagrecimento, performance..."
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="message">Mensagem</label>
            <textarea
              id="message"
              name="message"
              placeholder="Conte rapidamente sua rotina atual."
            ></textarea>
          </div>

          <button type="submit">Enviar mensagem</button>
        </form>
      </div>
    </section>
  );
}
