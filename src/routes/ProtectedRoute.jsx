import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const roleHome = {
  admin: "/portal-professor",
  adm: "/portal-professor",
  professor: "/portal-professor",
  aluno: "/portal-aluno",
};

function normalizeRole(role) {
  return String(role || "").toLowerCase();
}

function isAllowedRole(role, allowedRoles) {
  return allowedRoles.map(normalizeRole).includes(normalizeRole(role));
}

export function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();
  const [authState, setAuthState] = useState({
    isLoading: true,
    role: null,
    user: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthState({
          isLoading: false,
          role: null,
          user: null,
        });
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);
        const role = normalizeRole(userSnapshot.data()?.role);

        setAuthState({
          isLoading: false,
          role,
          user,
        });
      } catch (error) {
        console.error("Erro ao verificar permissao da rota:", error);
        setAuthState({
          isLoading: false,
          role: null,
          user,
        });
      }
    });

    return unsubscribe;
  }, []);

  if (authState.isLoading) {
    return null;
  }

  if (!authState.user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!authState.role || !isAllowedRole(authState.role, allowedRoles)) {
    return <Navigate to={roleHome[authState.role] || "/login"} replace />;
  }

  return children;
}
