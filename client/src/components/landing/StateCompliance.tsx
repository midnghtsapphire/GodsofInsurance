import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, MapPin } from "lucide-react";
import { Link } from "wouter";

const featuredStates = [
  {
    code: "CA",
    name: "California",
    sr22Duration: "3 years",
    minimumLiability: "15/30/5",
    filingFee: "$25",
    electronicFiling: true,
    highlights: ["Electronic filing available", "DMV Form SR-1P required", "Immediate suspension without SR-22"],
  },
  {
    code: "CO",
    name: "Colorado",
    sr22Duration: "3 years",
    minimumLiability: "25/50/15",
    filingFee: "$20",
    electronicFiling: true,
    highlights: ["Higher minimum limits", "Points system enforcement", "SR-22 required for reinstatement"],
  },
  {
    code: "NC",
    name: "North Carolina",
    sr22Duration: "3 years",
    minimumLiability: "30/60/25",
    filingFee: "$15",
    electronicFiling: true,
    highlights: ["Highest minimum limits", "Safe Driver Incentive Plan", "DWI requires SR-22"],
  },
];

export default function StateCompliance() {
  return (
    <section className="py-20 bg-white" id="compliance">
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
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span
              className="text-amber-700 text-xs font-medium tracking-widest uppercase"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              State Compliance
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-4"
            style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.02em" }}
          >
            State-by-State Requirements
          </h2>
          <p className="text-slate-600 text-lg">
            Every state has different SR-22 and FR-44 requirements. We handle the complexity so you don't have to.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {featuredStates.map((state) => (
            <Card
              key={state.code}
              className="hover:shadow-lg transition-all duration-300 border-slate-200/80 bg-white overflow-hidden"
            >
              {/* Top accent bar */}
              <div
                className="h-1"
                style={{ background: "linear-gradient(90deg, #b8860b, rgba(184,134,11,0.2))" }}
              />
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #0a1628, #1a2d4a)",
                    }}
                  >
                    <span
                      className="text-sm font-bold"
                      style={{
                        fontFamily: "Cinzel, serif",
                        background: "linear-gradient(135deg, #f0c040, #b8860b)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {state.code}
                    </span>
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-lg text-[#0a1628]"
                      style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.02em" }}
                    >
                      {state.name}
                    </h3>
                    <span className="text-xs text-slate-500">SR-22 Duration: {state.sr22Duration}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div
                    className="p-2.5 rounded-lg"
                    style={{ background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.12)" }}
                  >
                    <div className="text-slate-500 text-xs">Min. Liability</div>
                    <div className="font-semibold text-[#0a1628]">{state.minimumLiability}</div>
                  </div>
                  <div
                    className="p-2.5 rounded-lg"
                    style={{ background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.12)" }}
                  >
                    <div className="text-slate-500 text-xs">Filing Fee</div>
                    <div className="font-semibold text-[#0a1628]">{state.filingFee}</div>
                  </div>
                </div>

                <ul className="space-y-2">
                  {state.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                      <span className="text-slate-600">{h}</span>
                    </li>
                  ))}
                </ul>

                {state.electronicFiling && (
                  <span
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: "rgba(26,107,74,0.08)",
                      color: "#1a6b4a",
                      border: "1px solid rgba(26,107,74,0.20)",
                    }}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Electronic Filing Available
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
            style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.05em", fontSize: "0.8rem" }}
            asChild
          >
            <Link href="/compliance">
              View All 50 States <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
