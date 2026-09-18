'use client';

import { useRef, type ReactNode } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import styles from '../../styles/Connect/connect.module.css';

export interface ConnectProps {
  title: string;
  description: string;
  cta: ReactNode;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

const handVariants = {
  hiddenLeft: { opacity: 0, x: -160 },
  hiddenRight: { opacity: 0, x: 160 },
  visible: { opacity: 1, x: 0 },
};

const blobKeyframes = {
  x: [0, 60, -48, 38, -26, 0],
  y: [0, -42, 32, -28, 20, 0],
  scale: [1, 1.2, 0.9, 1.14, 0.94, 1],
  rotate: [0, 12, -10, 10, -7, 0],
  borderRadius: [
    '42% 58% 65% 35% / 45% 45% 55% 55%',
    '58% 42% 35% 65% / 55% 65% 35% 45%',
    '50% 50% 38% 62% / 62% 38% 62% 38%',
    '65% 35% 55% 45% / 40% 55% 45% 60%',
    '35% 65% 45% 55% / 58% 42% 58% 42%',
    '42% 58% 65% 35% / 45% 45% 55% 55%',
  ],
};

export function ConnectUI({ title, description, cta }: ConnectProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section ref={sectionRef} className={styles.section}>
      <motion.div
        className={styles.blob}
        aria-hidden="true"
        animate={blobKeyframes}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={styles.handLeft}
        variants={handVariants}
        initial="hiddenLeft"
        animate={isInView ? 'visible' : 'hiddenLeft'}
        transition={{ duration: 2.4, ease: easeOut }}
      >
        <Image
          src="/images/handleft.svg"
          alt=""
          width={380}
          height={380}
          className={styles.handImage}
          aria-hidden="true"
        />
      </motion.div>

      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        {cta}
      </div>

      <motion.div
        className={styles.handRight}
        variants={handVariants}
        initial="hiddenRight"
        animate={isInView ? 'visible' : 'hiddenRight'}
        transition={{ duration: 2.4, ease: easeOut, delay: 0.15 }}
      >
        <Image
          src="/images/handright.svg"
          alt=""
          width={380}
          height={380}
          className={styles.handImage}
          aria-hidden="true"
        />
      </motion.div>
    </section>
  );
}