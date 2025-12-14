-- recipes 테이블의 보안 검사를 아예 끕니다. (무조건 보여야 함)
ALTER TABLE recipes DISABLE ROW LEVEL SECURITY;

-- users 테이블 등 다른 테이블과의 조인 문제일 수 있으니 profiles도 끕니다.
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 혹시 모르니 캐시도 다시 새로고침
NOTIFY pgrst, 'reload config';
