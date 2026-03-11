import ComingSoon from "@/components/ComingSoon.tsx";

const ForumPage = () => {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">الأسئلة الشائعة</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          إجابات شاملة ودقيقة للأسئلة الأكثر شيوعاً في المجال القانوني
        </p>
      </div>

      <ComingSoon
        title="مركز الأسئلة الشائعة"
        description="نعمل على إعداد قاعدة معرفية قانونية شاملة"
        featureTitle="أسئلة وأجوبة قانونية"
        featureDescription="إجابات دقيقة ومدعومة من خبراء قانونيين"
        badgeText="قريباً"
        progress={40}
      />
    </div>
  );
};

export default ForumPage;
