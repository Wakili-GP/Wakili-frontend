import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Star, Clock, TrendingUp } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "case" | "review" | "appointment" | "update";
  title: string;
  description: string;
  date: string;
  status?: string;
}

interface ActivityTabProps {
  activities: ActivityItem[];
  recentCases: {
    title: string;
    court: string;
    status: string;
    date: string;
  }[];
}

const ActivityTab: React.FC<ActivityTabProps> = ({
  activities,
  recentCases,
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "case":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "review":
        return <Star className="w-5 h-5 text-amber-500" />;
      case "appointment":
        return <Calendar className="w-5 h-5 text-green-600" />;
      case "update":
        return <TrendingUp className="w-5 h-5 text-purple-600" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6" />
        <span>النشاط</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Cases */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            آخر القضايا
          </h3>
          <div className="space-y-4">
            {recentCases.map((case_, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold">{case_.title}</h4>
                  <Badge
                    variant={
                      case_.status === "تم الفوز" ? "default" : "secondary"
                    }
                  >
                    {case_.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {case_.court}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {case_.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            سجل النشاط
          </h3>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4 p-4 border rounded-lg"
              >
                <div className="shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {activity.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivityTab;
