import { Button } from "@/components/ui/button";
import { FileText, Play, Zap, ShieldCheck, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

// Trust Items for the Hero Section
const trustItems = [
  { icon: Zap, text: "تحليل خلال ثوانٍ" },
  { icon: ShieldCheck, text: "اكتشاف المخاطر القانونية" },
  { icon: Lightbulb, text: "توصيات قانونية ذكية" },
];

// Animated contract demo component
const ContractDemo = () => {
  const clauses = [
    { text: "البند الأول: التزامات البائع", risk: false, delay: 0.5 },
    { text: "البند الثاني: شروط الدفع والسداد", risk: false, delay: 1.0 },
    { text: "البند الثالث: الشرط الجزائي - غرامة 50%", risk: true, delay: 1.5 },
    { text: "البند الرابع: مدة العقد والتجديد", risk: false, delay: 2.0 },
    { text: "البند الخامس: إنهاء العقد دون إشعار", risk: true, delay: 2.5 },
    { text: "البند السادس: الاختصاص القضائي", risk: false, delay: 3.0 },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-3xl opacity-60" />

      <div className="relative bg-background/95 backdrop-blur-sm rounded-2xl border border-border/50 shadow-elegant overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-destructive/60" />
            <span className="w-3 h-3 rounded-full bg-secondary" />
            <span className="w-3 h-3 rounded-full bg-success-green/60" />
          </div>
          <span className="text-xs text-muted-foreground mr-2">
            contract_analysis.pdf
          </span>
        </div>

        {/* Contract lines */}
        <div className="p-4 space-y-2">
          {clauses.map((clause, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: clause.delay, duration: 0.4 }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                clause.risk
                  ? "bg-destructive/10 border border-destructive/20"
                  : "bg-muted/40"
              }`}
            >
              {clause.risk && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: clause.delay + 0.3, type: "spring" }}
                >
                  <ShieldCheck className="w-4 h-4 text-destructive shrink-0" />
                </motion.div>
              )}
              <span
                className={
                  clause.risk
                    ? "text-destructive font-medium"
                    : "text-foreground/70"
                }
              >
                {clause.text}
              </span>
              {clause.risk && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: clause.delay + 0.5 }}
                  className="text-[10px] bg-destructive/20 text-destructive px-2 py-0.5 rounded-full mr-auto whitespace-nowrap"
                >
                  خطر
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom summary bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.5 }}
          className="mx-4 mb-4 p-3 rounded-xl bg-primary/5 border border-primary/20"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-primary font-semibold">
              تم اكتشاف 2 مخاطر قانونية
            </span>
            <span className="text-muted-foreground">6 بنود تم تحليلها</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section
      className="relative overflow-hidden -mx-4 -mt-8"
      style={{
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        width: "100vw",
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-bl from-primary/80 via-primary/90 to-primary" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Right side - Text (RTL) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1"
          >
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-primary-foreground mb-6 leading-[1.2]">
              راجع عقدك بالذكاء الاصطناعي{" "}
              <span className="text-secondary">في ثوانٍ</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/75 mb-8 leading-relaxed max-w-xl">
              ارفع عقدك القانوني واحصل على تحليل شامل للمخاطر والالتزامات
              والبنود — بدقة عالية وسرعة فائقة باستخدام الذكاء الاصطناعي
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Button
                variant="cta"
                size="lg"
                className="shadow-glow text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <FileText className="w-5 h-5 ml-2" />
                ارفع عقدك الآن
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Play className="w-4 h-4 ml-2" />
                شاهد كيف يعمل
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4">
              {trustItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.15 }}
                  className="flex items-center gap-2 text-primary-foreground/60 text-sm"
                >
                  <item.icon className="w-4 h-4 text-secondary" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Left side - Animated Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-2"
          >
            <ContractDemo />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
