import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { StudentPortal } from "../pages/StudentPortal";
import { TeacherPortal } from "../pages/TeacherPortal";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inscricao" element={<Register />} />
      <Route
        path="/portal-aluno"
        element={
          <ProtectedRoute allowedRoles={["aluno"]}>
            <StudentPortal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal-aluno/agendamentos"
        element={
          <ProtectedRoute allowedRoles={["aluno"]}>
            <StudentPortal view="appointments" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal-aluno/avaliacao-fisica"
        element={
          <ProtectedRoute allowedRoles={["aluno"]}>
            <StudentPortal view="evaluation" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal-professor"
        element={
          <ProtectedRoute allowedRoles={["admin", "adm", "professor"]}>
            <TeacherPortal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal-aluno/perfil"
        element={<StudentPortal view="profile" />}
      />
      <Route path="/portal-professor" element={<TeacherPortal />} />
      <Route
        path="/portal-professor/agendamentos"
        element={
          <ProtectedRoute allowedRoles={["admin", "adm", "professor"]}>
            <TeacherPortal view="appointments" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal-professor/alunos"
        element={
          <ProtectedRoute allowedRoles={["admin", "adm", "professor"]}>
            <TeacherPortal view="students" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal-professor/avaliacoes-fisicas"
        element={
          <ProtectedRoute allowedRoles={["admin", "adm", "professor"]}>
            <TeacherPortal view="evaluations" />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
