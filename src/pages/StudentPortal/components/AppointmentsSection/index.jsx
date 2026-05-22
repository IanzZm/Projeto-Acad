import { useMemo, useState } from "react";
import styles from "./styles.module.css";

const months = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
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

const scheduledAppointments = [
  {
    id: 1,
    month: "MARÇO",
    day: 28,
    title: "Avaliação física",
    time: "18:00",
    type: "Atendimento presencial",
  },
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

function getDaysInMonth(monthIndex) {
  return new Date(2026, monthIndex + 1, 0).getDate();
}

export function AppointmentsSection() {
  const [selectedMonth, setSelectedMonth] = useState(2);
  const [selectedDay, setSelectedDay] = useState(27);
  const [selectedTime, setSelectedTime] = useState("16:30");

  const availableDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(selectedMonth);
    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
  }, [selectedMonth]);

  const formattedDate = useMemo(
    () =>
      `${String(selectedDay).padStart(2, "0")}/${String(
        selectedMonth + 1,
      ).padStart(2, "0")}`,
    [selectedDay, selectedMonth],
  );

  function handleMonthChange(direction) {
    setSelectedMonth((currentMonth) => {
      const nextMonth = (currentMonth + direction + months.length) % months.length;
      const daysInNextMonth = getDaysInMonth(nextMonth);

      setSelectedDay((currentDay) => Math.min(currentDay, daysInNextMonth));

      return nextMonth;
    });
  }

  return (
    <div className={styles.appointments}>
      <header className={styles.header}>
        <span>Painel do aluno</span>
        <h2>Agendamentos</h2>
      </header>

      <section className={styles.section} aria-labelledby="student-schedule">
        <h3 id="student-schedule">Seus horários</h3>

        <div className={styles.appointmentList}>
          {scheduledAppointments.map((appointment) => (
            <article key={appointment.id} className={styles.appointmentCard}>
              <span className={styles.month}>{appointment.month}</span>
              <strong className={styles.day}>{appointment.day}</strong>

              <div className={styles.appointmentInfo}>
                <h4>{appointment.title}</h4>
                <p>{appointment.time}</p>
                <p>{appointment.type}</p>
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
          ))}
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
                aria-label="Mês anterior"
              >
                &lt;
              </button>
              <strong>{months[selectedMonth]}</strong>
              <button
                type="button"
                onClick={() => handleMonthChange(1)}
                aria-label="Próximo mês"
              >
                &gt;
              </button>
            </div>

            <div className={styles.daysGrid}>
              {availableDays.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={day === selectedDay ? styles.selectedDay : styles.dayButton}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.detailsPanel}>
            <div>
              <span className={styles.stepLabel}>2. Escolha um horário</span>

              <div className={styles.timesGrid}>
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={
                      time === selectedTime ? styles.selectedTime : styles.timeButton
                    }
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.confirmation}>
              <span className={styles.stepLabel}>3. Confirmar agendamento</span>
              <p>
                Você está agendando uma avaliação física para o dia{" "}
                <strong>{formattedDate}</strong>, às{" "}
                <strong>{selectedTime}</strong>.
              </p>
              <button type="button">Confirmar agendamento</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
