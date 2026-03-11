import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Plus,
  Bot,
  User,
  Loader2,
  BookOpen,
  ExternalLink,
  MessageSquare,
  Clock,
  Trash2,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────
interface LegalReference {
  article: string;
  law: string;
  description?: string;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  references?: LegalReference[];
}

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

// ── Sub-components ─────────────────────────────────────
const ReferenceBadge = ({ reference }: { reference: LegalReference }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className={cn(
        "group relative text-right rounded-xl border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs transition-all duration-200 hover:bg-primary/10 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5",
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

// ── Response generator (mock) ──────────────────────────
const generateResponse = (
  question: string,
): { text: string; references?: LegalReference[] } => {
  const q = question.toLowerCase();

  if (q.includes("عمل") || q.includes("فصل") || q.includes("وظيف")) {
    return {
      text: "بناءً على نظام العمل السعودي، لديك حقوق محددة في حالة الفصل التعسفي:\n\n• حق الحصول على تعويض عن الفصل التعسفي\n• حق الحصول على مكافأة نهاية الخدمة\n• حق الطعن في قرار الفصل أمام مكتب العمل\n• حق الحصول على شهادة خبرة\n\nأنصحك بالتواصل مع أحد محامينا المتخصصين في قانون العمل للحصول على استشارة مفصلة حول حالتك.",
      references: [
        {
          article: "المادة 77",
          law: "نظام العمل السعودي",
          description: "تعويض العامل عن الفصل غير المشروع",
        },
        {
          article: "المادة 80",
          law: "نظام العمل السعودي",
          description: "حالات فسخ العقد دون مكافأة",
        },
        {
          article: "المادة 84",
          law: "نظام العمل السعودي",
          description: "مكافأة نهاية الخدمة",
        },
      ],
    };
  }

  if (q.includes("إيجار") || q.includes("عقار") || q.includes("سكن")) {
    return {
      text: "حقوقك في عقد الإيجار محمية بنظام الإيجار السعودي:\n\n• حق السكن الآمن والمريح\n• حق عدم زيادة الإيجار إلا وفقاً للشروط المحددة\n• حق استرداد التأمين عند انتهاء العقد\n• حق الإشعار المسبق قبل الإخلاء",
      references: [
        {
          article: "المادة 4",
          law: "نظام الإيجار",
          description: "التزامات المؤجر تجاه المستأجر",
        },
        {
          article: "المادة 12",
          law: "نظام الإيجار",
          description: "شروط إنهاء عقد الإيجار",
        },
      ],
    };
  }

  if (q.includes("شركة") || q.includes("تأسيس") || q.includes("تجاري")) {
    return {
      text: "إجراءات تأسيس الشركة في السعودية:\n\n1. حجز الاسم التجاري عبر منصة قطاع الأعمال\n2. إعداد عقد التأسيس ونظام الشركة الأساسي\n3. فتح حساب بنكي برأس المال\n4. الحصول على السجل التجاري\n5. التسجيل في الزكاة والضريبة والجمارك",
      references: [
        {
          article: "المادة 2",
          law: "نظام الشركات",
          description: "تعريف الشركة وأنواعها",
        },
        {
          article: "المادة 22",
          law: "نظام الشركات",
          description: "إجراءات التأسيس والتسجيل",
        },
      ],
    };
  }

  return {
    text: "شكراً لك على سؤالك. هذا سؤال مهم يتطلب دراسة تفصيلية لحالتك الخاصة.\n\nأنصحك بـ:\n• التواصل مع أحد محامينا المتخصصين\n• جمع جميع المستندات ذات العلاقة\n• كتابة تفاصيل أكثر عن الموضوع\n\nهل تريد أن أساعدك في العثور على محامٍ متخصص في مجال سؤالك؟",
  };
};

// ── Main Component ─────────────────────────────────────
const ChatPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [inputMessage]);

  const deleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  const sendMessage = useCallback(
    (content?: string, chatId?: string) => {
      const text = content || inputMessage.trim();
      const targetId = chatId || activeChatId;
      if (!text || !targetId) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        content: text,
        sender: "user",
        timestamp: new Date(),
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === targetId
            ? {
                ...c,
                messages: [...c.messages, userMsg],
                lastMessage: text.slice(0, 50),
                timestamp: new Date(),
                title:
                  c.messages.length === 0
                    ? text.slice(0, 40) + (text.length > 40 ? "..." : "")
                    : c.title,
              }
            : c,
        ),
      );
      setInputMessage("");
      setIsTyping(true);

      setTimeout(
        () => {
          const response = generateResponse(text);
          const botMsg: Message = {
            id: (Date.now() + 1).toString(),
            content: response.text,
            sender: "bot",
            timestamp: new Date(),
            references: response.references,
          };
          setChats((prev) =>
            prev.map((c) =>
              c.id === targetId
                ? {
                    ...c,
                    messages: [...c.messages, botMsg],
                    lastMessage: response.text.slice(0, 50),
                  }
                : c,
            ),
          );
          setIsTyping(false);
        },
        1200 + Math.random() * 800,
      );
    },
    [activeChatId, inputMessage],
  );

  const createNewChat = useCallback(
    (initialMessage?: string) => {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: initialMessage
          ? initialMessage.slice(0, 40) +
            (initialMessage.length > 40 ? "..." : "")
          : "محادثة جديدة",
        lastMessage: "",
        timestamp: new Date(),
        messages: [],
      };
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);

      if (initialMessage) {
        setTimeout(() => sendMessage(initialMessage, newChat.id), 300);
      }
    },
    [sendMessage],
  );

  // Pending question from home page
  useEffect(() => {
    const pending = localStorage.getItem("pendingQuestion");
    if (pending) {
      localStorage.removeItem("pendingQuestion");
      createNewChat(pending);
    }
  }, [createNewChat]);

  const handleSend = () => {
    if (!activeChatId) {
      createNewChat(inputMessage.trim());
    } else {
      sendMessage();
    }
  };

  const quickQuestions = [
    "ما هي حقوقي في العمل؟",
    "كيف أحمي حقوقي في الإيجار؟",
    "إجراءات تأسيس شركة",
    "كيف أتعامل مع نزاع قانوني؟",
  ];

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });

  const formatDate = (d: Date) => {
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "الآن";
    if (diff < 3600000) return `منذ ${Math.floor(diff / 60000)} دقيقة`;
    if (diff < 86400000) return `منذ ${Math.floor(diff / 3600000)} ساعة`;
    return d.toLocaleDateString("ar-SA");
  };

  return (
    <div className="relative flex h-[calc(100vh-4rem)] overflow-hidden rounded-xl border border-amber-900/20 bg-linear-to-br from-stone-100 via-stone-50 to-amber-50/70 shadow-sm">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(146,64,14,0.14),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(30,41,59,0.12),transparent_40%)]" />
      {/* ── Center: Chat Area ────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-14 border-b border-amber-900/15 flex items-center justify-between px-4 bg-white/65 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-stone-200/70"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRightOpen className="w-4 h-4" />
              )}
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center border border-amber-800/20">
                <Bot className="w-4 h-4 text-amber-700" />
              </div>
              <span className="font-semibold text-sm text-slate-900">
                مساعد وكيلك القانوني
              </span>
              <div className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs border-amber-800/25 bg-white/70 hover:bg-amber-50 text-slate-800"
            onClick={() => createNewChat()}
          >
            <Plus className="w-3.5 h-3.5" />
            محادثة جديدة
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {!activeChat || activeChat.messages.length === 0 ? (
            /* Empty state */
            <div className="h-full flex flex-col items-center justify-center px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center max-w-lg rounded-3xl border border-amber-900/20 bg-white/75 px-8 py-10 shadow-sm backdrop-blur-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-amber-700 to-amber-900 flex items-center justify-center mx-auto mb-6 shadow-md">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-900">
                  مرحباً بك في المساعد القانوني
                </h2>
                <p className="text-slate-600 mb-8">
                  اسأل أي سؤال قانوني واحصل على إجابة فورية مدعومة بالمراجع
                  القانونية
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (!activeChatId) createNewChat(q);
                        else sendMessage(q);
                      }}
                      className="text-right p-3.5 rounded-xl border border-amber-900/20 bg-white/80 hover:bg-amber-50 hover:border-amber-700/30 transition-all duration-200 text-sm group"
                    >
                      <span className="text-slate-600 group-hover:text-slate-900 transition-colors">
                        {q}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            /* Messages list */
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              <AnimatePresence initial={false}>
                {activeChat.messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex gap-3",
                      msg.sender === "user" ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                        msg.sender === "user"
                          ? "bg-slate-900 text-slate-100"
                          : "bg-white border border-stone-300 text-slate-700",
                      )}
                    >
                      {msg.sender === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-2 max-w-[80%] min-w-0">
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 border",
                          msg.sender === "user"
                            ? "bg-slate-900 text-slate-100 border-slate-900 rounded-tr-sm shadow-md"
                            : "bg-white/90 border-stone-300/80 rounded-tl-sm text-slate-800 shadow-sm",
                        )}
                      >
                        <div className="whitespace-pre-line text-right text-sm leading-relaxed">
                          {msg.content}
                        </div>
                        <div
                          className={cn(
                            "text-[10px] mt-1.5",
                            msg.sender === "user"
                              ? "text-slate-300"
                              : "text-slate-500",
                          )}
                        >
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>

                      {/* References */}
                      {msg.sender === "bot" &&
                        msg.references &&
                        msg.references.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <BookOpen className="w-3 h-3" />
                              <span className="font-medium text-slate-500">
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
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-stone-300 flex items-center justify-center text-slate-700">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white/90 border border-stone-300/80 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
                      <span className="text-sm text-slate-600">
                        جاري الكتابة...
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
        <div className="border-t border-amber-900/15 p-4 bg-white/65 backdrop-blur-sm shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 rounded-2xl border border-amber-900/20 bg-white/90 focus-within:border-amber-700/40 transition-colors p-2 shadow-card">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="اكتب سؤالك القانوني هنا..."
                className="flex-1 resize-none bg-transparent text-right px-3 py-2 text-sm text-slate-800 focus:outline-none placeholder:text-slate-400 min-h-10 max-h-40"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                onClick={handleSend}
                disabled={!inputMessage.trim() || isTyping}
                size="icon"
                className="rounded-xl h-9 w-9 shrink-0 bg-amber-700 text-white hover:bg-amber-800"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              المساعد القانوني يقدم معلومات عامة ولا يغني عن الاستشارة القانونية
              المتخصصة
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Sidebar: Chat History ────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="relative z-10 border-r border-slate-700/70 bg-linear-to-b from-slate-950 to-slate-900 text-slate-100 flex flex-col shrink-0 overflow-hidden"
          >
            {/* Sidebar header */}
            <div className="h-14 border-b border-slate-700/70 flex items-center justify-between px-4 shrink-0">
              <span className="font-semibold text-sm text-slate-200">
                المحادثات
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-800"
                onClick={() => createNewChat()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Chat list */}
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {chats.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>لا توجد محادثات بعد</p>
                  </div>
                ) : (
                  chats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className={cn(
                        "group flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all duration-200 text-right",
                        activeChatId === chat.id
                          ? "bg-slate-800 border border-slate-600"
                          : "hover:bg-slate-800/70 border border-transparent",
                      )}
                    >
                      <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-slate-100">
                          {chat.title}
                        </p>
                        {chat.lastMessage && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {chat.lastMessage}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(chat.timestamp)}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-slate-400 hover:bg-rose-500/10 hover:text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPage;
