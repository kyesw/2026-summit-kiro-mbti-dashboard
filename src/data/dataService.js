import { getResults as localGetResults, addResult as localAddResult, mbtiDescriptions } from './mbti';
import {
  seedSampleData,
  getSurveyResults as localGetSurveyResults,
  getQuestionResults as localGetQuestionResults,
  getQuestionResultsByRole as localGetQuestionResultsByRole,
  simulateQuestionResults as localSimulateQuestionResults,
  addRandomSurveyResult as localAddRandomSurveyResult,
  getMbtiByRole as localGetMbtiByRole,
} from './sampleData';

// ── Toggle: set to true to fetch from API, false for localStorage demo ──
export const USE_API = true;

const API_URL = 'https://fhtmrdwnvk.execute-api.ap-northeast-2.amazonaws.com/api/stats';
const POLL_INTERVAL = 5000;

let _cache = null;

async function fetchStats() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    _cache = await res.json();
    window.dispatchEvent(new Event('mbti-update'));
  } catch (e) {
    console.error('API fetch failed:', e);
  }
}

export function initDataSource() {
  if (USE_API) {
    fetchStats();
    setInterval(fetchStats, POLL_INTERVAL);
  } else {
    seedSampleData();
  }
}

export const ALL_TYPES = Object.keys(mbtiDescriptions);

export const ROLES = [
  '개발자/엔지니어', 'PM/기획자', '디자이너',
  '데이터 분석가', '마케터/비즈니스/세일즈', '학생/취준생',
];

export function getResults() {
  if (USE_API) {
    if (!_cache) return [];
    const results = [];
    for (const [type, count] of Object.entries(_cache.mbti)) {
      for (let i = 0; i < count; i++) results.push({ type });
    }
    return results;
  }
  return localGetResults();
}

export function getTotalCount() {
  if (USE_API) return _cache?.total || 0;
  return localGetResults().length;
}

const STYLE_ALIAS = {
  autonomous: '알아서 처리',
  interactive: '자료 검색/요약',
  manual: '아직 안 써봤다',
};

export function getSurveyResults() {
  if (USE_API) {
    const survey = _cache?.survey || {};
    if (survey.ai_style) {
      const fixed = {};
      for (const [k, v] of Object.entries(survey.ai_style)) {
        const mapped = STYLE_ALIAS[k] || k;
        fixed[mapped] = (fixed[mapped] || 0) + v;
      }
      return { ...survey, ai_style: fixed };
    }
    return survey;
  }
  return localGetSurveyResults();
}

export function getQuestionResults() {
  if (USE_API) {
    const raw = _cache?.questions || {};
    const result = {};
    for (const [k, v] of Object.entries(raw)) result[Number(k)] = v;
    return result;
  }
  return localGetQuestionResults();
}

export function getQuestionResultsByRole() {
  if (USE_API) {
    const raw = _cache?.questions_by_role || {};
    const result = {};
    for (const [k, v] of Object.entries(raw)) result[Number(k)] = v;
    return result;
  }
  return localGetQuestionResultsByRole();
}

export function getMbtiByRole() {
  if (USE_API) return _cache?.mbti_by_role || {};
  return localGetMbtiByRole();
}

let _simIdx = 0;
export function simulateOne() {
  if (!USE_API) {
    localAddResult(ALL_TYPES[_simIdx % ALL_TYPES.length]);
    _simIdx++;
  }
}

export function simulateQuestionResults() {
  if (!USE_API) localSimulateQuestionResults();
}

export function addRandomSurveyResult() {
  if (!USE_API) localAddRandomSurveyResult();
}
