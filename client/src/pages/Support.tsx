import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Plus, Send, Loader2, HelpCircle, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  waiting: "bg-purple-100 text-purple-700",
  resolved: "bg-emerald-100 text-emerald-700",
  closed: "bg-gray-100 text-gray-600",
};

export default function Support() {
  const { isAuthenticated } = useAuth();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<"billing" | "quote" | "technical" | "compliance" | "general">("general");
  const [priority, setPriority] = useState<"low" | "normal" | "high" | "urgent">("normal");
  const [guestEmail, setGuestEmail] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [replyBody, setReplyBody] = useState("");

  const myTickets = trpc.support.myTickets.useQuery(undefined, { enabled: isAuthenticated });
  const selectedTicket = trpc.support.getTicket.useQuery({ id: selectedTicketId! }, { enabled: !!selectedTicketId && isAuthenticated });
  const createTicket = trpc.support.create.useMutation({
    onSuccess: () => {
      toast.success("Support ticket created! We'll respond within 24 hours.");
      setSubject(""); setBody(""); setGuestEmail("");
      if (isAuthenticated) myTickets.refetch();
    },
    onError: (err) => toast.error(err.message),
  });
  const reply = trpc.support.reply.useMutation({
    onSuccess: () => { setReplyBody(""); selectedTicket.refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = () => {
    if (!subject.trim() || !body.trim()) { toast.error("Please fill in subject and message."); return; }
    createTicket.mutate({ subject, body, category, priority, guestEmail: !isAuthenticated ? guestEmail : undefined });
  };

  const handleReply = () => {
    if (!replyBody.trim() || !selectedTicketId) return;
    reply.mutate({ ticketId: selectedTicketId, body: replyBody });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10 bg-muted/20">
        <div className="container max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Support Center</h1>
            <p className="text-muted-foreground">The gods are always listening. Submit a ticket and we'll respond within 24 hours.</p>
          </div>

          {/* Quick contact cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-5 space-y-2">
                <Phone className="h-8 w-8 text-primary mx-auto" />
                <div className="font-semibold">AI Phone Line</div>
                <div className="text-sm text-muted-foreground">24/7 automated agent answers all insurance questions</div>
                <Badge className="bg-emerald-100 text-emerald-700">Always Available</Badge>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-5 space-y-2">
                <MessageSquare className="h-8 w-8 text-primary mx-auto" />
                <div className="font-semibold">Live Chat</div>
                <div className="text-sm text-muted-foreground">Use the chat bubble in the bottom right for instant help</div>
                <Badge className="bg-blue-100 text-blue-700">AI-Powered</Badge>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-5 space-y-2">
                <Mail className="h-8 w-8 text-primary mx-auto" />
                <div className="font-semibold">Email Support</div>
                <div className="text-sm text-muted-foreground">angelreporters@gmail.com — response within 24 hours</div>
                <Badge className="bg-amber-100 text-amber-700">Business Hours</Badge>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="new" className="space-y-6">
            <TabsList>
              <TabsTrigger value="new"><Plus className="h-4 w-4 mr-1" />New Ticket</TabsTrigger>
              {isAuthenticated && <TabsTrigger value="my"><MessageSquare className="h-4 w-4 mr-1" />My Tickets</TabsTrigger>}
              <TabsTrigger value="faq"><HelpCircle className="h-4 w-4 mr-1" />FAQ</TabsTrigger>
            </TabsList>

            {/* New Ticket */}
            <TabsContent value="new">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Submit a Support Request</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isAuthenticated && (
                    <div className="space-y-1">
                      <Label>Your Email</Label>
                      <Input type="email" placeholder="your@email.com" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Category</Label>
                      <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="billing">Billing & Payments</SelectItem>
                          <SelectItem value="quote">Quote Questions</SelectItem>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="compliance">State Compliance</SelectItem>
                          <SelectItem value="general">General Question</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label>Priority</Label>
                      <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Subject</Label>
                    <Input placeholder="Brief description of your issue" value={subject} onChange={e => setSubject(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Message</Label>
                    <Textarea placeholder="Describe your issue in detail. Include any error messages, policy numbers, or state information that may help us assist you faster." value={body} onChange={e => setBody(e.target.value)} className="h-32 resize-none" />
                  </div>
                  <Button onClick={handleSubmit} disabled={createTicket.isPending} className="w-full">
                    {createTicket.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                    Submit Ticket
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Tickets */}
            {isAuthenticated && (
              <TabsContent value="my">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Your Tickets</h3>
                    {myTickets.isLoading ? (
                      <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                    ) : (myTickets.data ?? []).length === 0 ? (
                      <Card><CardContent className="p-6 text-center text-muted-foreground">No tickets yet.</CardContent></Card>
                    ) : (
                      (myTickets.data ?? []).map((t: any) => (
                        <Card
                          key={t.id}
                          className={`cursor-pointer transition-all hover:border-primary ${selectedTicketId === t.id ? "border-primary bg-primary/5" : ""}`}
                          onClick={() => setSelectedTicketId(t.id)}
                        >
                          <CardContent className="p-4 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-sm truncate">{t.subject}</span>
                              <Badge className={`shrink-0 text-xs ${STATUS_COLORS[t.status]}`}>{t.status.replace("_", " ")}</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>

                  <div>
                    {selectedTicketId && selectedTicket.data ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">{selectedTicket.data.ticket.subject}</CardTitle>
                          <Badge className={STATUS_COLORS[selectedTicket.data.ticket.status]}>{selectedTicket.data.ticket.status.replace("_", " ")}</Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            <div className="p-3 rounded-lg bg-muted/50 text-sm">{selectedTicket.data.ticket.body}</div>
                            {selectedTicket.data.replies.map((r: any) => (
                              <div key={r.id} className={`p-3 rounded-lg text-sm ${r.isAdmin ? "bg-primary/10 border border-primary/20" : "bg-muted/30"}`}>
                                <div className="text-xs font-medium mb-1 text-muted-foreground">{r.isAdmin ? "Support Team" : "You"} — {new Date(r.createdAt).toLocaleDateString()}</div>
                                {r.body}
                              </div>
                            ))}
                          </div>
                          {selectedTicket.data.ticket.status !== "closed" && (
                            <div className="flex gap-2">
                              <Textarea placeholder="Add a reply..." value={replyBody} onChange={e => setReplyBody(e.target.value)} className="h-20 resize-none text-sm" />
                              <Button size="sm" onClick={handleReply} disabled={reply.isPending || !replyBody.trim()}>
                                {reply.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
                          Select a ticket to view the conversation.
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>
            )}

            {/* FAQ */}
            <TabsContent value="faq">
              <div className="space-y-4">
                {[
                  { q: "How long does SR-22 filing take?", a: "Most SR-22 filings are processed within 24-48 hours. Electronic filings to the DMV typically update within 1-3 business days." },
                  { q: "What's the difference between SR-22 and FR-44?", a: "SR-22 is required in most states after DUI/DWI or license suspension. FR-44 is specific to Florida and Virginia and requires higher liability limits than SR-22." },
                  { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period." },
                  { q: "How do AI tokens work?", a: "Tokens power AI features like personalized quote comparisons, AI affirmations, and phone call summaries. Each action costs 1-5 tokens depending on complexity." },
                  { q: "Is my personal information secure?", a: "Yes. We use bank-level encryption and never sell your personal information. All data is stored securely and used only to process your insurance requests." },
                  { q: "What states do you cover?", a: "We currently support SR-22/FR-44 filings in all 50 states, with enhanced compliance automation for CA, CO, FL, NC, TX, and VA." },
                ].map((item, i) => (
                  <Card key={i}>
                    <CardContent className="p-5">
                      <h4 className="font-semibold mb-2 flex items-start gap-2">
                        <HelpCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        {item.q}
                      </h4>
                      <p className="text-sm text-muted-foreground pl-6">{item.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
