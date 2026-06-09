import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { StudentPortal } from "../pages/StudentPortal";
import { TeacherPortal } from "../pages/TeacherPortal";
import { ProtectedRoute } from "./ProtectedRoute";

function studentRoute(element) {
  return <ProtectedRoute allowedRoles={["aluno"]}>{element}</ProtectedRoute>;
}

function teacherRoute(element) {
  return <ProtectedRoute allowedRoles={["admin"]}>{element}</ProtectedRoute>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inscricao" element={<Register />} />
      <Route path="/portal-aluno" element={studentRoute(<StudentPortal />)} />
      <Route
        path="/portal-aluno/agendamentos"
        element={studentRoute(<StudentPortal view="appointments" />)}
      />
      <Route
        path="/portal-aluno/avaliacao-fisica"
        element={studentRoute(<StudentPortal view="evaluation" />)}
      />
      <Route
        path="/portal-aluno/perfil"
        element={studentRoute(<StudentPortal view="profile" />)}
      />
      <Route
        path="/portal-professor"
        element={teacherRoute(<TeacherPortal />)}
      />
      <Route
        path="/portal-professor/agendamentos"
        element={teacherRoute(<TeacherPortal view="appointments" />)}
      />
      <Route
        path="/portal-professor/alunos"
        element={teacherRoute(<TeacherPortal view="students" />)}
      />
      <Route
        path="/portal-professor/avaliacoes-fisicas"
        element={teacherRoute(<TeacherPortal view="evaluations" />)}
      />
    </Routes>
  );
}
