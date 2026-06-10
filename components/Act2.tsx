"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const WORDS = ["amor","siempre","tú","recuerdo","beso","alma","corazón","contigo","eternamente","pensando en ti"];

type Star = {
  x: number; y: number; ox: number; oy: number;
  r: number; base: number; glow: number;
  word: string | null; phase: number;
};

export default function Act2() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.5, once: true });
  const [activeWord, setActiveWord] = useState<{ text: string; x: number; y: number } | null>(null);
  const [hintVisible, setHintVisible] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    setTimeout(() => setHintVisible(true), 600);
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let stars: Star[] = [];
    let mouse = { x: -9999, y: -9999 };

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      buildStars();
    }

    function buildStars() {
      const count = Math.floor((canvas.width * canvas.height) / 4500);
      stars = Array.from({ length: count }, (_, i) => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return { x, y, ox: x, oy: y, r: Math.random() * 1.4 + 0.3,
          base: Math.random() * 0.5 + 0.2, glow: 0,
          word: i < WORDS.length ? WORDS[i] : null,
          phase: Math.random() * Math.PI * 2 };
      });
    }

    let lastWord = "";
    let wordTimer: ReturnType<typeof setTimeout>;

    function draw(t: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // lines
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.strokeStyle = `rgba(201,160,160,${(1 - d / 100) * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }

      let hov: Star | null = null;
      stars.forEach(s => {
        s.x = s.ox + Math.sin(t * 0.0004 + s.phase) * 2.5;
        s.y = s.oy + Math.cos(t * 0.0003 + s.phase * 1.3) * 1.8;
        const dx = mouse.x - s.x; const dy = mouse.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < (s.word ? 55 : 40)) {
          s.glow = Math.min(1, s.glow + 0.08);
          if (s.word) hov = s;
        } else {
          s.glow = Math.max(0, s.glow - 0.04);
        }
        const rr = s.r + s.glow * 2;
        if (s.glow > 0.1) {
          ctx.beginPath(); ctx.arc(s.x, s.y, rr + 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201,160,160,${s.glow * 0.2})`; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(s.x, s.y, rr, 0, Math.PI * 2);
        ctx.fillStyle = s.word ? `rgba(232,180,180,${s.base + s.glow * 0.6})`
          : `rgba(240,236,228,${s.base + s.glow * 0.5})`;
        ctx.fill();
      });

      if (hov && (hov as Star).word !== lastWord) {
        lastWord = (hov as Star).word!;
        const rect = canvas.getBoundingClientRect();
        setActiveWord({ text: (hov as Star).word!, x: (hov as Star).x + rect.left + 14, y: (hov as Star).y + rect.top - 22 });
        clearTimeout(wordTimer);
        wordTimer = setTimeout(() => { setActiveWord(null); lastWord = ""; }, 1800);
      }

      animId = requestAnimationFrame(draw);
    }

    function onMove(cx: number, cy: number) {
      const r = canvas.getBoundingClientRect();
      mouse = { x: cx - r.left, y: cy - r.top };
    }
    canvas.addEventListener("mousemove", e => onMove(e.clientX, e.clientY));
    canvas.addEventListener("touchmove", e => { e.preventDefault(); onMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
    canvas.addEventListener("mouseleave", () => { mouse = { x: -9999, y: -9999 }; });

    resize();
    window.addEventListener("resize", resize);
    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      clearTimeout(wordTimer);
    };
  }, [isInView]);

  return (
    <section id="act2" ref={sectionRef}
      className="min-h-svh scroll-snap-start relative flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 text-center pointer-events-none">
        <motion.p
          className="text-[0.7rem] tracking-[0.4em] uppercase mb-2"
          style={{ color: "var(--ink-dim)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={hintVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Un cielo para ti
        </motion.p>
        <motion.p
          className="text-[0.62rem] tracking-[0.2em]"
          style={{ color: "var(--ink-faint)" }}
          initial={{ opacity: 0 }}
          animate={hintVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Toca las estrellas
        </motion.p>
      </div>

      {/* Floating word */}
      {activeWord && (
        <motion.span
          key={activeWord.text}
          className="fixed font-serif-display italic text-base pointer-events-none z-50"
          style={{ left: activeWord.x, top: activeWord.y, color: "var(--rose-bright)",
            textShadow: "0 0 20px rgba(201,160,160,0.5)", whiteSpace: "nowrap" }}
          initial={{ opacity: 0, y: 4, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeWord.text}
        </motion.span>
      )}
    </section>
  );
}