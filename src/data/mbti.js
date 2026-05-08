export const mbtiDescriptions = {
  ISTJ: { emoji: '📋', title: 'The Inspector', desc: '신뢰할 수 있는 실행자. 체계적으로 목표를 달성한다.', color: '#4A90D9' },
  ISFJ: { emoji: '🛡️', title: 'The Protector', desc: '조용한 수호자. 헌신적으로 주변을 돌본다.', color: '#7B68EE' },
  INFJ: { emoji: '🔮', title: 'The Advocate', desc: '통찰력 있는 이상주의자. 의미 있는 변화를 추구한다.', color: '#9B59B6' },
  INTJ: { emoji: '♟️', title: 'The Architect', desc: '전략적 사고가. 독창적 비전으로 시스템을 설계한다.', color: '#2C3E50' },
  ISTP: { emoji: '🔧', title: 'The Craftsman', desc: '냉철한 분석가. 손으로 문제를 해결한다.', color: '#1ABC9C' },
  ISFP: { emoji: '🎨', title: 'The Composer', desc: '조용한 예술가. 자신만의 가치로 세상을 표현한다.', color: '#E91E63' },
  INFP: { emoji: '🌙', title: 'The Mediator', desc: '이상적 몽상가. 내면의 가치에 충실하다.', color: '#8E44AD' },
  INTP: { emoji: '🧪', title: 'The Thinker', desc: '논리적 탐구자. 복잡한 문제에 빠져든다.', color: '#00BCD4' },
  ESTP: { emoji: '🏄', title: 'The Dynamo', desc: '대담한 행동파. 순간을 즐기며 도전한다.', color: '#FF5722' },
  ESFP: { emoji: '🎉', title: 'The Performer', desc: '열정적 엔터테이너. 사람들에게 에너지를 준다.', color: '#FF9800' },
  ENFP: { emoji: '🦋', title: 'The Champion', desc: '자유로운 영혼. 가능성을 발견하고 영감을 준다.', color: '#FFEB3B' },
  ENTP: { emoji: '💡', title: 'The Visionary', desc: '영리한 발명가. 새로운 아이디어로 도전한다.', color: '#4CAF50' },
  ESTJ: { emoji: '👔', title: 'The Supervisor', desc: '결단력 있는 관리자. 질서와 효율을 만든다.', color: '#3F51B5' },
  ESFJ: { emoji: '🤝', title: 'The Provider', desc: '따뜻한 세화가. 조화롭게 사람을 연결한다.', color: '#E91E8C' },
  ENFJ: { emoji: '🌟', title: 'The Teacher', desc: '카리스마 있는 리더. 사람들의 성장을 이끈다.', color: '#FFC107' },
  ENTJ: { emoji: '👑', title: 'The Commander', desc: '대담한 지휘관. 비전을 현실로 만든다.', color: '#F44336' },
};

