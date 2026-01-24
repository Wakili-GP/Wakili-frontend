import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Rocket, Sparkles, Bell, FileSearch, Shield } from "lucide-react";

type ComingSoonProps = {
  title: string;
  description: string;
  featureTitle: string;
  featureDescription: string;
  badgeText: string;
  progress?: number;
};

export default function ComingSoon({
  title,
  description,
  featureTitle,
  featureDescription,
  badgeText,
  progress = 60,
}: ComingSoonProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl" />

      <Card className="relative border-2 border-dashed border-primary/30 bg-linear-to-br from-background via-background to-primary/5 overflow-hidden">
        <CardContent className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Rocket className="w-5 h-5 text-primary animate-bounce" />
              <span className="text-primary font-semibold">قادم قريباً</span>
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </motion.div>

          {/* Feature */}
          <Card className="relative overflow-hidden border border-border/50">
            <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
              <motion.div
                className="h-full bg-linear-to-r from-primary to-accent"
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              />
            </div>

            <CardContent className="p-5 pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <FileSearch className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-semibold">{featureTitle}</h4>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-700 "
                    >
                      {badgeText}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {featureDescription}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-linear-to-r from-primary/60 to-primary"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {progress}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20">
              <Bell className="w-5 h-5 text-primary" />
              <span className="font-medium">
                ترقبوا المزيد من الميزات المبتكرة!
              </span>
              <Shield className="w-5 h-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
