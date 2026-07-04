import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, CheckCircle, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import reviewsServices from "@/services/reviews-services";
import lawyerProfileServices, { type LawyerProfileCore } from "@/services/lawyerProfile-services";
import clientProfileService from "@/services/clientProfile-services";


export default function LawyerReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lawyer, setLawyer] = useState<LawyerProfileCore | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [lawyerRating, setLawyerRating] = useState(0);
  const [lawyerHover, setLawyerHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    const fetchLawyerInfo = async () => {
      if (!id) return;
      try {
        // First get the appointments to find the lawyerId
        const bookings = await clientProfileService.getClientBookings();
        const appointment = bookings.find((b) => b.id === id);

        if (appointment && appointment.lawyerId) {
          const profileData = await lawyerProfileServices.getLawyerProfile(appointment.lawyerId);
          setLawyer(profileData.profile);

          if (appointment.isReviewed) {
            setIsReadOnly(true);
            const reviewData = await reviewsServices.getReviewByAppointmentId(id);
            if (reviewData) {
              setLawyerRating(reviewData.rating);
              setFeedback(reviewData.comment);
              // System review fetching could be added here if backend returns it
            }
          }
        } else {
          toast.error("لم يتم العثور على الموعد");
        }
      } catch (error) {
        console.error("Error fetching lawyer info:", error);
        toast.error("حدث خطأ أثناء تحميل بيانات المحامي");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLawyerInfo();
  }, [id]);

  const handleSubmit = async () => {
    if (!id) return;

    if (lawyerRating === 0) {
      toast.error("خطأ", {
        description: "يرجى تقييم المحامي قبل الإرسال",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await reviewsServices.createReview({
        appointmentId: id,
        lawyerReview: {
          rating: lawyerRating,
          comment: feedback,
        },
        systemReview: null,
      });

      toast.success("تم إرسال التقييم", {
        description: "شكراً لمشاركتك رأيك معنا",
      });

      navigate("/profile");
    } catch (error: any) {
      toast.error("خطأ", {
        description: error.response?.data?.title || "حدث خطأ أثناء إرسال التقييم",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({
    rating,
    hover,
    setRating,
    setHover,
    size = "w-8 h-8",
  }: {
    rating: number;
    hover: number;
    setRating: (val: number) => void;
    setHover: (val: number) => void;
    size?: string;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={isReadOnly}
          onClick={() => !isReadOnly && setRating(star)}
          onMouseEnter={() => !isReadOnly && setHover(star)}
          onMouseLeave={() => !isReadOnly && setHover(0)}
          className={`transition-transform ${!isReadOnly ? "hover:scale-110" : "cursor-default"}`}
        >
          <Star
            className={`${size} transition-colors ${star <= (hover || rating)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
              }`}
          />
        </button>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen bg-background py-12 flex flex-col justify-center items-center gap-4">
        <h2 className="text-2xl font-bold">لم يتم العثور على المحامي</h2>
        <Button onClick={() => navigate("/profile")}>العودة للملف الشخصي</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12" dir="rtl">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">تهانينا!</h1>
          <p className="text-muted-foreground text-lg">
            تم إكمال جلستك بنجاح. نتمنى أن تكون قد حصلت على تجربة مميزة.
          </p>
        </div>

        {/* Lawyer Review Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={lawyer.profileImage || "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&h=200&fit=crop"}
              alt={`${lawyer.firstName} ${lawyer.lastName}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
            />
            <div>
              <h2 className="text-xl font-bold">{lawyer.firstName} {lawyer.lastName}</h2>
              <p className="text-muted-foreground text-sm">
                {lawyer.summary || lawyer.bio || "محامي"}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold mb-3 block">
                كيف تقيم تجربتك مع المحامي؟
              </Label>
              <div className="flex justify-center py-4">
                <StarRating
                  rating={lawyerRating}
                  hover={lawyerHover}
                  setRating={setLawyerRating}
                  setHover={setLawyerHover}
                  size="w-10 h-10"
                />
              </div>
              {/* {lawyerRating > 0 && (
                <p className="text-center text-muted-foreground">
                  {lawyerRating === 5 && "ممتاز! 🌟"}
                  {lawyerRating === 4 && "جيد جداً 👍"}
                  {lawyerRating === 3 && "جيد 😊"}
                  {lawyerRating === 2 && "مقبول 😐"}
                  {lawyerRating === 1 && "يحتاج تحسين 😕"}
                </p>
              )} */}
            </div>

            <div>
              <Label
                htmlFor="feedback"
                className="text-base font-medium mb-2 block"
              >
                شاركنا رأيك عن المحامي والاستشارة
              </Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={isReadOnly ? "" : "اكتب تعليقك هنا... (اختياري)"}
                className="min-h-[120px] resize-none"
                disabled={isReadOnly}
              />
            </div>
          </div>
        </Card>


        {/* Submit Button */}
        {!isReadOnly && (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="cursor-pointer w-full h-12 text-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري الإرسال...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                إرسال التقييم
              </span>
            )}
          </Button>
        )}

        {!isReadOnly && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            تقييمك يساعد العملاء الآخرين في اتخاذ قراراتهم
          </p>
        )}
      </div>
    </div>
  );
}
