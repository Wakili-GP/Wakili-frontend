import { ShieldAlert, FileText, Lightbulb, Check } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: ShieldAlert, text: "اكتشاف البنود الخطرة تلقائياً" },
  { icon: FileText, text: "تلخيص العقد في فقرة واحدة" },
  { icon: Lightbulb, text: "توصيات قانونية ذكية وعملية" },
];

function DemoUI() {
  const lines = [
    { text: "يلتزم الطرف الأول بتسليم المبيع خلال 30 يوماً", type: "normal" },
    { text: "يحق للبائع إلغاء العقد دون إبداء أسباب", type: "risk" },
    { text: "يتحمل المشتري جميع الرسوم والمصاريف", type: "warning" },
    { text: "مدة العقد سنة واحدة قابلة للتجديد", type: "normal" },
  ];

  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-primary/5 rounded-3xl blur-2xl" />
      <div className="relative rounded-2xl border border-border/50 bg-background overflow-hidden shadow-card">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-secondary/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-success-green/50" />
            </div>
            <span className="text-[11px] text-muted-foreground">
              تحليل العقد
            </span>
          </div>
          <span className="text-[10px] text-secondary font-semibold">
            AI مُفعّل
          </span>
        </div>

        <div className="grid grid-cols-5">
          {/* Contract text */}
          <div className="col-span-3 p-4 space-y-2 border-l border-border/50">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.2 }}
                className={`text-xs rounded-md px-3 py-2 ${
                  line.type === "risk"
                    ? "bg-destructive/10 border border-destructive/20 text-destructive"
                    : line.type === "warning"
                      ? "bg-warning-amber/10 border border-warning-amber/20 text-warning-amber"
                      : "text-foreground/60"
                }`}
              >
                {line.text}
              </motion.div>
            ))}
          </div>

          {/* AI Panel */}
          <div className="col-span-2 p-3 bg-muted/20 space-y-3">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
              className="text-[10px] font-semibold text-primary mb-2"
            >
              ملخص التحليل
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4 }}
              className="p-2 rounded-lg bg-destructive/10 border border-destructive/15"
            >
              <p className="text-[10px] text-destructive font-medium">
                ⚠ مخاطر عالية: 1
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.6 }}
              className="p-2 rounded-lg bg-warning-amber/10 border border-warning-amber/15"
            >
              <p className="text-[10px] text-warning-amber font-medium">
                ⚡ تحذيرات: 1
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.8 }}
              className="p-2 rounded-lg bg-success-green/10 border border-success-green/15"
            >
              <p className="text-[10px] text-success-green font-medium">
                ✓ بنود آمنة: 2
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDemo() {
  return (
    <section className="py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
        {/* Demo UI - Right in RTL */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <DemoUI />
        </motion.div>

        {/* Text - Left in RTL */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-sm font-semibold text-secondary tracking-wide mb-3 block">
            المنتج
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            افهم عقدك خلال <span className="text-primary">ثوانٍ</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            يقوم الذكاء الاصطناعي بقراءة كل بند في عقدك وتحديد المخاطر القانونية
            وتقديم توصيات عملية لحمايتك
          </p>

          <ul className="space-y-4">
            {features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-secondary" />
                </div>
                <span className="text-foreground font-medium">
                  {feature.text}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
