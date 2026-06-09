import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../../config/firebase";
import {
  buildIsoDate,
  createAppointment,
  formatAppointmentDate,
  formatAppointmentDay,
  formatAppointmentMonth,
  getTodayIsoDate,
  listFutureAppointments,
} from "../../../../services/appointments";
import styles from "./styles.module.css";

const months = [
  "JANEIRO",
  "FEVEREIRO",
  "MARCO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
];

const availableTimes = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function isPastDate(year, monthIndex, day) {
  return buildIsoDate(year, monthIndex, day) < getTodayIsoDate();
}

function getFirstAvailableDay(year, monthIndex) {
  const daysInMonth = getDaysInMonth(year, monthIndex);

  for (let day = 1; day <= daysInMonth; day += 1) {
    if (!isPastDate(year, monthIndex, day)) {
      return day;
    }
  }

  return daysInMonth;
}

function getNextMonth(currentYear, currentMonth, direction) {
  const nextDate = new Date(currentYear, currentMonth + direction, 1);

  return {
    year: nextDate.getFullYear(),
    month: nextDate.getMonth(),
  };
}

function sortAppointments(firstAppointment, secondAppointment) {
  const firstDate = `${firstAppointment.scheduledDate} ${firstAppointment.scheduledTime}`;
  const secondDate = `${secondAppointment.scheduledDate} ${secondAppointment.scheduledTime}`;

  return firstDate.localeCompare(secondDate);
}

function getStatusClass(status) {
  if (status === "Confirmado") {
    return styles.confirmedStatus;
  }

  if (status === "Cancelado") {
    return styles.canceledStatus;
  }

  return styles.pendingStatus;
}

