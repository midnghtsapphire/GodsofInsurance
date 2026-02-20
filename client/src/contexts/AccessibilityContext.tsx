import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AccessibilityMode = "none" | "eco" | "neuro" | "dyslexic" | "nobluelight";

interface AccessibilityContextType {
  mode: AccessibilityMode;
  setMode: (mode: AccessibilityMode) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  mode: "none",
  setMode: () => {},
  fontSize: 16,
  setFontSize: () => {},
});

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AccessibilityMode>(() => {
    return (localStorage.getItem("a11y-mode") as AccessibilityMode) || "none";
  });
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem("a11y-fontsize") || "16", 10);
  });

  useEffect(() => {
    localStorage.setItem("a11y-mode", mode);
    const root = document.documentElement;
    root.classList.remove("eco-mode", "neuro-mode", "dyslexic-mode", "no-blue-light");
    if (mode === "eco") root.classList.add("eco-mode");
    if (mode === "neuro") root.classList.add("neuro-mode");
    if (mode === "dyslexic") root.classList.add("dyslexic-mode");
    if (mode === "nobluelight") root.classList.add("no-blue-light");
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("a11y-fontsize", String(fontSize));
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  return (
    <AccessibilityContext.Provider value={{ mode, setMode, fontSize, setFontSize }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => useContext(AccessibilityContext);
