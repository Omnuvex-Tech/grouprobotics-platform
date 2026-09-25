"use client";

import { useEffect, useRef, useState } from "react";
import {ImagePlus } from "lucide-react";
import { SidebarToggleButton } from "@/components/Sidebar/SidebarToggleButton";
import styles from "./footer.module.css";

type Lang = "az" | "en" | "ru";
type LangValue = Record<Lang, string>;

interface FooterData {
    logo: string | null;
    companyName: LangValue;
    location: LangValue;
    websiteUrl: string;
    phone: string;
    copyrightLine: LangValue;
    tagline: LangValue;
}

const EMPTY_LANG: LangValue = { az: "", en: "", ru: "" };

const LANGS: { code: Lang; label: string }[] = [
    { code: "az", label: "AZ" },
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
];

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function FooterPage() {
    const [data, setData] = useState<FooterData | null>(null);
    const [activeLang, setActiveLang] = useState<Lang>("az");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);

    const logoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch("/api/footer")
            .then((res) => res.json())
            .then((json) => {
                setData({
                    logo: json.logo ?? null,
                    companyName: { ...EMPTY_LANG, ...(json.companyName ?? {}) },
                    location: { ...EMPTY_LANG, ...(json.location ?? {}) },
                    websiteUrl: json.websiteUrl ?? "",
                    phone: json.phone ?? "",
                    copyrightLine: { ...EMPTY_LANG, ...(json.copyrightLine ?? {}) },
                    tagline: { ...EMPTY_LANG, ...(json.tagline ?? {}) },
                });
            });
    }, []);

    if (!data) {
        return <div className={styles.page}>Yüklənir...</div>;
    }

    const updateLangField = (
        field: "companyName" | "location" | "copyrightLine" | "tagline",
        value: string,
    ) => {
        setData((prev) => (prev ? { ...prev, [field]: { ...prev[field], [activeLang]: value } } : prev));
    };

    const updatePlainField = (field: "websiteUrl" | "phone", value: string) => {
        setData((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleUploadLogo = async (file: File) => {
        setIsUploadingLogo(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/footer/upload", { method: "POST", body: formData });
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

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage(null);

        try {
            const res = await fetch("/api/footer", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: data.companyName,
                    location: data.location,
                    websiteUrl: data.websiteUrl,
                    phone: data.phone,
                    copyrightLine: data.copyrightLine,
                    tagline: data.tagline,
                }),
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
                    <h1 className={styles.title}>Footer</h1>
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

            <p className={styles.subtitle}>Site-wide footer</p>

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

                <div className={styles.field}>
                    <label className={styles.label}>Company name</label>
                    <input
                        className={styles.input}
                        value={data.companyName[activeLang]}
                        onChange={(e) => updateLangField("companyName", e.target.value)}
                        placeholder="Group Robotics"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Country / Location name</label>
                    <input
                        className={styles.input}
                        value={data.location[activeLang]}
                        onChange={(e) => updateLangField("location", e.target.value)}
                        placeholder="Azerbaijan"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Website URL</label>
                    <input
                        className={styles.input}
                        value={data.websiteUrl}
                        onChange={(e) => updatePlainField("websiteUrl", e.target.value)}
                        placeholder="grouprobotics.az"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Phone</label>
                    <input
                        className={styles.input}
                        value={data.phone}
                        onChange={(e) => updatePlainField("phone", e.target.value)}
                        placeholder="+994 50 223 47 00"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Copyright line</label>
                    <input
                        className={styles.input}
                        value={data.copyrightLine[activeLang]}
                        onChange={(e) => updateLangField("copyrightLine", e.target.value)}
                        placeholder="© 2026 Group Robotics. All Rights Reserved."
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Tagline</label>
                    <input
                        className={styles.input}
                        value={data.tagline[activeLang]}
                        onChange={(e) => updateLangField("tagline", e.target.value)}
                        placeholder="Robotics Infrastructure for the Real World"
                    />
                </div>
            </div>
        </div>
    );
}