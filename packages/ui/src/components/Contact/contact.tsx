'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import styles from '../../styles/Contact/contact.module.css';

export interface ContactOption {
  value: string;
  label: string;
}

export interface ContactProps {
  badge: string;
  title: string;
  description: string;
  labels: {
    name: string;
    namePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    company: string;
    companyPlaceholder: string;
    email: string;
    emailPlaceholder: string;
    interest: string;
    interestPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    send: string;
  };
  interestOptions: ContactOption[];
  onSubmit?: (data: {
    name: string;
    phone: string;
    company: string;
    email: string;
    interest: string;
    message: string;
  }) => void;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
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

function InterestDropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  options: ContactOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((option) => option.value === value);

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.dropdown} ref={rootRef}>
        <button
          type="button"
          className={`${styles.dropdownTrigger} ${isOpen ? styles.dropdownTriggerOpen : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={selected ? styles.dropdownValue : styles.dropdownPlaceholder}>
            {selected ? selected.label : placeholder}
          </span>
          <svg
            className={styles.dropdownChevron}
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
          >
            <path
              d="M1 1L7 7L13 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <ul className={styles.dropdownPanel} role="listbox">
            {options.map((option) => (
              <li key={option.value} role="option" aria-selected={option.value === value}>
                <button
                  type="button"
                  className={`${styles.dropdownOption} ${
                    option.value === value ? styles.dropdownOptionActive : ''
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function ContactUI({ badge, title, description, labels, interestOptions, onSubmit }: ContactProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit?.({ name, phone, company, email, interest, message });
  };

  return (
    <section className={styles.section} id="contact" style={{ overflow: 'hidden' }}>
      <div className={styles.header}>
        <motion.span
          className={styles.badge}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={itemVariants}
        >
          {badge}
        </motion.span>

        <motion.h2
          className={styles.title}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={itemVariants}
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
          {description.split(' ').map((word, i) => (
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

      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.column}>
          <motion.label
            className={styles.field}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={itemVariants}
            transition={{ delay: 0.1 }}
          >
            <span className={styles.label}>{labels.name}</span>
            <input
              type="text"
              className={styles.input}
              placeholder={labels.namePlaceholder}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </motion.label>

          <motion.label
            className={styles.field}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={itemVariants}
            transition={{ delay: 0.2 }}
          >
            <span className={styles.label}>{labels.phone}</span>
            <input
              type="tel"
              className={styles.input}
              placeholder={labels.phonePlaceholder}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </motion.label>

          <motion.label
            className={styles.field}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={itemVariants}
            transition={{ delay: 0.3 }}
          >
            <span className={styles.label}>{labels.company}</span>
            <input
              type="text"
              className={styles.input}
              placeholder={labels.companyPlaceholder}
              value={company}
              onChange={(event) => setCompany(event.target.value)}
            />
          </motion.label>

          <motion.label
            className={styles.field}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={itemVariants}
            transition={{ delay: 0.4 }}
          >
            <span className={styles.label}>{labels.email}</span>
            <input
              type="email"
              className={styles.input}
              placeholder={labels.emailPlaceholder}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </motion.label>
        </div>

        <div className={styles.column}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={itemVariants}
            transition={{ delay: 0.2 }}
          >
            <InterestDropdown
              label={labels.interest}
              placeholder={labels.interestPlaceholder}
              options={interestOptions}
              value={interest}
              onChange={setInterest}
            />
          </motion.div>

          <motion.label
            className={`${styles.field} ${styles.fieldGrow}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={itemVariants}
            transition={{ delay: 0.3 }}
          >
            <span className={styles.label}>{labels.message}</span>
            <textarea
              className={styles.textarea}
              placeholder={labels.messagePlaceholder}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </motion.label>

          <motion.div
            className={styles.actions}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={itemVariants}
            transition={{ delay: 0.4 }}
          >
            <button type="submit" className={styles.submit}>
              {labels.send}
              <Image src="/images/send.svg" alt="" width={20} height={20} aria-hidden="true" />
            </button>
          </motion.div>
        </div>
      </form>
    </section>
  );
}