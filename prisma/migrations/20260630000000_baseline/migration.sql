-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "SharePeople" AS ENUM ('NONE', 'ALL', 'SUBS');

-- CreateEnum
CREATE TYPE "BackgroundColor" AS ENUM ('NONE', 'YELLOW', 'RED', 'BLUE', 'GREEN');

-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('NONE', 'HIDDEN', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "GroupMemberRole" AS ENUM ('CREATOR', 'MODERATOR', 'MEMBER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "hashedPassword" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL DEFAULT '',
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastExport" TIMESTAMP(3),
    "shareFollowers" "SharePeople" NOT NULL DEFAULT 'NONE',
    "shareSubscriptions" "SharePeople" NOT NULL DEFAULT 'NONE',
    "shareStats" "SharePeople" NOT NULL DEFAULT 'NONE',
    "hideActivity" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "aiEnabled" BOOLEAN NOT NULL DEFAULT false,
    "groupId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportQuestion" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDone" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SupportQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportAnswer" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnswerRead" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,

    CONSTRAINT "AnswerRead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "pages" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL DEFAULT '',
    "coverUrl" TEXT,
    "fields" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "background" "BackgroundColor" NOT NULL DEFAULT 'NONE',
    "status" "BookStatus" NOT NULL DEFAULT 'NONE',
    "userId" TEXT NOT NULL,
    "groupBookId" TEXT,
    "fromRecommendationId" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookLink" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "BookLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadEvent" (
    "id" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL,
    "pagesRead" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "ReadEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "firstId" TEXT NOT NULL,
    "secondId" TEXT NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupBookSuggestion" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "coverUrl" TEXT,
    "pages" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "memberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupBookSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupInviteLink" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "GroupInviteLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "showInFeed" BOOLEAN NOT NULL DEFAULT false,
    "role" "GroupMemberRole" NOT NULL,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupBook" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "addedById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "pages" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "coverUrl" TEXT,

    CONSTRAINT "GroupBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListBook" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "pages" INTEGER NOT NULL,
    "coverUrl" TEXT,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "ListBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startsOn" TIMESTAMP(3) NOT NULL,
    "endsOn" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL,
    "slogan" TEXT NOT NULL,
    "bookInfo" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "pages" INTEGER NOT NULL,
    "coverUrl" TEXT,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookToCollection" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BookToCollection_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "_BookToCollection_B_index" ON "_BookToCollection"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportQuestion" ADD CONSTRAINT "SupportQuestion_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportAnswer" ADD CONSTRAINT "SupportAnswer_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportAnswer" ADD CONSTRAINT "SupportAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "SupportQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerRead" ADD CONSTRAINT "AnswerRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerRead" ADD CONSTRAINT "AnswerRead_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "SupportAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_groupBookId_fkey" FOREIGN KEY ("groupBookId") REFERENCES "GroupBook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_fromRecommendationId_fkey" FOREIGN KEY ("fromRecommendationId") REFERENCES "Recommendation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookLink" ADD CONSTRAINT "BookLink_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadEvent" ADD CONSTRAINT "ReadEvent_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_firstId_fkey" FOREIGN KEY ("firstId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_secondId_fkey" FOREIGN KEY ("secondId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupBookSuggestion" ADD CONSTRAINT "GroupBookSuggestion_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupBookSuggestion" ADD CONSTRAINT "GroupBookSuggestion_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "GroupMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupInviteLink" ADD CONSTRAINT "GroupInviteLink_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupInviteLink" ADD CONSTRAINT "GroupInviteLink_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "GroupMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupBook" ADD CONSTRAINT "GroupBook_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupBook" ADD CONSTRAINT "GroupBook_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "GroupMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListBook" ADD CONSTRAINT "ListBook_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToCollection" ADD CONSTRAINT "_BookToCollection_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToCollection" ADD CONSTRAINT "_BookToCollection_B_fkey" FOREIGN KEY ("B") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

