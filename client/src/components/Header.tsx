import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Shield, Menu, ChevronDown, LogOut, LayoutDashboard, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

const SAKURA_LEFT  = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032705003/WijUsCIssHppvmND.png";
const SAKURA_RIGHT = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032705003/puTyGWFWQvkjsbWj.png";

const navLinks = [
  { label: "Coverage",   href: "/coverage" },
  { label: "Verticals",  href: "/verticals" },
  { label: "Compliance", href: "/compliance" },
  { label: "AI Compare", href: "/compare" },
  { label: "FAQ",        href: "/#faq" },
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
        ? "bg-white/96 backdrop-blur-md shadow-sm border-b border-pink-100/80"
        : "bg-white/85 backdrop-blur-sm"
    }`}>
      {/* Sakura branch decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden xl:block" aria-hidden="true">
        <img src={SAKURA_LEFT}  alt="" className="absolute left-0 -top-4 w-64 opacity-[0.18] select-none" />
        <img src={SAKURA_RIGHT} alt="" className="absolute right-0 -top-4 w-64 opacity-[0.18] select-none" />
      </div>

      <div className="container relative">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white text-lg leading-none select-none">🌸</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                ReinstatePro
              </span>
              <span className="text-[10px] text-pink-400 font-medium tracking-widest uppercase leading-none mt-0.5">
                Gods of Insurance
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  location === link.href
                    ? "text-primary bg-pink-50"
                    : "text-foreground/70 hover:text-foreground hover:bg-pink-50/70"
                }`}>
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
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-sm">
                    Get a Quote
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-pink-50 transition-colors">
                      <div className="h-7 w-7 rounded-full bg-pink-100 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground/80 max-w-[90px] truncate">
                        {user.name?.split(" ")[0] ?? "Account"}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
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
                <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground hover:bg-pink-50" asChild>
                  <a href={getLoginUrl()}>Sign In</a>
                </Button>
                <Link href="/quote">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-sm">
                    Get a Quote
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-pink-50">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12 bg-white border-l border-pink-100">
              {/* Sakura in mobile menu */}
              <div className="absolute top-0 right-0 w-32 opacity-10 pointer-events-none" aria-hidden="true">
                <img src={SAKURA_RIGHT} alt="" />
              </div>
              <nav className="flex flex-col gap-1 relative">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                    <span className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-pink-50 transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                ))}
                <div className="my-2 border-t border-pink-100" />
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                      <span className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-pink-50 cursor-pointer">Dashboard</span>
                    </Link>
                    {user?.role === "admin" && (
                      <Link href="/admin" onClick={() => setMobileOpen(false)}>
                        <span className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-pink-50 cursor-pointer">Admin Panel</span>
                      </Link>
                    )}
                    <button onClick={() => { logout(); setMobileOpen(false); }}
                      className="px-4 py-3 text-sm font-medium text-destructive text-left rounded-lg hover:bg-destructive/5 transition-colors">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <a href={getLoginUrl()} className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-pink-50 transition-colors">
                      Sign In
                    </a>
                    <Link href="/quote" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full mt-2 bg-primary text-white">Get a Quote</Button>
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
