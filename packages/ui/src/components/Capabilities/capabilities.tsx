import Image from 'next/image';
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

function CapabilityCard({ item, size }: { item: CapabilityItem; size: 'small' | 'large' }) {
  return (
    <div className={`${styles.card} ${size === 'small' ? styles.cardSmall : styles.cardLarge}`}>
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
          <p className={styles.cardDescription}>{item.description}</p>
        </div>
      </div>
    </div>
  );
}

export function CapabilitiesUI({ badge, title, items }: CapabilitiesProps) {
  const [first, second, third, fourth] = items;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.badge}>{badge}</span>
        <h2 className={styles.title}>{title}</h2>
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