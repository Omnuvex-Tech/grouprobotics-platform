'use client';

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import styles from '../../styles/Reseller/reseller.module.css';

export interface ResellerItem {
  icon: string;
  title: string;
  description: string;
}

export interface ResellerProps {
  badge: string;
  titleLineOne: string;
  titleLineTwo: string;
  items: ResellerItem[];
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
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

export function ResellerUI({ badge, titleLineOne, titleLineTwo, items }: ResellerProps) {
  return (
    <section className={styles.section} style={{ overflow: 'hidden' }}>
      <div className={styles.header}>
        <motion.span
          className={styles.badge}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={cardVariants}
        >
          {badge}
        </motion.span>

        <motion.h2
          className={styles.title}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={cardVariants}
          transition={{ delay: 0.08 }}
        >
          {titleLineOne}
          <br />
          {titleLineTwo}
        </motion.h2>
      </div>

      <div className={styles.grid}>
        {items.map((item, index) => (
          <motion.div
            className={styles.card}
            key={item.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
            transition={{ delay: (index % 3) * 0.15 }}
          >
            <div className={styles.iconWrap}>
              <Image src={item.icon} alt="" width={24} height={24} aria-hidden="true" />
            </div>
            <p className={styles.cardTitle}>{item.title}</p>
            <motion.p
              className={styles.cardDescription}
              variants={wordContainerVariants}
            >
              {item.description.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  style={{ display: 'inline-block', marginRight: '0.25em' }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}