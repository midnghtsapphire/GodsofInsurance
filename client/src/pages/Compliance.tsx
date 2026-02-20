import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Search, CheckCircle2, XCircle, Calculator } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "wouter";

interface StateData {
  code: string; name: string; sr22: boolean; fr44: boolean; duration: string; minLiability: string;
  filingFee: string; eFiling: boolean; notes: string;
}

const statesData: StateData[] = [
  { code: "AL", name: "Alabama", sr22: true, fr44: false, duration: "3 years", minLiability: "25/50/25", filingFee: "$15", eFiling: true, notes: "Required after DUI or driving without insurance" },
  { code: "AK", name: "Alaska", sr22: true, fr44: false, duration: "3 years", minLiability: "50/100/25", filingFee: "$20", eFiling: true, notes: "Higher minimum limits than most states" },
  { code: "AZ", name: "Arizona", sr22: true, fr44: false, duration: "3 years", minLiability: "25/50/15", filingFee: "$15", eFiling: true, notes: "Required for DUI and uninsured driving" },
  { code: "AR", name: "Arkansas", sr22: true, fr44: false, duration: "3 years", minLiability: "25/50/25", filingFee: "$15", eFiling: true, notes: "Points system enforcement" },
  { code: "CA", name: "California", sr22: true, fr44: false, duration: "3 years", minLiability: "15/30/5", filingFee: "$25", eFiling: true, notes: "DMV Form SR-1P required. Immediate suspension without SR-22" },
  { code: "CO", name: "Colorado", sr22: true, fr44: false, duration: "3 years", minLiability: "25/50/15", filingFee: "$20", eFiling: true, notes: "Higher minimum limits. Points system enforcement" },
  { code: "CT", name: "Connecticut", sr22: true, fr44: false, duration: "3 years", minLiability: "25/50/25", filingFee: "$15", eFiling: true, notes: "Required for serious violations" },
  { code: "DE", name: "Delaware", sr22: true, fr44: false, duration: "3 years", minLiability: "25/50/10", filingFee: "$15", eFiling: false, notes: "Paper filing may be required" },
  { code: "FL", name: "Florida", sr22: true, fr44: true, duration: "3 years", minLiability: "10/20/10", filingFee: "$15", eFiling: true, notes: "FR-44 required for DUI: 100/300/50 limits" },
  { code: "GA", name: "Georgia", sr22: true, fr44: false, duration: "3 years", minLiability: "25/50/25", filingFee: "$15", eFiling: true, notes: "Required after DUI or major violations" },
  { code: "HI", name: "Hawaii", sr22: true, fr44: false, duration: "3 years", minLiability: "20/40/10", filingFee: "$15", eFiling: false, notes: "Island-specific filing requirements" },
  { code: "ID", name: "Idaho", sr22: true, fr44: false, duration: "3 years", minLiability: "25/50/15", filingFee: "$15", eFiling: true, notes: "Standard requirements" },
  { code: "IL", name: "Illinois", sr22: true, fr44: false, duration: "3 years", minLiability: "25/50/20", filingFee: "$15", eFiling: true, notes: "Required for DUI and driving without insurance" },
  { code: "IN", name: "Indiana", sr22: true, fr44: false, duration: "3 years", minLiability: "25/50/25", filingFee: "$15", eFiling: true, notes: "Standard SR-22 requirements" },
  { code: "NC", name: "North Carolina", sr22: true, fr44: false, duration: "3 years", minLiability: "30/60/25", filingFee: "$15", eFiling: true, notes: "Highest minimum limits. Safe Driver Incentive Plan" },
  { code: "TX", name: "Texas", sr22: true, fr44: false, duration: "2 years", minLiability: "30/60/25", filingFee: "$25", eFiling: true, notes: "2-year requirement. DPS enforcement" },
  { code: "VA", name: "Virginia", sr22: true, fr44: true, duration: "3 years", minLiability: "25/50/20", filingFee: "$20", eFiling: true, notes: "FR-44 required for DUI: 50/100/40 limits" },
  { code: "NY", name: "New York", sr22: true, fr44: false, duration: "3 years", minLiability: "25/50/10", filingFee: "$15", eFiling: true, notes: "FS-1 form used instead of SR-22" },
  { code: "PA", name: "Pennsylvania", sr22: true, fr44: false, duration: "3 years", minLiability: "15/30/5", filingFee: "$15", eFiling: true, notes: "Lower minimum limits" },
  { code: "OH", name: "Ohio", sr22: true, fr44: false, duration: "3 years", minLiability: "25/50/25", filingFee: "$15", eFiling: true, notes: "BMV enforcement" },
];

export default function Compliance() {
  const [search, setSearch] = useState("");
  const [filterFR44, setFilterFR44] = useState("all");

  const filtered = useMemo(() => {
    return statesData.filter((s) => {
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase());
      const matchFR44 = filterFR44 === "all" || (filterFR44 === "fr44" && s.fr44) || (filterFR44 === "sr22only" && !s.fr44);
      return matchSearch && matchFR44;
    });
  }, [search, filterFR44]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="hero-gradient py-16 relative overflow-hidden">
          <div className="container relative z-10 text-center">
            <Badge variant="secondary" className="bg-white/15 text-white border-white/20 mb-4">Compliance Engine</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>State Compliance Guide</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">Every state has unique SR-22 and FR-44 requirements. Find yours below.</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by state name or code..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
              <Select value={filterFR44} onValueChange={setFilterFR44}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="fr44">FR-44 States</SelectItem>
                  <SelectItem value="sr22only">SR-22 Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filing Fee Calculator */}
            <Card className="mb-8 bg-primary/5 border-primary/20">
              <CardContent className="p-6 flex items-center gap-4">
                <Calculator className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <h3 className="font-semibold">Filing Fee Calculator</h3>
                  <p className="text-sm text-muted-foreground">Select a state above to see estimated filing fees, processing times, and minimum coverage requirements.</p>
                </div>
              </CardContent>
            </Card>

            {/* State Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((state) => (
                <Card key={state.code} className="hover:shadow-card transition-all">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-primary">{state.code}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{state.name}</h3>
                          <span className="text-xs text-muted-foreground">{state.duration}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Badge variant="secondary" className="text-xs">SR-22</Badge>
                        {state.fr44 && <Badge className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-100">FR-44</Badge>}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded bg-muted/50"><div className="text-xs text-muted-foreground">Min. Liability</div><div className="text-xs font-semibold">{state.minLiability}</div></div>
                      <div className="p-2 rounded bg-muted/50"><div className="text-xs text-muted-foreground">Filing Fee</div><div className="text-xs font-semibold">{state.filingFee}</div></div>
                      <div className="p-2 rounded bg-muted/50"><div className="text-xs text-muted-foreground">E-Filing</div><div className="text-xs font-semibold">{state.eFiling ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mx-auto" /> : <XCircle className="h-3.5 w-3.5 text-red-400 mx-auto" />}</div></div>
                    </div>
                    <p className="text-xs text-muted-foreground">{state.notes}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No states match your search criteria.</div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
