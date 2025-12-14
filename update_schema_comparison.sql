alter table public.recipes 
add column if not exists before_image_url text, -- For original image
add column if not exists after_image_url text;  -- For result image

-- Also add a column for tags if we are doing smart tagging later
add column if not exists tags text[]; -- Array of strings
