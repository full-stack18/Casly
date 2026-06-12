"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from "./Typewriter";

function LoveCounterSentence() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const start = new Date("2022-05-14T00:00:00").getTime();
    const update = () => {
      const diff = Date.now() - start;
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 1.2 }}
      className="font-serif-display italic text-center text-rose-200/75 text-sm md:text-base leading-relaxed tracking-wide max-w-md px-6"
    >
      Llevamos{" "}
      <span className="text-rose-300 font-semibold">{time.days}</span> días,{" "}
      <span className="text-rose-300 font-semibold">{time.hours}</span> horas,{" "}
      <span className="text-rose-300 font-semibold">{time.minutes}</span> minutos y{" "}
      <span className="text-rose-300 font-semibold">{time.seconds}</span> segundos conociéndonos…
      y cada uno ha valido la pena.
    </motion.p>
  );
}

export default function Act3({ onNext }: { onNext: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="w-full h-full flex flex-col items-center justify-center relative bg-[#050508] overflow-hidden">

      {/* Ambient rose glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.05, 0.12, 0.05] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        style={{ background: "radial-gradient(ellipse at 50% 65%, rgba(201,100,100,0.22) 0%, transparent 68%)" }}
      />

      {/* Floating petals */}
      {[...Array(6)].map((_, i) => (
        <motion.div key={`fp-${i}`}
          className="absolute pointer-events-none text-rose-400/30 select-none"
          style={{ left: `${6 + i * 16}%`, top: "-4%", fontSize: `${11 + (i % 3) * 3}px` }}
          animate={{ y: ["0vh", "108vh"], x: [0, Math.sin(i * 1.2) * 55], rotate: [0, 280], opacity: [0, 0.5, 0.5, 0] }}
          transition={{ duration: 14 + i * 2.5, repeat: Infinity, delay: i * 2.2, ease: "linear" }}
        >
          ❀
        </motion.div>
      ))}

      {/* Tap hint */}
      <AnimatePresence>
        {!isOpen && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: [0.4, 1, 0.4] }} exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-[8%] text-xs tracking-[0.3em] uppercase text-white/60 z-10"
          >
            Toca el sobre
          </motion.p>
        )}
      </AnimatePresence>

      {/* Counter — only when envelope closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute top-[16%] w-full flex justify-center z-10 px-4"
          >
            <LoveCounterSentence />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ENVELOPE + LETTER ─────────────────────────────────────────── */}
      {/* Strategy: The envelope stays fixed in the lower half of the screen.
          When opened, the letter expands UPWARD as a fixed overlay panel
          above the envelope, so it never bleeds outside the viewport. */}

      {/* Letter panel — shown as fixed overlay when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center z-30 px-4 pointer-events-none"
          >
            {/* Letter card — constrained to viewport height */}
            <div
              className="relative bg-[#fdfbf7] shadow-2xl rounded-sm flex flex-col pointer-events-auto"
              style={{
                width: "min(600px, 88vw)",
                maxHeight: "78vh",
              }}
            >
              {/* Tape strip */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 md:w-32 h-7 bg-white/60 backdrop-blur-md shadow-sm rotate-1 z-20 border border-white/80" />

              {/* Scrollable content */}
              <div className="overflow-y-auto flex-1 p-6 md:p-10" style={{ scrollbarWidth: "none" }}>
                <h2 className="font-serif-display italic text-xl md:text-3xl text-rose-900 mb-5 border-b border-rose-200/50 pb-4 w-full text-center">
                  Para mi princesa,
                </h2>

                <div className="font-serif-display text-gray-800 text-base md:text-lg leading-loose tracking-wide text-justify w-full">
                  <Typewriter
                    delay={0.2}
                    speed={35}
                    text="Desde el momento en que te vi, hace ya tantos años, no he dejado de pensar en ti un sólo día. Y ahora que vuelvo a estar contigo sufro una agonía... Soy prisionero del beso que nunca debiste haberme dado; mi corazón late esperando que ese beso no deje cicatriz alguna. Estás muy dentro de mi alma, atormentándome. Qué puedo hacer, haré todo lo que me pidas."
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 14 }}
                  className="mt-8 text-center font-serif-display italic text-rose-800 text-2xl md:text-3xl font-bold"
                >
                  Te amo ❤
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 15 }}
                  onClick={(e) => { e.stopPropagation(); onNext(); }}
                  className="mt-6 mb-2 mx-auto block bg-rose-900 text-rose-50 px-10 py-3 text-xs md:text-sm tracking-widest uppercase hover:bg-rose-800 transition-all rounded-full shadow-lg"
                >
                  Siguiente
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Envelope — fixed at bottom center */}
      <motion.div
        onClick={() => !isOpen && setIsOpen(true)}
        className={`relative z-10 shrink-0 ${!isOpen ? "cursor-pointer hover:scale-105 transition-transform duration-500" : "opacity-30"}`}
        style={{ width: "min(580px, 86vw)", aspectRatio: "4/2.5" }}
        animate={isOpen ? { y: "12vh" } : { y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Envelope body */}
        <div className="absolute inset-0 bg-[#d4c5b0] rounded-sm shadow-2xl" />

        {/* Envelope SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polygon points="0,0 50,55 100,0 100,100 0,100" fill="#e0d2bf" />
          <polygon points="0,100 50,55 100,100" fill="#cbbba3" />
        </svg>

        {/* Wax seal */}
        {!isOpen && (
          <div className="absolute z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-20 md:h-20 bg-rose-900 rounded-full shadow-xl flex items-center justify-center border-[3px] border-rose-950">
            <span className="text-rose-200 text-2xl md:text-4xl font-serif-display italic">C</span>
          </div>
        )}

        {/* Envelope flap */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 origin-top"
          animate={isOpen ? { rotateX: 180, opacity: 0 } : { rotateX: 0 }}
          transition={{ duration: 0.8 }}
        >
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <polygon points="0,0 100,0 50,55" fill="#ecd5b8" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}