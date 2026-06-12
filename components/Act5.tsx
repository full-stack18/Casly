"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Act5({ onRestart }: { onRestart: () => void }) {
  const [accepted, setAccepted] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 120, y: 80 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!accepted || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;

    let particles: any[] = [];
    for(let i=0; i<80; i++) {
      particles.push({ x: Math.random() * canvas.width, y: canvas.height + Math.random() * 500, size: Math.random() * 15 + 10, speed: Math.random() * 3 + 2, swing: Math.random() * 3, swingSpeed: Math.random() * 0.05, angle: Math.random() * Math.PI * 2 });
    }

    let animId: number;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#E11D48";
      particles.forEach(p => {
        p.y -= p.speed; p.angle += p.swingSpeed;
        const x = p.x + Math.sin(p.angle) * p.swing;
        ctx.save(); ctx.translate(x, p.y); ctx.font = `${p.size}px Arial`; ctx.fillText("❤", 0, 0); ctx.restore();
        if(p.y < -50) p.y = canvas.height + 50;
      });
      animId = requestAnimationFrame(render);
    }
    render();
    return () => cancelAnimationFrame(animId);
  }, [accepted]);

  // Algoritmo Anti-Superposición para el botón NO
  const dodgeHover = () => {
    if (accepted) return;
    // Calculamos un ángulo aleatorio en 360 grados
    const angle = Math.random() * Math.PI * 2;
    // Distancia mínima de 160px desde el centro (El botón SÍ mide aprox 200px de ancho, por lo que 160 de radio es 100% seguro)
    // Distancia máxima 250px para que no se salga de la pantalla.
    const distance = Math.random() * 90 + 160; 
    
    setNoPosition({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    });
  };

  return (
    <section className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-[#050508] px-4">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {!accepted && (
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="absolute inset-0 bg-rose-700/30 blur-[80px] rounded-full w-[300px] h-[300px] md:w-[600px] md:h-[600px] m-auto z-0 pointer-events-none" />
      )}

      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div key="question" className="z-10 flex flex-col items-center w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}>
            
            <h1 className="font-serif-display italic text-3xl md:text-5xl lg:text-6xl mb-16 md:mb-24 text-center leading-tight drop-shadow-2xl">
              Asly Melanie Rodriguez Reyes...<br/>
              <span className="text-rose-300">¿Quieres ser mi novia?</span>
            </h1>

            {/* Contenedor Cuadrado Centrado. Todo ocurre respecto al centro absoluto. */}
            <div className="relative flex items-center justify-center w-full max-w-[400px] h-[250px]">
              
              {/* Botón SÍ: FIJO EN EL CENTRO (x:0, y:0) */}
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: "0px 0px 40px rgba(255, 180, 180, 0.6)" }} whileTap={{ scale: 0.9 }}
                onClick={() => setAccepted(true)}
                className="absolute z-20 px-10 py-4 md:px-14 md:py-5 bg-white text-rose-900 font-serif-display text-2xl md:text-3xl rounded-full shadow-2xl transition-shadow"
              >
                Sí, quiero ❤
              </motion.button>

              {/* Botón NO: SE MUEVE EN RADIO SEGURO */}
              <motion.button
                onMouseEnter={dodgeHover} onClick={dodgeHover}
                animate={{ x: noPosition.x, y: noPosition.y }}
                transition={{ type: "spring", stiffness: 250, damping: 15 }}
                className="absolute z-10 px-8 py-3 md:px-10 md:py-4 border border-white/20 text-white/60 font-serif-display text-lg md:text-xl rounded-full bg-black/60 backdrop-blur-md cursor-pointer"
              >
                No
              </motion.button>

            </div>
          </motion.div>
        ) : (
          <motion.div key="accepted" className="z-20 flex flex-col items-center justify-center w-full h-full text-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="fixed inset-0 bg-white pointer-events-none z-0" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} />

            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, type: "spring" }} className="z-10 flex flex-col items-center">
              <h2 className="font-serif-display italic text-5xl md:text-8xl text-rose-300 mb-4 drop-shadow-[0_0_30px_rgba(255,180,180,0.5)]">
                ¡Te amo, Asly!
              </h2>
              <p className="text-[10px] md:text-sm tracking-[0.4em] uppercase text-white/80 font-light mb-16">
                El inicio de nuestra historia
              </p>

              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} onClick={onRestart}
                className="flex items-center justify-center gap-2 border border-white/20 px-8 py-3 rounded-full text-[10px] md:text-xs tracking-widest uppercase text-white/60 hover:bg-white/10 hover:text-white transition-all"
              >
                <span className="text-lg leading-none">⟲</span> Volver a ver
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}