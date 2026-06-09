import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Navigate, useLocation } from "react-router-dom";
import { auth, db } from "../config/firebase";

export function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();
  const [authState, setAuthState] = useState({
    isLoading: true,
    user: null,
    role: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthState({ isLoading: false, user: null, role: "" });
        return;
      }

      try {
        const userSnapshot = await getDoc(doc(db, "users", user.uid));
        const role = userSnapshot.exists()
          ? userSnapshot.data().role || "aluno"
          : "aluno";

        setAuthState({ isLoading: false, user, role });
      } catch (error) {
        console.error(error);
        setAuthState({ isLoading: false, user, role: "" });
      }
    });

    return unsubscribe;
  }, []);

  if (authState.isLoading) {
    return <main aria-busy="true">Carregando...</main>;
  }

  if (!authState.user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(authState.role)) {
    const fallbackPath =
      authState.role === "admin" ? "/portal-professor" : "/portal-aluno";

    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}
