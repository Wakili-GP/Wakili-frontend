import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText, ChevronUp, Eye, BookOpen, Plus, Edit, Trash2,
  ExternalLink, Loader, Clock, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Article, ArticleStats, ArticleStatus } from "@/types/article.types";
import { articleService } from "@/services/article-services";
import { toast } from "@/components/ui/sonner";

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toLocaleString("ar-EG");
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ar-EG", {
    year: "numeric", month: "short", day: "numeric",
  });
}

const statusConfig: Record<ArticleStatus, { label: string; class: string }> = {
  draft: { label: "مسودة", class: "status-badge--draft" },
  under_review: { label: "قيد المراجعة", class: "status-badge--under_review" },
  published: { label: "منشور", class: "status-badge--published" },
  rejected: { label: "مرفوض", class: "status-badge--rejected" },
};

const ArticleDashboardPage = ({ onNavigate }: { onNavigate?: (section: string) => void }) => {
  const navigate = useNavigate();
  
  const handleNavigate = (path: string) => {
    if (onNavigate && path === "/dashboard/article-submission") {
      onNavigate("article-submission");
    } else {
      navigate(path);
    }
  };
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<ArticleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | "">("");
  const [sortBy, setSortBy] = useState<"date" | "reads" | "likes">("date");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      articleService.getMyArticles(),
      articleService.getMyArticleStats(),
    ]).then(([articlesRes, statsRes]) => {
      if (articlesRes.success && articlesRes.data) setArticles(articlesRes.data);
      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("هل تريد حذف هذا المقال؟")) return;
    const res = await articleService.deleteArticle(id);
    if (res.success) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast.success("تم حذف المقال");
    }
  };

  // Filter & sort
  let filtered = statusFilter
    ? articles.filter((a) => a.status === statusFilter)
    : articles;

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "reads") return b.totalReads - a.totalReads;
    if (sortBy === "likes") return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="pb-16 w-full">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold">مقالاتي</h1>
          <Button onClick={() => handleNavigate("/dashboard/article-submission")} className="gap-2">
            <Plus className="w-4 h-4" /> مقال جديد
          </Button>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: FileText, label: "إجمالي المقالات", value: stats.totalArticles, color: "text-primary" },
              { icon: ChevronUp, label: "إجمالي الإعجابات", value: stats.totalUpvotes, color: "text-amber-500" },
              { icon: Eye, label: "إجمالي القراءات", value: stats.totalReads, color: "text-blue-500" },
              { icon: Clock, label: "وقت القراءة المولّد", value: stats.totalReadTimeGenerated, color: "text-green-500", suffix: " د" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="bg-card border border-border rounded-xl p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                <p className="text-2xl font-bold">{formatNumber(stat.value)}{stat.suffix || ""}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ArticleStatus | "")}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">جميع الحالات</option>
            <option value="draft">مسودة</option>
            <option value="under_review">قيد المراجعة</option>
            <option value="published">منشور</option>
            <option value="rejected">مرفوض</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "reads" | "likes")}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="date">الأحدث</option>
            <option value="reads">الأكثر قراءة</option>
            <option value="likes">الأكثر إعجاباً</option>
          </select>
        </div>

        {/* Articles Table */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد مقالات</h3>
            <p className="text-muted-foreground text-sm mb-4">ابدأ بكتابة مقالك الأول</p>
            <Button onClick={() => handleNavigate("/dashboard/article-submission")} className="gap-2">
              <Plus className="w-4 h-4" /> مقال جديد
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((article, i) => (
              <motion.div
                key={article.id}
                className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-card transition-shadow"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {/* Thumbnail */}
                <div className="w-full sm:w-[80px] h-[60px] rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {article.coverImage ? (
                    <img src={article.coverImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-sm truncate max-w-[300px]">{article.title}</h3>
                    <span className={`status-badge ${statusConfig[article.status].class}`}>
                      {statusConfig[article.status].label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>أُنشئ: {formatDate(article.createdAt)}</span>
                    {article.publishedAt && <span>نُشر: {formatDate(article.publishedAt)}</span>}
                  </div>

                  {article.status === "rejected" && article.rejectionReason && (
                    <p className="text-xs text-red-500 mt-1">السبب: {article.rejectionReason}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
                  <span className="flex items-center gap-1" title="قراءات">
                    <Eye className="w-3.5 h-3.5" /> {formatNumber(article.totalReads)}
                  </span>
                  <span className="flex items-center gap-1" title="إعجابات">
                    <ChevronUp className="w-3.5 h-3.5" /> {article.upvotes}
                  </span>
                  <span className="flex items-center gap-1" title="وقت القراءة">
                    <BookOpen className="w-3.5 h-3.5" /> {article.readTimeMinutes}د
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {article.status === "draft" && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="تعديل"
                      onClick={() => handleNavigate("/dashboard/article-submission")}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  {article.status === "published" && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="عرض"
                      onClick={() => navigate(`/articles/${article.id}`)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                  {article.status === "rejected" && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" title="تعديل وإعادة إرسال"
                      onClick={() => handleNavigate("/dashboard/article-submission")}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    title="حذف"
                    onClick={() => handleDelete(article.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDashboardPage;
