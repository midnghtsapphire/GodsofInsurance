import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowRight, CheckCircle2, Zap, Clock, Star } from "lucide-react";
import { Link } from "wouter";

const trustPoints = [
  { icon: Zap, text: "Same-Day Filing" },
  { icon: Shield, text: "All 50 States" },
  { icon: Clock, text: "24/7 Support" },
  { icon: Star, text: "A+ Rated Carriers" },
];

export default function Hero() {
  return (
    <section className="relative hero-gradient overflow-hidden">
      {/* Decorative elements */}
      <div className="decorative absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white/5 blur-3xl float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white/5 blur-3xl float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/3 blur-3xl" />
      </div>

      <div className="container relative z-10 py-20 md:py-28 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <Badge variant="secondary" className="bg-white/15 text-white border-white/20 hover:bg-white/20 px-4 py-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              Trusted by 10,000+ Drivers Nationwide
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Get Back on the Road.{" "}
              <span className="text-amber-300">Fast.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-lg leading-relaxed">
              SR-22 and FR-44 filings in minutes, not days. Plus burial, tiny home, pet, and gig economy insurance — all from one platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-amber-400 text-amber-950 hover:bg-amber-300 font-semibold text-base px-8" asChild>
                <Link href="/quote">
                  Get Your Free Quote <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent text-base" asChild>
                <Link href="/coverage">View Coverage Options</Link>
              </Button>
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              {trustPoints.map((tp) => (
                <div key={tp.text} className="flex items-center gap-2 text-white/70">
                  <tp.icon className="h-4 w-4 text-amber-300" />
                  <span className="text-sm">{tp.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick Stats Card */}
          <div className="hidden lg:block">
            <div className="glass rounded-2xl p-8 space-y-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-foreground">Why ReinstatePro?</h3>
              <div className="space-y-4">
                {[
                  { label: "Average Filing Time", value: "< 15 min", color: "text-emerald-600" },
                  { label: "States Covered", value: "All 50", color: "text-blue-600" },
                  { label: "Average Savings", value: "$847/yr", color: "text-amber-600" },
                  { label: "Customer Satisfaction", value: "4.9/5", color: "text-purple-600" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full" size="lg" asChild>
                <Link href="/quote">Start Your Free Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="oklch(0.995 0.002 90)" />
        </svg>
      </div>
    </section>
  );
}
