import type { ApiResponseBody } from "@repo/types/types";

const ok = <T>(data: T, message: string = "OK"): ApiResponseBody<T> => {
    return {
        success: true,
        message,
        data,
        errors: [],
    };
};

export { ok };
