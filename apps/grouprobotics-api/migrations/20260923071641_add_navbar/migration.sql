-- CreateTable
CREATE TABLE "navbar_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "navbar_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nav_links" (
    "id" SERIAL NOT NULL,
    "label" JSONB NOT NULL DEFAULT '{}',
    "href" TEXT NOT NULL DEFAULT '#',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nav_links_pkey" PRIMARY KEY ("id")
);
