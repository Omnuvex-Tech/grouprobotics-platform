"use client";

import { ChevronLeft } from "lucide-react";
import { useSidebar } from "./sidebar-context";

export function SidebarToggleButton({ className }: { className?: string }) {
    const { isCollapsed, toggleSidebar } = useSidebar();

    return (
        <button
            type="button"
            className={className}
            onClick={toggleSidebar}
            title={isCollapsed ? "Sidebar-ı aç" : "Sidebar-ı yığ"}
        >
            <ChevronLeft
                size={15}
                style={{
                    transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                }}
            />
        </button>
    );
}