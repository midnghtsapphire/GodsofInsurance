import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Shield, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

const VERTICALS = [
  { value: "sr22_fr44", label: "SR-22 / FR-44 (High-Risk Auto)" },
  { value: "burial", label: "Burial / Final Expense" },
  { value: "tiny_home", label: "Tiny / Mobile Home" },
  { value: "pet", label: "Pet Insurance" },
  { value: "gig_economy", label: "Gig Economy (Rideshare/Delivery)" },
];

const VIOLATION_TYPES = [
  "DUI/DWI", "Driving Without Insurance", "Reckless Driving", "Too Many Points",
  "At-Fault Accident", "License Suspension", "Other",
];

const COVERAGE_TYPES = [
  "SR-22 (Standard)", "FR-44 (FL/VA)", "Non-Owner SR-22", "Full Coverage",
  "Liability Only", "Comprehensive",
];

export default function Quote() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [form, setForm] = useState({
    vertical: "" as string,
    state: "",
    fullName: "",
    email: "",
    phone: "",
    violationType: "",
    coverageType: "",
    consent: false,
  });

  const submitMutation = trpc.quotes.submit.useMutation({
    onSuccess: () => {
      toast.success("Quote request submitted! We'll be in touch within 24 hours.");
      setStep(totalSteps + 1);
    },
    onError: (err) => toast.error(err.message),
  });

  const update = (field: string, value: string | boolean) => setForm((f) => ({ ...f, [field]: value }));
  const canNext = () => {
    if (step === 1) return form.vertical && form.state;
    if (step === 2) return form.violationType || form.vertical !== "sr22_fr44";
    if (step === 3) return form.fullName && form.email;
    if (step === 4) return form.consent;
    return false;
  };

  const handleSubmit = () => {
    if (!form.consent) return toast.error("Please accept the consent to proceed.");
    submitMutation.mutate({
      vertical: form.vertical as any,
      state: form.state,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone || undefined,
      violationType: form.violationType || undefined,
      coverageType: form.coverageType || undefined,
      consent: form.consent,
    });
  };

  // Success state
  if (step > totalSteps) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <Card className="max-w-md w-full text-center">
            <CardContent className="p-8 space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold">Quote Request Submitted!</h2>
              <p className="text-muted-foreground">
                We've received your information and will match you with the best carriers for your needs. Expect a response within 24 hours.
              </p>
              <Button onClick={() => { setStep(1); setForm({ vertical: "", state: "", fullName: "", email: "", phone: "", violationType: "", coverageType: "", consent: false }); }}>
                Submit Another Quote
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container max-w-2xl">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3">
              <Shield className="h-3.5 w-3.5 mr-1" /> QuoteWizard
            </Badge>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>Get Your Free Quote</h1>
            <p className="text-muted-foreground">Complete the steps below. It takes less than 2 minutes.</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <Progress value={(step / totalSteps) * 100} className="h-2" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && "Coverage Type & State"}
                {step === 2 && "Violation & Coverage Details"}
                {step === 3 && "Your Information"}
                {step === 4 && "Review & Submit"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Select the type of insurance you need and your state."}
                {step === 2 && "Tell us about your situation so we can find the best rates."}
                {step === 3 && "We'll use this to send you personalized quotes."}
                {step === 4 && "Review your information and submit your quote request."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label>Insurance Type</Label>
                    <Select value={form.vertical} onValueChange={(v) => update("vertical", v)}>
                      <SelectTrigger><SelectValue placeholder="Select insurance type" /></SelectTrigger>
                      <SelectContent>
                        {VERTICALS.map((v) => <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Select value={form.state} onValueChange={(v) => update("state", v)}>
                      <SelectTrigger><SelectValue placeholder="Select your state" /></SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  {(form.vertical === "sr22_fr44") && (
                    <div className="space-y-2">
                      <Label>Violation Type</Label>
                      <Select value={form.violationType} onValueChange={(v) => update("violationType", v)}>
                        <SelectTrigger><SelectValue placeholder="Select violation type" /></SelectTrigger>
                        <SelectContent>
                          {VIOLATION_TYPES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Preferred Coverage</Label>
                    <Select value={form.coverageType} onValueChange={(v) => update("coverageType", v)}>
                      <SelectTrigger><SelectValue placeholder="Select coverage type" /></SelectTrigger>
                      <SelectContent>
                        {COVERAGE_TYPES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone (Optional)</Label>
                    <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(555) 123-4567" />
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Insurance Type</span><span className="font-medium">{VERTICALS.find(v => v.value === form.vertical)?.label}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">State</span><span className="font-medium">{form.state}</span></div>
                    {form.violationType && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Violation</span><span className="font-medium">{form.violationType}</span></div>}
                    {form.coverageType && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Coverage</span><span className="font-medium">{form.coverageType}</span></div>}
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Name</span><span className="font-medium">{form.fullName}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Email</span><span className="font-medium">{form.email}</span></div>
                    {form.phone && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Phone</span><span className="font-medium">{form.phone}</span></div>}
                  </div>
                  <div className="flex items-start gap-3 pt-2">
                    <Checkbox id="consent" checked={form.consent} onCheckedChange={(c) => update("consent", c === true)} />
                    <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed">
                      I consent to being contacted by licensed insurance agents regarding my quote request. I understand that submitting this form does not obligate me to purchase insurance.
                    </label>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                {step < totalSteps ? (
                  <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!canNext() || submitMutation.isPending}>
                    {submitMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                    Submit Quote Request
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
