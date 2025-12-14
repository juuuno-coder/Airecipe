-- Add anonymous flag to recipes table
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE;

-- Force schema cache refresh (optional comment)
COMMENT ON COLUMN recipes.is_anonymous IS 'If true, author name is hidden';
