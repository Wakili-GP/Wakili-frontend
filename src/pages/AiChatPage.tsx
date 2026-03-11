import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Scale, Sparkles } from "lucide-react";
import EnhancedChatbot from "@/components/EnhancedChatbot.tsx";

const AiChatPage = () => {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
            <MessageCircle className="w-16 h-16 text-primary relative z-10" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          تحدث مع الذكاء الاصطناعي
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          احصل على استشارات قانونية فورية وإجابات دقيقة على أسئلتك من خلال
          مساعدنا الذكي المتطور
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center hover:shadow-lg transition-all duration-300 border-primary/20">
            <CardHeader>
              <Sparkles className="w-8 h-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">إجابات فورية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                احصل على إجابات سريعة ودقيقة لاستفساراتك القانونية
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 border-primary/20">
            <CardHeader>
              <Scale className="w-8 h-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">خبرة قانونية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                مدرب على أحدث القوانين والأنظمة في العالم العربي
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 border-primary/20">
            <CardHeader>
              <MessageCircle className="w-8 h-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">متاح دائماً</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                خدمة متاحة 24/7 لمساعدتك في أي وقت
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-linear-to-r from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
          <EnhancedChatbot />
        </div>
      </div>
    </div>
  );
};

export default AiChatPage;
