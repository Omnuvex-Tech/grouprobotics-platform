"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { SidebarToggleButton } from "@/components/Sidebar/SidebarToggleButton";
import styles from "./contact.module.css";

type Lang = "az" | "en" | "ru";
type LangValue = Record<Lang, string>;

interface Option {
    id: number;
    label: LangValue;
    order: number;
}

interface ContactData {
    badge: LangValue;
    title: LangValue;
    description: LangValue;
    nameLabel: LangValue;
    namePlaceholder: LangValue;
    phoneLabel: LangValue;
    phonePlaceholder: LangValue;
    companyLabel: LangValue;
    companyPlaceholder: LangValue;
    emailLabel: LangValue;
    emailPlaceholder: LangValue;
    interestLabel: LangValue;
    interestPlaceholder: LangValue;
    messageLabel: LangValue;
    messagePlaceholder: LangValue;
    sendLabel: LangValue;
    options: Option[];
}

const EMPTY_LANG: LangValue = { az: "", en: "", ru: "" };

const LANGS: { code: Lang; label: string }[] = [
    { code: "az", label: "AZ" },
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
];

const TEXT_FIELDS: (keyof ContactData)[] = [
    "nameLabel", "namePlaceholder",
    "phoneLabel", "phonePlaceholder",
    "companyLabel", "companyPlaceholder",
    "emailLabel", "emailPlaceholder",
    "interestLabel", "interestPlaceholder",
    "messageLabel", "messagePlaceholder",
    "sendLabel",
];

