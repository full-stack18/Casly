// components/Act3.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Typewriter from "./Typewriter";

export default function Act3({ onNext }: { onNext: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="w-full h-full flex flex-col items-center justify-center relative px-4 bg-[#050508]">
      {!isOpen && (
        <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute top-20 text-xs tracking-[0.3em] uppercase text-white/70">
          Toca el sobre
        </motion.p>
      )}

      {/* Contenedor del Sobre (Medidas exactas para no deformarse 340x220) */}
      <motion.div 
        onClick={() => setIsOpen(true)}
        className={`relative w-[340px] h-[220px] cursor-pointer transition-transform duration-700 ${isOpen ? 'translate-y-20' : 'hover:scale-105'}`}
      >
        {/* Fondo del sobre */}
        <div className="absolute inset-0 bg-[#d4c5b0] shadow-2xl rounded-sm" />
        
        {/* La Carta - Ahora no se sale volando, sube solo lo necesario */}
        <motion.div 
          className="absolute left-2 right-2 bg-[#fdfbf7] p-5 shadow-xl rounded-sm flex flex-col items-center text-center overflow-hidden"
          initial={{ y: 0, height: "90%" }}
          animate={isOpen ? { y: -260, height: "auto", zIndex: 50 } : { y: 0, height: "90%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="w-full max-h-[350px] overflow-y-auto overflow-x-hidden scrollbar-hide">
              <h2 className="font-serif-display italic text-2xl text-rose-900 mb-4 border-b border-rose-200/50 pb-2">
                Para mi princesa,
              </h2>
              
              <div className="font-serif-display text-gray-800 text-sm leading-relaxed tracking-wide text-justify px-2">
                <Typewriter 
                  delay={0.2}
                  text="Desde el momento en que te vi, hace ya tantos años, no he dejado de pensar en ti un sólo día. Y ahora que vuelvo a estar contigo sufro una agonía... Soy prisionero del beso que nunca debiste haberme dado; mi corazón late esperando que ese beso no deje cicatriz alguna. Estás muy dentro de mi alma, atormentándome. Qué puedo hacer, haré todo lo que me pidas." 
                />
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="mt-6 mb-2 bg-rose-900 text-rose-50 px-8 py-2 text-[10px] tracking-widest uppercase hover:bg-rose-800 transition-all rounded-full"
              >
                Siguiente
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* CSS Solapas Triangulares Perfectas */}
        <div className="absolute inset-0 pointer-events-none z-10 w-0 h-0" 
             style={{ borderLeft: '170px solid #e0d2bf', borderRight: '170px solid #e0d2bf', borderBottom: '110px solid #cbbba3', borderTop: '110px solid transparent' }} />
        
        {!isOpen && (
          <div className="absolute z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-rose-900 rounded-full shadow-lg flex items-center justify-center border-2 border-rose-950">
             <span className="text-rose-200 text-xl font-serif-display italic">C</span>
          </div>
        )}

        {/* Solapa Superior que se abre */}
        <motion.div 
          className="absolute top-0 left-0 right-0 z-20 pointer-events-none origin-top w-0 h-0"
          style={{ borderTop: '110px solid #ebdncb', borderLeft: '170px solid transparent', borderRight: '170px solid transparent' }}
          animate={isOpen ? { rotateX: 180, opacity: 0 } : { rotateX: 0 }}
          transition={{ duration: 0.8 }}
        />
      </motion.div>
    </section>
  );
}