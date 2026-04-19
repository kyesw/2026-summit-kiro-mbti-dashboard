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

/* ── Top-left: 직군 — Horizontal ranked bars ── */
function RoleBars({ data, question }) {
  const items = useRanked(data, question);
  const maxPct = Math.max(...items.map(i => i.pct), 1);

  return (
    <div className="sv2-cell">
      <h2 className="sv2-cell-title">{question.shortLabel}</h2>
      <div className="sv2-bars">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              className="sv2-bar-row"
              layout
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="sv2-bar-rank" style={{ color: i === 0 ? item.color : 'var(--muted)' }}>
                {i === 0 ? '👑' : `${i + 1}`}
              </span>
              <span className="sv2-bar-label">{item.label}</span>
              <div className="sv2-bar-track">
                <motion.div
                  className="sv2-bar-fill"
                  style={{ background: item.color }}
                  initial={false}
                  animate={{ width: `${(item.pct / maxPct) * 100}%` }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </div>
              <span className="sv2-bar-pct" style={{ color: item.color }}>{item.pct}%</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Top-right: AI 사용 빈도 — Arc rings ── */
function UsageArcs({ data, question }) {
  const items = useRanked(data, question);
  const r0 = 60;
  const gap = 22;

  return (
    <div className="sv2-cell">
      <h2 className="sv2-cell-title">{question.shortLabel}</h2>
      <div className="sv2-arcs-wrap">
        <svg viewBox="0 0 300 300" className="sv2-arcs-svg">
          {items.map((item, i) => {
            const r = r0 + i * gap;
            const circumference = 2 * Math.PI * r;
            const arcLen = (item.pct / 100) * circumference;
            return (
              <motion.circle
                key={item.label}
                cx="150" cy="150" r={r}
                fill="none"
                stroke={item.color}
                strokeWidth="17"
                strokeLinecap="round"
                strokeDasharray={`${arcLen} ${circumference}`}
                initial={false}
                animate={{ strokeDasharray: `${arcLen} ${circumference}` }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ filter: i === 0 ? `drop-shadow(0 0 6px ${item.color}66)` : 'none' }}
                transform="rotate(-90 150 150)"
              />
            );
          })}
        </svg>
        <div className="sv2-arcs-legend">
          {items.map((item, i) => (
            <div key={item.label} className="sv2-arcs-item">
              <span className="sv2-arcs-dot" style={{ background: item.color }} />
              <span className="sv2-arcs-name">{item.label}</span>
              <span className="sv2-arcs-pct" style={{ color: item.color }}>{item.pct}%</span>
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
        <RoleBars data={survey.role || {}} question={ROLE_Q} />
        <UsageArcs data={survey.ai_usage || {}} question={USAGE_Q} />
        <StyleBlocks data={survey.ai_style || {}} question={STYLE_Q} />
        <ExpectCircles data={survey.ai_expect || {}} question={EXPECT_Q} />
      </div>
    </div>
  );
}
