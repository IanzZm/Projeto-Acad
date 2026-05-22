import { PageHeader } from "./components/PageHeader";
import { PerformanceSection } from "./components/PerformanceSection";
import { PortalHeader } from "./components/PortalHeader";
import { TeacherSidebar } from "./components/TeacherSidebar";
import styles from "./styles.module.css";



export function TeacherPortal() {
  return (
    <main className={styles.portal}>
      <PortalHeader/>

      <div className={styles.shell}>
        <TeacherSidebar/>

        <section className={styles.content}>
          <PageHeader/>

          <div className={styles.dashboard}>
            <PerformanceSection/>
            
          </div>
        </section>
      </div>
    </main>
  );
}
