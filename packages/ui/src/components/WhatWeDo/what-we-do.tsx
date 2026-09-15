'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
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

export function WhatWeDoUI({ badge, title, items }: WhatWeDoProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) {
    return null;
  }
  const firstItem = items[0] as WhatWeDoItem;
  const active = items[activeIndex] ?? firstItem;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.badge}>{badge}</span>
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.grid}>
        <ul className={styles.list}>
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={item.number}>
                <button
                  type="button"
                  className={styles.item}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                >
                  <span className={`${styles.number} ${isActive ? styles.numberActive : ''}`}>
                    {item.number}
                  </span>
                  <span className={styles.label}>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className={styles.showcase}>
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
                <p className={styles.captionDescription}>{active.description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}