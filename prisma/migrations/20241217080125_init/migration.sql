-- CreateTable
CREATE TABLE "Class" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "parentId" INTEGER,
    CONSTRAINT "Class_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Class" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "legacyItem" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "effects" TEXT,
    "rarityId" INTEGER NOT NULL,
    "restrictionId" INTEGER NOT NULL,
    "source" TEXT,
    "sourceShort" TEXT,
    CONSTRAINT "Item_rarityId_fkey" FOREIGN KEY ("rarityId") REFERENCES "ItemRarity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Item_restrictionId_fkey" FOREIGN KEY ("restrictionId") REFERENCES "ItemRestriction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemRecipes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "outputId" INTEGER NOT NULL,
    "inputId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "ItemRecipes_inputId_fkey" FOREIGN KEY ("inputId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemRecipes_outputId_fkey" FOREIGN KEY ("outputId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemRestriction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ItemRarity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RestrictionClass" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_RestrictionClass_A_fkey" FOREIGN KEY ("A") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RestrictionClass_B_fkey" FOREIGN KEY ("B") REFERENCES "ItemRestriction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Class_id_key" ON "Class"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Class_name_key" ON "Class"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Item_id_key" ON "Item"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_key" ON "Item"("name");

-- CreateIndex
CREATE INDEX "ItemRecipes_inputId_outputId_idx" ON "ItemRecipes"("inputId", "outputId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemRarity_id_key" ON "ItemRarity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_RestrictionClass_AB_unique" ON "_RestrictionClass"("A", "B");

-- CreateIndex
CREATE INDEX "_RestrictionClass_B_index" ON "_RestrictionClass"("B");
