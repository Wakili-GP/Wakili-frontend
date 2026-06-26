import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import {
  analyzeContractService,
  type HistoryEntry,
} from "@/services/ai-review-service";
import { useAuth } from "@/stores/auth.store";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
}
interface FollowUpChatProps {
  analysisId: string;
}

export default function FollowUpChat({ analysisId }: FollowUpChatProps) {
  const { mutate: chat, isPending } = useMutation({
    mutationFn: analyzeContractService.chatWithContract,
  });

  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "ai",
      content:
        "مرحباً! يمكنك طرح أي سؤال حول العقد الذي تم تحليله وسأقوم بالإجابة عليه.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const query = input;
    const userMsg = {
      id: messages.length,
      role: "user" as const,
      content: query,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const history: HistoryEntry[] = messages.map((m) => [
      m.role === "user" ? "human" : "ai",
      m.content,
    ]);
    chat(
      { analysis_id: analysisId, query, history },
      {
        onSuccess: (data) => {
          setMessages((prev) => [
            ...prev,
            { id: prev.length, role: "ai", content: data.answer },
          ]);
        },
      },
    );
  };

  return (
    <section>
      <div className="text-center my-8">
        <div className="inline-flex items-center rounded-full border border-amber-800/25 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 mb-3">
          متابعة قانونية دقيقة
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
          أسئلة متابعة
        </h2>
        <p className="text-lg text-slate-600">
          اسأل أي سؤال حول العقد الذي تم تحليله
        </p>
      </div>

      <Card
        className="max-w-3xl mx-auto border-border bg-card shadow-lg overflow-hidden"
        dir="rtl"
      >
        <CardHeader className="border-b border-border bg-background backdrop-blur-sm">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            محادثة حول العقد
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-background pt-4">
          {/* Messages */}
          <div className="space-y-5 max-h-96 overflow-y-auto mb-4 p-2 rounded-2xl border border-transparent">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "ai" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 overflow-hidden ${
                    msg.role === "ai"
                      ? "bg-card border border-border text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <Bot className="w-3.5 h-3.5" />
                  ) : user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                </div>
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 border text-xs md:text-sm leading-relaxed ${
                    msg.role === "ai"
                      ? "bg-card border-border rounded-tl-sm text-foreground shadow-sm"
                      : "bg-primary text-primary-foreground border-primary rounded-tr-sm shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line text-right">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            {isPending && (
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-card border border-border flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-card border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border">
                  <div className="flex gap-1 items-center h-full">
                    <span
                      className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="relative">
            <div className="flex items-end gap-2 rounded-2xl border border-border bg-card focus-within:border-primary/40 transition-colors p-2 shadow-sm">
              <Textarea
                ref={(t) => {
                  if (t) {
                    t.style.height = "auto";
                    t.style.height = Math.min(t.scrollHeight, 160) + "px";
                  }
                }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 resize-none bg-transparent text-right px-3 py-2 text-xs md:text-sm text-foreground focus:outline-none placeholder:text-muted-foreground min-h-10 max-h-40 border-0 shadow-none focus-visible:ring-0"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isPending}
                className="rounded-xl h-9 w-9 shrink-0 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
