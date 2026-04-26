import { FileCheck, ThumbsUp, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: FileCheck, value: "+١٬٢٠٠", label: "عقد تم تحليله" },
  { icon: ThumbsUp, value: "٩٤٪", label: "نسبة رضا المستخدمين" },
  { icon: Clock, value: "٣ دقائق", label: "متوسط وقت التحليل" },
  { icon: Users, value: "+٨٠٠", label: "مستخدم نشط" },
];

export default function PlatformStats() {
  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl bg-primary px-6 py-10 md:py-14"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-6 h-6 text-secondary mx-auto mb-3" />
              <p className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-primary-foreground/60">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
