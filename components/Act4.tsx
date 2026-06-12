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
      <div className="absolute top-[10%] text-center z-0 w-full px-4">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/50 mb-3">
          Mi niña hermosa
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-serif-display italic text-3xl md:text-5xl text-rose-200 drop-shadow-md">
          Desliza para ver la perfección
        </motion.h2>
      </div>

      <div className="relative w-[300px] h-[380px] md:w-[400px] md:h-[500px] mt-16 z-10 perspective-[1500px]">
        <AnimatePresence>
          {cards.map((card, index) => {
            const isTop = index === cards.length - 1;
            return (
              <motion.div
                key={card.id}
                className="absolute inset-0 bg-[#f9f9f9] p-4 md:p-5 pb-20 md:pb-24 shadow-[0_20px_40px_rgba(0,0,0,0.6)] rounded-sm flex flex-col items-center cursor-grab active:cursor-grabbing origin-bottom"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: isTop ? 1 : 1 - (cards.length - 1 - index) * 0.05, opacity: 1, y: (cards.length - 1 - index) * -15, rotate: card.rotate }}
                exit={{ x: index % 2 === 0 ? 400 : -400, opacity: 0, rotate: index % 2 === 0 ? 30 : -30, transition: { duration: 0.5 } }}
                drag={isTop ? "x" : false} 
                dragConstraints={{ left: 0, right: 0 }}
                // Física 3D brutal al arrastrar
                whileDrag={{ scale: 1.05, rotateY: 10, rotateX: 5 }}
                onDragEnd={(e, info) => { if (Math.abs(info.offset.x) > 100) setCards(p => p.filter(c => c.id !== card.id)); }}
                whileHover={isTop ? { scale: 1.02 } : {}}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 md:w-32 h-8 md:h-10 bg-white/50 backdrop-blur-md shadow-sm rotate-2 z-20 border border-white/80" />
                <div className="w-full h-full bg-neutral-200 flex items-center justify-center overflow-hidden border border-black/10 shadow-inner">
                   <span className="text-black/30 text-xs text-center px-4">[Sube tu foto a public/]</span>
                </div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="absolute bottom-5 md:bottom-8 font-serif-display italic text-[#333] text-xl md:text-2xl text-center w-full px-2">
                  {card.text}
                </motion.p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {cards.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute z-20 mt-[35vh]">
            <button onClick={onNext} className="bg-rose-900 border border-rose-400 text-rose-50 px-10 md:px-14 py-4 md:py-5 tracking-[0.2em] text-xs md:text-sm uppercase hover:bg-rose-800 transition-all rounded-full shadow-[0_0_40px_rgba(225,29,72,0.5)]">
              Aún falta lo más importante...
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}