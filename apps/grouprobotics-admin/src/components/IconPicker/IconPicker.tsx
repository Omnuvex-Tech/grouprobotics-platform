"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ICON_CATALOG, ICON_NAMES } from "./icon-catalog";
import styles from "./icon-picker.module.css";

export function IconPicker({ value, onChange }: { value: string; onChange: (name: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const SelectedIcon = ICON_CATALOG[value] ?? ICON_CATALOG.Building2;

    return (
        <div className={styles.wrapper} ref={ref}>
            <button type="button" className={styles.trigger} onClick={() => setIsOpen((prev) => !prev)}>
                <span className={styles.triggerLeft}>
                    <SelectedIcon size={16} />
                    {value}
                </span>
                <ChevronDown size={15} />
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    {ICON_NAMES.map((name) => {
                        const Icon = ICON_CATALOG[name];
                        return (
                            <button
                                key={name}
                                type="button"
                                className={`${styles.option} ${name === value ? styles.optionSelected : ""}`}
                                onClick={() => {
                                    onChange(name);
                                    setIsOpen(false);
                                }}
                            >
                                <Icon size={16} />
                                {name}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}