export default function ContactPage() {
    const [data, setData] = useState<ContactData | null>(null);
    const [activeLang, setActiveLang] = useState<Lang>("az");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [dragId, setDragId] = useState<number | null>(null);
    const [dragOverId, setDragOverId] = useState<number | null>(null);

    const pendingOptionLabels = useRef<Record<number, LangValue>>({});

    useEffect(() => {
        fetch("/api/contact")
            .then((res) => res.json())
            .then((json) => {
                const merged: any = {};
                for (const key of [
                    "badge", "title", "description",
                    ...TEXT_FIELDS,
                ]) {
                    merged[key] = { ...EMPTY_LANG, ...(json[key] ?? {}) };
                }
                merged.options = (json.options ?? []).map((opt: Option) => ({
                    ...opt,
                    label: { ...EMPTY_LANG, ...opt.label },
                }));
                setData(merged as ContactData);
            });
    }, []);

    if (!data) {
        return <div className={styles.page}>Yüklənir...</div>;
    }

    const updateField = (field: keyof ContactData, value: string) => {
        setData((prev) =>
            prev ? { ...prev, [field]: { ...(prev[field] as LangValue), [activeLang]: value } } : prev,
        );
    };

    const updateOptionLabel = (id: number, value: string) => {
        setData((prev) => {
            if (!prev) return prev;
            const options = prev.options.map((opt) =>
                opt.id === id ? { ...opt, label: { ...opt.label, [activeLang]: value } } : opt,
            );
            const changed = options.find((o) => o.id === id)!;
            pendingOptionLabels.current[id] = changed.label;
            return { ...prev, options };
        });
    };

    const persistOption = async (id: number) => {
        const label = pendingOptionLabels.current[id];
        if (!label) return;

        await fetch(`/api/contact/options/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label }),
        });

        delete pendingOptionLabels.current[id];
    };

    const handleAddOption = async () => {
        setIsAdding(true);
        try {
            const res = await fetch("/api/contact/options", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ label: { az: "", en: "", ru: "" } }),
            });
            const opt = await res.json();

            if (!res.ok) {
                setSaveMessage({ type: "error", text: "Seçim əlavə olunmadı" });
                return;
            }

            setData((prev) =>
                prev ? { ...prev, options: [...prev.options, { ...opt, label: { ...EMPTY_LANG, ...opt.label } }] } : prev,
            );
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteOption = async (id: number) => {
        setData((prev) => (prev ? { ...prev, options: prev.options.filter((o) => o.id !== id) } : prev));
        await fetch(`/api/contact/options/${id}`, { method: "DELETE" });
    };

    const persistOrder = async (options: Option[]) => {
        await fetch("/api/contact/options/reorder", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: options.map((o) => o.id) }),
        });
    };

    const handleDrop = (targetId: number) => {
        if (dragId === null || dragId === targetId || !data) {
            setDragId(null);
            setDragOverId(null);
            return;
        }

        const options = [...data.options];
        const fromIndex = options.findIndex((o) => o.id === dragId);
        const toIndex = options.findIndex((o) => o.id === targetId);
        const [moved] = options.splice(fromIndex, 1);
        options.splice(toIndex, 0, moved);

        setData((prev) => (prev ? { ...prev, options } : prev));
        setDragId(null);
        setDragOverId(null);
        persistOrder(options);
    };

    const flushPendingOptions = async () => {
        const entries = Object.entries(pendingOptionLabels.current);
        pendingOptionLabels.current = {};

        await Promise.all(
            entries.map(([id, label]) =>
                fetch(`/api/contact/options/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ label }),
                }),
            ),
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage(null);

        try {
            const settingsPayload: any = { badge: data.badge, title: data.title, description: data.description };
            for (const key of TEXT_FIELDS) {
                settingsPayload[key] = data[key];
            }

            const [settingsRes] = await Promise.all([
                fetch("/api/contact", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(settingsPayload),
                }),
                flushPendingOptions(),
            ]);
            const json = await settingsRes.json();

            if (!settingsRes.ok) {
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
                    <h1 className={styles.title}>Contact</h1>
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

            <p className={styles.subtitle}>Contact Form</p>

            <div className={styles.card}>
                <div className={styles.langTabs}>
                    {LANGS.map((lang) => (
                        <button
                            key={lang.code}
                            type="button"
                            className={`${styles.langTab} ${activeLang === lang.code ? styles.langTabActive : ""}`}
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
                        placeholder="Contact"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Section title</label>
                    <input
                        className={styles.input}
                        value={data.title[activeLang]}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder="Let's Build Something Real"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Description</label>
                    <textarea
                        className={styles.textarea}
                        value={data.description[activeLang]}
                        onChange={(e) => updateField("description", e.target.value)}
                    />
                </div>

                <p className={styles.sectionTitle}>Form Field Labels</p>

                <div className={styles.fieldGroup}>
                    <span className={styles.fieldGroupTitle}>Name field</span>
                    <div>
                        <span className={styles.smallLabel}>Label</span>
                        <input
                            className={styles.smallInput}
                            value={data.nameLabel[activeLang]}
                            onChange={(e) => updateField("nameLabel", e.target.value)}
                            placeholder="Name"
                        />
                    </div>
                    <div>
                        <span className={styles.smallLabel}>Placeholder</span>
                        <input
                            className={styles.smallInput}
                            value={data.namePlaceholder[activeLang]}
                            onChange={(e) => updateField("namePlaceholder", e.target.value)}
                            placeholder="Your name"
                        />
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                    <span className={styles.fieldGroupTitle}>Phone field</span>
                    <div>
                        <span className={styles.smallLabel}>Label</span>
                        <input
                            className={styles.smallInput}
                            value={data.phoneLabel[activeLang]}
                            onChange={(e) => updateField("phoneLabel", e.target.value)}
                            placeholder="Phone"
                        />
                    </div>
                    <div>
                        <span className={styles.smallLabel}>Placeholder</span>
                        <input
                            className={styles.smallInput}
                            value={data.phonePlaceholder[activeLang]}
                            onChange={(e) => updateField("phonePlaceholder", e.target.value)}
                            placeholder="+994 __ ___ __ __"
                        />
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                    <span className={styles.fieldGroupTitle}>Company field</span>
                    <div>
                        <span className={styles.smallLabel}>Label</span>
                        <input
                            className={styles.smallInput}
                            value={data.companyLabel[activeLang]}
                            onChange={(e) => updateField("companyLabel", e.target.value)}
                            placeholder="Company"
                        />
                    </div>
                    <div>
                        <span className={styles.smallLabel}>Placeholder</span>
                        <input
                            className={styles.smallInput}
                            value={data.companyPlaceholder[activeLang]}
                            onChange={(e) => updateField("companyPlaceholder", e.target.value)}
                            placeholder="Company name"
                        />
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                    <span className={styles.fieldGroupTitle}>Email field</span>
                    <div>
                        <span className={styles.smallLabel}>Label</span>
                        <input
                            className={styles.smallInput}
                            value={data.emailLabel[activeLang]}
                            onChange={(e) => updateField("emailLabel", e.target.value)}
                            placeholder="Email"
                        />
                    </div>
                    <div>
                        <span className={styles.smallLabel}>Placeholder</span>
                        <input
                            className={styles.smallInput}
                            value={data.emailPlaceholder[activeLang]}
                            onChange={(e) => updateField("emailPlaceholder", e.target.value)}
                            placeholder="your@email.com"
                        />
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                    <span className={styles.fieldGroupTitle}>Interest field</span>
                    <div>
                        <span className={styles.smallLabel}>Label</span>
                        <input
                            className={styles.smallInput}
                            value={data.interestLabel[activeLang]}
                            onChange={(e) => updateField("interestLabel", e.target.value)}
                            placeholder="I am interested in"
                        />
                    </div>
                    <div>
                        <span className={styles.smallLabel}>Placeholder</span>
                        <input
                            className={styles.smallInput}
                            value={data.interestPlaceholder[activeLang]}
                            onChange={(e) => updateField("interestPlaceholder", e.target.value)}
                            placeholder="Select an option"
                        />
                    </div>
                </div>
    <div className={styles.fieldGroup}>
                    <span className={styles.fieldGroupTitle}>Message field</span>
                    <div>
                        <span className={styles.smallLabel}>Label</span>
                        <input
                            className={styles.smallInput}
                            value={data.messageLabel[activeLang]}
                            onChange={(e) => updateField("messageLabel", e.target.value)}
                            placeholder="Message"
                        />
                    </div>
                    <div>
                        <span className={styles.smallLabel}>Placeholder</span>
                        <textarea
                            className={styles.smallTextarea}
                            value={data.messagePlaceholder[activeLang]}
                            onChange={(e) => updateField("messagePlaceholder", e.target.value)}
                            placeholder="Tell us about your project"
                            rows={2}
                        />
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Submit button label</label>
                    <input
                        className={styles.input}
                        value={data.sendLabel[activeLang]}
                        onChange={(e) => updateField("sendLabel", e.target.value)}
                        placeholder="Send Message"
                    />
                </div>

                <div>
                    <div className={styles.optionsHeaderRow}>
                        <label className={styles.label}>"I am interested in" options</label>
                        <button type="button" className={styles.addButton} onClick={handleAddOption} disabled={isAdding}>
                            <Plus size={14} />
                            Add
                        </button>
                    </div>

                    <div className={styles.optionsList} style={{ marginTop: 12 }}>
                        {data.options.map((opt) => (
                            <div
                                key={opt.id}
                                className={`${styles.optionRow} ${dragId === opt.id ? styles.optionRowDragging : ""} ${
                                    dragOverId === opt.id ? styles.optionRowDragOver : ""
                                }`}
                                draggable
                                onDragStart={() => setDragId(opt.id)}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOverId(opt.id);
                                }}
                                onDragLeave={() => setDragOverId((prev) => (prev === opt.id ? null : prev))}
                                onDrop={() => handleDrop(opt.id)}
                                onDragEnd={() => {
                                    setDragId(null);
                                    setDragOverId(null);
                                }}
                            >
                                <input
                                    className={styles.optionInput}
                                    value={opt.label[activeLang]}
                                    onChange={(e) => updateOptionLabel(opt.id, e.target.value)}
                                    onBlur={() => persistOption(opt.id)}
                                    placeholder="Cleaning Solutions"
                                />
                                <button
                                    type="button"
                                    className={styles.optionDeleteButton}
                                    onClick={() => handleDeleteOption(opt.id)}
                                >
                                    <X size={15} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}