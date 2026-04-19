import { useState, useEffect, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { getResults, addResult, mbtiDescriptions } from '../data/mbti';
import NightSky from '../components/NightSky';
import FlipCounter from '../components/FlipCounter';
import kiroGhost from '../assets/kiro-ghost.svg';

const ALL_TYPES = Object.keys(mbtiDescriptions);
const simulateOne = () => addResult(ALL_TYPES[Math.floor(Math.random() * ALL_TYPES.length)]);

function useKiroTricks(controls) {
  const trickIdx = useRef(0);

  useEffect(() => {
    const idle = () => controls.start({
      y: [0, -18, 0], x: 0, rotate: 0, scale: 1, scaleX: 1, scaleY: 1, opacity: 1,
      transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
    });

    const tricks = [
      // 1. 빠른 제자리 회전
      async () => {
        await controls.start({
          rotate: [0, 360, 720], scale: [1, 1.2, 1],
          transition: { duration: 0.6, ease: 'easeInOut' },
        });
        idle();
      },
      // 2. 화면 날아다니기
      async () => {
        await controls.start({
          x: [0, 200, -200, 150, -100, 0],
          y: [0, -150, 100, -200, 50, 0],
          rotate: [0, 20, -15, 25, -10, 0],
          scale: [1, 0.7, 1.3, 0.8, 1.1, 1],
          transition: { duration: 1.5, ease: 'easeInOut' },
        });
        idle();
      },
      // 3. 부르르 떨림
      async () => {
        await controls.start({
          x: [0, -8, 8, -6, 6, -4, 4, -2, 2, 0],
          rotate: [0, -3, 3, -2, 2, -1, 1, 0],
          transition: { duration: 0.5, ease: 'linear' },
        });
        idle();
      },
      // 4. 바운스 통통
      async () => {
        await controls.start({
          y: [0, -120, 0, -60, 0, -25, 0],
          scaleY: [1, 1.2, 0.8, 1.15, 0.9, 1.05, 1],
          scaleX: [1, 0.85, 1.15, 0.9, 1.1, 0.95, 1],
          transition: { duration: 1.2, times: [0, 0.2, 0.4, 0.55, 0.7, 0.85, 1], ease: 'easeOut' },
        });
        idle();
      },
      // 5. 납작 squash & stretch
      async () => {
        await controls.start({
          scaleX: [1, 1.4, 0.7, 1.2, 0.9, 1],
          scaleY: [1, 0.6, 1.4, 0.8, 1.1, 1],
          transition: { duration: 0.8, ease: 'easeInOut' },
        });
        idle();
      },
      // 6. 사라졌다 팝업
      async () => {
        await controls.start({
          opacity: [1, 0], scale: [1, 0.3], rotate: [0, 180],
          transition: { duration: 0.3, ease: 'easeIn' },
        });
        controls.set({ x: 100, y: -80 });
        await controls.start({
          opacity: [0, 1], scale: [0.3, 1.2, 1], rotate: [180, 360],
          x: 0, y: 0,
          transition: { duration: 0.5, ease: 'easeOut' },
        });
        idle();
      },
      // 7. 좌우 흔들기
      async () => {
        await controls.start({
          rotate: [0, -20, 20, -15, 15, -8, 8, -3, 0],
          transition: { duration: 1, ease: 'easeInOut' },
        });
        idle();
      },
      // 8. 점프 백플립
      async () => {
        await controls.start({
          y: [0, -180, -180, 0],
          rotate: [0, 0, -360, -360],
          scale: [1, 1.1, 1.1, 1],
          scaleY: [0.85, 1.1, 1.1, 0.85, 1],
          transition: { duration: 1, times: [0, 0.35, 0.65, 1], ease: 'easeInOut' },
        });
        idle();
      },
    ];

    const interval = setInterval(() => {
      tricks[trickIdx.current % tricks.length]();
      trickIdx.current++;
    }, 5000);

    return () => clearInterval(interval);
  }, [controls]);
}

export default function HeroView() {
  const [count, setCount] = useState(() => getResults().length);
  const controls = useAnimationControls();

  useKiroTricks(controls);

  useEffect(() => {
    // 기본 떠다니기 시작
    controls.start({
      y: [0, -18, 0],
      transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
    });
  }, [controls]);

  useEffect(() => {
    const update = () => setCount(getResults().length);
    window.addEventListener('mbti-update', update);
    window.addEventListener('storage', update);
    const pollInterval = setInterval(update, 5000);
    const autoInterval = setInterval(simulateOne, 5000);
    return () => {
      window.removeEventListener('mbti-update', update);
      window.removeEventListener('storage', update);
      clearInterval(pollInterval);
      clearInterval(autoInterval);
    };
  }, []);

  return (
    <div className="hero-view">
      <NightSky />

      <div className="hero-summit-badge">
        <span className="hero-summit-dot" />
        AWS Summit Seoul 2026
      </div>

      <h1 className="hero-title">
        나의 <span className="hero-title-accent">Kiro MBTI</span>는?
      </h1>

      <div className="hero-ghost-wrap">
        <div className="hero-ghost-glow" />
        <div className="hero-ghost-glow-inner" />
        <motion.img
          src={kiroGhost}
          className="hero-kiro-icon"
          alt="Kiro"
          animate={controls}
        />
      </div>

      <img src="/kiro_text.png" className="hero-kiro-text" alt="Kiro" />

      <div className="hero-count-number">
        <FlipCounter value={count} />
      </div>
      <div className="hero-count-label">명이 참여했어요</div>
    </div>
  );
}
