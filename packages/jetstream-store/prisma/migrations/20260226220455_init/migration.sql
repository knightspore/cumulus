-- CreateTable
CREATE TABLE "Market" (
    "uri" TEXT NOT NULL PRIMARY KEY,
    "did" TEXT NOT NULL,
    "rkey" TEXT NOT NULL,
    "cid" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "liquidity" INTEGER NOT NULL,
    "closesAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "indexedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "record" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Bet" (
    "uri" TEXT NOT NULL PRIMARY KEY,
    "did" TEXT NOT NULL,
    "rkey" TEXT NOT NULL,
    "cid" TEXT NOT NULL,
    "marketUri" TEXT NOT NULL,
    "marketCid" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "indexedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "record" TEXT NOT NULL,
    CONSTRAINT "Bet_marketUri_fkey" FOREIGN KEY ("marketUri") REFERENCES "Market" ("uri") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Resolution" (
    "uri" TEXT NOT NULL PRIMARY KEY,
    "did" TEXT NOT NULL,
    "rkey" TEXT NOT NULL,
    "cid" TEXT NOT NULL,
    "marketUri" TEXT NOT NULL,
    "marketCid" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "indexedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "record" TEXT NOT NULL,
    CONSTRAINT "Resolution_marketUri_fkey" FOREIGN KEY ("marketUri") REFERENCES "Market" ("uri") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Market_did_idx" ON "Market"("did");

-- CreateIndex
CREATE INDEX "Market_closesAt_idx" ON "Market"("closesAt");

-- CreateIndex
CREATE INDEX "Bet_did_idx" ON "Bet"("did");

-- CreateIndex
CREATE INDEX "Bet_marketUri_idx" ON "Bet"("marketUri");

-- CreateIndex
CREATE INDEX "Resolution_did_idx" ON "Resolution"("did");

-- CreateIndex
CREATE INDEX "Resolution_marketUri_idx" ON "Resolution"("marketUri");
