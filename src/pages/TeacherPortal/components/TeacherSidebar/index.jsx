import { signOut } from "firebase/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../../../../config/firebase";
import styles from "./styles.module.css";

const navItems = [
  {
    label: "Inicio",
    to: "/portal-professor",
    end: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),
  },
  {
    label: "Agendamentos",
    to: "/portal-professor/agendamentos",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <path d="M4 8h16" />
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="m8 14 2.2 2.2L16 11" />
      </svg>
    ),
  },
  {
    label: "Alunos",
    to: "/portal-professor/alunos",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <path d="M16 3.128a4 4 0 0 1 0 7.744" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Avaliacoes fisicas",
    to: "/portal-professor/avaliacoes-fisicas",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20V4" />
        <path d="M9 20V9" />
        <path d="M14 20V6" />
        <path d="M19 20v-8" />
        <path d="M3 20h18" />
      </svg>
    ),
  },
];

export function TeacherSidebar() {
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(auth);
    navigate("/login");
  }

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav} aria-label="Menu do professor">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? styles.activeNavItem : styles.navItem
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}

        <button type="button" onClick={handleLogout} className={styles.navItem}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-3" />
            <path d="M9 12h12" />
            <path d="m17 8 4 4-4 4" />
          </svg>
          <span>Sair</span>
        </button>
      </nav>
    </aside>
  );
}
