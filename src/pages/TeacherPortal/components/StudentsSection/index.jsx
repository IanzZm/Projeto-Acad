import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../config/firebase";
import styles from "./styles.module.css";

export function StudentsSection() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadStudents() {
      try {
        const studentsQuery = query(
          collection(db, "users"),
          where("role", "==", "aluno"),
        );
        const snapshot = await getDocs(studentsQuery);
        const activeStudents = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((student) => student.active !== false)
          .sort((firstStudent, secondStudent) =>
            (firstStudent.name || "").localeCompare(secondStudent.name || ""),
          );

        setStudents(activeStudents);
      } catch (error) {
        console.error(error);
        setErrorMessage("Nao foi possivel carregar os alunos cadastrados.");
      } finally {
        setIsLoading(false);
      }
    }

    loadStudents();
  }, []);

  const newestStudents = useMemo(() => {
    return students.filter((student) => {
      if (!student.createdAt?.toDate) {
        return false;
      }

      const createdAt = student.createdAt.toDate();
      const currentDate = new Date();

      return (
        createdAt.getMonth() === currentDate.getMonth() &&
        createdAt.getFullYear() === currentDate.getFullYear()
      );
    }).length;
  }, [students]);

  return (
    <div className={styles.students}>
      <header className={styles.header}>
        <div>
          <span>Painel do professor</span>
          <h2>Alunos</h2>
          <p>Lista de alunos cadastrados e ativos na plataforma.</p>
        </div>

        <p className={styles.total}>{students.length} alunos ativos</p>
      </header>

      <section className={styles.summaryGrid} aria-label="Resumo dos alunos">
        <article className={styles.summaryCard}>
          <span>Ativos</span>
          <strong>{students.length} alunos</strong>
          <small>Com cadastro liberado na plataforma</small>
        </article>
        <article className={styles.summaryCard}>
          <span>Novos este mes</span>
          <strong>{newestStudents} alunos</strong>
          <small>Cadastros realizados no mes atual</small>
        </article>
      </section>

      <section className={styles.listPanel} aria-label="Lista de alunos ativos">
        {isLoading ? (
          <p className={styles.feedback}>Carregando alunos...</p>
        ) : errorMessage ? (
          <p className={styles.feedback}>{errorMessage}</p>
        ) : students.length === 0 ? (
          <p className={styles.feedback}>Nenhum aluno ativo cadastrado.</p>
        ) : (
          <ul className={styles.studentsList}>
            {students.map((student) => (
              <li key={student.id} className={styles.studentItem}>
                <div className={styles.avatar} aria-hidden="true">
                  {(student.name || student.email || "A").charAt(0).toUpperCase()}
                </div>

                <div className={styles.studentInfo}>
                  <strong>{student.name || "Aluno sem nome"}</strong>
                  <span>{student.email || "Email nao informado"}</span>
                </div>

                <span className={styles.statusBadge}>Ativo</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
