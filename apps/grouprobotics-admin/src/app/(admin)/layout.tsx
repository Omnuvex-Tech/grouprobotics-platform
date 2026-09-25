import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar/sidebar";
import { SidebarProvider } from "@/components/Sidebar/sidebar-context";
import styles from "./admin-layout.module.css";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <div className={styles.shell}>
                <Sidebar />
                <main className={styles.content}>{children}</main>
            </div>
        </SidebarProvider>
    );
}