// components/Act3.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from "./Typewriter";

export default function Act3() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="act3" className="min-h-svh scroll-snap-start flex flex-col items-center justify-center relative px-6">
      {!isOpen ? (
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex flex-col items-center gap-4 cursor-pointer"
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-16 h-12 border border-rose-200/30 flex items-center justify-center rounded-sm"
            style={{ borderColor: "var(--rose)" }}
          >
            <span style={{ color: "var(--rose-bright)" }}>✉</span>
          </motion.div>
          <span className="text-[0.65rem] tracking-[0.3em] uppercase transition-colors" style={{ color: "var(--ink-dim)" }}>
            Toca para abrir
          </span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-md text-center flex flex-col gap-6"
        >
          <h2 className="font-serif-display text-3xl md:text-5xl italic" style={{ color: "var(--rose-bright)" }}>
            <Typewriter text="Mi lugar favorito..." delay={0.5} />
          </h2>
          <p className="text-sm md:text-base leading-relaxed tracking-wide font-light" style={{ color: "var(--ink-dim)" }}>
            <Typewriter 
              text="No es un sitio en el mapa. Mi lugar favorito es cualquier lugar en el que esté contigo. He querido hacerte esto para recordarte lo especial que eres para mí." 
              delay={1.5} 
            />
          </p>
        </motion.div>
      )}
    </section>
  );
}