-- 1. [관리자 권한] profiles 테이블에 role 컬럼 추가 (기본값: user)
alter table public.profiles 
add column if not exists role text default 'user';

-- 2. [통계 함수] 대시보드용 데이터를 한 번에 가져오는 함수
create or replace function public.get_admin_stats()
returns json
language plpgsql
security definer
as $$
declare
  total_users bigint;
  total_recipes bigint;
  total_views bigint;
  recent_recipes json;
  daily_trends json;
  category_stats json;
begin
  -- A. 전체 카운트 집계
  select count(*) into total_users from public.profiles;
  select count(*) into total_recipes from public.recipes;
  select coalesce(sum(view_count), 0) into total_views from public.recipes;

  -- B. 최근 등록된 레시피 5개
  select json_agg(t) into recent_recipes
  from (
    select r.id, r.title, r.created_at, r.view_count, p.username as author_name
    from public.recipes r
    left join public.profiles p on r.user_id = p.id
    order by r.created_at desc
    limit 5
  ) t;

  -- C. 최근 30일 레시피 등록 추이 (라인 차트용)
  select json_agg(t) into daily_trends
  from (
    select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as date, count(*) as count
    from public.recipes
    where created_at > now() - interval '30 days'
    group by 1
    order by 1
  ) t;

  -- D. 카테고리별 분포 (파이 차트용)
  select json_agg(t) into category_stats
  from (
    select category, count(*) as count
    from public.recipes
    where category is not null
    group by category
    order by count desc
  ) t;

  -- 결과 반환 JSON
  return json_build_object(
    'total_users', total_users,
    'total_recipes', total_recipes,
    'total_views', total_views,
    'recent_recipes', coalesce(recent_recipes, '[]'::json),
    'daily_trends', coalesce(daily_trends, '[]'::json),
    'category_stats', coalesce(category_stats, '[]'::json)
  );
end;
$$;

-- 3. [관리자 지정] 아래 이메일을 본인의 이메일로 바꾸고 실행하세요! (주석 해제 후 실행)
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'user@example.com');
