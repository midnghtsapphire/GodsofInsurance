import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Home, PawPrint, Truck, ArrowRight, Layers } from "lucide-react";
import { Link } from "wouter";

const verticals = [
  {
    icon: Heart,
    title: "Burial & Final Expense",
    description: "Affordable whole life policies from $5,000 to $50,000. No medical exam required. Guaranteed acceptance for ages 50-85.",
    badge: "High Commission",
    accent: "#c0392b",
    bgAccent: "rgba(192,57,43,0.08)",
    href: "/verticals#burial",
  },
  {
    icon: Home,
    title: "Tiny & Mobile Home",
    description: "Specialized coverage for tiny houses, mobile homes, and manufactured housing. An underserved market with massive demand.",
    badge: "Blue Ocean",
    accent: "#1a6b4a",
    bgAccent: "rgba(26,107,74,0.08)",
    href: "/verticals#tiny-home",
  },
  {
    icon: PawPrint,
    title: "Pet Insurance",
    description: "Coverage for dogs, cats, exotics, therapy animals, foster pets, and breeder programs. Accident, illness, and wellness plans.",
    badge: "Growing Market",
    accent: "#b8860b",
    bgAccent: "rgba(184,134,11,0.08)",
    href: "/verticals#pet",
  },
  {
    icon: Truck,
    title: "Gig Economy",
    description: "Rideshare and delivery driver coverage that fills the gap between personal auto and commercial policies. Uber, Lyft, DoorDash compatible.",
    badge: "New Vertical",
    accent: "#2c5282",
    bgAccent: "rgba(44,82,130,0.08)",
    href: "/verticals#gig",
  },
];

export default function VerticalsShowcase() {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
            style={{
              background: "rgba(184,134,11,0.10)",
              border: "1px solid rgba(184,134,11,0.25)",
            }}
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span
              className="text-amber-700 text-xs font-medium tracking-widest uppercase"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Multi-Vertical Platform
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-4"
            style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.02em" }}
          >
            Beyond SR-22: Full Insurance Suite
          </h2>
          <p className="text-slate-600 text-lg">
            We're building the most comprehensive insurance platform. SR-22 is just the beginning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {verticals.map((v) => (
            <Card
              key={v.title}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-slate-200/80 bg-white"
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                style={{ background: v.accent }}
              />
              <CardContent className="p-6 flex gap-5 relative">
                <div
                  className="h-14 w-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: v.bgAccent }}
                >
                  <v.icon className="h-7 w-7" style={{ color: v.accent }} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className="font-semibold text-lg text-[#0a1628]"
                      style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.02em" }}
                    >
                      {v.title}
                    </h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: v.bgAccent,
                        color: v.accent,
                        border: `1px solid ${v.accent}30`,
                      }}
                    >
                      {v.badge}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{v.description}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-0 hover:text-amber-700 group-hover:translate-x-1 transition-transform"
                    style={{ color: v.accent }}
                    asChild
                  >
                    <Link href={v.href}>
                      Learn More <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
