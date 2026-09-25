import { Module } from "@nestjs/common";
import { HealthController } from "./controllers/health.controller";
import { LanguagesController } from "./controllers/languages.controller";
import { TranslationsController } from "./controllers/translations.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ConnectModule } from "./modules/connect/connect.module";
import { ApproachModule } from "./modules/approach/approach.module";
import { ProblemSolutionModule } from "./modules/problem-solution/problem-solution.module";
import { MarketModule } from "./modules/market/market.module";
import { IndustriesModule } from "./modules/industries/industries.module";
import { WhatWeDoModule } from "./modules/what-we-do/what-we-do.module";
import { CapabilitiesModule } from "./modules/capabilities/capabilities.module";
import { PartnersModule } from "./modules/partners/partners.module";
import { NavbarModule } from "./modules/navbar/navbar.module";
import { FooterModule } from "./modules/footer/footer.module";
import { ContactModule } from "./modules/contact/contact.module";


@Module({
    imports: [PrismaModule, AuthModule, ConnectModule, ApproachModule, ProblemSolutionModule, MarketModule, IndustriesModule, 
       WhatWeDoModule, CapabilitiesModule, PartnersModule, NavbarModule, FooterModule, ContactModule],
    controllers: [HealthController, LanguagesController, TranslationsController],
})
export class AppModule {}