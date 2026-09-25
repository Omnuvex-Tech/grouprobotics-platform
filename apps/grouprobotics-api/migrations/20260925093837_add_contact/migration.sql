-- CreateTable
CREATE TABLE "contact_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "badge" JSONB NOT NULL DEFAULT '{}',
    "title" JSONB NOT NULL DEFAULT '{}',
    "description" JSONB NOT NULL DEFAULT '{}',
    "nameLabel" JSONB NOT NULL DEFAULT '{}',
    "namePlaceholder" JSONB NOT NULL DEFAULT '{}',
    "phoneLabel" JSONB NOT NULL DEFAULT '{}',
    "phonePlaceholder" JSONB NOT NULL DEFAULT '{}',
    "companyLabel" JSONB NOT NULL DEFAULT '{}',
    "companyPlaceholder" JSONB NOT NULL DEFAULT '{}',
    "emailLabel" JSONB NOT NULL DEFAULT '{}',
    "emailPlaceholder" JSONB NOT NULL DEFAULT '{}',
    "interestLabel" JSONB NOT NULL DEFAULT '{}',
    "interestPlaceholder" JSONB NOT NULL DEFAULT '{}',
    "messageLabel" JSONB NOT NULL DEFAULT '{}',
    "messagePlaceholder" JSONB NOT NULL DEFAULT '{}',
    "sendLabel" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_interest_options" (
    "id" SERIAL NOT NULL,
    "label" JSONB NOT NULL DEFAULT '{}',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_interest_options_pkey" PRIMARY KEY ("id")
);
