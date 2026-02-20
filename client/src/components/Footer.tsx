import { Shield, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

const footerLinks = {
  Insurance: [
    { label: "SR-22 Filing", href: "/coverage" },
    { label: "FR-44 Filing", href: "/coverage" },
    { label: "Burial Insurance", href: "/verticals" },
    { label: "Tiny Home Insurance", href: "/verticals" },
    { label: "Pet Insurance", href: "/verticals" },
    { label: "Gig Economy", href: "/verticals" },
  ],
  Company: [
    { label: "About Us", href: "/#how-it-works" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "State Compliance", href: "/compliance" },
    { label: "FAQ", href: "/#faq" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-lg font-bold text-background">ReinstatePro</div>
                <div className="text-[10px] tracking-widest uppercase text-background/50">Gods of Insurance</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-background/60">
              Multi-vertical insurance platform. Fast, compliant filings for SR-22, FR-44, burial, tiny home, pet, and gig economy coverage.
            </p>
            <div className="space-y-2 text-sm text-background/50">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@reinstatepro.com</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> (888) 555-0199</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Nationwide Coverage</div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-background mb-4 text-sm tracking-wide uppercase">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <span className="text-sm text-background/50 hover:text-background transition-colors">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">
            &copy; {new Date().getFullYear()} ReinstatePro — Gods of Insurance. All rights reserved.
          </p>
          <p className="text-xs text-background/30">
            Insurance products are offered through licensed carriers. ReinstatePro is a lead generation platform, not an insurance carrier.
          </p>
        </div>
      </div>
    </footer>
  );
}
