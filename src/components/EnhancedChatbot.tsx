import { useState, useEffect, useRef } from "react";
import {
  Send,
  User,
  Bot,
  Sparkles,
  Loader2,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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

const ReferenceBadge = ({ reference }: { reference: LegalReference }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className={`group relative text-right rounded-xl border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs transition-all duration-200 hover:bg-primary/10 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 ${expanded ? "bg-primary/10 border-primary/30" : ""}`}
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

const EnhancedChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Check for pending question from home page
  useEffect(() => {
    const pendingQuestion = localStorage.getItem("pendingQuestion");
    if (pendingQuestion) {
      setInputMessage(pendingQuestion);
      localStorage.removeItem("pendingQuestion");
      // Auto-send the question
      setTimeout(() => {
        handleSendMessage(pendingQuestion);
      }, 500);
    } else {
      // Welcome message
      setMessages([
        {
          id: "1",
          content:
            "مرحباً! أنا مساعد وكيلك القانوني الذكي. يمكنني مساعدتك في الأسئلة القانونية المختلفة. كيف يمكنني مساعدتك اليوم؟",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputMessage.trim();
    if (!content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(
      () => {
        const response = generateResponse(content);
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: response.text,
          sender: "bot",
          timestamp: new Date(),
          references: response.references,
        };

        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      },
      1500 + Math.random() * 1000,
    );
  };

  const generateResponse = (
    question: string,
  ): { text: string; references?: LegalReference[] } => {
    const lowerQuestion = question.toLowerCase();

    if (
      lowerQuestion.includes("عمل") ||
      lowerQuestion.includes("فصل") ||
      lowerQuestion.includes("وظيف")
    ) {
      return {
        text: "بناءً على نظام العمل السعودي، لديك حقوق محددة في حالة الفصل التعسفي:\n\n• حق الحصول على تعويض عن الفصل التعسفي\n• حق الحصول على مكافأة نهاية الخدمة\n• حق الطعن في قرار الفصل أمام مكتب العمل\n• حق الحصول على شهادة خبرة\n\nأنصحك بالتواصل مع أحد محامينا المتخصصين في قانون العمل للحصول على استشارة مفصلة حول حالتك.",
        references: [
          {
            article: "المادة 77",
            law: "نظام العمل المصري",
            description: "تعويض العامل عن الفصل غير المشروع",
          },
          {
            article: "المادة 80",
            law: "نظام العمل المصري",
            description: "حالات فسخ العقد دون مكافأة",
          },
          {
            article: "المادة 84",
            law: "نظام العمل المصري",
            description: "مكافأة نهاية الخدمة",
          },
        ],
      };
    }

    if (
      lowerQuestion.includes("إيجار") ||
      lowerQuestion.includes("عقار") ||
      lowerQuestion.includes("سكن")
    ) {
      return {
        text: "حقوقك في عقد الإيجار محمية بنظام الإيجار المصري:\n\n• حق السكن الآمن والمريح\n• حق عدم زيادة الإيجار إلا وفقاً للشروط المحددة\n• حق استرداد التأمين عند انتهاء العقد\n• حق الإشعار المسبق قبل الإخلاء\n\nيمكنك رفع شكوى لدى وزارة الإسكان في حالة مخالفة المالك لهذه الحقوق.",
        references: [
          {
            article: "المادة 4",
            law: "نظام الإيجار المصري",
            description: "التزامات المؤجر تجاه المستأجر",
          },
          {
            article: "المادة 12",
            law: "نظام الإيجار المصري",
            description: "شروط إنهاء عقد الإيجار",
          },
        ],
      };
    }

    if (
      lowerQuestion.includes("شركة") ||
      lowerQuestion.includes("تأسيس") ||
      lowerQuestion.includes("تجاري")
    ) {
      return {
        text: "إجراءات تأسيس الشركة في المصرية:\n\n1. حجز الاسم التجاري عبر منصة قطاع الأعمال\n2. إعداد عقد التأسيس ونظام الشركة الأساسي\n3. فتح حساب بنكي برأس المال\n4. الحصول على السجل التجاري\n5. التسجيل في الزكاة والضريبة والجمارك\n6. الحصول على التراخيص المطلوبة\n\nننصحك بالاستعانة بمحامٍ متخصص في الشركات لضمان سير الإجراءات بسلاسة.",
        references: [
          {
            article: "المادة 2",
            law: "نظام الشركات المصري",
            description: "تعريف الشركة وأنواعها",
          },
          {
            article: "المادة 22",
            law: "نظام الشركات",
            description: "إجراءات التأسيس والتسجيل",
          },
          {
            article: "المادة 56",
            law: "نظام الشركات",
            description: "الشركة ذات المسؤولية المحدودة",
          },
        ],
      };
    }

    if (
      lowerQuestion.includes("نزاع") ||
      lowerQuestion.includes("خلاف") ||
      lowerQuestion.includes("مشكلة")
    ) {
      return {
        text: "للتعامل مع النزاعات القانونية:\n\n• ابدأ بالتفاوض المباشر مع الطرف الآخر\n• احتفظ بجميع المستندات والأدلة\n• فكر في الوساطة كحل بديل\n• استشر محامٍ متخصص لتقييم قوة موقفك القانوني\n• اعرف حقوقك والمهل الزمنية للمطالبة\n\nيمكننا مساعدتك في العثور على محامٍ متخصص في نوع النزاع الذي تواجهه.",
        references: [
          {
            article: "المادة 1",
            law: "نظام المرافعات الشرعية",
            description: "اختصاص المحاكم في النزاعات",
          },
          {
            article: "المادة 36",
            law: "نظام التحكيم",
            description: "التحكيم كوسيلة بديلة لحل النزاعات",
          },
        ],
      };
    }

    // Default response - no references
    return {
      text: "شكراً لك على سؤالك. هذا سؤال مهم يتطلب دراسة تفصيلية لحالتك الخاصة.\n\nأنصحك بـ:\n• التواصل مع أحد محامينا المتخصصين\n• جمع جميع المستندات ذات العلاقة\n• كتابة تفاصيل أكثر عن الموضوع\n\nهل تريد أن أساعدك في العثور على محامٍ متخصص في مجال سؤالك؟",
    };
  };

  const quickQuestions = [
    "ما هي حقوقي في العمل؟",
    "كيف أحمي حقوقي في الإيجار؟",
    "إجراءات تأسيس شركة",
    "كيف أتعامل مع نزاع قانوني؟",
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chat Header */}
      <Card className="mb-4 bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg">مساعد وكيلك القانوني</h3>
                <p className="text-sm text-muted-foreground">
                  متخصص في القانون المصري والحقوق العامة والخاصة
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1"></div>
              متاح الآن
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="mb-4 h-96 bg-linear-to-b from-background to-background/95">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                dir="rtl"
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === "user"
                      ? "flex-row-reverse space-x-reverse space-x-2"
                      : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted border border-border"
                      }`}
                    >
                      <div className="whitespace-pre-line text-right text-sm leading-relaxed">
                        {message.content}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          message.sender === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString("ar-SA", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    {/* Legal References */}
                    {message.sender === "bot" &&
                      message.references &&
                      message.references.length > 0 && (
                        <div className="mr-0 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span className="font-medium">
                              المراجع القانونية
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {message.references.map((ref, idx) => (
                              <ReferenceBadge key={idx} reference={ref} />
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-reverse space-x-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-muted border border-border rounded-2xl px-4 py-2">
                    <div className="flex items-center space-x-1">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">
                        جاري الكتابة...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="text-center mb-3">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="w-4 h-4 text-primary ml-2" />
                <span className="text-sm font-medium">أسئلة سريعة</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-right h-auto p-3 justify-end hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                  onClick={() => handleSendMessage(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-reverse space-x-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="اكتب سؤالك القانوني هنا..."
              className="flex-1 resize-none border-0 bg-transparent text-right px-3 py-2 focus:outline-none placeholder:text-muted-foreground"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isTyping}
              size="sm"
              className="rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedChatbot;
