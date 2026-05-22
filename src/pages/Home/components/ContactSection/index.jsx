import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebase";
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

  
    <section className={styles.contactSection}>

      <div className={styles.contactHeader}>
        <h1>Pronto para começar?</h1>
        <p>
          Preencha seus dados para agendar sua avaliação física e receber um <br></br>
          direcionamento estratégico para alcançar seus objetivos.
        </p>
      </div>
      
      <div className={styles.contactWrapper}>
      <div className={styles.contactInfo}>
        <h2>Informação de contato</h2>

        <p className={styles.description}>
          Entre em contato para tirar dúvidas ou agendar sua avaliação.
        </p>

        <div className={styles.contactList}>
          <p>☎ +55 84 9858-8872</p>
          <p>✉ luistavares.profissional@gmail.com</p>
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-map-pin-icon lucide-map-pin"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>{" "}
            Natal - RN, Brasil
          </p>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Agende agora sua avaliação</h2>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="name">Seu nome</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Lucas Pinheiro Silva"
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

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="lucaspinheiro23@gmail.com"
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="subject">Assunto</label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Agendamento avaliação física"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="message">Mensagem</label>
          <textarea
            id="message"
            name="message"
            placeholder="Escreva aqui sua mensagem (opcional)"
          ></textarea>
        </div>

        <button type="submit">enviar</button>
      </form>
      </div> 
    </section>
  );
}
