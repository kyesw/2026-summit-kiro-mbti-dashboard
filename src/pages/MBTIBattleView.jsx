import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getResults, addResult, mbtiDescriptions, mbtiResults, computeTop3FromType } from '../data/mbti';
import NightSky from '../components/NightSky';

const ALL_TYPES = Object.keys(mbtiDescriptions);
let _simIdx = 0;
const simulateOne = () => { addResult(ALL_TYPES[_simIdx % ALL_TYPES.length]); _simIdx++; };


/* ── Physics simulation ── */
function useBubblePhysics(counts, containerRef) {
  const nodesRef = useRef([]);
  const rafRef = useRef();
  const elMapRef = useRef({});

  const registerEl = useCallback((type, el) => {
    if (el) elMapRef.current[type] = el;
    else delete elMapRef.current[type];
  }, []);

  // Initialize / update node radii when counts change
  useEffect(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const maxCount = Math.max(...counts.map(c => c.count), 1);

    const minR = 33;
    const maxR = Math.min(rect.width, rect.height) * 0.10;

    const existing = {};
    nodesRef.current.forEach(n => { existing[n.type] = n; });

    nodesRef.current = counts.map((c, i) => {
      const prev = existing[c.type];
      const r = c.count > 0
        ? minR + ((c.count / maxCount) ** 0.6) * (maxR - minR)
        : minR * 0.6;

      return {
        type: c.type,
        count: c.count,
        color: c.color,
        emoji: c.emoji,
        r,
        x: prev ? prev.x : cx + (Math.random() - 0.5) * rect.width * 0.4,
        y: prev ? prev.y : cy + (Math.random() - 0.5) * rect.height * 0.4,
        vx: prev ? prev.vx : 0,
        vy: prev ? prev.vy : 0,
      };
    });
  }, [counts, containerRef]);

  // Run physics loop
  useEffect(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const w = rect.width;
    const h = rect.height;

    let last = performance.now();

    const step = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const nodes = nodesRef.current;
      if (!nodes.length) { rafRef.current = requestAnimationFrame(step); return; }

      const gravity = 120;
      const damping = 0.92;
      const collisionStrength = 0.8;

      for (const n of nodes) {
        // Center gravity
        const dx = cx - n.x;
        const dy = cy - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        n.vx += (dx / dist) * gravity * dt;
        n.vy += (dy / dist) * gravity * dt;
      }

      // Collision between bubbles
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = a.r + b.r + 4;

          if (dist < minDist) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;
            const push = overlap * collisionStrength;
            a.vx -= nx * push;
            a.vy -= ny * push;
            b.vx += nx * push;
            b.vy += ny * push;
          }
        }
      }

      // Update positions + boundary clamping
      for (const n of nodes) {
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx * dt;
        n.y += n.vy * dt;

        // Keep inside bounds
        n.x = Math.max(n.r, Math.min(w - n.r, n.x));
        n.y = Math.max(n.r, Math.min(h - n.r, n.y));
      }

      // Apply positions to DOM
      for (const n of nodes) {
        const el = elMapRef.current[n.type];
        if (el) {
          el.style.transform = `translate(${n.x - n.r}px, ${n.y - n.r}px)`;
          el.style.width = `${n.r * 2}px`;
          el.style.height = `${n.r * 2}px`;
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [counts, containerRef]);

  return { nodesRef, registerEl };
}

function Bubble({ data, isFeatured, registerEl, pulsing }) {
  const hasData = data.count > 0;

  return (
    <div
      ref={(el) => registerEl(data.type, el)}
      className="mbubble-outer"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        willChange: 'transform',
      }}
    >
      <div
        className={`mbubble${isFeatured ? ' mbubble-featured' : ''}${!hasData ? ' mbubble-empty' : ''}${pulsing ? ' mbubble-pulse' : ''}`}
        style={{
          borderColor: isFeatured ? `${data.color}90` : hasData ? `${data.color}50` : 'rgba(255,255,255,0.06)',
        }}
      >
        <img
          src={`/kiro_characters/${data.type}.png`}
          alt={data.type}
          className="mbubble-img"
        />
        <span className="mbubble-type">{data.type}</span>
        {hasData && (
          <span className="mbubble-count">{data.count}</span>
        )}
      </div>
    </div>
  );
}

