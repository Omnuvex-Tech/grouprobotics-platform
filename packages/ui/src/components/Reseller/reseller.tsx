import Image from 'next/image';
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

export function ResellerUI({ badge, titleLineOne, titleLineTwo, items }: ResellerProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.badge}>{badge}</span>
        <h2 className={styles.title}>
          {titleLineOne}
          <br />
          {titleLineTwo}
        </h2>
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <div className={styles.card} key={item.title}>
            <div className={styles.iconWrap}>
              <Image src={item.icon} alt="" width={24} height={24} aria-hidden="true" />
            </div>
            <p className={styles.cardTitle}>{item.title}</p>
            <p className={styles.cardDescription}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}