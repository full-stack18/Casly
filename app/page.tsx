import Act1 from "@/components/Act1";
import Act2 from "@/components/Act2";
import Act3 from "@/components/Act3";
import Act4 from "@/components/Act4";
import Act5 from "@/components/Act5";
import NavDots from "@/components/NavDots";

export default function Home() {
  return (
    <main className="relative">
      <NavDots />
      <Act1 />
      <Act2 />
      <Act3 />
      <Act4 />
      <Act5 />
    </main>
  );
}