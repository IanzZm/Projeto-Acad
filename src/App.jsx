import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { StudentPortal } from "./pages/StudentPortal";
import { TeacherPortal } from "./pages/TeacherPortal";

function App() {
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
      <Route path="/portal-professor" element={<TeacherPortal />} />
    </Routes>
  );
}

export default App;
