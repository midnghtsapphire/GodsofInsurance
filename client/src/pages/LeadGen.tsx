import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Users, TrendingUp, Heart, Home, Briefcase, Baby, Zap,
  Plus, Search, RefreshCw, FileText, Star, Phone, Mail,
  MapPin, Calendar, ChevronRight, Sparkles, AlertCircle,
} from "lucide-react";

const SOURCE_TYPES = [
  { value: "marriage_license", label: "Marriage License", icon: Heart, vertical: "life/home", color: "text-rose-600", bg: "bg-rose-50 border-rose-200" },
  { value: "home_purchase", label: "Home Purchase", icon: Home, vertical: "home/life", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  { value: "business_filing", label: "Business Filing", icon: Briefcase, vertical: "gig/life", color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  { value: "birth_record", label: "Birth Record", icon: Baby, vertical: "life/burial", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  { value: "divorce_record", label: "Divorce Record", icon: FileText, vertical: "life/sr22", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  { value: "vehicle_registration", label: "Vehicle Registration", icon: Zap, vertical: "sr22/fr44", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-purple-100 text-purple-800",
  converted: "bg-green-100 text-green-800",
  dead: "bg-gray-100 text-gray-500",
};

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

export default function LeadGen() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "leads" | "seed" | "bulk">("dashboard");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterSource, setFilterSource] = useState<string>("");
  const [filterState, setFilterState] = useState<string>("");

  // Seed form state
  const [seedForm, setSeedForm] = useState({
    sourceType: "marriage_license" as const,
    sourceState: "CA",
    sourceCounty: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    suggestedVertical: "life" as const,
  });

  // Bulk seed form
  const [bulkForm, setBulkForm] = useState({
    sourceType: "marriage_license" as const,
    sourceState: "CA",
    rawText: "",
  });

  const statsQuery = trpc.leadGen.stats.useQuery();
  const leadsQuery = trpc.leadGen.list.useQuery({
    status: filterStatus as any || undefined,
    sourceType: filterSource as any || undefined,
    sourceState: filterState || undefined,
    limit: 50,
    offset: 0,
  });

  const seedMutation = trpc.leadGen.seed.useMutation({
    onSuccess: () => {
      toast.success("Lead seeded successfully!");
      leadsQuery.refetch();
      statsQuery.refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const bulkSeedMutation = trpc.leadGen.bulkSeed.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.seeded} leads extracted and seeded!`);
      leadsQuery.refetch();
      statsQuery.refetch();
      setBulkForm(prev => ({ ...prev, rawText: "" }));
    },
    onError: (e) => toast.error(e.message),
  });

  const updateStatusMutation = trpc.leadGen.updateStatus.useMutation({
    onSuccess: () => {
      leadsQuery.refetch();
      statsQuery.refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: "Cinzel, serif" }}>Admin Access Required</h2>
            <p className="text-muted-foreground mb-4">You need admin privileges to access the Lead Generation Engine.</p>
            <Link href="/"><Button variant="outline">Return Home</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = statsQuery.data;
  const leads = leadsQuery.data ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <div className="border-b" style={{ background: "linear-gradient(135deg, #0a1628, #1a2d4a)" }}>
          <div className="container py-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg" style={{ background: "rgba(184,134,11,0.15)", border: "1px solid rgba(184,134,11,0.3)" }}>
                <Sparkles className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Cinzel, serif" }}>
                  Lead Generation Engine
                </h1>
                <p className="text-amber-300/70 text-sm">Public Records Intelligence — Disrupt the $40-$150/lead monopoly</p>
              </div>
            </div>

            {/* FOSS Philosophy Banner */}
            <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: "rgba(184,134,11,0.08)", border: "1px solid rgba(184,134,11,0.2)" }}>
              <p className="text-amber-300/80">
                <strong className="text-amber-400">FOSS-First Strategy:</strong> Marriage licenses, home purchases, business filings, and birth records are
                public in every US county. Instead of paying $40–$150 per lead to aggregators who sell the same lead to 5+ agents,
                we generate exclusive leads directly from public records — at zero cost.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-5">
              {[
                { id: "dashboard", label: "Dashboard" },
                { id: "leads", label: `Leads (${stats?.total ?? 0})` },
                { id: "seed", label: "Add Lead" },
                { id: "bulk", label: "AI Bulk Extract" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-[#0a1628] font-semibold"
                      : "text-white/60 hover:text-white/90"
                  }`}
                  style={activeTab === tab.id ? { background: "linear-gradient(135deg, #f0c040, #b8860b)" } : {}}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container py-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: "Total Leads", value: stats?.total ?? 0, color: "text-slate-800" },
                  { label: "New", value: stats?.new ?? 0, color: "text-blue-700" },
                  { label: "Contacted", value: stats?.contacted ?? 0, color: "text-yellow-700" },
                  { label: "Qualified", value: stats?.qualified ?? 0, color: "text-purple-700" },
                  { label: "Converted", value: stats?.converted ?? 0, color: "text-green-700" },
                ].map(stat => (
                  <Card key={stat.label} className="border-amber-100">
                    <CardContent className="pt-4 pb-4">
                      <div className={`text-2xl font-bold ${stat.color}`} style={{ fontFamily: "Cinzel, serif" }}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Source Types Guide */}
              <Card className="border-amber-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base" style={{ fontFamily: "Cinzel, serif" }}>
                    Public Record Sources & Insurance Verticals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {SOURCE_TYPES.map(src => {
                      const Icon = src.icon;
                      return (
                        <div key={src.value} className={`p-3 rounded-lg border ${src.bg}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className={`h-4 w-4 ${src.color}`} />
                            <span className="font-medium text-sm">{src.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Best for: <strong>{src.vertical}</strong></p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Why This Works */}
              <Card className="border-amber-100" style={{ background: "linear-gradient(135deg, #0a1628, #1a2d4a)" }}>
                <CardContent className="pt-6">
                  <h3 className="text-white font-bold mb-3" style={{ fontFamily: "Cinzel, serif" }}>
                    Why Newlyweds Are the Perfect Insurance Target
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    {[
                      { title: "Life Events = Coverage Gaps", desc: "Marriage creates immediate need for life insurance, home insurance, and beneficiary updates." },
                      { title: "Public Records = Free Leads", desc: "Every US county publishes marriage licenses. No API needed — just systematic collection." },
                      { title: "Exclusive vs. Shared Leads", desc: "Industry aggregators sell each lead to 5+ agents. Our leads are exclusive — 100% yours." },
                    ].map(item => (
                      <div key={item.title} className="p-3 rounded-lg" style={{ background: "rgba(184,134,11,0.08)", border: "1px solid rgba(184,134,11,0.2)" }}>
                        <div className="text-amber-400 font-semibold mb-1">{item.title}</div>
                        <p className="text-slate-300/80 text-xs">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Leads Tab */}
          {activeTab === "leads" && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-36 border-amber-200">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    {["new","contacted","qualified","converted","dead"].map(s => (
                      <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterSource} onValueChange={setFilterSource}>
                  <SelectTrigger className="w-44 border-amber-200">
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sources</SelectItem>
                    {SOURCE_TYPES.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterState} onValueChange={setFilterState}>
                  <SelectTrigger className="w-28 border-amber-200">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All States</SelectItem>
                    {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon" onClick={() => leadsQuery.refetch()} className="border-amber-200">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              {/* Leads Table */}
              {leads.length === 0 ? (
                <Card className="border-amber-100">
                  <CardContent className="py-12 text-center">
                    <Users className="h-10 w-10 text-amber-300 mx-auto mb-3" />
                    <p className="text-muted-foreground">No leads yet. Use "Add Lead" or "AI Bulk Extract" to seed your pipeline.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {leads.map((lead: any) => {
                    const src = SOURCE_TYPES.find(s => s.value === lead.sourceType);
                    const Icon = src?.icon ?? Users;
                    return (
                      <Card key={lead.id} className="border-amber-100 hover:border-amber-300 transition-colors">
                        <CardContent className="py-3 px-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`p-1.5 rounded-md ${src?.bg ?? "bg-gray-50 border-gray-200"} border flex-shrink-0`}>
                                <Icon className={`h-3.5 w-3.5 ${src?.color ?? "text-gray-500"}`} />
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-sm truncate">{lead.fullName ?? "Unknown"}</div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                  {lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>}
                                  {lead.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>}
                                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{lead.sourceState}</span>
                                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(lead.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge className={`text-xs ${STATUS_COLORS[lead.status] ?? "bg-gray-100"}`}>
                                {lead.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs border-amber-200 text-amber-700">
                                {lead.suggestedVertical}
                              </Badge>
                              <Select
                                value={lead.status}
                                onValueChange={(val) => updateStatusMutation.mutate({ id: lead.id, status: val as any })}
                              >
                                <SelectTrigger className="h-7 w-28 text-xs border-amber-200">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {["new","contacted","qualified","converted","dead"].map(s => (
                                    <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Seed Tab */}
          {activeTab === "seed" && (
            <Card className="border-amber-100 max-w-2xl">
              <CardHeader>
                <CardTitle style={{ fontFamily: "Cinzel, serif" }}>Add a Public Record Lead</CardTitle>
                <p className="text-sm text-muted-foreground">Manually enter a lead sourced from public records</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Source Type</label>
                    <Select value={seedForm.sourceType} onValueChange={(v) => setSeedForm(p => ({ ...p, sourceType: v as any }))}>
                      <SelectTrigger className="mt-1 border-amber-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SOURCE_TYPES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">State</label>
                    <Select value={seedForm.sourceState} onValueChange={(v) => setSeedForm(p => ({ ...p, sourceState: v }))}>
                      <SelectTrigger className="mt-1 border-amber-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Full Name</label>
                  <Input
                    className="mt-1 border-amber-200"
                    placeholder="Jane & John Smith"
                    value={seedForm.fullName}
                    onChange={e => setSeedForm(p => ({ ...p, fullName: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
                    <Input
                      className="mt-1 border-amber-200"
                      type="email"
                      placeholder="jane@example.com"
                      value={seedForm.email}
                      onChange={e => setSeedForm(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</label>
                    <Input
                      className="mt-1 border-amber-200"
                      placeholder="(555) 000-0000"
                      value={seedForm.phone}
                      onChange={e => setSeedForm(p => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Suggested Vertical</label>
                  <Select value={seedForm.suggestedVertical} onValueChange={(v) => setSeedForm(p => ({ ...p, suggestedVertical: v as any }))}>
                    <SelectTrigger className="mt-1 border-amber-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["sr22_fr44","burial","tiny_home","pet","gig_economy","life","home"].map(v => (
                        <SelectItem key={v} value={v}>{v.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full text-[#0a1628] font-bold"
                  style={{ background: "linear-gradient(135deg, #f0c040, #b8860b)" }}
                  onClick={() => seedMutation.mutate({
                    sourceType: seedForm.sourceType,
                    sourceState: seedForm.sourceState,
                    fullName: seedForm.fullName || undefined,
                    email: seedForm.email || undefined,
                    phone: seedForm.phone || undefined,
                    suggestedVertical: seedForm.suggestedVertical,
                  })}
                  disabled={seedMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {seedMutation.isPending ? "Adding..." : "Add Lead to Pipeline"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Bulk AI Extract Tab */}
          {activeTab === "bulk" && (
            <Card className="border-amber-100 max-w-2xl">
              <CardHeader>
                <CardTitle style={{ fontFamily: "Cinzel, serif" }}>AI Bulk Lead Extraction</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Paste raw public record data (CSV, text, HTML table) and our AI will extract individual leads
                  and automatically assign the best insurance vertical.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Record Type</label>
                    <Select value={bulkForm.sourceType} onValueChange={(v) => setBulkForm(p => ({ ...p, sourceType: v as any }))}>
                      <SelectTrigger className="mt-1 border-amber-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SOURCE_TYPES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">State</label>
                    <Select value={bulkForm.sourceState} onValueChange={(v) => setBulkForm(p => ({ ...p, sourceState: v }))}>
                      <SelectTrigger className="mt-1 border-amber-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Raw Public Record Data</label>
                  <Textarea
                    className="mt-1 border-amber-200 min-h-[200px] font-mono text-xs"
                    placeholder={`Paste raw data here — CSV, text, or HTML table from county records.\n\nExample:\nSmith, John & Jane — License #2024-001234 — Filed: 01/15/2024\nJohnson, Robert & Mary — License #2024-001235 — Filed: 01/15/2024\n...`}
                    value={bulkForm.rawText}
                    onChange={e => setBulkForm(p => ({ ...p, rawText: e.target.value }))}
                  />
                </div>

                <div className="p-3 rounded-lg text-xs" style={{ background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.2)" }}>
                  <p className="text-amber-700">
                    <strong>How it works:</strong> Our AI reads the raw data, extracts individual names/contacts,
                    and assigns the best insurance vertical based on the life event. Marriage licenses → life & home insurance.
                    Home purchases → home & life. Business filings → gig economy coverage.
                  </p>
                </div>

                <Button
                  className="w-full text-[#0a1628] font-bold"
                  style={{ background: "linear-gradient(135deg, #f0c040, #b8860b)" }}
                  onClick={() => bulkSeedMutation.mutate(bulkForm)}
                  disabled={bulkSeedMutation.isPending || !bulkForm.rawText.trim()}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {bulkSeedMutation.isPending ? "Extracting leads with AI..." : "Extract & Seed Leads with AI"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
