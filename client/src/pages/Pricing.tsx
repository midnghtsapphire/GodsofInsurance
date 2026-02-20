import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Shield, Crown, Coins, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

const PLAN_ICONS: Record<string, React.ReactNode> = {
  small: <Shield className="h-6 w-6" />,
  medium: <Zap className="h-6 w-6" />,
  large: <Crown className="h-6 w-6" />,
  enterprise: <Crown className="h-7 w-7" />,
};

const TOKEN_PACKS = [
  { id: "pack_50" as const, tokens: 50, price: "$9.99", label: "Starter Pack" },
  { id: "pack_200" as const, tokens: 200, price: "$29.99", label: "Power Pack", popular: true },
  { id: "pack_500" as const, tokens: 500, price: "$59.99", label: "Oracle Pack" },
];

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const plans = trpc.billing.plans.useQuery();
  const createCheckout = trpc.billing.createCheckout.useMutation();
  const buyTokens = trpc.billing.buyTokens.useMutation();

  const handleSubscribe = async (tier: "small" | "medium" | "large" | "enterprise") => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setCheckingOut(tier);
    try {
      const result = await createCheckout.mutateAsync({ tier, interval, origin: window.location.origin });
      if (result.url) {
        toast("Redirecting to secure checkout...");
        window.open(result.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Checkout failed. Please try again.");
    } finally {
      setCheckingOut(null);
    }
  };

  const handleBuyTokens = async (pack: "pack_50" | "pack_200" | "pack_500") => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setCheckingOut(pack);
    try {
      const result = await buyTokens.mutateAsync({ pack, origin: window.location.origin });
      if (result.url) {
        toast("Redirecting to secure checkout...");
        window.open(result.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Purchase failed. Please try again.");
    } finally {
      setCheckingOut(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/30 text-center">
          <div className="container max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Crown className="h-4 w-4" /> Divine Protection Plans
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Choose Your <span className="text-gradient">Olympian Tier</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              From mortal to god-tier — every plan includes AI-powered quote comparison, state compliance automation, and 24/7 phone answering.
            </p>
            {/* Interval toggle */}
            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-muted border">
              <button
                onClick={() => setInterval("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${interval === "monthly" ? "bg-background shadow text-foreground" : "text-muted-foreground"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setInterval("yearly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${interval === "yearly" ? "bg-background shadow text-foreground" : "text-muted-foreground"}`}
              >
                Yearly <Badge className="ml-1 bg-emerald-100 text-emerald-700 text-xs">Save 20%</Badge>
              </button>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="py-16">
          <div className="container">
            {plans.isLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(plans.data ?? []).map((plan: any) => {
                  const price = interval === "yearly"
                    ? `$${(plan.yearlyPriceCents / 100).toFixed(0)}/yr`
                    : `$${(plan.monthlyPriceCents / 100).toFixed(0)}/mo`;
                  const isPopular = plan.id === "medium";
                  return (
                    <Card key={plan.id} className={`relative flex flex-col ${isPopular ? "border-primary shadow-lg shadow-primary/10 scale-105" : ""}`}>
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground px-3">Most Popular</Badge>
                        </div>
                      )}
                      <CardHeader className="text-center pb-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${isPopular ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          {PLAN_ICONS[plan.id]}
                        </div>
                        <CardTitle className="text-xl font-display">{plan.name}</CardTitle>
                        <div className="text-3xl font-bold text-primary mt-2">{price}</div>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        <ul className="space-y-2 flex-1 mb-6">
                          {plan.features.map((f: string) => (
                            <li key={f} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className={`w-full ${isPopular ? "" : "variant-outline"}`}
                          variant={isPopular ? "default" : "outline"}
                          onClick={() => handleSubscribe(plan.id)}
                          disabled={checkingOut === plan.id}
                        >
                          {checkingOut === plan.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          {plan.id === "enterprise" ? "Contact Sales" : "Get Started"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Token Packs */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-4xl">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
                <Coins className="h-4 w-4" /> AI Token Packs
              </div>
              <h2 className="text-3xl font-display font-bold mb-3">Need More AI Power?</h2>
              <p className="text-muted-foreground">Tokens power AI quote comparisons, affirmations, and phone call summaries. Buy once, use anytime.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TOKEN_PACKS.map(pack => (
                <Card key={pack.id} className={`text-center ${pack.popular ? "border-primary shadow-lg" : ""}`}>
                  <CardContent className="p-6 space-y-4">
                    {pack.popular && <Badge className="bg-primary text-primary-foreground">Best Value</Badge>}
                    <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto">
                      <Coins className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{pack.tokens} Tokens</div>
                      <div className="text-sm text-muted-foreground">{pack.label}</div>
                    </div>
                    <div className="text-3xl font-bold text-primary">{pack.price}</div>
                    <Button
                      className="w-full"
                      variant={pack.popular ? "default" : "outline"}
                      onClick={() => handleBuyTokens(pack.id)}
                      disabled={checkingOut === pack.id}
                    >
                      {checkingOut === pack.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Buy Tokens
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Test mode notice */}
        <section className="py-8">
          <div className="container max-w-2xl">
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4 text-center text-sm text-amber-800">
                <strong>Test Mode Active</strong> — Use card number <code className="bg-amber-100 px-1 rounded">4242 4242 4242 4242</code> with any future expiry and CVC to test payments. No real charges will occur.
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
