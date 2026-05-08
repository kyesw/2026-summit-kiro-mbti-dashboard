import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mbtiDescriptions, mbtiResults, kiroFeatures, computeTop3FromType } from '../data/mbti';
import { getResults, getMbtiByRole, simulateOne, ALL_TYPES } from '../data/dataService';
import { surveyQuestions } from '../data/survey';
import NightSky from '../components/NightSky';

const ROLE_QUESTION = surveyQuestions.find(q => q.id === 'role');
const ROLE_NAMES = ROLE_QUESTION.options;
const ROLE_COLORS = ROLE_QUESTION.colors;

const MEDALS = ['🥇', '🥈', '🥉'];
const ROTATION_INTERVAL = 10000;

const ROTATION_LABELS = ['전체', ...ROLE_NAMES];

function MbtiRanking({ counts, mbtiByRole }) {
  const [rotationIdx, setRotationIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setRotationIdx(i => (i + 1) % ROTATION_LABELS.length), ROTATION_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const currentLabel = ROTATION_LABELS[rotationIdx];
  const isAll = rotationIdx === 0;
  const roleColorIdx = rotationIdx - 1;

  const displayCounts = useMemo(() => {
    if (isAll) return counts;

    const role = currentLabel;
    return Object.keys(mbtiDescriptions)
      .map(type => {
        const roleData = mbtiByRole[type] || {};
        return { type, count: roleData[role] || 0, ...mbtiDescriptions[type] };
      })
      .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
  }, [counts, mbtiByRole, currentLabel, isAll]);

  const maxCount = displayCounts[0]?.count || 1;

  return (
    <div className="kf-left">
      <div className="kf-rank-subtitle-wrap">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentLabel}
            className="kf-rank-subtitle"
            style={{ color: isAll ? 'rgba(255,255,255,0.5)' : ROLE_COLORS[roleColorIdx] }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {currentLabel}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="kf-ranks">
        <AnimatePresence mode="popLayout">
          {displayCounts.map((c, i) => {
            const pct = maxCount > 0 ? (c.count / maxCount) * 100 : 0;
            const isTop3 = i < 3;
            const barColor = isAll ? null : ROLE_COLORS[roleColorIdx];

            return (
              <motion.div
                key={c.type}
                layout
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.03, ease: [0.25, 0.1, 0.25, 1] }}
                className={`kf-rank-row${isTop3 ? ' kf-rank-top' : ''}`}
              >
                <span className="kf-rank-medal">{MEDALS[i] || `#${i + 1}`}</span>
                <span className={`kf-rank-type${isTop3 ? '' : ' kf-rank-type-sm'}`}>{c.type}</span>
                <div className="kf-rank-bar-track">
                  <motion.div
                    className="kf-rank-bar-stacked"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.03, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ background: isAll ? 'var(--purple)' : barColor }}
                  />
                </div>
                <motion.span
                  className={`kf-rank-count${isTop3 ? '' : ' kf-rank-count-sm'}`}
                  key={`${c.type}-${c.count}`}
                  initial={{ scale: 1.3, color: '#c084fc' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  transition={{ duration: 0.4 }}
                >
                  {c.count}
                </motion.span>
              </motion.div>
            );
          })}
        </AnimatePresence>

      </div>
    </div>
  );
}

function KiroFeaturesPanel() {
  const [idx, setIdx] = useState(0);
  const types = ALL_TYPES;

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % types.length), ROTATION_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const current = types[idx];
  const info = mbtiDescriptions[current];
  const result = mbtiResults[current];
  const top3 = useMemo(() => computeTop3FromType(current), [current]);
  const bestMatch = mbtiResults[result.bestMatch];
  const challengeMatch = mbtiResults[result.challengeMatch];

  return (
    <div className="kiro-panel">
      <div className="kiro-panel-center">

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="kiro-panel-content"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="kiro-panel-hero">
              <div className="kiro-panel-char-glow" style={{ background: `radial-gradient(circle, ${info.color}30 0%, transparent 70%)` }} />
              <img src={`/kiro_characters/${current}.png`} alt={current} className="kiro-panel-char" />
              <span className="kiro-panel-type">{current}</span>
              <span className="kiro-panel-type-title">{result.title}</span>
            </div>


            <div className="kiro-panel-section">
              <h3 className="kiro-panel-section-label">당신에게 맞는 Kiro 기능 Top 3</h3>
              <div className="kiro-panel-features">
                {top3.map((feat, i) => (
                  <div key={feat.id} className="kiro-panel-feat">
                    <span className="kiro-panel-feat-rank">#{i + 1}</span>
                    <img src={feat.icon} alt={feat.name} className="kiro-panel-feat-icon" />
                    <div className="kiro-panel-feat-text">
                      <span className="kiro-panel-feat-name">{feat.name}</span>
                      <p className="kiro-panel-feat-desc">{feat.short}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="kiro-panel-section">
              <h3 className="kiro-panel-section-label">궁합</h3>
              <div className="kiro-panel-compat">
                <div className="kiro-panel-match good">
                  <div className="kiro-panel-match-badge">잘 맞는 조합</div>
                  <div className="kiro-panel-match-head">
                    <img src={`/kiro_characters/${result.bestMatch}.png`} alt={result.bestMatch} className="kiro-panel-match-icon" />
                    <div>
                      <span className="kiro-panel-match-type">{result.bestMatch}</span>
                      <span className="kiro-panel-match-name">{bestMatch?.title}</span>
                    </div>
                  </div>
                </div>
                <div className="kiro-panel-match challenge">
                  <div className="kiro-panel-match-badge">안 맞는 조합</div>
                  <div className="kiro-panel-match-head">
                    <img src={`/kiro_characters/${result.challengeMatch}.png`} alt={result.challengeMatch} className="kiro-panel-match-icon" />
                    <div>
                      <span className="kiro-panel-match-type">{result.challengeMatch}</span>
                      <span className="kiro-panel-match-name">{challengeMatch?.title}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}

export default function MBTICombinedView() {
  const [results, setResults] = useState(getResults());
  const [mbtiByRole, setMbtiByRole] = useState(getMbtiByRole());

  useEffect(() => {
    const update = () => {
      setResults(getResults());
      setMbtiByRole(getMbtiByRole());
    };
    window.addEventListener('mbti-update', update);
    window.addEventListener('storage', update);
    const interval = setInterval(update, 5000);
    const autoInterval = setInterval(simulateOne, 5000);
    return () => {
      window.removeEventListener('mbti-update', update);
      window.removeEventListener('storage', update);
      clearInterval(interval);
      clearInterval(autoInterval);
    };
  }, []);

  const counts = useMemo(() => {
    const map = {};
    results.forEach(r => { map[r.type] = (map[r.type] || 0) + 1; });
    return Object.keys(mbtiDescriptions)
      .map(type => ({ type, count: map[type] || 0, ...mbtiDescriptions[type] }))
      .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
  }, [results]);

  return (
    <div className="kf-view">
      <NightSky />

      <div className="kf-title-bar">
        <div className="kf-title-cell">
          <h1 className="kf-page-title">MBTI 순위</h1>
        </div>
        <div className="kf-title-cell">
          <h1 className="kf-page-title">MBTI별 추천 Kiro 기능</h1>
        </div>
      </div>

      <div className="kf-body">
        <MbtiRanking counts={counts} mbtiByRole={mbtiByRole} />

        <div className="kf-divider" />

        <div className="kf-right">
          <KiroFeaturesPanel />
        </div>
      </div>
    </div>
  );
}
