import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { Link } from "wouter";

export default function CTASection() {
  return (
    <section className="py-20 hero-gradient relative overflow-hidden">
      <div className="decorative absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-white/5 blur-3xl float" />
        <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full bg-white/5 blur-3xl float" style={{ animationDelay: "2s" }} />
      </div>
      <div className="container relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Ready to Get Back on the Road?
        </h2>
        <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
          Join thousands of drivers who've restored their driving privileges through ReinstatePro. Start your free quote today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-amber-400 text-amber-950 hover:bg-amber-300 font-semibold px-8" asChild>
            <Link href="/quote">
              Get Your Free Quote <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
            <Phone className="mr-2 h-4 w-4" /> (888) 555-0199
          </Button>
        </div>
      </div>
    </section>
  );
}
