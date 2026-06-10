// components/Act2.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const WORDS = ["amor", "magia", "tú", "destino", "paz", "alma", "corazón", "nosotros", "eternidad", "luz"];

type Star = {
  x: number; y: number; ox: number; oy: number;
  r: number; baseAlpha: number; glow: number;
  word: string | null; phase: number; blinkSpeed: number;
};

export default function Act2() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.5, once: true });
  const [activeWord, setActiveWord] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!isInView) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let stars: Star[] = [];
    let mouse = { x: -9999, y: -9999 };

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      buildStars();
    }

    function buildStars() {
      const count = Math.floor((canvas.width * canvas.height) / 6000); // Densidad perfecta
      stars = Array.from({ length: count }, (_, i) => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return { 
          x, y, ox: x, oy: y, 
          r: Math.random() * 1.5 + 0.5, // Tamaños variados
          baseAlpha: Math.random() * 0.5 + 0.1, 
          glow: 0,
          word: i < WORDS.length ? WORDS[i] : null,
          phase: Math.random() * Math.PI * 2,
          blinkSpeed: Math.random() * 0.02 + 0.005 // Velocidad de parpadeo realista
        };
      });
    }

    let lastWord = "";
    let wordTimer: ReturnType<typeof setTimeout>;

    function draw(t: number) {
      // Fondo muy oscuro con un ligero gradiente
      const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
      gradient.addColorStop(0, "rgba(10, 6, 8, 0.4)");
      gradient.addColorStop(1, "rgba(2, 1, 3, 0.8)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar constelaciones (líneas)
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.strokeStyle = `rgba(201,160,160,${(1 - d / 120) * 0.15})`; // Líneas color rosa tenue
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }

      let hov: Star | null = null;
      stars.forEach(s => {
        // Movimiento flotante natural
        s.x = s.ox + Math.sin(t * 0.0002 + s.phase) * 3;
        s.y = s.oy + Math.cos(t * 0.00015 + s.phase * 1.3) * 2;
        
        // Interacción con el mouse
        const dx = mouse.x - s.x; const dy = mouse.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < (s.word ? 60 : 40)) {
          s.glow = Math.min(1, s.glow + 0.1);
          if (s.word) hov = s;
        } else {
          s.glow = Math.max(0, s.glow - 0.05);
        }

        // Efecto de parpadeo realista (Twinkle)
        const twinkle = Math.abs(Math.sin(t * s.blinkSpeed + s.phase)) * 0.5;
        const currentAlpha = Math.min(1, s.baseAlpha + twinkle + s.glow);

        const rr = s.r + s.glow * 3;
        
        // Resplandor exterior (Glow)
        if (s.glow > 0.1 || s.word) {
          ctx.beginPath(); ctx.arc(s.x, s.y, rr + 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201,160,160,${(s.glow + 0.1) * 0.15})`; 
          ctx.fill();
        }

        // Estrella central
        ctx.beginPath(); ctx.arc(s.x, s.y, rr, 0, Math.PI * 2);
        ctx.fillStyle = s.word 
          ? `rgba(255,220,220,${currentAlpha + 0.3})` // Estrellas con palabras brillan más
          : `rgba(240,236,228,${currentAlpha})`;
        ctx.fill();
      });

      if (hov && (hov as Star).word !== lastWord) {
        lastWord = (hov as Star).word!;
        const rect = canvas.getBoundingClientRect();
        setActiveWord({ text: (hov as Star).word!, x: (hov as Star).x + rect.left + 15, y: (hov as Star).y + rect.top - 25 });
        clearTimeout(wordTimer);
        wordTimer = setTimeout(() => { setActiveWord(null); lastWord = ""; }, 2000);
      }

      animId = requestAnimationFrame(draw);
    }

    function onMove(cx: number, cy: number) {
      const r = canvas.getBoundingClientRect();
      mouse = { x: cx - r.left, y: cy - r.top };
    }
    
    canvas.addEventListener("mousemove", e => onMove(e.clientX, e.clientY));
    canvas.addEventListener("touchmove", e => { e.preventDefault(); onMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
    canvas.addEventListener("mouseleave", () => { mouse = { x: -9999, y: -9999 }; });

    resize();
    window.addEventListener("resize", resize);
    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      clearTimeout(wordTimer);
    };
  }, [isInView]);

  return (
    <section id="act2" ref={sectionRef} className="min-h-svh scroll-snap-start relative flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 text-center pointer-events-none">
        <motion.p className="text-[0.75rem] tracking-[0.4em] uppercase mb-3 font-light" style={{ color: "var(--ink-dim)" }}>
          Un universo para ti
        </motion.p>
        <motion.p className="text-[0.65rem] tracking-[0.2em] italic" style={{ color: "var(--rose-bright)" }}>
          Pasa tu dedo por las estrellas...
        </motion.p>
      </div>

      {activeWord && (
        <motion.span
          key={activeWord.text}
          className="fixed font-serif-display italic text-2xl pointer-events-none z-50 drop-shadow-lg"
          style={{ 
            left: activeWord.x, top: activeWord.y, 
            color: "var(--rose-bright)",
            textShadow: "0 0 15px rgba(201,160,160,0.8)" 
          }}
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          {activeWord.text}
        </motion.span>
      )}
    </section>
  );
}