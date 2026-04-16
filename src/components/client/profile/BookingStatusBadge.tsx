import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, X } from "lucide-react";

interface BookingStatusBadgeProps {
  status: string;
}

const BookingStatusBadge = ({ status }: BookingStatusBadgeProps) => {
  switch (status) {
    case "مؤكد":
      return (
        <Badge className="bg-success-green/15 text-success-green border-success-green/30 text-xs font-medium">
          <CheckCircle className="w-3 h-3 ml-1" />
          {status}
        </Badge>
      );
    case "مكتمل":
      return (
        <Badge className="bg-primary/15 text-primary border-primary/30 text-xs font-medium">
          {status}
        </Badge>
      );
    case "قيد الانتظار":
      return (
        <Badge className="bg-warning-amber/15 text-warning-amber border-warning-amber/30 text-xs font-medium">
          <Clock className="w-3 h-3 ml-1" />
          {status}
        </Badge>
      );
    case "ملغي":
      return (
        <Badge className="bg-destructive/15 text-destructive border-destructive/30 text-xs font-medium">
          <X className="w-3 h-3 ml-1" />
          {status}
        </Badge>
      );
    default:
      return <Badge className="text-xs font-medium">{status}</Badge>;
  }
};

export default BookingStatusBadge;
