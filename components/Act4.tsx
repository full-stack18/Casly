"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHOTOS = [
  { id: 1, src: "/foto1.jpg", text: "La sonrisa más linda del universo", rotate: -3 },
  { id: 2, src: "/foto2.jpg", text: "Esa mirada que me vuelve loco", rotate: 2 },
  { id: 3, src: "/foto3.jpg", text: "No me canso de admirarte", rotate: -4 },
  { id: 4, src: "/foto4.jpg", text: "Eres arte en cada detalle...", rotate: 3 },
];

export default function Act4({ onNext }: { onNext: () => void }) {
  const [cards, setCards] = useState(PHOTOS);

  return (
    <section className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-[#050508] px-4">

      {/* Warm ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.05, 0.13, 0.05] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(210,100,100,0.22) 0%, transparent 62%)" }}
      />

      {/* Scattered hearts — visible decorations */}
      {[...Array(7)].map((_, i) => (
        <motion.span key={`h${i}`}
          className="absolute pointer-events-none select-none text-rose-500"
          style={{
            left: `${6 + i * 13}%`,
            top: `${72 + (i % 3) * 9}%`,
            fontSize: `${10 + (i % 4) * 5}px`,
            opacity: 0.18 + (i % 3) * 0.08,
          }}
          animate={{ y: [0, -10, 0], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: i * 0.6 }}
        >
          {i % 2 === 0 ? "❤" : "♡"}
        </motion.span>
      ))}

      {/* Title — stays well above cards */}
      <div className="absolute top-[6%] text-center z-20 w-full px-4 pointer-events-none">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-xs tracking-[0.35em] uppercase text-white/45 mb-2">
          Mi niña hermosa
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-serif-display italic text-2xl md:text-4xl text-rose-200 drop-shadow-[0_0_15px_rgba(255,160,160,0.3)]">
          Desliza para ver la perfección
        </motion.h2>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} transition={{ delay: 0.8 }}
          className="mt-2 text-rose-400/70 text-xs tracking-[0.9em]">
          ♡ ♡ ♡
        </motion.div>
      </div>

      {/* Polaroid stack */}
      <div className="relative w-[270px] h-[330px] md:w-[350px] md:h-[440px] mt-[8vh] z-10">
        <AnimatePresence>
          {cards.map((card, index) => {
            const isTop = index === cards.length - 1;
            return (
              <motion.div
                key={card.id}
                className="absolute inset-0 bg-[#f9f9f9] p-4 md:p-5 pb-14 md:pb-18 shadow-[0_20px_45px_rgba(0,0,0,0.65)] rounded-sm flex flex-col items-center cursor-grab active:cursor-grabbing origin-bottom"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{
                  scale: isTop ? 1 : 1 - (cards.length - 1 - index) * 0.05,
                  opacity: 1,
                  y: (cards.length - 1 - index) * -12,
                  rotate: card.rotate,
                }}
                exit={{ x: index % 2 === 0 ? 420 : -420, opacity: 0, rotate: index % 2 === 0 ? 28 : -28, transition: { duration: 0.5 } }}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                whileDrag={{ scale: 1.05, rotateY: 10, rotateX: 5 }}
                onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 100) setCards(p => p.filter(c => c.id !== card.id)); }}
                whileHover={isTop ? { scale: 1.02 } : {}}
              >
                {/* Tape */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 md:w-28 h-7 bg-white/55 backdrop-blur-md shadow-sm rotate-2 z-20 border border-white/80" />
                {/* Photo area */}
                <div className="w-full h-full bg-neutral-200 flex items-center justify-center overflow-hidden border border-black/10 shadow-inner">
                  <span className="text-black/25 text-xs text-center px-4">[Sube tu foto a public/]</span>
                </div>
                {/* Caption */}
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  className="absolute bottom-3 md:bottom-4 font-serif-display italic text-[#333] text-lg md:text-xl text-center w-full px-2">
                  {card.text}
                </motion.p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Swipe hint */}
      {cards.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} transition={{ delay: 1.8 }}
          className="absolute bottom-7 text-[10px] tracking-[0.35em] uppercase text-white/40"
        >
          ← desliza →
        </motion.p>
      )}

      {/* CTA when all cards swiped */}
      <AnimatePresence>
        {cards.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute z-20">
            <button onClick={onNext}
              className="bg-rose-900 border border-rose-400 text-rose-50 px-10 md:px-14 py-4 md:py-5 tracking-[0.2em] text-xs md:text-sm uppercase hover:bg-rose-800 transition-all rounded-full shadow-[0_0_40px_rgba(225,29,72,0.5)]">
              Aún falta lo más importante...
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}