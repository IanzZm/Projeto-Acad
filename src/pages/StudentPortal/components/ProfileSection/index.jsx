import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../../../config/firebase";
import styles from "./styles.module.css";

const initialProfile = {
  name: "",
  email: "",
  phone: "",
  birthDate: "",
  city: "",
  goal: "",
  photoURL: "",
};

function getInitials(name, email) {
  const source = name || email || "Aluno";
  return source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function ProfileSection() {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(initialProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) {
        setProfile(initialProfile);
        setFeedback("Entre com sua conta para editar seu perfil.");
        setIsLoading(false);
        return;
      }

      try {
        const userSnapshot = await getDoc(doc(db, "users", user.uid));
        const storedProfile = userSnapshot.exists() ? userSnapshot.data() : {};

        setProfile({
          name: storedProfile.name || user.displayName || "",
          email: storedProfile.email || user.email || "",
          phone: storedProfile.phone || "",
          birthDate: storedProfile.birthDate || "",
          city: storedProfile.city || "",
          goal: storedProfile.goal || "",
          photoURL: storedProfile.photoURL || user.photoURL || "",
        });
        setFeedback("");
      } catch (error) {
        console.error("Erro ao buscar perfil do aluno:", error);
        setProfile({
          ...initialProfile,
          name: user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
        });
        setFeedback("Nao foi possivel carregar todos os dados do perfil.");
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const initials = useMemo(
    () => getInitials(profile.name, profile.email),
    [profile.name, profile.email],
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!currentUser) {
      setFeedback("Entre com sua conta para salvar as alteracoes.");
      return;
    }

    const cleanName = profile.name.trim();

    if (!cleanName) {
      setFeedback("Informe seu nome para salvar o perfil.");
      return;
    }

    setIsSaving(true);
    setFeedback("");

    try {
      const cleanPhotoURL = profile.photoURL.trim();

      await updateProfile(currentUser, {
        displayName: cleanName,
        photoURL: cleanPhotoURL || null,
      });

      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          name: cleanName,
          email: profile.email || currentUser.email || "",
          phone: profile.phone.trim(),
          birthDate: profile.birthDate,
          city: profile.city.trim(),
          goal: profile.goal.trim(),
          photoURL: cleanPhotoURL,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setProfile((currentProfile) => ({
        ...currentProfile,
        name: cleanName,
        phone: currentProfile.phone.trim(),
        city: currentProfile.city.trim(),
        goal: currentProfile.goal.trim(),
        photoURL: cleanPhotoURL,
      }));
      setFeedback("Perfil atualizado com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar perfil do aluno:", error);
      setFeedback("Nao foi possivel salvar seu perfil agora.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.profile}>
      <header className={styles.header}>
        <span>Painel do aluno</span>
        <h2>Meu perfil</h2>
        <p>Atualize seus dados para manter seu acompanhamento mais completo.</p>
      </header>

      {isLoading ? (
        <section className={styles.emptyPanel}>
          <p>Carregando seu perfil...</p>
        </section>
      ) : !currentUser ? (
        <section className={styles.emptyPanel}>
          <p>{feedback}</p>
        </section>
      ) : (
        <form className={styles.profileGrid} onSubmit={handleSubmit}>
          <aside className={styles.summaryCard}>
            <div className={styles.avatar}>
              {profile.photoURL ? (
                <img src={profile.photoURL} alt="Foto do aluno" />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <strong>{profile.name || "Aluno"}</strong>
            <small>{profile.email}</small>
            {profile.goal ? <p>{profile.goal}</p> : null}
          </aside>

          <section className={styles.formCard} aria-label="Dados do perfil">
            <div className={styles.formHeader}>
              <div>
                <h3>Dados pessoais</h3>
                <p>Essas informacoes ficam salvas no seu perfil de aluno.</p>
              </div>

              <button type="submit" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar perfil"}
              </button>
            </div>

            <div className={styles.fieldsGrid}>
              <label className={styles.field}>
                <span>Nome</span>
                <input
                  name="name"
                  type="text"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  value={profile.email}
                  disabled
                />
              </label>

              <label className={styles.field}>
                <span>Telefone</span>
                <input
                  name="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </label>

              <label className={styles.field}>
                <span>Data de nascimento</span>
                <input
                  name="birthDate"
                  type="date"
                  value={profile.birthDate}
                  onChange={handleChange}
                />
              </label>

              <label className={styles.field}>
                <span>Cidade</span>
                <input
                  name="city"
                  type="text"
                  value={profile.city}
                  onChange={handleChange}
                  placeholder="Sua cidade"
                />
              </label>

              <label className={styles.field}>
                <span>URL da foto</span>
                <input
                  name="photoURL"
                  type="url"
                  value={profile.photoURL}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </label>

              <label className={`${styles.field} ${styles.fullField}`}>
                <span>Objetivo</span>
                <textarea
                  name="goal"
                  value={profile.goal}
                  onChange={handleChange}
                  placeholder="Ex.: ganhar massa, melhorar condicionamento, emagrecer..."
                  rows="4"
                />
              </label>
            </div>

            {feedback ? <p className={styles.feedback}>{feedback}</p> : null}
          </section>
        </form>
      )}
    </div>
  );
}
