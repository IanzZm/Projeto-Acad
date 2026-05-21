import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../../firebase";
import styles from "./styles.module.css";


const fakeUsers = [
  { email: "professor@email.com", password: "123456", role: "admin" },
  { email: "aluno@email.com", password: "123456", role: "aluno" },
];

export function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(event) {
    event.preventDefault();

    const user = fakeUsers.find(
      (fakeUser) => fakeUser.email === email && fakeUser.password === password,
    );

    if (!user) {
      alert("Email ou senha inválidos");
      return;
    }

    if (user.role === "admin") {
      navigate("/portal-professor");
    } else {
      navigate("/portal-aluno");
    }
  }

  async function handleGoogleLogin() {

    try {

      const result = await signInWithPopup(auth, provider);

      console.log(result.user);

      navigate("/portal-aluno");

    } catch (error) {

      console.log(error);

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
