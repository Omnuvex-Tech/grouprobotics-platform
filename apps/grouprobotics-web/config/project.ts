import { normalizer } from "@repo/shared/utils";

export const project = {
    url: normalizer.string(process.env.NEXT_PUBLIC_APP_URL),
    name: normalizer.string(process.env.NEXT_PUBLIC_APP_NAME),
    projectName: "Group Robotics",
    projectDescription: "We turn advanced robotics into real-world solutions, from deployment and integration to service and scale",
    keywords: ["robotics"] as string[],
    defLang: "az",
} as const;
