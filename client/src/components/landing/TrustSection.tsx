import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marcus T.",
    state: "California",
    text: "Got my SR-22 filed the same day. I was driving legally again within 24 hours. The process was incredibly smooth.",
    rating: 5,
  },
  {
    name: "Sarah K.",
    state: "Florida",
    text: "FR-44 requirements in Florida are confusing. ReinstatePro handled everything and saved me over $600 a year on premiums.",
    rating: 5,
  },
  {
    name: "James R.",
    state: "Colorado",
    text: "I needed a non-owner SR-22 and couldn't find anyone to help. ReinstatePro had me covered in under 15 minutes.",
    rating: 5,
  },
];

const stats = [
  { value: "50,000+", label: "Filings Completed" },
  { value: "4.9/5", label: "Customer Rating" },
  { value: "< 15 min", label: "Avg. Filing Time" },
  { value: "$847", label: "Avg. Annual Savings" },
];

export default function TrustSection() {
  return (
    <section className="py-20 bg-muted/30" id="trust">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="mb-4">Trusted Platform</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Trusted by Thousands
          </h2>
          <p className="text-muted-foreground text-lg">
            Real results from real customers across all 50 states.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-xl bg-background shadow-soft">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-background rounded-xl p-6 shadow-soft space-y-4">
              <Quote className="h-8 w-8 text-primary/20" />
              <p className="text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="pt-3 border-t">
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.state}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
