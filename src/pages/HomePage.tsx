import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Zap, Shield, Globe } from "lucide-react";
import legalHeroImage from "@/assets/ai-law.webp";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-20">
      <HeroSection />
      <InteractiveChatbotSection navigate={navigate} />
    </div>
  );
};
const HeroSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        width: "100vw",
      }}
    >
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: `url(${legalHeroImage})` }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6"
          >
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-primary-foreground/90 text-sm font-medium">
              مرحباً بعودتك
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-5 leading-tight">
            مرحبا بك في <span className="text-secondary">وكيلك</span>
          </h1>
          <p className="text-xl text-primary-foreground/85 max-w-3xl mx-auto leading-relaxed mb-8">
            منصتك القانونية الشاملة — استشارات فورية، محامون موثوقون، وعقود
            محمية
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const InteractiveChatbotSection = ({
  navigate,
}: {
  navigate: (path: string) => void;
}) => {
  return (
    <div className="relative">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          لديك سؤال قانوني؟
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          اسأل الذكاء الاصطناعي المتخصص في القانون واحصل على إجابات فورية ودقيقة
        </p>
      </div>

      <Card className="relative overflow-hidden bg-linear-to-br from-primary/5 via-primary/8 to-primary/12 border-primary/30 hover:border-primary/50 transition-all duration-500 shadow-2xl max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

        <CardContent className="p-8 relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                <MessageCircle className="w-8 h-8 text-primary relative z-10" />
              </div>
              <h3 className="text-xl font-bold ml-2">مساعد وكيلك القانوني</h3>
              <div className="flex items-center text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1" />
                <span>متاح الآن</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              "ما هي حقوقي في حالة فصل تعسفي من العمل؟",
              "كيف أحمي حقوقي في عقد الإيجار؟",
              "ما هي إجراءات تأسيس شركة جديدة؟",
              "كيف أتعامل مع نزاع تجاري؟",
            ].map((question, index) => (
              <Card
                key={index}
                className="group cursor-pointer bg-linear-to-r from-background/80 to-background/60 hover:from-primary/10 hover:to-primary/5 border-muted hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                onClick={() => {
                  const input = document.getElementById(
                    "question-input",
                  ) as HTMLInputElement;
                  if (input) {
                    input.value = question;
                    input.focus();
                  }
                }}
              >
                <CardContent className="p-3">
                  <p className="text-sm text-right group-hover:text-primary transition-colors duration-300">
                    {question}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="relative">
            <div className="flex items-center space-x-reverse space-x-2 bg-background/80 backdrop-blur-sm rounded-2xl border border-primary/20 focus-within:border-primary/50 transition-all duration-300 p-2 shadow-inner">
              <input
                id="question-input"
                type="text"
                placeholder="اكتب سؤالك القانوني هنا..."
                className="flex-1 bg-transparent text-right px-4 py-3 text-lg focus:outline-none placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    localStorage.setItem(
                      "pendingQuestion",
                      e.currentTarget.value,
                    );
                    navigate("/ai-chat");
                  }
                }}
              />
              <Button
                size="lg"
                className="rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  const input = document.getElementById(
                    "question-input",
                  ) as HTMLInputElement;
                  if (input && input.value.trim()) {
                    localStorage.setItem("pendingQuestion", input.value);
                    navigate("/ai-chat");
                  }
                }}
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                اسأل الآن
              </Button>
            </div>
          </div>

          <div className="flex justify-center items-center space-x-8 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Zap className="w-4 h-4 text-primary ml-1" />
              <span>إجابات فورية</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-primary ml-1" />
              <span>معلومات موثوقة</span>
            </div>
            <div className="flex items-center">
              <Globe className="w-4 h-4 text-primary ml-1" />
              <span>متاح 24/7</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
