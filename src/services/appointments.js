import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";

const APPOINTMENTS_COLLECTION = "appointments";

function getAppointmentsCollection() {
  return collection(db, APPOINTMENTS_COLLECTION);
}

function sortByDateAndTime(firstAppointment, secondAppointment) {
  const firstDate = `${firstAppointment.scheduledDate} ${firstAppointment.scheduledTime}`;
  const secondDate = `${secondAppointment.scheduledDate} ${secondAppointment.scheduledTime}`;

  return firstDate.localeCompare(secondDate);
}

function normalizeAppointment(documentSnapshot) {
  const data = documentSnapshot.data();

  // O Firestore guarda os nomes em ingles para ficar consistente no banco.
  // Aqui eu devolvo um objeto pronto para as telas usarem sem conhecer detalhes do banco.
  return {
    id: documentSnapshot.id,
    studentId: data.studentId || "",
    studentName: data.studentName || "Aluno",
    studentEmail: data.studentEmail || "",
    title: data.title || "Avaliacao fisica",
    type: data.type || "Atendimento presencial",
    status: data.status || "Pendente",
    scheduledDate: data.scheduledDate || "",
    scheduledTime: data.scheduledTime || "",
  };
}

export function getTodayIsoDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  // Formato YYYY-MM-DD: alem de ser simples de salvar no Firestore,
  // tambem permite comparar datas futuras/passadas com string.
  return `${year}-${month}-${day}`;
}

export function buildIsoDate(year, monthIndex, day) {
  const month = String(monthIndex + 1).padStart(2, "0");
  const paddedDay = String(day).padStart(2, "0");

  return `${year}-${month}-${paddedDay}`;
}

export function formatAppointmentDate(isoDate) {
  if (!isoDate) {
    return "";
  }

  const [year, month, day] = isoDate.split("-");

  return `${day}/${month}/${year}`;
}

export function formatAppointmentMonth(isoDate) {
  if (!isoDate) {
    return "";
  }

  const date = new Date(`${isoDate}T00:00:00`);

  return date.toLocaleDateString("pt-BR", { month: "long" }).toUpperCase();
}

export function formatAppointmentDay(isoDate) {
  if (!isoDate) {
    return "";
  }

  return Number(isoDate.split("-")[2]);
}

export async function listFutureAppointments(studentId) {
  const todayIsoDate = getTodayIsoDate();
  const appointmentsQuery = studentId
    ? query(getAppointmentsCollection(), where("studentId", "==", studentId))
    : getAppointmentsCollection();
  const snapshot = await getDocs(appointmentsQuery);

  // Mantive o filtro no front por enquanto para evitar precisar criar indice composto
  // no Firestore nesta fase inicial do projeto.
  return snapshot.docs
    .map(normalizeAppointment)
    .filter((appointment) => appointment.scheduledDate >= todayIsoDate)
    .sort(sortByDateAndTime);
}

export async function deleteExpiredAppointments() {
  const todayIsoDate = getTodayIsoDate();
  const snapshot = await getDocs(getAppointmentsCollection());
  const expiredAppointments = snapshot.docs.filter((documentSnapshot) => {
    const scheduledDate = documentSnapshot.data().scheduledDate;

    return scheduledDate && scheduledDate < todayIsoDate;
  });

  // Isso funciona como uma limpeza simples quando a tela abre.
  // Mais para frente, o ideal e transformar essa parte em Cloud Function agendada.
  await Promise.all(
    expiredAppointments.map((documentSnapshot) =>
      deleteDoc(doc(db, APPOINTMENTS_COLLECTION, documentSnapshot.id)),
    ),
  );
}

export async function createAppointment({ student, scheduledDate, scheduledTime }) {
  const documentRef = await addDoc(getAppointmentsCollection(), {
    studentId: student.uid,
    studentName: student.name,
    studentEmail: student.email,
    title: "Avaliacao fisica",
    type: "Atendimento presencial",
    status: "Pendente",
    scheduledDate,
    scheduledTime,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: documentRef.id,
    studentId: student.uid,
    studentName: student.name,
    studentEmail: student.email,
    title: "Avaliacao fisica",
    type: "Atendimento presencial",
    status: "Pendente",
    scheduledDate,
    scheduledTime,
  };
}

export async function updateAppointmentStatus(appointmentId, status) {
  const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);

  await updateDoc(appointmentRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteAppointment(appointmentId) {
  await deleteDoc(doc(db, APPOINTMENTS_COLLECTION, appointmentId));
}
