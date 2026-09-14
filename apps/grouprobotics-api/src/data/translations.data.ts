import type { Translation } from "@repo/types/types";

const now = new Date().toISOString();

export const translations: Translation[] = [
    {
        id: 1,
        key: "projectName",
        locale: "az",
        value: "ProjectName",
        status: "published",
        updated_at: now,
        created_at: now,
    },
    {
        id: 2,
        key: "projectName",
        locale: "en",
        value: "ProjectName",
        status: "published",
        updated_at: now,
        created_at: now,
    },
    {
        id: 3,
        key: "projectName",
        locale: "tr",
        value: "ProjectName",
        status: "published",
        updated_at: now,
        created_at: now,
    },
];
