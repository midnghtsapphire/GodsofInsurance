import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
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
    <section className="py-20 bg-background" id="compliance">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="mb-4">State Compliance</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            State-by-State Requirements
          </h2>
          <p className="text-muted-foreground text-lg">
            Every state has different SR-22 and FR-44 requirements. We handle the complexity so you don't have to.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {featuredStates.map((state) => (
            <Card key={state.code} className="hover:shadow-card transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{state.code}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{state.name}</h3>
                    <span className="text-xs text-muted-foreground">SR-22 Duration: {state.sr22Duration}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2.5 rounded-lg bg-muted/50">
                    <div className="text-muted-foreground text-xs">Min. Liability</div>
                    <div className="font-semibold">{state.minimumLiability}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/50">
                    <div className="text-muted-foreground text-xs">Filing Fee</div>
                    <div className="font-semibold">{state.filingFee}</div>
                  </div>
                </div>

                <ul className="space-y-2">
                  {state.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{h}</span>
                    </li>
                  ))}
                </ul>

                {state.electronicFiling && (
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Electronic Filing Available
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/compliance">
              View All 50 States <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
