// components/Act4.tsx
"use client";
import { motion } from "framer-motion";
import Typewriter from "./Typewriter";

export default function Act4() {
  return (
    <section id="act4" className="min-h-svh scroll-snap-start flex flex-col items-center justify-center relative px-6 overflow-hidden">
      
      <motion.div className="text-center mb-12 z-0">
         <p className="text-[0.65rem] tracking-[0.3em] uppercase mb-4" style={{ color: "var(--ink-faint)" }}>
           Un recuerdo
         </p>
         <h2 className="font-serif-display text-2xl italic" style={{ color: "var(--rose-bright)" }}>
           <Typewriter text="Mueve la foto..." delay={0.2} />
         </h2>
      </motion.div>

      <motion.div
        drag
        dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
        whileHover={{ scale: 1.02, rotate: -2 }}
        whileTap={{ scale: 0.98, cursor: "grabbing" }}
        initial={{ y: 50, opacity: 0, rotate: 5 }}
        whileInView={{ y: 0, opacity: 1, rotate: -3 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-10 w-64 h-80 bg-[#f4f4f4] p-4 pb-16 shadow-2xl cursor-grab flex flex-col items-center justify-start rounded-sm"
      >
        {/* Aquí puedes poner un tag <img src="/tu-foto.jpg" /> */}
        <div className="w-full h-full bg-neutral-800 border border-neutral-700 flex items-center justify-center overflow-hidden">
          <span className="text-neutral-500 text-xs tracking-widest">[ Tu Foto Aquí ]</span>
        </div>
        <p className="absolute bottom-5 font-serif-display italic text-black text-lg">
          Tú y yo
        </p>
      </motion.div>

    </section>
  );
}