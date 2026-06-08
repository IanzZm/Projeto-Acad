import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../config/firebase";
import styles from "./styles.module.css";

// IMPORTANTE: Importe o seu componente de avaliação física aqui!
// Ajuste o caminho ("./caminho-do-arquivo") conforme a sua estrutura de pastas
import { PhysicalEvaluationSection } from "../../../StudentPortal/components/PhysicalEvaluationSection";

export function StudentsSection() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  // NOVO ESTADO: Controla qual aluno foi clicado. Começa nulo (nenhum).
  const [selectedStudentId, setSelectedStudentId] = useState(null);

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

  // NOVA LÓGICA: Se o professor clicou em um aluno, renderiza a tela de avaliação dele.
  if (selectedStudentId) {
    return (
      <div className={styles.students}>
        <button 
          type="button"
          onClick={() => setSelectedStudentId(null)}
          className={styles.backButton}
          aria-label="Voltar para a lista de alunos"
        >
          {/* Ícone de seta limpo e moderno */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Voltar para a lista
        </button>

        <PhysicalEvaluationSection studentId={selectedStudentId} />
      </div>
    );
  }

  // SE NÃO TEM ALUNO SELECIONADO: Mostra a sua lista normal
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
              <li 
                key={student.id} 
                className={styles.studentItem}
                // ADICIONADO AQUI: Quando clicar na 'li', salva o ID desse aluno no estado
                onClick={() => setSelectedStudentId(student.id)}
                style={{ cursor: "pointer" }} // Mostra a mãozinha do mouse pra indicar que é clicável
              >
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