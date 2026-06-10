// components/Act1.tsx
"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Act1({ onNext, onPlayMusic, isPlaying }: { onNext: () => void, onPlayMusic: () => void, isPlaying: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => { setShow(true); }, []);

  return (
    <section className="flex flex-col items-center justify-center relative w-full h-full text-center overflow-hidden bg-[#030305]">
      
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex flex-col items-center z-10"
          >
            <h1 className="font-serif-display font-light tracking-widest leading-none text-[var(--rose-bright,#ffb4b4)] text-7xl md:text-8xl lg:text-[9rem] drop-shadow-[0_0_20px_rgba(255,180,180,0.2)]">
              Casly
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}
              className="text-xs md:text-sm tracking-[0.4em] uppercase font-light text-white/50 mt-6"
            >
              Tengo algo para ti
            </motion.p>

            <motion.button
              onClick={() => { onPlayMusic(); onNext(); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-12 relative overflow-hidden rounded-full group"
            >
              {/* Fondo del botón */}
              <div className="absolute inset-0 bg-transparent border border-white/20 rounded-full group-hover:border-rose-300/50 transition-colors duration-500" />
              
              {/* Efecto de luz interna en Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,180,180,0.2)_0%,transparent_70%)] transition-opacity duration-500" />
              
              <span className="relative block px-14 py-4 text-xs md:text-sm tracking-[0.3em] uppercase text-white/90 group-hover:text-white transition-colors">
                Abrir
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}