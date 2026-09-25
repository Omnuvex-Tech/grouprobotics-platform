"use client";

import { useEffect, useRef, useState } from "react";
import {Plus, X } from "lucide-react";
import { SidebarToggleButton } from "@/components/Sidebar/SidebarToggleButton";
import styles from "./capabilities.module.css";

type Lang = "az" | "en" | "ru";
type LangValue = Record<Lang, string>;

interface CapCard {
    id: number;
    title: LangValue;
    description: LangValue;
    image: string | null;
    order: number;
}

interface CapabilitiesData {
    badge: LangValue;
    title: LangValue;
    cards: CapCard[];
}

const EMPTY_LANG: LangValue = { az: "", en: "", ru: "" };

const LANGS: { code: Lang; label: string }[] = [
    { code: "az", label: "AZ" },
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
];

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function CapabilitiesPage() {
    const [data, setData] = useState<CapabilitiesData | null>(null);
    const [activeLang, setActiveLang] = useState<Lang>("az");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [dragId, setDragId] = useState<number | null>(null);
    const [dragOverId, setDragOverId] = useState<number | null>(null);
    const [dragOverImageId, setDragOverImageId] = useState<number | null>(null);
    const [uploadingId, setUploadingId] = useState<number | null>(null);

    const pendingChanges = useRef<Record<number, { title: LangValue; description: LangValue }>>({});
    const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

    useEffect(() => {
        fetch("/api/capabilities")
            .then((res) => res.json())
            .then((json) => {
                setData({
                    badge: { ...EMPTY_LANG, ...(json.badge ?? {}) },
                    title: { ...EMPTY_LANG, ...(json.title ?? {}) },
                    cards: (json.cards ?? []).map((card: CapCard) => ({
                        ...card,
                        title: { ...EMPTY_LANG, ...card.title },
                        description: { ...EMPTY_LANG, ...card.description },
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

    const updateCardField = (id: number, field: "title" | "description", value: string) => {
        setData((prev) => {
            if (!prev) return prev;
            const cards = prev.cards.map((card) =>
                card.id === id ? { ...card, [field]: { ...card[field], [activeLang]: value } } : card,
            );
            const changed = cards.find((c) => c.id === id)!;
            pendingChanges.current[id] = { title: changed.title, description: changed.description };
            return { ...prev, cards };
        });
    };

    const persistCard = async (id: number) => {
        const change = pendingChanges.current[id];
        if (!change) return;

        await fetch(`/api/capabilities/cards/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(change),
        });

        delete pendingChanges.current[id];
    };

    const handleAddCard = async () => {
        setIsAdding(true);
        try {
            const res = await fetch("/api/capabilities/cards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: { az: "", en: "", ru: "" },
                    description: { az: "", en: "", ru: "" },
                }),
            });
            const card = await res.json();

            if (!res.ok) {
                setSaveMessage({ type: "error", text: "Kart əlavə olunmadı" });
                return;
            }

            setData((prev) =>
                prev
                    ? {
                          ...prev,
                          cards: [
                              ...prev.cards,
                              { ...card, title: { ...EMPTY_LANG, ...card.title }, description: { ...EMPTY_LANG, ...card.description } },
                          ],
                      }
                    : prev,
            );
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteCard = async (id: number) => {
        setData((prev) => (prev ? { ...prev, cards: prev.cards.filter((c) => c.id !== id) } : prev));
        await fetch(`/api/capabilities/cards/${id}`, { method: "DELETE" });
    };

    const handleUploadImage = async (id: number, file: File) => {
        setUploadingId(id);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`/api/capabilities/cards/${id}/upload`, { method: "POST", body: formData });
            const json = await res.json();

            if (!res.ok) {
                setSaveMessage({ type: "error", text: "Şəkil yüklənmədi" });
                return;
            }

            setData((prev) =>
                prev ? { ...prev, cards: prev.cards.map((c) => (c.id === id ? { ...c, image: json.url } : c)) } : prev,
            );
        } finally {
            setUploadingId(null);
        }
    };

    const persistOrder = async (cards: CapCard[]) => {
        await fetch("/api/capabilities/cards/reorder", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: cards.map((c) => c.id) }),
        });
    };

    const handleDrop = (targetId: number) => {
        if (dragId === null || dragId === targetId || !data) {
            setDragId(null);
            setDragOverId(null);
            return;
        }

        const cards = [...data.cards];
        const fromIndex = cards.findIndex((c) => c.id === dragId);
        const toIndex = cards.findIndex((c) => c.id === targetId);
        const [moved] = cards.splice(fromIndex, 1);
        cards.splice(toIndex, 0, moved);

        setData((prev) => (prev ? { ...prev, cards } : prev));
        setDragId(null);
        setDragOverId(null);
        persistOrder(cards);
    };

    const flushPending = async () => {
        const entries = Object.entries(pendingChanges.current);
        pendingChanges.current = {};

        await Promise.all(
            entries.map(([id, change]) =>
                fetch(`/api/capabilities/cards/${id}`, {
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
                fetch("/api/capabilities", {
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
                    <h1 className={styles.title}>Products</h1>
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

            <p className={styles.subtitle}>Capabilities</p>

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
                        placeholder="Capabilities"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Section title</label>
                    <input
                        className={styles.input}
                        value={data.title[activeLang]}
                        onChange={(e) => updateTopField("title", e.target.value)}
                        placeholder="Our Technology Focus"
                    />
                </div>

                <div>
                    <div className={styles.cardsHeaderRow}>
                        <label className={styles.label}>Technology Cards</label>
                        <button type="button" className={styles.addButton} onClick={handleAddCard} disabled={isAdding}>
                            <Plus size={14} />
                            Add
                        </button>
                    </div>

                    <div className={styles.cardsGrid} style={{ marginTop: 12 }}>
                        {data.cards.map((cardItem, index) => (
                            <div
                                key={cardItem.id}
                                className={`${styles.cardItem} ${dragId === cardItem.id ? styles.cardItemDragging : ""} ${
                                    dragOverId === cardItem.id ? styles.cardItemDragOver : ""
                                }`}
                                draggable
                                onDragStart={() => setDragId(cardItem.id)}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOverId(cardItem.id);
                                }}
                                onDragLeave={() => setDragOverId((prev) => (prev === cardItem.id ? null : prev))}
                                onDrop={() => handleDrop(cardItem.id)}
                                onDragEnd={() => {
                                    setDragId(null);
                                    setDragOverId(null);
                                }}
                            >
                                <div className={styles.cardTopRow}>
                                    <span className={styles.cardNumber}>{index + 1}</span>
                                    <span className={styles.cardTopLabel}>Card title</span>
                                    <button
                                        type="button"
                                        className={styles.cardDeleteButton}
                                        onClick={() => handleDeleteCard(cardItem.id)}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                <input
                                    className={styles.smallInput}
                                    value={cardItem.title[activeLang]}
                                    onChange={(e) => updateCardField(cardItem.id, "title", e.target.value)}
                                    onBlur={() => persistCard(cardItem.id)}
                                    placeholder="Humanoid & Embodied AI"
                                />

                                <span className={styles.smallLabel}>Card description</span>
                                <input
                                    className={styles.smallInput}
                                    value={cardItem.description[activeLang]}
                                    onChange={(e) => updateCardField(cardItem.id, "description", e.target.value)}
                                    onBlur={() => persistCard(cardItem.id)}
                                    placeholder="Intelligent machines performing complex real-world tasks."
                                />

                                <span className={styles.smallLabel}>Body paragraph</span>

                                {cardItem.image ? (
                                    <div className={styles.dropzone}>
                                        <div className={styles.previewWrapper}>
                                            <img
                                                src={`${API_ORIGIN}${cardItem.image}`}
                                                alt=""
                                                className={styles.previewImage}
                                            />
                                            <button
                                                type="button"
                                                className={styles.removePreview}
                                                onClick={() =>
                                                    setData((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  cards: prev.cards.map((c) =>
                                                                      c.id === cardItem.id ? { ...c, image: null } : c,
                                                                  ),
                                                              }
                                                            : prev,
                                                    )
                                                }
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={`${styles.dropzone} ${
                                            dragOverImageId === cardItem.id ? styles.dropzoneDragOver : ""
                                        }`}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setDragOverImageId(cardItem.id);
                                        }}
                                        onDragLeave={() => setDragOverImageId(null)}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setDragOverImageId(null);
                                            const file = e.dataTransfer.files?.[0];
                                            if (file) handleUploadImage(cardItem.id, file);
                                        }}
                                    >
                                        <span className={styles.dropzoneIcon}>📁</span>
                                        <span style={{ fontSize: 12, fontWeight: 700 }}>
                                            {uploadingId === cardItem.id ? "Yüklənir..." : "Drag & drop here"}
                                        </span>
                                        <span className={styles.dropzoneHint}>
                                            JPEG, PNG, WebP and SVG format, up to 10MB
                                        </span>
                                        <button
                                            type="button"
                                            className={styles.selectFileButton}
                                            onClick={() => fileInputRefs.current[cardItem.id]?.click()}
                                        >
                                            Select file
                                        </button>
                                        <input
                                            ref={(el) => {
                                                fileInputRefs.current[cardItem.id] = el;
                                            }}
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                            className={styles.hiddenInput}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleUploadImage(cardItem.id, file);
                                                e.target.value = "";
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}