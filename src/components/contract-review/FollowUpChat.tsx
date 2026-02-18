import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
}

const mockResponses = [
  "بناءً على تحليل العقد، يمكنني توضيح أن هذا البند يحمي حقوق البائع بشكل أساسي. ننصح بإضافة شرط جزائي واضح لحماية المشتري أيضاً.",
  "نعم، هذا البند قانوني ولكنه يميل لصالح أحد الأطراف. يُفضل التفاوض على تعديله ليكون أكثر توازناً.",
  "وفقاً للأنظمة المعمول بها، يحق لك الاعتراض على هذا البند خلال 30 يوماً من توقيع العقد. ننصح باستشارة محامٍ متخصص للمتابعة.",
];

export default function FollowUpChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "ai",
      content:
        "مرحباً! يمكنك طرح أي سؤال حول العقد الذي تم تحليله وسأقوم بالإجابة عليه.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: messages.length,
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1500));

    const aiMsg: Message = {
      id: messages.length + 1,
      role: "ai",
      content: mockResponses[messages.length % mockResponses.length],
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">أسئلة متابعة</h2>
        <p className="text-lg text-muted-foreground">
          اسأل أي سؤال حول العقد الذي تم تحليله
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            محادثة حول العقد
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Messages */}
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4 p-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "ai" ? "bg-primary/10" : "bg-muted"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <Bot className="w-4 h-4 text-primary" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "ai"
                      ? "bg-muted/50 rounded-tr-sm"
                      : "bg-primary text-primary-foreground rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted/50 rounded-2xl rounded-tr-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك هنا..."
              className="min-h-10 max-h-24 resize-none"
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
              disabled={!input.trim() || isTyping}
              className="shrink-0 h-10 w-10 cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
