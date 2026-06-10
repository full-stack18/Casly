// components/Act4.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHOTOS = [
  { id: 1, src: "/foto1.jpg", text: "Tu sonrisa ilumina mi mundo", rotate: -3 },
  { id: 2, src: "/foto2.jpg", text: "Cada momento contigo es único", rotate: 2 },
  { id: 3, src: "/foto3.jpg", text: "Eres mi casualidad favorita", rotate: -4 },
  { id: 4, src: "/foto4.jpg", text: "Y esto es solo el comienzo...", rotate: 3 },
];

export default function Act4({ onNext }: { onNext: () => void }) {
  const [cards, setCards] = useState(PHOTOS);

  return (
    <section className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-[#050508] px-4">
      <div className="absolute top-[12%] text-center z-0 w-full px-4">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs tracking-[0.3em] uppercase text-white/50 mb-2">
          Nuestra historia
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-serif-display italic text-3xl text-rose-200">
          Desliza para recordar
        </motion.h2>
      </div>

      <div className="relative w-[280px] h-[350px] mt-16 z-10 perspective-1000">
        <AnimatePresence>
          {cards.map((card, index) => {
            const isTop = index === cards.length - 1;
            return (
              <motion.div
                key={card.id}
                className="absolute inset-0 bg-[#f9f9f9] p-3 pb-16 shadow-[0_15px_35px_rgba(0,0,0,0.5)] rounded-sm flex flex-col items-center cursor-grab active:cursor-grabbing origin-bottom"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ 
                  scale: isTop ? 1 : 1 - (cards.length - 1 - index) * 0.05, 
                  opacity: 1, y: (cards.length - 1 - index) * -15, rotate: card.rotate 
                }}
                exit={{ x: index % 2 === 0 ? 300 : -300, opacity: 0, rotate: 20, transition: { duration: 0.4 } }}
                drag={isTop ? "x" : false} dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => { if (Math.abs(info.offset.x) > 80) setCards(p => p.filter(c => c.id !== card.id)); }}
                whileHover={isTop ? { scale: 1.02 } : {}}
              >
                {/* Cuadro de la imagen (Coloca tu etiqueta <img src={card.src} /> aquí dentro) */}
                <div className="w-full h-full bg-neutral-200 flex items-center justify-center overflow-hidden border border-black/5 shadow-inner">
                   <span className="text-black/30 text-[10px] text-center px-4">[Imagen aquí]</span>
                </div>
                
                {/* Texto suave */}
                <motion.p 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  className="absolute bottom-4 font-serif-display italic text-[#333] text-lg text-center w-full px-2"
                >
                  {card.text}
                </motion.p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {cards.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute z-20 mt-[30vh]">
            <button onClick={onNext} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 tracking-[0.2em] text-xs uppercase hover:bg-rose-900/40 hover:border-rose-400 transition-all rounded-full">
              Continuar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}