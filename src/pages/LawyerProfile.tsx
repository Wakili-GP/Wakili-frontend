import { useState, useEffect } from "react";
import {
  CheckCircle,
  MapPin,
  Calendar,
  Award,
  Users,
  Briefcase,
  GraduationCap,
  Clock,
  Star,
  MessageSquare,
  Heart,
  Settings,
  TrendingUp,
  Trophy,
  Phone,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";
// import { toast } from "sonner";

// Import lawyer-specific components
import LawyerSettingsModal from "@/components/lawyer/LawyerSettingsModal";
import ProfessionalSettingsTab from "@/components/lawyer/ProfessionalSettingsTab";
import VerificationDocumentsTab from "@/components/lawyer/VerificationDocumentsTab";
import AppointmentsTab from "@/components/lawyer/AppointmentsTab";
import ActivityTab from "@/components/lawyer/ActivityTab";

// Mock current user - In real app, this would come from auth context
const currentUser = {
  id: 1, // Change to 2 to see client view
  role: "lawyer" as "client" | "lawyer", // Change to "client" to see client view
};

// Type definitions
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

interface Education {
  id: string;
  degree: string;
  field: string;
  university: string;
  year: string;
  status: "verified" | "pending";
}

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  year: string;
  documentUrl?: string;
  status: "verified" | "pending";
}

interface Experience {
  id: string;
  title: string;
  company: string;
  startYear: string;
  endYear: string;
  description: string;
  status: "verified" | "pending";
}

// Mock data
const lawyerData = {
  id: 1,
  name: "د. أحمد سليمان",
  verified: true,
  specialty: "محامي القانون المدني والتجاري",
  location: "القاهرة، مصر",
  tagline: "محامي متخصص في القضايا التجارية مع خبرة 15 عاماً",
  coverImage:
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=300&fit=crop",
  profileImage:
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&h=200&fit=crop",
  about:
    "محامي متخصص في القانون المدني والتجاري مع خبرة واسعة في التقاضي والاستشارات القانونية. حاصل على دكتوراه في القانون التجاري من جامعة القاهرة.",
  yearsOfExperience: 15,
  sessionPrice: 500,
  sessionTypes: ["phone", "office"],
  contactPreferences: ["whatsapp", "phone", "platform"],
  availability: [
    {
      day: "الأحد",
      slots: ["09:00 - 10:00", "10:00 - 11:00", "14:00 - 15:00"],
    },
    { day: "الاثنين", slots: ["09:00 - 10:00", "11:00 - 12:00"] },
    {
      day: "الأربعاء",
      slots: ["14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00"],
    },
  ],
  education: [
    {
      id: "1",
      degree: "دكتوراه",
      field: "القانون التجاري",
      university: "جامعة القاهرة",
      year: "2015",
      status: "verified",
    },
    {
      id: "2",
      degree: "ماجستير",
      field: "القانون المدني",
      university: "جامعة القاهرة",
      year: "2010",
      status: "verified",
    },
    {
      id: "3",
      degree: "بكالوريوس",
      field: "الحقوق",
      university: "جامعة القاهرة",
      year: "2008",
      status: "verified",
    },
  ] as Education[],
  experience: [
    {
      id: "1",
      title: "شريك مؤسس",
      company: "مكتب المحامي أحمد سليمان",
      startYear: "2015",
      endYear: "حتى الآن",
      description: "إدارة المكتب والإشراف على القضايا الكبرى",
      status: "verified",
    },
    {
      id: "2",
      title: "محامي أول",
      company: "مكتب الشرق للمحاماة",
      startYear: "2010",
      endYear: "2015",
      description: "التقاضي في القضايا التجارية والمدنية",
      status: "verified",
    },
  ] as Experience[],
  certificates: [
    {
      id: "1",
      name: "شهادة التحكيم التجاري الدولي",
      issuer: "مركز القاهرة الإقليمي للتحكيم التجاري الدولي",
      year: "2020",
      status: "verified",
    },
    {
      id: "2",
      name: "شهادة الوساطة القانونية",
      issuer: "نقابة المحامين المصرية",
      year: "2018",
      status: "verified",
    },
  ] as Certificate[],
  documents: [
    {
      id: "1",
      name: "بطاقة الرقم القومي",
      type: "هوية",
      url: "#",
      status: "verified" as const,
      uploadedAt: "2024-01-15",
    },
    {
      id: "2",
      name: "رخصة المحاماة",
      type: "ترخيص",
      url: "#",
      status: "verified" as const,
      uploadedAt: "2024-01-15",
    },
    {
      id: "3",
      name: "شهادة البكالوريوس",
      type: "مؤهل",
      url: "#",
      status: "verified" as const,
      uploadedAt: "2024-01-15",
    },
  ] as {
    id: string;
    name: string;
    type: string;
    url: string;
    status: "verified" | "pending" | "rejected";
    uploadedAt: string;
  }[],
  licenseNumber: "12345/2015",
  issuingAuthority: "نقابة المحامين المصرية",
  issueYear: "2015",
  recentCases: [
    {
      title: "قضية تجارية كبرى",
      court: "المحكمة التجارية",
      status: "تم الفوز",
      date: "2024",
    },
    {
      title: "نزاع عقاري",
      court: "محكمة القاهرة الابتدائية",
      status: "قيد النظر",
      date: "2024",
    },
  ],
  reviews: [
    {
      id: 1,
      clientName: "محمد علي",
      rating: 5,
      comment:
        "محامي ممتاز ومتمكن جداً. ساعدني في حل قضيتي بسرعة واحترافية عالية.",
      date: "2024-11-15",
    },
    {
      id: 2,
      clientName: "سارة أحمد",
      rating: 4,
      comment: "تجربة جيدة جداً، المحامي كان متعاوناً ومتفهماً لظروفي.",
      date: "2024-10-28",
    },
    {
      id: 3,
      clientName: "خالد محمود",
      rating: 5,
      comment: "أنصح به بشدة. خبرة واسعة ومهارة في التفاوض.",
      date: "2024-10-10",
    },
    {
      id: 4,
      clientName: "فاطمة حسن",
      rating: 5,
      comment: "شكراً جزيلاً على المساعدة القانونية الممتازة.",
      date: "2024-09-22",
    },
  ],
  stats: {
    casesWon: "+150",
    yearsExperience: "15+",
    clients: "+200",
    rating: "4.9/5",
  },
  appointments: [
    {
      id: "1",
      clientName: "محمد أحمد",
      date: "2024-12-01",
      time: "10:00",
      type: "phone",
      status: "upcoming",
    },
    {
      id: "2",
      clientName: "سارة محمود",
      date: "2024-12-02",
      time: "14:00",
      type: "office",
      status: "upcoming",
    },
    {
      id: "3",
      clientName: "أحمد خالد",
      date: "2024-11-25",
      time: "11:00",
      type: "video",
      status: "completed",
    },
  ] as Appointment[],
  activities: [
    {
      id: "1",
      type: "review" as const,
      title: "تقييم جديد",
      description: "حصلت على تقييم 5 نجوم من محمد علي",
      date: "منذ يومين",
    },
    {
      id: "2",
      type: "appointment" as const,
      title: "موعد مكتمل",
      description: "اكتملت استشارة مع أحمد خالد",
      date: "منذ 3 أيام",
    },
    {
      id: "3",
      type: "case" as const,
      title: "قضية جديدة",
      description: "تم قبول قضية تجارية جديدة",
      date: "منذ أسبوع",
    },
    {
      id: "4",
      type: "update" as const,
      title: "تحديث الملف",
      description: "تم تحديث معلومات الملف الشخصي",
      date: "منذ أسبوعين",
    },
  ],
};

