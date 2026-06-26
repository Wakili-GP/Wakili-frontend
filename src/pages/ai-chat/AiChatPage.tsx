import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Loader2,
  BookOpen,
  ExternalLink,
  Info,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import chatbotService, {
  mapSourceToReference,
  type LegalReference,
  type ChatMeta,
} from "@/services/chatbot-services";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/stores/auth.store";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  references?: LegalReference[];
}

// Reference

const ReferenceBadge = ({ reference }: { reference: LegalReference }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className={cn(
        "group relative text-right rounded-xl border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs transition-all duration-200 hover:bg-primary/10 hover:border-primary/40 hover:shadow-sm hover:-translate-y-0.5",
        expanded && "bg-primary/10 border-primary/30",
      )}
    >
      <div className="flex items-center gap-1.5">
        <BookOpen className="w-3 h-3 text-primary shrink-0" />
        <span className="font-semibold text-primary">{reference.article}</span>
        <span className="text-muted-foreground">- {reference.law}</span>
        <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      {expanded && reference.description && (
        <div className="mt-1.5 pt-1.5 border-t border-primary/10 text-muted-foreground leading-relaxed">
          {reference.description}
        </div>
      )}
    </button>
  );
};

// Main

export default function AiChatPage() {
  const { id: session_id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [inputMessage, setInputMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const firstMessageSent = useRef(false);

  const { data: messages = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ["chatMessages", session_id],
    queryFn: async () => {
      const hist = await chatbotService.getChatHistory(session_id as string);
      return hist.map(
        (h, i) =>
          ({
            id: `hist-${i}`,
            content: h.content,
            sender: h.role === "user" ? "user" : "bot",
            timestamp: new Date(),
            references: h.sources
              ? h.sources.map(mapSourceToReference)
              : undefined,
          }) as Message,
      );
    },
    enabled: !!session_id,
    retry: false,
  });

  // Ask Mutation
  const askMutation = useMutation({
    mutationFn: (text: string) =>
      chatbotService.ask({
        query: text,
        session_id: session_id as string,
        user_id: user?.id as string,
      }),
    onMutate: async (text) => {
      await queryClient.cancelQueries({
        queryKey: ["chatMessages", session_id],
      });
      const previousMessages = queryClient.getQueryData<Message[]>([
        "chatMessages",
        session_id,
      ]);

      const userMsg: Message = {
        id: Date.now().toString(),
        content: text,
        sender: "user",
        timestamp: new Date(),
      };

      queryClient.setQueryData<Message[]>(
        ["chatMessages", session_id],
        (old = []) => [...old, userMsg],
      );

      queryClient.setQueryData<ChatMeta[]>(
        ["chatHistory", user?.id],
        (old = []) => {
          return old.map((c) =>
            c.session_id === session_id
              ? {
                  ...c,
                  last_message: text.slice(0, 60),
                  updated_at: new Date().toISOString(),
                  title:
                    c.title === "محادثة جديدة" ? text.slice(0, 45) : c.title,
                }
              : c,
          );
        },
      );

      return { previousMessages };
    },
    onSuccess: (res) => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: res.answer,
        sender: "bot",
        timestamp: new Date(),
        references: res.sources?.map(mapSourceToReference),
      };

      queryClient.setQueryData<Message[]>(
        ["chatMessages", session_id],
        (old = []) => [...old, botMsg],
      );

      queryClient.setQueryData<ChatMeta[]>(
        ["chatHistory", user?.id],
        (old = []) => {
          return old.map((c) =>
            c.session_id === session_id
              ? {
                  ...c,
                  last_message: res.answer.slice(0, 60),
                  updated_at: new Date().toISOString(),
                }
              : c,
          );
        },
      );
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(
        ["chatMessages", session_id],
        context?.previousMessages,
      );
      toast.error("عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.");
    },
  });

  // ── If navigated with a first message (from AiChatHome) send it ─────────
  useEffect(() => {
    const firstMsg: string | undefined = location.state?.firstMessage;
    if (!firstMsg || firstMessageSent.current || isLoadingHistory) return;
    firstMessageSent.current = true;
    askMutation.mutate(firstMsg);
    window.history.replaceState({}, "");
  }, [isLoadingHistory]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, askMutation.isPending]);

  // ── Auto-resize textarea ─────────────────────────────────────────────────
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [inputMessage]);

  // ── Send message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    const text = inputMessage.trim();
    if (!text || !session_id || askMutation.isPending) return;
    setInputMessage("");
    askMutation.mutate(text);
  }, [session_id, inputMessage, askMutation]);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-background" dir="rtl">
      {/* Top bar */}
      <div className="h-14 border-b border-border flex items-center px-5 gap-3 bg-background/95 backdrop-blur-sm shrink-0">
        <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
          <Scale className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="text-sm font-semibold text-foreground">
          المساعد القانوني
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-3">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              ابدأ بكتابة سؤالك القانوني
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "flex gap-3",
                    msg.sender === "user" ? "flex-row" : "flex-row-reverse",
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground",
                    )}
                  >
                    {msg.sender === "user" ? (
                      user?.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt=""
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User className="w-3.5 h-3.5" />
                      )
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Bubble + references */}
                  <div className="space-y-2 max-w-[78%] min-w-0">
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 border text-sm leading-relaxed",
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground border-primary rounded-tr-sm shadow-sm"
                          : "bg-card border-border rounded-tl-sm text-foreground shadow-sm",
                      )}
                    >
                      <div className="whitespace-pre-line text-right">
                        {msg.content}
                      </div>
                      <div
                        className={cn(
                          "text-[10px] mt-1.5",
                          msg.sender === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground",
                        )}
                      >
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>

                    {/* Legal references */}
                    {msg.sender === "bot" &&
                      msg.references &&
                      msg.references.length > 0 && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <BookOpen className="w-3 h-3" />
                            <span className="font-medium">
                              المراجع القانونية
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.references.map((ref, idx) => (
                              <ReferenceBadge key={idx} reference={ref} />
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {askMutation.isPending && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 flex-row-reverse"
              >
                <div className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">
                      جاري التفكير...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="px-4 py-3 bg-background border-t border-border shrink-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2 rounded-2xl border border-border bg-card focus-within:border-primary/40 transition-colors p-2 shadow-sm">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="اكتب سؤالك القانوني هنا..."
              className="flex-1 resize-none bg-transparent text-right px-3 py-2 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground min-h-10 max-h-40"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!inputMessage.trim() || askMutation.isPending}
              className="rounded-xl h-9 w-9 shrink-0 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 flex items-start gap-1.5 text-[11px] text-muted-foreground px-1">
            <Info className="w-3 h-3 mt-0.5 shrink-0 text-primary/60" />
            <p className="text-right leading-relaxed">
              هذا المساعد يقدم إرشاداً عاماً ولا يغني عن الاستشارة القانونية
              المتخصصة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
