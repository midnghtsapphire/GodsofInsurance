import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileText, Car, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function Coverage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="hero-gradient py-16 relative overflow-hidden">
          <div className="container relative z-10 text-center">
            <Badge variant="secondary" className="bg-white/15 text-white border-white/20 mb-4">Coverage Options</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>SR-22 & FR-44 Coverage</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">Understand your options and find the right coverage for your situation.</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-4xl">
            <Tabs defaultValue="sr22" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sr22">SR-22</TabsTrigger>
                <TabsTrigger value="fr44">FR-44</TabsTrigger>
                <TabsTrigger value="nonowner">Non-Owner</TabsTrigger>
              </TabsList>

              <TabsContent value="sr22" className="space-y-6">
                <Card>
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center"><Shield className="h-6 w-6 text-blue-600" /></div>
                      <div><h2 className="text-2xl font-bold">SR-22 Insurance</h2><p className="text-muted-foreground">Certificate of Financial Responsibility</p></div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">An SR-22 is not a type of insurance — it's a certificate filed by your insurance company with the state DMV proving you carry the minimum required liability coverage. It's typically required after DUI/DWI, driving without insurance, reckless driving, or accumulating too many points.</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                        <h4 className="font-semibold text-sm">When You Need SR-22</h4>
                        <ul className="space-y-1.5 text-sm text-muted-foreground">
                          {["DUI or DWI conviction", "Driving without insurance", "Too many traffic violations", "At-fault accident without insurance", "License reinstatement after suspension"].map(item => (
                            <li key={item} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                        <h4 className="font-semibold text-sm">Key Facts</h4>
                        <ul className="space-y-1.5 text-sm text-muted-foreground">
                          {["Required in most states for 3 years", "Must maintain continuous coverage", "Lapse restarts the requirement period", "Electronic filing available in most states", "Average cost: $15-$25 filing fee"].map(item => (
                            <li key={item} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-sm"><strong className="text-amber-800">Important:</strong> <span className="text-amber-700">If your SR-22 coverage lapses for any reason, your insurance company is required to notify the DMV, which can result in immediate license suspension.</span></div>
                    </div>
                    <Button size="lg" asChild><Link href="/quote">Get Your SR-22 Quote <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fr44" className="space-y-6">
                <Card>
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center"><FileText className="h-6 w-6 text-purple-600" /></div>
                      <div><h2 className="text-2xl font-bold">FR-44 Insurance</h2><p className="text-muted-foreground">Florida & Virginia Only</p></div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">FR-44 is similar to SR-22 but requires significantly higher liability limits. It's only used in Florida and Virginia, typically after a DUI or DWI conviction. The higher limits mean higher premiums, but we compare multiple carriers to find competitive rates.</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                        <h4 className="font-semibold text-sm">Florida FR-44 Requirements</h4>
                        <ul className="space-y-1.5 text-sm text-muted-foreground">
                          {["$100,000 per person bodily injury", "$300,000 per accident bodily injury", "$50,000 property damage", "Required for 3 years after conviction", "Must include PIP and property damage"].map(item => (
                            <li key={item} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-purple-500 shrink-0" />{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                        <h4 className="font-semibold text-sm">Virginia FR-44 Requirements</h4>
                        <ul className="space-y-1.5 text-sm text-muted-foreground">
                          {["$50,000 per person bodily injury", "$100,000 per accident bodily injury", "$40,000 property damage", "Required for 3 years", "Uninsured motorist coverage required"].map(item => (
                            <li key={item} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-purple-500 shrink-0" />{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Button size="lg" asChild><Link href="/quote">Get Your FR-44 Quote <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="nonowner" className="space-y-6">
                <Card>
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center"><Car className="h-6 w-6 text-emerald-600" /></div>
                      <div><h2 className="text-2xl font-bold">Non-Owner SR-22</h2><p className="text-muted-foreground">No Vehicle Required</p></div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">If you need an SR-22 but don't own a vehicle, a non-owner policy is the solution. It provides liability coverage when you drive borrowed or rented vehicles and satisfies state SR-22 requirements at a lower cost than standard policies.</p>
                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                      <h4 className="font-semibold text-sm">Benefits of Non-Owner SR-22</h4>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {["Lower premiums than standard SR-22", "Satisfies state SR-22 requirements", "Coverage when driving borrowed vehicles", "Maintains continuous insurance history", "Easy upgrade when you purchase a vehicle"].map(item => (
                          <li key={item} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />{item}</li>
                        ))}
                      </ul>
                    </div>
                    <Button size="lg" asChild><Link href="/quote">Get Non-Owner Quote <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
