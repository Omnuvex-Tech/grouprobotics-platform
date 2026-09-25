"use client";

import { useEffect, useRef, useState } from "react";
import { ImageUp, X } from "lucide-react";
import { SidebarToggleButton } from "@/components/Sidebar/SidebarToggleButton";
import styles from "./problem-solution.module.css";

type Lang = "az" | "en" | "ru";
type LangValue = Record<Lang, string>;

interface ProblemSolutionData {
    badge: LangValue;
    headline: LangValue;
    description: LangValue;
    backgroundImage: string | null;
}

const EMPTY_LANG: LangValue = { az: "", en: "", ru: "" };

const LANGS: { code: Lang; label: string }[] = [
    { code: "az", label: "AZ" },
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
];

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function ProblemSolutionPage() {
    const [data, setData] = useState<ProblemSolutionData | null>(null);
    const [activeLang, setActiveLang] = useState<Lang>("az");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch("/api/problem-solution")
            .then((res) => res.json())
            .then((json) => {
                setData({
                    badge: { ...EMPTY_LANG, ...(json.badge ?? {}) },
                    headline: { ...EMPTY_LANG, ...(json.headline ?? {}) },
                    description: { ...EMPTY_LANG, ...(json.description ?? {}) },
                    backgroundImage: json.backgroundImage ?? null,
                });
            });
    }, []);

    if (!data) {
        return <div className={styles.page}>Yüklənir...</div>;
    }

    const updateField = (field: "badge" | "headline" | "description", value: string) => {
        setData((prev) => (prev ? { ...prev, [field]: { ...prev[field], [activeLang]: value } } : prev));
    };

    const handleUpload = async (file: File) => {
        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/problem-solution/upload", { method: "POST", body: formData });
            const json = await res.json();

            if (!res.ok) {
                setSaveMessage({ type: "error", text: json?.message ?? "Şəkil yüklənmədi" });
                return;
            }

            setData((prev) => (prev ? { ...prev, backgroundImage: json.url } : prev));
        } catch {
            setSaveMessage({ type: "error", text: "Şəkil yüklənmədi" });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleUpload(file);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage(null);

        try {
            const res = await fetch("/api/problem-solution", {
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
                    <h1 className={styles.title}>Solution</h1>
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

            <p className={styles.subtitle}>Problem Solution</p>

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
                        placeholder="Contact"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>
                        Headline <span className={styles.labelHint}></span>
                    </label>
                    <textarea
                        className={styles.textarea}
                        value={data.headline[activeLang]}
                        onChange={(e) => updateField("headline", e.target.value)}
                        placeholder={"Tell Us the Problem.\\nWe Will Find the Robotic Solution"}
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

                <div>
                    <span className={styles.sectionLabel}>Background image</span>

                    {data.backgroundImage ? (
                        <div className={styles.dropzone}>
                            <div className={styles.previewWrapper}>
                                <img
                                    src={`${API_ORIGIN}${data.backgroundImage}`}
                                    alt=""
                                    className={styles.previewImage}
                                />
                                <button
                                    type="button"
                                    className={styles.removePreview}
                                    onClick={() =>
                                        setData((prev) => (prev ? { ...prev, backgroundImage: null } : prev))
                                    }
                                >
                                    <X size={13} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={`${styles.dropzone} ${isDragOver ? styles.dropzoneDragOver : ""}`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragOver(true);
                            }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDrop={handleDrop}
                        >
                            <ImageUp size={28} className={styles.dropzoneIcon} />
                            <span className={styles.dropzoneTitle}>
                                {isUploading ? "Yüklənir..." : "Drag & drop here"}
                            </span>
                            <span className={styles.dropzoneHint}>
                                JPEG, PNG, WebP and SVG format, up to 10MB
                            </span>

                            <div className={styles.dividerRow}>
                                <span className={styles.dividerLine} />
                                <span className={styles.dividerText}>or</span>
                                <span className={styles.dividerLine} />
                            </div>

                            <button
                                type="button"
                                className={styles.selectFileButton}
                                disabled={isUploading}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Select file
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                className={styles.hiddenInput}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUpload(file);
                                    e.target.value = "";
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}