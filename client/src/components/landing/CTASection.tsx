import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Zap } from "lucide-react";
import { Link } from "wouter";

const ZEUS_SPLASH_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032705003/bQPfvCwlYTQKsRnC.png";

export default function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a1628 0%, #1a2d4a 100%)" }}>
      {/* Zeus background subtle */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <img
          src={ZEUS_SPLASH_URL}
          alt=""
          className="absolute right-0 top-0 h-full w-1/2 object-cover object-center opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628]/80 to-transparent" />
        {/* Gold glow orbs */}
        <div className="absolute top-10 right-20 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(184,134,11,0.08)" }} />
        <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full blur-3xl" style={{ background: "rgba(184,134,11,0.05)" }} />
      </div>

      <div className="container relative z-10 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
          style={{
            background: "rgba(184,134,11,0.15)",
            border: "1px solid rgba(184,134,11,0.35)",
          }}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span
            className="text-amber-300 text-xs font-medium tracking-widest uppercase"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            Divine Coverage Awaits
          </span>
        </div>

        <h2
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.02em" }}
        >
          Ready to Get Back on the Road?
        </h2>
        <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8">
          Join thousands of drivers who've restored their driving privileges through Gods of Insurance. Start your free quote today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/quote">
            <Button
              size="lg"
              className="font-bold px-8 shadow-xl"
              style={{
                background: "linear-gradient(135deg, #f0c040, #b8860b)",
                color: "#0a1628",
                fontFamily: "Cinzel, serif",
                letterSpacing: "0.06em",
                fontSize: "0.85rem",
              }}
            >
              Get Your Free Quote <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="backdrop-blur-sm"
            style={{
              borderColor: "rgba(255,255,255,0.25)",
              color: "white",
              background: "rgba(255,255,255,0.05)",
              fontFamily: "Cinzel, serif",
              letterSpacing: "0.04em",
              fontSize: "0.8rem",
            }}
          >
            <Phone className="mr-2 h-4 w-4" /> AI Agent: 24/7
          </Button>
        </div>

        {/* FOSS note */}
        <p className="mt-8 text-slate-500 text-xs">
          FOSS-First Platform · Open-source stack · No vendor lock-in · Agent-owned leads
        </p>
      </div>
    </section>
  );
}
