import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import lawyerProfileServices from "@/services/lawyerProfile-services";
import { Award, CheckCircle, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MainNavbar from "@/components/MainNavbar";
import BlueFooter from "@/components/BlueFooter";
import ReviewsTab from "@/components/LawyerDashboard/ReviewsTab";
import PaymentCalendar from "@/components/PaymentCalendar";
import { getAvatarColor, getInitials } from "@/lib/avatarHelpers";

const LawyerProfile = () => {
  // Fetching the ID from the URL to fetch the profile
  const { id } = useParams<{ id: string }>();

  // Local state for the active tab
  const [activeTab, setActiveTab] = useState("summary");

  // Fetching Profile Data
  const {
    data: lawyerProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lawyerProfile", id],
    queryFn: () => lawyerProfileServices.getLawyerProfile(id as string),
    enabled: !!id,
  });
  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center gap-4">
        <p className="text-destructive font-bold">
          فشل في تحميل بيانات المحامي
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: "summary", label: "السيرة والخبرات" },
    { id: "education", label: "التعليم" },
    { id: "reviews", label: "التقييمات" },
  ];

  // To make sure that the lawyerProfile inside the JSX below is not undefined
  if (!lawyerProfile) return null;

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      <MainNavbar fixed />

      {/* Hero */}
      <section className="bg-primary pt-36 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative shrink-0">
              {lawyerProfile.profile.profileImage ? (
                <img
                  src={lawyerProfile.profile.profileImage}
                  alt={
                    lawyerProfile.profile.firstName +
                    " " +
                    lawyerProfile.profile.lastName
                  }
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-secondary/40 object-cover shadow-lg"
                />
              ) : (
                <div
                  className={`w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-secondary/40 shadow-lg flex items-center justify-center text-xl md:text-2xl font-bold ${getAvatarColor(
                    `${lawyerProfile.profile.firstName} ${lawyerProfile.profile.lastName}`,
                  )}`}
                  aria-label={`${lawyerProfile.profile.firstName} ${lawyerProfile.profile.lastName}`}
                >
                  {getInitials(
                    lawyerProfile.profile.firstName,
                    lawyerProfile.profile.lastName,
                  )}
                </div>
              )}
              <div className="absolute bottom-1 right-1 w-7 h-7 bg-secondary rounded-full flex items-center justify-center border-2 border-primary">
                <CheckCircle className="w-4 h-4 text-secondary-foreground" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {lawyerProfile.profile.practiceAreas.map((s, i) => (
                  <Badge
                    key={i}
                    className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                {lawyerProfile.profile.firstName}{" "}
                {lawyerProfile.profile.lastName}
              </h1>
              <p className="text-primary-foreground/80 text-base md:text-lg max-w-xl">
                {lawyerProfile.profile.bio}
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-6 bg-primary-foreground/10 backdrop-blur-sm rounded-xl px-6 py-4">
                {[
                  {
                    value:
                      lawyerProfile.profile.stats.numOfAppointmentsCompleted,
                    label: "جلسة مكتملة",
                  },
                  {
                    value: lawyerProfile.profile.stats.yearsOfExperience,
                    label: "سنة خبرة",
                  },
                  {
                    value: lawyerProfile.profile.stats.articlesPublishedCount,
                    label: "مقال منشور",
                  },
                  {
                    value: `${lawyerProfile.profile.stats.clientRatingAverage} ★`,
                    label: "تقييم العملاء",
                  },
                ].map((stat, i) => (
                  <div key={i} className="text-center md:text-right">
                    <div className="text-xl md:text-2xl font-bold text-secondary">
                      {stat.value}
                    </div>
                    <div className="text-xs text-primary-foreground/70 tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="border-b border-border mb-8">
              <div className="flex gap-6 flex-wrap">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 text-sm font-medium transition-all relative cursor-pointer ${activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-secondary rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Summary */}
              {activeTab === "summary" && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      الملخص المهني
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-[15px]">
                      {lawyerProfile.profile.summary}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      الخبرات العملية
                    </h2>
                    <div className="relative">
                      <div className="absolute right-[7px] top-2 bottom-2 w-0.5 bg-border" />
                      <div className="space-y-8">
                        {lawyerProfile.workHistory.map((work, i) => (
                          <div key={i} className="relative pr-8">
                            <div className="absolute right-0 top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background z-10" />
                            <div className="text-xs text-secondary font-semibold mb-1">
                              {work.startYear} -{" "}
                              {work.isCurrentJob ? "الحالي" : work.endYear}
                            </div>
                            <h3 className="font-bold text-foreground">
                              {work.jobTitle}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-1">
                              {work.organizationName}
                            </p>
                            <p className="text-sm text-muted-foreground/80">
                              {work.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rating Breakdown and Featured Reviews */}
                  <div className="pt-12 border-t mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Rating Breakdown */}
                      <div>
                        <h2 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide">
                          رضا العملاء
                        </h2>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-5xl font-bold text-foreground">
                            {lawyerProfile.profile.stats.clientRatingAverage}
                          </span>
                          <div>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-5 h-5 ${s <= Math.round(lawyerProfile.profile.stats.clientRatingAverage) ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 uppercase">
                              بناءً على{" "}
                              {lawyerProfile.profile.stats.reviewsTotal} تقييم
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Featured Reviews */}
                      {lawyerProfile.topReviews.length > 0 && (
                        <div className="space-y-4">
                          {lawyerProfile.topReviews.map((review, i) => (
                            <Card key={i} className="p-5">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={review.client.profileImageUrl}
                                    alt={`${review.client.firstName} ${review.client.lastName}`}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                  <div>
                                    <h4 className="font-bold text-sm">
                                      {review.client.firstName}{" "}
                                      {review.client.lastName}
                                    </h4>
                                  </div>
                                </div>
                                <span className="text-[11px] text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString(
                                    "ar-EG",
                                  )}
                                </span>
                              </div>
                              <div className="flex gap-0.5 mb-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`}
                                  />
                                ))}
                              </div>
                              <p className="text-sm text-muted-foreground italic leading-relaxed">
                                "{review.comment}"
                              </p>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* EDUCATION */}
              {activeTab === "education" && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      الخلفية الأكاديمية
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lawyerProfile.education.map((edu, i) => (
                        <Card
                          key={i}
                          className="p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="text-3xl mb-4">
                            {/* In here for bachelor's use an icon and for master's use an icon */}
                          </div>
                          <h3 className="font-bold text-lg text-foreground">
                            {edu.degreeType}
                          </h3>
                          <p className="text-secondary font-semibold text-sm">
                            {edu.fieldOfStudy}
                          </p>
                          <div className="mt-4 space-y-1">
                            <p className="text-sm text-muted-foreground">
                              {edu.universityName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {edu.graduationYear}
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      الشهادات المهنية
                    </h2>
                    <div className="space-y-4">
                      {lawyerProfile.certifications.map((cert, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-4 p-4 bg-background rounded-lg border"
                        >
                          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                            <Award className="w-6 h-6 text-secondary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">
                              {cert.certificateName}
                            </h3>
                            <p className="text-sm text-secondary">
                              {cert.issuingOrganization}
                            </p>
                            {/* Insert a place for yearObtained */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="mt-2">
                  <ReviewsTab lawyerId={id ?? ""} reportButton={false} />
                </div>
              )}
            </motion.div>
          </div>
          <PaymentCalendar
            lawyer={{
              lawyerId: id ?? "",
              laweryFirstName: lawyerProfile.profile.firstName,
              lawyerLastName: lawyerProfile.profile.lastName,
              lawyerProfileImage: lawyerProfile.profile.profileImage || "",
            }}
            phonePrice={lawyerProfile?.pricing.phonePrice || 0}
            officePrice={lawyerProfile?.pricing.officePrice || 0}
          />
        </div>
      </div>

      <BlueFooter />
    </div>
  );
};

export default LawyerProfile;
