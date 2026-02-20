import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "What is an SR-22?",
    a: "An SR-22 is a certificate of financial responsibility filed with your state's DMV. It proves you carry the minimum required auto insurance. It's typically required after a DUI, DWI, driving without insurance, or accumulating too many points on your license.",
  },
  {
    q: "What's the difference between SR-22 and FR-44?",
    a: "FR-44 is similar to SR-22 but requires higher liability limits. It's only used in Florida and Virginia, typically after a DUI conviction. FR-44 requires $100,000/$300,000 bodily injury and $50,000 property damage in Florida.",
  },
  {
    q: "How long do I need to maintain SR-22 coverage?",
    a: "Most states require SR-22 coverage for 3 years, though some require it for up to 5 years. The clock starts from the date of filing, not the date of the offense. Any lapse in coverage restarts the clock.",
  },
  {
    q: "Can I get SR-22 without owning a car?",
    a: "Yes! A non-owner SR-22 policy satisfies state requirements without vehicle ownership. This is ideal if you don't own a car but still need to maintain your driving privileges.",
  },
  {
    q: "How fast can I get my SR-22 filed?",
    a: "With Gods of Insurance, most SR-22 filings are completed same-day through electronic filing. In states that accept electronic filings, your certificate can be on file with the DMV within hours.",
  },
  {
    q: "Will SR-22 affect my insurance rates?",
    a: "SR-22 itself doesn't increase rates, but the underlying violation that triggered the requirement typically does. We compare multiple carriers to find you the most competitive rates despite your driving record.",
  },
  {
    q: "Do you offer other types of insurance?",
    a: "Yes! Beyond SR-22 and FR-44, we offer burial/final expense insurance, tiny home and mobile home insurance, pet insurance (including exotic and therapy animals), and gig economy coverage for rideshare and delivery drivers.",
  },
  {
    q: "What happens if my SR-22 lapses?",
    a: "If your SR-22 coverage lapses, your insurance company will notify the DMV, which can result in immediate license suspension. We provide compliance monitoring to help prevent accidental lapses.",
  },
];

export default function FAQ() {
  return (
    <section className="py-20" style={{ background: "linear-gradient(180deg, #f8f5f0 0%, #ffffff 100%)" }} id="faq">
      <div className="container max-w-3xl">
        {/* Section header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
            style={{
              background: "rgba(184,134,11,0.10)",
              border: "1px solid rgba(184,134,11,0.25)",
            }}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span
              className="text-amber-700 text-xs font-medium tracking-widest uppercase"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              FAQ
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-4"
            style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.02em" }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-lg">
            Everything you need to know about SR-22, FR-44, and our insurance services.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border px-6"
              style={{ borderColor: "rgba(184,134,11,0.15)", background: "white" }}
            >
              <AccordionTrigger
                className="text-left font-medium hover:no-underline py-5 text-[#0a1628] hover:text-amber-700"
                style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: "1rem" }}
              >
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
