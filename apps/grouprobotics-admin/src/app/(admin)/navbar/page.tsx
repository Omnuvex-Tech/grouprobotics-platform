"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X, ImagePlus } from "lucide-react";
import styles from "./navbar.module.css";
import { SidebarToggleButton } from "@/components/Sidebar/SidebarToggleButton";

type Lang = "az" | "en" | "ru";
type LangValue = Record<Lang, string>;

interface Link {
    id: number;
    label: LangValue;
    href: string;
    order: number;
}

interface NavbarData {
    logo: string | null;
    links: Link[];
}

const EMPTY_LANG: LangValue = { az: "", en: "", ru: "" };

const LANGS: { code: Lang; label: string }[] = [
    { code: "az", label: "AZ" },
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
];

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function NavbarPage() {
    const [data, setData] = useState<NavbarData | null>(null);
    const [activeLang, setActiveLang] = useState<Lang>("az");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [dragId, setDragId] = useState<number | null>(null);
    const [dragOverId, setDragOverId] = useState<number | null>(null);

    const pendingChanges = useRef<Record<number, { label: LangValue; href: string }>>({});
    const logoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch("/api/navbar")
            .then((res) => res.json())
            .then((json) => {
                setData({
                    logo: json.logo ?? null,
                    links: (json.links ?? []).map((link: Link) => ({
                        ...link,
                        label: { ...EMPTY_LANG, ...link.label },
                    })),
                });
            });
    }, []);

    if (!data) {
        return <div className={styles.page}>Yüklənir...</div>;
    }

    const updateLinkField = (id: number, field: "label" | "href", value: string) => {
        setData((prev) => {
            if (!prev) return prev;
            const links = prev.links.map((link) => {
                if (link.id !== id) return link;
                if (field === "label") {
                    return { ...link, label: { ...link.label, [activeLang]: value } };
                }
                return { ...link, href: value };
            });
            const changed = links.find((l) => l.id === id)!;
            pendingChanges.current[id] = { label: changed.label, href: changed.href };
            return { ...prev, links };
        });
    };

    const persistLink = async (id: number) => {
        const change = pendingChanges.current[id];
        if (!change) return;

        await fetch(`/api/navbar/links/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(change),
        });

        delete pendingChanges.current[id];
    };

    const handleUploadLogo = async (file: File) => {
        setIsUploadingLogo(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/navbar/upload", { method: "POST", body: formData });
            const json = await res.json();

            if (!res.ok) {
                setSaveMessage({ type: "error", text: "Logo yüklənmədi" });
                return;
            }

            setData((prev) => (prev ? { ...prev, logo: json.url } : prev));
        } finally {
            setIsUploadingLogo(false);
        }
    };

    const handleAddLink = async () => {
        setIsAdding(true);
        try {
            const res = await fetch("/api/navbar/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ label: { az: "", en: "", ru: "" }, href: "#" }),
            });
            const link = await res.json();

            if (!res.ok) {
                setSaveMessage({ type: "error", text: "Link əlavə olunmadı" });
                return;
            }

            setData((prev) =>
                prev ? { ...prev, links: [...prev.links, { ...link, label: { ...EMPTY_LANG, ...link.label } }] } : prev,
            );
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteLink = async (id: number) => {
        setData((prev) => (prev ? { ...prev, links: prev.links.filter((l) => l.id !== id) } : prev));
        await fetch(`/api/navbar/links/${id}`, { method: "DELETE" });
    };

    const persistOrder = async (links: Link[]) => {
        await fetch("/api/navbar/links/reorder", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: links.map((l) => l.id) }),
        });
    };

    const handleDrop = (targetId: number) => {
        if (dragId === null || dragId === targetId || !data) {
            setDragId(null);
            setDragOverId(null);
            return;
        }

        const links = [...data.links];
        const fromIndex = links.findIndex((l) => l.id === dragId);
        const toIndex = links.findIndex((l) => l.id === targetId);
        const [moved] = links.splice(fromIndex, 1);
        links.splice(toIndex, 0, moved);

        setData((prev) => (prev ? { ...prev, links } : prev));
        setDragId(null);
        setDragOverId(null);
        persistOrder(links);
    };

    const flushPending = async () => {
        const entries = Object.entries(pendingChanges.current);
        pendingChanges.current = {};

        await Promise.all(
            entries.map(([id, change]) =>
                fetch(`/api/navbar/links/${id}`, {
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
            await flushPending();
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
                    <h1 className={styles.title}>Header</h1>
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

            <p className={styles.subtitle}>Header links and logo</p>

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
                    <label className={styles.label}>Logo</label>
                    <div className={styles.logoRow}>
                        <div className={styles.logoPreview} onClick={() => logoInputRef.current?.click()}>
                            {data.logo ? (
                                <img
                                    src={`${API_ORIGIN}${data.logo}`}
                                    alt=""
                                    className={styles.logoPreviewImage}
                                />
                            ) : (
                                <ImagePlus size={20} color="#94a3b8" />
                            )}
                        </div>
                        <span style={{ fontSize: 12, color: "#64748b" }}>
                            {isUploadingLogo ? "Yüklənir..." : "Klikləyib şəkil seç"}
                        </span>
                        <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            className={styles.hiddenInput}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadLogo(file);
                                e.target.value = "";
                            }}
                        />
                    </div>
                </div>

                <div>
                    <div className={styles.linksHeaderRow}>
                        <label className={styles.label}>Nav Links</label>
                        <button type="button" className={styles.addButton} onClick={handleAddLink} disabled={isAdding}>
                            <Plus size={14} />
                            Add
                        </button>
                    </div>

                    <div className={styles.linksList} style={{ marginTop: 12 }}>
                        {data.links.map((link) => (
                            <div
                                key={link.id}
                                className={`${styles.linkRow} ${dragId === link.id ? styles.linkRowDragging : ""} ${
                                    dragOverId === link.id ? styles.linkRowDragOver : ""
                                }`}
                                draggable
                                onDragStart={() => setDragId(link.id)}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOverId(link.id);
                                }}
                                onDragLeave={() => setDragOverId((prev) => (prev === link.id ? null : prev))}
                                onDrop={() => handleDrop(link.id)}
                                onDragEnd={() => {
                                    setDragId(null);
                                    setDragOverId(null);
                                }}
                            >
                                <input
                                    className={styles.linkLabelInput}
                                    value={link.label[activeLang]}
                                    onChange={(e) => updateLinkField(link.id, "label", e.target.value)}
                                    onBlur={() => persistLink(link.id)}
                                    placeholder="About us"
                                />
                                <input
                                    className={styles.linkHrefInput}
                                    value={link.href}
                                    onChange={(e) => updateLinkField(link.id, "href", e.target.value)}
                                    onBlur={() => persistLink(link.id)}
                                    placeholder="#about"
                                />
                                <button
                                    type="button"
                                    className={styles.linkDeleteButton}
                                    onClick={() => handleDeleteLink(link.id)}
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