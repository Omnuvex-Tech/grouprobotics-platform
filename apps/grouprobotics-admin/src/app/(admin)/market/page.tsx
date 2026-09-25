"use client";

import { useEffect, useRef, useState } from "react";
import {Plus, X } from "lucide-react";
import styles from "./market.module.css";
import { SidebarToggleButton } from "@/components/Sidebar/SidebarToggleButton";

type Lang = "az" | "en" | "ru";
type LangValue = Record<Lang, string>;

interface Pill {
    id: number;
    label: LangValue;
    order: number;
}

interface MarketData {
    badge: LangValue;
    title: LangValue;
    pills: Pill[];
}

const EMPTY_LANG: LangValue = { az: "", en: "", ru: "" };

const LANGS: { code: Lang; label: string }[] = [
    { code: "az", label: "AZ" },
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
];

export default function MarketPage() {
    const [data, setData] = useState<MarketData | null>(null);
    const [activeLang, setActiveLang] = useState<Lang>("az");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [dragId, setDragId] = useState<number | null>(null);
    const [dragOverId, setDragOverId] = useState<number | null>(null);

    const pendingLabels = useRef<Record<number, LangValue>>({});

    useEffect(() => {
        fetch("/api/market")
            .then((res) => res.json())
            .then((json) => {
                setData({
                    badge: { ...EMPTY_LANG, ...(json.badge ?? {}) },
                    title: { ...EMPTY_LANG, ...(json.title ?? {}) },
                    pills: (json.pills ?? []).map((pill: Pill) => ({
                        ...pill,
                        label: { ...EMPTY_LANG, ...pill.label },
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

    const updatePillLabel = (id: number, value: string) => {
        setData((prev) => {
            if (!prev) return prev;
            const pills = prev.pills.map((pill) =>
                pill.id === id ? { ...pill, label: { ...pill.label, [activeLang]: value } } : pill,
            );
            const changed = pills.find((p) => p.id === id);
            if (changed) pendingLabels.current[id] = changed.label;
            return { ...prev, pills };
        });
    };

    const persistPillLabel = async (id: number) => {
        const label = pendingLabels.current[id];
        if (!label) return;

        await fetch(`/api/market/pills/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label }),
        });

        delete pendingLabels.current[id];
    };

    const handleAddPill = async () => {
        setIsAdding(true);
        try {
            const res = await fetch("/api/market/pills", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ label: { az: "", en: "", ru: "" } }),
            });
            const pill = await res.json();

            if (!res.ok) {
                setSaveMessage({ type: "error", text: "Pill əlavə olunmadı" });
                return;
            }

            setData((prev) =>
                prev ? { ...prev, pills: [...prev.pills, { ...pill, label: { ...EMPTY_LANG, ...pill.label } }] } : prev,
            );
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeletePill = async (id: number) => {
        setData((prev) => (prev ? { ...prev, pills: prev.pills.filter((p) => p.id !== id) } : prev));

        await fetch(`/api/market/pills/${id}`, { method: "DELETE" });
    };

    const persistOrder = async (pills: Pill[]) => {
        await fetch("/api/market/pills/reorder", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: pills.map((p) => p.id) }),
        });
    };

    const handleDrop = (targetId: number) => {
        if (dragId === null || dragId === targetId || !data) {
            setDragId(null);
            setDragOverId(null);
            return;
        }

        const pills = [...data.pills];
        const fromIndex = pills.findIndex((p) => p.id === dragId);
        const toIndex = pills.findIndex((p) => p.id === targetId);
        const [moved] = pills.splice(fromIndex, 1);
        pills.splice(toIndex, 0, moved);

        setData((prev) => (prev ? { ...prev, pills } : prev));
        setDragId(null);
        setDragOverId(null);
        persistOrder(pills);
    };
    const flushPendingLabels = async () => {
        const entries = Object.entries(pendingLabels.current);
        pendingLabels.current = {};

        await Promise.all(
            entries.map(([id, label]) =>
                fetch(`/api/market/pills/${id}`, {
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
                fetch("/api/market", {
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
                    <h1 className={styles.title}>Market</h1>
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

            <p className={styles.subtitle}>Build Your Market With Us</p>

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
                        placeholder="For Manufacturers"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Section title</label>
                    <input
                        className={styles.input}
                        value={data.title[activeLang]}
                        onChange={(e) => updateTopField("title", e.target.value)}
                        placeholder="Build Your Market With Us"
                    />
                </div>

                <div>
                    <div className={styles.pillsHeaderRow}>
                        <label className={styles.label}>Capability pills</label>
                        <button type="button" className={styles.addButton} onClick={handleAddPill} disabled={isAdding}>
                            <Plus size={14} />
                            Add
                        </button>
                    </div>

                    <div className={styles.pillsList} style={{ marginTop: 12 }}>
                        {data.pills.map((pill, index) => (
                            <div
                                key={pill.id}
                                className={`${styles.pillRow} ${dragId === pill.id ? styles.pillRowDragging : ""} ${
                                    dragOverId === pill.id ? styles.pillRowDragOver : ""
                                }`}
                                draggable
                                onDragStart={() => setDragId(pill.id)}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOverId(pill.id);
                                }}
                                onDragLeave={() => setDragOverId((prev) => (prev === pill.id ? null : prev))}
                                onDrop={() => handleDrop(pill.id)}
                                onDragEnd={() => {
                                    setDragId(null);
                                    setDragOverId(null);
                                }}
                            >
                                <span className={styles.pillNumber}>
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <input
                                    className={styles.pillInput}
                                    value={pill.label[activeLang]}
                                    onChange={(e) => updatePillLabel(pill.id, e.target.value)}
                                    onBlur={() => persistPillLabel(pill.id)}
                                />
                                <button
                                    type="button"
                                    className={styles.pillDeleteButton}
                                    onClick={() => handleDeletePill(pill.id)}
                                >
                                    <X size={15} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={styles.previewRow}>
                        {data.pills.map((pill, index) => (
                            <span key={pill.id} className={styles.previewPill}>
                                <span className={styles.previewPillNumber}>
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                {pill.label[activeLang] || "..."}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}