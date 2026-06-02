import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../../../firebase";
import styles from "./styles.module.css";

const metricCards = [
  {
    id: "bodyFat",
    label: "Gordura corporal",
    unit: "%",
    status: "Percentual atual",
    tone: "good",
  },
  {
    id: "bmi",
    label: "IMC",
    unit: "",
    status: "Indice atual",
    tone: "neutral",
  },
  {
    id: "weight",
    label: "Peso",
    unit: "kg",
    status: "Atual",
    tone: "neutral",
  },
  {
    id: "leanMass",
    label: "Massa magra",
    unit: "kg",
    status: "Estimativa atual",
    tone: "warning",
  },
  {
    id: "vo2Max",
    label: "VO2 max",
    unit: "ml/kg/min",
    status: "Condicionamento",
    tone: "warning",
  },
];

function getEvaluationTime(evaluation) {
  if (!evaluation.evaluationDate) {
    return 0;
  }

  return new Date(`${evaluation.evaluationDate}T00:00:00`).getTime();
}

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

function formatValue(value, unit) {
  if (typeof value !== "number") {
    return null;
  }

  const formattedValue = value.toFixed(1).replace(".", ",");
  const cleanValue = formattedValue.endsWith(",0")
    ? formattedValue.replace(",0", "")
    : formattedValue;

  return `${cleanValue}${unit ? ` ${unit}` : ""}`;
}

function getDaysSince(dateValue) {
  if (!dateValue) {
    return null;
  }

  const today = new Date();
  const evaluationDate = new Date(`${dateValue}T00:00:00`);
  const diffInMs = today.setHours(0, 0, 0, 0) - evaluationDate.getTime();

  return Math.max(Math.floor(diffInMs / 86400000), 0);
}

function getBmiStatus(bmi) {
  if (typeof bmi !== "number") {
    return "Indice atual";
  }

  if (bmi < 18.5) {
    return "Abaixo do peso";
  }

  if (bmi < 25) {
    return "Normal";
  }

  if (bmi < 30) {
    return "Sobrepeso";
  }

  return "Acompanhar";
}

function buildPerformanceCards(evaluations) {
  const latestEvaluation = evaluations[evaluations.length - 1];

  if (!latestEvaluation) {
    return [];
  }

  const cards = metricCards
    .map((card) => {
      const value = latestEvaluation.metrics?.[card.id];
      const formattedValue = formatValue(value, card.unit);

      if (!formattedValue) {
        return null;
      }

      return {
        ...card,
        value: formattedValue,
        status: card.id === "bmi" ? getBmiStatus(value) : card.status,
      };
    })
    .filter(Boolean);

  const daysSinceLastEvaluation = getDaysSince(latestEvaluation.evaluationDate);

  return [
    ...cards,
    {
      label: "Ultima avaliacao",
      value: formatDate(latestEvaluation.evaluationDate),
      status:
        daysSinceLastEvaluation === null
          ? `${evaluations.length} registro(s)`
          : `${daysSinceLastEvaluation} dia(s) desde a ultima medicao`,
      tone: "neutral",
    },
  ];
}

export function PerformanceSection() {
  const [evaluations, setEvaluations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);

      if (!user) {
        setEvaluations([]);
        setFeedback("Entre com sua conta para visualizar seu desempenho.");
        setIsLoading(false);
        return;
      }

      try {
        const evaluationsQuery = query(
          collection(db, "physicalEvaluations"),
          where("studentId", "==", user.uid),
        );
        const evaluationsSnapshot = await getDocs(evaluationsQuery);

        const studentEvaluations = evaluationsSnapshot.docs
          .map((evaluationDoc) => ({
            id: evaluationDoc.id,
            ...evaluationDoc.data(),
          }))
          .sort((firstEvaluation, secondEvaluation) => {
            return getEvaluationTime(firstEvaluation) - getEvaluationTime(secondEvaluation);
          });

        setEvaluations(studentEvaluations);
        setFeedback("");
      } catch (error) {
        console.error("Erro ao buscar desempenho do aluno:", error);
        setFeedback("Nao foi possivel carregar seu desempenho.");
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const performanceCards = useMemo(
    () => buildPerformanceCards(evaluations),
    [evaluations],
  );

  if (isLoading) {
    return (
      <section className={styles.performance}>
        <h2>Meu desempenho</h2>
        <p className={styles.feedback}>Carregando seu desempenho...</p>
      </section>
    );
  }

  if (feedback) {
    return (
      <section className={styles.performance}>
        <h2>Meu desempenho</h2>
        <p className={styles.feedback}>{feedback}</p>
      </section>
    );
  }

  if (performanceCards.length === 0) {
    return (
      <section className={styles.performance}>
        <h2>Meu desempenho</h2>
        <p className={styles.feedback}>
          Nenhuma avaliacao fisica cadastrada para sua conta ainda.
        </p>
      </section>
    );
  }

  return (
    <section className={styles.performance}>
      <h2>Meu desempenho</h2>

      <div className={styles.metricsGrid}>
        {performanceCards.map((card) => (
          <article
            key={card.label}
            className={`${styles.metricCard} ${styles[card.tone]}`}
          >
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.status}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
