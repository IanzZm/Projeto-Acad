import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../../config/firebase";
import styles from "./styles.module.css";

export function PageHeader() {
  const [studentProfile, setStudentProfile] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStudentProfile({ name: "", email: "" });
        return;
      }

      try {
        const userSnapshot = await getDoc(doc(db, "users", user.uid));
        const profile = userSnapshot.exists() ? userSnapshot.data() : {};

        setStudentProfile({
          name: profile.name || user.displayName || user.email || "",
          email: profile.email || user.email || "",
        });
      } catch (error) {
        console.error("Erro ao buscar perfil do aluno:", error);
        setStudentProfile({
          name: user.displayName || user.email || "",
          email: user.email || "",
        });
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

      <div className={styles.profileSummary}>
        <p className={styles.welcome}>
          Bem-vindo de volta{studentProfile.name ? `, ${studentProfile.name}` : ""}
        </p>
        {studentProfile.email ? <small>{studentProfile.email}</small> : null}
      </div>
    </div>
  );
}
