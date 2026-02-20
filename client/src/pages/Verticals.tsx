import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Heart, Home, PawPrint, Truck, Car, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

const verticals = [
  {
    id: "sr22",
    icon: Car,
    title: "SR-22 / FR-44 High-Risk Auto",
    subtitle: "License reinstatement filings",
    badge: "Core Product",
    color: "bg-blue-50 text-blue-700",
    description: "Get back on the road fast with same-day SR-22 and FR-44 electronic filings. We handle DUI/DWI, driving without insurance, reckless driving, and point accumulation cases across all 50 states.",
    features: [
      "Same-day electronic filing in most states",
      "SR-22 for all violation types (DUI, no insurance, points)",
      "FR-44 for Florida and Virginia (higher limits)",
      "Non-owner SR-22 for drivers without vehicles",
      "Continuous compliance monitoring",
      "Multi-carrier rate comparison",
    ],
    cta: "Get SR-22 Quote",
  },
  {
    id: "burial",
    icon: Heart,
    title: "Burial & Final Expense Insurance",
    subtitle: "Affordable whole life coverage",
    badge: "High Commission",
    color: "bg-rose-50 text-rose-700",
    description: "Simplified issue whole life policies designed to cover funeral costs and final expenses. No medical exam required. Guaranteed acceptance options available for ages 50-85 with coverage from $5,000 to $50,000.",
    features: [
      "No medical exam required",
      "Guaranteed acceptance options (ages 50-85)",
      "Coverage from $5,000 to $50,000",
      "Fixed premiums that never increase",
      "Cash value accumulation",
      "Benefits paid within 24-48 hours",
    ],
    cta: "Get Burial Quote",
  },
  {
    id: "tiny-home",
    icon: Home,
    title: "Tiny & Mobile Home Insurance",
    subtitle: "Specialized dwelling coverage",
    badge: "Blue Ocean",
    color: "bg-teal-50 text-teal-700",
    description: "The tiny home and mobile home insurance market is massively underserved. We provide specialized coverage for tiny houses on wheels, manufactured homes, park models, and mobile homes with options traditional carriers won't offer.",
    features: [
      "Tiny houses on wheels (THOW) coverage",
      "Manufactured and mobile home policies",
      "Park model and ADU coverage",
      "Transit coverage for movable homes",
      "Personal property and liability",
      "Flood and windstorm add-ons",
    ],
    cta: "Get Tiny Home Quote",
  },
  {
    id: "pet",
    icon: PawPrint,
    title: "Pet Insurance",
    subtitle: "Comprehensive animal coverage",
    badge: "Growing Market",
    color: "bg-amber-50 text-amber-700",
    description: "Go beyond basic pet insurance. We cover dogs, cats, exotic animals, therapy and service animals, foster pets, and breeder programs. Accident, illness, wellness, and behavioral coverage available.",
    features: [
      "Dogs, cats, and exotic animals",
      "Therapy and service animal coverage",
      "Foster and rescue pet programs",
      "Breeder liability coverage",
      "Accident, illness, and wellness plans",
      "Behavioral therapy coverage",
    ],
    cta: "Get Pet Quote",
  },
  {
    id: "gig",
    icon: Truck,
    title: "Gig Economy Insurance",
    subtitle: "Rideshare & delivery coverage",
    badge: "New Vertical",
    color: "bg-indigo-50 text-indigo-700",
    description: "Fill the coverage gap for rideshare and delivery drivers. Personal auto policies often exclude commercial use, and company coverage has limits. Our gig economy policies bridge that gap for Uber, Lyft, DoorDash, Instacart, and more.",
    features: [
      "Rideshare gap coverage (Uber, Lyft)",
      "Delivery driver coverage (DoorDash, Instacart)",
      "Commercial use endorsements",
      "Uninsured motorist protection",
      "Cargo and equipment coverage",
      "Flexible per-trip or monthly plans",
    ],
    cta: "Get Gig Quote",
  },
];

export default function Verticals() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="hero-gradient py-16 relative overflow-hidden">
          <div className="container relative z-10 text-center">
            <Badge variant="secondary" className="bg-white/15 text-white border-white/20 mb-4">Multi-Vertical Platform</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Insurance Verticals
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              From SR-22 filings to pet insurance — we're building the most comprehensive insurance lead generation platform.
            </p>
          </div>
        </section>

        {/* Verticals */}
        <section className="py-16">
          <div className="container space-y-12">
            {verticals.map((v, i) => (
              <Card key={v.id} id={v.id} className="overflow-hidden scroll-mt-20">
                <CardContent className="p-0">
                  <div className={`grid md:grid-cols-2 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                    {/* Info */}
                    <div className="p-8 space-y-5">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${v.color}`}>
                          <v.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">{v.title}</h2>
                          <p className="text-sm text-muted-foreground">{v.subtitle}</p>
                        </div>
                        <Badge variant="secondary" className="ml-auto">{v.badge}</Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{v.description}</p>
                      <Button asChild>
                        <Link href="/quote">{v.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    </div>
                    {/* Features */}
                    <div className="bg-muted/30 p-8">
                      <h3 className="font-semibold mb-4">Key Features</h3>
                      <ul className="space-y-3">
                        {v.features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
