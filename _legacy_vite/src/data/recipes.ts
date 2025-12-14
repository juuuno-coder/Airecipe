export interface Recipe {
  id: string;
  title: string;
  description: string;
  categories: string[];
  aiTools: string[];
  difficulty: '초급' | '중급' | '고급';
  tags: string[];
  prompt: string;
  tips: string[];
  examples?: string[];
  thumbnail: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  views: number;
}

export const recipes: Recipe[] = [
  {
    id: '1',
    title: '마케팅 카피 생성',
    description: '제품이나 서비스를 홍보하는 매력적인 마케팅 문구를 생성합니다.',
    categories: ['마케팅', 'SNS'],
    aiTools: ['ChatGPT', 'Claude'],
    difficulty: '초급',
    tags: ['마케팅', '카피라이팅', 'SNS', '광고'],
    thumbnail: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXRpbmclMjBzdHJhdGVneXxlbnwxfHx8fDE3NjUzNzk2MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    author: {
      name: '마케팅러',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marketing',
    },
    likes: 342,
    views: 1523,
    prompt: `당신은 전문 카피라이터입니다. 다음 제품/서비스에 대한 매력적인 마케팅 카피를 작성해주세요:

제품/서비스: [제품명]
타겟 고객: [타겟 고객층]
핵심 가치: [핵심 메시지]
톤앤매너: [캐주얼/전문적/친근한 등]

다음 형식으로 제공해주세요:
1. 메인 카피 (10-15자)
2. 서브 카피 (20-30자)
3. SNS용 짧은 문구 3개
4. 광고 본문 (50-100자)`,
    tips: [
      '타겟 고객을 구체적으로 명시하면 더 효과적인 카피가 나옵니다',
      '제품의 차별점과 고객이 얻는 혜택을 강조하세요',
      '여러 번 생성하여 가장 마음에 드는 것을 선택하세요',
    ],
    examples: [
      '제품명: 무선 이어폰, 타겟: 2030 직장인, 핵심가치: 노이즈캔슬링',
      '제품명: 온라인 강의, 타겟: 취준생, 핵심가치: 실무 중심',
    ],
  },
  {
    id: '2',
    title: '블로그 SEO 최적화 글쓰기',
    description: '검색 엔진에 최적화된 블로그 포스팅을 작성합니다.',
    categories: ['콘텐츠 제작', 'SEO'],
    aiTools: ['ChatGPT', 'Claude'],
    difficulty: '중급',
    tags: ['SEO', '블로그', '콘텐츠', '글쓰기'],
    thumbnail: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nJTIwd3JpdGluZ3xlbnwxfHx8fDE3NjUzNTQ2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    author: {
      name: '블로거진',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=blogger',
    },
    likes: 289,
    views: 2145,
    prompt: `검색 엔진 최적화(SEO)를 고려한 블로그 글을 작성해주세요.

주제: [글 주제]
타겟 키워드: [메인 키워드]
글 길이: [1000자/2000자 등]

다음 구조로 작성해주세요:
1. 클릭을 유도하는 제목 (H1) - 키워드 포함
2. 도입부 - 독자의 문제 제기
3. 본문 (H2, H3 소제목 활용)
   - 키워드를 자연스럽게 2-3% 밀도로 포함
   - 단락별로 핵심 정보 제공
4. 결론 - 핵심 내용 요약 및 CTA
5. 메타 디스크립션 (150자 이내)`,
    tips: [
      '키워드를 제목, 첫 문단, 소제목에 자연스럽게 포함하세요',
      '가독성을 위해 짧은 문단과 불릿 포인트를 활용하세요',
      '내부 링크를 추가할 만한 위치를 표시해달라고 요청하세요',
    ],
  },
  {
    id: '3',
    title: '데이터 분석 및 시각화',
    description: 'CSV 데이터를 분석하고 인사이트를 추출합니다.',
    categories: ['데이터 분석'],
    aiTools: ['ChatGPT', 'Claude'],
    difficulty: '중급',
    tags: ['데이터분석', '통계', '시각화', '인사이트'],
    thumbnail: 'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzfGVufDF8fHx8MTc2NTQzNTY2OXww&ixlib=rb-4.1.0&q=80&w=1080',
    author: {
      name: '데이터마스터',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=data',
    },
    likes: 567,
    views: 3421,
    prompt: `첨부한 데이터를 분석하고 다음을 제공해주세요:

1. 데이터 개요
   - 총 행/열 수
   - 각 컬럼의 데이터 타입
   - 결측치 현황

2. 기술 통계
   - 주요 변수의 평균, 중앙값, 표준편차
   - 이상치 탐지

3. 시각화
   - 분포도 차트
   - 상관관계 히트맵
   - 시계열 추세 (해당되는 경우)

4. 핵심 인사이트
   - 발견된 주요 패턴
   - 비즈니스 관점의 해석
   - 개선 제안사항`,
    tips: [
      'CSV 파일을 직접 업로드하면 자동으로 분석해줍니다',
      '특정 분석 방법(회귀분석, 군집분석 등)을 명시하면 더 깊이있는 분석이 가능합니다',
      '시각화 스타일(색상, 차트 유형)을 지정할 수 있습니다',
    ],
  },
  {
    id: '4',
    title: '이미지 프롬프트 엔지니어링',
    description: 'DALL-E, Midjourney 등을 위한 효과적인 이미지 생성 프롬프트를 작성합니다.',
    categories: ['이미지 생성', '디자인'],
    aiTools: ['Midjourney', 'DALL-E', 'Stable Diffusion'],
    difficulty: '중급',
    tags: ['이미지생성', '프롬프트', '디자인', '아트'],
    thumbnail: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0fGVufDF8fHx8MTc2NTM4MjE4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    author: {
      name: '아티스트김',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=artist',
    },
    likes: 892,
    views: 4567,
    prompt: `다음 요구사항에 맞는 이미지 생성 프롬프트를 작성해주세요:

원하는 이미지: [설명]
스타일: [사실적/일러스트/애니메이션/유화 등]
분위기: [밝은/어두운/몽환적/역동적 등]
색상 톤: [따뜻한/차가운/파스텔/비비드 등]

프롬프트 형식:
[주요 피사체], [상세 설명], [스타일], [구도], [조명], [색감], [분위기], [품질 키워드]

예시:
A serene mountain landscape at sunset, snow-capped peaks, alpine meadow with wildflowers, golden hour lighting, wide-angle composition, warm color palette, peaceful atmosphere, highly detailed, 4K, photorealistic`,
    tips: [
      '구체적인 디테일을 많이 포함할수록 원하는 결과에 가까워집니다',
      '부정 프롬프트(negative prompt)로 원하지 않는 요소를 제외하세요',
      'Midjourney는 --ar 16:9 같은 파라미터를 프롬프트 끝에 추가하세요',
    ],
  },
  {
    id: '5',
    title: '코드 리뷰 및 최적화',
    description: '작성한 코드를 분석하고 개선점을 제안받습니다.',
    categories: ['개발'],
    aiTools: ['ChatGPT', 'Claude', 'GitHub Copilot'],
    difficulty: '중급',
    tags: ['개발', '코드리뷰', '최적화', '프로그래밍'],
    thumbnail: 'https://images.unsplash.com/photo-1652939617330-e5b59457c496?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RlJTIwcHJvZ3JhbW1pbmd8ZW58MXx8fHwxNzY1MzQxMTAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    author: {
      name: '개발자박',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=developer',
    },
    likes: 734,
    views: 5234,
    prompt: `다음 코드를 리뷰하고 개선점을 제안해주세요:

\`\`\`[언어]
[코드 붙여넣기]
\`\`\`

다음 관점에서 분석해주세요:
1. 코드 품질
   - 가독성 및 코드 스타일
   - 네이밍 컨벤션
   - 주석의 적절성

2. 성능 최적화
   - 시간 복잡도 분석
   - 메모리 사용 효율성
   - 병목 지점 파악

3. 보안
   - 잠재적 보안 취약점
   - 에러 핸들링

4. 모범 사례
   - 해당 언어/프레임워크의 best practice 적용 여부
   - 리팩토링 제안

개선된 코드와 함께 변경 이유를 설명해주세요.`,
    tips: [
      '리뷰받고 싶은 특정 부분이 있다면 명시하세요',
      '사용 중인 프레임워크나 라이브러리 버전을 함께 알려주세요',
      '코드의 컨텍스트(어떤 문제를 해결하는지)를 설명하면 더 나은 피드백을 받습니다',
    ],
  },
  {
    id: '6',
    title: '이메일 자동 작성',
    description: '비즈니스 상황에 맞는 전문적인 이메일을 작성합니다.',
    categories: ['비즈니스', '커뮤니케이션'],
    aiTools: ['ChatGPT', 'Claude', 'Gemini'],
    difficulty: '초급',
    tags: ['이메일', '비즈니스', '커뮤니케이션'],
    thumbnail: 'https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MXx8fHwxNzY1NDI0NTgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    author: {
      name: '비즈니스프로',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=business',
    },
    likes: 421,
    views: 2876,
    prompt: `다음 상황에 맞는 비즈니스 이메일을 작성해주세요:

수신자: [직급/관계]
목적: [문의/제안/감사/사과 등]
핵심 내용: [전달할 메시지]
톤: [격식있는/친근한/중립적]

다음 구조로 작성:
1. 제목 (명확하고 간결하게)
2. 인사말
3. 본문
   - 목적 명시
   - 상세 내용
   - 요청사항 (있는 경우)
4. 맺음말
5. 서명

한국어 비즈니스 이메일 관례를 따라주세요.`,
    tips: [
      '수신자와의 관계를 명확히 하면 적절한 존댓말을 사용합니다',
      '긴급도를 표시하면 제목에 반영됩니다',
      '첨부 파일이 있다면 본문에 언급하도록 요청하세요',
    ],
  },
  {
    id: '7',
    title: '학습 계획 수립',
    description: '새로운 기술이나 주제를 효과적으로 학습하는 맞춤형 계획을 생성합니다.',
    categories: ['교육', '자기계발'],
    aiTools: ['ChatGPT', 'Claude', 'Gemini'],
    difficulty: '초급',
    tags: ['학습', '교육', '계획', '자기계발'],
    thumbnail: 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZ3xlbnwxfHx8fDE3NjUzNTQyMTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    author: {
      name: '학습왕',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=learner',
    },
    likes: 623,
    views: 3892,
    prompt: `다음 주제에 대한 체계적인 학습 계획을 작성해주세요:

학습 주제: [배우고 싶은 것]
현재 수준: [초급/중급/고급]
목표: [달성하고 싶은 것]
사용 가능 시간: [주당 시간]
학습 기간: [예: 3개월]

다음 형식으로 제공:
1. 로드맵 (단계별 학습 경로)
2. 주차별 세부 계획
   - 학습 주제
   - 추천 자료 (책, 강의, 문서 등)
   - 실습 프로젝트
3. 마일스톤 및 체크포인트
4. 추천 도구 및 리소스`,
    tips: [
      '구체적인 목표(예: "React로 포트폴리오 웹사이트 만들기")를 제시하세요',
      '선호하는 학습 방법(영상/책/실습 중심)을 명시하면 맞춤 계획을 받습니다',
      '예산이 있다면 유/무료 자료 비중을 조절할 수 있습니다',
    ],
  },
  {
    id: '8',
    title: '소셜 미디어 콘텐츠 캘린더',
    description: '한 달치 소셜 미디어 게시물 아이디어와 일정을 생성합니다.',
    categories: ['마케팅', 'SNS', '콘텐츠 제작'],
    aiTools: ['ChatGPT', 'Claude'],
    difficulty: '중급',
    tags: ['SNS', '콘텐츠', '마케팅', '기획'],
    thumbnail: 'https://images.unsplash.com/photo-1579869847557-1f67382cc158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzb2NpYWwlMjBtZWRpYXxlbnwxfHx8fDE3NjU0MjEzNDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    author: {
      name: 'SNS마케터',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=social',
    },
    likes: 512,
    views: 3124,
    prompt: `다음 조건에 맞는 소셜 미디어 콘텐츠 캘린더를 작성해주세요:

플랫폼: [인스타그램/페이스북/LinkedIn 등]
브랜드/분야: [업종]
목표: [브랜드 인지도/참여도/판매 등]
게시 빈도: [주 2-3회 등]
기간: [1개월/3개월]

각 게시물에 대해:
1. 날짜 및 시간
2. 콘텐츠 주제
3. 캡션 초안 (해시태그 포함)
4. 콘텐츠 형식 (이미지/비디오/캐러셀 등)
5. CTA (Call To Action)
6. 예상 목표

다양한 콘텐츠 유형(교육/영감/엔터테인먼트/프로모션)을 균형있게 배치해주세요.`,
    tips: [
      '특별 이벤트나 기념일을 미리 알려주면 반영됩니다',
      '기존에 잘 된 콘텐츠 유형을 공유하면 유사한 아이디어를 제안합니다',
      '경쟁사 계정을 참고하라고 요청할 수 있습니다',
    ],
  },
  {
    id: '9',
    title: '회의록 요약 및 액션 아이템 추출',
    description: '회의 내용을 요약하고 후속 조치 사항을 정리합니다.',
    categories: ['비즈니스', '생산성'],
    aiTools: ['ChatGPT', 'Claude', 'Gemini'],
    difficulty: '초급',
    tags: ['회의', '요약', '업무', '생산성'],
    thumbnail: 'https://images.unsplash.com/photo-1573165231977-3f0e27806045?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwbWVldGluZ3xlbnwxfHx8fDE3NjUzNDU2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    author: {
      name: '업무달인',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meeting',
    },
    likes: 456,
    views: 2987,
    prompt: `다음 회의 내용을 요약하고 액션 아이템을 추출해주세요:

[회의 녹취록 또는 노트 붙여넣기]

다음 형식으로 정리:

**회의 정보**
- 일시: [자동 추출]
- 참석자: [자동 추출]
- 주제: [자동 추출]

**논의 내용 요약**
- 주요 논의사항을 3-5개 불릿포인트로 요약

**결정 사항**
- 회의에서 확정된 사항 나열

**액션 아이템**
| 담당자 | 업무 | 마감일 | 우선순위 |
|--------|------|--------|----------|
| [추출] | [추출] | [추출] | [추출] |

**다음 회의**
- 날짜 및 안건 (언급된 경우)`,
    tips: [
      '회의 녹음 파일을 먼저 텍스트로 변환하세요 (Whisper AI 사용 가능)',
      '중요한 결정사항은 하이라이트 표시하도록 요청하세요',
      '부서나 프로젝트별 템플릿을 만들어두면 일관성있게 관리할 수 있습니다',
    ],
  },
  {
    id: '10',
    title: '창의적 스토리텔링',
    description: '소설, 시나리오, 스토리 아이디어를 생성하고 발전시킵니다.',
    categories: ['콘텐츠 제작', '창작'],
    aiTools: ['ChatGPT', 'Claude'],
    difficulty: '중급',
    tags: ['스토리텔링', '창작', '시나리오', '소설'],
    thumbnail: 'https://images.unsplash.com/photo-1617575521317-d2974f3b56d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdyaXRpbmd8ZW58MXx8fHwxNzY1MzUxOTIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    author: {
      name: '작가정',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=writer',
    },
    likes: 789,
    views: 4523,
    prompt: `다음 설정을 바탕으로 창의적인 스토리를 개발해주세요:

장르: [SF/판타지/로맨스/스릴러 등]
배경: [시간 및 공간]
주인공: [간단한 설명]
핵심 갈등: [주요 문제 또는 목표]

다음을 제공해주세요:
1. 3막 구조 개요
   - 1막: 설정 및 사건 발생
   - 2막: 갈등 심화 및 전환점
   - 3막: 클라이맥스 및 해결

2. 주요 캐릭터 프로필 (3-5명)
   - 이름, 성격, 동기, 변화 과정

3. 주요 플롯 포인트 (10-15개)

4. 첫 장면 샘플 (500-1000자)

5. 잠재적 서브플롯 아이디어`,
    tips: [
      '좋아하는 작품을 레퍼런스로 제시하면 톤을 맞출 수 있습니다',
      '캐릭터나 플롯에 대해 "왜?"를 계속 물어보며 깊이를 더하세요',
      '여러 버전을 생성하여 가장 흥미로운 방향을 선택하세요',
    ],
  },
  {
    id: '11',
    title: '프레젠테이션 구성',
    description: '효과적인 프레젠테이션의 구조와 내용을 기획합니다.',
    categories: ['비즈니스', '프레젠테이션'],
    aiTools: ['ChatGPT', 'Claude', 'Gemini'],
    difficulty: '중급',
    tags: ['프레젠테이션', 'PT', '발표', '기획'],
    thumbnail: 'https://images.unsplash.com/photo-1650802218103-6bb0ac6b98eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzZW50YXRpb24lMjBzbGlkZXxlbnwxfHx8fDE3NjU0MzkzMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    author: {
      name: '발표고수',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=presenter',
    },
    likes: 634,
    views: 3765,
    prompt: `다음 프레젠테이션을 위한 슬라이드 구성을 만들어주세요:

주제: [발표 주제]
청중: [청중 특성]
시간: [발표 시간]
목적: [설득/정보전달/교육 등]

각 슬라이드별로:
1. 슬라이드 번호 및 제목
2. 핵심 메시지 (1-2문장)
3. 포함할 내용 (불릿포인트)
4. 시각 자료 제안 (차트/이미지/다이어그램)
5. 발표 노트 (말할 내용)

스토리 플로우가 자연스럽고 설득력있게 구성해주세요.`,
    tips: [
      '슬라이드는 10-15장 내외로 간결하게 유지하세요',
      '데이터가 있다면 함께 제공하여 차트로 시각화하도록 요청하세요',
      '오프닝과 클로징에 특히 신경써달라고 요청하세요',
    ],
  },
  {
    id: '12',
    title: 'FAQ 자동 생성',
    description: '제품이나 서비스에 대한 자주 묻는 질문과 답변을 생성합니다.',
    categories: ['고객 서비스', '문서화'],
    aiTools: ['ChatGPT', 'Claude', 'Gemini'],
    difficulty: '초급',
    tags: ['FAQ', '고객서비스', 'CS', '문서화'],
    thumbnail: 'https://images.unsplash.com/photo-1553775282-20af80779df7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHNlcnZpY2V8ZW58MXx8fHwxNzY1MzcyMzI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    author: {
      name: 'CS매니저',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=support',
    },
    likes: 398,
    views: 2456,
    prompt: `다음 제품/서비스에 대한 FAQ를 작성해주세요:

제품/서비스: [이름 및 설명]
타겟 고객: [주요 사용자층]
주요 기능: [핵심 기능 3-5개]
가격 정책: [간단한 설명]

카테고리별로 구성:
1. 일반 정보
2. 시작하기
3. 주요 기능
4. 결제 및 환불
5. 기술 지원
6. 보안 및 개인정보

각 질문에 대해:
- 고객 관점의 자연스러운 질문
- 명확하고 친절한 답변 (2-3문장)
- 관련 링크나 다음 단계 안내

총 15-20개의 Q&A를 작성해주세요.`,
    tips: [
      '실제 고객 문의 내역이 있다면 참고자료로 제공하세요',
      '경쟁사 FAQ를 분석하여 빠진 내용이 없는지 확인할 수 있습니다',
      '기술 용어는 쉽게 풀어쓰도록 요청하세요',
    ],
  },
];

export const allCategories = [
  '마케팅',
  'SNS',
  '콘텐츠 제작',
  'SEO',
  '데이터 분석',
  '이미지 생성',
  '디자인',
  '개발',
  '비즈니스',
  '커뮤니케이션',
  '교육',
  '자기계발',
  '생산성',
  '창작',
  '프레젠테이션',
  '고객 서비스',
  '문서화',
];

export const aiTools = [
  'ChatGPT',
  'Claude',
  'Gemini',
  'Midjourney',
  'DALL-E',
  'Stable Diffusion',
  'GitHub Copilot',
];
