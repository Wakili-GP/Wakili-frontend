import { useState } from "react";
import Footer from "../components/Footer";
import AccountSettingsModals from "@/components/AccountSettingsModal";
import ProfileEditModal from "@/components/ProfileEditModal";
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
interface Lawyer {
  id: number;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  sessionTypes: string[];
  image: string;
}
const mockFavoriteLawyers: Lawyer[] = [
  {
    id: 1,
    name: "د. أحمد سليمان",
    specialty: "قانون تجاري",
    location: "القاهرة",
    rating: 4.9,
    reviewCount: 127,
    price: 500,
    sessionTypes: ["مكتب", "هاتف"],
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "أ. سارة محمود",
    specialty: "قانون الأسرة",
    location: "الإسكندرية",
    rating: 4.8,
    reviewCount: 89,
    price: 350,
    sessionTypes: ["مكتب", "هاتف"],
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    name: "د. فاطمة حسن",
    specialty: "قانون العمل",
    location: "القاهرة",
    rating: 4.9,
    reviewCount: 203,
    price: 450,
    sessionTypes: ["هاتف"],
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
  },
];
interface ClientData {
  name: string;
  location: string;
  bio: string;
  coverImage: string;
  profileImage: string;
  memberSince: string;
  email: string;
}
const ClientProfile = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [clientData, setClientData] = useState<ClientData>({
    name: "محمد أحمد",
    location: "القاهرة، مصر",
    bio: "مهتم بالاستشارات القانونية للشركات الناشئة",
    coverImage:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=300&fit=crop",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    memberSince: "2023",
    email: "mohamed@example.com",
  });
  const handleProfileSave = (data: {
    name: string;
    location: string;
    bio: string;
    profileImage: string;
  }) => {
    setClientData((prev) => ({ ...prev, ...data }));
  };
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
        <div className="h-64 overflow-hidden relative group">
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsSettingsModalOpen(true)}
                      className="cursor-pointer h-10 w-10"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      className="cursor-pointer"
                      onClick={() => setIsProfileModalOpen(true)}
                    >
                      <Edit className="w-4 h-4 ml-2" />
                      تعديل الملف الشخصي
                    </Button>
                  </div>
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
                <Button className="cursor-pointer">احجز استشارة جديدة</Button>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="favorites">
            <Card dir="rtl" className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                <span>المحامون المفضلون</span>
              </h2>
              {mockFavoriteLawyers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {mockFavoriteLawyers.map((fav) => (
                    <FavLawyer fav={fav} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    لا يوجد محامون في المفضلة
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    ابحث عن محامين وأضفهم إلى قائمة المفضلة للوصول إليهم بسهولة
                  </p>
                  <Button className="cursor-pointer">ابحث عن محامي</Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
        <AccountSettingsModals
          open={isSettingsModalOpen}
          onOpenChange={setIsSettingsModalOpen}
          currentEmail={clientData.email}
        />
        <ProfileEditModal
          open={isProfileModalOpen}
          onOpenChange={setIsProfileModalOpen}
          currentData={clientData}
          onSave={handleProfileSave}
        />
      </div>
      <Footer />
    </div>
  );
};
const FavLawyer = ({ fav }: Lawyer) => {
  return (
    <Card
      key={fav.id}
      className="overflow-hidden border hover:shadow-lg transition-shadow"
    >
      <div className="flex">
        <div className="relative w-48 h-full shrink-0">
          <img
            src={fav.image}
            alt={fav.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold">{fav.name}</h3>
              <Badge variant="secondary" className="text-xs mt-1">
                {fav.specialty}
              </Badge>
            </div>
            <button className="cursor-pointer p-1 rounded-full hover:bg-muted transition-colors">
              <Heart className="w-7 h-7 text-red-500 fill-red-500" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {fav.location}
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-2" />
            {fav.rating}
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {fav.sessionTypes.map((type: string) => (
              <Badge key={type} variant="outline" className="text-xs">
                {type === "مكتب" ? (
                  <Building2 className="w-3 h-3 ml-1" />
                ) : (
                  <Phone className="w-3 h-3 ml-1" />
                )}
                {type}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-primary font-bold">{fav.price} ج.م/جلسة</span>
            <Button className="cursor-pointer" size="sm">
              عرض الملف
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default ClientProfile;
