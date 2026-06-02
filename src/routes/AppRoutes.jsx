import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { StudentPortal } from "../pages/StudentPortal";
import { TeacherPortal } from "../pages/TeacherPortal";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inscricao" element={<Register />} />
      <Route path="/portal-aluno" element={<StudentPortal />} />
      <Route
        path="/portal-aluno/agendamentos"
        element={<StudentPortal view="appointments" />}
      />
      <Route
        path="/portal-aluno/avaliacao-fisica"
        element={<StudentPortal view="evaluation" />}
      />
      <Route path="/portal-professor" element={<TeacherPortal />} />
      <Route
        path="/portal-professor/agendamentos"
        element={<TeacherPortal view="appointments" />}
      />
      <Route
        path="/portal-professor/alunos"
        element={<TeacherPortal view="students" />}
      />
      <Route
        path="/portal-professor/avaliacoes-fisicas"
        element={<TeacherPortal view="evaluations" />}
      />
    </Routes>
  );
}
