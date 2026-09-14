import { Controller, Get } from "@nestjs/common";
import type { ApiResponseBody, Language } from "@repo/types/types";
import { languages } from "../data/languages.data";
import { ok } from "../lib/response";

@Controller()
export class LanguagesController {
    @Get("languages")
    getLanguages(): ApiResponseBody<Language[]> {
        return ok(languages);
    }
}
