import { Mail, Phone, MapPin, Zap } from "lucide-react";
import { Link } from "wouter";

const ZEUS_ICON_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032705003/oQmTFFKNyOEjtgfS.png";

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
    <footer style={{ background: "#0a1628", color: "rgba(255,255,255,0.7)" }}>
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={ZEUS_ICON_URL}
                alt="Zeus — Gods of Insurance"
                className="w-10 h-10 rounded-full ring-2 ring-amber-400/30"
              />
              <div>
                <div
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.05em" }}
                >
                  Gods of Insurance
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-amber-500/70">
                  Insurance of the Gods
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Multi-vertical insurance platform. Fast, compliant filings for SR-22, FR-44, burial, tiny home, pet, and gig economy coverage.
            </p>
            {/* AI Phone Agent highlight */}
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{ background: "rgba(184,134,11,0.10)", border: "1px solid rgba(184,134,11,0.20)" }}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-amber-300 font-medium">AI Phone Agent — 24/7</span>
            </div>
            <div className="space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@godsofinsurance.com</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> AI Agent: 24/7</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Nationwide Coverage</div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4
                className="font-semibold text-white mb-4 text-xs tracking-[0.15em] uppercase"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <span className="text-sm text-slate-500 hover:text-amber-400 transition-colors cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Gods of Insurance. All rights reserved. FOSS-First Platform.
          </p>
          <p className="text-xs text-slate-700">
            Insurance products are offered through licensed carriers. Gods of Insurance is a lead generation platform, not an insurance carrier.
          </p>
        </div>
      </div>
    </footer>
  );
}
