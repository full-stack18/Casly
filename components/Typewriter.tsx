"use client";
import { motion, Variants } from "framer-motion";

export default function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  // Separamos por palabras para que no se rompan a la mitad
  const words = text.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay },
    },
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 12, stiffness: 200 },
    },
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  };

  return (
    <motion.span
      className="inline-flex flex-wrap gap-x-[0.25em]"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex overflow-hidden">
          {Array.from(word).map((letter, letterIndex) => (
            <motion.span key={letterIndex} variants={child}>
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
}