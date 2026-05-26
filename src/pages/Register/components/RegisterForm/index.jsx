//useState é para armazenar os valores dos campos do formulário
import { useState } from "react";
//funções do firebase para criar usuário, atualizar perfil, criar perfil no firestore e login com google
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
//funções do banco Firestore:
//doc é para buscar um documento, getDoc é para pegar os dados de um documento, 
//setDoc é para criar ou atualizar um documento e serverTimestamp salva data/hora do servidor
import { Link, useNavigate } from "react-router-dom";
import { auth, db, provider } from "../../../../firebase";
import styles from "./styles.module.css";

export function RegisterForm() {
  const navigate = useNavigate();
  //Quando o campo mudar, pegue o valor digitado e salve dentro de name.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //Função para mapear os erros do Firebase para mensagens mais amigáveis
  function getRegisterErrorMessage(error) {
    const messages = {
      "auth/email-already-in-use": "Esse email já está cadastrado. Tente fazer login.",
      "auth/invalid-email": "Digite um email válido.",
      "auth/operation-not-allowed": "Ative o login por Email/Senha no Firebase Authentication.",
      "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
      "permission-denied": "O Firestore bloqueou a criação do perfil. Verifique as regras do banco.",
    };

    return messages[error.code] || "Não foi possível criar a conta.";
  }

  //Função para criar ou atualizar o perfil do usuário no Firestore
  async function createUserProfile(user, fallbackName = "") {
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      return userSnapshot.data().role || "aluno";
    }

    await setDoc(userRef, {
      email: user.email,
      name: user.displayName || fallbackName,
      role: "aluno",
      createdAt: serverTimestamp(),
    });

    return "aluno";
  }

  function redirectByRole(role) {
    if (role === "admin") {
      navigate("/portal-professor");
      return;
    }

    navigate("/portal-aluno");
  }

  async function handleRegister(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(result.user, {
        displayName: name,
      });

      const role = await createUserProfile(result.user, name);

      redirectByRole(role);
    } catch (error) {
      console.error(error);
      alert(getRegisterErrorMessage(error));
    }
  }

  async function handleGoogleLogin() {
    try {
      const result = await signInWithPopup(auth, provider);
      const role = await createUserProfile(result.user);

      redirectByRole(role);
    } catch (error) {
      console.error(error);
      alert("Erro ao fazer cadastro com Google");
    }
  }

  return (
    <div className={styles.formBox}>
      <h1>Cadastre-se aqui</h1>
      <form className={styles.form} onSubmit={handleRegister}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
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
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirmar senha</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.loginButton}>
          Cadastrar
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className={styles.googleButton}
        >
          Cadastrar-se com Google
        </button>
      </form>
      <p className={styles.registerText}>
        Já possui uma conta? <Link to="/login">Faça login!</Link>
      </p>
    </div>
  );
}
