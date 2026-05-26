import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../../firebase";
import styles from "./styles.module.css";

export function PageHeader() {
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStudentName("");
        return;
      }

      try {
        const userSnapshot = await getDoc(doc(db, "users", user.uid));
        const profileName = userSnapshot.exists()
          ? userSnapshot.data().name
          : "";

        setStudentName(profileName || user.displayName || user.email || "");
      } catch (error) {
        console.error("Erro ao buscar perfil do aluno:", error);
        setStudentName(user.displayName || user.email || "");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div className={styles.pageHeader}>
      <div>
        <span>Painel do aluno</span>
        <h2>Resumo da sua evolucao</h2>
        <p>Acompanhe seus indicadores, avaliacoes e proximos passos.</p>
      </div>

      <p className={styles.welcome}>
        Bem-vindo de volta{studentName ? `, ${studentName}` : ""}
      </p>
    </div>
  );
}
