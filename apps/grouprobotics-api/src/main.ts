import "reflect-metadata";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import dotenv from "dotenv";
import { AppModule } from "./app.module";
import { BadRequestException, Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";

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

    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useStaticAssets(resolve(process.cwd(), 'public', 'uploads'), { prefix: '/uploads/' });
        app.enableCors({
        origin: [
            "http://localhost:40010",
            "http://localhost:40020",
        ],
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            exceptionFactory: (errors) => {
               const fieldErrors = errors.reduce(
                    (acc, err) => {
                        const message = Object.values(err.constraints ?? {})[0];
                        if (err.property && message) {
                            acc[err.property] = message;
                        }
                        return acc;
                    },
                    {} as Record<string, string>,
                );

                return new BadRequestException({
                    message: "Validation failed",
                    errors: fieldErrors,
                });
            },
        }),
    );

    await app.listen(port);
    logger.log(`project-api listening on http://localhost:${port}`);
};

bootstrap();
