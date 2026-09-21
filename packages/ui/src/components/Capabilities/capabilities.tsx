'use client';

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import styles from '../../styles/Capabilities/capabilities.module.css';

export interface CapabilityItem {
  image: string;
  title: string;
  description: string;
}

export interface CapabilitiesProps {
  badge: string;
  title: string;
  items: CapabilityItem[];
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 35 },
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
      delayChildren: 0.15,
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

function CapabilityCard({ item, size }: { item: CapabilityItem; size: 'small' | 'large' }) {
  return (
    <motion.div
      className={`${styles.card} ${size === 'small' ? styles.cardSmall : styles.cardLarge}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={cardVariants}
    >
      <div className={styles.cardImageWrap}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 960px) 100vw, 893px"
          className={styles.cardImage}
        />
        <div className={styles.cardCaption}>
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
        </div>
      </div>
    </motion.div>
  );
}

export function CapabilitiesUI({ badge, title, items }: CapabilitiesProps) {
  const [first, second, third, fourth] = items;

  return (
    <section className={styles.section} id="capabilities" style={{ overflow: 'hidden' }}>
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
        >
          {title}
        </motion.h2>
      </div>

      <div className={styles.wrapper}>
        {first && second && (
          <div className={`${styles.row} ${styles.rowFirst}`}>
            <CapabilityCard item={first} size="small" />
            <CapabilityCard item={second} size="large" />
          </div>
        )}

        {third && fourth && (
          <div className={`${styles.row} ${styles.rowSecond}`}>
            <CapabilityCard item={third} size="large" />
            <CapabilityCard item={fourth} size="small" />
          </div>
        )}
      </div>
    </section>
  );
}