import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Sparkles, Star, Loader2, CheckCircle2, AlertTriangle, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

export default function Compare() {
  const { isAuthenticated } = useAuth();
  const [vertical, setVertical] = useState("");
  const [state, setState] = useState("");
  const [coverageType, setCoverageType] = useState("");
  const [result, setResult] = useState<any>(null);

  const compareMutation = trpc.ai.compareQuotes.useMutation({
    onSuccess: (data) => setResult(data),
    onError: (err) => toast.error(err.message),
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <Card className="max-w-md w-full text-center"><CardContent className="p-8 space-y-4">
            <Sparkles className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">Sign In to Compare</h2>
            <p className="text-muted-foreground">AI quote comparison requires an account. Sign in to get started.</p>
            <Button asChild><a href={getLoginUrl()}>Sign In</a></Button>
          </CardContent></Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container max-w-5xl">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3"><Sparkles className="h-3.5 w-3.5 mr-1" /> AI-Powered</Badge>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>Multi-Carrier Comparison</h1>
            <p className="text-muted-foreground">Compare quotes from multiple carriers side-by-side using AI analysis.</p>
          </div>

          {/* Input Form */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Insurance Type</Label>
                  <Select value={vertical} onValueChange={setVertical}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sr22_fr44">SR-22/FR-44</SelectItem>
                      <SelectItem value="burial">Burial</SelectItem>
                      <SelectItem value="tiny_home">Tiny Home</SelectItem>
                      <SelectItem value="pet">Pet</SelectItem>
                      <SelectItem value="gig_economy">Gig Economy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>{US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Coverage</Label>
                  <Select value={coverageType} onValueChange={setCoverageType}>
                    <SelectTrigger><SelectValue placeholder="Select coverage" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimum">Minimum Liability</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="full">Full Coverage</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full" disabled={!vertical || !state || !coverageType || compareMutation.isPending}
                    onClick={() => compareMutation.mutate({ vertical, state, coverageType })}>
                    {compareMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Compare
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <div className="space-y-6 fade-in">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(result.carriers || []).map((carrier: any, i: number) => (
                  <Card key={i} className={`${i === 0 ? "ring-2 ring-primary" : ""}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{carrier.name}</CardTitle>
                        {i === 0 && <Badge>Best Match</Badge>}
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={`h-4 w-4 ${j < carrier.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-3xl font-bold text-primary">${carrier.monthlyPremium}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                        <div className="text-xs text-muted-foreground mt-1">Deductible: ${carrier.deductible}</div>
                      </div>
                      <div className="text-sm"><span className="text-muted-foreground">Limits:</span> {carrier.coverageLimits}</div>
                      <div className="space-y-1.5">
                        {(carrier.highlights || []).map((h: string, k: number) => (
                          <div key={k} className="flex items-start gap-2 text-xs"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />{h}</div>
                        ))}
                      </div>
                      {(carrier.drawbacks || []).length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t">
                          {carrier.drawbacks.map((d: string, k: number) => (
                            <div key={k} className="flex items-start gap-2 text-xs"><AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />{d}</div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {result.recommendation && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6 flex gap-4">
                    <Shield className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <div><h4 className="font-semibold mb-1">AI Recommendation</h4><p className="text-sm text-muted-foreground">{result.recommendation}</p></div>
                  </CardContent>
                </Card>
              )}

              {result.disclaimer && (
                <p className="text-xs text-muted-foreground text-center">{result.disclaimer}</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
