import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Agents of Faith</h1>
        <p className={styles.subtitle}>Theological AI Assistant</p>
      </header>
      
      <main className={styles.main}>
        <section className={styles.hero}>
          <h2 className={styles.heroTitle}>
            Deep Theological Insights
          </h2>
          <p className={styles.heroDescription}>
            Ask questions about Scripture, theology, and Christian doctrine. 
            Get comprehensive answers grounded in biblical truth and historical context.
          </p>
          <Link href="/ask" className={styles.ctaButton}>
            Start Asking Questions
          </Link>
        </section>
        
        <section className={styles.features}>
          <h3 className={styles.featuresTitle}>What You Can Ask</h3>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <h4>Biblical Interpretation</h4>
              <p>Understand Scripture in its historical and theological context</p>
            </div>
            <div className={styles.feature}>
              <h4>Doctrinal Questions</h4>
              <p>Explore Christian beliefs across different traditions</p>
            </div>
            <div className={styles.feature}>
              <h4>Word Studies</h4>
              <p>Dive deep into Hebrew and Greek meanings</p>
            </div>
            <div className={styles.feature}>
              <h4>Historical Context</h4>
              <p>Learn about the cultural and historical background</p>
            </div>
          </div>
        </section>
        
        <section className={styles.about}>
          <h3>About This Assistant</h3>
          <p>
            This AI assistant is trained on extensive theological resources and Scripture, 
            providing accurate, nuanced responses that respect the diversity of Christian 
            traditions while maintaining biblical fidelity.
          </p>
          <p>
            All responses follow a structured format with biblical citations, historical context, 
            theological implications, practical application, and suggestions for further study.
          </p>
        </section>
      </main>
      
      <footer className={styles.footer}>
        <p>&copy; 2024 Agents of Faith. Theological AI Assistant.</p>
      </footer>
    </div>
  );
}
