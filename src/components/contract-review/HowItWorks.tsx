import { Upload, Brain, FileSearch, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Upload,
    title: "ارفع عقدك",
    description: "قم برفع ملف العقد بصيغة PDF أو Word بسهولة",
    step: "١",
  },
  {
    icon: Brain,
    title: "التحليل بالذكاء الاصطناعي",
    description: "يقوم الذكاء الاصطناعي بتحليل العقد بدقة عالية",
    step: "٢",
  },
  {
    icon: FileSearch,
    title: "احصل على تقرير مفصل",
    description: "تقرير شامل بالمخاطر والالتزامات والتوصيات",
    step: "٣",
  },
  {
    icon: MessageCircle,
    title: "اسأل أسئلة متابعة",
    description: "تواصل مع الذكاء الاصطناعي لأي استفسارات إضافية",
    step: "٤",
  },
];

export default function HowItWorks() {
  return (
    <section>
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          كيف يعمل؟
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          أربع خطوات بسيطة للحصول على تحليل قانوني شامل لعقدك
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="relative group h-full rounded-2xl border border-border/60 bg-background/80 backdrop-blur-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              {/* Step Number */}
              <div className="absolute -top-4 right-6 w-10 h-10 rounded-full bg-linear-to-br from-primary to-primary/70 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                {step.step}
              </div>

              <CardContent className="pt-12 pb-8 px-6 text-center flex flex-col items-center">
                {/* Icon */}
                <div className="w-16 h-16 mb-5 rounded-2xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
