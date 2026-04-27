import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mbtiDescriptions, kiroFeatures } from '../data/mbti';
import { getResults, getMbtiByRole, simulateOne } from '../data/dataService';
import { surveyQuestions } from '../data/survey';
import NightSky from '../components/NightSky';

const ROLE_QUESTION = surveyQuestions.find(q => q.id === 'role');
const ROLE_NAMES = ROLE_QUESTION.options;
const ROLE_COLORS = ROLE_QUESTION.colors;

const MEDALS = ['🥇', '🥈', '🥉'];

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

function computeAggregateFeatureScores(results) {
  const scores = { steering: 0, powers: 0, agent: 0, specs: 0, vibe: 0, hooks: 0 };
  const typeCounts = {};

  results.forEach(r => {
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
  });

  for (const [type, count] of Object.entries(typeCounts)) {
    for (const letter of type) {
      const weights = mbtiWeights[letter];
      if (weights) {
        for (const [feat, w] of Object.entries(weights)) {
          scores[feat] += w * count;
        }
      }
    }
  }

  return Object.entries(scores)
    .map(([id, score]) => ({ ...kiroFeatures[id], score }))
    .sort((a, b) => b.score - a.score);
}

function MbtiRanking({ counts, mbtiByRole }) {
  const maxCount = counts[0]?.count || 1;

  return (
    <div className="kf-left">
      <div className="kf-left-header">
        <h1 className="mbubble-section-title">MBTI 순위</h1>
      </div>
      <div className="kf-ranks">
        <AnimatePresence mode="popLayout">
          {counts.map((c, i) => {
            const pct = maxCount > 0 ? (c.count / maxCount) * 100 : 0;
            const isTop3 = i < 3;
            const roleData = mbtiByRole[c.type] || {};
            const roleTotal = ROLE_NAMES.reduce((sum, r) => sum + (roleData[r] || 0), 0) || 1;

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
                <img
                  src={`/kiro_characters/${c.type}.png`}
                  alt={c.type}
                  className={`kf-rank-char${isTop3 ? '' : ' kf-rank-char-sm'}`}
                />
                <span className={`kf-rank-type${isTop3 ? '' : ' kf-rank-type-sm'}`}>{c.type}</span>
                <div className="kf-rank-bar-track">
                  <motion.div
                    className="kf-rank-bar-stacked"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.03, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    {ROLE_NAMES.map((role, ri) => {
                      const rolePct = ((roleData[role] || 0) / roleTotal) * 100;
                      return (
                        <div
                          key={role}
                          className="kf-rank-bar-segment"
                          style={{
                            width: `${rolePct}%`,
                            background: ROLE_COLORS[ri],
                          }}
                        />
                      );
                    })}
                  </motion.div>
                </div>
                <motion.span
                  className={`kf-rank-count${isTop3 ? '' : ' kf-rank-count-sm'}`}
                  key={c.count}
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

        <div className="kf-rank-legend">
          {ROLE_NAMES.map((role, i) => (
            <div key={role} className="kf-rank-legend-item">
              <span className="kf-rank-legend-dot" style={{ background: ROLE_COLORS[i] }} />
              <span className="kf-rank-legend-label">{role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopKiroPanel({ results }) {
  const ranked = useMemo(() => computeAggregateFeatureScores(results), [results]);
  const maxScore = ranked[0]?.score || 1;
  const totalParticipants = results.length;

  return (
    <div className="kf-panel">
      <h2 className="kf-panel-title">참가자 기반 Kiro 기능 TOP 3</h2>
      <p className="kf-panel-subtitle">
        총 <span className="kf-panel-count">{totalParticipants}</span>명의 MBTI 결과를 기반으로 산출
      </p>

      <div className="kf-panel-list">
        <AnimatePresence mode="popLayout">
          {ranked.map((feat, i) => {
            const isTop3 = i < 3;
            const pct = maxScore > 0 ? (feat.score / maxScore) * 100 : 0;

            return (
              <motion.div
                key={feat.id}
                layout
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                className={`kf-feat${isTop3 ? ' kf-feat-top' : ''}`}
              >
                <div className="kf-feat-header">
                  <div className="kf-feat-left">
                    {isTop3 && (
                      <span className={`kf-feat-medal kf-medal-${i + 1}`}>
                        {MEDALS[i]}
                      </span>
                    )}
                    {!isTop3 && <span className="kf-feat-rank">#{i + 1}</span>}
                    <span className="kf-feat-emoji">{feat.emoji}</span>
                    <span className={`kf-feat-name${isTop3 ? ' kf-feat-name-top' : ''}`}>{feat.name}</span>
                  </div>
                  <span className={`kf-feat-score${isTop3 ? ' kf-feat-score-top' : ''}`}>
                    {feat.score}
                  </span>
                </div>

                <div className="kf-feat-bar-track">
                  <motion.div
                    className={`kf-feat-bar-fill${isTop3 ? ` kf-bar-${i + 1}` : ''}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </div>

                {isTop3 && (
                  <p className="kf-feat-desc">{feat.description}</p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function KiroFeatureView() {
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

      <div className="kf-body">
        <MbtiRanking counts={counts} mbtiByRole={mbtiByRole} />

        <div className="kf-divider" />

        <div className="kf-right">
          <TopKiroPanel results={results} />
        </div>
      </div>
    </div>
  );
}
