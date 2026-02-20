import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, Car, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const coverageTypes = [
  {
    icon: Shield,
    title: "SR-22 Insurance",
    badge: "Most Popular",
    description: "Required proof of financial responsibility after a DUI, DWI, or driving without insurance. Filed directly with your state's DMV.",
    features: ["Same-day electronic filing", "Minimum liability coverage", "3-year continuous coverage", "All 50 states supported"],
    price: "From $29/mo",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: FileText,
    title: "FR-44 Insurance",
    badge: "FL & VA Only",
    description: "Higher liability limits required in Florida and Virginia after serious offenses. We handle the elevated coverage requirements.",
    features: ["Higher liability limits", "Florida & Virginia compliant", "Electronic DMV filing", "Competitive carrier rates"],
    price: "From $49/mo",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: Car,
    title: "Non-Owner SR-22",
    badge: "No Vehicle Needed",
    description: "Need an SR-22 but don't own a car? Non-owner policies satisfy state requirements without vehicle ownership.",
    features: ["No vehicle required", "Satisfies state SR-22", "Lower premiums", "Flexible coverage terms"],
    price: "From $19/mo",
    color: "text-emerald-600 bg-emerald-50",
  },
];

export default function CoverageTypes() {
  return (
    <section className="py-20 bg-background" id="coverage">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="mb-4">Coverage Options</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Choose Your Coverage
          </h2>
          <p className="text-muted-foreground text-lg">
            Whether you need SR-22, FR-44, or non-owner coverage, we connect you with top-rated carriers at competitive rates.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {coverageTypes.map((coverage) => (
            <Card key={coverage.title} className="relative group hover:shadow-card transition-all duration-300 border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${coverage.color}`}>
                    <coverage.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">{coverage.badge}</Badge>
                </div>
                <CardTitle className="text-xl">{coverage.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{coverage.description}</p>
                <ul className="space-y-2">
                  {coverage.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{coverage.price}</span>
                  <Button variant="ghost" size="sm" className="group-hover:text-primary" asChild>
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
