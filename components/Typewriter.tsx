"use client";
import { motion, Variants } from "framer-motion"; // <-- Importamos Variants

export default function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const letters = Array.from(text);

  // Le indicamos a TypeScript que esto es de tipo Variants
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay },
    },
  };

  // También le indicamos el tipo aquí
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
      className="inline-flex flex-wrap"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}