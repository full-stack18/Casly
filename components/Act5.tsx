"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const NO_TEXTS = [
  "No", "¿Segura?", "Piénsalo bien...", "En serio?",
  "Última oportunidad", "Nooo", "Por favor 🥺", "Dale al Sí va",
];

export default function Act5() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { amount: 0.5, once: true });
  const [noCount, setNoCount] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  const yesScale = 1 + noCount * 0.28;
  const noLabel = NO_TEXTS[Math.min(noCount, NO_TEXTS.length - 1)];
  const noOpacity = Math.max(0.08, 1 - noCount * 0.13);
  const noSize = Math.max(9, 14 - noCount * 0.6);

  function handleNo() {
    if (noCount >= NO_TEXTS.length - 1) return;
    setNoCount(c => c + 1);
    // jump to random spot around the button area
    setNoPos({
      x: (Math.random() - 0.5) * 340,
      y: (Math.random() - 0.5) * 160,
    });
  }

  return (
    <section
      id="act5"
      ref={ref}
      className="min-h-svh scroll-snap-start flex flex-col items-center justify-center gap-14 px-6 text-center relative overflow-hidden"
    >
      {/* subtle bg glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 2 }}
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(201,160,160,0.09) 0%, transparent 70%)",
        }}
      />

      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="question"
            className="flex flex-col items-center gap-14 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            transition={{ duration: 0.8 }}
          >
            {/* Question */}
            <div className="flex flex-col items-center gap-4">
              <motion.p
                className="text-[0.65rem] tracking-[0.38em] uppercase"
                style={{ color: "var(--ink-faint)" }}
                initial={{ opacity: 0, y: 8 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.3 }}
              >
                Una pregunta
              </motion.p>

              <motion.h2
                className="font-serif-display font-light leading-[1.35]"
                style={{
                  fontSize: "clamp(1.5rem, 5vw, 2.6rem)",
                  color: "var(--ink)",
                  maxWidth: 560,
                }}
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                Asly Melanie Rodríguez Reyes,<br />
                <span style={{ color: "var(--rose-bright)", fontStyle: "italic" }}>
                  ¿quieres ser mi novia?
                </span>
              </motion.h2>
            </div>

            {/* Buttons */}
            <motion.div
              className="relative flex items-center justify-center gap-8"
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              {/* SÍ */}
              <motion.button
                animate={{ scale: yesScale }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                whileHover={{ scale: yesScale * 1.06 }}
                whileTap={{ scale: yesScale * 0.96 }}
                onClick={() => setAccepted(true)}
                className="font-serif-display italic font-light relative overflow-hidden"
                style={{
                  fontSize: "clamp(1rem, 4vw, 1.4rem)",
                  border: "1px solid var(--rose)",
                  color: "var(--rose-bright)",
                  background: "transparent",
                  padding: "0.7em 2.2em",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <motion.span
                  className="absolute inset-0 origin-left"
                  style={{ background: "var(--rose)" }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10" style={{ mixBlendMode: "difference" }}>
                  Sí 💗
                </span>
              </motion.button>

              {/* NO — jumps away */}
              <motion.button
                animate={{ x: noPos.x, y: noPos.y, opacity: noOpacity }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                onClick={handleNo}
                className="font-light"
                style={{
                  fontSize: noSize,
                  color: "var(--ink-faint)",
                  background: "transparent",
                  border: "none",
                  cursor: noCount >= NO_TEXTS.length - 1 ? "default" : "pointer",
                  letterSpacing: "0.12em",
                  whiteSpace: "nowrap",
                }}
              >
                {noLabel}
              </motion.button>
            </motion.div>

            {/* hint after first no */}
            <AnimatePresence>
              {noCount > 0 && (
                <motion.p
                  key="hint"
                  className="text-[0.6rem] tracking-[0.2em] uppercase"
                  style={{ color: "var(--ink-faint)" }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {noCount < 4
                    ? "El no se escapa solo..."
                    : "Ya sé que vas a decir que sí 🌹"}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* ── ACCEPTED ── */
          <motion.div
            key="accepted"
            className="flex flex-col items-center gap-8 relative z-10"
            initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.p
              className="font-serif-display font-light italic leading-[1.5]"
              style={{
                fontSize: "clamp(1.8rem, 6vw, 3rem)",
                color: "var(--rose-bright)",
                maxWidth: 500,
              }}
            >
              Sabía que dirías que sí.
            </motion.p>
            <motion.p
              className="font-light tracking-[0.06em]"
              style={{
                fontSize: "clamp(0.85rem, 2vw, 1rem)",
                color: "var(--ink-dim)",
                maxWidth: 360,
                lineHeight: 1.8,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Eres la razón de todo esto.<br />Te quiero muchísimo, Casly. 🌹
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}