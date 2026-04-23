"use client";

import { useScrumStore } from "@/lib/store/scrum-store";
import { Sidebar } from "@/components/scrum/Sidebar";
import { Section1Welcome } from "@/components/scrum/sections/Section1Welcome";
import { Section2Agile } from "@/components/scrum/sections/Section2Agile";
import { Section3Scrum } from "@/components/scrum/sections/Section3Scrum";
import { Section4Process } from "@/components/scrum/sections/Section4Process";
import { Section5Architecture } from "@/components/scrum/sections/Section5Architecture";
import { Section6Debt } from "@/components/scrum/sections/Section6Debt";
import { Section7Quiz } from "@/components/scrum/sections/Section7Quiz";
import { XPToast } from "@/components/scrum/gamification/XPToast";
import { BadgeUnlock } from "@/components/scrum/gamification/BadgeUnlock";

function SectionContent() {
  const { currentSection } = useScrumStore();
  switch (currentSection) {
    case 1: return <Section1Welcome />;
    case 2: return <Section2Agile />;
    case 3: return <Section3Scrum />;
    case 4: return <Section4Process />;
    case 5: return <Section5Architecture />;
    case 6: return <Section6Debt />;
    case 7: return <Section7Quiz />;
    default: return <Section1Welcome />;
  }
}

export default function Home() {
  const { currentSection } = useScrumStore();

  return (
    <>
      {/* Componentes de gamificación — siempre presentes en el DOM */}
      <XPToast />
      <BadgeUnlock />

      {currentSection === 1 ? (
        <div style={{ minHeight: "100vh", background: "var(--sl-bg)" }}>
          <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
          <main id="main-content">
            <Section1Welcome />
          </main>
        </div>
      ) : (
        <div style={{ display: "flex", height: "100vh", background: "var(--sl-bg)", overflow: "hidden" }}>
          <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
          <Sidebar />
          <main
            id="main-content"
            tabIndex={-1}
            style={{ flex: 1, overflowY: "auto", background: "var(--sl-bg)" }}
          >
            <SectionContent />
          </main>
        </div>
      )}
    </>
  );
}
