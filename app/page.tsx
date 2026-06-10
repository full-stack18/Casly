// app/page.tsx
import Act1 from "@/components/Act1";
import Act2 from "@/components/Act2";
import Act3 from "@/components/Act3";
import Act4 from "@/components/Act4";
import Act5 from "@/components/Act5";
import NavDots from "@/components/NavDots";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <main className="relative bg-[#050508] text-white">
      <NavDots />
      <Act1 />
      
      <ScrollReveal>
        <Act2 />
      </ScrollReveal>
      
      <ScrollReveal>
        <Act3 />
      </ScrollReveal>
      
      <ScrollReveal>
        <Act4 />
      </ScrollReveal>
      
      <ScrollReveal>
        <Act5 />
      </ScrollReveal>
    </main>
  );
}