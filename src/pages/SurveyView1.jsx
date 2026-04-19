import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getQuestionResults, getQuestionResultsByRole, simulateQuestionResults, ROLES } from '../data/sampleData';
import { surveyQuestions } from '../data/survey';
import { mbtiQuestions, getAxisColors } from '../data/mbtiQuestions';
import NightSky from '../components/NightSky';

const ROLE_COLORS = surveyQuestions[0].colors;

const VISIBLE_COUNT = 6;

function AnimatedNumber({ value, style, className }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (diff === 0) return;
    const duration = 400;
    const startTime = performance.now();
    const step = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      setDisplay(Math.round(start + diff * t));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  return <span style={style} className={className}>{display}%</span>;
}

function QuestionRow({ q, data, isActive }) {
  const [colorA, colorB] = getAxisColors(q.axis);
  const total = data.a + data.b;
  const pctA = total > 0 ? Math.round((data.a / total) * 100) : 50;
  const pctB = 100 - pctA;

  return (
    <div className={`qrow${isActive ? ' qrow-active' : ''}`}>
      <div className="qrow-line1">
        <span className="qrow-num">Q{q.id}</span>
        <p className="qrow-text">{q.question}</p>
      </div>
      <div className="qrow-line2">
        <span className="qrow-choice-text" style={{ color: `${colorA}90` }}>{q.choices[0].short || q.choices[0].text}</span>
        <span className="qrow-pct" style={{ color: `${colorA}aa` }}>{pctA}%</span>
        <span className="qrow-vs">vs</span>
        <span className="qrow-pct" style={{ color: `${colorB}aa` }}>{pctB}%</span>
        <span className="qrow-choice-text qrow-choice-right" style={{ color: `${colorB}90` }}>{q.choices[1].short || q.choices[1].text}</span>
      </div>
    </div>
  );
}

export default function SurveyView1() {
  const [questionData, setQuestionData] = useState(getQuestionResults());
  const [roleData, setRoleData] = useState(getQuestionResultsByRole());
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % mbtiQuestions.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const update = () => {
      setQuestionData(getQuestionResults());
      setRoleData(getQuestionResultsByRole());
    };
    window.addEventListener('mbti-update', update);
    window.addEventListener('storage', update);
    const interval = setInterval(update, 5000);
    const simInterval = setInterval(simulateQuestionResults, 5000);
    return () => {
      window.removeEventListener('mbti-update', update);
      window.removeEventListener('storage', update);
      clearInterval(interval);
      clearInterval(simInterval);
    };
  }, []);

  const visibleQuestions = useMemo(() => {
    const result = [];
    for (let i = 0; i < VISIBLE_COUNT; i++) {
      const qi = (idx + i) % mbtiQuestions.length;
      result.push(mbtiQuestions[qi]);
    }
    return result;
  }, [idx]);

  const q = mbtiQuestions[idx];
  const data = questionData[q.id] || { a: 0, b: 0 };
  const totalAll = data.a + data.b;
  const overallA = totalAll > 0 ? Math.round((data.a / totalAll) * 100) : 50;
  const overallB = 100 - overallA;
  const [colorA, colorB] = getAxisColors(q.axis);
  const qRoleData = roleData[q.id] || {};

  return (
    <div className="sv1-view">
      <NightSky />
      <div className="qshow-body">
        <div className="qshow-featured">
          <AnimatePresence mode="wait">
            <motion.div
              key={q.id}
              className="qshow-card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="qshow-meta">
                <span className="qshow-num">Q{q.id}</span>
              </div>

              <p className="qshow-text">{q.question}</p>

              <div className="qshow-choice-labels">
                <span>{q.choices[0].short || q.choices[0].text}</span>
                <span>{q.choices[1].short || q.choices[1].text}</span>
              </div>

              <div className="qshow-overall">
                <span className="qshow-overall-label">전체</span>
                <span className="qshow-role-pct">{overallA}%</span>
                <div className="qshow-overall-bar">
                  <motion.div
                    className="qshow-role-bar-a"
                    style={{ background: colorA }}
                    initial={false}
                    animate={{ width: `${overallA}%` }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                  <motion.div
                    className="qshow-role-bar-b"
                    style={{ background: colorB }}
                    initial={false}
                    animate={{ width: `${overallB}%` }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </div>
                <span className="qshow-role-pct">{overallB}%</span>
              </div>

              <div className="qshow-roles-divider" />

              <div className="qshow-roles">
                {ROLES.map((role, ri) => {
                  const rd = qRoleData[role] || { a: 0, b: 0 };
                  const total = rd.a + rd.b;
                  const pctA = total > 0 ? Math.round((rd.a / total) * 100) : 50;
                  const pctB = 100 - pctA;
                  const rc = ROLE_COLORS[ri];
                  return (
                    <div key={role} className="qshow-role-row">
                      <span className="qshow-role-name">{role}</span>
                      <div className="qshow-role-bar">
                        <motion.div
                          className="qshow-role-bar-a"
                          style={{ background: pctA >= pctB ? rc : `${rc}40` }}
                          initial={false}
                          animate={{ width: `${pctA}%` }}
                          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        />
                        <motion.div
                          className="qshow-role-bar-b"
                          style={{ background: pctB > pctA ? rc : `${rc}40` }}
                          initial={false}
                          animate={{ width: `${pctB}%` }}
                          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="qshow-list-side">
          <h2 className="qshow-list-title">MBTI 질문</h2>
          <div className="qshow-list">
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleQuestions.map((mq, i) => (
                <motion.div
                  key={mq.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -60 }}
                  transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ flex: 1, display: 'flex', minHeight: 0 }}
                >
                  <QuestionRow
                    q={mq}
                    data={questionData[mq.id] || { a: 0, b: 0 }}
                    isActive={i === 0}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
