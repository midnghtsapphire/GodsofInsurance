import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";
import { Link } from "wouter";

const CHIBI_MASCOT  = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032705003/qsUIQWHkpeRKWQjA.png";
const SAKURA_LEFT   = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032705003/WijUsCIssHppvmND.png";
const SAKURA_RIGHT  = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032705003/puTyGWFWQvkjsbWj.png";

const trustPoints = [
  "SR-22 filed in minutes",
  "All 50 states covered",
  "No hidden fees",
  "A+ rated carriers",
];

const stats = [
  { value: "50K+",  label: "Policies Filed" },
  { value: "4.9★",  label: "Avg Rating" },
  { value: "15 min", label: "Avg Filing Time" },
  { value: "50",    label: "States Covered" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-16 md:pt-12 md:pb-24">
      {/* Sakura branch decorations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <img src={SAKURA_LEFT}  alt="" className="absolute left-0 top-0 w-[380px] md:w-[480px] opacity-[0.20] select-none" />
        <img src={SAKURA_RIGHT} alt="" className="absolute right-0 top-0 w-[380px] md:w-[480px] opacity-[0.20] select-none" />
        {/* Soft pink radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_0%,oklch(0.92_0.05_5/0.20),transparent)]" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left space-y-6 fade-in-up">
            <Badge className="bg-pink-50 text-pink-600 border border-pink-200 text-xs font-semibold tracking-wide px-3 py-1">
              🌸 Insurance of the Gods — FOSS-First Platform
            </Badge>

            <h1
              className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-foreground leading-[1.15]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Coverage as{" "}
              <span className="relative inline-block text-primary">
                divine
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-pink-300 to-rose-400 rounded-full opacity-70" />
              </span>{" "}
              as it gets
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
              SR-22 · FR-44 · Burial · Tiny Home · Pet · Gig Economy — all verticals, one platform.
              Fast filings, transparent pricing, and AI-powered quote comparison.
            </p>

            {/* Trust bullets */}
            <ul className="flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start">
              {trustPoints.map((pt) => (
                <li key={pt} className="flex items-center gap-1.5 text-sm text-foreground/65">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  {pt}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link href="/quote">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all gap-2 px-7"
                >
                  Get Your Free Quote
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/coverage">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-pink-200 text-foreground hover:bg-pink-50 gap-2 px-7"
                >
                  Learn About SR-22
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-2 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex -space-x-1.5">
                {["🧑", "👩", "🧔", "👱"].map((e, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center text-xs">
                    {e}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-foreground">4.9</span>
              </div>
              <span>from 2,400+ verified customers</span>
            </div>
          </div>

          {/* Right: Chibi mascot + stats card */}
          <div className="flex flex-col items-center gap-5">
            {/* Mascot with soft glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-radial from-pink-200/30 via-pink-100/10 to-transparent rounded-full blur-2xl scale-110" />
              <img
                src={CHIBI_MASCOT}
                alt="Gods of Insurance mascot — chibi goddess in sakura kimono holding a golden shield"
                className="relative w-60 md:w-72 lg:w-64 xl:w-72 float select-none drop-shadow-lg"
                loading="eager"
              />
            </div>

            {/* Stats card */}
            <div className="w-full max-w-xs bg-white rounded-2xl border border-pink-100 shadow-md p-5">
              <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-4 text-center">
                Platform Stats
              </p>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div
                      className="text-2xl font-bold text-primary"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {s.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
