import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader, Scale, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ForumPostCard from "@/components/forum/ForumPostCard";
import ForumFilterBar from "@/components/forum/ForumFilterBar";
import { ARTICLE_CATEGORIES } from "@/types/article.types";
import type { ForumPost, ForumSearchParams } from "@/types/forum.types";
import { forumService } from "@/services/forum-services";

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "most_liked", label: "الأكثر إعجاباً" },
  { value: "most_commented", label: "الأكثر تعليقاً" },
  { value: "unanswered", label: "بدون إجابة" },
];

const ForumSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState<ForumSearchParams["sortBy"]>(
    (searchParams.get("sortBy") as ForumSearchParams["sortBy"]) || "newest"
  );

  const fetchPosts = useCallback(
    async (p = 1) => {
      setLoading(true);
      const params: ForumSearchParams = {
        keyword: keyword || undefined,
        category: category || undefined,
        sortBy,
        page: p,
        limit: 9,
      };

      const res = await forumService.getPosts(params);
      if (res.success && res.data) {
        if (p === 1) {
          setPosts(res.data.posts);
        } else {
          setPosts((prev) => [...prev, ...res.data!.posts]);
        }
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
        setPage(p);
      }
      setLoading(false);
    },
    [keyword, category, sortBy]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchPosts]);

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
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-secondary/10 rounded-full blur-2xl" />
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
              <span className="text-xs font-medium">أسئلة من مجتمع قانوني موثوق</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              استكشف الأسئلة
              <span className="bg-gradient-to-l from-[hsl(45,85%,65%)] to-[hsl(45,85%,50%)] bg-clip-text text-transparent"> القانونية</span>
            </h1>

            <p className="text-sm md:text-base text-white/60 mb-8 max-w-lg mx-auto">
              ابحث وتصفّح مكتبتنا الشاملة من الأسئلة والإجابات القانونية
            </p>

            <div className="max-w-2xl mx-auto mb-5">
              <ForumFilterBar
                keyword={keyword}
                onKeywordChange={setKeyword}
                category={category}
                onCategoryChange={setCategory}
                sortBy={sortBy || "newest"}
                onSortChange={(val) => setSortBy(val as any)}
              />
            </div>

            {/* Category quick-picks */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              <button
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!category ? "bg-secondary text-secondary-foreground" : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/15"}`}
                onClick={() => setCategory("")}
              >
                الكل
              </button>
              {ARTICLE_CATEGORIES.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${category === cat.slug ? "bg-secondary text-secondary-foreground" : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/15"}`}
                  onClick={() => setCategory(category === cat.slug ? "" : cat.slug)}
                >
                  {cat.nameAr}
                </button>
              ))}
            </div>

            <p className="text-xs text-white/50">
              {loading ? "جاري البحث..." : `${total} سؤال`}
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 73.3C120 66.7 240 53.3 360 48C480 42.7 600 45.3 720 50.7C840 56 960 64 1080 64C1200 64 1320 56 1380 52L1440 48V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="hsl(0,0%,100%)" />
          </svg>
        </div>
      </section>

      {/* ── Active Filters ── */}
      <div className="container mx-auto px-4 mt-6">
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 max-w-2xl mx-auto mb-6">
            {activeFilters.map((f) => (
              <span key={f.key} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                {f.label}
                <button onClick={() => clearFilter(f.key)} aria-label="إزالة">
                  <X className="w-3 h-3 hover:text-foreground transition-colors" />
                </button>
              </span>
            ))}
            <button
              onClick={resetAllFilters}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors mr-2"
            >
              مسح الكل
            </button>
          </div>
        )}
      </div>

      {/* ── Results Grid ── */}
      <div className="container mx-auto px-4 pt-4">
        {loading && posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">جاري تحميل الأسئلة...</p>
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <HelpCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">لم يتم العثور على أسئلة</h3>
            <p className="text-muted-foreground mb-4">جرّب تغيير معايير البحث أو الفلاتر</p>
            <Button variant="outline" onClick={resetAllFilters}>
              إعادة تعيين الفلاتر
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <ForumPostCard key={post.id} post={post} />
              ))}
            </div>

            {page < totalPages && (
              <div className="text-center mt-10">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fetchPosts(page + 1)}
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

export default ForumSearchPage;
