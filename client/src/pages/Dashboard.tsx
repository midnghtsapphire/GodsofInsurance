import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Coins, Shield, Clock, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  quoted: "bg-blue-100 text-blue-700",
  contacted: "bg-purple-100 text-purple-700",
  converted: "bg-emerald-100 text-emerald-700",
  expired: "bg-gray-100 text-gray-600",
};

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const submissions = trpc.quotes.mySubmissions.useQuery(undefined, { enabled: isAuthenticated });
  const billing = trpc.billing.getSubscription.useQuery(undefined, { enabled: isAuthenticated });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <Card className="max-w-md w-full text-center">
            <CardContent className="p-8 space-y-4">
              <Shield className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">Sign In Required</h2>
              <p className="text-muted-foreground">Please sign in to access your dashboard and manage your quotes.</p>
              <Button asChild><a href={getLoginUrl()}>Sign In</a></Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const quotes = submissions.data ?? [];
  const sub = billing.data?.subscription;
  const tokenBalance = billing.data?.tokenBalance ?? 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10 bg-muted/30">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Welcome back, {user?.name || "there"}</h1>
            <p className="text-muted-foreground">Manage your quotes, subscriptions, and AI comparisons.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center"><FileText className="h-5 w-5 text-blue-600" /></div>
                  <div><div className="text-2xl font-bold">{quotes.length}</div><div className="text-xs text-muted-foreground">Total Quotes</div></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center"><Clock className="h-5 w-5 text-amber-600" /></div>
                  <div><div className="text-2xl font-bold">{quotes.filter(q => q.status === "pending").length}</div><div className="text-xs text-muted-foreground">Pending</div></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center"><Shield className="h-5 w-5 text-emerald-600" /></div>
                  <div><div className="text-2xl font-bold">{sub?.tier || "Free"}</div><div className="text-xs text-muted-foreground">Plan</div></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center"><Coins className="h-5 w-5 text-purple-600" /></div>
                  <div><div className="text-2xl font-bold">{tokenBalance}</div><div className="text-xs text-muted-foreground">AI Tokens</div></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="quotes" className="space-y-6">
            <TabsList>
              <TabsTrigger value="quotes">My Quotes</TabsTrigger>
              <TabsTrigger value="ai">AI Comparison</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="quotes" className="space-y-4">
              {quotes.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center space-y-4">
                    <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                    <h3 className="text-lg font-semibold">No Quotes Yet</h3>
                    <p className="text-muted-foreground">Submit your first quote request to get started.</p>
                    <Button asChild><Link href="/quote">Get a Quote <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                  </CardContent>
                </Card>
              ) : (
                quotes.map((q: any) => (
                  <Card key={q.id}>
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{q.vertical.replace("_", " ").toUpperCase()}</span>
                          <Badge className={statusColors[q.status] || ""}>{q.status}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">State: {q.state} | {q.coverageType || "Standard"}</div>
                        <div className="text-xs text-muted-foreground">{new Date(q.createdAt).toLocaleDateString()}</div>
                      </div>
                      {q.estimatedPremium && <div className="text-right"><div className="text-lg font-bold text-primary">${q.estimatedPremium}/mo</div><div className="text-xs text-muted-foreground">Estimated</div></div>}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="ai">
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <Sparkles className="h-12 w-12 text-primary/30 mx-auto" />
                  <h3 className="text-lg font-semibold">AI Quote Comparison</h3>
                  <p className="text-muted-foreground">Use AI to compare quotes from multiple carriers side-by-side. Each comparison costs 1 token.</p>
                  <div className="text-sm">Your balance: <span className="font-bold text-primary">{tokenBalance} tokens</span></div>
                  <Button asChild><Link href="/compare">Start AI Comparison <Sparkles className="ml-2 h-4 w-4" /></Link></Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader><CardTitle>Subscription</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
                    <div><div className="font-semibold capitalize">{sub?.tier || "Free"} Plan</div><div className="text-sm text-muted-foreground">{sub?.status || "Active"}</div></div>
                    <Button variant="outline" onClick={() => toast("Feature coming soon")}>Manage Plan</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50"><div className="text-sm text-muted-foreground">Tokens Included</div><div className="text-xl font-bold">{sub?.tokensIncluded ?? 10}</div></div>
                    <div className="p-4 rounded-lg bg-muted/50"><div className="text-sm text-muted-foreground">Tokens Used</div><div className="text-xl font-bold">{sub?.tokensUsed ?? 0}</div></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function toast(msg: string) {
  import("sonner").then(({ toast: t }) => t(msg));
}
