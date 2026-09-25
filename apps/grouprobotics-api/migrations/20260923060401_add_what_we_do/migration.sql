-- CreateTable
CREATE TABLE "what_we_do_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "badge" JSONB NOT NULL DEFAULT '{}',
    "title" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "what_we_do_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "what_we_do_items" (
    "id" SERIAL NOT NULL,
    "label" JSONB NOT NULL DEFAULT '{}',
    "description" JSONB NOT NULL DEFAULT '{}',
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "what_we_do_items_pkey" PRIMARY KEY ("id")
);
