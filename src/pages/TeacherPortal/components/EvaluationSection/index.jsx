import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import styles from "./styles.module.css";

// Estado inicial do formulario. Cada propriedade representa um campo da avaliacao.
const initialForm = {
  studentId: "",
  evaluationDate: new Date().toISOString().slice(0, 10),
  weight: "",
  height: "",
  bodyFat: "",
  chest: "",
  waist: "",
  abdomen: "",
  hip: "",
  thigh: "",
  arm: "",
  restingHeartRate: "",
  systolicPressure: "",
  diastolicPressure: "",
  vo2Max: "",
  pushUps: "",
  sitUps: "",
  flexibility: "",
  notes: "",
};

// Lista dos campos numericos para converter antes de salvar no Firestore.
const numericFields = [
  "weight",
  "height",
  "bodyFat",
  "chest",
  "waist",
  "abdomen",
  "hip",
  "thigh",
  "arm",
  "restingHeartRate",
  "systolicPressure",
  "diastolicPressure",
  "vo2Max",
  "pushUps",
  "sitUps",
  "flexibility",
];

// Converte valores digitados como texto em numero, aceitando virgula ou ponto.
function parseNumber(value) {
  if (value === "") {
    return null;
  }

  const parsedValue = Number(String(value).replace(",", "."));
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

// Formata os resultados calculados para aparecerem nos cards do topo.
function formatCalculatedValue(value, suffix = "") {
  if (value === null) {
    return "Preencha os dados";
  }

  return `${value.toFixed(1).replace(".", ",")}${suffix}`;
}

// Mostra a data no padrao brasileiro.
function formatDate(dateValue) {
  if (!dateValue) {
    return "Data nao informada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${dateValue}T00:00:00`));
}

export function EvaluationSection() {
  // Lista de alunos carregados da colecao "users".
  const [students, setStudents] = useState([]);

  // Ultimas avaliacoes carregadas da colecao "physicalEvaluations".
  const [evaluations, setEvaluations] = useState([]);

  // Guarda todos os valores digitados no formulario.
  const [formData, setFormData] = useState(initialForm);

  // Controla o estado de carregamento inicial.
  const [isLoading, setIsLoading] = useState(true);

  // Controla o estado do botao enquanto salva.
  const [isSaving, setIsSaving] = useState(false);

  // Mensagem de sucesso ou erro exibida abaixo do formulario.
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    async function loadEvaluationData() {
      try {
        // Busca apenas usuarios com papel de aluno.
        const studentsQuery = query(
          collection(db, "users"),
          where("role", "==", "aluno"),
        );

        // Busca as 5 avaliacoes mais recentes.
        const evaluationsQuery = query(
          collection(db, "physicalEvaluations"),
          orderBy("createdAt", "desc"),
          limit(5),
        );

        // Executa as duas buscas ao mesmo tempo para carregar a tela mais rapido.
        const [studentsSnapshot, evaluationsSnapshot] = await Promise.all([
          getDocs(studentsQuery),
          getDocs(evaluationsQuery),
        ]);

        // Transforma os documentos do Firebase em objetos comuns, filtra ativos e ordena por nome.
        const activeStudents = studentsSnapshot.docs
          .map((studentDoc) => ({
            id: studentDoc.id,
            ...studentDoc.data(),
          }))
          .filter((student) => student.active !== false)
          .sort((firstStudent, secondStudent) =>
            (firstStudent.name || "").localeCompare(secondStudent.name || ""),
          );

        // Transforma os documentos de avaliacoes em uma lista para mostrar no historico.
        const latestEvaluations = evaluationsSnapshot.docs.map(
          (evaluationDoc) => ({
            id: evaluationDoc.id,
            ...evaluationDoc.data(),
          }),
        );

        setStudents(activeStudents);
        setEvaluations(latestEvaluations);
      } catch (error) {
        // Se o Firebase falhar, o usuario recebe uma mensagem amigavel.
        console.error(error);
        setFeedback({
          type: "error",
          message: "Nao foi possivel carregar os dados da avaliacao.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadEvaluationData();
  }, []);

  const selectedStudent = useMemo(() => {
    // Encontra o objeto completo do aluno selecionado pelo ID do select.
    return students.find((student) => student.id === formData.studentId);
  }, [formData.studentId, students]);

  const calculatedMetrics = useMemo(() => {
    // Converte os campos necessarios para numero antes de calcular.
    const weight = parseNumber(formData.weight);
    const height = parseNumber(formData.height);
    const bodyFat = parseNumber(formData.bodyFat);

    // A altura vem em centimetros no formulario, entao aqui vira metros.
    const heightInMeters = height ? height / 100 : null;

    // IMC = peso / altura ao quadrado.
    const bmi =
      weight && heightInMeters ? weight / (heightInMeters * heightInMeters) : null;

    // Massa gorda = peso multiplicado pelo percentual de gordura.
    const fatMass = weight && bodyFat !== null ? weight * (bodyFat / 100) : null;

    // Massa magra = peso total menos a massa gorda.
    const leanMass = weight && fatMass !== null ? weight - fatMass : null;

    return {
      bmi,
      fatMass,
      leanMass,
    };
  }, [formData.bodyFat, formData.height, formData.weight]);

  function handleFieldChange(event) {
    // Atualiza o campo correto conforme o usuario digita.
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    // Evita o recarregamento padrao da pagina ao enviar o formulario.
    event.preventDefault();
    setFeedback({ type: "", message: "" });

    // O cadastro so pode ser salvo quando existe aluno selecionado.
    if (!selectedStudent) {
      setFeedback({
        type: "error",
        message: "Selecione um aluno antes de salvar a avaliacao.",
      });
      return;
    }

    // Peso e altura sao obrigatorios porque alimentam os calculos principais.
    if (!formData.evaluationDate || !formData.weight || !formData.height) {
      setFeedback({
        type: "error",
        message: "Informe a data, o peso e a altura para salvar.",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Monta um objeto com todos os campos numericos ja convertidos.
      const metrics = numericFields.reduce((currentMetrics, fieldName) => {
        return {
          ...currentMetrics,
          [fieldName]: parseNumber(formData[fieldName]),
        };
      }, {});

      // Objeto final que sera enviado para a colecao "physicalEvaluations".
      // O studentId e o ponto principal da ligacao: ele permite que o portal do aluno
      // busque somente as avaliacoes cadastradas para o UID dele.
      const evaluationData = {
        studentId: selectedStudent.id,
        studentName: selectedStudent.name || "Aluno sem nome",
        studentEmail: selectedStudent.email || "",
        evaluationDate: formData.evaluationDate,
        metrics: {
          ...metrics,
          bmi: calculatedMetrics.bmi,
          fatMass: calculatedMetrics.fatMass,
          leanMass: calculatedMetrics.leanMass,
        },
        notes: formData.notes.trim(),
        createdAt: serverTimestamp(),
      };

      // Salva a avaliacao no Firestore.
      const createdEvaluation = await addDoc(
        collection(db, "physicalEvaluations"),
        evaluationData,
      );

      // Atualiza a lista de registros sem precisar recarregar a pagina.
      setEvaluations((currentEvaluations) => [
        {
          id: createdEvaluation.id,
          ...evaluationData,
          createdAt: new Date(),
        },
        ...currentEvaluations,
      ].slice(0, 5));

      // Limpa o formulario, mas mantem o aluno selecionado para facilitar cadastros seguidos.
      setFormData({
        ...initialForm,
        studentId: selectedStudent.id,
      });

      // Mostra confirmacao para o professor.
      setFeedback({
        type: "success",
        message: "Avaliacao fisica cadastrada com sucesso.",
      });
    } catch (error) {
      // Caso o salvamento falhe, mantem os dados na tela e avisa o usuario.
      console.error(error);
      setFeedback({
        type: "error",
        message: "Nao foi possivel salvar a avaliacao. Tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.evaluations}>
      {/* Cabecalho principal da pagina. */}
      <header className={styles.header}>
        <div>
          <span>Painel do professor</span>
          <h2>Avaliacoes fisicas</h2>
          <p>Cadastre as metricas do aluno no momento da avaliacao.</p>
        </div>

        <p className={styles.total}>{evaluations.length} registros recentes</p>
      </header>

      {/* Cards com os calculos principais da avaliacao em preenchimento. */}
      <section className={styles.summaryGrid} aria-label="Resumo das avaliacoes">
        <article className={styles.summaryCard}>
          <span>IMC</span>
          <strong>{formatCalculatedValue(calculatedMetrics.bmi)}</strong>
          <small>peso / altura ao quadrado</small>
        </article>
        <article className={styles.summaryCard}>
          <span>Massa gorda</span>
          <strong>{formatCalculatedValue(calculatedMetrics.fatMass, " kg")}</strong>
          <small>peso x percentual de gordura</small>
        </article>
        <article className={styles.summaryCard}>
          <span>Massa magra</span>
          <strong>{formatCalculatedValue(calculatedMetrics.leanMass, " kg")}</strong>
          <small>peso menos massa gorda</small>
        </article>
      </section>

      {/* Area principal com o formulario de cadastro. */}
      <section className={styles.workspace}>
        <form className={styles.formPanel} onSubmit={handleSubmit}>
          <div className={styles.panelHeader}>
            <div>
              <h3>Nova avaliacao</h3>
              <p>Dados corporais, perimetros e testes fisicos.</p>
            </div>
          </div>

          <div className={styles.formGrid}>
            {/* Select que define para qual aluno a avaliacao sera cadastrada. */}
            <label className={styles.fullField}>
              <span>Aluno</span>
              <select
                name="studentId"
                value={formData.studentId}
                onChange={handleFieldChange}
                disabled={isLoading}
              >
                <option value="">Selecione um aluno</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name || student.email || "Aluno sem nome"}
                  </option>
                ))}
              </select>
            </label>

            {/* Campos basicos da avaliacao. */}
            <label>
              <span>Data</span>
              <input
                type="date"
                name="evaluationDate"
                value={formData.evaluationDate}
                onChange={handleFieldChange}
              />
            </label>

            <label>
              <span>Peso (kg)</span>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleFieldChange}
                min="0"
                step="0.1"
                placeholder="76.5"
              />
            </label>

            <label>
              <span>Altura (cm)</span>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleFieldChange}
                min="0"
                step="0.1"
                placeholder="178"
              />
            </label>

            <label>
              <span>Gordura corporal (%)</span>
              <input
                type="number"
                name="bodyFat"
                value={formData.bodyFat}
                onChange={handleFieldChange}
                min="0"
                step="0.1"
                placeholder="18"
              />
            </label>

            {/* Campos de perimetros corporais. */}
            <label>
              <span>Torax (cm)</span>
              <input
                type="number"
                name="chest"
                value={formData.chest}
                onChange={handleFieldChange}
                min="0"
                step="0.1"
              />
            </label>

            <label>
              <span>Cintura (cm)</span>
              <input
                type="number"
                name="waist"
                value={formData.waist}
                onChange={handleFieldChange}
                min="0"
                step="0.1"
              />
            </label>

            <label>
              <span>Abdomen (cm)</span>
              <input
                type="number"
                name="abdomen"
                value={formData.abdomen}
                onChange={handleFieldChange}
                min="0"
                step="0.1"
              />
            </label>

            <label>
              <span>Quadril (cm)</span>
              <input
                type="number"
                name="hip"
                value={formData.hip}
                onChange={handleFieldChange}
                min="0"
                step="0.1"
              />
            </label>

            <label>
              <span>Coxa (cm)</span>
              <input
                type="number"
                name="thigh"
                value={formData.thigh}
                onChange={handleFieldChange}
                min="0"
                step="0.1"
              />
            </label>

            <label>
              <span>Braco (cm)</span>
              <input
                type="number"
                name="arm"
                value={formData.arm}
                onChange={handleFieldChange}
                min="0"
                step="0.1"
              />
            </label>

            {/* Campos cardiorrespiratorios e de testes fisicos. */}
            <label>
              <span>FC repouso</span>
              <input
                type="number"
                name="restingHeartRate"
                value={formData.restingHeartRate}
                onChange={handleFieldChange}
                min="0"
                step="1"
                placeholder="68"
              />
            </label>

            <label>
              <span>Pressao sistolica</span>
              <input
                type="number"
                name="systolicPressure"
                value={formData.systolicPressure}
                onChange={handleFieldChange}
                min="0"
                step="1"
                placeholder="120"
              />
            </label>

            <label>
              <span>Pressao diastolica</span>
              <input
                type="number"
                name="diastolicPressure"
                value={formData.diastolicPressure}
                onChange={handleFieldChange}
                min="0"
                step="1"
                placeholder="80"
              />
            </label>

            <label>
              <span>VO2 max</span>
              <input
                type="number"
                name="vo2Max"
                value={formData.vo2Max}
                onChange={handleFieldChange}
                min="0"
                step="0.1"
              />
            </label>

            <label>
              <span>Flexoes</span>
              <input
                type="number"
                name="pushUps"
                value={formData.pushUps}
                onChange={handleFieldChange}
                min="0"
                step="1"
              />
            </label>

            <label>
              <span>Abdominais</span>
              <input
                type="number"
                name="sitUps"
                value={formData.sitUps}
                onChange={handleFieldChange}
                min="0"
                step="1"
              />
            </label>

            <label>
              <span>Flexibilidade (cm)</span>
              <input
                type="number"
                name="flexibility"
                value={formData.flexibility}
                onChange={handleFieldChange}
                step="0.1"
              />
            </label>

            {/* Campo livre para contexto clinico, protocolo usado ou orientacoes. */}
            <label className={styles.fullField}>
              <span>Observacoes</span>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleFieldChange}
                rows="4"
                placeholder="Anote restricoes, protocolo usado ou orientacoes para o proximo ciclo."
              />
            </label>
          </div>

          {/* Feedback de validacao, erro de Firebase ou sucesso no cadastro. */}
          {feedback.message && (
            <p
              className={`${styles.feedback} ${
                feedback.type === "success" ? styles.success : styles.error
              }`}
            >
              {feedback.message}
            </p>
          )}

          {/* Botao principal do formulario. */}
          <div className={styles.formActions}>
            <button type="submit" disabled={isSaving || isLoading}>
              {isSaving ? "Salvando..." : "Salvar avaliacao"}
            </button>
          </div>
        </form>
      </section>

      {/* Bloco inferior com os ultimos registros salvos. */}
      <section className={styles.recordsPanel} aria-label="Registros recentes">
        <div className={styles.panelHeader}>
          <div>
            <h3>Registros recentes</h3>
            <p>Ultimas avaliacoes fisicas cadastradas.</p>
          </div>
        </div>

        {/* Historico simples das ultimas avaliacoes cadastradas. */}
        <div className={styles.historyPanel}>
          {isLoading ? (
            <p className={styles.emptyState}>Carregando avaliacoes...</p>
          ) : evaluations.length === 0 ? (
            <p className={styles.emptyState}>Nenhuma avaliacao cadastrada.</p>
          ) : (
            <ul className={styles.historyList}>
              {evaluations.map((evaluation) => (
                <li key={evaluation.id}>
                  <div>
                    <strong>{evaluation.studentName || "Aluno sem nome"}</strong>
                    <span>{formatDate(evaluation.evaluationDate)}</span>
                  </div>
                  <small>
                    {evaluation.metrics?.weight
                      ? `${evaluation.metrics.weight} kg`
                      : "Peso nao informado"}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
