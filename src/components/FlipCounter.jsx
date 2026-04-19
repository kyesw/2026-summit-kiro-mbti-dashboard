import { useState, useEffect, useRef } from 'react';

function FlipDigit({ digit }) {
  const [current, setCurrent] = useState(digit);
  const [next, setNext] = useState(digit);
  const [phase, setPhase] = useState('idle'); // idle | fold | unfold

  const t1 = useRef();
  const t2 = useRef();

  useEffect(() => {
    if (digit === current && phase === 'idle') return;
    if (digit === current) return;

    clearTimeout(t1.current);
    clearTimeout(t2.current);

    setNext(digit);
    setPhase('fold');

    t1.current = setTimeout(() => {
      setCurrent(digit);
      setPhase('unfold');
    }, 200);

    t2.current = setTimeout(() => {
      setPhase('idle');
    }, 400);

    return () => { clearTimeout(t1.current); clearTimeout(t2.current); };
  }, [digit]);

  return (
    <div className="fd-card">
      {/* 정적 상단 (현재 digit 위쪽 절반) */}
      <div className="fd-half fd-upper">
        <div className="fd-num">{phase === 'unfold' ? next : current}</div>
      </div>

      {/* 정적 하단 (현재 digit 아래쪽 절반) */}
      <div className="fd-half fd-lower">
        <div className="fd-num">{next}</div>
      </div>

      {/* 구분선 */}
      <div className="fd-divider" />

      {/* 접히는 플랩 (이전 숫자 위쪽이 아래로 접힘) */}
      {phase === 'fold' && (
        <div className="fd-flap fd-flap-top">
          <div className="fd-num">{current}</div>
        </div>
      )}

      {/* 펼쳐지는 플랩 (새 숫자 아래쪽이 위에서 펼쳐짐) */}
      {phase === 'unfold' && (
        <div className="fd-flap fd-flap-bottom">
          <div className="fd-num">{next}</div>
        </div>
      )}
    </div>
  );
}

export default function FlipCounter({ value }) {
  const digits = String(value).split('');

  return (
    <div className="flip-counter">
      {digits.map((d, i) => (
        <FlipDigit key={digits.length - i} digit={d} />
      ))}
    </div>
  );
}
