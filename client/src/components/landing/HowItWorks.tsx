import { Badge } from "@/components/ui/badge";
import { ClipboardList, Search, FileCheck, Car } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Tell Us Your Needs",
    description: "Complete our quick wizard — select your state, violation type, and coverage needs. Takes under 2 minutes.",
  },
  {
    icon: Search,
    step: "02",
    title: "We Compare Carriers",
    description: "Our AI engine compares rates from multiple A-rated carriers to find you the best coverage at the lowest price.",
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Instant Filing",
    description: "We file your SR-22 or FR-44 electronically with your state's DMV. Most filings complete same-day.",
  },
  {
    icon: Car,
    step: "04",
    title: "Get Back on the Road",
    description: "Receive your proof of filing and get back to driving legally. We monitor compliance so you don't have to.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-muted/30" id="how-it-works">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="mb-4">Simple Process</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg">
            From quote to filing in four simple steps. No paperwork, no waiting rooms, no hassle.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
              )}
              <div className="relative mx-auto mb-5 h-20 w-20 rounded-2xl bg-background shadow-soft flex items-center justify-center group-hover:shadow-card transition-shadow">
                <s.icon className="h-8 w-8 text-primary" />
                <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
