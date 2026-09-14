import { Controller, Get, Headers, Query } from "@nestjs/common";
import type { ApiResponseBody, Translation } from "@repo/types/types";
import { translations } from "../data/translations.data";
import { ok } from "../lib/response";

@Controller()
export class TranslationsController {
    @Get("translations")
    getTranslations(
        @Headers("content-language") headerLocale?: string,
        @Query("locale") queryLocale?: string,
    ): ApiResponseBody<Translation[]> {
        const locale = queryLocale || headerLocale || "az";
        return ok(translations.filter((item) => item.locale === locale));
    }
}
