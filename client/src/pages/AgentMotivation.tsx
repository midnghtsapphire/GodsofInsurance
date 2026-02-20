import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Target, Heart, Star, Sparkles, Plus, Loader2, Trophy, Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

const MOOD_OPTIONS = [
  { value: "great", label: "⚡ Crushing It", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { value: "good", label: "🔥 Feeling Good", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "okay", label: "⚖️ Holding Steady", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "tough", label: "🌩️ Tough Day", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "burnout", label: "🌑 Need Renewal", color: "bg-red-100 text-red-700 border-red-200" },
] as const;

export default function AgentMotivation() {
  const { isAuthenticated, user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<"great" | "good" | "okay" | "tough" | "burnout">("good");
  const [wins, setWins] = useState("");
  const [challenges, setChallenges] = useState("");
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalDate, setNewGoalDate] = useState("");
  const [showGoalForm, setShowGoalForm] = useState(false);

  const affirmation = trpc.agent.getAffirmation.useQuery(undefined, { enabled: isAuthenticated });
  const aiAffirmation = trpc.agent.getAIAffirmation.useMutation();
  const goals = trpc.agent.myGoals.useQuery(undefined, { enabled: isAuthenticated });
  const checkIns = trpc.agent.myCheckIns.useQuery(undefined, { enabled: isAuthenticated });
  const createGoal = trpc.agent.createGoal.useMutation({ onSuccess: () => { goals.refetch(); setShowGoalForm(false); setNewGoalTitle(""); setNewGoalTarget(""); setNewGoalDate(""); } });
  const checkIn = trpc.agent.checkIn.useMutation({ onSuccess: () => { checkIns.refetch(); toast.success("Check-in recorded! The gods note your progress."); setWins(""); setChallenges(""); } });
  const updateProgress = trpc.agent.updateProgress.useMutation({ onSuccess: () => goals.refetch() });
  const utils = trpc.useUtils();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <Card className="max-w-md w-full text-center">
            <CardContent className="p-8 space-y-4">
              <Flame className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold font-display">Agent Sanctuary</h2>
              <p className="text-muted-foreground">Sign in to access your daily affirmations, goal tracker, and motivation tools.</p>
              <Button asChild><a href={getLoginUrl()}>Sign In to Enter</a></Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAIAffirmation = async () => {
    try {
      const result = await aiAffirmation.mutateAsync({ mood: selectedMood });
      toast.success(result.affirmation, { duration: 8000 });
      utils.agent.getAffirmation.invalidate();
    } catch (err: any) {
      if (err.message?.includes("Insufficient tokens")) {
        toast.error("You need tokens for AI affirmations. Visit Pricing to get more.");
      } else {
        toast.error("Could not generate affirmation. Try again.");
      }
    }
  };

  const handleCheckIn = () => {
    checkIn.mutate({ mood: selectedMood, wins, challenges, affirmationSeen: affirmation.data?.affirmation });
  };

  const handleCreateGoal = () => {
    if (!newGoalTitle.trim()) return;
    createGoal.mutate({ title: newGoalTitle, targetAmount: newGoalTarget || undefined, targetDate: newGoalDate || undefined });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10 bg-muted/20">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Flame className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold">Agent Sanctuary</h1>
                <p className="text-muted-foreground text-sm">Your daily source of divine motivation, {user?.name?.split(" ")[0] || "Agent"}.</p>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-amber-500/5 border border-primary/10">
              <p className="text-sm text-muted-foreground italic">
                "Insurance agents are the unsung heroes of financial security. Every policy you write is a shield for a family. That is divine work."
              </p>
            </div>
          </div>

          <Tabs defaultValue="affirmation" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="affirmation"><Star className="h-4 w-4 mr-1" />Daily Oracle</TabsTrigger>
              <TabsTrigger value="checkin"><Heart className="h-4 w-4 mr-1" />Check-In</TabsTrigger>
              <TabsTrigger value="goals"><Target className="h-4 w-4 mr-1" />Goals</TabsTrigger>
              <TabsTrigger value="history"><Calendar className="h-4 w-4 mr-1" />History</TabsTrigger>
            </TabsList>

            {/* Daily Affirmation */}
            <TabsContent value="affirmation">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-primary/5 to-amber-500/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-display">
                      <Star className="h-5 w-5 text-primary" /> Oracle of Olympus
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {affirmation.isLoading ? (
                      <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                    ) : (
                      <blockquote className="text-lg font-medium leading-relaxed border-l-4 border-primary pl-4 italic">
                        "{affirmation.data?.affirmation}"
                      </blockquote>
                    )}
                    <p className="text-xs text-muted-foreground">Today's divine message — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-display">
                      <Sparkles className="h-5 w-5 text-amber-500" /> AI-Personalized Affirmation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">Tell the Oracle how you're feeling and receive a personalized message crafted just for you. (1 token)</p>
                    <div className="grid grid-cols-1 gap-2">
                      {MOOD_OPTIONS.map(m => (
                        <button
                          key={m.value}
                          onClick={() => setSelectedMood(m.value)}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium text-left transition-all ${selectedMood === m.value ? m.color + " ring-2 ring-primary" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                    <Button onClick={handleAIAffirmation} disabled={aiAffirmation.isPending} className="w-full">
                      {aiAffirmation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                      Invoke the Oracle (1 token)
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Daily Check-In */}
            <TabsContent value="checkin">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-500" /> Daily Check-In
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">How are you feeling today?</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {MOOD_OPTIONS.map(m => (
                        <button
                          key={m.value}
                          onClick={() => setSelectedMood(m.value)}
                          className={`px-3 py-3 rounded-lg border text-sm font-medium text-center transition-all ${selectedMood === m.value ? m.color + " ring-2 ring-primary" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="wins">Today's Wins (optional)</Label>
                      <Textarea id="wins" placeholder="What went well? Any policies written, calls made, connections formed..." value={wins} onChange={e => setWins(e.target.value)} className="h-24 resize-none" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="challenges">Challenges (optional)</Label>
                      <Textarea id="challenges" placeholder="What was tough? Rejections, difficult clients, admin overload..." value={challenges} onChange={e => setChallenges(e.target.value)} className="h-24 resize-none" />
                    </div>
                  </div>
                  <Button onClick={handleCheckIn} disabled={checkIn.isPending} className="w-full">
                    {checkIn.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Heart className="h-4 w-4 mr-2" />}
                    Record Today's Check-In
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Goals */}
            <TabsContent value="goals">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-lg">Commission & Activity Goals</h3>
                  <Button size="sm" onClick={() => setShowGoalForm(!showGoalForm)}>
                    <Plus className="h-4 w-4 mr-1" /> Add Goal
                  </Button>
                </div>

                {showGoalForm && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-3 space-y-1">
                          <Label>Goal Title</Label>
                          <Input placeholder="e.g., Write 10 SR-22 policies this month" value={newGoalTitle} onChange={e => setNewGoalTitle(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label>Target Amount ($)</Label>
                          <Input placeholder="e.g., 5000" value={newGoalTarget} onChange={e => setNewGoalTarget(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label>Target Date</Label>
                          <Input type="date" value={newGoalDate} onChange={e => setNewGoalDate(e.target.value)} />
                        </div>
                        <div className="flex items-end">
                          <Button onClick={handleCreateGoal} disabled={createGoal.isPending || !newGoalTitle.trim()} className="w-full">
                            {createGoal.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Goal"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {goals.isLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : (goals.data ?? []).length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center space-y-3">
                      <Target className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                      <h3 className="font-semibold">No Goals Yet</h3>
                      <p className="text-sm text-muted-foreground">Set your first commission goal and let the gods guide your path.</p>
                    </CardContent>
                  </Card>
                ) : (
                  (goals.data ?? []).map((goal: any) => {
                    const current = parseFloat(goal.currentAmount || "0");
                    const target = parseFloat(goal.targetAmount || "100");
                    const pct = Math.min(100, Math.round((current / target) * 100));
                    return (
                      <Card key={goal.id}>
                        <CardContent className="p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Trophy className="h-4 w-4 text-amber-500" />
                              <span className="font-medium">{goal.title}</span>
                            </div>
                            {goal.targetDate && (
                              <Badge variant="outline" className="text-xs">
                                Due {new Date(goal.targetDate).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                          {goal.targetAmount && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>${current.toLocaleString()} / ${parseFloat(goal.targetAmount).toLocaleString()}</span>
                                <span>{pct}%</span>
                              </div>
                              <Progress value={pct} className="h-2" />
                            </div>
                          )}
                          {goal.targetAmount && (
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                placeholder="Update current amount"
                                className="h-8 text-sm"
                                onKeyDown={e => {
                                  if (e.key === "Enter") {
                                    updateProgress.mutate({ id: goal.id, currentAmount: (e.target as HTMLInputElement).value });
                                  }
                                }}
                              />
                              <Button size="sm" variant="outline" className="h-8 text-xs">Update</Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>

            {/* History */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" /> Check-In History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {checkIns.isLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                  ) : (checkIns.data ?? []).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No check-ins yet. Start your daily practice today.</div>
                  ) : (
                    <div className="space-y-3">
                      {(checkIns.data ?? []).map((ci: any) => {
                        const mood = MOOD_OPTIONS.find(m => m.value === ci.mood);
                        return (
                          <div key={ci.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                            <Badge className={`shrink-0 ${mood?.color}`}>{mood?.label}</Badge>
                            <div className="flex-1 min-w-0">
                              {ci.wins && <p className="text-sm"><span className="font-medium">Wins:</span> {ci.wins}</p>}
                              {ci.challenges && <p className="text-sm text-muted-foreground"><span className="font-medium">Challenges:</span> {ci.challenges}</p>}
                              <p className="text-xs text-muted-foreground mt-1">{new Date(ci.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
