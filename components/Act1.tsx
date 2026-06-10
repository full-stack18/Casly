"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Act1() {
  const [show, setShow] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { setShow(true); }, []);

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/wonderwall.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0;
    }
    if (!playing) {
      audioRef.current.play().catch(() => {});
      fadeAudio(audioRef.current, 0, 0.45, 2000);
      setPlaying(true);
    } else {
      fadeAudio(audioRef.current, 0.45, 0, 1000, () => audioRef.current?.pause());
      setPlaying(false);
    }
  };

  return (
    <section
      id="act1"
      className="min-h-svh scroll-snap-start flex flex-col items-center justify-center gap-10 relative overflow-hidden px-6 text-center"
    >
      {/* subtle background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 3, delay: 0.5 }}
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(201,160,160,0.07) 0%, transparent 70%)"
        }}
      />

      {/* Name */}
      <AnimatePresence>
        {show && (
          <motion.h1
            className="font-serif-display font-light tracking-widest leading-none"
            style={{ fontSize: "clamp(4rem,18vw,9rem)", color: "var(--rose-bright)" }}
            initial={{ opacity: 0, y: 32, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            Casly
          </motion.h1>
        )}
      </AnimatePresence>

      {/* Subtitle */}
      <motion.p
        className="text-xs tracking-[0.35em] uppercase"
        style={{ color: "var(--ink-dim)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.6 }}
      >
        Tengo algo para ti
      </motion.p>

      {/* Open button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: show ? 1 : 0, y: show ? 0 : 10 }}
        transition={{ duration: 0.8, delay: 2.4 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => document.getElementById("act2")?.scrollIntoView({ behavior: "smooth" })}
        className="relative border text-[0.72rem] tracking-[0.3em] uppercase px-10 py-3 overflow-hidden group"
        style={{ borderColor: "var(--rose)", color: "var(--rose-bright)", background: "transparent" }}
      >
        <motion.span
          className="absolute inset-0 origin-left"
          style={{ background: "var(--rose)" }}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        />
        <span className="relative z-10 group-hover:text-[#0a0608] transition-colors duration-300">
          Abrir
        </span>
      </motion.button>

      {/* Music button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ delay: 3 }}
        onClick={toggleMusic}
        className="absolute bottom-6 right-6 flex items-center gap-2 text-[0.68rem] tracking-[0.18em] transition-colors duration-300"
        style={{ color: playing ? "var(--rose-bright)" : "var(--ink-faint)" }}
      >
        <motion.span
          animate={playing ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          ♪
        </motion.span>
        {playing ? "pausar" : "Wonderwall"}
      </motion.button>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ delay: 3.2 }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--ink-faint)" }}>scroll</span>
        <motion.svg
          width="12" height="18" viewBox="0 0 12 18" fill="none"
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <path d="M6 1v12M2 9l4 6 4-6" stroke="rgba(240,236,228,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </motion.svg>
      </motion.div>
    </section>
  );
}

function fadeAudio(a: HTMLAudioElement, from: number, to: number, dur: number, cb?: () => void) {
  const steps = 30;
  a.volume = from;
  let step = 0;
  const timer = setInterval(() => {
    step++;
    a.volume = Math.max(0, Math.min(1, from + (to - from) * (step / steps)));
    if (step >= steps) { clearInterval(timer); cb?.(); }
  }, dur / steps);
}