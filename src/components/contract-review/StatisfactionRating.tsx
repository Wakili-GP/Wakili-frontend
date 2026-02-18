import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function SatisfactionRating() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("يرجى اختيار تقييم");
      return;
    }
    setSubmitted(true);
    toast.success("شكراً لتقييمك!");
  };

  if (submitted) {
    return (
      <Card className="max-w-lg mx-auto text-center">
        <CardContent className="py-10">
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-muted"}`}
              />
            ))}
          </div>
          <h3 className="text-xl font-bold mb-2">شكراً لتقييمك!</h3>
          <p className="text-muted-foreground">
            ملاحظاتك تساعدنا في تحسين خدماتنا
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section>
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle>قيّم تجربتك</CardTitle>
          <p className="text-sm text-muted-foreground">
            كيف كانت تجربتك مع تحليل العقد؟
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stars */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-125"
              >
                <Star
                  className={`w-10 h-10 transition-colors cursor-pointer ${
                    star <= (hoveredRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Feedback */}
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="أضف ملاحظاتك (اختياري)..."
            className="resize-none"
            rows={3}
          />

          <Button onClick={handleSubmit} className="w-full cursor-pointer">
            <Send className="w-4 h-4 ml-2" />
            إرسال التقييم
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
