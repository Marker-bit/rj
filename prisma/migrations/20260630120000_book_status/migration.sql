-- Ensure the BookStatus enum exists. The baseline migration also creates it,
-- so this is a no-op on a fresh DB but recreates it on the dev DB where it
-- was dropped out-of-band.
DO $$ BEGIN
    CREATE TYPE "BookStatus" AS ENUM ('NONE', 'HIDDEN', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add the status column (also part of the baseline, so IF NOT EXISTS).
ALTER TABLE "Book" ADD COLUMN IF NOT EXISTS "status" "BookStatus" NOT NULL DEFAULT 'NONE';

-- Preserve the isHidden flag by mapping true -> 'HIDDEN'. No-op on a fresh DB
-- where the isHidden column does not exist.
DO $$ BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'Book'
          AND column_name = 'isHidden'
    ) THEN
        UPDATE "Book" SET "status" = 'HIDDEN' WHERE "isHidden" = true;
    END IF;
END $$;

-- Drop the now-redundant isHidden column.
ALTER TABLE "Book" DROP COLUMN IF EXISTS "isHidden";
