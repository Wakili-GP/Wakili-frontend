import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Video,
  Building,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Appointment {
  id: string;
  clientName: string;
  clientImage?: string;
  date: string;
  time: string;
  type: "phone" | "office" | "video";
  status: "upcoming" | "completed" | "cancelled";
  notes?: string;
}

interface AppointmentsTabProps {
  appointments: Appointment[];
  onMarkComplete: (id: string) => void;
  onCancel: (id: string) => void;
}

const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
  appointments,
  onMarkComplete,
  onCancel,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "phone":
        return <Phone className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "office":
        return <Building className="w-4 h-4" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "phone":
        return "استشارة هاتفية";
      case "video":
        return "استشارة فيديو";
      case "office":
        return "استشارة مكتبية";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            قادم
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            مكتمل
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">ملغي</Badge>;
      default:
        return null;
    }
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "upcoming",
  );
  const pastAppointments = appointments.filter((a) => a.status !== "upcoming");

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6" />
        <span>مواعيدي</span>
      </h2>

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">المواعيد القادمة</h3>
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border rounded-lg">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد مواعيد قادمة</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {appointment.clientImage ? (
                      <img
                        src={appointment.clientImage}
                        alt={appointment.clientName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold">{appointment.clientName}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {appointment.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {appointment.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="flex items-center gap-1 text-sm">
                        {getTypeIcon(appointment.type)}
                        {getTypeLabel(appointment.type)}
                      </span>
                      {getStatusBadge(appointment.status)}
                    </div>
                    {appointment.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {appointment.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => {
                      onMarkComplete(appointment.id);
                      toast.success("تم تحديد الموعد كمكتمل");
                    }}
                  >
                    <CheckCircle className="w-4 h-4 ml-1" />
                    مكتمل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => {
                      onCancel(appointment.id);
                      toast.success("تم إلغاء الموعد");
                    }}
                  >
                    <XCircle className="w-4 h-4 ml-1" />
                    إلغاء
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      <div>
        <h3 className="text-lg font-semibold mb-4">المواعيد السابقة</h3>
        {pastAppointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border rounded-lg">
            <p>لا توجد مواعيد سابقة</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pastAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg opacity-75"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    {appointment.clientImage ? (
                      <img
                        src={appointment.clientImage}
                        alt={appointment.clientName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold">{appointment.clientName}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {appointment.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {appointment.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="flex items-center gap-1 text-sm">
                        {getTypeIcon(appointment.type)}
                        {getTypeLabel(appointment.type)}
                      </span>
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default AppointmentsTab;
