"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Typewriter from "./Typewriter";

export default function Act3({ onNext }: { onNext: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="w-full h-full flex flex-col items-center justify-center relative px-4 bg-[#050508]">
      {!isOpen && (
        <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute top-[15%] text-xs md:text-sm tracking-[0.3em] uppercase text-white/70">
          Toca el sobre
        </motion.p>
      )}

      {/* Sobre 100% Responsive - Mejorado para Laptop y Móvil */}
      <motion.div 
        onClick={() => setIsOpen(true)}
        className={`relative w-full max-w-[400px] md:max-w-[650px] aspect-[4/2.5] cursor-pointer transition-transform duration-700 ${isOpen ? 'translate-y-[20vh]' : 'hover:scale-105'}`}
      >
        <div className="absolute inset-0 bg-[#d4c5b0] shadow-2xl rounded-sm" />
        
        {/* La Carta - Ahora sale justo lo necesario para leerse bien */}
        <motion.div 
          className="absolute left-[4%] right-[4%] bg-[#fdfbf7] shadow-xl rounded-sm flex flex-col overflow-hidden"
          initial={{ bottom: "5%", top: "5%" }}
          animate={isOpen ? { bottom: "40%", top: "-110%", zIndex: 50 } : { bottom: "5%", top: "5%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="w-full h-full p-6 md:p-10 flex flex-col items-center overflow-y-auto scrollbar-hide">
              <h2 className="font-serif-display italic text-2xl md:text-4xl text-rose-900 mb-6 border-b border-rose-200/50 pb-4 w-full text-center">
                Para mi princesa,
              </h2>
              
              {/* Texto justificado para máxima elegancia */}
              <div className="font-serif-display text-gray-800 text-sm md:text-lg leading-loose md:leading-relaxed tracking-wide text-justify w-full">
                <Typewriter 
                  delay={0.2}
                  speed={35}
                  text="Desde el momento en que te vi, hace ya tantos años, no he dejado de pensar en ti un sólo día. Y ahora que vuelvo a estar contigo sufro una agonía... Soy prisionero del beso que nunca debiste haberme dado; mi corazón late esperando que ese beso no deje cicatriz alguna. Estás muy dentro de mi alma, atormentándome. Qué puedo hacer, haré todo lo que me pidas." 
                />
              </div>

              {/* El hermoso Te amo final */}
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 14 }} className="mt-8 text-center font-serif-display italic text-rose-800 text-2xl md:text-3xl font-bold">
                Te amo ❤
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 15 }} 
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="mt-8 mb-4 bg-rose-900 text-rose-50 px-10 py-3 text-xs md:text-sm tracking-widest uppercase hover:bg-rose-800 transition-all rounded-full shadow-lg"
              >
                Siguiente
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Vector SVG del Sobre */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 drop-shadow-md" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polygon points="0,0 50,55 100,0 100,100 0,100" fill="#e0d2bf" />
          <polygon points="0,100 50,55 100,100" fill="#cbbba3" />
        </svg>
        
        {!isOpen && (
          <div className="absolute z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-20 md:h-20 bg-rose-900 rounded-full shadow-xl flex items-center justify-center border-[3px] border-rose-950">
             <span className="text-rose-200 text-2xl md:text-4xl font-serif-display italic">C</span>
          </div>
        )}

        <motion.div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 origin-top" animate={isOpen ? { rotateX: 180, opacity: 0 } : { rotateX: 0 }} transition={{ duration: 0.8 }}>
          <svg className="w-full h-full drop-shadow-lg" preserveAspectRatio="none" viewBox="0 0 100 100">
            <polygon points="0,0 100,0 50,55" fill="#ecd5b8" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}