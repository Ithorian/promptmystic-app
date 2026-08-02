-- Add created and updated timestamp columns to products table (if they don't exist)

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'created'
    ) THEN
        ALTER TABLE products 
        ADD COLUMN created timestamptz;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'updated'
    ) THEN
        ALTER TABLE products 
        ADD COLUMN updated timestamptz;
    END IF;
END $$;