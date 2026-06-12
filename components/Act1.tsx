"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from "./Typewriter";

export default function Act1({ onNext, onPlayMusic }: { onNext: () => void, onPlayMusic: () => void, isPlaying: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(true); }, []);

  const orbs = Array.from({ length: 8 }).map((_, i) => ({
    id: i, size: Math.random() * 100 + 50,
    x: Math.random() * 100 - 50, y: Math.random() * 100 - 50,
    duration: Math.random() * 6 + 4
  }));

  // Floating rose petals — visible, warm, romantic
  const petals = ["🌸", "✿", "❀", "🌹", "✾"];

  return (
    <section className="flex flex-col items-center justify-center relative w-full h-full text-center overflow-hidden bg-[#030305] px-4">

      {/* Ambient orbs */}
      {orbs.map((orb) => (
        <motion.div key={orb.id}
          className="absolute rounded-full pointer-events-none mix-blend-screen"
          style={{ width: orb.size, height: orb.size, background: "radial-gradient(circle, rgba(255,160,160,0.07) 0%, transparent 70%)", top: `${50 + orb.y}%`, left: `${50 + orb.x}%` }}
          animate={{ x: [0, orb.x * 3, 0], y: [0, orb.y * 3, 0] }}
          transition={{ duration: orb.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Floating petals — visible & romantic */}
      {[...Array(8)].map((_, i) => (
        <motion.span key={`petal-${i}`}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${5 + i * 12}%`,
            top: "-6%",
            fontSize: `${13 + (i % 4) * 4}px`,
            opacity: 0,
            filter: "drop-shadow(0 0 4px rgba(255,150,150,0.4))",
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, Math.sin(i * 1.1) * 70],
            rotate: [0, i % 2 === 0 ? 300 : -300],
            opacity: [0, 0.65, 0.65, 0],
          }}
          transition={{ duration: 12 + i * 2, repeat: Infinity, delay: i * 1.8, ease: "linear" }}
        >
          {petals[i % petals.length]}
        </motion.span>
      ))}

      {/* Subtle heartbeat pulse behind name */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,80,80,0.08) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
            className="flex flex-col items-center z-10 w-full max-w-lg">

            <h1 className="font-serif-display font-light tracking-widest leading-none text-rose-300 text-6xl md:text-[8rem] drop-shadow-[0_0_25px_rgba(255,160,160,0.45)] mb-2">
              <Typewriter text="Casly" delay={0.5} speed={250} />
            </h1>

            {/* Small romantic tagline */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1 }}
              className="font-serif-display italic text-rose-300/60 text-base md:text-lg tracking-wide mb-1">
              mi lugar favorito en el mundo
            </motion.p>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6, duration: 1 }}
              className="text-[10px] tracking-[0.4em] uppercase font-light text-white/35 mb-8">
              Conociéndonos y sumando...
            </motion.p>

            <motion.button
              onClick={() => { onPlayMusic(); onNext(); }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.5, duration: 1 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden rounded-full group bg-black/20 backdrop-blur-md"
            >
              <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-transparent transition-colors duration-300" />
              <div className="absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(255,160,160,0.8)_50%,transparent_100%)] animate-[spin_3s_linear_infinite] opacity-0 group-hover:opacity-100" />
              <div className="absolute inset-[1px] bg-[#050508] rounded-full" />
              <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              <span className="relative z-10 block px-14 py-4 text-xs md:text-sm tracking-[0.3em] uppercase text-white/80 group-hover:text-white transition-all">
                Entrar
              </span>
            </motion.button>

            {/* Tiny hearts around button */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.2 }}
              className="mt-4 flex gap-3 text-rose-400/50 text-sm select-none pointer-events-none">
              {["♡", "❤", "♡"].map((h, i) => (
                <motion.span key={i}
                  animate={{ y: [0, -6, 0], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}>
                  {h}
                </motion.span>
              ))}
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}