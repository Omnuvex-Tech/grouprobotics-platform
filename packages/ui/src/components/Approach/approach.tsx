import styles from '../../styles/Approach/approach.module.css';

export interface ApproachProps {
  badge: string;
  title: string;
  paragraph: string;
  highlight: string;
  quote: string;
}

export function ApproachUI({ badge, title, paragraph, highlight, quote }: ApproachProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.badge}>{badge}</span>
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.grid}>
        <div className={styles.textCol}>
          <p className={styles.paragraph}>{paragraph}</p>
          <p className={styles.highlight}>{highlight}</p>
        </div>

        <div className={styles.card}>
          <p className={styles.quote}>{quote}</p>
          <div className={styles.cardFooter}>
            <span className={styles.cardLine} />
            <span className={styles.cardDot} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}