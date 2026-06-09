import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, provider } from "../../../../config/firebase";
import styles from "./styles.module.css";

export function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function getUserRole(user) {
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName || "",
        role: "aluno",
        createdAt: serverTimestamp(),
      });

      return "aluno";
    }

    return userSnapshot.data().role || "aluno";
  }

  function redirectByRole(role) {
    if (role === "admin") {
      navigate("/portal-professor");
      return;
    }

    navigate("/portal-aluno");
  }

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const role = await getUserRole(result.user);

      redirectByRole(role);
    } catch (error) {
      console.error(error);
      alert("Email ou senha inválidos");
    }
  }

  async function handleGoogleLogin() {
    try {
      const result = await signInWithPopup(auth, provider);
      const role = await getUserRole(result.user);

      redirectByRole(role);
    } catch (error) {
      console.error(error);
      alert("Erro ao fazer login com Google");
    }
  }

  return (
    <div className={styles.formBox}>
      <h1>Bem-vindo de volta</h1>
      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Entrar com Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit" className={styles.loginButton}>
          Entrar
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className={styles.googleButton}
        >
          Entrar com Google
        </button>
      </form>
      <p className={styles.registerText}>
        Não tem conta? <Link to="/inscricao">Inscreva-se grátis!</Link>
      </p>
    </div>
  );
}
