import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSurveyResults, addRandomSurveyResult } from '../data/dataService';
import { surveyQuestions } from '../data/survey';
import NightSky from '../components/NightSky';

const ROLE_Q = surveyQuestions[0];
const USAGE_Q = surveyQuestions[1];
const STYLE_Q = surveyQuestions[2];
const EXPECT_Q = surveyQuestions[3];

function useRanked(data, question) {
  return useMemo(() => {
    const total = question.options.reduce((s, opt) => s + (data[opt] || 0), 0);
    return question.options.map((opt, i) => ({
      label: opt,
      count: data[opt] || 0,
      pct: total > 0 ? Math.round(((data[opt] || 0) / total) * 100) : 0,
      color: question.colors[i],
    })).sort((a, b) => b.count - a.count);
  }, [data, question]);
}

/* ── Top-left: 직군 — Podium ── */
const PODIUM_ORDER = [1, 0, 2];
const PODIUM_MEDALS = ['🥈', '🥇', '🥉'];
const PODIUM_HEIGHTS = [120, 180, 80];

function RolePodium({ data, question }) {
  const items = useRanked(data, question);
  const top3 = PODIUM_ORDER.map(i => items[i]).filter(Boolean);
  const rest = items.slice(3);

  return (
    <div className="sv2-cell">
      <h2 className="sv2-cell-title">{question.shortLabel}</h2>
      <div className="sv2-podium-wrap">
        <div className="sv2-podium">
          {top3.map((item, pi) => {
            const rank = PODIUM_ORDER[pi];
            return (
              <div key={item.label} className="sv2-podium-slot">
                <span className="sv2-podium-medal">{PODIUM_MEDALS[pi]}</span>
                <span className="sv2-podium-pct" style={{ color: item.color }}>{item.pct}%</span>
                <span className="sv2-podium-name">{item.label}</span>
                <div
                  className="sv2-podium-bar"
                  style={{ background: `linear-gradient(to top, ${item.color}30, ${item.color}10)`, borderColor: `${item.color}40`, height: PODIUM_HEIGHTS[pi] }}
                >
                  <span className="sv2-podium-rank" style={{ color: item.color }}>{rank + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
        {rest.length > 0 && (
          <div className="sv2-podium-rest">
            {rest.map((item, i) => (
              <span key={item.label} className="sv2-podium-rest-item" style={{ color: item.color }}>
                {i + 4}. {item.label} ({item.pct}%)
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Top-right: AI 사용 빈도 — Pie chart (pure SVG) ── */
const PIE_R = 90;
const PIE_CX = 120;
const PIE_CY = 120;

function pieSlicePath(cx, cy, r, startAngle, endAngle) {
  const s = (startAngle - 90) * Math.PI / 180;
  const e = (endAngle - 90) * Math.PI / 180;
  const x1 = cx + r * Math.cos(s);
  const y1 = cy + r * Math.sin(s);
  const x2 = cx + r * Math.cos(e);
  const y2 = cy + r * Math.sin(e);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}

function UsagePie({ data, question }) {
  const items = useRanked(data, question);

  let angle = 0;
  const slices = items.map((item) => {
    const sweep = (item.pct / 100) * 360;
    const slice = { ...item, start: angle, end: angle + sweep };
    angle += sweep;
    return slice;
  });

  return (
    <div className="sv2-cell">
      <h2 className="sv2-cell-title">{question.shortLabel}</h2>
      <div className="sv2-pie-wrap">
        <svg viewBox="0 0 240 240" className="sv2-pie-svg">
          {slices.map((sl, i) => (
            <path
              key={sl.label}
              d={pieSlicePath(PIE_CX, PIE_CY, PIE_R, sl.start, sl.end)}
              fill={`${sl.color}18`}
              stroke={`${sl.color}40`}
              strokeWidth={1}
              style={{ filter: i === 0 ? `drop-shadow(0 0 12px ${sl.color}30)` : 'none' }}
            />
          ))}
        </svg>
        <div className="sv2-pie-legend">
          {items.map((item) => (
            <div key={item.label} className="sv2-pie-item">
              <span className="sv2-pie-dot" style={{ background: item.color }} />
              <span className="sv2-pie-name">{item.label}</span>
              <span className="sv2-pie-pct" style={{ color: item.color }}>{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Bottom-left: 사용 스타일 — Proportional blocks ── */
function StyleBlocks({ data, question }) {
  const items = useRanked(data, question);

  return (
    <div className="sv2-cell">
      <h2 className="sv2-cell-title">{question.shortLabel}</h2>
      <div className="sv2-blocks-wrap">
        <div className="sv2-blocks">
          {items.map((item) => (
            <motion.div
              key={item.label}
              className="sv2-block"
              style={{ background: `${item.color}18`, borderColor: `${item.color}40` }}
              initial={false}
              animate={{ flex: Math.max(item.pct, 5) }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="sv2-block-pct" style={{ color: item.color }}>{item.pct}%</span>
              <span className="sv2-block-label">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Bottom-right: AI에 기대하는 것 — Sized circles ── */
function ExpectCircles({ data, question }) {
  const items = useRanked(data, question);
  const maxPct = Math.max(...items.map(i => i.pct), 1);

  return (
    <div className="sv2-cell">
      <h2 className="sv2-cell-title">{question.shortLabel}</h2>
      <div className="sv2-circles-wrap">
        {items.map((item, i) => {
          const size = 60 + (item.pct / maxPct) * 80;
          return (
            <motion.div
              key={item.label}
              className="sv2-circle"
              initial={false}
              animate={{ width: size, height: size }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                background: `${item.color}15`,
                border: `2px solid ${item.color}40`,
                boxShadow: i === 0 ? `0 0 24px ${item.color}25` : 'none',
              }}
            >
              <span className="sv2-circle-pct" style={{ color: item.color }}>{item.pct}%</span>
              <span className="sv2-circle-label">{item.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function SurveyView2() {
  const [survey, setSurvey] = useState(getSurveyResults());

  useEffect(() => {
    const update = () => setSurvey(getSurveyResults());
    window.addEventListener('mbti-update', update);
    window.addEventListener('storage', update);
    const interval = setInterval(update, 5000);
    const simInterval = setInterval(addRandomSurveyResult, 5000);
    return () => {
      window.removeEventListener('mbti-update', update);
      window.removeEventListener('storage', update);
      clearInterval(interval);
      clearInterval(simInterval);
    };
  }, []);

  return (
    <div className="sv2-view">
      <NightSky />
      <div className="sv2-grid">
        <RolePodium data={survey.role || {}} question={ROLE_Q} />
        <UsagePie data={survey.ai_usage || {}} question={USAGE_Q} />
        <StyleBlocks data={survey.ai_style || {}} question={STYLE_Q} />
        <ExpectCircles data={survey.ai_expect || {}} question={EXPECT_Q} />
      </div>
    </div>
  );
}