export const mbtiResults = {
  ISTJ: { emoji: '🏗️', title: '철벽 플래너', subtitle: '계획 없이 시작하는 건 상상도 할 수 없는 타입', description: '당신은 체계와 원칙을 중시하는 신뢰의 아이콘입니다. 프로젝트든 일상이든 철저한 계획 위에서 움직이며, 약속한 건 반드시 지킵니다.', quote: '잠깐, 이 기능 추가하기 전에 — 요구사항 문서 3번이랑 5번 항목 충돌하는 거 저만 보여요? 정리하고 갑시다.', strengths: ['철저한 계획', '높은 신뢰도', '꼼꼼한 검증'], color: '#1e3a5f', bestMatch: 'ENFP', bestMatchComment: '당신의 체계에 창의적 에너지를 불어넣어 줄 파트너', challengeMatch: 'ESTP', challengeMatchComment: '체계 vs 즉흥, 속도감 차이로 자주 부딪힐 수 있어요' },
  ISFJ: { emoji: '🛡️', title: '팀의 수호자', subtitle: '조용히 모두를 챙기는 든든한 존재', description: '당신은 주변 사람들이 편하게 일할 수 있도록 묵묵히 돕는 타입입니다. 회의록도 꼼꼼히, 자료도 다음 사람이 보기 쉽게 정리합니다.', quote: '아, 그거요? 지난주 회의록에 정리해뒀어요. 그리고 신규 입사자분 첫 주 체크리스트도 미리 만들어놨습니다.', strengths: ['팀 케어', '세심한 정리', '안정적 서포트'], color: '#2d5a3f', bestMatch: 'ENTP', bestMatchComment: '아이디어 폭발하는 동료의 든든한 실행 파트너', challengeMatch: 'ENTJ', challengeMatchComment: '추진력 강한 리더십에 치이기 쉬워요, 소통이 핵심!' },
  INFJ: { emoji: '🔮', title: '비전 설계자', subtitle: '큰 그림을 보는 조용한 전략가', description: '당신은 방향성과 비전을 먼저 생각하는 타입입니다. 하나의 결정에도 의미를 담고, 사용자와 고객의 경험을 깊이 고민합니다.', quote: '잠깐, 이 기능 왜 만들어요? 사용자가 진짜 원하는 게 이건지 인터뷰 결과 다시 한번 볼게요.', strengths: ['깊은 통찰', '사용자 공감', '의미 중심 사고'], color: '#4a2d6f', bestMatch: 'ENTP', bestMatchComment: '비전을 현실로 만들어줄 창의적 실행가', challengeMatch: 'ESTP', challengeMatchComment: '깊은 고민 vs 일단 실행, 페이스가 너무 달라 답답할 수 있어요' },
  INTJ: { emoji: '🧠', title: '마스터마인드', subtitle: '완벽한 전략을 설계하는 두뇌 플레이어', description: '당신은 최적의 구조와 전략을 설계하는 데 열정을 쏟는 타입입니다. 모든 결정에는 논리적 근거가 있어야 합니다.', quote: '이 방식으로 가면 6개월 뒤에 분명 갈아엎어요. 지금 이틀 더 쓰더라도 확장 가능한 구조로 갑시다.', strengths: ['전략적 사고', '효율 최적화', '논리적 리더십'], color: '#1a1a4e', bestMatch: 'ENFP', bestMatchComment: '전략에 열정을 더해줄 최고의 브레인스토밍 파트너', challengeMatch: 'ESFP', challengeMatchComment: '계획적인 전략가 vs 즉흥적 에너자이저, 충돌이 잦아요' },
  ISTP: { emoji: '🔧', title: '문제 해결 장인', subtitle: '복잡한 문제의 핵심을 꿰뚫는 해결사', description: '당신은 문제를 깊이 파고들어 해결하는 타입입니다. 복잡한 상황 앞에서 오히려 눈이 빛나고, 하나씩 원인을 좁혀가는 과정을 즐깁니다.', quote: '다들 이것저것 의심하는데, 저는 화요일 이후 수치만 보면 답 나와요. 여기가 원인입니다.', strengths: ['문제 해결력', '깊은 분석', '실용적 접근'], color: '#3d2b1f', bestMatch: 'ENFJ', bestMatchComment: '분석적 깊이와 사람 중심 리더십의 완벽한 조합', challengeMatch: 'ENFP', challengeMatchComment: '혼자 집중하고 싶은데 에너지 폭발에 지칠 수 있어요' },
  ISFP: { emoji: '🎨', title: '감성 크리에이터', subtitle: '디테일에 감성을 담는 아티스트', description: '당신은 결과물에도 미적 감각이 필요하다고 믿는 타입입니다. 발표 자료 하나도 예쁘게, 디자인도 감성적으로.', quote: '이 발표자료 표지 색감이 미묘하게 안 맞아서요... 제가 3가지 버전 만들어봤는데 같이 골라주실래요?', strengths: ['감성적 디테일', '심미적 완성도', '창의적 해결'], color: '#5a2d4f', bestMatch: 'ENTJ', bestMatchComment: '비전을 실현할 때 감성적 디테일을 채워주는 관계', challengeMatch: 'INTP', challengeMatchComment: '감성적 접근 vs 논리적 분석, 대화가 자꾸 엇갈려요' },
  INFP: { emoji: '🚀', title: '이상주의 메이커', subtitle: '세상에 의미 있는 변화를 꿈꾸는 사람', description: '당신은 일을 통해 세상에 의미 있는 변화를 만들고 싶은 타입입니다. 새로운 아이디어가 항상 넘치고, 사람들의 감정에 공감합니다.', quote: '새벽에 문득 생각났는데, 이 기능 하나 추가하면 매일 반복 작업하는 사람들이 30분씩 아끼거든요. 꼭 넣고 싶어요.', strengths: ['아이디어 발상', '깊은 공감', '끈기 있는 몰입'], color: '#2d4a6f', bestMatch: 'ENFJ', bestMatchComment: '이상을 함께 실현해줄 영감 넘치는 리더', challengeMatch: 'ESTJ', challengeMatchComment: '자유로운 영혼에게 프로세스 강요는 스트레스 그 자체예요' },
  INTP: { emoji: '🧪', title: '원리 탐구자', subtitle: "'왜?'를 멈출 수 없는 분석가", description: "당신은 '왜?'라는 질문을 멈출 수 없는 타입입니다. 단순히 결과만이 아니라 원리와 구조를 이해해야 직성이 풀립니다.", quote: '이 AI가 추천한 결과가 왜 이렇게 나왔는지 모르면 믿고 쓸 수가 없잖아요. 내부 로직 논문 하나 찾아놨는데 같이 볼래요?', strengths: ['본질 파악', '논리적 분석', '혁신적 사고'], color: '#1f3d5a', bestMatch: 'ENTJ', bestMatchComment: '분석력과 실행력의 드림팀', challengeMatch: 'ESFJ', challengeMatchComment: '혼자 몰입하고 싶은데 자꾸 케어해주려 해서 부담스러워요' },
  ESTP: { emoji: '⚡', title: '현장 돌파러', subtitle: '위기 상황에서 빛나는 행동파', description: "당신은 긴급 상황에서 진가를 발휘하는 타입입니다. '일단 해보자!' 마인드로 빠르게 움직이고, 예상치 못한 문제도 두렵지 않습니다.", quote: '서버 터졌어요? 제가 일단 수동으로 복구해놓을 테니 원인 분석은 내일 아침에 합시다. 지금은 살리는 게 먼저예요.', strengths: ['빠른 실행력', '위기 대처', '현장 감각'], color: '#5a1a1a', bestMatch: 'INFJ', bestMatchComment: '빠른 실행에 깊은 통찰을 더해줄 파트너', challengeMatch: 'INFP', challengeMatchComment: '빠른 실행 vs 깊은 고민, 템포 차이가 답답함을 유발해요' },
  ESFP: { emoji: '🎉', title: '분위기 메이커', subtitle: '어디서든 에너지를 만들어내는 무드 부스터', description: '당신은 에너지 넘치는 타입입니다. 새로운 도구를 써보는 것 자체가 즐겁고, 결과물을 빠르게 만들어 보여주는 걸 좋아합니다.', quote: '어제 저녁에 갑자기 영감 와서 새벽까지 프로토타입 만들었어요! 디테일은 좀 부족한데 일단 데모 한번 볼래요?', strengths: ['빠른 실행', '팀 에너지', '창의적 활용'], color: '#6f4a2d', bestMatch: 'INTJ', bestMatchComment: '에너지와 전략이 만나면 최고의 결과물이 나와요', challengeMatch: 'ISTJ', challengeMatchComment: '자유분방함 vs 철저한 규칙, 서로 갑갑하게 느껴져요' },
  ENFP: { emoji: '📢', title: '열정 전파자', subtitle: '좋은 건 못 참고 나누는 에너지 뱀파이어', description: '당신은 새로운 것을 발견하면 흥분을 감추지 못하는 타입입니다. 발표, 공유, 스터디까지 열정적으로 전파합니다.', quote: '팀 슬랙에 새벽 2시에 올린 글이 반응 30개 넘었어요 ㅋㅋ 아니 진짜 이 도구 안 써본 사람은 있어도 한 번만 써본 사람은 없거든요?!', strengths: ['열정적 공유', '커뮤니티 활동', '트렌드 리딩'], color: '#4a6f2d', bestMatch: 'INTJ', bestMatchComment: '열정을 전략적으로 실현해줄 완벽한 파트너', challengeMatch: 'ISTP', challengeMatchComment: '열정적으로 공유하고 싶은데 반응이 없으면 김 빠져요' },
  ENTP: { emoji: '💡', title: '아이디어 뱅크', subtitle: '매일 새로운 가능성을 발견하는 혁신가', description: "당신은 '이거 해보면 재밌겠다'가 입버릇인 타입입니다. 아이디어가 꼬리에 꼬리를 물고, 새 도구마다 새로운 실험을 시작합니다.", quote: '회의 중에 갑자기 생각났는데요, 이 기능이랑 저번에 얘기한 그거 합치면 완전 새로운 서비스 되지 않아요?', strengths: ['아이디어 발산', '빠른 학습', '혁신적 실험'], color: '#2d6f4a', bestMatch: 'INFJ', bestMatchComment: '아이디어에 방향성과 의미를 더해줄 비전 파트너', challengeMatch: 'ISFJ', challengeMatchComment: '아이디어 폭주 vs 안정 추구, 방향이 자꾸 안 맞아요' },
  ESTJ: { emoji: '👔', title: '프로젝트 사령관', subtitle: '체계적으로 팀을 이끄는 실행형 리더', description: '당신은 프로젝트를 체계적으로 관리하고 팀을 이끄는 타입입니다. 일정, 품질, 프로세스까지 빈틈없이 챙깁니다.', quote: '금요일 오후 3시까지 리뷰 안 끝나면 다음 주 릴리즈 일정 밀려요. 지금 진행 상황 각자 스레드에 업데이트해주세요.', strengths: ['프로젝트 관리', '팀 리딩', '프로세스 최적화'], color: '#1a3d5a', bestMatch: 'ISTP', bestMatchComment: '체계적 관리와 깊은 분석력의 황금 조합', challengeMatch: 'INFP', challengeMatchComment: '효율 중시 vs 의미 중시, 우선순위가 계속 충돌해요' },
  ESFJ: { emoji: '🤝', title: '팀 빌더', subtitle: '모두를 연결하는 따뜻한 조직의 중심', description: '당신은 새로운 사람이 오면 가장 먼저 다가가는 타입입니다. 함께 일하는 것을 좋아하고, 모두가 편한 환경을 만드는 데 진심입니다.', quote: '새로 오신 분 점심 같이 하실래요? 아, 그리고 이거 제가 만든 팀 위키인데 처음에 이것만 보면 금방 적응하실 거예요!', strengths: ['팀 빌딩', '협업 문화', '분위기 조성'], color: '#3d5a1a', bestMatch: 'ISTP', bestMatchComment: '따뜻한 케어와 묵직한 실력의 든든한 조합', challengeMatch: 'INTP', challengeMatchComment: '따뜻하게 다가가도 혼자 있고 싶어하면 서운해요' },
  ENFJ: { emoji: '🌟', title: '비전 리더', subtitle: '사람과 목표를 모두 아우르는 리더', description: '당신은 비전 제시와 팀 관리를 동시에 해내는 타입입니다. 사람들에게 영감을 주고, 도구는 사람을 위해 존재해야 한다고 믿습니다.', quote: '이 도구 도입하려면 모두가 쓸 수 있어야 의미 있어요. 다음 주에 제가 워크숍 열 테니 30분만 시간 내주실 수 있나요?', strengths: ['비전 제시', '팀 영감', '포용적 리더십'], color: '#4a2d2d', bestMatch: 'INFP', bestMatchComment: '비전과 이상을 함께 실현할 영혼의 팀메이트', challengeMatch: 'ISTP', challengeMatchComment: '함께 나아가고 싶은데 혼자 파고드니 리딩이 어려워요' },
  ENTJ: { emoji: '👑', title: '총괄 지휘관', subtitle: '비전과 실행력을 겸비한 리더', description: '당신은 비전을 세우고 사람들을 모아 실현하는 타입입니다. 결정도 빠르고, 새 도구의 가치를 바로 파악합니다.', quote: '회의 길어지니까 정리할게요. A안으로 갑시다. 목요일까지 PoC 나오면 진행, 안 나오면 B안으로 피벗합니다. 이의 없죠?', strengths: ['전략 수립', '빠른 의사결정', '강한 실행력'], color: '#2d1a4a', bestMatch: 'INTP', bestMatchComment: '실행력과 분석력의 완벽한 콤비', challengeMatch: 'ISFP', challengeMatchComment: '빠른 결단 vs 신중한 감성, 의사결정 스타일이 정반대예요' },
};

