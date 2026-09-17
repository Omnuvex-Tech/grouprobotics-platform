'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
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
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.badge}>{badge}</span>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>

      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.column}>
          <label className={styles.field}>
            <span className={styles.label}>{labels.name}</span>
            <input
              type="text"
              className={styles.input}
              placeholder={labels.namePlaceholder}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>{labels.phone}</span>
            <input
              type="tel"
              className={styles.input}
              placeholder={labels.phonePlaceholder}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>{labels.company}</span>
            <input
              type="text"
              className={styles.input}
              placeholder={labels.companyPlaceholder}
              value={company}
              onChange={(event) => setCompany(event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>{labels.email}</span>
            <input
              type="email"
              className={styles.input}
              placeholder={labels.emailPlaceholder}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        </div>

        <div className={styles.column}>
          <InterestDropdown
            label={labels.interest}
            placeholder={labels.interestPlaceholder}
            options={interestOptions}
            value={interest}
            onChange={setInterest}
          />

          <label className={`${styles.field} ${styles.fieldGrow}`}>
            <span className={styles.label}>{labels.message}</span>
            <textarea
              className={styles.textarea}
              placeholder={labels.messagePlaceholder}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>

          <div className={styles.actions}>
            <button type="submit" className={styles.submit}>
              {labels.send}
              <Image src="/images/send.svg" alt="" width={20} height={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}