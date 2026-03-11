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
import { Badge } from "@/components/ui/badge";

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
      <Card className="border-2 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-amber-500" />
            </div>
            نصائح قبل رفع العقد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-xs font-bold text-amber-600 shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Contract Types Card */}
      <Card className="border-2 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-primary" />
            </div>
            العقود التي نراجعها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {contractTypes.map((type, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="px-4 py-2 text-sm flex items-center gap-2 hover:bg-primary/10 transition-colors cursor-default"
              >
                <type.icon className="w-4 h-4" />
                {type.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
