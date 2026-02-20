import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Phone, Shield, Star, ChevronDown } from "lucide-react";
import { Link } from "wouter";

const ZEUS_SPLASH_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032705003/bQPfvCwlYTQKsRnC.png";
const ZEUS_ICON_URL   = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032705003/oQmTFFKNyOEjtgfS.png";

const stats = [
  { value: "50+",   label: "States Covered" },
  { value: "24/7",  label: "AI Phone Agent" },
  { value: "10K+",  label: "Agents Served" },
  { value: "$0",    label: "Lead Fees" },
];

const trustPoints = [
  "SR-22 filed in minutes",
  "All 50 states covered",
  "No hidden fees",
  "A+ rated carriers",
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Zeus splash background */}
      <div className="absolute inset-0">
        <img
          src={ZEUS_SPLASH_URL}
          alt="Zeus seated on his golden throne — Insurance of the Gods"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/92 via-[#0a1628]/65 to-[#0a1628]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/85 via-transparent to-[#0a1628]/25" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container py-24 md:py-32">
          <div className="max-w-2xl">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 fade-in"
              style={{
                background: "rgba(184, 134, 11, 0.15)",
                border: "1px solid rgba(184, 134, 11, 0.35)",
              }}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 text-xs font-medium tracking-widest uppercase"
                style={{ fontFamily: "Cinzel, serif" }}>
                Insurance of the Gods
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 fade-in-up"
              style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.02em" }}
            >
              Divine Protection
              <br />
              <span style={{
                background: "linear-gradient(135deg, #f0c040, #b8860b, #e8d080)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                For Every Life Event
              </span>
            </h1>

            {/* Sub-headline */}
            <p
              className="text-lg text-slate-300 mb-3 leading-relaxed fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              SR-22 · FR-44 · Burial · Tiny Home · Pet · Gig Economy — all verticals, one platform.
              Fast filings, transparent pricing, and AI-powered quote comparison.
            </p>

            {/* Phone answering promise */}
            <div className="flex items-center gap-2 mb-8 fade-in-up" style={{ animationDelay: "0.15s" }}>
              <div
                className="flex items-center gap-2 rounded-full px-3 py-1.5"
                style={{
                  background: "rgba(184, 134, 11, 0.10)",
                  border: "1px solid rgba(184, 134, 11, 0.25)",
                }}
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300 text-xs font-medium">
                  Phone Answering Everything — 24/7 AI Agent
                </span>
              </div>
            </div>

            {/* Trust bullets */}
            <ul className="flex flex-wrap gap-x-5 gap-y-2 mb-8 fade-in-up" style={{ animationDelay: "0.18s" }}>
              {trustPoints.map((pt) => (
                <li key={pt} className="flex items-center gap-1.5 text-sm text-slate-300">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
                  {pt}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10 fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Link href="/quote">
                <Button
                  size="lg"
                  className="font-bold shadow-xl hover:shadow-2xl transition-all group"
                  style={{
                    background: "linear-gradient(135deg, #f0c040, #b8860b)",
                    color: "#0a1628",
                    fontFamily: "Cinzel, serif",
                    letterSpacing: "0.08em",
                    fontSize: "0.85rem",
                  }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Get Divine Coverage
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/verticals">
                <Button
                  size="lg"
                  variant="outline"
                  className="backdrop-blur-sm"
                  style={{
                    borderColor: "rgba(255,255,255,0.3)",
                    color: "white",
                    fontFamily: "Cinzel, serif",
                    letterSpacing: "0.06em",
                    fontSize: "0.8rem",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Explore Coverage
                </Button>
              </Link>
            </div>

            {/* Zeus medallion + FOSS badge */}
            <div className="flex items-center gap-4 fade-in-up" style={{ animationDelay: "0.3s" }}>
              <img
                src={ZEUS_ICON_URL}
                alt="Zeus medallion"
                className="w-12 h-12 rounded-full ring-2 ring-amber-400/40"
              />
              <div>
                <div className="text-white text-sm font-semibold" style={{ fontFamily: "Cinzel, serif" }}>
                  FOSS-First Platform
                </div>
                <div className="text-slate-400 text-xs">
                  Open-source stack · No vendor lock-in · Agent-owned leads
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div
        className="relative z-10 border-t backdrop-blur-md"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          background: "rgba(10, 22, 40, 0.80)",
        }}
      >
        <div className="container py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "Cinzel, serif",
                    background: "linear-gradient(135deg, #f0c040, #b8860b)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-slate-400 text-xs mt-0.5 tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-5 h-5 text-white/40" />
      </div>
    </section>
  );
}
