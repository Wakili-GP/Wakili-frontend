import { Separator } from "@/components/ui/separator";
const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Title - Two Columns */}
          <div className="col-span-2">
            <h3 className="text-2xl font-bold mb-4">وكيلي</h3>
            <p className="text-background/80 mb-4">
              منصتك القانونية الشاملة للحصول على الاستشارات والخدمات القانونية
              المتميزة
            </p>
          </div>
          {/* Services - One Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">الخدمات</h4>
            <ul className="space-y-2 text-background/80">
              <li>استشارات قانونية</li>
              <li>صياغة العقود</li>
              <li>التمثيل القانوني</li>
              <li>الوساطة والتحكيم</li>
            </ul>
          </div>
          {/* Infor */}
          <div>
            <h4 className="text-lg font-semibold mb-4">التواصل</h4>
            <ul className="space-y-2 text-background/80">
              <li>+20 1144958064</li>
              <li>info@wakili.me</li>
              <li>اكتوبر, الجيزة, جمهورية مصر العربية</li>
            </ul>
          </div>
        </div>
        <Separator className="my-8 bg-background/20" />
        <div className="text-center text-background/60">
          <p>&copy; {new Date().getFullYear()} وكيلي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
