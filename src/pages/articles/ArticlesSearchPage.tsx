import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, BookOpen, Loader, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArticleCard from "@/components/articles/ArticleCard";
import { ARTICLE_CATEGORIES } from "@/types/article.types";
import type { Article, ArticleSearchParams } from "@/types/article.types";
import { articleService } from "@/services/article-services";

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "most_liked", label: "الأكثر إعجاباً" },
  { value: "most_read", label: "الأكثر قراءة" },
];

const ArticlesSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState<ArticleSearchParams["sortBy"]>(
    (searchParams.get("sortBy") as ArticleSearchParams["sortBy"]) || "newest",
  );

  const fetchArticles = useCallback(
    async (p = 1) => {
      setLoading(true);
      const params: ArticleSearchParams = {
        keyword: keyword || undefined,
        category: category || undefined,
        sortBy,
        page: p,
        limit: 9,
      };

      const res = await articleService.getArticles(params);
      if (res.success && res.data) {
        if (p === 1) {
          setArticles(res.data.articles);
        } else {
          setArticles((prev) => [...prev, ...res.data!.articles]);
        }
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
        setPage(p);
      }
      setLoading(false);
    },
    [keyword, category, sortBy],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArticles(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchArticles]);

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (category) params.set("category", category);
    if (sortBy && sortBy !== "newest") params.set("sortBy", sortBy);
    setSearchParams(params, { replace: true });
  }, [keyword, category, sortBy, setSearchParams]);

  const activeFilters: { key: string; label: string }[] = [];
  if (category) {
    const cat = ARTICLE_CATEGORIES.find((c) => c.slug === category);
    activeFilters.push({ key: "category", label: cat?.nameAr || category });
  }
  if (sortBy && sortBy !== "newest") {
    const sort = SORT_OPTIONS.find((s) => s.value === sortBy);
    activeFilters.push({ key: "sortBy", label: sort?.label || sortBy });
  }

  const clearFilter = (key: string) => {
    if (key === "category") setCategory("");
    if (key === "sortBy") setSortBy("newest");
  };

  const resetAllFilters = () => {
    setKeyword("");
    setCategory("");
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen pb-16">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(218,85%,15%)] via-[hsl(218,85%,22%)] to-[hsl(218,75%,30%)] text-white">
        {/* Decorative orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-secondary/10 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-secondary rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container mx-auto px-4 pt-14 pb-20 md:pt-20 md:pb-28 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-5">
              <Scale className="w-3.5 h-3.5 text-secondary" />
              <span className="text-xs font-medium">مقالات من محامين معتمدين</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              استكشف المقالات
              <span className="bg-gradient-to-l from-[hsl(45,85%,65%)] to-[hsl(45,85%,50%)] bg-clip-text text-transparent"> القانونية</span>
            </h1>

            <p className="text-sm md:text-base text-white/60 mb-8 max-w-lg mx-auto">
              ابحث وتصفّح مكتبتنا الشاملة من المقالات القانونية المكتوبة من خبراء
            </p>

            {/* Search Bar – embedded in hero */}
            <div className="max-w-2xl mx-auto mb-5">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="ابحث عن مقالات بالعنوان أو الموضوع أو الكلمة المفتاحية..."
                  className="w-full h-13 pr-12 pl-14 rounded-xl border border-white/20 bg-white/95 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all shadow-lg shadow-black/10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 hover:bg-black/5"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* Category quick-picks */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              <button
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!category ? "bg-secondary text-secondary-foreground" : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/15"}`}
                onClick={() => setCategory("")}
              >
                الكل
              </button>
              {ARTICLE_CATEGORIES.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${category === cat.slug ? "bg-secondary text-secondary-foreground" : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/15"}`}
                  onClick={() => setCategory(category === cat.slug ? "" : cat.slug)}
                >
                  {cat.nameAr}
                </button>
              ))}
            </div>

            {/* Result count */}
            <p className="text-xs text-white/50">
              {loading ? "جاري البحث..." : `${total} مقال`}
            </p>
          </motion.div>
        </div>

        {/* Wave divider – same as landing page */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 73.3C120 66.7 240 53.3 360 48C480 42.7 600 45.3 720 50.7C840 56 960 64 1080 64C1200 64 1320 56 1380 52L1440 48V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="hsl(0,0%,100%)" />
          </svg>
        </div>
      </section>

      {/* ── Filters (below hero, expandable) ── */}
      <div className="container mx-auto px-4 -mt-2">
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="max-w-3xl mx-auto overflow-hidden"
            >
              <div className="bg-card border border-border rounded-xl p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-sm">
                {/* Category */}
                <div>
                  <label className="text-sm font-medium mb-1 block">التخصص</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">جميع التخصصات</option>
                    {ARTICLE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.nameAr}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm font-medium mb-1 block">ترتيب حسب</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as ArticleSearchParams["sortBy"])}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 max-w-2xl mx-auto mb-4">
            {activeFilters.map((f) => (
              <span key={f.key} className="filter-chip">
                {f.label}
                <button onClick={() => clearFilter(f.key)} aria-label="إزالة">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={resetAllFilters}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              مسح الكل
            </button>
          </div>
        )}
      </div>

      {/* Results Grid */}
      <div className="container mx-auto px-4 pt-8">
        {loading && articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">جاري تحميل المقالات...</p>
          </div>
        ) : articles.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">لم يتم العثور على مقالات</h3>
            <p className="text-muted-foreground mb-4">جرّب تغيير معايير البحث أو الفلاتر</p>
            <Button variant="outline" onClick={resetAllFilters}>
              إعادة تعيين الفلاتر
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Load More */}
            {page < totalPages && (
              <div className="text-center mt-10">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fetchArticles(page + 1)}
                  disabled={loading}
                  className="min-w-[200px]"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    "تحميل المزيد"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArticlesSearchPage;
