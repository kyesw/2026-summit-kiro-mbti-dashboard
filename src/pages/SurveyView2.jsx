import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSurveyResults, addRandomSurveyResult } from '../data/dataService';
import { surveyQuestions } from '../data/survey';
import NightSky from '../components/NightSky';
import kiroGhost from '../assets/kiro-ghost.svg';

const QUESTIONS = [surveyQuestions[1], surveyQuestions[2], surveyQuestions[3]];
const RANK_LABELS = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

const FLOATING_KIROS = [
  { size: 100, delay: 0, duration: 35, x: ['5vw', '80vw', '30vw', '70vw', '5vw'], y: ['10vh', '60vh', '80vh', '20vh', '10vh'] },
  { size: 90, delay: 2, duration: 40, x: ['85vw', '20vw', '60vw', '10vw', '85vw'], y: ['70vh', '15vh', '50vh', '80vh', '70vh'] },
  { size: 110, delay: 4, duration: 38, x: ['50vw', '5vw', '75vw', '40vw', '50vw'], y: ['5vh', '45vh', '75vh', '30vh', '5vh'] },
];

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

function StatCards({ data, question }) {
  const items = useRanked(data, question);

  return (
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
  );
}

export default function SurveyView2() {
  const [survey, setSurvey] = useState(getSurveyResults());
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % QUESTIONS.length), 10000);
    return () => clearInterval(timer);
  }, []);

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

  const q = QUESTIONS[idx];
  const data = survey[q.id] || {};

  return (
    <div className="sv2-view">
      <NightSky />
      {FLOATING_KIROS.map((k, i) => (
        <motion.div
          key={i}
          className="sv2-floating-kiro"
          style={{ width: k.size, height: k.size }}
          animate={{
            left: k.x,
            top: k.y,
            rotate: [0, 10, -8, 12, 0],
          }}
          transition={{ duration: k.duration, delay: k.delay, repeat: Infinity, ease: 'linear' }}
        >
          <div className="sv2-floating-kiro-glow" />
          <img src={kiroGhost} alt="" className="sv2-floating-kiro-img" />
        </motion.div>
      ))}
      <div className="sv2-rolling">
        <div className="sv2-rolling-header">
          <AnimatePresence mode="wait">
            <motion.h1
              key={q.id}
              className="sv2-rolling-title"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {q.label}
            </motion.h1>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            className="sv2-rolling-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <StatCards data={data} question={q} />
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
