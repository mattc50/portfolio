import { getPublishedProjects } from "@/lib/projects";
import styles from "./home.module.css";
import { ProjectCard } from "@/components/ProjectCard";
import { Footer } from "@/components/Footer";
import { Lct } from "@/components/icons/Lct";
import { Esb } from "@/components/icons/Esb";
import Globe from "@/components/Globe";

export default function Home() {
  const projects = getPublishedProjects();

  return (
    <>
      <section className={styles.section}>
        <div className={styles["section-content"]}>
          <div className={`${styles.hero} anim-fade-up`}>
            <h1 className={styles.heading1}>
              Matthew Canabarro
            </h1>
            <p className={styles.subheading}>
              Product Designer & Design Engineer based in{" "}
              <span>
                <a
                  href="https://www.google.com/maps/place/Lackawanna+Railroad+Terminal/@40.7352277,-74.0280105,18.62z/data=!3m1!5s0x87cadeeb7d32423b:0x97a70298e4cc2127!4m10!1m2!2m1!1slackawanna+clock+tower!3m6!1s0x89c259e24c33ae37:0xd87626ce3cd793a5!8m2!3d40.7349956!4d-74.0273823!15sChZsYWNrYXdhbm5hIGNsb2NrIHRvd2VyWhgiFmxhY2thd2FubmEgY2xvY2sgdG93ZXKSAQ1oaXN0b3JpY19zaXRlmgEjQ2haRFNVaE5NRzluUzBWSlEwRm5TVVJsZW5aSWJWZG5FQUXgAQD6AQUI3QEQDQ!16s%2Fg%2F11cs4kz_n8?entry=ttu&g_ep=EgoyMDI2MDMzMC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Lct />
                </a>
                Hoboken, NJ
              </span>{" "}
              (let's just say{" "}
              <span>
                <a
                  href="https://www.google.com/maps/place/Empire+State+Building/@40.7484404,-73.9905353,16z/data=!3m2!4b1!5s0x8b398fecd1aea119:0x76fa1e3ac5a94c70!4m6!3m5!1s0x89c259a9b3117469:0xd134e199a405a163!8m2!3d40.7484405!4d-73.9856644!16zL20vMDJuZF8?entry=ttu&g_ep=EgoyMDI2MDMzMC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Esb />
                </a>
                NYC
              </span>).
            </p>
          </div>

          <Globe />

          <div className={styles.grid}>
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
