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
    text: "FR-44 requirements in Florida are confusing. Gods of Insurance handled everything and saved me over $600 a year on premiums.",
    rating: 5,
  },
  {
    name: "James R.",
    state: "Colorado",
    text: "I needed a non-owner SR-22 and couldn't find anyone to help. Gods of Insurance had me covered in under 15 minutes.",
    rating: 5,
  },
];

const stats = [
  { value: "50,000+", label: "Filings Completed" },
  { value: "4.9/5",   label: "Customer Rating" },
  { value: "< 15 min", label: "Avg. Filing Time" },
  { value: "$847",    label: "Avg. Annual Savings" },
];

export default function TrustSection() {
  return (
    <section className="py-20 bg-white" id="trust">
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
              Trusted Platform
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-4"
            style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.02em" }}
          >
            Trusted by Thousands
          </h2>
          <p className="text-slate-600 text-lg">
            Real results from real customers across all 50 states.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-xl shadow-sm"
              style={{
                background: "linear-gradient(135deg, #0a1628 0%, #1a2d4a 100%)",
                border: "1px solid rgba(184,134,11,0.20)",
              }}
            >
              <div
                className="text-2xl md:text-3xl font-bold mb-1"
                style={{
                  fontFamily: "Cinzel, serif",
                  background: "linear-gradient(135deg, #f0c040, #b8860b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl p-6 space-y-4 shadow-sm"
              style={{
                background: "white",
                border: "1px solid rgba(184,134,11,0.15)",
              }}
            >
              <Quote className="h-8 w-8 text-amber-300" />
              <p className="text-sm leading-relaxed text-slate-600">{t.text}</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="pt-3 border-t border-slate-100">
                <div className="font-semibold text-sm text-[#0a1628]" style={{ fontFamily: "Cinzel, serif" }}>
                  {t.name}
                </div>
                <div className="text-xs text-slate-500">{t.state}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
