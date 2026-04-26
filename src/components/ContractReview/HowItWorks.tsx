import { Upload, Brain, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const steps = [
  {
    icon: Upload,
    title: "ارفع العقد",
    description: "اسحب ملف PDF أو Word إلى منطقة الرفع",
    detail: "ندعم جميع صيغ العقود الشائعة بحجم حتى 20 ميجابايت",
    step: 1,
  },
  {
    icon: Brain,
    title: "الذكاء الاصطناعي يحلل",
    description: "يقوم النظام بتحليل كل بند وتحديد المخاطر",
    detail: "تحليل دقيق للبنود القانونية والالتزامات لكل طرف",
    step: 2,
  },
  {
    icon: CheckCircle,
    title: "احصل على النتائج",
    description: "تقرير شامل بالمخاطر والتوصيات القانونية",
    detail: "ملخص تنفيذي + تفاصيل المخاطر + توصيات عملية",
    step: 3,
  },
];

export default function HowItWorks() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-semibold text-secondary tracking-wide mb-3 block">
          كيف يعمل
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          ثلاث خطوات بسيطة
        </h2>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          من رفع العقد إلى الحصول على تحليل قانوني شامل
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
        {/* Connector line */}
        <div className="hidden md:block absolute top-16 right-[16.67%] left-[16.67%] h-px bg-border" />

        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            onMouseEnter={() => setHoveredStep(index)}
            onMouseLeave={() => setHoveredStep(null)}
            className="relative text-center group"
          >
            {/* Step number circle */}
            <div className="relative z-10 mx-auto mb-6">
              <motion.div
                animate={hoveredStep === index ? { scale: 1.1 } : { scale: 1 }}
                className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-primary group-hover:shadow-glow"
              >
                <step.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </motion.div>
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                {step.step}
              </span>
            </div>

            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-muted-foreground mb-3">{step.description}</p>

            {/* Expanded detail on hover */}
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={
                hoveredStep === index
                  ? { opacity: 1, height: "auto" }
                  : { opacity: 0, height: 0 }
              }
              className="text-sm text-primary/70 overflow-hidden"
            >
              {step.detail}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
