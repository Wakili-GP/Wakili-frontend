import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Users, Eye, ArrowLeft, Scale, PenTool, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoCard from "@/components/articles/VideoCard";
import ArticleCard from "@/components/articles/ArticleCard";
import { ARTICLE_CATEGORIES } from "@/types/article.types";
import type { Article, ArticleStats } from "@/types/article.types";
import { articleService } from "@/services/article-services";
import { useAuth } from "@/stores/auth.store";

// Video assets
import video1 from "@/assets/articles/Hero_Section_Videos_A_man_in_a_dark_suit_turns_the_pages_of_an_open_OH0TzHM9.mp4";
import video2 from "@/assets/articles/Hero_Section_Videos_A_woman_with_dark_hair_wearing_a_navy_blue_rYJyROoD.mp4";
import video3 from "@/assets/articles/Hero_Section_Videos_In_a_cinematic_style_a_man_in_a_dark_suit_sits_LE-5A4ym.mp4";

const videos = [
  { src: video1, title: "ما هي وكيلي للمقالات القانونية؟", caption: "تعرف على منصتنا للنشر القانوني الموثوق", duration: "0:45" },
  { src: video2, title: "كيف يساهم المحامون في النشر", caption: "رحلة المحامي من الكتابة إلى النشر", duration: "0:38" },
  { src: video3, title: "لماذا يثق القرّاء بنا", caption: "معايير الجودة والمراجعة التحريرية", duration: "0:52" },
];

// ── Animated Counter ──
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const stepTime = 16;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, stepTime);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const formatted = count >= 1000
    ? (count / 1000).toFixed(1).replace(/\.0$/, "") + "k"
    : count.toString();

  return <div ref={ref} className="text-4xl md:text-5xl font-bold text-primary">{formatted}{suffix}</div>;
}

const ArticlesLandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<ArticleStats | null>(null);

  useEffect(() => {
    articleService.getLatestArticles(3).then((res) => {
      if (res.success && res.data) setLatestArticles(res.data);
    });
    articleService.getArticleStats().then((res) => {
      if (res.success && res.data) setStats(res.data);
    });
  }, []);

  const isLawyer = isAuthenticated && user?.userType === "Lawyer";

  return (
    <div className="w-full">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(218,85%,15%)] via-[hsl(218,85%,22%)] to-[hsl(218,75%,30%)] text-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary/10 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-secondary rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Scale className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium">منصة المقالات القانونية الموثوقة</span>
              <Sparkles className="w-4 h-4 text-secondary" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              رؤى قانونية من
              <span className="bg-gradient-to-l from-[hsl(45,85%,65%)] to-[hsl(45,85%,50%)] bg-clip-text text-transparent"> خبراء موثقين</span>
            </h1>

            <p className="text-lg md:text-xl text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed">
              محتوى قانوني متخصص مكتوب من محامين معتمدين ومراجع من فريقنا التحريري. اكتشف مقالات تحليلية تغطي جميع المجالات القانونية.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="cta"
                size="xl"
                onClick={() => navigate("/articles/search")}
                className="gap-2"
              >
                تصفح المقالات
                <ArrowLeft className="w-5 h-5" />
              </Button>

              {isLawyer && (
                <Button
                  variant="outline"
                  size="xl"
                  onClick={() => navigate("/dashboard/article-submission")}
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white gap-2"
                >
                  <PenTool className="w-5 h-5" />
                  ابدأ الكتابة
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 73.3C120 66.7 240 53.3 360 48C480 42.7 600 45.3 720 50.7C840 56 960 64 1080 64C1200 64 1320 56 1380 52L1440 48V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="hsl(0,0%,100%)" />
          </svg>
        </div>
      </section>

      {/* ── Video Section ── */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">تعرّف على منصتنا</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            شاهد كيف نقدم محتوى قانوني موثوق ومراجع من خبراء القانون
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <VideoCard {...v} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Category Strip ── */}
      <section className="container mx-auto px-4 pb-8">
        <h3 className="text-xl font-bold mb-4">تصفح حسب التخصص</h3>
        <div className="category-strip">
          {ARTICLE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className="category-pill"
              onClick={() => navigate(`/articles/search?category=${cat.slug}`)}
            >
              {cat.nameAr}
            </button>
          ))}
        </div>
      </section>

      {/* ── Stats Bar ── */}
      {stats && (
        <section className="bg-gradient-to-r from-muted/50 to-muted/30 py-16 my-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="stat-card space-y-2">
                <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                <AnimatedCounter target={stats.totalArticles} suffix="+" />
                <p className="text-muted-foreground font-medium">مقال منشور</p>
              </div>
              <div className="stat-card space-y-2" style={{ animationDelay: "0.2s" }}>
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <AnimatedCounter target={4} suffix="+" />
                <p className="text-muted-foreground font-medium">محامٍ مساهم</p>
              </div>
              <div className="stat-card space-y-2" style={{ animationDelay: "0.4s" }}>
                <Eye className="w-8 h-8 text-primary mx-auto mb-2" />
                <AnimatedCounter target={stats.totalReads} />
                <p className="text-muted-foreground font-medium">إجمالي القراءات</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Articles ── */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">أحدث المقالات</h2>
          <Button variant="ghost" onClick={() => navigate("/articles/search")} className="gap-1 text-primary">
            عرض الكل
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[hsl(218,85%,20%)] to-[hsl(218,85%,30%)] text-white py-16 my-8 rounded-2xl mx-4 lg:mx-auto lg:max-w-6xl">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10 text-center px-4">
          <PenTool className="w-12 h-12 mx-auto mb-4 text-secondary" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            هل أنت محامٍ؟ شارك خبرتك مع آلاف القرّاء
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            انضم إلى مجتمع المحامين الكُتّاب وساهم في نشر الوعي القانوني
          </p>
          <Button
            variant="cta"
            size="xl"
            onClick={() => {
              if (isLawyer) navigate("/dashboard/article-submission");
              else navigate("/");
            }}
          >
            {isLawyer ? "ابدأ الكتابة الآن" : "انضم كمحامٍ"}
          </Button>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
};

export default ArticlesLandingPage;
