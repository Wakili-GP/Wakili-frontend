import ComingSoon from "@/components/ComingSoon.tsx";

const ArticlesPage = () => {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          المقالات القانونية
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          مقالات قانونية متخصصة وتحليلات معمّقة
        </p>
      </div>

      <ComingSoon
        title="مكتبة المقالات القانونية"
        description="نعمل على إطلاق مكتبة مقالات قانونية عالية الجودة"
        featureTitle="مقالات وتحليلات قانونية"
        featureDescription="محتوى قانوني موثوق مكتوب من خبراء ومتخصصين"
        badgeText="قيد التحضير"
        progress={50}
      />
    </div>
  );
};

export default ArticlesPage;
