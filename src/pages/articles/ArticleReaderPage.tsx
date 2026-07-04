import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronUp, ChevronDown, Eye, BookOpen, User, Share2,
  Flag, Bookmark, ArrowRight, Loader, BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ArticleCard from "@/components/articles/ArticleCard";
import type { Article, VoteType } from "@/types/article.types";
import { articleService } from "@/services/article-services";
import { useAuth } from "@/stores/auth.store";
import { useAuthModalStore } from "@/stores/auth-modal.store";
import { toast } from "@/components/ui/sonner";

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toLocaleString("ar-EG");
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ar-EG", {
    year: "numeric", month: "long", day: "numeric",
  });
}

const ArticleReaderPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const openLogin = useAuthModalStore((s) => s.openLogin);

  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [readProgress, setReadProgress] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Vote state
  const [localVote, setLocalVote] = useState<VoteType | null>(null);
  const [localUpvotes, setLocalUpvotes] = useState(0);
  const [localDownvotes, setLocalDownvotes] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    window.scrollTo(0, 0);

    articleService.getArticleById(id).then((res) => {
      if (res.success && res.data) {
        setArticle(res.data);
        setLocalVote(res.data.userVote ?? null);
        setLocalUpvotes(res.data.upvotes);
        setLocalDownvotes(res.data.downvotes);
      }
      setLoading(false);
    });

    articleService.getRelatedArticles(id, 3).then((res) => {
      if (res.success && res.data) setRelated(res.data);
    });
  }, [id]);

  // Scroll tracking
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setReadProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    setShowStickyBar(scrollTop > 500);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleVote = (vote: VoteType) => {
    if (!isAuthenticated) { openLogin(); return; }
    if (localVote === vote) {
      if (vote === "up") setLocalUpvotes((v) => v - 1);
      else setLocalDownvotes((v) => v - 1);
      setLocalVote(null);
    } else {
      if (localVote === "up") setLocalUpvotes((v) => v - 1);
      if (localVote === "down") setLocalDownvotes((v) => v - 1);
      if (vote === "up") setLocalUpvotes((v) => v + 1);
      else setLocalDownvotes((v) => v + 1);
      setLocalVote(vote);
    }
    if (article) articleService.voteArticle(article.id, vote);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("تم نسخ الرابط");
    } catch {
      toast.error("فشل نسخ الرابط");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">المقال غير موجود</h2>
        <p className="text-muted-foreground mb-6">عذراً، لم نتمكن من العثور على هذا المقال</p>
        <Button onClick={() => navigate("/articles/search")}>العودة للمقالات</Button>
      </div>
    );
  }

  const netScore = localUpvotes - localDownvotes;

  return (
    <div className="min-h-screen pb-16">
      {/* Sticky Meta Bar */}
      <div
        className={`sticky-meta-bar transition-transform duration-300 ${showStickyBar ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-12">
          <p className="text-sm font-medium truncate max-w-[40%]">{article.title}</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                className={`vote-btn vote-btn--up ${localVote === "up" ? "active" : ""}`}
                onClick={() => handleVote("up")}
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold">{formatNumber(netScore)}</span>
              <button
                className={`vote-btn vote-btn--down ${localVote === "down" ? "active" : ""}`}
                onClick={() => handleVote("down")}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <Button variant="ghost" size="icon" onClick={handleShare} className="h-8 w-8">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="read-progress-bar" style={{ width: `${readProgress}%` }} />
      </div>

      {/* Hero */}
      <section className="relative w-full" style={{ maxHeight: 480 }}>
        <div className="w-full h-[320px] md:h-[480px] overflow-hidden">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-3"
              style={{ backgroundColor: article.category.color }}
            >
              {article.category.nameAr}
            </span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-3xl leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {article.author.profileImage ? (
                  <img src={article.author.profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">
                    {article.author.firstName} {article.author.lastName}
                  </span>
                  <BadgeCheck className="w-4 h-4 text-secondary" />
                  <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full">محامٍ موثق</span>
                </div>
                <span className="text-sm">{formatDate(article.publishedAt || article.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="container mx-auto px-4 py-10">
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
      </section>

      {/* Engagement Footer */}
      <section className="container mx-auto px-4 py-8 max-w-[680px]">
        <div className="border border-border rounded-2xl p-6 space-y-4">
          <p className="text-center font-semibold text-lg">هل كان هذا المقال مفيداً؟</p>

          <div className="flex items-center justify-center gap-6">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${localVote === "up" ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-muted hover:bg-muted/80"}`}
              onClick={() => handleVote("up")}
            >
              <ChevronUp className="w-5 h-5" />
              <span className="font-semibold">{formatNumber(localUpvotes)}</span>
              <span className="text-sm">إعجاب</span>
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${localVote === "down" ? "bg-indigo-50 text-indigo-600 border border-indigo-200" : "bg-muted hover:bg-muted/80"}`}
              onClick={() => handleVote("down")}
            >
              <ChevronDown className="w-5 h-5" />
              <span className="font-semibold">{formatNumber(localDownvotes)}</span>
              <span className="text-sm">غير مفيد</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" /> {formatNumber(article.totalReads)} قرأوا هذا المقال
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" /> {article.readTimeMinutes} دقائق قراءة
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 border-t border-border">
            <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1">
              <Share2 className="w-4 h-4" /> مشاركة
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <Bookmark className="w-4 h-4" /> حفظ
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              <Flag className="w-4 h-4" /> إبلاغ
            </Button>
          </div>
        </div>
      </section>

      {/* Author Card */}
      <section className="container mx-auto px-4 py-6 max-w-[680px]">
        <div className="bg-gradient-to-br from-primary/5 to-transparent border border-border rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {article.author.profileImage ? (
                <img src={article.author.profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold">
                  {article.author.firstName} {article.author.lastName}
                </h3>
                <BadgeCheck className="w-5 h-5 text-primary" />
              </div>
              {article.author.specialization && (
                <p className="text-sm text-primary font-medium mb-2">{article.author.specialization}</p>
              )}
              {article.author.bio && (
                <p className="text-sm text-muted-foreground leading-relaxed">{article.author.bio}</p>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 gap-1 text-primary"
                onClick={() => navigate(`/articles/search?authorId=${article.author.id}`)}
              >
                عرض جميع مقالات الكاتب
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">مقالات ذات صلة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ArticleReaderPage;