export function AppointmentsSection() {
  const today = useMemo(() => new Date(), []);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState(availableTimes[0]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const availableDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
  }, [selectedMonth, selectedYear]);

  const selectedDate = useMemo(
    () => buildIsoDate(selectedYear, selectedMonth, selectedDay),
    [selectedDay, selectedMonth, selectedYear],
  );

  const studentAppointments = useMemo(() => {
    if (!currentStudent) {
      return [];
    }

    // "Seus horarios" mostra apenas documentos do aluno logado.
    // O vinculo principal e o uid do Firebase Auth salvo como studentId.
    return appointments.filter(
      (appointment) => appointment.studentId === currentStudent.uid,
    );
  }, [appointments, currentStudent]);

  const unavailableTimes = useMemo(() => {
    // Qualquer agendamento ativo no mesmo dia bloqueia aquele horario
    // para evitar dois alunos no mesmo slot.
    return appointments
      .filter(
        (appointment) =>
          appointment.scheduledDate === selectedDate &&
          appointment.status !== "Cancelado",
      )
      .map((appointment) => appointment.scheduledTime);
  }, [appointments, selectedDate]);

  const formattedDate = useMemo(
    () => formatAppointmentDate(selectedDate),
    [selectedDate],
  );

  const isCurrentMonth =
    selectedYear === today.getFullYear() && selectedMonth === today.getMonth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentStudent(null);
        setAppointments([]);
        setIsLoading(false);
        setFeedback("Entre com uma conta cadastrada para salvar seus agendamentos.");
        return;
      }

      try {
        setIsLoading(true);

        const userSnapshot = await getDoc(doc(db, "users", user.uid));
        const profileName = userSnapshot.exists()
          ? userSnapshot.data().name
          : "";
        const futureAppointments = await listFutureAppointments(user.uid);

        setCurrentStudent({
          uid: user.uid,
          name: profileName || user.displayName || user.email || "Aluno",
          email: user.email || "",
        });
        setAppointments(futureAppointments);
        setFeedback("");
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        setFeedback("Nao foi possivel carregar seus agendamentos agora.");
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isPastDate(selectedYear, selectedMonth, selectedDay)) {
      setSelectedDay(getFirstAvailableDay(selectedYear, selectedMonth));
    }
  }, [selectedDay, selectedMonth, selectedYear]);

  function handleMonthChange(direction) {
    const nextMonth = getNextMonth(selectedYear, selectedMonth, direction);
    const firstAllowedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const requestedMonth = new Date(nextMonth.year, nextMonth.month, 1);

    if (requestedMonth < firstAllowedMonth) {
      return;
    }

    const daysInNextMonth = getDaysInMonth(nextMonth.year, nextMonth.month);
    const nextDay = Math.min(selectedDay, daysInNextMonth);

    setSelectedYear(nextMonth.year);
    setSelectedMonth(nextMonth.month);
    setSelectedDay(
      isPastDate(nextMonth.year, nextMonth.month, nextDay)
        ? getFirstAvailableDay(nextMonth.year, nextMonth.month)
        : nextDay,
    );
    setFeedback("");
  }

  function handleDaySelect(day) {
    if (isPastDate(selectedYear, selectedMonth, day)) {
      return;
    }

    setSelectedDay(day);
    setFeedback("");
  }

  function handleTimeSelect(time) {
    if (unavailableTimes.includes(time)) {
      return;
    }

    setSelectedTime(time);
    setFeedback("");
  }

  async function handleCreateAppointment() {
    if (!currentStudent) {
      setFeedback("Entre com uma conta cadastrada para confirmar o agendamento.");
      return;
    }

    if (unavailableTimes.includes(selectedTime)) {
      setFeedback("Esse horario acabou de ser ocupado. Escolha outro horario.");
      return;
    }

    try {
      setIsSaving(true);

      // Este e o ponto em que o agendamento sai da tela e vira documento no Firestore.
      // Depois que o banco confirma, eu atualizo a lista local para aparecer em "Seus horarios".
      const newAppointment = await createAppointment({
        student: currentStudent,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
      });

      setAppointments((currentAppointments) =>
        [...currentAppointments, newAppointment].sort(sortAppointments),
      );
      setFeedback("Agendamento salvo com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      setFeedback("Nao foi possivel salvar o agendamento agora.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.appointments}>
      <header className={styles.header}>
        <span>Painel do aluno</span>
        <h2>Agendamentos</h2>
      </header>

      <section className={styles.section} aria-labelledby="student-schedule">
        <h3 id="student-schedule">Seus horarios</h3>

        <div className={styles.appointmentList}>
          {isLoading ? (
            <p className={styles.emptyState}>Carregando seus horarios...</p>
          ) : studentAppointments.length === 0 ? (
            <p className={styles.emptyState}>Voce ainda nao tem horarios futuros.</p>
          ) : (
            studentAppointments.map((appointment) => (
              <article key={appointment.id} className={styles.appointmentCard}>
                <span className={styles.month}>
                  {formatAppointmentMonth(appointment.scheduledDate)}
                </span>
                <strong className={styles.day}>
                  {formatAppointmentDay(appointment.scheduledDate)}
                </strong>

                <div className={styles.appointmentInfo}>
                  <h4>{appointment.title}</h4>
                  <p>{appointment.scheduledTime}</p>
                  <p>{appointment.type}</p>
                  <span className={getStatusClass(appointment.status)}>
                    {appointment.status}
                  </span>
                </div>

                <div className={styles.cardActions}>
                  <button type="button" className={styles.secondaryButton}>
                    Ver detalhes
                  </button>
                  <button type="button" className={styles.textButton}>
                    Remarcar
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="new-appointment">
        <h3 id="new-appointment">Novo agendamento</h3>

        <div className={styles.scheduler}>
          <div className={styles.calendarPanel}>
            <span className={styles.stepLabel}>1. Escolha uma data</span>

            <div className={styles.monthSwitcher}>
              <button
                type="button"
                onClick={() => handleMonthChange(-1)}
                aria-label="Mes anterior"
                disabled={isCurrentMonth}
              >
                &lt;
              </button>
              <strong>
                {months[selectedMonth]} {selectedYear}
              </strong>
              <button
                type="button"
                onClick={() => handleMonthChange(1)}
                aria-label="Proximo mes"
              >
                &gt;
              </button>
            </div>

            <div className={styles.daysGrid}>
              {availableDays.map((day) => {
                const isPastDay = isPastDate(selectedYear, selectedMonth, day);

                return (
                  <button
                    key={day}
                    type="button"
                    className={
                      day === selectedDay ? styles.selectedDay : styles.dayButton
                    }
                    onClick={() => handleDaySelect(day)}
                    disabled={isPastDay}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.detailsPanel}>
            <div>
              <span className={styles.stepLabel}>2. Escolha um horario</span>

              <div className={styles.timesGrid}>
                {availableTimes.map((time) => {
                  const isUnavailable = unavailableTimes.includes(time);

                  return (
                    <button
                      key={time}
                      type="button"
                      className={
                        time === selectedTime ? styles.selectedTime : styles.timeButton
                      }
                      onClick={() => handleTimeSelect(time)}
                      disabled={isUnavailable}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.confirmation}>
              <span className={styles.stepLabel}>3. Confirmar agendamento</span>
              <p>
                Voce esta agendando uma avaliacao fisica para o dia{" "}
                <strong>{formattedDate}</strong>, as{" "}
                <strong>{selectedTime}</strong>.
              </p>
              {feedback ? <p className={styles.feedback}>{feedback}</p> : null}
              <button
                type="button"
                onClick={handleCreateAppointment}
                disabled={isSaving || unavailableTimes.includes(selectedTime)}
              >
                {isSaving ? "Salvando..." : "Confirmar agendamento"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
