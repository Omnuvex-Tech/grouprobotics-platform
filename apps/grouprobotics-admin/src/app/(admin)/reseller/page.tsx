"use client";

import { useEffect, useRef, useState } from "react";
import {Plus, X } from "lucide-react";
import { IconPicker } from "@/components/IconPicker/IconPicker";
import styles from "./reseller.module.css";
import { SidebarToggleButton } from "@/components/Sidebar/SidebarToggleButton";

type Lang = "az" | "en" | "ru";
type LangValue = Record<Lang, string>;

interface PartnerCard {
    id: number;
    icon: string;
    title: LangValue;
    description: LangValue;
    order: number;
}

interface PartnersData {
    badge: LangValue;
    title: LangValue;
    cards: PartnerCard[];
}

const EMPTY_LANG: LangValue = { az: "", en: "", ru: "" };

const LANGS: { code: Lang; label: string }[] = [
    { code: "az", label: "AZ" },
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
];

export default function ResellerPage() {
    const [data, setData] = useState<PartnersData | null>(null);
    const [activeLang, setActiveLang] = useState<Lang>("az");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [dragId, setDragId] = useState<number | null>(null);
    const [dragOverId, setDragOverId] = useState<number | null>(null);

    const pendingChanges = useRef<Record<number, { title: LangValue; description: LangValue }>>({});

    useEffect(() => {
        fetch("/api/partners")
            .then((res) => res.json())
            .then((json) => {
                setData({
                    badge: { ...EMPTY_LANG, ...(json.badge ?? {}) },
                    title: { ...EMPTY_LANG, ...(json.title ?? {}) },
                    cards: (json.cards ?? []).map((card: PartnerCard) => ({
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

        await fetch(`/api/partners/cards/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(change),
        });

        delete pendingChanges.current[id];
    };

    const handleIconChange = async (id: number, icon: string) => {
        setData((prev) =>
            prev ? { ...prev, cards: prev.cards.map((c) => (c.id === id ? { ...c, icon } : c)) } : prev,
        );

        await fetch(`/api/partners/cards/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ icon }),
        });
    };

    const handleAddCard = async () => {
        setIsAdding(true);
        try {
            const res = await fetch("/api/partners/cards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: { az: "", en: "", ru: "" },
                    description: { az: "", en: "", ru: "" },
                    icon: "Building2",
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
        await fetch(`/api/partners/cards/${id}`, { method: "DELETE" });
    };

    const persistOrder = async (cards: PartnerCard[]) => {
        await fetch("/api/partners/cards/reorder", {
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
                fetch(`/api/partners/cards/${id}`, {
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
                fetch("/api/partners", {
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
                    <h1 className={styles.title}>Partners</h1>
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

            <p className={styles.subtitle}>Not Just a Reseller</p>

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
                        placeholder="Local Global"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Section title</label>
                    <input
                        className={styles.input}
                        value={data.title[activeLang]}
                        onChange={(e) => updateTopField("title", e.target.value)}
                        placeholder="Not just a reseller"
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
                        {data.cards.map((cardItem) => (
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
                                    <span className={styles.smallLabel}>Icon:</span>
                                    <button
                                        type="button"
                                        className={styles.cardDeleteButton}
                                        onClick={() => handleDeleteCard(cardItem.id)}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                <IconPicker
                                    value={cardItem.icon}
                                    onChange={(icon) => handleIconChange(cardItem.id, icon)}
                                />

                                <span className={styles.smallLabel}>Title</span>
                                <input
                                    className={styles.smallInput}
                                    value={cardItem.title[activeLang]}
                                    onChange={(e) => updateCardField(cardItem.id, "title", e.target.value)}
                                    onBlur={() => persistCard(cardItem.id)}
                                    placeholder="Strong Local Market Access"
                                />
                                <span className={styles.smallLabel}>Description</span>
                                <input
                                    className={styles.smallInput}
                                    value={cardItem.description[activeLang]}
                                    onChange={(e) => updateCardField(cardItem.id, "description", e.target.value)}
                                    onBlur={() => persistCard(cardItem.id)}
                                    placeholder="Strong understanding of Azerbaijan's corporate..."
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}