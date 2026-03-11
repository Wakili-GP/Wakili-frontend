import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import {
  analyzeContractService,
  type HistoryEntry,
} from "@/services/ai-review.service/ai-review.service";

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

      <Card className="max-w-3xl mx-auto border-amber-900/20 bg-linear-to-br from-stone-100 via-stone-50 to-amber-50/70 shadow-lg overflow-hidden">
        <CardHeader className="border-b border-amber-900/15 bg-white/65 backdrop-blur-sm">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-800/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-amber-700" />
            </div>
            محادثة حول العقد
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Messages */}
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4 p-2 rounded-2xl border border-amber-900/15 bg-white/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "ai"
                      ? "bg-white border border-stone-300 text-slate-700"
                      : "bg-slate-900 text-slate-100"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <Bot className="w-4 h-4 text-amber-700" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "ai"
                      ? "bg-white border border-stone-300/80 text-slate-800 rounded-tr-sm shadow-sm"
                      : "bg-slate-900 text-slate-100 rounded-tl-sm shadow-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isPending && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-stone-300 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-amber-700" />
                </div>
                <div className="bg-white border border-stone-300/80 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-amber-700/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-amber-700/50 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-amber-700/50 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="relative">
            <div className="rounded-[30px] border border-amber-900/20 bg-white/90 p-2 shadow-sm transition focus-within:border-amber-700/40 focus-within:ring-2 focus-within:ring-amber-700/20">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب سؤالك هنا..."
                className="min-h-12 max-h-24 resize-none border-0 bg-transparent pr-3 pl-14 text-slate-800 placeholder:text-slate-400 shadow-none focus-visible:ring-0"
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
                className="absolute left-3 bottom-3 h-9 w-9 rounded-full bg-amber-700 text-white hover:bg-amber-800"
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
