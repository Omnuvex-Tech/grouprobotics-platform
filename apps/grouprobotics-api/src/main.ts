import "reflect-metadata";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import dotenv from "dotenv";
import { AppModule } from "./app.module";

const bootstrap = async () => {
    const logger = new Logger("Bootstrap");
    const envName = process.env.NODE_ENV === "production" ? "production" : "development";
    const envPath = resolve(process.cwd(), `.env.${envName}`);
    if (existsSync(envPath)) {
        dotenv.config({ path: envPath });
    }

    const portRaw = process.env.PORT;
    if (!portRaw) {
        throw new Error("PORT is required");
    }

    const port = Number(portRaw);
    if (!Number.isFinite(port)) {
        throw new Error("PORT must be a number");
    }

    const app = await NestFactory.create(AppModule);
    await app.listen(port);
    logger.log(`project-api listening on http://localhost:${port}`);
};

bootstrap();
