import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
    a: "With ReinstatePro, most SR-22 filings are completed same-day through electronic filing. In states that accept electronic filings, your certificate can be on file with the DMV within hours.",
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
    <section className="py-20 bg-background" id="faq">
      <div className="container max-w-3xl">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4">FAQ</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about SR-22, FR-44, and our insurance services.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-muted/30 rounded-xl border-0 px-6">
              <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
