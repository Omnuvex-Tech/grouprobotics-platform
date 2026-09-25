'use client';

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import styles from '../../styles/ProblemSolution/problemSolution.module.css';

export interface ProblemSolutionProps {
  badge: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

const wordContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.1,
    },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export function ProblemSolutionUI({
  badge,
  title,
  description,
  image,
  imageAlt,
}: ProblemSolutionProps) {
  return (
    <section className={styles.section} id="technologies" style={{ overflow: 'hidden' }}>
      <div className={styles.header}>
        <motion.span
          className={styles.badge}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          {badge}
        </motion.span>

       <motion.h2
          className={styles.title}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          transition={{ delay: 0.08 }}
        >
          {title}
        </motion.h2>

        <motion.p
          className={styles.description}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={wordContainerVariants}
        >
       {(description ?? '').split(' ').map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              style={{ display: 'inline-block', marginRight: '0.25em' }}
            >
              {word}
            </motion.span>
          ))}
        </motion.p>
      </div>

      <motion.div
        className={styles.imageWrap}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        transition={{ delay: 0.15 }}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 1450px) 100vw, 1424px"
          className={styles.image}
          priority
        />
      </motion.div>
    </section>
  );
}