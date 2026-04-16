import { CheckCircle, FileText, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockActivity } from "@/data/data";

const ActivityTab = () => {
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">نشاطي الأخير</h2>
      <div className="space-y-6">
        {mockActivity.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 pb-6 border-b border-border last:border-b-0"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                activity.type === "question"
                  ? "bg-primary/10"
                  : activity.type === "article"
                    ? "bg-secondary/10"
                    : "bg-emerald-500/10"
              }`}
            >
              {activity.type === "question" && (
                <MessageSquare className="w-5 h-5 text-primary" />
              )}
              {activity.type === "article" && (
                <FileText className="w-5 h-5 text-secondary" />
              )}
              {activity.type === "chatbot" && (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-secondary font-semibold tracking-wide">
                  {activity.date}
                </p>
                <Badge variant="outline" className="text-xs">
                  {activity.type === "question" && "سؤال"}
                  {activity.type === "article" && "مقال"}
                  {activity.type === "chatbot" && "شات بوت"}
                </Badge>
              </div>
              <h3 className="font-bold text-foreground mb-1">
                {activity.content}
              </h3>
              {activity.type === "question" && activity.responses && (
                <p className="text-sm text-muted-foreground">
                  {activity.responses} رد
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTab;
