"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { HOME_SECTIONS } from "./section";
import { useSidebar } from "./sidebar-context";
import styles from "./sidebar.module.css";

export function Sidebar() {
    const pathname = usePathname();
    const [isHomeOpen, setIsHomeOpen] = useState(true);
    const { isCollapsed } = useSidebar();

    return (
        <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ""}`}>
            <div className={styles.header}>
                <div className={styles.brand}>
                    <Image src="/images/logo.svg" alt="Group Robotics" width={55} height={35} />
                    <span className={styles.brandName}>Group Robotics</span>
                </div>

                <div className={styles.historyButtons}>
                    <button type="button" className={styles.historyButton} disabled title="Undo">
                        <ChevronLeft size={15} />
                    </button>
                    <button type="button" className={styles.historyButton} disabled title="Redo">
                        <ChevronRight size={15} />
                    </button>
                </div>
            </div>

            <button
                type="button"
                className={styles.pageDropdown}
                onClick={() => setIsHomeOpen((prev) => !prev)}
                aria-expanded={isHomeOpen}
            >
                <span className={styles.pageDropdownLeft}>
                    <span className={styles.pageIcon}>
                        <Image src="/images/home.svg" alt="" width={15} height={15} />
                    </span>
                    Home Page
                </span>
                <ChevronDown
                    size={16}
                    style={{
                        transform: isHomeOpen ? "rotate(0deg)" : "rotate(-90deg)",
                        transition: "transform 0.15s ease",
                    }}
                />
            </button>

            {isHomeOpen && (
                <nav className={styles.nav}>
                    {HOME_SECTIONS.map((section) => {
                        const href = `/${section.slug}`;
                        const isActive = pathname === href;

                        return (
                            <Link
                                key={section.slug}
                                href={href}
                                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                            >
                                {section.label}
                            </Link>
                        );
                    })}
                </nav>
            )}
        </aside>
    );
}