"use client";

import { useEffect, useRef, useState } from "react";
import {Plus, X, ImagePlus } from "lucide-react";
import styles from "./what-we-do.module.css";
import { SidebarToggleButton } from "@/components/Sidebar/SidebarToggleButton";

type Lang = "az" | "en" | "ru";
type LangValue = Record<Lang, string>;

interface Item {
    id: number;
    label: LangValue;
    description: LangValue;
    image: string | null;
    order: number;
}

interface WhatWeDoData {
    badge: LangValue;
    title: LangValue;
    items: Item[];
}

const EMPTY_LANG: LangValue = { az: "", en: "", ru: "" };

const LANGS: { code: Lang; label: string }[] = [
    { code: "az", label: "AZ" },
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
];

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function WhatWeDoPage() {
    const [data, setData] = useState<WhatWeDoData | null>(null);
    const [activeLang, setActiveLang] = useState<Lang>("az");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [dragId, setDragId] = useState<number | null>(null);
    const [dragOverId, setDragOverId] = useState<number | null>(null);
    const [uploadingId, setUploadingId] = useState<number | null>(null);

    const pendingChanges = useRef<Record<number, { label: LangValue; description: LangValue }>>({});
    const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

    useEffect(() => {
        fetch("/api/what-we-do")
            .then((res) => res.json())
            .then((json) => {
                setData({
                    badge: { ...EMPTY_LANG, ...(json.badge ?? {}) },
                    title: { ...EMPTY_LANG, ...(json.title ?? {}) },
                    items: (json.items ?? []).map((item: Item) => ({
                        ...item,
                        label: { ...EMPTY_LANG, ...item.label },
                        description: { ...EMPTY_LANG, ...item.description },
                    })),
                });
            });
    }, []);

    if (!data) {
        return <div className={styles.page}>Yüklənir...</div>;
    }

    const updateTopField = (field: "badge" | "title", value: string) => {
        setData((prev) => (prev ? { ...prev, [field]: { ...prev[field], [activeLang]: value } } : prev));
    };

    const updateItemField = (id: number, field: "label" | "description", value: string) => {
        setData((prev) => {
            if (!prev) return prev;
            const items = prev.items.map((item) =>
                item.id === id ? { ...item, [field]: { ...item[field], [activeLang]: value } } : item,
            );
            const changed = items.find((i) => i.id === id)!;
            pendingChanges.current[id] = { label: changed.label, description: changed.description };
            return { ...prev, items };
        });
    };

    const persistItem = async (id: number) => {
        const change = pendingChanges.current[id];
        if (!change) return;

        await fetch(`/api/what-we-do/items/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(change),
        });

        delete pendingChanges.current[id];
    };

    const handleAddItem = async () => {
        setIsAdding(true);
        try {
            const res = await fetch("/api/what-we-do/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    label: { az: "", en: "", ru: "" },
                    description: { az: "", en: "", ru: "" },
                }),
            });
            const item = await res.json();

            if (!res.ok) {
                setSaveMessage({ type: "error", text: "Element əlavə olunmadı" });
                return;
            }

            setData((prev) =>
                prev
                    ? {
                          ...prev,
                          items: [
                              ...prev.items,
                              { ...item, label: { ...EMPTY_LANG, ...item.label }, description: { ...EMPTY_LANG, ...item.description } },
                          ],
                      }
                    : prev,
            );
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteItem = async (id: number) => {
        setData((prev) => (prev ? { ...prev, items: prev.items.filter((i) => i.id !== id) } : prev));
        await fetch(`/api/what-we-do/items/${id}`, { method: "DELETE" });
    };

    const handleUploadImage = async (id: number, file: File) => {
        setUploadingId(id);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`/api/what-we-do/items/${id}/upload`, { method: "POST", body: formData });
            const json = await res.json();

            if (!res.ok) {
                setSaveMessage({ type: "error", text: "Şəkil yüklənmədi" });
                return;
            }

            setData((prev) =>
                prev ? { ...prev, items: prev.items.map((i) => (i.id === id ? { ...i, image: json.url } : i)) } : prev,
            );
        } finally {
            setUploadingId(null);
        }
    };

    const persistOrder = async (items: Item[]) => {
        await fetch("/api/what-we-do/items/reorder", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: items.map((i) => i.id) }),
        });
    };

    const handleDrop = (targetId: number) => {
        if (dragId === null || dragId === targetId || !data) {
            setDragId(null);
            setDragOverId(null);
            return;
        }

        const items = [...data.items];
        const fromIndex = items.findIndex((i) => i.id === dragId);
        const toIndex = items.findIndex((i) => i.id === targetId);
        const [moved] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, moved);

        setData((prev) => (prev ? { ...prev, items } : prev));
        setDragId(null);
        setDragOverId(null);
        persistOrder(items);
    };

    const flushPending = async () => {
        const entries = Object.entries(pendingChanges.current);
        pendingChanges.current = {};

        await Promise.all(
            entries.map(([id, change]) =>
                fetch(`/api/what-we-do/items/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(change),
                }),
            ),
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage(null);

        try {
            const [settingsRes] = await Promise.all([
                fetch("/api/what-we-do", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ badge: data.badge, title: data.title }),
                }),
                flushPending(),
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
                    <h1 className={styles.title}>Services</h1>
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

            <p className={styles.subtitle}>What We Do</p>

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
                        placeholder="From entry to scale"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Section title</label>
                    <input
                        className={styles.input}
                        value={data.title[activeLang]}
                        onChange={(e) => updateTopField("title", e.target.value)}
                        placeholder="What We Do"
                    />
                </div>

                <div>
                    <div className={styles.itemsHeaderRow}>
                        <label className={styles.label}>Body paragraph 1</label>
                        <button type="button" className={styles.addButton} onClick={handleAddItem} disabled={isAdding}>
                            <Plus size={14} />
                            Add
                        </button>
                    </div>

                    <div className={styles.itemsList} style={{ marginTop: 12 }}>
                        {data.items.map((item, index) => (
                            <div
                                key={item.id}
                                className={`${styles.itemCard} ${dragId === item.id ? styles.itemCardDragging : ""} ${
                                    dragOverId === item.id ? styles.itemCardDragOver : ""
                                }`}
                                draggable
                                onDragStart={() => setDragId(item.id)}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOverId(item.id);
                                }}
                                onDragLeave={() => setDragOverId((prev) => (prev === item.id ? null : prev))}
                                onDrop={() => handleDrop(item.id)}
                                onDragEnd={() => {
                                    setDragId(null);
                                    setDragOverId(null);
                                }}
                            >
                                <span className={styles.itemNumber}>
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <div className={styles.itemFields}>
                                    <input
                                        className={styles.input}
                                        value={item.label[activeLang]}
                                        onChange={(e) => updateItemField(item.id, "label", e.target.value)}
                                        onBlur={() => persistItem(item.id)}
                                        placeholder="Market Development & Distribution"
                                    />
                                    <textarea
                                        className={styles.textarea}
                                        value={item.description[activeLang]}
                                        onChange={(e) => updateItemField(item.id, "description", e.target.value)}
                                        onBlur={() => persistItem(item.id)}
                                        placeholder="We bring leading international robotics technologies to the local market..."
                                    />
                                </div>

                                <div
                                    className={styles.itemThumb}
                                    onClick={() => fileInputRefs.current[item.id]?.click()}
                                >
                                    {item.image ? (
                                        <img
                                            src={`${API_ORIGIN}${item.image}`}
                                            alt=""
                                            className={styles.itemThumbImage}
                                        />
                                    ) : (
                                        <ImagePlus size={22} className={styles.itemThumbIcon} />
                                    )}
                                    <input
                                        ref={(el) => {
                                            fileInputRefs.current[item.id] = el;
                                        }}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                        className={styles.hiddenInput}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUploadImage(item.id, file);
                                            e.target.value = "";
                                        }}
                                    />
                                    {uploadingId === item.id && (
                                        <span style={{ position: "absolute", fontSize: 10, color: "#64748b" }}>...</span>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className={styles.itemDeleteButton}
                                    onClick={() => handleDeleteItem(item.id)}
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