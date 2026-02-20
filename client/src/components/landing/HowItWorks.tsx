import { ClipboardList, Search, FileCheck, Car } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "I",
    title: "Tell Us Your Needs",
    description: "Complete our quick wizard — select your state, violation type, and coverage needs. Takes under 2 minutes.",
  },
  {
    icon: Search,
    step: "II",
    title: "We Compare Carriers",
    description: "Our AI engine compares rates from multiple A-rated carriers to find you the best coverage at the lowest price.",
  },
  {
    icon: FileCheck,
    step: "III",
    title: "Instant Filing",
    description: "We file your SR-22 or FR-44 electronically with your state's DMV. Most filings complete same-day.",
  },
  {
    icon: Car,
    step: "IV",
    title: "Get Back on the Road",
    description: "Receive your proof of filing and get back to driving legally. We monitor compliance so you don't have to.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20" style={{ background: "linear-gradient(180deg, #f8f5f0 0%, #ffffff 100%)" }} id="how-it-works">
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
            <span
              className="text-amber-700 text-xs font-medium tracking-widest uppercase"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Simple Process
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-4"
            style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.02em" }}
          >
            How It Works
          </h2>
          <p className="text-slate-600 text-lg">
            From quote to filing in four simple steps. No paperwork, no waiting rooms, no hassle.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px"
                  style={{ background: "linear-gradient(90deg, rgba(184,134,11,0.3), rgba(184,134,11,0.05))" }}
                />
              )}
              {/* Icon circle */}
              <div
                className="relative mx-auto mb-5 h-20 w-20 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all"
                style={{
                  background: "white",
                  border: "2px solid rgba(184,134,11,0.20)",
                }}
              >
                <s.icon className="h-8 w-8 text-amber-700" />
                {/* Roman numeral step badge */}
                <span
                  className="absolute -top-2 -right-2 h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #b8860b, #8b6914)",
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.6rem",
                  }}
                >
                  {s.step}
                </span>
              </div>
              <h3
                className="text-lg font-semibold mb-2 text-[#0a1628]"
                style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.02em" }}
              >
                {s.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
