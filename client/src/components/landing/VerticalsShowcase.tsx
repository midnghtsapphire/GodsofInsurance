import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Home, PawPrint, Truck, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const verticals = [
  {
    icon: Heart,
    title: "Burial & Final Expense",
    description: "Affordable whole life policies from $5,000 to $50,000. No medical exam required. Guaranteed acceptance for ages 50-85.",
    badge: "High Commission",
    color: "text-rose-600 bg-rose-50",
    href: "/verticals#burial",
  },
  {
    icon: Home,
    title: "Tiny & Mobile Home",
    description: "Specialized coverage for tiny houses, mobile homes, and manufactured housing. An underserved market with massive demand.",
    badge: "Blue Ocean",
    color: "text-teal-600 bg-teal-50",
    href: "/verticals#tiny-home",
  },
  {
    icon: PawPrint,
    title: "Pet Insurance",
    description: "Coverage for dogs, cats, exotics, therapy animals, foster pets, and breeder programs. Accident, illness, and wellness plans.",
    badge: "Growing Market",
    color: "text-amber-600 bg-amber-50",
    href: "/verticals#pet",
  },
  {
    icon: Truck,
    title: "Gig Economy",
    description: "Rideshare and delivery driver coverage that fills the gap between personal auto and commercial policies. Uber, Lyft, DoorDash compatible.",
    badge: "New Vertical",
    color: "text-indigo-600 bg-indigo-50",
    href: "/verticals#gig",
  },
];

export default function VerticalsShowcase() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="mb-4">Multi-Vertical Platform</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Beyond SR-22: Full Insurance Suite
          </h2>
          <p className="text-muted-foreground text-lg">
            We're building the most comprehensive insurance lead platform. SR-22 is just the beginning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {verticals.map((v) => (
            <Card key={v.title} className="group hover:shadow-card transition-all duration-300 overflow-hidden">
              <CardContent className="p-6 flex gap-5">
                <div className={`h-14 w-14 rounded-xl flex items-center justify-center shrink-0 ${v.color}`}>
                  <v.icon className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{v.title}</h3>
                    <Badge variant="secondary" className="text-xs">{v.badge}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                  <Button variant="ghost" size="sm" className="px-0 text-primary group-hover:translate-x-1 transition-transform" asChild>
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
