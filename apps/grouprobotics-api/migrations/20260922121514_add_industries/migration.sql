-- CreateTable
CREATE TABLE "industries_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "badge" JSONB NOT NULL DEFAULT '{}',
    "title" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industries_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry_tags" (
    "id" SERIAL NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '🏭',
    "label" JSONB NOT NULL DEFAULT '{}',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industry_tags_pkey" PRIMARY KEY ("id")
);
