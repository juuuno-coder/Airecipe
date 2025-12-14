DO $$
DECLARE
    target_user_id UUID;
    updated_count INTEGER;
BEGIN
    -- 1. 내 이메일로 ID 찾기
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'juuuno@naver.com' LIMIT 1;
    
    -- 2. 사용자를 찾았을 경우 업데이트 진행
    IF target_user_id IS NOT NULL THEN
        -- 모든 레시피를 내 것으로 변경
        UPDATE recipes
        SET user_id = target_user_id;
        
        GET DIAGNOSTICS updated_count = ROW_COUNT;
        
        RAISE NOTICE '성공! 사용자 ID(%) 앞으로 총 %개의 레시피가 연결되었습니다.', target_user_id, updated_count;
    ELSE
        RAISE NOTICE '오류: juuuno@naver.com 이메일을 가진 사용자를 찾을 수 없습니다.';
    END IF;
END $$;
