import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Shield, Menu, ChevronDown, LogOut, LayoutDashboard, User, Zap, Phone } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

const ZEUS_ICON_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032705003/oQmTFFKNyOEjtgfS.png";

const navLinks = [
  { label: "Coverage",   href: "/coverage" },
  { label: "Verticals",  href: "/verticals" },
  { label: "Compliance", href: "/compliance" },
  { label: "AI Compare", href: "/compare" },
  { label: "Phone Agent", href: "/phone" },
  { label: "Pricing",    href: "/pricing" },
];

const adminNavLinks = [
  { label: "Admin", href: "/admin" },
  { label: "Lead Gen", href: "/lead-gen" },
];

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? "bg-white/96 backdrop-blur-md shadow-sm border-b border-amber-200/60"
        : "bg-white/90 backdrop-blur-sm"
    }`}>
      {/* Olympus announcement bar */}
      <div className="bg-[#0a1628] text-amber-400 text-xs py-1.5 text-center font-medium tracking-wider">
        <span className="inline-flex items-center gap-2">
          <Phone className="w-3 h-3" />
          AI Phone Agent Answering 24/7 — Insurance of the Gods
          <Zap className="w-3 h-3" style={{ filter: "drop-shadow(0 0 4px #b8860b)" }} />
        </span>
      </div>

      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-amber-400/30 group-hover:ring-amber-500/60 transition-all shadow-sm">
              <img
                src={ZEUS_ICON_URL}
                alt="Zeus — Gods of Insurance"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="font-bold text-[#0a1628] tracking-wider text-base"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                Gods of Insurance
              </span>
              <span className="text-[10px] text-amber-600 font-medium tracking-[0.2em] uppercase leading-none mt-0.5">
                Insurance of the Gods
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer tracking-wide ${
                    location === link.href
                      ? "text-amber-700 bg-amber-50"
                      : "text-slate-700 hover:text-amber-700 hover:bg-amber-50/70"
                  }`}
                  style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.05em" }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Auth — desktop */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated && user ? (
              <>
                <Link href="/quote">
                  <Button
                    size="sm"
                    className="text-white shadow-sm font-semibold"
                    style={{
                      background: "linear-gradient(135deg, #b8860b, #8b6914)",
                      fontFamily: "Cinzel, serif",
                      fontSize: "0.7rem",
                      letterSpacing: "0.08em",
                    }}
                  >
                    <Zap className="w-3.5 h-3.5 mr-1.5" />
                    Get a Quote
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-amber-50 transition-colors">
                      <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-amber-700" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 max-w-[90px] truncate">
                        {user.name?.split(" ")[0] ?? "Account"}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                          <Shield className="h-4 w-4" /> Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-700 hover:text-amber-700 hover:bg-amber-50"
                  style={{ fontFamily: "Cinzel, serif", fontSize: "0.7rem", letterSpacing: "0.06em" }}
                  asChild
                >
                  <a href={getLoginUrl()}>Sign In</a>
                </Button>
                <Link href="/quote">
                  <Button
                    size="sm"
                    className="text-white shadow-sm font-semibold"
                    style={{
                      background: "linear-gradient(135deg, #b8860b, #8b6914)",
                      fontFamily: "Cinzel, serif",
                      fontSize: "0.7rem",
                      letterSpacing: "0.08em",
                    }}
                  >
                    <Zap className="w-3.5 h-3.5 mr-1.5" />
                    Get a Quote
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-amber-50">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12 bg-white border-l border-amber-100">
              {/* Zeus icon in mobile menu */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <img src={ZEUS_ICON_URL} alt="" className="w-8 h-8 rounded-full ring-1 ring-amber-300" />
                <span className="text-xs font-semibold text-[#0a1628]" style={{ fontFamily: "Cinzel, serif" }}>
                  Gods of Insurance
                </span>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                    <span
                      className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-amber-50 transition-colors cursor-pointer text-slate-700 hover:text-amber-700"
                      style={{ fontFamily: "Cinzel, serif", fontSize: "0.75rem", letterSpacing: "0.04em" }}
                    >
                      {link.label}
                    </span>
                  </Link>
                ))}
                <div className="my-2 border-t border-amber-100" />
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                      <span className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-amber-50 cursor-pointer text-slate-700">
                        Dashboard
                      </span>
                    </Link>
                    {user?.role === "admin" && (
                      <Link href="/admin" onClick={() => setMobileOpen(false)}>
                        <span className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-amber-50 cursor-pointer text-amber-700">
                          Admin Panel
                        </span>
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="px-4 py-3 text-sm font-medium text-destructive text-left rounded-lg hover:bg-destructive/5 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <a href={getLoginUrl()} className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-amber-50 transition-colors text-slate-700">
                      Sign In
                    </a>
                    <Link href="/quote" onClick={() => setMobileOpen(false)}>
                      <Button
                        className="w-full mt-2 text-white"
                        style={{ background: "linear-gradient(135deg, #b8860b, #8b6914)" }}
                      >
                        Get a Quote
                      </Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
