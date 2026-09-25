-- CreateTable
CREATE TABLE "approach" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "badge" JSONB NOT NULL DEFAULT '{}',
    "title" JSONB NOT NULL DEFAULT '{}',
    "paragraph" JSONB NOT NULL DEFAULT '{}',
    "highlight" JSONB NOT NULL DEFAULT '{}',
    "quote" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "approach_pkey" PRIMARY KEY ("id")
);
