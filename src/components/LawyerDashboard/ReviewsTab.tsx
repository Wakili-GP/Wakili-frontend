import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Flag,
  Search,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import reviewsServices from "@/services/reviews-services";

const PAGE_SIZE = 6;

const REPORT_REASONS = [
  "محتوى مسيء أو تحرش",
  "معلومات كاذبة أو مضللة",
  "تقييم من شخص لم يكن عميلاً",
  "محتوى غير لائق أو مخالف",
  "انتهاك الخصوصية",
  "سبب آخر",
];

export interface ReviewsTabProps {
  lawyerId: string;
  reportButton?: boolean;
}

const ReviewsTab = ({ lawyerId, reportButton = true }: ReviewsTabProps) => {
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDescending, setSortDescending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportedReviews, setReportedReviews] = useState<Set<string>>(
    new Set(),
  );

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingReview, setReportingReview] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");

  // ── Fetch stats ──
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["reviewStats", lawyerId],
    queryFn: () => reviewsServices.getReviewsStats(lawyerId),
    enabled: !!lawyerId,
  });

  // ── Fetch reviews (server-side pagination & filters) ──
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: [
      "reviews",
      lawyerId,
      currentPage,
      ratingFilter,
      searchTerm,
      sortDescending,
    ],
    queryFn: () =>
      reviewsServices.getReviews({
        lawyerId,
        PageNumber: currentPage,
        PageSize: PAGE_SIZE,
        ...(ratingFilter !== "all" ? { Stars: ratingFilter } : {}),
        ...(searchTerm ? { SearchQuery: searchTerm } : {}),
        SortDescending: sortDescending,
      }),
    enabled: !!lawyerId,
  });

  const reviews = reviewsData?.items ?? [];
  const totalPages = reviewsData?.totalPages ?? 1;

  const openReportModal = (reviewId: string, clientName: string) => {
    setReportingReview({ id: reviewId, name: clientName });
    setReportReason("");
    setReportDetails("");
    setReportModalOpen(true);
  };

  const handleReport = () => {
    if (!reportReason) {
      toast.error("يرجى اختيار سبب البلاغ");
      return;
    }
    if (reportingReview !== null) {
      setReportedReviews((prev) => new Set(prev).add(reportingReview.id));
    }
    setReportModalOpen(false);
    setReportingReview(null);
    toast.success("تم إرسال البلاغ بنجاح. سيتم مراجعته من قِبل الفريق المختص.");
  };

  // Calculate satisfaction (5-star percentage)
  const satisfactionPercent = stats
    ? stats.totalReviews > 0
      ? Math.round((stats.starCounts["5"] / stats.totalReviews) * 100)
      : 0
    : 0;

  // Initial full-page loader
  if (statsLoading && reviewsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-secondary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 text-center">
          <p className="text-4xl font-bold text-foreground">
            {stats?.averageRating?.toFixed(1) ?? "—"}
          </p>
          <div className="flex justify-center mt-2 gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${s <= Math.round(stats?.averageRating ?? 0) ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">متوسط التقييم</p>
        </Card>

        <Card className="p-5 text-center">
          <p className="text-4xl font-bold text-foreground">
            {stats?.totalReviews ?? 0}
          </p>
          <p className="text-xs text-muted-foreground mt-2">إجمالي التقييمات</p>
        </Card>

        <Card className="p-5 text-center">
          <p className="text-4xl font-bold text-emerald-600">
            {satisfactionPercent}%
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            نسبة الرضا (5 نجوم)
          </p>
        </Card>
      </div>

      {/* ── Filters Bar ── */}
      <div className="flex flex-wrap gap-3 items-center bg-background border rounded-xl px-4 py-3">
        <div className="flex gap-1 items-center flex-wrap">
          <span className="text-xs text-muted-foreground ml-1">التقييم:</span>
          <button
            onClick={() => {
              setRatingFilter("all");
              setCurrentPage(1);
            }}
            className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium border transition-all ${ratingFilter === "all" ? "bg-secondary text-secondary-foreground border-secondary" : "border-border text-muted-foreground hover:border-secondary/50"}`}
          >
            الكل
          </button>
          {[5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => {
                setRatingFilter(r);
                setCurrentPage(1);
              }}
              className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1 ${ratingFilter === r ? "bg-secondary text-secondary-foreground border-secondary" : "border-border text-muted-foreground hover:border-secondary/50"}`}
            >
              {r} <Star className="w-3 h-3" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 border rounded-lg px-3 py-1.5 flex-1 min-w-40">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="ابحث بالاسم..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-transparent outline-none flex-1 text-right"
          />
        </div>

        <Select
          dir="rtl"
          value={sortDescending ? "newest" : "oldest"}
          onValueChange={(value) => {
            setSortDescending(value === "newest");
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="cursor-pointer w-36 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer justify-end" value="newest">
              الأحدث أولاً
            </SelectItem>
            <SelectItem className="cursor-pointer justify-end" value="oldest">
              الأقدم أولاً
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Reviews List ── */}
      <div className="space-y-4">
        {reviewsLoading ? (
          <Card className="p-10 text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">جاري تحميل التقييمات...</span>
            </div>
          </Card>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">
            لا توجد تقييمات تطابق الفلتر المختار
          </div>
        ) : (
          reviews.map((review) => {
            const isReported = reportedReviews.has(review.id);
            const fullName = `${review.client.firstName} ${review.client.lastName}`;
            return (
              <Card key={review.id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.client.profileImageUrl}
                      alt={fullName}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-sm">{fullName}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("ar-EG")}
                    </span>
                    {reportButton && isReported && (
                      <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full font-medium">
                        <Flag className="w-3 h-3" /> تم الإبلاغ
                      </span>
                    )}
                  </div>
                </div>

                {reportButton && !isReported && (
                  <div className="flex gap-0.5 mb-2">
                    <button
                      onClick={() => openReportModal(review.id, fullName)}
                      className="cursor-pointer inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 px-2.5 py-1 rounded-full transition-all"
                    >
                      <Flag className="w-3 h-3" /> إبلاغ
                    </button>
                  </div>
                )}

                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s <= review.rating ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground italic text-sm leading-relaxed">
                  "{review.comment}"
                </p>
              </Card>
            );
          })
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="icon"
            className="w-9 h-9"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              className="w-9 h-9"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            className="w-9 h-9"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* ── Report Review Modal ── */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader className="mt-5 text-center">
            <DialogTitle className="flex justify-center items-center gap-2 text-red-600">
              <Flag className="w-5 h-5" />
              الإبلاغ عن تقييم
            </DialogTitle>
            <DialogDescription className="text-center">
              {reportingReview
                ? `الإبلاغ عن تقييم بقلم "${reportingReview.name}" — سيتم مراجعته من قِبل الفريق المختص`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-4">
              <label className="text-sm font-medium">
                سبب البلاغ <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setReportReason(reason)}
                    className={`cursor-pointer w-full text-right px-4 py-3 rounded-lg border text-sm transition-all ${
                      reportReason === reason
                        ? "border-red-400 bg-red-50 text-red-700 font-medium"
                        : "border-border hover:border-muted-foreground/40 hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                          reportReason === reason
                            ? "border-red-500 bg-red-500"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {reportReason === reason && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      {reason}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm mb-4 font-medium">
                تفاصيل إضافية (اختياري)
              </label>
              <Textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="أضف أي تفاصيل تساعد في مراجعة البلاغ..."
                rows={3}
                className="resize-none text-sm"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleReport}
              >
                <Flag className="w-4 h-4 ml-1" /> إرسال البلاغ
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setReportModalOpen(false)}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsTab;
