'use client';

import { motion, Variants } from 'framer-motion';
import styles from '../../styles/Approach/approach.module.css';

export interface ApproachProps {
  badge: string;
  title: string;
  paragraph: string;
  highlight: string;
  quote: string;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export function ApproachUI({ badge, title, paragraph, highlight, quote }: ApproachProps) {
  return (
    <section className={styles.section} id='aboutus' style={{ overflow: 'hidden' }}>
      <div className={styles.header}>
        <motion.span 
          className={styles.badge}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={itemVariants}
        >
          {badge}
        </motion.span>
        
        <motion.h2 
          className={styles.title}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={itemVariants}
          transition={{ delay: 0.08 }}
        >
          {title}
        </motion.h2>
      </div>

      <div className={styles.grid}>
        <div className={styles.textCol}>
          <motion.p 
            className={styles.paragraph}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={itemVariants}
            transition={{ delay: 0.16 }}
          >
            {paragraph}
          </motion.p>
          
          <motion.p 
            className={styles.highlight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={itemVariants}
            transition={{ delay: 0.24 }}
          >
            {highlight}
          </motion.p>
        </div>

        <motion.div 
          className={styles.card}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={itemVariants}
          transition={{ delay: 0.32 }}
        >
          <p className={styles.quote}>{quote}</p>
          <div className={styles.cardFooter}>
            <span className={styles.cardLine} />
            <span className={styles.cardDot} aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}