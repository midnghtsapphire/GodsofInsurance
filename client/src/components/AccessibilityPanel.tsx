import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Accessibility, Leaf, Brain, Type, Sun, Minus, Plus, RotateCcw } from "lucide-react";

const modes = [
  { id: "none" as const, label: "Standard", icon: RotateCcw, desc: "Default experience" },
  { id: "eco" as const, label: "ECO CODE", icon: Leaf, desc: "Low energy, no animations" },
  { id: "neuro" as const, label: "NEURO CODE", icon: Brain, desc: "ADHD-friendly focus mode" },
  { id: "dyslexic" as const, label: "DYSLEXIC", icon: Type, desc: "OpenDyslexic font, high contrast" },
  { id: "nobluelight" as const, label: "NO BLUE LIGHT", icon: Sun, desc: "Warm color filter" },
];

export default function AccessibilityPanel() {
  const { mode, setMode, fontSize, setFontSize } = useAccessibility();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-24 right-6 z-50 h-12 w-12 rounded-full shadow-card border-0"
          style={{ background: "linear-gradient(135deg, #b8860b, #8b6914)", color: "white" }}
          aria-label="Accessibility settings"
        >
          <Accessibility className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" side="top" align="end">
        <div className="space-y-4">
          <h3 className="font-semibold text-sm tracking-wide uppercase text-muted-foreground">Accessibility Modes</h3>
          <div className="space-y-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  mode === m.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted border border-transparent"
                }`}
              >
                <m.icon className={`h-4 w-4 ${mode === m.id ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <div className={`text-sm font-medium ${mode === m.id ? "text-primary" : ""}`}>{m.label}</div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Font Size</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setFontSize(Math.max(12, fontSize - 2))}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm w-8 text-center">{fontSize}</span>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setFontSize(Math.min(24, fontSize + 2))}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
