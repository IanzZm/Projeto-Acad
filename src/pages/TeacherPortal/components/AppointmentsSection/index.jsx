import { useEffect, useMemo, useState } from "react";
import {
  deleteAppointment,
  deleteExpiredAppointments,
  formatAppointmentDay,
  formatAppointmentMonth,
  listFutureAppointments,
  updateAppointmentStatus,
} from "../../../../services/appointments";
import styles from "./styles.module.css";

const statusPriority = {
  Pendente: 1,
  Confirmado: 2,
  Cancelado: 3,
};

function sortAppointments(firstAppointment, secondAppointment) {
  const firstPriority = statusPriority[firstAppointment.status] ?? 4;
  const secondPriority = statusPriority[secondAppointment.status] ?? 4;

  if (firstPriority !== secondPriority) {
    return firstPriority - secondPriority;
  }

  const firstDate = `${firstAppointment.scheduledDate} ${firstAppointment.scheduledTime}`;
  const secondDate = `${secondAppointment.scheduledDate} ${secondAppointment.scheduledTime}`;

  return firstDate.localeCompare(secondDate);
}

function getStatusClass(status) {
  if (status === "Confirmado") {
    return styles.confirmed;
  }

  if (status === "Cancelado") {
    return styles.canceled;
  }

  return styles.pending;
}

function getActionMessage(action, appointment) {
  const appointmentLabel = `${appointment.studentName} em ${appointment.scheduledTime}`;

  if (action === "Confirmado") {
    return `Deseja confirmar o agendamento de ${appointmentLabel}?`;
  }

  if (action === "Cancelado") {
    return `Deseja cancelar o agendamento de ${appointmentLabel}?`;
  }

  return `Deseja excluir o agendamento de ${appointmentLabel}? Essa acao remove o horario do professor e do aluno.`;
}

export function AppointmentsSection() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingAppointmentId, setSavingAppointmentId] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function loadAppointments() {
      try {
        setIsLoading(true);
        await deleteExpiredAppointments();

        const futureAppointments = await listFutureAppointments();
        setAppointments(futureAppointments.sort(sortAppointments));
        setFeedback("");
      } catch (error) {
        console.error("Erro ao carregar agendamentos do professor:", error);
        setFeedback("Nao foi possivel carregar os agendamentos.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAppointments();
  }, []);

  const summary = useMemo(() => {
    return appointments.reduce(
      (currentSummary, appointment) => ({
        confirmed:
          currentSummary.confirmed +
          (appointment.status === "Confirmado" ? 1 : 0),
        pending:
          currentSummary.pending + (appointment.status === "Pendente" ? 1 : 0),
        canceled:
          currentSummary.canceled +
          (appointment.status === "Cancelado" ? 1 : 0),
      }),
      { confirmed: 0, pending: 0, canceled: 0 },
    );
  }, [appointments]);

  async function handleStatusChange(appointment, status) {
    if (!window.confirm(getActionMessage(status, appointment))) {
      return;
    }

    try {
      setSavingAppointmentId(appointment.id);
      await updateAppointmentStatus(appointment.id, status);

      setAppointments((currentAppointments) =>
        currentAppointments
          .map((currentAppointment) =>
            currentAppointment.id === appointment.id
              ? { ...currentAppointment, status }
              : currentAppointment,
          )
          .sort(sortAppointments),
      );
      setFeedback(`Agendamento ${status.toLowerCase()} com sucesso.`);
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      setFeedback("Nao foi possivel atualizar o agendamento.");
    } finally {
      setSavingAppointmentId("");
    }
  }

  async function handleDeleteAppointment(appointment) {
    if (!window.confirm(getActionMessage("Excluir", appointment))) {
      return;
    }

    try {
      setSavingAppointmentId(appointment.id);
      await deleteAppointment(appointment.id);

      setAppointments((currentAppointments) =>
        currentAppointments.filter(
          (currentAppointment) => currentAppointment.id !== appointment.id,
        ),
      );
      setFeedback("Agendamento excluido com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      setFeedback("Nao foi possivel excluir o agendamento.");
    } finally {
      setSavingAppointmentId("");
    }
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
          <strong>{summary.confirmed} agendamentos</strong>
          <small>Horarios aprovados para atendimento</small>
        </article>
        <article className={styles.summaryCard}>
          <span>Pendentes</span>
          <strong>{summary.pending} agendamentos</strong>
          <small>Aguardando confirmacao do professor</small>
        </article>
        <article className={styles.summaryCard}>
          <span>Cancelados</span>
          <strong>{summary.canceled} agendamentos</strong>
          <small>Horarios que nao serao realizados</small>
        </article>
      </section>

      {feedback ? <p className={styles.feedback}>{feedback}</p> : null}

      <section className={styles.cardsGrid} aria-label="Lista de agendamentos">
        {isLoading ? (
          <p className={styles.emptyState}>Carregando agendamentos...</p>
        ) : appointments.length === 0 ? (
          <p className={styles.emptyState}>Nenhum agendamento futuro encontrado.</p>
        ) : (
          appointments.map((appointment) => {
            const isSaving = savingAppointmentId === appointment.id;

            return (
              <article
                key={appointment.id}
                className={`${styles.appointmentCard} ${
                  appointment.status === "Cancelado" ? styles.canceledCard : ""
                }`}
              >
                <div className={styles.cardTop}>
                  <div className={styles.dateBlock}>
                    <span className={styles.month}>
                      {formatAppointmentMonth(appointment.scheduledDate)}
                    </span>
                    <strong className={styles.day}>
                      {formatAppointmentDay(appointment.scheduledDate)}
                    </strong>
                  </div>

                  <span
                    className={`${styles.statusBadge} ${getStatusClass(
                      appointment.status,
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>

                <div className={styles.appointmentInfo}>
                  <h3>{appointment.title}</h3>

                  <div className={styles.meta}>
                    <span>{appointment.scheduledTime}</span>
                    <span>{appointment.type}</span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <strong>{appointment.studentName}</strong>

                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.confirmButton}
                      onClick={() => handleStatusChange(appointment, "Confirmado")}
                      disabled={isSaving || appointment.status === "Confirmado"}
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => handleStatusChange(appointment, "Cancelado")}
                      disabled={isSaving || appointment.status === "Cancelado"}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDeleteAppointment(appointment)}
                      disabled={isSaving}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
