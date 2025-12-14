-- 🚨 중요: 아래 '여기에-UUID를-붙여넣으세요'를
-- 마이페이지 상단에 뜨는 빨간 박스 안의 UUID로 바꿔주세요.
-- 예시: 'df23b6c4-7b1a-4d3e-9f8a-1b2c3d4e5f6g'

UPDATE recipes
SET user_id = '8375d91b-6144-43e9-93ee-be8215d6488c';

-- 프로필도 함께 업데이트
UPDATE profiles
SET id = '8375d91b-6144-43e9-93ee-be8215d6488c'
WHERE id IN (SELECT user_id FROM recipes);
