-- 모든 레시피를 현재 로그인한 사용자(juuuno@naver.com)의 소유로 변경합니다.
-- 개발 및 테스트 목적으로, 기존에 작성된 레시피들이 내 목록에 뜨지 않을 때 사용합니다.

UPDATE recipes
SET user_id = (SELECT id FROM auth.users WHERE email = 'juuuno@naver.com' LIMIT 1);

-- 프로필 테이블의 통계 정보 등이 있다면 업데이트 필요할 수 있으나, 현재는 조인으로 가져오므로 불필요.
