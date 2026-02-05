import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { useToast } from "@/hooks/use-toast";

// Mock lawyer data
const lawyerInfo = {
  name: "د. أحمد سليمان",
  profileImage:
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&h=200&fit=crop",
  specialty: "محامي القانون المدني والتجاري",
};

// Simulate first session check
const isFirstSession = true;

export default function LawyerReview() {
  //   const { id } = useParams();
  //   const navigate = useNavigate();
  //   const { toast } = useToast();

  const [lawyerRating, setLawyerRating] = useState(0);
  const [lawyerHover, setLawyerHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [systemRating, setSystemRating] = useState(0);
  const [systemHover, setSystemHover] = useState(0);
  const [systemFeedback, setSystemFeedback] = useState("");
  const [includeSystemReview, setIncludeSystemReview] =
    useState(isFirstSession);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (lawyerRating === 0) {
      //   toast({
      //     title: "خطأ",
      //     description: "يرجى تقييم المحامي قبل الإرسال",
      //     variant: "destructive",
      //   });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // toast({
    //   title: "تم إرسال التقييم",
    //   description: "شكراً لمشاركتك رأيك معنا",
    // });

    setIsSubmitting(false);
    // navigate(`/lawyer/${id}`);
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
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`${size} transition-colors ${
              star <= (hover || rating)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );

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
              src={lawyerInfo.profileImage}
              alt={lawyerInfo.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
            />
            <div>
              <h2 className="text-xl font-bold">{lawyerInfo.name}</h2>
              <p className="text-muted-foreground text-sm">
                {lawyerInfo.specialty}
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
              {lawyerRating > 0 && (
                <p className="text-center text-muted-foreground">
                  {lawyerRating === 5 && "ممتاز! 🌟"}
                  {lawyerRating === 4 && "جيد جداً 👍"}
                  {lawyerRating === 3 && "جيد 😊"}
                  {lawyerRating === 2 && "مقبول 😐"}
                  {lawyerRating === 1 && "يحتاج تحسين 😕"}
                </p>
              )}
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
                placeholder="اكتب تعليقك هنا... (اختياري)"
                className="min-h-[120px] resize-none"
              />
            </div>
          </div>
        </Card>

        {/* System Review Card - Only for first session */}
        {isFirstSession && (
          <Card className="p-6 mb-6 border-dashed">
            <div className="flex items-start gap-3 mb-4">
              <Checkbox
                className="cursor-pointer"
                id="system-review"
                checked={includeSystemReview}
                onCheckedChange={(checked) =>
                  setIncludeSystemReview(checked as boolean)
                }
              />
              <div>
                <Label
                  htmlFor="system-review"
                  className="text-lg font-semibold cursor-pointer"
                >
                  قيّم تجربتك مع منصة وكيلك
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  هذه جلستك الأولى! ساعدنا في تحسين المنصة بمشاركة رأيك.
                </p>
              </div>
            </div>

            {includeSystemReview && (
              <div className="space-y-6 mt-6 pt-6 border-t">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    كيف تقيم تجربتك مع المنصة؟
                  </Label>
                  <div className="flex justify-center py-4">
                    <StarRating
                      rating={systemRating}
                      hover={systemHover}
                      setRating={setSystemRating}
                      setHover={setSystemHover}
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="system-feedback"
                    className="text-base font-medium mb-2 block"
                  >
                    ما رأيك في المنصة؟
                  </Label>
                  <Textarea
                    id="system-feedback"
                    value={systemFeedback}
                    onChange={(e) => setSystemFeedback(e.target.value)}
                    placeholder="شاركنا ملاحظاتك واقتراحاتك... (اختياري)"
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="cursor-pointer w-full h-12 text-lg"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              جاري الإرسال...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              إرسال التقييم
            </span>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          تقييمك يساعد العملاء الآخرين في اتخاذ قراراتهم
        </p>
      </div>
    </div>
  );
}
