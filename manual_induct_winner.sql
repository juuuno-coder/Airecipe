-- Finds the top ranked recipe for the current week and inserts it into Hall of Fame

DO $$
DECLARE
    top_recipe RECORD;
    week_title TEXT;
BEGIN
    -- 1. Find the top recipe from the view
    SELECT * INTO top_recipe
    FROM public.weekly_rankings_view
    ORDER BY score DESC
    LIMIT 1;

    IF top_recipe IS NULL THEN
        RAISE NOTICE 'No recipes found in weekly ranking.';
        RETURN;
    END IF;

    -- 2. Generate Title (e.g., '2024년 12월 3주차 베스트')
    week_title := to_char(now(), 'YYYY') || '년 ' || to_char(now(), 'MM') || '월 ' || to_char(now(), 'W') || '주차 베스트';

    -- 3. Insert into Hall of Fame
    -- Check if already exists
    IF NOT EXISTS (SELECT 1 FROM public.hall_of_fame WHERE recipe_id = top_recipe.recipe_id) THEN
        INSERT INTO public.hall_of_fame (recipe_id, induction_date, award_title)
        VALUES (top_recipe.recipe_id, current_date, week_title);
        
        RAISE NOTICE 'SUCCESS: Inducted recipe "%" (%) into Hall of Fame', top_recipe.title, top_recipe.recipe_id;
    ELSE
        RAISE NOTICE 'SKIPPED: Recipe "%" (%) is already in Hall of Fame', top_recipe.title, top_recipe.recipe_id;
    END IF;
END $$;
