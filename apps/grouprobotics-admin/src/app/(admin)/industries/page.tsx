"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { SidebarToggleButton } from "@/components/Sidebar/SidebarToggleButton";
import EmojiPicker from "emoji-picker-react";
import styles from "./industries.module.css";

type Lang = "az" | "en" | "ru";
type LangValue = Record<Lang, string>;

interface Tag {
    id: number;
    icon: string;
    label: LangValue;
    order: number;
}

interface IndustriesData {
    badge: LangValue;
    title: LangValue;
    tags: Tag[];
}

const EMPTY_LANG: LangValue = { az: "", en: "", ru: "" };

const LANGS: { code: Lang; label: string }[] = [
    { code: "az", label: "AZ" },
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
];

export default function IndustriesPage() {
    const [data, setData] = useState<IndustriesData | null>(null);
    const [activeLang, setActiveLang] = useState<Lang>("az");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [dragId, setDragId] = useState<number | null>(null);
    const [dragOverId, setDragOverId] = useState<number | null>(null);
    const [openPickerId, setOpenPickerId] = useState<number | null>(null);

    const pendingLabels = useRef<Record<number, LangValue>>({});
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("/api/industries")
            .then((res) => res.json())
            .then((json) => {
                setData({
                    badge: { ...EMPTY_LANG, ...(json.badge ?? {}) },
                    title: { ...EMPTY_LANG, ...(json.title ?? {}) },
                    tags: (json.tags ?? []).map((tag: Tag) => ({
                        ...tag,
                        label: { ...EMPTY_LANG, ...tag.label },
                    })),
                });
            });
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setOpenPickerId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!data) {
        return <div className={styles.page}>Yüklənir...</div>;
    }

    const updateTopField = (field: "badge" | "title", value: string) => {
        setData((prev) => (prev ? { ...prev, [field]: { ...prev[field], [activeLang]: value } } : prev));
    };

    const updateTagLabel = (id: number, value: string) => {
        setData((prev) => {
            if (!prev) return prev;
            const tags = prev.tags.map((tag) =>
                tag.id === id ? { ...tag, label: { ...tag.label, [activeLang]: value } } : tag,
            );
            const changed = tags.find((t) => t.id === id);
            if (changed) pendingLabels.current[id] = changed.label;
            return { ...prev, tags };
        });
    };

    const persistTagLabel = async (id: number) => {
        const label = pendingLabels.current[id];
        if (!label) return;

        await fetch(`/api/industries/tags/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label }),
        });

        delete pendingLabels.current[id];
    };

    const handlePickEmoji = async (id: number, emoji: string) => {
        setData((prev) =>
            prev ? { ...prev, tags: prev.tags.map((t) => (t.id === id ? { ...t, icon: emoji } : t)) } : prev,
        );
        setOpenPickerId(null);

        await fetch(`/api/industries/tags/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ icon: emoji }),
        });
    };

    const handleAddTag = async () => {
        setIsAdding(true);
        try {
            const res = await fetch("/api/industries/tags", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ label: { az: "", en: "", ru: "" }, icon: "🏭" }),
            });
            const tag = await res.json();

            if (!res.ok) {
                setSaveMessage({ type: "error", text: "Tag əlavə olunmadı" });
                return;
            }

            setData((prev) =>
                prev ? { ...prev, tags: [...prev.tags, { ...tag, label: { ...EMPTY_LANG, ...tag.label } }] } : prev,
            );
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteTag = async (id: number) => {
        setData((prev) => (prev ? { ...prev, tags: prev.tags.filter((t) => t.id !== id) } : prev));
        await fetch(`/api/industries/tags/${id}`, { method: "DELETE" });
    };

    const persistOrder = async (tags: Tag[]) => {
        await fetch("/api/industries/tags/reorder", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: tags.map((t) => t.id) }),
        });
    };

    const handleDrop = (targetId: number) => {
        if (dragId === null || dragId === targetId || !data) {
            setDragId(null);
            setDragOverId(null);
            return;
        }

        const tags = [...data.tags];
        const fromIndex = tags.findIndex((t) => t.id === dragId);
        const toIndex = tags.findIndex((t) => t.id === targetId);
        const [moved] = tags.splice(fromIndex, 1);
        tags.splice(toIndex, 0, moved);

        setData((prev) => (prev ? { ...prev, tags } : prev));
        setDragId(null);
        setDragOverId(null);
        persistOrder(tags);
    };

    const flushPendingLabels = async () => {
        const entries = Object.entries(pendingLabels.current);
        pendingLabels.current = {};

        await Promise.all(
            entries.map(([id, label]) =>
                fetch(`/api/industries/tags/${id}`, {
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
            const [settingsRes] = await Promise.all([
                fetch("/api/industries", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ badge: data.badge, title: data.title }),
                }),
                flushPendingLabels(),
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
                    <h1 className={styles.title}>Sectors</h1>
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

            <p className={styles.subtitle}>Industries</p>

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
                        onChange={(e) => updateTopField("badge", e.target.value)}
                        placeholder="Robotics for real-world operations"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Section title</label>
                    <input
                        className={styles.input}
                        value={data.title[activeLang]}
                        onChange={(e) => updateTopField("title", e.target.value)}
                        placeholder="Industries We Serve"
                    />
                </div>

                <div>
                    <div className={styles.tagsHeaderRow}>
                        <label className={styles.label}>Industry Tags</label>
                        <button type="button" className={styles.addButton} onClick={handleAddTag} disabled={isAdding}>
                            <Plus size={14} />
                            Add
                        </button>
                    </div>

                    <div className={styles.tagsList} style={{ marginTop: 12 }}>
                        {data.tags.map((tag) => (
                            <div
                                key={tag.id}
                                className={`${styles.tagRow} ${dragId === tag.id ? styles.tagRowDragging : ""} ${
                                    dragOverId === tag.id ? styles.tagRowDragOver : ""
                                }`}
                                draggable
                                onDragStart={() => setDragId(tag.id)}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOverId(tag.id);
                                }}
                                onDragLeave={() => setDragOverId((prev) => (prev === tag.id ? null : prev))}
                                onDrop={() => handleDrop(tag.id)}
                                onDragEnd={() => {
                                    setDragId(null);
                                    setDragOverId(null);
                                }}
                            >
                                <button
                                    type="button"
                                    className={styles.iconButton}
                                    onClick={() => setOpenPickerId((prev) => (prev === tag.id ? null : tag.id))}
                                >
                                    {tag.icon}
                                </button>

                                {openPickerId === tag.id && (
                                    <div className={styles.emojiPopover} ref={pickerRef}>
                                        <EmojiPicker
                                            onEmojiClick={(emojiData) => handlePickEmoji(tag.id, emojiData.emoji)}
                                            width={300}
                                            height={360}
                                        />
                                    </div>
                                )}

                                <input
                                    className={styles.tagInput}
                                    value={tag.label[activeLang]}
                                    onChange={(e) => updateTagLabel(tag.id, e.target.value)}
                                    onBlur={() => persistTagLabel(tag.id)}
                                />
                                <button
                                    type="button"
                                    className={styles.tagDeleteButton}
                                    onClick={() => handleDeleteTag(tag.id)}
                                >
                                    <X size={15} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={styles.previewRow}>
                        {data.tags.map((tag) => (
                            <span key={tag.id} className={styles.previewTag}>
                                <span>{tag.icon}</span>
                                {tag.label[activeLang] || "..."}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}