import { FileText, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const recentContracts = [
  {
    title: "عقد بيع سيارة",
    date: "15 فبراير 2026",
    type: "بيع",
    status: "تم التحليل",
  },
  {
    title: "عقد إيجار شقة سكنية",
    date: "12 فبراير 2026",
    type: "إيجار",
    status: "تم التحليل",
  },
  {
    title: "عقد عمل موظف",
    date: "10 فبراير 2026",
    type: "عمل",
    status: "تم التحليل",
  },
  {
    title: "عقد شراكة تجارية",
    date: "8 فبراير 2026",
    type: "شراكة",
    status: "تم التحليل",
  },
];

export default function RecentContracts() {
  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <span className="text-sm font-semibold text-secondary tracking-wide mb-3 block">
          النشاط
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          آخر العقود المراجعة
        </h2>
      </motion.div>

      <div className="max-w-4xl mx-auto rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-muted/40 text-xs font-semibold text-muted-foreground border-b border-border">
          <span className="col-span-5">العقد</span>
          <span className="col-span-2 text-center">النوع</span>
          <span className="col-span-3 text-center">التاريخ</span>
          <span className="col-span-2 text-center">الحالة</span>
        </div>

        {recentContracts.map((contract, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-12 gap-4 px-5 py-4 items-center border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer group"
          >
            <div className="col-span-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-sm group-hover:text-primary transition-colors">
                {contract.title}
              </span>
            </div>
            <div className="col-span-2 text-center">
              <Badge variant="secondary" className="text-xs font-normal">
                {contract.type}
              </Badge>
            </div>
            <div className="col-span-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {contract.date}
            </div>
            <div className="col-span-2 text-center">
              <span className="text-xs text-success-green font-medium">
                ✓ {contract.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
