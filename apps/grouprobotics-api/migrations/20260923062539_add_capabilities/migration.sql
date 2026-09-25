-- CreateTable
CREATE TABLE "capabilities_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "badge" JSONB NOT NULL DEFAULT '{}',
    "title" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capabilities_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capability_cards" (
    "id" SERIAL NOT NULL,
    "title" JSONB NOT NULL DEFAULT '{}',
    "description" JSONB NOT NULL DEFAULT '{}',
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capability_cards_pkey" PRIMARY KEY ("id")
);