export default function LawyerProfile() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [lawyer, setLawyer] = useState<typeof lawyerData>(lawyerData);
  const [appointments, setAppointments] = useState<Appointment[]>(
    lawyerData.appointments,
  );

  // Role detection
  const isOwner = currentUser.id === lawyer.id && currentUser.role === "lawyer";

  useEffect(() => {
    const saved = localStorage.getItem("favoriteLawyers");
    const favorites = saved ? JSON.parse(saved) : [];
    setIsFavorite(favorites.includes(lawyer.id));
  }, [lawyer.id]);

  const toggleFavorite = () => {
    const saved = localStorage.getItem("favoriteLawyers");
    const favorites = saved ? JSON.parse(saved) : [];

    let newFavorites;
    if (favorites.includes(lawyer.id)) {
      newFavorites = favorites.filter((id: number) => id !== lawyer.id);
      //   toast.success("تم إزالة المحامي من المفضلة");
    } else {
      newFavorites = [...favorites, lawyer.id];
      //   toast.success("تمت إضافة المحامي إلى المفضلة");
    }

    localStorage.setItem("favoriteLawyers", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleUpdateProfessionalSettings = (data: any) => {
    setLawyer((prev) => ({ ...prev, ...data }));
  };

  const handleAddEducation = (edu: any) => {
    const newEdu = {
      ...edu,
      id: Date.now().toString(),
      status: "pending" as const,
    };
    setLawyer((prev) => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const handleAddCertificate = (cert: any) => {
    const newCert = {
      ...cert,
      id: Date.now().toString(),
      status: "pending" as const,
    };
    setLawyer((prev) => ({
      ...prev,
      certificates: [...prev.certificates, newCert],
    }));
  };

  const handleAddExperience = (exp: any) => {
    const newExp = {
      ...exp,
      id: Date.now().toString(),
      status: "pending" as const,
    };
    setLawyer((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }));
  };

  const handleMarkAppointmentComplete = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "completed" as const } : a,
      ),
    );
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "cancelled" as const } : a,
      ),
    );
  };

  const getSessionTypeLabel = (types: string[]) => {
    const labels: string[] = [];
    if (types.includes("phone")) labels.push("هاتفية");
    if (types.includes("office")) labels.push("مكتبية");
    if (types.includes("video")) labels.push("فيديو");
    return labels.join(" / ");
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header Section */}
      <div className="relative">
        <div className="h-74 overflow-hidden">
          <img
            src={lawyer.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4">
          <div className="relative -mt-20 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative">
                <img
                  src={lawyer.profileImage}
                  alt={lawyer.name}
                  className="w-50 h-50 rounded-full border-4 border-background shadow-lg object-cover"
                />
              </div>
              <div className="flex-1 bg-card p-6 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-3xl font-bold">{lawyer.name}</h1>
                      {lawyer.verified && (
                        <CheckCircle className="w-6 h-6 text-legal-primary fill-legal-primary" />
                      )}
                    </div>
                    <p className="text-lg text-muted-foreground mb-2">
                      {lawyer.specialty}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{lawyer.location}</span>
                    </div>

                    {/* Professional Summary Row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span className="font-medium">
                          {lawyer.yearsOfExperience} سنة خبرة
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="font-medium">
                          {getSessionTypeLabel(lawyer.sessionTypes)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="font-medium">
                          {lawyer.sessionPrice} جنيه / ساعة
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="cursor-pointer">احجز استشارة</Button>
                    <Button className="cursor-pointer" variant="outline">
                      تواصل معي
                    </Button>

                    {/* Client-only: Favorite Button */}
                    {!isOwner && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleFavorite}
                        className={
                          isFavorite
                            ? "cursor-pointer text-red-500 border-red-500 hover:bg-red-50"
                            : "cursor-pointer"
                        }
                      >
                        <Heart
                          className={`w-5 h-5 ${isFavorite ? "fill-red-500" : ""}`}
                        />
                      </Button>
                    )}

                    {/* Lawyer-only: Settings Button */}
                    {isOwner && (
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        size="icon"
                        onClick={() => setShowSettingsModal(true)}
                      >
                        <Settings className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs dir="rtl" defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start mb-6 flex-wrap h-auto gap-1">
                {/* Public Tabs (visible to all) */}
                <TabsTrigger className="cursor-pointer" value="about">
                  نبذة عني
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="experience">
                  الخبرات
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="education">
                  التعليم
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="reviews">
                  التقييمات
                </TabsTrigger>

                {/* Lawyer-only Tabs */}
                {isOwner && (
                  <>
                    <TabsTrigger className="cursor-pointer" value="activity">
                      النشاط
                    </TabsTrigger>
                    <TabsTrigger
                      className="cursor-pointer"
                      value="appointments"
                    >
                      مواعيدي
                    </TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="settings">
                      الإعدادات المهنية
                    </TabsTrigger>
                    <TabsTrigger
                      className="cursor-pointer"
                      value="verification"
                    >
                      التحقق والمستندات
                    </TabsTrigger>
                  </>
                )}
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4">عن المحامي</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {lawyer.about}
                  </p>
                </Card>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Briefcase className="w-6 h-6" />
                    <span>الخبرات العملية</span>
                  </h2>
                  <div className="space-y-6">
                    {lawyer.experience.map((exp) => (
                      <div
                        key={exp.id}
                        className="relative border-r-2 border-legal-primary pr-6"
                      >
                        <div className="absolute -right-2 top-0 w-4 h-4 rounded-full bg-legal-primary border-2 border-background"></div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg">{exp.title}</h3>
                            <p className="text-muted-foreground mb-1">
                              {exp.company}
                            </p>
                            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {exp.startYear} - {exp.endYear}
                            </p>
                            <p className="text-sm">{exp.description}</p>
                          </div>
                          {isOwner && exp.status === "pending" && (
                            <Badge
                              variant="secondary"
                              className="bg-amber-100 text-amber-800"
                            >
                              <Clock className="w-3 h-3 ml-1" />
                              قيد المراجعة
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6" />
                    <span>المؤهلات العلمية</span>
                  </h2>
                  <div className="space-y-6">
                    {lawyer.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="relative border-r-2 border-legal-primary pr-6"
                      >
                        <div className="absolute -right-2 top-0 w-4 h-4 rounded-full bg-legal-primary border-2 border-background"></div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg">
                              {edu.degree} في {edu.field}
                            </h3>
                            <p className="text-muted-foreground mb-1">
                              {edu.university}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {edu.year}
                            </p>
                          </div>
                          {isOwner && edu.status === "pending" && (
                            <Badge
                              variant="secondary"
                              className="bg-amber-100 text-amber-800"
                            >
                              <Clock className="w-3 h-3 ml-1" />
                              قيد المراجعة
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      <span>الشهادات المهنية</span>
                    </h3>
                    <div className="space-y-4">
                      {lawyer.certificates.map((cert) => (
                        <div key={cert.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold">{cert.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {cert.issuer}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {cert.year}
                              </p>
                            </div>
                            {isOwner && cert.status === "pending" && (
                              <Badge
                                variant="secondary"
                                className="bg-amber-100 text-amber-800"
                              >
                                <Clock className="w-3 h-3 ml-1" />
                                قيد المراجعة
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6" />
                    <span>تقييمات العملاء</span>
                  </h2>
                  <div className="space-y-4">
                    {lawyer.reviews.map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-bold">
                                {review.clientName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold">
                                {review.clientName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {review.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Lawyer-only: Activity Tab */}
              {isOwner && (
                <TabsContent value="activity">
                  <ActivityTab
                    activities={lawyer.activities}
                    recentCases={lawyer.recentCases}
                  />
                </TabsContent>
              )}

              {/* Lawyer-only: Appointments Tab */}
              {isOwner && (
                <TabsContent value="appointments">
                  <AppointmentsTab
                    appointments={appointments}
                    onMarkComplete={handleMarkAppointmentComplete}
                    onCancel={handleCancelAppointment}
                  />
                </TabsContent>
              )}

              {/* Lawyer-only: Professional Settings Tab */}
              {isOwner && (
                <TabsContent value="settings">
                  <ProfessionalSettingsTab
                    lawyerData={{
                      bio: lawyer.about,
                      sessionPrice: lawyer.sessionPrice,
                      sessionTypes: lawyer.sessionTypes,
                      contactPreferences: lawyer.contactPreferences,
                      availability: lawyer.availability,
                      profileImage: lawyer.profileImage,
                    }}
                    onUpdate={handleUpdateProfessionalSettings}
                  />
                </TabsContent>
              )}

              {/* Lawyer-only: Verification Documents Tab */}
              {isOwner && (
                <TabsContent value="verification">
                  <VerificationDocumentsTab
                    documents={lawyer.documents}
                    education={lawyer.education}
                    certificates={lawyer.certificates}
                    experience={lawyer.experience}
                    licenseNumber={lawyer.licenseNumber}
                    issuingAuthority={lawyer.issuingAuthority}
                    issueYear={lawyer.issueYear}
                    onAddEducation={handleAddEducation}
                    onAddCertificate={handleAddCertificate}
                    onAddExperience={handleAddExperience}
                  />
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="p-5 bg-linear-to-br from-card to-muted/30">
              <h3 className="font-bold mb-5 text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                الإحصائيات
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Cases Won */}
                <div className="bg-linear-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl p-4 border border-emerald-500/20 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3">
                    <Trophy className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                    {lawyer.stats.casesWon}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    قضية تم الفوز بها
                  </div>
                </div>

                {/* Years Experience */}
                <div className="bg-linear-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-4 border border-blue-500/20 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                    {lawyer.stats.yearsExperience}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    سنة خبرة
                  </div>
                </div>

                {/* Clients */}
                <div className="bg-linear-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-4 border border-purple-500/20 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                    {lawyer.stats.clients}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    عميل راضٍ
                  </div>
                </div>

                {/* Rating */}
                <div className="bg-linear-to-br from-amber-500/10 to-amber-600/5 rounded-xl p-4 border border-amber-500/20 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mb-3">
                    <Star className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                    {lawyer.stats.rating}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    التقييم
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Info */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">معلومات الاتصال</h3>
              <Button className="w-full mb-2">احجز استشارة</Button>
              <Button variant="outline" className="w-full">
                أرسل رسالة
              </Button>
            </Card>
          </div>
        </div>
      </div>
      <Footer />

      {/* Lawyer Settings Modal */}
      <LawyerSettingsModal
        open={showSettingsModal}
        onOpenChange={setShowSettingsModal}
      />
    </div>
  );
}
