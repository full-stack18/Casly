"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Act5({ onRestart }: { onRestart: () => void }) {
  const [accepted, setAccepted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });

  // Lógica de Canvas para corazones FLUIDOS a 60FPS
  useEffect(() => {
    if (!accepted || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: any[] = [];
    for(let i=0; i<80; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: canvas.height + Math.random() * 500,
        size: Math.random() * 15 + 10, speed: Math.random() * 3 + 2,
        swing: Math.random() * 3, swingSpeed: Math.random() * 0.05, angle: Math.random() * Math.PI * 2
      });
    }

    let animId: number;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#E11D48"; // Color rosa/rojo
      ctx.font = "24px Arial";
      
      particles.forEach(p => {
        p.y -= p.speed;
        p.angle += p.swingSpeed;
        const x = p.x + Math.sin(p.angle) * p.swing;
        
        ctx.save();
        ctx.translate(x, p.y);
        ctx.font = `${p.size}px Arial`;
        ctx.fillText("❤", 0, 0);
        ctx.restore();

        if(p.y < -50) p.y = canvas.height + 50;
      });
      animId = requestAnimationFrame(render);
    }
    render();
    return () => cancelAnimationFrame(animId);
  }, [accepted]);

  // Lógica segura para el botón No (nunca sale de la pantalla)
  const dodgeHover = () => {
    if (accepted || !containerRef.current) return;
    const box = containerRef.current.getBoundingClientRect();
    const maxX = box.width / 2.5; 
    const maxY = 100;
    setNoPosition({
      x: (Math.random() - 0.5) * maxX * 2,
      y: (Math.random() - 0.5) * maxY * 2
    });
  };

  return (
    <section ref={containerRef} className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden px-4">
      
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div key="question" className="z-10 flex flex-col items-center w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}>
            <h1 className="font-serif-display italic text-4xl md:text-6xl mb-20 text-center leading-tight">
              Después de todo esto...<br/>
              <span className="text-rose-300">¿Quieres ser mi novia?</span>
            </h1>

            <div className="relative w-full max-w-md h-32 flex justify-center items-center">
              {/* Botón Sí */}
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: "0px 0px 40px rgba(255, 180, 180, 0.8)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAccepted(true)}
                className="absolute z-20 px-12 py-4 bg-white text-rose-900 font-serif-display text-2xl rounded-full transition-all"
              >
                Sí, quiero ❤
              </motion.button>

              {/* Botón No animado por Framer (Seguro y fluido) */}
              <motion.button
                onMouseEnter={dodgeHover}
                onClick={dodgeHover}
                animate={{ x: noPosition.x, y: noPosition.y }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="absolute z-10 px-12 py-4 border border-white/20 text-white/50 font-serif-display text-2xl rounded-full bg-black/50 backdrop-blur-sm"
              >
                No
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="accepted" className="z-20 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            {/* Resplandor blanco épico */}
            <motion.div className="fixed inset-0 bg-white pointer-events-none z-[-1]" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.5 }} />

            <h2 className="font-serif-display italic text-5xl md:text-7xl text-rose-300 drop-shadow-[0_0_30px_rgba(255,180,180,0.5)] mb-6">
              ¡Te amo, Casly!
            </h2>
            <p className="text-sm md:text-base tracking-[0.4em] uppercase text-white/80 mb-12">
              El inicio de nuestra historia.
            </p>

            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
              onClick={onRestart}
              className="border border-white/20 px-8 py-3 rounded-full text-xs tracking-widest uppercase hover:bg-white/10 transition-colors text-white/50 hover:text-white"
            >
              ⟲ Volver a ver
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}