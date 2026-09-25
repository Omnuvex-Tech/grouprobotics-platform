"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import styles from "./login.module.css";

type FieldErrors = Partial<Record<"email" | "password", string>>;

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({});
        setFormError(null);

        const nextFieldErrors: FieldErrors = {};
        if (!email.trim()) nextFieldErrors.email = "Email boş ola bilməz";
        if (!password.trim()) nextFieldErrors.password = "Şifrə boş ola bilməz";

        if (Object.keys(nextFieldErrors).length > 0) {
            setFieldErrors(nextFieldErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, rememberMe }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data?.errors) {
                    setFieldErrors(data.errors);
                } else {
                    setFormError(data?.message ?? "Email və ya şifrə yanlışdır");
                }
                return;
            }

            router.push("/");
            router.refresh();
        } catch {
            setFormError("Serverə qoşulmaq mümkün olmadı");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <Image
                src="/images/login.png"
                alt=""
                fill
                priority
                className={styles.bgImage}
            />

            <form className={styles.card} onSubmit={handleSubmit} noValidate>
                <h1 className={styles.title}>Welcome to GroupRobotics</h1>

                {formError && <p className={styles.formError}>{formError}</p>}

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="email">
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`${styles.input} ${fieldErrors.email ? styles.inputError : ""}`}
                        placeholder="admin@grouprobotics.az"
                    />
                    {fieldErrors.email && <span className={styles.errorText}>{fieldErrors.email}</span>}
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="password">
                        Password
                    </label>
                    <div className={styles.passwordWrapper}>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`${styles.input} ${fieldErrors.password ? styles.inputError : ""}`}
                            placeholder="••••••••••"
                        />
                        <button
                            type="button"
                            className={styles.eyeButton}
                            onClick={() => setShowPassword((prev) => !prev)}
                            tabIndex={-1}
                            aria-label={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {fieldErrors.password && (
                        <span className={styles.errorText}>{fieldErrors.password}</span>
                    )}
                </div>

                <div className={styles.row}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        Remember me
                    </label>
                    <a className={styles.forgotLink} href="#">
                        Forgot password?
                    </a>
                </div>

                <button className={styles.submit} type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "..." : "Log in"}
                </button>

                <p className={styles.footerText}>Protected by enterprise-grade security</p>
            </form>
        </div>
    );
}