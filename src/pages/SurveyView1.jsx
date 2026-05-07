import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getQuestionResults, simulateQuestionResults } from '../data/dataService';
import { mbtiQuestions, getAxisColors } from '../data/mbtiQuestions';
import NightSky from '../components/NightSky';
import kiroGhost from '../assets/kiro-ghost.svg';


export default function SurveyView1() {
  const [data, setData] = useState(getQuestionResults());
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % mbtiQuestions.length), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const update = () => {
      setData(getQuestionResults());
    };
    window.addEventListener('mbti-update', update);
    window.addEventListener('storage', update);
    const poll = setInterval(update, 5000);
    const sim = setInterval(simulateQuestionResults, 5000);
    return () => {
      window.removeEventListener('mbti-update', update);
      window.removeEventListener('storage', update);
      clearInterval(poll);
      clearInterval(sim);
    };
  }, []);

  const q = mbtiQuestions[idx];
  const d = data[q.id] || { a: 0, b: 0 };
  const total = d.a + d.b;
  const pctA = total > 0 ? Math.round((d.a / total) * 100) : 50;
  const pctB = 100 - pctA;
  const [colorA, colorB] = getAxisColors(q.axis);
  const winA = pctA >= pctB;


  return (
    <div className="q3-view">
      <NightSky />

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          className="q3-split"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Question bar at top */}
          <div className="q3-top">
            <span className="q3-qnum">Q{q.id}</span>
            <p className="q3-question">{q.question}</p>
          </div>

          {/* Split halves */}
          <div className="q3-halves">
            <motion.div
              className="q3-half q3-half-a"
              style={{ flex: 1, background: `linear-gradient(135deg, ${colorA}18 0%, ${colorA}08 100%)` }}
            >
              <motion.img
                src={kiroGhost}
                alt=""
                className="q3-half-icon"
                animate={{ scale: winA ? 1 : 0.8, opacity: winA ? 0.9 : 0.3 }}
                transition={{ duration: 0.6 }}
                style={{ filter: `drop-shadow(0 0 20px ${colorA}50)` }}
              />
              <motion.span
                className="q3-half-pct"
                style={{ color: colorA, filter: winA ? `drop-shadow(0 0 30px ${colorA}60)` : 'none' }}
                animate={{ scale: winA ? 1 : 0.75, opacity: winA ? 1 : 0.4 }}
                transition={{ duration: 0.6 }}
              >
                {pctA}%
              </motion.span>
              <p className="q3-half-text" style={{ opacity: winA ? 0.9 : 0.4 }}>
                {q.choices[0].short || q.choices[0].text}
              </p>
              <span className="q3-half-count" style={{ opacity: winA ? 0.9 : 0.4 }}>{d.a}명</span>
            </motion.div>

            <div className="q3-divider">
              <div className="q3-divider-line" />
            </div>

            <motion.div
              className="q3-half q3-half-b"
              style={{ flex: 1, background: `linear-gradient(225deg, ${colorB}18 0%, ${colorB}08 100%)` }}
            >
              <motion.img
                src={kiroGhost}
                alt=""
                className="q3-half-icon q3-half-icon-flip"
                animate={{ scale: !winA ? 1 : 0.8, opacity: !winA ? 0.9 : 0.3 }}
                transition={{ duration: 0.6 }}
                style={{ filter: `drop-shadow(0 0 20px ${colorB}50)` }}
              />
              <motion.span
                className="q3-half-pct"
                style={{ color: colorB, filter: !winA ? `drop-shadow(0 0 30px ${colorB}60)` : 'none' }}
                animate={{ scale: !winA ? 1 : 0.75, opacity: !winA ? 1 : 0.4 }}
                transition={{ duration: 0.6 }}
              >
                {pctB}%
              </motion.span>
              <p className="q3-half-text" style={{ opacity: !winA ? 0.9 : 0.4 }}>
                {q.choices[1].short || q.choices[1].text}
              </p>
              <span className="q3-half-count" style={{ opacity: !winA ? 0.9 : 0.4 }}>{d.b}명</span>
            </motion.div>
          </div>

          {/* Progress dots */}
          <div className="q3-dots">
            {mbtiQuestions.map((_, i) => (
              <div
                key={i}
                className={`q3-dot${i === idx ? ' q3-dot-active' : ''}`}
                style={i === idx ? { background: colorA } : undefined}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
