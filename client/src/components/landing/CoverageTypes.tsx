import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, Car, ArrowRight, Zap } from "lucide-react";
import { Link } from "wouter";

const coverageTypes = [
  {
    icon: Shield,
    title: "SR-22 Insurance",
    badge: "Most Popular",
    description: "Required proof of financial responsibility after a DUI, DWI, or driving without insurance. Filed directly with your state's DMV.",
    features: ["Same-day electronic filing", "Minimum liability coverage", "3-year continuous coverage", "All 50 states supported"],
    price: "From $29/mo",
    accent: "#b8860b",
    bgAccent: "rgba(184,134,11,0.08)",
  },
  {
    icon: FileText,
    title: "FR-44 Insurance",
    badge: "FL & VA Only",
    description: "Higher liability limits required in Florida and Virginia after serious offenses. We handle the elevated coverage requirements.",
    features: ["Higher liability limits", "Florida & Virginia compliant", "Electronic DMV filing", "Competitive carrier rates"],
    price: "From $49/mo",
    accent: "#6b4f9e",
    bgAccent: "rgba(107,79,158,0.08)",
  },
  {
    icon: Car,
    title: "Non-Owner SR-22",
    badge: "No Vehicle Needed",
    description: "Need an SR-22 but don't own a car? Non-owner policies satisfy state requirements without vehicle ownership.",
    features: ["No vehicle required", "Satisfies state SR-22", "Lower premiums", "Flexible coverage terms"],
    price: "From $19/mo",
    accent: "#1a6b4a",
    bgAccent: "rgba(26,107,74,0.08)",
  },
];

export default function CoverageTypes() {
  return (
    <section className="py-20 bg-white" id="coverage">
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
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span
              className="text-amber-700 text-xs font-medium tracking-widest uppercase"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Coverage Options
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-4"
            style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.02em" }}
          >
            Choose Your Coverage
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Whether you need SR-22, FR-44, or non-owner coverage, we connect you with top-rated carriers at competitive rates.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {coverageTypes.map((coverage) => (
            <Card
              key={coverage.title}
              className="relative group hover:shadow-lg transition-all duration-300 border-slate-200/80 bg-white overflow-hidden"
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: `linear-gradient(90deg, ${coverage.accent}, transparent)` }}
              />
              <CardHeader className="pb-4 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center"
                    style={{ background: coverage.bgAccent }}
                  >
                    <coverage.icon className="h-5 w-5" style={{ color: coverage.accent }} />
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs"
                    style={{ background: coverage.bgAccent, color: coverage.accent, border: `1px solid ${coverage.accent}30` }}
                  >
                    {coverage.badge}
                  </Badge>
                </div>
                <CardTitle
                  className="text-xl text-[#0a1628]"
                  style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.02em" }}
                >
                  {coverage.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">{coverage.description}</p>
                <ul className="space-y-2">
                  {coverage.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                      <div
                        className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                        style={{ background: coverage.accent }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span
                    className="text-lg font-bold"
                    style={{ color: coverage.accent, fontFamily: "Cinzel, serif" }}
                  >
                    {coverage.price}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-amber-700 hover:bg-amber-50 group-hover:text-amber-700"
                    asChild
                  >
                    <Link href="/quote">
                      Get Quote <ArrowRight className="ml-1 h-3.5 w-3.5" />
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
