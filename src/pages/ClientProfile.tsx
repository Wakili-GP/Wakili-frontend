import { useState } from "react";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  MapPin,
  Calendar,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  X,
  Edit,
  BadgeCheck,
  ShieldCheck,
  Heart,
  Star,
  Phone,
  Building2,
  Settings,
} from "lucide-react";
import { Card } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
const mockBookings = [
  {
    id: 1,
    lawyer: "د. أحمد سليمان",
    type: "استشارة قانونية",
    date: "2024-10-15",
    time: "10:00 ص",
    status: "مؤكد",
    specialty: "القانون التجاري",
  },
  {
    id: 2,
    lawyer: "أ. سارة محمود",
    type: "استشارة جنائية",
    date: "2024-10-10",
    time: "2:00 م",
    status: "مكتمل",
    specialty: "القانون الجنائي",
  },
  {
    id: 3,
    lawyer: "أ. محمد علي",
    type: "مراجعة عقد",
    date: "2024-10-20",
    time: "11:00 ص",
    status: "قيد الانتظار",
    specialty: "القانون التجاري",
  },
];
interface ClientData {
  name: string;
  location: string;
  bio: string;
  coverImage: string;
  profileImage: string;
  memberSince: string;
}
const ClientProfile = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [clientData, setClientData] = useState<ClientData>({
    name: "محمد أحمد",
    location: "القاهرة، مصر",
    bio: "مهتم بالاستشارات القانونية للشركات الناشئة",
    coverImage:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=300&fit=crop",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    memberSince: "2023",
  });
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "مؤكد":
        return (
          <Badge className="bg-success-light text-success-dark">
            <CheckCircle className="w-3 h-3 ml-1" />
            {status}
          </Badge>
        );
      case "مكتمل":
        return <Badge variant="secondary">{status}</Badge>;
      case "قيد الانتظار":
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 ml-1" />
            {status}
          </Badge>
        );
      case "ملغي":
        return (
          <Badge variant="destructive">
            <X className="w-3 h-3 ml-1" />
            {status}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="relative">
        <div className="h-48 overflow-hidden relative group">
          <img
            src={clientData.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <Button
            className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity"
            variant="secondary"
            size="sm"
            onClick={() => setIsCoverModalOpen(true)}
          >
            <Edit className="w-4 h-4 ml-2" /> تعديل الغلاف
          </Button>
        </div>
        <div className="container mx-auto px-4">
          <div className="relative -mt-16 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative">
                <img
                  src={clientData.profileImage}
                  alt={clientData.name}
                  className="w-36 h-36 rounded-full border-4 border-background shadow-lg object-cover"
                />
              </div>
              <div className="flex-1 bg-card p-6 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="mb-2">
                      <h1 className="text-2xl font-bold">{clientData.name}</h1>
                    </div>
                    <p className="text-muted-foreground mb-2">
                      {clientData.bio}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{clientData.location}</span>
                      </div>
                      <div>عضو منذ {clientData.memberSince}</div>
                    </div>
                  </div>
                  <Button onClick={() => setIsProfileModalOpen(true)}>
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل الملف الشخصي
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="w-full flex-row-reverse justify-start mb-6">
            <TabsTrigger value="bookings" className="cursor-pointer">
              حجوزاتي
            </TabsTrigger>
            <TabsTrigger value="favorites" className="cursor-pointer">
              المفضلة
            </TabsTrigger>
          </TabsList>
          <TabsContent value="bookings">
            <Card dir="rtl" className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                <span>حجوزات الاستشارات</span>
              </h2>
              <div dir="rtl" className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المحامي</TableHead>
                      <TableHead>نوع الاستشارة</TableHead>
                      <TableHead>التخصص</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الوقت</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {booking.lawyer}
                        </TableCell>
                        <TableCell>{booking.type}</TableCell>
                        <TableCell>{booking.specialty}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>{booking.time}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          <Button
                            className="cursor-pointer"
                            variant="outline"
                            size="sm"
                          >
                            التفاصيل
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-6">
                <Button>احجز استشارة جديدة</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};
export default ClientProfile;
