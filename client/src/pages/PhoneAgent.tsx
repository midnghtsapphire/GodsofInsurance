import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mic, Zap, Shield, Clock, BarChart2, Loader2, PhoneCall, Volume2, Brain } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PhoneAgent() {
  const { isAuthenticated } = useAuth();
  const callLogs = trpc.phone.logs.useQuery(undefined, { enabled: isAuthenticated });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/30">
          <div className="container max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Phone className="h-4 w-4" /> Insurance of the Gods — Phone Answering Everything
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Your AI Insurance Agent <span className="text-gradient">Answers 24/7</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Never miss a lead again. Our AI phone agent answers every call like a seasoned insurance professional — explaining policies, routing to the right vertical, and booking consultations at 3am on a Sunday.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge className="bg-emerald-100 text-emerald-700 px-4 py-2 text-sm">
                <Clock className="h-3 w-3 mr-1" /> 24/7/365 Availability
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 px-4 py-2 text-sm">
                <Brain className="h-3 w-3 mr-1" /> FOSS-Powered AI
              </Badge>
              <Badge className="bg-amber-100 text-amber-700 px-4 py-2 text-sm">
                <Zap className="h-3 w-3 mr-1" /> Zero Missed Calls
              </Badge>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-5xl">
            <h2 className="text-2xl font-display font-bold text-center mb-10">FOSS-First Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Mic className="h-6 w-6" />,
                  title: "Whisper STT",
                  badge: "OpenAI Open-Source",
                  desc: "OpenAI's Whisper model transcribes caller speech to text in real-time with 95%+ accuracy across accents and dialects. Self-hosted, zero per-call cost.",
                  color: "bg-blue-50 text-blue-600",
                },
                {
                  icon: <Volume2 className="h-6 w-6" />,
                  title: "Piper TTS",
                  badge: "100% FOSS",
                  desc: "Piper is a fast, local neural text-to-speech engine. Produces natural-sounding voice responses with no API fees. Runs entirely on your server.",
                  color: "bg-emerald-50 text-emerald-600",
                },
                {
                  icon: <Brain className="h-6 w-6" />,
                  title: "Vocode Orchestration",
                  badge: "Open-Source",
                  desc: "Vocode is an open-source framework for building voice AI applications. Handles call flow, interruption detection, and turn-taking naturally.",
                  color: "bg-purple-50 text-purple-600",
                },
                {
                  icon: <Phone className="h-6 w-6" />,
                  title: "Google Voice / Twilio",
                  badge: "Hybrid",
                  desc: "Google Voice for free local numbers. Twilio for SIP trunking and advanced call routing. Start free, scale with Twilio as volume grows.",
                  color: "bg-amber-50 text-amber-600",
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Insurance Knowledge Base",
                  badge: "Proprietary",
                  desc: "Custom-trained on SR-22, FR-44, burial, pet, tiny home, and gig economy insurance. Knows state requirements, filing fees, and coverage limits.",
                  color: "bg-rose-50 text-rose-600",
                },
                {
                  icon: <BarChart2 className="h-6 w-6" />,
                  title: "Call Analytics",
                  badge: "Built-in",
                  desc: "Every call is transcribed, summarized, and logged. Track conversion rates, common questions, and agent performance in real-time.",
                  color: "bg-indigo-50 text-indigo-600",
                },
              ].map((item, i) => (
                <Card key={i}>
                  <CardContent className="p-5 space-y-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{item.title}</span>
                        <Badge variant="outline" className="text-xs">{item.badge}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call Flow */}
        <section className="py-16">
          <div className="container max-w-3xl">
            <h2 className="text-2xl font-display font-bold text-center mb-10">How Every Call Works</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Customer Calls Your Number", desc: "Google Voice or Twilio routes the call to the Vocode AI agent running on your server." },
                { step: "2", title: "Whisper Transcribes in Real-Time", desc: "Every word the caller says is transcribed with <200ms latency using the Whisper model." },
                { step: "3", title: "AI Identifies Intent & Vertical", desc: "The LLM determines if the caller needs SR-22, burial insurance, pet coverage, or another vertical." },
                { step: "4", title: "Piper Responds Naturally", desc: "Piper TTS generates a natural voice response explaining options, pricing, and next steps." },
                { step: "5", title: "Lead Captured & Routed", desc: "Caller info is saved to the Lead Gen Engine. High-intent callers are offered a callback or live transfer." },
                { step: "6", title: "Call Summary Emailed", desc: "A full transcript and AI summary is emailed to the agent with action items and follow-up recommendations." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call Logs (if authenticated) */}
        {isAuthenticated && (
          <section className="py-16 bg-muted/30">
            <div className="container max-w-4xl">
              <Tabs defaultValue="logs">
                <TabsList>
                  <TabsTrigger value="logs"><PhoneCall className="h-4 w-4 mr-1" />Call Logs</TabsTrigger>
                  <TabsTrigger value="stats"><BarChart2 className="h-4 w-4 mr-1" />Stats</TabsTrigger>
                </TabsList>
                <TabsContent value="logs" className="mt-6">
                  {callLogs.isLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                  ) : (callLogs.data ?? []).length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center space-y-3">
                        <PhoneCall className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                        <h3 className="font-semibold">No Calls Yet</h3>
                        <p className="text-sm text-muted-foreground">Once your AI phone agent is configured and receives calls, they'll appear here with full transcripts.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {(callLogs.data ?? []).map((call: any) => (
                        <Card key={call.id}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <span className="font-medium">{call.callerPhone || "Unknown"}</span>
                                <Badge className={call.outcome === "converted" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}>
                                  {call.outcome || "completed"}
                                </Badge>
                              </div>
                              {call.summary && <p className="text-sm text-muted-foreground">{call.summary}</p>}
                              <p className="text-xs text-muted-foreground">{new Date(call.createdAt).toLocaleString()}</p>
                            </div>
                            {call.durationSeconds && (
                              <div className="text-right text-sm text-muted-foreground">
                                {Math.floor(call.durationSeconds / 60)}:{String(call.durationSeconds % 60).padStart(2, "0")}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="stats" className="mt-6">
                  {callLogs.isLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(() => {
                        const logs = callLogs.data ?? [];
                        const converted = logs.filter((c: any) => c.outcome === "quoted" || c.outcome === "callback_scheduled").length;
                        const avgDur = logs.length ? Math.round(logs.reduce((a: number, c: any) => a + (c.durationSeconds || 0), 0) / logs.length) : 0;
                        return [
                          { label: "Total Calls", value: logs.length },
                          { label: "Avg Duration", value: `${avgDur}s` },
                          { label: "Converted", value: converted },
                          { label: "Conversion Rate", value: `${logs.length ? Math.round((converted / logs.length) * 100) : 0}%` },
                        ];
                      })().map(s => (
                        <Card key={s.label}>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-primary">{s.value}</div>
                            <div className="text-xs text-muted-foreground">{s.label}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16">
          <div className="container max-w-2xl text-center">
            <h2 className="text-2xl font-display font-bold mb-4">Ready to Never Miss a Lead?</h2>
            <p className="text-muted-foreground mb-6">The AI phone agent is included in all paid plans. Setup takes under 10 minutes with our guided configuration wizard.</p>
            <Button size="lg" onClick={() => toast("Phone agent setup wizard coming soon! Contact angelreporters@gmail.com to get early access.")}>
              <Phone className="h-4 w-4 mr-2" /> Activate Phone Agent
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
