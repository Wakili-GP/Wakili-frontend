import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Users,
  CheckCircle,
  MessageCircle,
  Scale,
  Sparkles,
  PenTool,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ForumPostCard from "@/components/forum/ForumPostCard";
import ForumSubmitModal from "@/components/forum/ForumSubmitModal";
import type { ForumPost, ForumStats, ForumPostSubmission } from "@/types/forum.types";
import { forumService } from "@/services/forum-services";
import { SpecializationService, type Specialization } from "@/services/specializations-services";
import { useAuth } from "@/stores/auth.store";
import { useAuthModalStore } from "@/stores/auth-modal.store";
import { toast } from "sonner";

// Animated counter component
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [target]);

  const formatted = count >= 1000 ? (count / 1000).toFixed(1).replace(/\.0$/, "") + "k" : count.toString();
  return <div className="text-4xl md:text-5xl font-bold text-primary">{formatted}{suffix}</div>;
}

const ForumLandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const openLogin = useAuthModalStore((s) => s.openLogin);

  const [latestPosts, setLatestPosts] = useState<ForumPost[]>([]);
  const [stats, setStats] = useState<ForumStats | null>(null);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  useEffect(() => {
    forumService.getLatestPosts(6).then((res) => {
      if (res.success && res.data) setLatestPosts(res.data);
    });
    forumService.getForumStats().then((res) => {
      if (res.success && res.data) setStats(res.data);
    });
    SpecializationService.getSpecializations().then((res) => {
      if (res.success && res.data) setSpecializations(res.data);
    });
  }, []);

  const handleAskQuestionClick = () => {
    if (!isAuthenticated) {
      openLogin();
    } else {
      setIsSubmitModalOpen(true);
    }
  };

  const handleQuestionSubmit = async (data: ForumPostSubmission) => {
    const res = await forumService.createPost(data);
    if (res.success) {
      toast.success("تم إرسال سؤالك بنجاح", {
        description: "سيتم مراجعة السؤال من قبل الإدارة ونشره قريباً",
      });
      setIsSubmitModalOpen(false);
    } else {
      toast.error("حدث خطأ أثناء إرسال السؤال");
    }
  };

  return (
    <div className="w-full">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(218,85%,15%)] via-[hsl(218,85%,22%)] to-[hsl(218,75%,30%)] text-white">
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
              <span className="text-sm font-medium">مجتمع الأسئلة القانونية</span>
              <Sparkles className="w-4 h-4 text-secondary" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              أسئلة قانونية من
              <span className="bg-gradient-to-l from-[hsl(45,85%,65%)] to-[hsl(45,85%,50%)] bg-clip-text text-transparent"> مجتمع موثوق</span>
            </h1>

            <p className="text-lg md:text-xl text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed">
              مجتمع قانوني حيث يمكنك طرح أسئلتك والحصول على إجابات من محامين ومتخصصين. جميع الأسئلة مُراجعة من فريقنا لضمان الجودة.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="cta"
                size="xl"
                onClick={() => navigate("/forum/search")}
                className="w-full sm:w-auto"
              >
                تصفح الأسئلة
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={handleAskQuestionClick}
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                اطرح سؤالك
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">كيف تعمل المنصة؟</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            خطوات بسيطة للحصول على إجابة موثوقة لسؤالك القانوني
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
              <PenTool className="w-8 h-8" />
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center">1</span>
            </div>
            <h3 className="text-xl font-bold">اطرح سؤالك</h3>
            <p className="text-muted-foreground">صف سؤالك القانوني بوضوح وحدد التخصص المناسب</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 relative">
              <ShieldCheck className="w-8 h-8" />
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center">2</span>
            </div>
            <h3 className="text-xl font-bold">مراجعة الإدارة</h3>
            <p className="text-muted-foreground">يراجع فريقنا السؤال للتأكد من جودته ومناسبته للنشر</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center text-green-500 relative">
              <Users className="w-8 h-8" />
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center">3</span>
            </div>
            <h3 className="text-xl font-bold">إجابات الخبراء</h3>
            <p className="text-muted-foreground">يجيب المحامون والمتخصصون المعتمدون على سؤالك بدقة</p>
          </motion.div>
        </div>
      </section>

      {/* ── Category Strip ── */}
      <section className="container mx-auto px-4 pb-8">
        <h3 className="text-xl font-bold mb-4 text-center md:text-right">تصفح حسب التخصص</h3>
        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          {specializations.map((spec) => (
            <button
              key={spec.id}
              className="px-4 py-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-sm font-medium transition-colors"
              onClick={() => navigate(`/forum/search?specializationId=${spec.id}`)}
            >
              {spec.name}
            </button>
          ))}
        </div>
      </section>

      {/* ── Stats Bar ── */}
      {stats && (
        <section className="bg-gradient-to-r from-muted/50 to-muted/30 py-16 my-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <MessageSquare className="w-8 h-8 text-primary mx-auto mb-2" />
                <AnimatedCounter target={stats.totalQuestions} suffix="+" />
                <p className="text-muted-foreground font-medium text-sm md:text-base">سؤال مطروح</p>
              </div>
              <div className="space-y-2">
                <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                <AnimatedCounter target={stats.totalAnswers} suffix="+" />
                <p className="text-muted-foreground font-medium text-sm md:text-base">إجابة من الخبراء</p>
              </div>
              <div className="space-y-2">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <AnimatedCounter target={stats.activeUsers} suffix="+" />
                <p className="text-muted-foreground font-medium text-sm md:text-base">مستخدم نشط</p>
              </div>
              <div className="space-y-2">
                <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                <AnimatedCounter target={stats.resolvedQuestions} suffix="+" />
                <p className="text-muted-foreground font-medium text-sm md:text-base">سؤال تمت الإجابة عليه</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Questions ── */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">أحدث الأسئلة</h2>
          <Button variant="ghost" onClick={() => navigate("/forum/search")} className="gap-1 text-primary">
            عرض الكل
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <ForumPostCard key={post.id} post={post} />
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
          <HelpCircle className="w-12 h-12 mx-auto mb-4 text-secondary" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            هل لديك سؤال قانوني؟
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            انضم إلى مجتمعنا القانوني، اطرح سؤالك الآن واحصل على إجابة من المحامين المعتمدين والمتخصصين.
          </p>
          <Button
            variant="cta"
            size="xl"
            onClick={handleAskQuestionClick}
          >
            {isAuthenticated ? "اطرح سؤالك الآن" : "سجل الآن لتبدأ"}
          </Button>
        </div>
      </section>

      <ForumSubmitModal
        open={isSubmitModalOpen}
        onOpenChange={setIsSubmitModalOpen}
        onSubmit={handleQuestionSubmit}
        specializations={specializations}
      />
    </div>
  );
};

export default ForumLandingPage;