function KiroFeaturesPanel({ onTypeChange }) {
  const [idx, setIdx] = useState(0);
  const types = ALL_TYPES;

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % types.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const current = types[idx];

  useEffect(() => {
    onTypeChange?.(current);
  }, [current, onTypeChange]);
  const info = mbtiDescriptions[current];
  const result = mbtiResults[current];
  const top3 = useMemo(() => computeTop3FromType(current), [current]);
  const bestMatch = mbtiResults[result.bestMatch];
  const challengeMatch = mbtiResults[result.challengeMatch];

  return (
    <div className="kiro-panel">
      <h2 className="kiro-panel-title">MBTI별 추천 Kiro 기능</h2>
      <div className="kiro-panel-center">

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="kiro-panel-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Character + Type */}
            <div className="kiro-panel-hero">
              <div className="kiro-panel-char-glow" style={{ background: `radial-gradient(circle, ${info.color}30 0%, transparent 70%)` }} />
              <img src={`/kiro_characters/${current}.png`} alt={current} className="kiro-panel-char" />
              <span className="kiro-panel-type">{current}</span>
              <span className="kiro-panel-type-title">{result.title}</span>
              <span className="kiro-panel-type-subtitle">{result.subtitle}</span>
            </div>

            {/* Strengths */}
            <div className="kiro-panel-section">
              <h3 className="kiro-panel-section-label">Strengths</h3>
              <div className="kiro-panel-strengths">
                {result.strengths.map(s => (
                  <span key={s} className="kiro-panel-strength">{s}</span>
                ))}
              </div>
            </div>

            {/* Kiro Features Top 3 */}
            <div className="kiro-panel-section">
              <h3 className="kiro-panel-section-label">당신에게 맞는 Kiro 기능 Top 3</h3>
              <div className="kiro-panel-features">
                {top3.map((feat, i) => (
                  <div key={feat.id} className="kiro-panel-feat">
                    <div className="kiro-panel-feat-head">
                      <span className="kiro-panel-feat-rank">#{i + 1}</span>
                      <span className="kiro-panel-feat-emoji">{feat.emoji}</span>
                      <span className="kiro-panel-feat-name">{feat.name}</span>
                    </div>
                    <p className="kiro-panel-feat-desc">{feat.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Compatibility */}
            <div className="kiro-panel-section">
              <h3 className="kiro-panel-section-label">궁합</h3>
              <div className="kiro-panel-compat">
                <div className="kiro-panel-match good">
                  <div className="kiro-panel-match-badge">잘 맞는 조합</div>
                  <div className="kiro-panel-match-head">
                    <span className="kiro-panel-match-emoji">{bestMatch?.emoji}</span>
                    <div>
                      <span className="kiro-panel-match-type">{result.bestMatch}</span>
                      <span className="kiro-panel-match-name">{bestMatch?.title}</span>
                    </div>
                  </div>
                  <p className="kiro-panel-match-comment">{result.bestMatchComment}</p>
                </div>
                <div className="kiro-panel-match challenge">
                  <div className="kiro-panel-match-badge">안 맞는 조합</div>
                  <div className="kiro-panel-match-head">
                    <span className="kiro-panel-match-emoji">{challengeMatch?.emoji}</span>
                    <div>
                      <span className="kiro-panel-match-type">{result.challengeMatch}</span>
                      <span className="kiro-panel-match-name">{challengeMatch?.title}</span>
                    </div>
                  </div>
                  <p className="kiro-panel-match-comment">{result.challengeMatchComment}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="kiro-panel-dots">
          {types.map((t, i) => (
            <span key={t} className={`kiro-panel-dot${i === idx ? ' active' : ''}`} style={i === idx ? { background: mbtiDescriptions[t].color } : {}} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MBTIBattleView() {
  const [results, setResults] = useState(getResults());
  const [featuredType, setFeaturedType] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const update = () => setResults(getResults());
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
    return ALL_TYPES
      .map(type => ({ type, count: map[type] || 0, ...mbtiDescriptions[type] }))
      .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
  }, [results]);

  const { registerEl } = useBubblePhysics(counts, containerRef);

  // Track which bubbles just got a new result
  const prevCountsRef = useRef({});
  const [pulsingTypes, setPulsingTypes] = useState(new Set());

  useEffect(() => {
    const prev = prevCountsRef.current;
    const changed = new Set();
    counts.forEach(c => {
      if (prev[c.type] !== undefined && c.count > prev[c.type]) {
        changed.add(c.type);
      }
      prev[c.type] = c.count;
    });
    if (changed.size > 0) {
      setPulsingTypes(changed);
      const t = setTimeout(() => setPulsingTypes(new Set()), 600);
      return () => clearTimeout(t);
    }
  }, [counts]);

  const handleTypeChange = useCallback((type) => {
    setFeaturedType(type);
  }, []);

  return (
    <div className="mbubble-view">
      <NightSky />

      <div className="mbubble-body">
        <div className="mbubble-left">
          <div className="mbubble-field-header">
            <h1 className="mbubble-section-title">참가자 MBTI 분포</h1>
          </div>
          <div className="mbubble-field" ref={containerRef}>
            {counts.map((c) => (
            <Bubble
              key={c.type}
              data={c}
              isFeatured={c.type === featuredType}
              registerEl={registerEl}
              pulsing={pulsingTypes.has(c.type)}
            />
          ))}
          </div>
        </div>

        <div className="mbubble-sidebar">
          <KiroFeaturesPanel onTypeChange={handleTypeChange} />
        </div>
      </div>
    </div>
  );
}
