import {
  Lightbulb,
  FileCheck,
  FileText,
  Building2,
  Users,
  Briefcase,
  Car,
  Home,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const tips = [
  "تأكد من وضوح النص في الملف المرفوع",
  "الصيغ المدعومة: PDF, DOC, DOCX",
  "الحد الأقصى لحجم الملف: 20 ميجابايت",
  "يُفضل رفع العقد الأصلي وليس صورة منه",
];

const contractTypes = [
  { name: "عقود العمل", icon: Users },
  { name: "عقود الإيجار", icon: Home },
  { name: "عقود البيع", icon: Car },
  { name: "عقود الشراكة", icon: Briefcase },
  { name: "عقود المقاولات", icon: Building2 },
  { name: "عقود أخرى", icon: FileText },
];

export default function InfoCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Card className="group rounded-2xl border border-border/60 bg-background/80 backdrop-blur-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-4 text-lg font-semibold">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-400/20 to-amber-500/10 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-amber-500" />
              </div>
              نصائح قبل رفع العقد
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ul className="space-y-4">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center text-xs font-bold text-amber-600 shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contract Types Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <Card className="group rounded-2xl border border-border/60 bg-background/80 backdrop-blur-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-4 text-lg font-semibold">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-primary" />
              </div>
              العقود التي نراجعها
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-3">
              {contractTypes.map((type, i) => (
                <div
                  key={i}
                  className="flex items-center bg-secondary gap-2 px-4 py-2 rounded-full text-sm hover:bg-primary/10 transition-colors duration-200 cursor-default"
                >
                  <type.icon className="w-4 h-4 text-primary" />
                  <span className="font-medium">{type.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
