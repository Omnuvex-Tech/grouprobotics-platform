'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import styles from '../../styles/WhatWeDo/whatWeDo.module.css';

export interface WhatWeDoItem {
  number: string;
  label: string;
  image: string;
  title: string;
  description: string;
}

export interface WhatWeDoProps {
  badge: string;
  title: string;
  items: WhatWeDoItem[];
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
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
      staggerChildren: 0.03,
    },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export function WhatWeDoUI({ badge, title, items }: WhatWeDoProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) {
    return null;
  }
  const firstItem = items[0] as WhatWeDoItem;
  const active = items[activeIndex] ?? firstItem;

  return (
    <section className={styles.section} style={{ overflow: 'hidden' }}>
      <div className={styles.header}>
        <motion.span
          className={styles.badge}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
        >
          {badge}
        </motion.span>
        <motion.h2
          className={styles.title}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
          transition={{ delay: 0.08 }}
        >
          {title}
        </motion.h2>
      </div>

      <div className={styles.grid}>
        <ul className={styles.list}>
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <motion.li
                key={item.number}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeInUp}
                transition={{ delay: 0.12 + index * 0.06 }}
              >
                <button
                  type="button"
                  className={styles.item}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                >
                  <span
                    className={`${styles.number} ${
                      isActive ? styles.numberActive : ''
                    }`}
                  >
                    {item.number}
                  </span>
                  <span className={styles.label}>{item.label}</span>
                </button>
              </motion.li>
            );
          })}
        </ul>

        <motion.div
          className={styles.showcase}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active.image}
              className={styles.showcaseInner}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <Image
                src={active.image}
                alt={active.title}
                fill
                sizes="(max-width: 900px) 100vw, 664px"
                className={styles.showcaseImage}
                priority
              />

              <div className={styles.showcaseBlur} aria-hidden="true" />

              <div className={styles.caption}>
                <p className={styles.captionTitle}>{active.title}</p>
                <motion.p
                  key={active.description}
                  className={styles.captionDescription}
                  initial="hidden"
                  animate="visible"
                  variants={wordContainerVariants}
                >
               {(active.description ?? '').split(' ').map((word, i) => (
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
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}