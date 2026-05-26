import { AppointmentsSection } from "./components/AppointmentsSection";
import { PageHeader } from "./components/PageHeader";
import { PerformanceSection } from "./components/PerformanceSection";
import { PortalHeader } from "./components/PortalHeader";
import { TeacherSidebar } from "./components/TeacherSidebar";
import { EmailSection } from "./components/EmailSection";
import styles from "./styles.module.css";



export function TeacherPortal({ view = "dashboard" }) {
  const isAppointmentsView = view === "appointments";

  return (
    <main className={styles.portal}>
      <PortalHeader/>

      <div className={styles.shell}>
        <TeacherSidebar/>

        <section className={styles.content}>
          {isAppointmentsView ? (
            <AppointmentsSection />
          ) : (
            <>
              <PageHeader/>

              <div className={styles.dashboard}>
                <PerformanceSection/>
              </div>
              <div className={styles.email}>
                <EmailSection/>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
