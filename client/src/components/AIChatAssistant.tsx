import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm the Gods of Insurance AI Assistant. I can help you with:\n\n• **SR-22 & FR-44** filings\n• **Burial & Final Expense** insurance\n• **Tiny Home & Mobile Home** coverage\n• **Pet Insurance** (including exotic & therapy animals)\n• **Gig Economy** coverage for rideshare & delivery drivers\n• **State compliance** requirements\n• **Quote comparisons** across carriers\n\nWhat can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.ai.chat.useMutation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await chatMutation.mutateAsync({
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        userMessage: input,
      });

      const assistantMessage: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: response.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat bubble button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
        style={{ background: "linear-gradient(135deg, #0a1628, #1a2d4a)", border: "2px solid rgba(184,134,11,0.40)" }}
        aria-label="Open AI Chat Assistant"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <Card className="fixed bottom-24 right-6 z-40 w-96 max-h-[600px] shadow-2xl flex flex-col fade-in" style={{ border: "1px solid rgba(184,134,11,0.25)" }}>
          {/* Header */}
          <div className="p-4 rounded-t-lg" style={{ background: "linear-gradient(135deg, #0a1628, #1a2d4a)" }}>
            <h3 className="font-semibold flex items-center gap-2 text-white" style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.05em", fontSize: "0.9rem" }}>
              <span style={{ background: "linear-gradient(135deg, #f0c040, #b8860b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>&#9889;</span> Divine Insurance Agent
            </h3>
            <p className="text-xs mt-1" style={{ color: "rgba(240,192,64,0.7)" }}>Powered by AI • Available 24/7</p>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2.5 ${
                    msg.role === "user"
                      ? "text-white rounded-br-none"
                      : "rounded-bl-none"
                  }`}
                  style={msg.role === "user" ? { background: "linear-gradient(135deg, #0a1628, #1a2d4a)" } : { background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.15)" }}
                >
                  {msg.role === "assistant" ? (
                    <Streamdown>{msg.content}</Streamdown>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-lg rounded-bl-none px-4 py-2.5 flex items-center gap-2" style={{ background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.15)" }}>
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-3 bg-white rounded-b-lg" style={{ borderColor: "rgba(184,134,11,0.15)" }}>
            <div className="flex gap-2">
              <Input
                placeholder="Ask about coverage..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={loading}
                className="text-sm focus-visible:ring-amber-400"
                style={{ borderColor: "rgba(184,134,11,0.25)" }}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by free & open-source AI
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
