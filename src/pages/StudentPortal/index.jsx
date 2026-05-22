import { AppointmentsSection } from "./components/AppointmentsSection";
import { PageHeader } from "./components/PageHeader";
import { PerformanceSection } from "./components/PerformanceSection";
import { PortalHeader } from "./components/PortalHeader";
import { QuickActionsSection } from "./components/QuickActionsSections";
import { StudentSidebar } from "./components/StudentSidebar";
import styles from "./styles.module.css";

export function StudentPortal({ view = "dashboard" }) {
  const isAppointmentsView = view === "appointments";

  return (
    <main className={styles.portal}>
      <PortalHeader />

      <div className={styles.shell}>
        <StudentSidebar />

        <section className={styles.content}>
          {isAppointmentsView ? (
            <AppointmentsSection />
          ) : (
            <>
              <PageHeader />

              <div className={styles.dashboard}>
                <PerformanceSection />
                <QuickActionsSection />
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
