import { Module } from "@nestjs/common";
import { HealthController } from "./controllers/health.controller";
import { LanguagesController } from "./controllers/languages.controller";
import { TranslationsController } from "./controllers/translations.controller";

@Module({
    controllers: [HealthController, LanguagesController, TranslationsController],
})
export class AppModule {}
