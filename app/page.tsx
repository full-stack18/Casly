"use client";
import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Act1 from "@/components/Act1";
import Act2 from "@/components/Act2";
import Act3 from "@/components/Act3";
import Act4 from "@/components/Act4";
import Act5 from "@/components/Act5";

export default function Home() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const nextStep = () => setStep((s) => s + 1);
  const restart = () => {
    setStep(0);
    // Opcional: recargar la página para limpiar todo perfectamente
    // window.location.reload(); 
  };

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/wonderwall.mp3"); // Asegúrate de tener este archivo en tu carpeta 'public'
      audioRef.current.loop = true;
      audioRef.current.volume = 0;
    }
    if (!playing) {
      audioRef.current.play().catch(() => {});
      fadeAudio(audioRef.current, 0, 0.45, 2000);
      setPlaying(true);
    } else {
      fadeAudio(audioRef.current, 0.45, 0, 1000, () => audioRef.current?.pause());
      setPlaying(false);
    }
  };

  const acts = [
    <Act1 key="1" onNext={nextStep} onPlayMusic={toggleMusic} isPlaying={playing} />,
    <Act2 key="2" onNext={nextStep} />,
    <Act3 key="3" onNext={nextStep} />,
    <Act4 key="4" onNext={nextStep} />,
    <Act5 key="5" onRestart={restart} /> // Le pasamos la función de reiniciar
  ];

  return (
    <main className="relative bg-[#050508] text-white overflow-hidden h-svh w-full flex items-center justify-center font-sans">
      {step > 0 && step < 4 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={toggleMusic}
          className="absolute top-6 right-6 z-50 flex items-center gap-2 text-[0.68rem] tracking-[0.18em] mix-blend-difference"
          style={{ color: playing ? "var(--rose-bright, #ffb4b4)" : "var(--ink-faint, #ffffff80)" }}
        >
          <motion.span animate={playing ? { scale: [1, 1.3, 1] } : { scale: 1 }} transition={{ repeat: Infinity, duration: 1.2 }}>♪</motion.span>
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, filter: "blur(15px)", scale: 1.05 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ opacity: 0, filter: "blur(15px)", scale: 0.95 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center w-full h-full"
        >
          {acts[step]}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

function fadeAudio(a: HTMLAudioElement, from: number, to: number, dur: number, cb?: () => void) {
  const steps = 30;
  a.volume = from;
  let step = 0;
  const timer = setInterval(() => {
    step++;
    a.volume = Math.max(0, Math.min(1, from + (to - from) * (step / steps)));
    if (step >= steps) { clearInterval(timer); cb?.(); }
  }, dur / steps);
}