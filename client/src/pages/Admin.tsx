import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { DashboardLayoutSkeleton } from "@/components/DashboardLayoutSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  LayoutDashboard, Users, FileText, TrendingUp, Search, Download, Shield,
  ChevronLeft, ChevronRight, BarChart3, MapPin, Loader2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  quoted: "bg-blue-100 text-blue-700",
  contacted: "bg-purple-100 text-purple-700",
  converted: "bg-emerald-100 text-emerald-700",
  expired: "bg-gray-100 text-gray-600",
};

const verticalLabels: Record<string, string> = {
  sr22_fr44: "SR-22/FR-44",
  burial: "Burial",
  tiny_home: "Tiny Home",
  pet: "Pet",
  gig_economy: "Gig Economy",
};

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [tab, setTab] = useState("leads");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verticalFilter, setVerticalFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const leads = trpc.quotes.list.useQuery(
    { status: statusFilter, vertical: verticalFilter, search, limit: pageSize, offset: page * pageSize },
    { enabled: isAuthenticated && user?.role === "admin" }
  );
  const analytics = trpc.analytics.summary.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const byVertical = trpc.analytics.leadsByVertical.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const byState = trpc.analytics.leadsByState.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const allUsers = trpc.analytics.allUsers.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });

  const updateStatus = trpc.quotes.updateStatus.useMutation({
    onSuccess: () => { leads.refetch(); analytics.refetch(); toast.success("Status updated"); },
    onError: (err) => toast.error(err.message),
  });

  if (loading) return <DashboardLayoutSkeleton />;
  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full text-center"><CardContent className="p-8 space-y-4">
        <Shield className="h-12 w-12 text-primary mx-auto" />
        <h2 className="text-2xl font-bold">Admin Access Required</h2>
        <p className="text-muted-foreground">Please sign in with an admin account.</p>
        <Button asChild><a href={getLoginUrl()}>Sign In</a></Button>
      </CardContent></Card>
    </div>
  );
  if (user?.role !== "admin") return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full text-center"><CardContent className="p-8 space-y-4">
        <Shield className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground">You don't have admin privileges.</p>
        <Button variant="outline" asChild><Link href="/">Go Home</Link></Button>
      </CardContent></Card>
    </div>
  );

  const stats = analytics.data;
  const exportLeads = () => {
    const data = leads.data?.submissions ?? [];
    const csv = ["ID,Name,Email,State,Vertical,Status,Date", ...data.map((l: any) =>
      `${l.id},"${l.fullName}","${l.email}",${l.state},${l.vertical},${l.status},${new Date(l.createdAt).toISOString()}`
    )].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "leads-export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/"><span className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /><span className="font-bold">ReinstatePro</span></span></Link>
            <Badge variant="secondary">Admin</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{user.name || user.email}</span>
            <Link href="/dashboard"><Button variant="ghost" size="sm">Dashboard</Button></Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Leads", value: stats?.totalLeads ?? 0, icon: FileText, color: "text-blue-600 bg-blue-50" },
            { label: "Converted", value: stats?.convertedLeads ?? 0, icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
            { label: "Pending", value: stats?.pendingLeads ?? 0, icon: LayoutDashboard, color: "text-amber-600 bg-amber-50" },
            { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-purple-600 bg-purple-50" },
            { label: "Est. Revenue", value: `$${stats?.revenueEstimate ?? 0}`, icon: BarChart3, color: "text-green-600 bg-green-50" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`}><s.icon className="h-5 w-5" /></div>
                <div><div className="text-xl font-bold">{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="leads"><FileText className="h-4 w-4 mr-1" /> Leads</TabsTrigger>
            <TabsTrigger value="analytics"><BarChart3 className="h-4 w-4 mr-1" /> Analytics</TabsTrigger>
            <TabsTrigger value="users"><Users className="h-4 w-4 mr-1" /> Users</TabsTrigger>
          </TabsList>

          {/* LEADS TAB */}
          <TabsContent value="leads" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search leads..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="pl-10" /></div>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="quoted">Quoted</SelectItem><SelectItem value="contacted">Contacted</SelectItem><SelectItem value="converted">Converted</SelectItem><SelectItem value="expired">Expired</SelectItem></SelectContent></Select>
              <Select value={verticalFilter} onValueChange={(v) => { setVerticalFilter(v); setPage(0); }}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Verticals</SelectItem><SelectItem value="sr22_fr44">SR-22/FR-44</SelectItem><SelectItem value="burial">Burial</SelectItem><SelectItem value="tiny_home">Tiny Home</SelectItem><SelectItem value="pet">Pet</SelectItem><SelectItem value="gig_economy">Gig Economy</SelectItem></SelectContent></Select>
              <Button variant="outline" onClick={exportLeads}><Download className="h-4 w-4 mr-2" /> Export</Button>
            </div>

            {leads.isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <>
                <div className="space-y-2">
                  {(leads.data?.submissions ?? []).map((lead: any) => (
                    <Card key={lead.id}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold truncate">{lead.fullName}</span>
                            <Badge className={`text-xs ${statusColors[lead.status]}`}>{lead.status}</Badge>
                            <Badge variant="outline" className="text-xs">{verticalLabels[lead.vertical] || lead.vertical}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">{lead.email} | {lead.state} | {new Date(lead.createdAt).toLocaleDateString()}</div>
                        </div>
                        <LeadActions lead={lead} onUpdate={(id, status, notes) => updateStatus.mutate({ id, status: status as any, notes })} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {(leads.data?.submissions ?? []).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">No leads found matching your filters.</div>
                )}
                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, leads.data?.total ?? 0)} of {leads.data?.total ?? 0}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" disabled={(page + 1) * pageSize >= (leads.data?.total ?? 0)} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Leads by Vertical</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {(byVertical.data ?? []).map((v: any) => (
                    <div key={v.vertical} className="flex items-center justify-between">
                      <span className="text-sm">{verticalLabels[v.vertical] || v.vertical}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (v.count / (stats?.totalLeads || 1)) * 100)}%` }} />
                        </div>
                        <span className="text-sm font-semibold w-8 text-right">{v.count}</span>
                      </div>
                    </div>
                  ))}
                  {(byVertical.data ?? []).length === 0 && <p className="text-sm text-muted-foreground">No data yet</p>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Leads by State</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {(byState.data ?? []).slice(0, 10).map((s: any) => (
                    <div key={s.state} className="flex items-center justify-between">
                      <span className="text-sm flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{s.state}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${Math.min(100, (s.count / (stats?.totalLeads || 1)) * 100)}%` }} />
                        </div>
                        <span className="text-sm font-semibold w-8 text-right">{s.count}</span>
                      </div>
                    </div>
                  ))}
                  {(byState.data ?? []).length === 0 && <p className="text-sm text-muted-foreground">No data yet</p>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users" className="space-y-4">
            {(allUsers.data ?? []).map((u: any) => (
              <Card key={u.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {(u.name || u.email || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{u.name || "Unnamed"}</div>
                      <div className="text-sm text-muted-foreground">{u.email || "No email"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function LeadActions({ lead, onUpdate }: { lead: any; onUpdate: (id: number, status: string, notes?: string) => void }) {
  const [notes, setNotes] = useState(lead.notes || "");
  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline" size="sm">Manage</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Manage Lead: {lead.fullName}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Email:</span> {lead.email}</div>
            <div><span className="text-muted-foreground">Phone:</span> {lead.phone || "N/A"}</div>
            <div><span className="text-muted-foreground">State:</span> {lead.state}</div>
            <div><span className="text-muted-foreground">Vertical:</span> {verticalLabels[lead.vertical]}</div>
            <div><span className="text-muted-foreground">Violation:</span> {lead.violationType || "N/A"}</div>
            <div><span className="text-muted-foreground">Coverage:</span> {lead.coverageType || "N/A"}</div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes about this lead..." />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["pending", "quoted", "contacted", "converted", "expired"].map((s) => (
              <Button key={s} variant={lead.status === s ? "default" : "outline"} size="sm" onClick={() => onUpdate(lead.id, s, notes)} className="capitalize">
                {s}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
