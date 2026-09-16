import Image from 'next/image';
import styles from '../../styles/ProblemSolution/problemSolution.module.css';

export interface ProblemSolutionProps {
  badge: string;
  titleLineOne: string;
  titleLineTwo: string;
  description: string;
  image: string;
  imageAlt: string;
}

export function ProblemSolutionUI({
  badge,
  titleLineOne,
  titleLineTwo,
  description,
  image,
  imageAlt,
}: ProblemSolutionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.badge}>{badge}</span>
        <h2 className={styles.title}>
          {titleLineOne}
          <br />
          {titleLineTwo}
        </h2>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.imageWrap}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 1450px) 100vw, 1424px"
          className={styles.image}
          priority
        />
      </div>
    </section>
  );
}