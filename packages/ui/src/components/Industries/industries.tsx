'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate, type AnimationPlaybackControls, Variants } from 'framer-motion';
import styles from '../../styles/Industries/industries.module.css';

export interface IndustryItem {
  emoji: string;
  label: string;
}

export interface IndustriesProps {
  badge: string;
  title: string;
  rowOne: IndustryItem[];
  rowTwo: IndustryItem[];
}

const PIXELS_PER_SECOND = 40;
const MIN_COPIES = 2;

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

function MarqueeRow({
  items,
  direction,
}: {
  items: IndustryItem[];
  direction: 'ltr' | 'rtl';
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const x = useMotionValue(0);
  const [setWidth, setSetWidth] = useState(0);
  const [copies, setCopies] = useState(MIN_COPIES);

  useEffect(() => {
    let cancelled = false;

    const measure = () => {
      if (!setRef.current || !viewportRef.current || cancelled) return;

      const oneSetWidth = setRef.current.getBoundingClientRect().width;
      const viewportWidth = viewportRef.current.getBoundingClientRect().width;
      if (oneSetWidth === 0) return;

      const needed = Math.max(MIN_COPIES, Math.ceil(viewportWidth / oneSetWidth) + 1);

      setSetWidth(oneSetWidth);
      setCopies(needed);
    };

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(measure);
    } else {
      measure();
    }

    const resizeObserver = new ResizeObserver(() => measure());
    if (viewportRef.current) {
      resizeObserver.observe(viewportRef.current);
    }
    if (setRef.current) {
      resizeObserver.observe(setRef.current);
    }

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
    };
  }, [items]);

  useEffect(() => {
    if (setWidth === 0) return;

    const duration = setWidth / PIXELS_PER_SECOND;
    const from = direction === 'rtl' ? 0 : -setWidth;
    const to = direction === 'rtl' ? -setWidth : 0;

    animationRef.current?.stop();
    x.set(from);
    animationRef.current = animate(x, to, {
      duration,
      ease: 'linear',
      repeat: Infinity,
    });

    return () => {
      animationRef.current?.stop();
    };
  }, [setWidth, direction, x]);

  const handleMouseEnter = () => {
    animationRef.current?.pause();
  };

  const handleMouseLeave = () => {
    animationRef.current?.play();
  };

  return (
    <motion.div
      className={styles.marqueeViewport}
      ref={viewportRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
    >
      <motion.div
        className={styles.marqueeTrack}
        style={{ x, opacity: setWidth > 0 ? 1 : 0 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: copies }).map((_, copyIndex) => (
          <div
            className={styles.marqueeSet}
            ref={copyIndex === 0 ? setRef : undefined}
            key={copyIndex}
            aria-hidden={copyIndex > 0}
          >
            {items.map((item, index) => (
              <Pill key={`${copyIndex}-${item.label}-${index}`} item={item} />
            ))}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function Pill({ item }: { item: IndustryItem }) {
  return (
    <span className={styles.pill}>
      <span className={styles.emoji} aria-hidden="true">
        {item.emoji}
      </span>
      <span className={styles.label}>{item.label}</span>
    </span>
  );
}

export function IndustriesUI({ badge, title, rowOne, rowTwo }: IndustriesProps) {
  return (
    <section className={styles.section} id="industries" style={{ overflow: 'hidden' }}>
      <div className={styles.header}>
        <motion.span
          className={styles.badge}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
        >
          {badge}
        </motion.span>

        <motion.h2
          className={styles.title}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.h2>
      </div>

      <div className={styles.rows}>
        <MarqueeRow items={rowOne} direction="rtl" />
        <MarqueeRow items={rowTwo} direction="ltr" />
      </div>
    </section>
  );
}