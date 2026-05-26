import { useState } from "react";
import styles from "./styles.module.css";

const initialAppointments = [
  {
    id: 1,
    month: "MARCO",
    day: 28,
    student: "Marcia",
    age: 28,
    title: "Avaliacao Fisica",
    time: "18:00",
    type: "Atendimento presencial",
    status: "Confirmado",
  },
  {
    id: 2,
    month: "MARCO",
    day: 29,
    student: "Felipe",
    age: 22,
    title: "Avaliacao Fisica",
    time: "15:00",
    type: "Atendimento presencial",
    status: "Confirmado",
  },
  {
    id: 3,
    month: "MARCO",
    day: 31,
    student: "Paulo",
    age: 18,
    title: "Avaliacao Fisica",
    time: "18:30",
    type: "Atendimento presencial",
    status: "Pendente",
  },
  {
    id: 4,
    month: "MARCO",
    day: 28,
    student: "Caio",
    age: 32,
    title: "Avaliacao Fisica",
    time: "14:00",
    type: "Atendimento presencial",
    status: "Pendente",
  },
  {
    id: 5,
    month: "MARCO",
    day: 28,
    student: "Juliana",
    age: 25,
    title: "Avaliacao Fisica",
    time: "19:00",
    type: "Atendimento presencial",
    status: "Cancelado",
  },
  {
    id: 6,
    month: "MARCO",
    day: 30,
    student: "Renato",
    age: 41,
    title: "Avaliacao Fisica",
    time: "20:00",
    type: "Atendimento presencial",
    status: "Confirmado",
  },
];

export function AppointmentsSection() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "Confirmado",
  ).length;
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "Pendente",
  ).length;
  const canceledAppointments = appointments.filter(
    (appointment) => appointment.status === "Cancelado",
  ).length;

  function handleStatusChange(appointmentId, status) {
    setAppointments((currentAppointments) =>
      currentAppointments.map((appointment) =>
        appointment.id === appointmentId
          ? {
              ...appointment,
              status,
            }
          : appointment,
      ),
    );
  }

  return (
    <div className={styles.appointments}>
      <header className={styles.header}>
        <div>
          <span>Painel do professor</span>
          <h2>Agendamentos</h2>
          <p>Acompanhe os horarios marcados pelos alunos.</p>
        </div>

        <p className={styles.welcome}>Bem-vindo de volta, Luis</p>
      </header>

      <section className={styles.summaryGrid} aria-label="Resumo dos agendamentos">
        <article className={styles.summaryCard}>
          <span>Confirmados</span>
          <strong>{confirmedAppointments} agendamentos</strong>
          <small>Horarios aprovados para atendimento</small>
        </article>
        <article className={styles.summaryCard}>
          <span>Pendentes</span>
          <strong>{pendingAppointments} agendamentos</strong>
          <small>Aguardando confirmacao do professor</small>
        </article>
        <article className={styles.summaryCard}>
          <span>Cancelados</span>
          <strong>{canceledAppointments} agendamentos</strong>
          <small>Horarios que nao serao realizados</small>
        </article>
      </section>

      <section className={styles.cardsGrid} aria-label="Lista de agendamentos">
        {appointments.map((appointment) => (
          <article
            key={appointment.id}
            className={`${styles.appointmentCard} ${
              appointment.status === "Cancelado" ? styles.canceledCard : ""
            }`}
          >
            <div className={styles.cardTop}>
              <div className={styles.dateBlock}>
                <span className={styles.month}>{appointment.month}</span>
                <strong className={styles.day}>{appointment.day}</strong>
              </div>

              <span
                className={`${styles.statusBadge} ${
                  appointment.status === "Confirmado"
                    ? styles.confirmed
                    : appointment.status === "Cancelado"
                      ? styles.canceled
                      : styles.pending
                }`}
              >
                {appointment.status}
              </span>
            </div>

            <div className={styles.appointmentInfo}>
              <h3>{appointment.title}</h3>

              <div className={styles.meta}>
                <span>{appointment.time}</span>
                <span>{appointment.type}</span>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <strong>
                {appointment.student}, {appointment.age} anos
              </strong>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.confirmButton}
                  onClick={() => handleStatusChange(appointment.id, "Confirmado")}
                  disabled={appointment.status === "Confirmado"}
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => handleStatusChange(appointment.id, "Cancelado")}
                  disabled={appointment.status === "Cancelado"}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
