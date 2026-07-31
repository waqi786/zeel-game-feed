ALTER TABLE "User" ADD COLUMN "themePreference" TEXT NOT NULL DEFAULT 'system';
ALTER TABLE "User" ADD COLUMN "xp" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "streakCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "lastLoginAt" DATETIME;

ALTER TABLE "Game" ADD COLUMN "genre" TEXT NOT NULL DEFAULT 'Action';
ALTER TABLE "Game" ADD COLUMN "hotnessScore" REAL NOT NULL DEFAULT 0;

CREATE INDEX "Game_genre_idx" ON "Game"("genre");
CREATE INDEX "Game_hotnessScore_idx" ON "Game"("hotnessScore");

CREATE TABLE "FollowedGenre" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "userId" INTEGER NOT NULL,
  "genreName" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FollowedGenre_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "FollowedGenre_userId_genreName_key" ON "FollowedGenre"("userId", "genreName");
CREATE INDEX "FollowedGenre_genreName_idx" ON "FollowedGenre"("genreName");

CREATE TABLE "Collection" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "uuid" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "userId" INTEGER NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Collection_uuid_key" ON "Collection"("uuid");
CREATE UNIQUE INDEX "Collection_userId_name_key" ON "Collection"("userId", "name");

CREATE TABLE "CollectionGame" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "collectionId" INTEGER NOT NULL,
  "gameId" INTEGER NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CollectionGame_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "CollectionGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "CollectionGame_collectionId_gameId_key" ON "CollectionGame"("collectionId", "gameId");
CREATE INDEX "CollectionGame_gameId_idx" ON "CollectionGame"("gameId");

CREATE TABLE "GamePlay" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "gameId" INTEGER NOT NULL,
  "userId" INTEGER,
  "ip" TEXT,
  "durationSeconds" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GamePlay_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "GamePlay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "GamePlay_gameId_idx" ON "GamePlay"("gameId");
CREATE INDEX "GamePlay_userId_idx" ON "GamePlay"("userId");
CREATE INDEX "GamePlay_createdAt_idx" ON "GamePlay"("createdAt");

CREATE TABLE "Badge" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "Badge_code_key" ON "Badge"("code");

CREATE TABLE "UserBadge" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "userId" INTEGER NOT NULL,
  "badgeId" INTEGER NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON "UserBadge"("userId", "badgeId");
