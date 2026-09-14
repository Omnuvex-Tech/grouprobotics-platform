import type { Language } from "@repo/types/types";

export const languages: Language[] = [
    {
        id: 1,
        name: "Azerbaijani",
        native_name: "Azərbaycanca",
        code: "az",
        is_rtl: false,
        is_default_admin: true,
        is_default_site: true,
        is_required: true,
        sort_order: 1,
    },
    {
        id: 2,
        name: "English",
        native_name: "English",
        code: "en",
        is_rtl: false,
        is_default_admin: false,
        is_default_site: false,
        is_required: true,
        sort_order: 2,
    },
    {
        id: 3,
        name: "Turkish",
        native_name: "Türkçe",
        code: "tr",
        is_rtl: false,
        is_default_admin: false,
        is_default_site: false,
        is_required: false,
        sort_order: 3,
    },
];
