"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Design = "original" | "medicitas" | "arquitectura" | "bocetos";

type DesignContextValue = {
  activeDesign: Design;
  setActiveDesign: (d: Design) => void;
};

const DesignContext = createContext<DesignContextValue>({
  activeDesign: "original",
  setActiveDesign: () => {},
});

export function DesignProvider({ children }: { children: ReactNode }) {
  const [activeDesign, setActiveDesign] = useState<Design>("original");
  return (
    <DesignContext.Provider value={{ activeDesign, setActiveDesign }}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  return useContext(DesignContext);
}
