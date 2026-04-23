"use client";

import { useState, type ReactNode } from "react";

type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

export function TabPanel({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].id);

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar estilo guru */}
      <div
        className="flex flex-shrink-0"
        style={{ borderBottom: "1px solid var(--guru-border)", background: "#FAFAFA" }}
      >
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="flex-1 py-3 text-xs font-semibold transition-colors relative"
              style={{
                color: isActive ? "var(--guru-green-dark)" : "var(--guru-text-muted)",
                borderBottom: isActive
                  ? "2px solid var(--guru-green)"
                  : "2px solid transparent",
                background: isActive ? "var(--guru-green-light)" : "transparent",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto p-4">
        {tabs.map((tab) => (
          <div key={tab.id} className={active === tab.id ? "block" : "hidden"}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
