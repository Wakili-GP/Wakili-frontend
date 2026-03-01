import { Button } from "@/components/ui/button";
import { FileText, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/ai-contract-review.webp";

interface HeroSectionProps {
  onStartNow: () => void;
}

export default function HeroSection({ onStartNow }: HeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden -mx-4 -mt-8"
      style={{
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        width: "100vw",
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="مراجعة العقود القانونية"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-l from-primary/90 via-primary/80 to-primary/70" />
      </div>

      {/* Subtle Glow Effect */}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 blur-3xl rounded-full" />

      <div className="relative container z-10 px-8 md:px-28 py-16 md:py-20 text-right">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            راجع عقدك باحترافية خلال دقائق
          </h1>

          {/* Description */}
          <p className="text-lg md:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl">
            ارفع عقدك القانوني واحصل على تحليل شامل للمخاطر والالتزامات
            والتوصيات باستخدام الذكاء الاصطناعي المتخصص
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-5 items-center">
            {/* Primary CTA */}
            <Button
              size="lg"
              onClick={onStartNow}
              className="cursor-pointer group bg-white text-primary hover:bg-white/90 text-lg px-10 py-6 shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <FileText className="w-5 h-5 ml-2 group-hover:rotate-6 transition-transform" />
              ابدأ الآن
            </Button>

            {/* Secondary CTA */}
            <Button
              variant="cta"
              onClick={onStartNow}
              size="lg"
              className="shadow-glow cursor-pointer text-primary"
            >
              <ArrowDown className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
              رفع عقد
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
