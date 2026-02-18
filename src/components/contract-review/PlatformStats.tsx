import { FileCheck, ThumbsUp, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const stats = [
  {
    icon: FileCheck,
    value: "١٬٢٤٥+",
    label: "عقد تم تحليله",
    gradient: "from-primary to-primary/70",
  },
  {
    icon: ThumbsUp,
    value: "٩٤٪",
    label: "نسبة الرضا",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    icon: Clock,
    value: "< ٣ دقائق",
    label: "متوسط وقت التحليل",
    gradient: "from-amber-500 to-orange-400",
  },
  {
    icon: Users,
    value: "٨٥٠+",
    label: "مستخدم نشط",
    gradient: "from-indigo-500 to-violet-500",
  },
];

export default function PlatformStats() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-background to-muted/40 py-16 px-6 md:px-12">
      {/* Background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-400/20 blur-3xl rounded-full" />

      <div className="relative text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          إحصائيات المنصة
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          أرقام تعكس ثقة مستخدمينا وتجربتهم مع خدمة مراجعة العقود
        </p>
      </div>

      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="group relative border border-border/50 bg-background/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
              <CardContent className="py-8 flex flex-col items-center text-center">
                {/* Icon with gradient background */}
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-xl bg-linear-to-br ${stat.gradient} text-white mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-7 h-7" />
                </div>

                <p className="text-xl md:text-2xl font-extrabold tracking-tight mb-2">
                  {stat.value}
                </p>

                <p className="text-sm md:text-base text-muted-foreground">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
