import { FileText, Calendar, ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface RecentContracts {
  title: string;
  date: string;
  type: string;
  status: string;
}

const recentContractsData: RecentContracts[] = [
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

export default function LatestContracts() {
  return (
    <section>
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          آخر العقود المراجعة
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          العقود التي تمت مراجعتها مؤخراً على المنصة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentContractsData.map((contract, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/80 backdrop-blur-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                {/* Top Section */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>

                  <Badge
                    variant="secondary"
                    className="text-xs px-3 py-1 rounded-full bg-secondary text-primary border-0"
                  >
                    {contract.type}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-base md:text-lg leading-snug mb-3 group-hover:text-primary transition-colors">
                  {contract.title}
                </h3>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{contract.date}</span>
                </div>

                {/* Action */}
                <div className="flex items-center justify-end text-sm font-medium text-primary">
                  <span className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    عرض التحليل
                  </span>
                  <ChevronLeft className="w-4 h-4 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
