"use client";

import { useEffect, useState } from "react";
import { SidebarToggleButton } from "@/components/Sidebar/SidebarToggleButton"; 
import styles from "./approach.module.css";

type Lang = "az" | "en" | "ru";
type LangValue = Record<Lang, string>;

interface ApproachData {
    badge: LangValue;
    title: LangValue;
    paragraph: LangValue;
    highlight: LangValue;
    quote: LangValue;
}

const EMPTY_LANG: LangValue = { az: "", en: "", ru: "" };

const LANGS: { code: Lang; label: string }[] = [
    { code: "az", label: "AZ" },
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
];

export default function ApproachPage() {
    const [data, setData] = useState<ApproachData | null>(null);
    const [activeLang, setActiveLang] = useState<Lang>("az");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetch("/api/approach")
            .then((res) => res.json())
            .then((json) => {
                setData({
                    badge: { ...EMPTY_LANG, ...(json.badge ?? {}) },
                    title: { ...EMPTY_LANG, ...(json.title ?? {}) },
                    paragraph: { ...EMPTY_LANG, ...(json.paragraph ?? {}) },
                    highlight: { ...EMPTY_LANG, ...(json.highlight ?? {}) },
                    quote: { ...EMPTY_LANG, ...(json.quote ?? {}) },
                });
            });
    }, []);

    if (!data) {
        return <div className={styles.page}>Yüklənir...</div>;
    }

    const updateField = (field: keyof ApproachData, value: string) => {
        setData((prev) => (prev ? { ...prev, [field]: { ...prev[field], [activeLang]: value } } : prev));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage(null);

        try {
            const res = await fetch("/api/approach", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();

            if (!res.ok) {
                setSaveMessage({ type: "error", text: json?.message ?? "Yadda saxlanmadı" });
                return;
            }

            setSaveMessage({ type: "success", text: "Yadda saxlanıldı" });
        } catch {
            setSaveMessage({ type: "error", text: "Yadda saxlanmadı" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.headerRow}>
                <div className={styles.headerLeft}>
                    <SidebarToggleButton className={styles.backButton} />
                    <h1 className={styles.title}>About us</h1>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {saveMessage && (
                        <span
                            className={`${styles.saveMessage} ${
                                saveMessage.type === "success" ? styles.saveMessageSuccess : styles.saveMessageError
                            }`}
                        >
                            {saveMessage.text}
                        </span>
                    )}
                    <button type="button" className={styles.saveButton} onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saxlanılır..." : "Save"}
                    </button>
                </div>
            </div>

            <p className={styles.subtitle}>Our Approach section</p>

            <div className={styles.card}>
                <div className={styles.langTabs}>
                    {LANGS.map((lang) => (
                        <button
                            key={lang.code}
                            type="button"
                            className={`${styles.langTab} ${
                                activeLang === lang.code ? styles.langTabActive : ""
                            }`}
                            onClick={() => setActiveLang(lang.code)}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Badge text</label>
                    <input
                        className={styles.input}
                        value={data.badge[activeLang]}
                        onChange={(e) => updateField("badge", e.target.value)}
                        placeholder="Our Approach"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Section title</label>
                    <input
                        className={styles.input}
                        value={data.title[activeLang]}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder="We Build the Ecosystem Around the Robot"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Body paragraph 1</label>
                    <textarea
                        className={styles.textarea}
                        value={data.paragraph[activeLang]}
                        onChange={(e) => updateField("paragraph", e.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Body paragraph 2 (bold)</label>
                    <textarea
                        className={styles.textarea}
                        value={data.highlight[activeLang]}
                        onChange={(e) => updateField("highlight", e.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Pull quote (right card)</label>
                    <textarea
                        className={styles.textarea}
                        value={data.quote[activeLang]}
                        onChange={(e) => updateField("quote", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}