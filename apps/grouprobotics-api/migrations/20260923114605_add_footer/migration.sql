-- CreateTable
CREATE TABLE "footer_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "logo" TEXT,
    "companyName" JSONB NOT NULL DEFAULT '{}',
    "location" JSONB NOT NULL DEFAULT '{}',
    "websiteUrl" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "copyrightLine" JSONB NOT NULL DEFAULT '{}',
    "tagline" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "footer_settings_pkey" PRIMARY KEY ("id")
);
