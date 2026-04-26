export const surveyQuestions = [
  {
    id: 'role',
    label: '현재 하시는 일은?',
    shortLabel: '직군',
    options: ['개발자/엔지니어', 'PM/기획자', '디자이너', '데이터 분석가', '마케터/비즈니스/세일즈', '학생/취준생'],
    colors: ['#6C63FF', '#FF6584', '#1ABC9C', '#FF9800', '#00BCD4', '#FFEB3B'],
  },
  {
    id: 'ai_usage',
    label: 'AI 어시스턴트를 얼마나 쓰시나요?',
    shortLabel: 'AI 사용 빈도',
    options: ['매일 쓴다', '주 2~3회', '가끔', '거의 안 쓴다'],
    colors: ['#6C63FF', '#1ABC9C', '#FF9800', '#FF6584'],
  },
  {
    id: 'ai_style',
    label: 'AI한테 가장 많이 시키는 일은?',
    shortLabel: 'AI 주요 활용',
    options: ['문서 작성', '자료 검색/요약', '코드 작성', '아이디어 브레인스토밍', '번역/외국어', '아직 안 써봤다'],
    colors: ['#4CAF50', '#1ABC9C', '#6C63FF', '#FF9800', '#E91E63', '#607D8B'],
  },
  {
    id: 'ai_expect',
    label: 'AI 도구에 가장 기대하는 것은?',
    shortLabel: 'AI에 기대하는 것',
    options: ['알아서 처리', '체계적 계획 수립', '즉각 아이디어 구현', '반복 작업 자동화'],
    colors: ['#6C63FF', '#FFEB3B', '#1ABC9C', '#FF6584'],
  },
];
