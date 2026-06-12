"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from "./Typewriter";
import Counter from "./Counter";

export default function Act1({ onNext, onPlayMusic }: { onNext: () => void, onPlayMusic: () => void, isPlaying: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(true); }, []);

  const orbs = Array.from({ length: 8 }).map((_, i) => ({
    id: i, size: Math.random() * 100 + 50, x: Math.random() * 100 - 50, y: Math.random() * 100 - 50, duration: Math.random() * 6 + 4
  }));

  return (
    <section className="flex flex-col items-center justify-center relative w-full h-full text-center overflow-hidden bg-[#030305] px-4">
      {orbs.map((orb) => (
        <motion.div key={orb.id} className="absolute rounded-full pointer-events-none mix-blend-screen"
          style={{ width: orb.size, height: orb.size, background: "radial-gradient(circle, rgba(255,180,180,0.05) 0%, transparent 70%)", top: `${50 + orb.y}%`, left: `${50 + orb.x}%` }}
          animate={{ x: [0, orb.x * 3, 0], y: [0, orb.y * 3, 0] }} transition={{ duration: orb.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="flex flex-col items-center z-10 w-full max-w-lg">
            <h1 className="font-serif-display font-light tracking-widest leading-none text-rose-300 text-6xl md:text-[8rem] drop-shadow-[0_0_20px_rgba(255,180,180,0.3)] mb-2">
              <Typewriter text="Casly" delay={0.5} speed={250} />
            </h1>
            
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} className="text-[10px] md:text-sm tracking-[0.4em] uppercase font-light text-white/50">
              Conociéndonos y sumando...
            </motion.p>

            <Counter />

            <motion.button onClick={() => { onPlayMusic(); onNext(); }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.5, duration: 1 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="mt-12 relative overflow-hidden rounded-full group bg-black/20 backdrop-blur-md"
            >
              <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-transparent transition-colors duration-300" />
              {/* Borde de luz que gira */}
              <div className="absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(255,180,180,0.8)_50%,transparent_100%)] animate-[spin_3s_linear_infinite] opacity-0 group-hover:opacity-100" />
              <div className="absolute inset-[1px] bg-[#050508] rounded-full" />
              <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              <span className="relative z-10 block px-14 py-4 text-xs md:text-sm tracking-[0.3em] uppercase text-white/80 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">
                Entrar
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}