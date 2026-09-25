"use client";

import { useEffect, useRef, useState } from "react";
import {ImageUp, X } from "lucide-react";
import { SidebarToggleButton } from "@/components/Sidebar/SidebarToggleButton";
import styles from "./hero.module.css";

type Lang = "az" | "en" | "ru";
type LangValue = Record<Lang, string>;

interface ConnectData {
    title: LangValue;
    description: LangValue;
    cta: LangValue;
    bgColor: string;
    imageLeft: string | null;
    imageRight: string | null;
}

const EMPTY_LANG: LangValue = { az: "", en: "", ru: "" };

const HERO_COLORS = [
    "#B0D6FF", "#54bb7a", "#3b82f6", "#4f46e5",
    "#8b5cf6", "#a78bfa", "#a3e635", "#d6b98c",
    "#ec4899", "#f87171", "#f97316", "#facc15",
];

const LANGS: { code: Lang; label: string }[] = [
    { code: "az", label: "AZ" },
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
];

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function HeroPage() {
    const [data, setData] = useState<ConnectData | null>(null);
    const [activeLang, setActiveLang] = useState<Lang>("az");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [dragOverSide, setDragOverSide] = useState<"left" | "right" | null>(null);
    const [uploadingSide, setUploadingSide] = useState<"left" | "right" | null>(null);

    const leftInputRef = useRef<HTMLInputElement>(null);
    const rightInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch("/api/connect")
            .then((res) => res.json())
            .then((json) => {
                setData({
                    title: { ...EMPTY_LANG, ...(json.title ?? {}) },
                    description: { ...EMPTY_LANG, ...(json.description ?? {}) },
                    cta: { ...EMPTY_LANG, ...(json.cta ?? {}) },
                    bgColor: json.bgColor ?? HERO_COLORS[0],
                    imageLeft: json.imageLeft ?? null,
                    imageRight: json.imageRight ?? null,
                });
            });
    }, []);

    if (!data) {
        return <div className={styles.page}>Yüklənir...</div>;
    }

    const updateLangField = (field: "title" | "description" | "cta", value: string) => {
        setData((prev) => (prev ? { ...prev, [field]: { ...prev[field], [activeLang]: value } } : prev));
    };

    const handleUpload = async (side: "left" | "right", file: File) => {
        setUploadingSide(side);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/connect/upload", { method: "POST", body: formData });
            const json = await res.json();

            if (!res.ok) {
                setSaveMessage({ type: "error", text: json?.message ?? "Şəkil yüklənmədi" });
                return;
            }

            setData((prev) =>
                prev ? { ...prev, [side === "left" ? "imageLeft" : "imageRight"]: json.url } : prev,
            );
        } catch {
            setSaveMessage({ type: "error", text: "Şəkil yüklənmədi" });
        } finally {
            setUploadingSide(null);
        }
    };

    const handleDrop = (side: "left" | "right") => (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOverSide(null);
        const file = e.dataTransfer.files?.[0];
        if (file) handleUpload(side, file);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage(null);

        try {
            const res = await fetch("/api/connect", {
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

    const renderDropzone = (side: "left" | "right") => {
        const image = side === "left" ? data.imageLeft : data.imageRight;
        const inputRef = side === "left" ? leftInputRef : rightInputRef;
        const isDragOver = dragOverSide === side;
        const isUploading = uploadingSide === side;

        if (image) {
            return (
                <div className={styles.dropzone}>
                    <div className={styles.previewWrapper}>
                        <img src={`${API_ORIGIN}${image}`} alt="" className={styles.previewImage} />
                        <button
                            type="button"
                            className={styles.removePreview}
                            onClick={() =>
                                setData((prev) =>
                                    prev ? { ...prev, [side === "left" ? "imageLeft" : "imageRight"]: null } : prev,
                                )
                            }
                        >
                            <X size={13} />
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div
                className={`${styles.dropzone} ${isDragOver ? styles.dropzoneDragOver : ""}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSide(side);
                }}
                onDragLeave={() => setDragOverSide(null)}
                onDrop={handleDrop(side)}
            >
                <ImageUp size={28} className={styles.dropzoneIcon} />
                <span className={styles.dropzoneTitle}>
                    {isUploading ? "Yüklənir..." : "Drag & drop here"}
                </span>
                <span className={styles.dropzoneHint}>JPEG, PNG, WebP and SVG format, up to 10MB</span>

                <div className={styles.dividerRow}>
                    <span className={styles.dividerLine} />
                    <span className={styles.dividerText}>or</span>
                    <span className={styles.dividerLine} />
                </div>

                <button
                    type="button"
                    className={styles.selectFileButton}
                    disabled={isUploading}
                    onClick={() => inputRef.current?.click()}
                >
                    Select file
                </button>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className={styles.hiddenInput}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(side, file);
                        e.target.value = "";
                    }}
                />
            </div>
        );
    };

    return (
        <div className={styles.page}>
            <div className={styles.headerRow}>
                <div className={styles.headerLeft}>
                    <SidebarToggleButton className={styles.backButton} />
                    <h1 className={styles.title}>Hero</h1>
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

            <p className={styles.subtitle}>Main banner section</p>

            <div className={styles.card}>
                <div>
                    <span className={styles.sectionLabel}>Hero photo (Left and Right)</span>
                    <div className={styles.dropzoneRow}>
                        {renderDropzone("left")}
                        {renderDropzone("right")}
                    </div>
                </div>

                <div>
                    <span className={styles.sectionLabel}>Hero background colors</span>
                    <div className={styles.colorsRow}>
                        {HERO_COLORS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                className={`${styles.colorSwatch} ${
                                    data.bgColor === color ? styles.colorSwatchSelected : ""
                                }`}
                                style={{ background: color }}
                                onClick={() => setData((prev) => (prev ? { ...prev, bgColor: color } : prev))}
                                aria-label={color}
                            />
                        ))}
                    </div>
                </div>

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
                    <label className={styles.label}>Title</label>
                    <input
                        className={styles.input}
                        value={data.title[activeLang]}
                        onChange={(e) => updateLangField("title", e.target.value)}
                        placeholder="Robotics Infrastructure"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Subtitle</label>
                    <textarea
                        className={styles.textarea}
                        value={data.description[activeLang]}
                        onChange={(e) => updateLangField("description", e.target.value)}
                        placeholder="We turn advanced robotics into real-world solutions, from deployment and integration to service and scale"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Button label</label>
                    <input
                        className={styles.input}
                        value={data.cta[activeLang]}
                        onChange={(e) => updateLangField("cta", e.target.value)}
                        placeholder="Talk to Us"
                    />
                </div>
            </div>
        </div>
    );
}