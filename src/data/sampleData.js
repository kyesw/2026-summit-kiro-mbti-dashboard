const STORAGE_KEY = 'mbti_expo_results';
const SURVEY_KEY = 'mbti_expo_survey';
const QUESTIONS_KEY = 'mbti_expo_questions';
const QUESTIONS_BY_ROLE_KEY = 'mbti_expo_questions_by_role';
const MBTI_BY_ROLE_KEY = 'mbti_expo_mbti_by_role';

const sampleDistribution = {
  ISTJ: randBetween(40, 90), ISFJ: randBetween(40, 90), INFJ: randBetween(40, 90), INTJ: randBetween(40, 90),
  ISTP: randBetween(40, 90), ISFP: randBetween(40, 90), INFP: randBetween(40, 90), INTP: randBetween(40, 90),
  ESTP: randBetween(40, 90), ESFP: randBetween(40, 90), ENFP: randBetween(40, 90), ENTP: randBetween(40, 90),
  ESTJ: randBetween(40, 90), ESFJ: randBetween(40, 90), ENFJ: randBetween(40, 90), ENTJ: randBetween(40, 90),
};

function randBetween(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

const sampleSurvey = {
  role: { '개발자/엔지니어': randBetween(5, 30), 'PM/기획자': randBetween(5, 30), '디자이너': randBetween(5, 30), '데이터 분석가': randBetween(5, 30), '마케터/비즈니스/세일즈': randBetween(5, 30), '학생/취준생': randBetween(5, 30) },
  ai_usage: { '매일 쓴다': randBetween(5, 30), '주 2~3회': randBetween(5, 30), '가끔': randBetween(5, 30), '거의 안 쓴다': randBetween(5, 30) },
  ai_style: { '문서 작성': randBetween(5, 30), '자료 검색/요약': randBetween(5, 30), '코드 작성': randBetween(5, 30), '아이디어 브레인스토밍': randBetween(5, 30), '번역/외국어': randBetween(5, 30), '아직 안 써봤다': randBetween(5, 30) },
  ai_expect: { '알아서 처리': randBetween(5, 30), '체계적 계획 수립': randBetween(5, 30), '즉각 아이디어 구현': randBetween(5, 30), '반복 작업 자동화': randBetween(5, 30) },
};

export const ROLES = ['개발자/엔지니어', 'PM/기획자', '디자이너', '데이터 분석가', '마케터/비즈니스/세일즈', '학생/취준생'];

function generateQuestionData() {
  const data = {};
  for (let i = 1; i <= 12; i++) {
    data[i] = { a: randBetween(10, 50), b: randBetween(10, 50) };
  }
  return data;
}

function generateQuestionDataByRole() {
  const data = {};
  for (let i = 1; i <= 12; i++) {
    data[i] = {};
    for (const role of ROLES) {
      data[i][role] = { a: randBetween(3, 20), b: randBetween(3, 20) };
    }
  }
  return data;
}

function generateMbtiByRole() {
  const ALL_TYPES = Object.keys(sampleDistribution);
  const data = {};
  for (const type of ALL_TYPES) {
    const total = sampleDistribution[type];
    const splits = ROLES.map(() => randBetween(1, 10));
    const sum = splits.reduce((a, b) => a + b, 0);
    data[type] = {};
    ROLES.forEach((role, i) => {
      data[type][role] = Math.max(1, Math.round((splits[i] / sum) * total));
    });
  }
  return data;
}

export function getMbtiByRole() {
  return JSON.parse(localStorage.getItem(MBTI_BY_ROLE_KEY) || '{}');
}

export function seedSampleData() {
  const results = [];
  const now = Date.now();
  Object.entries(sampleDistribution).forEach(([type, count]) => {
    for (let i = 0; i < count; i++) {
      results.push({ type, timestamp: now - Math.floor(Math.random() * 3600000) });
    }
  });
  for (let i = results.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [results[i], results[j]] = [results[j], results[i]];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  localStorage.setItem(SURVEY_KEY, JSON.stringify(sampleSurvey));
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(generateQuestionData()));
  localStorage.setItem(QUESTIONS_BY_ROLE_KEY, JSON.stringify(generateQuestionDataByRole()));
  localStorage.setItem(MBTI_BY_ROLE_KEY, JSON.stringify(generateMbtiByRole()));
  window.dispatchEvent(new Event('mbti-update'));
  return results.length;
}

export function getSurveyResults() {
  return JSON.parse(localStorage.getItem(SURVEY_KEY) || '{}');
}

export function getQuestionResults() {
  return JSON.parse(localStorage.getItem(QUESTIONS_KEY) || '{}');
}

export function getQuestionResultsByRole() {
  return JSON.parse(localStorage.getItem(QUESTIONS_BY_ROLE_KEY) || '{}');
}

export function simulateQuestionResults() {
  const data = getQuestionResults();
  for (let i = 1; i <= 12; i++) {
    data[i] = { a: randBetween(10, 50), b: randBetween(10, 50) };
  }
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(data));

  const byRole = getQuestionResultsByRole();
  for (let i = 1; i <= 12; i++) {
    if (!byRole[i]) byRole[i] = {};
    for (const role of ROLES) {
      byRole[i][role] = { a: randBetween(3, 20), b: randBetween(3, 20) };
    }
  }
  localStorage.setItem(QUESTIONS_BY_ROLE_KEY, JSON.stringify(byRole));
  window.dispatchEvent(new Event('mbti-update'));
}

export function addRandomSurveyResult() {
  const survey = getSurveyResults();
  const categories = Object.keys(survey);
  if (categories.length === 0) return;
  for (const cat of categories) {
    const options = Object.keys(survey[cat]);
    // Pick a random winner, give it a high value, rest get similar lower values
    const winnerIdx = Math.floor(Math.random() * options.length);
    options.forEach((opt, i) => {
      survey[cat][opt] = i === winnerIdx ? randBetween(25, 40) : randBetween(8, 22);
    });
  }
  localStorage.setItem(SURVEY_KEY, JSON.stringify(survey));
  window.dispatchEvent(new Event('mbti-update'));
}
