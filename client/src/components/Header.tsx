import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Shield, Menu, ChevronDown, LogOut, LayoutDashboard, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const navLinks = [
  { label: "Coverage", href: "/coverage" },
  { label: "Verticals", href: "/verticals" },
  { label: "Compliance", href: "/compliance" },
  { label: "Get a Quote", href: "/quote" },
  { label: "FAQ", href: "/#faq" },
];

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = location === "/";

  return (
    <header className={`sticky top-0 z-50 w-full transition-all ${isHome ? "glass" : "bg-background border-b"}`}>
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight">ReinstatePro</span>
            <span className="text-[10px] text-muted-foreground leading-none tracking-widest uppercase">Gods of Insurance</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted ${
                location === link.href ? "text-primary bg-primary/5" : "text-foreground/80"
              }`}>
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{user.name || "Account"}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" /> Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
              <Button size="sm" asChild>
                <Link href="/quote">Get a Quote</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 pt-12">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                  <span className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted">{link.label}</span>
                </Link>
              ))}
              <div className="my-2 border-t" />
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <span className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted">Dashboard</span>
                  </Link>
                  {user?.role === "admin" && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)}>
                      <span className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted">Admin Panel</span>
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="px-4 py-3 text-sm font-medium text-destructive text-left rounded-lg hover:bg-destructive/5">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <a href={getLoginUrl()} className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted">Sign In</a>
                  <Link href="/quote" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full mt-2">Get a Quote</Button>
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
