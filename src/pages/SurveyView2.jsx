import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getSurveyResults, addRandomSurveyResult } from '../data/dataService';
import { surveyQuestions } from '../data/survey';
import NightSky from '../components/NightSky';

const USAGE_Q = surveyQuestions[1];
const STYLE_Q  = surveyQuestions[2];
const EXPECT_Q = surveyQuestions[3];

function useRanked(data, question) {
  return useMemo(() => {
    const total = question.options.reduce((s, opt) => s + (data[opt] || 0), 0);
    return question.options.map((opt, i) => ({
      label: opt,
      count: data[opt] || 0,
      pct: total > 0 ? Math.round(((data[opt] || 0) / total) * 100) : 0,
      color: question.colors[i],
    })).sort((a, b) => b.pct - a.pct);
  }, [data, question]);
}

/* ── Top row: AI 주요 활용 — Lollipop chart ── */
function StyleLollipop({ data, question }) {
  const items = useRanked(data, question);
  const maxPct = Math.max(...items.map(i => i.pct), 1);
  const BAR_H = 200;

  return (
    <div className="sv2-cell sv2-cell-wide">
      <h2 className="sv2-cell-title">{question.shortLabel}</h2>
      <div className="sv2-lollipop-wrap">
        {items.map((item, i) => {
          const stemH = Math.max((item.pct / maxPct) * BAR_H, 8);
          return (
            <div key={item.label} className="sv2-lollipop-col">
              <motion.span
                className="sv2-lollipop-pct"
                style={{ color: item.color }}
                key={item.pct}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                {item.pct}%
              </motion.span>
              <div className="sv2-lollipop-stem-wrap">
                <motion.div
                  className="sv2-lollipop-circle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.06, type: 'spring', stiffness: 200 }}
                  style={{
                    background: item.color,
                    boxShadow: `0 0 16px ${item.color}90, 0 0 40px ${item.color}40`,
                  }}
                />
                <motion.div
                  className="sv2-lollipop-stem"
                  style={{ background: `linear-gradient(to bottom, ${item.color}cc, ${item.color}22)` }}
                  initial={{ height: 0 }}
                  animate={{ height: stemH }}
                  transition={{ duration: 0.7, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </div>
              <span className="sv2-lollipop-label">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Bottom-left: AI 사용 빈도 — Gauge / Speedometer ── */
const G_W = 280;
const G_H = 160;
const G_CX = G_W / 2;
const G_CY = G_H - 10;
const G_R  = 120;
const G_STROKE = 22;

function gaugeArc(cx, cy, r, startDeg, endDeg) {
  const s = (startDeg * Math.PI) / 180;
  const e = (endDeg   * Math.PI) / 180;
  const x1 = cx + r * Math.cos(Math.PI + s);
  const y1 = cy + r * Math.sin(Math.PI + s);
  const x2 = cx + r * Math.cos(Math.PI + e);
  const y2 = cy + r * Math.sin(Math.PI + e);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

function UsageGauge({ data, question }) {
  const ranked = useRanked(data, question);
  const topItem = ranked[0];

  // Keep original question order for gauge display (매일 → 주2~3 → 가끔 → 안씀)
  const total = ranked.reduce((s, i) => s + i.pct, 0) || 1;
  const items = useMemo(() => {
    return question.options.map((opt, i) => {
      const found = ranked.find(r => r.label === opt);
      return found || { label: opt, pct: 0, color: question.colors[i] };
    });
  }, [ranked, question]);

  let angle = 0;
  const segments = items.map((item) => {
    const sweep = (item.pct / total) * 180;
    const seg = { ...item, start: angle, end: angle + sweep };
    angle += sweep;
    return seg;
  });

  // Needle angle: point to dominant item's midpoint
  const topSeg = segments.find(s => s.label === topItem?.label);
  const needleDeg = topSeg ? (topSeg.start + topSeg.end) / 2 : 90;
  const needleRad = ((180 + needleDeg) * Math.PI) / 180;
  const needleLen = G_R - G_STROKE / 2 - 8;
  const nx = G_CX + needleLen * Math.cos(needleRad);
  const ny = G_CY + needleLen * Math.sin(needleRad);

  return (
    <div className="sv2-cell">
      <h2 className="sv2-cell-title">{question.shortLabel}</h2>
      <div className="sv2-gauge-wrap">
        <svg viewBox={`0 0 ${G_W} ${G_H}`} className="sv2-gauge-svg">
          {/* Track */}
          <path
            d={gaugeArc(G_CX, G_CY, G_R, 0, 180)}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={G_STROKE} strokeLinecap="butt"
          />
          {/* Colored segments */}
          {segments.map((seg) => (
            <motion.path
              key={seg.label}
              d={gaugeArc(G_CX, G_CY, G_R, seg.start + 1, seg.end - 1)}
              fill="none"
              stroke={seg.color}
              strokeWidth={G_STROKE}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ filter: `drop-shadow(0 0 6px ${seg.color}60)` }}
            />
          ))}
          {/* Needle */}
          <motion.line
            x1={G_CX} y1={G_CY}
            x2={nx} y2={ny}
            stroke="#fff" strokeWidth={2.5} strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.6))' }}
          />
          <circle cx={G_CX} cy={G_CY} r={7} fill="#fff" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' }} />
        </svg>

        {/* Legend */}
        <div className="sv2-gauge-legend">
          {items.map((item) => (
            <div key={item.label} className="sv2-gauge-legend-item">
              <span className="sv2-gauge-legend-dot" style={{ background: item.color }} />
              <span className="sv2-gauge-legend-name">{item.label}</span>
              <span className="sv2-gauge-legend-pct" style={{ color: item.color }}>{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const RANK_LABELS = ['1st', '2nd', '3rd', '4th'];

/* ── Bottom-right: AI에 기대하는 것 — Stat cards ── */
function ExpectStatCards({ data, question }) {
  const items = useRanked(data, question);

  return (
    <div className="sv2-cell">
      <h2 className="sv2-cell-title">{question.shortLabel}</h2>
      <div className="sv2-statcards-wrap">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            className={`sv2-statcard${i === 0 ? ' sv2-statcard-top' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              borderColor: i === 0 ? `${item.color}50` : `${item.color}20`,
              background: i === 0
                ? `linear-gradient(135deg, ${item.color}18, ${item.color}08)`
                : `rgba(255,255,255,0.02)`,
              boxShadow: i === 0 ? `0 0 32px ${item.color}20, 0 0 64px ${item.color}10` : 'none',
            }}
          >
            <span className="sv2-statcard-rank" style={{ color: item.color }}>{RANK_LABELS[i]}</span>
            <motion.span
              className="sv2-statcard-pct"
              style={{ color: i === 0 ? item.color : '#fff' }}
              key={item.pct}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {item.pct}%
            </motion.span>
            <span className="sv2-statcard-label">{item.label}</span>
            <div className="sv2-statcard-bar-track">
              <motion.div
                className="sv2-statcard-bar"
                style={{ background: item.color, boxShadow: i === 0 ? `0 0 10px ${item.color}80` : 'none' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: item.pct / 100 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </div>
          </motion.div>
        ))}
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
      <div className="sv2-grid sv2-grid-3">
        <StyleLollipop data={survey.ai_style || {}} question={STYLE_Q} />
        <UsageGauge    data={survey.ai_usage  || {}} question={USAGE_Q} />
        <ExpectStatCards data={survey.ai_expect || {}} question={EXPECT_Q} />
      </div>
    </div>
  );
}
