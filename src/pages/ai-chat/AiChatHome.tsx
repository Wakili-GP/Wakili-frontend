import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Scale, Sparkles, ArrowLeft } from "lucide-react";
import { useAuth } from "@/stores/auth.store";
import chatbotService, { type ChatMeta } from "@/services/chatbot-services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
const SUGGESTIONS = [
  { label: "حقوق العمل", q: "ما هي حقوقي إذا تم فصلي تعسفياً؟" },
  { label: "عقود الإيجار", q: "ما الذي يجب مراجعته في عقد الإيجار التجاري؟" },
  { label: "تأسيس شركة", q: "ما إجراءات تأسيس شركة ذات مسؤولية محدودة؟" },
  { label: "النزاعات القانونية", q: "كيف أتعامل مع نزاع تجاري دون محاكم؟" },
];


export default function AiChatHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");

  const startChatMutation = useMutation({
    mutationFn: async ({ initialMessage }: { initialMessage?: string }) => {
      const session_id = await chatbotService.getSessionId();
      return { session_id, initialMessage };
    },
    onSuccess: ({ session_id, initialMessage }) => {
      const newChat: ChatMeta = {
        session_id: session_id,
        title: initialMessage ? initialMessage.slice(0, 45) : "محادثة جديدة",
        updated_at: new Date().toISOString(),
        last_message: "",
      };

      queryClient.setQueryData<ChatMeta[]>(["chatHistory", user?.id], (old = []) => [newChat, ...old]);

      navigate(`/ai-chat/${session_id}`, {
        state: { firstMessage: initialMessage },
      });
    },
    onError: () => toast.error("حدث خطأ أثناء إنشاء المحادثة"),
  });

  const startChat = (initialMessage?: string) => {
    if (startChatMutation.isPending) return;
    startChatMutation.mutate({ initialMessage });
  };

  const handleSubmit = () => {
    const text = input.trim();
    if (!text) return;
    startChat(text);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-xl"
      >
        {/* Icon + heading */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Scale className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1.5">
            مساعدك القانوني الذكي
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            اسأل عن أي موضوع قانوني واحصل على إجابة فورية مدعومة بالمراجع
            والمواد القانونية
          </p>
        </div>

        {/* Input */}
        <div
          className="flex items-end gap-2 rounded-2xl border border-border bg-card focus-within:border-primary/40 transition-colors p-2 shadow-sm mb-6"
          dir="rtl"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالك القانوني هنا..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-right px-3 py-2 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground min-h-10 max-h-40"
            style={{ height: "auto" }}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = Math.min(t.scrollHeight, 160) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || startChatMutation.isPending}
            className="cursor-pointer rounded-xl h-9 w-9 shrink-0 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Suggestion chips */}
        <div className="grid grid-cols-2 gap-2.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => startChat(s.q)}
              disabled={startChatMutation.isPending}
              className="cursor-pointer group text-right p-3.5 rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/30 transition-all duration-200 disabled:opacity-50"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3 h-3 text-primary opacity-70" />
                <span className="text-xs font-semibold text-primary/80">
                  {s.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                {s.q}
              </p>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