export function scoreMbti(answers) {
  const dims = { EI: 0, SN: 0, TF: 0, JP: 0 };
  answers.forEach(({ dim, value }) => { dims[dim] += value === 'a' ? 1 : -1; });
  return (
    (dims.EI >= 0 ? 'E' : 'I') +
    (dims.SN >= 0 ? 'S' : 'N') +
    (dims.TF >= 0 ? 'T' : 'F') +
    (dims.JP >= 0 ? 'J' : 'P')
  );
}

// localStorage-backed results store
const STORAGE_KEY = 'mbti_expo_results';

export function getResults() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function addResult(type) {
  const results = getResults();
  results.push({ type, timestamp: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  window.dispatchEvent(new Event('mbti-update'));
}

export function clearResults() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('mbti-update'));
}

// Kiro features matched to MBTI types
export const kiroFeatures = {
  steering: { id: 'steering', emoji: '📏', icon: '/kiro_functions/hero-img-15.png', name: 'Steering', short: 'AI가 따르는 프로젝트 규칙 설정', description: '프로젝트의 기술 스택, 코딩 컨벤션, 아키텍처 규칙을 마크다운 파일로 정의하면, AI가 모든 대화에서 자동으로 따릅니다.' },
  powers:   { id: 'powers',   emoji: '⚡', icon: '/kiro_functions/hero-img-2.png', name: 'Powers',   short: '외부 도구와 AI 연결', description: 'Stripe, Supabase, Figma 등 외부 도구를 MCP 프로토콜로 연결하고, 필요한 순간에만 동적으로 로딩합니다.' },
  agent:    { id: 'agent',    emoji: '🤖', icon: '/kiro_functions/hero-img-4.png', name: 'Autonomous Agent', short: '자율 실행 AI 에이전트', description: '복잡한 작업을 격리된 샌드박스에서 비동기로 실행하고, 완료되면 PR까지 자동 생성합니다.' },
  specs:    { id: 'specs',    emoji: '📐', icon: '/kiro_functions/hero-img-9.png', name: 'Specs',     short: '자연어 → 설계 → 태스크 자동 분해', description: '자연어 한 줄이 요구사항 → 기술 설계 → 실행 가능한 태스크로 자동 분해됩니다.' },
  vibe:     { id: 'vibe',     emoji: '🎨', icon: '/kiro_functions/hero-img-3.png', name: 'Vibe Coding', short: '대화로 빠른 프로토타이핑', description: '아이디어가 떠오르면 자연어로 대화하듯 코드를 만들어보세요. 빠르게 프로토타이핑할 수 있습니다.' },
  hooks:    { id: 'hooks',    emoji: '🔄', icon: '/kiro_functions/hero-img-1.png', name: 'Hooks',     short: '이벤트 기반 자동화 트리거', description: '파일 저장, 태스크 완료 등 IDE 이벤트에 자동으로 반응하여 테스트 생성, 보안 스캔, 문서 업데이트를 실행합니다.' },
};

const mbtiWeights = {
  E: { powers: 2, steering: 1 },
  I: { agent: 2, hooks: 1 },
  S: { specs: 2, steering: 1 },
  N: { vibe: 2, powers: 1 },
  T: { hooks: 2, steering: 1 },
  F: { steering: 2, powers: 1 },
  J: { specs: 2, hooks: 1 },
  P: { vibe: 2, agent: 1 },
};

export function computeTop3FromType(type) {
  const scores = { steering: 0, powers: 0, agent: 0, specs: 0, vibe: 0, hooks: 0 };
  for (const letter of type) {
    const weights = mbtiWeights[letter];
    if (weights) {
      for (const [feat, w] of Object.entries(weights)) {
        scores[feat] += w;
      }
    }
  }
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id]) => kiroFeatures[id]);
}
