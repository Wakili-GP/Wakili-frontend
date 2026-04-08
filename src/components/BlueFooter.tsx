import { Separator } from "@/components/ui/separator";

const BlueFooter = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-3">وكيلك</h3>
            <p className="text-primary-foreground/70 text-sm">
              تقديم خبرة قانونية موثوقة عبر الحدود بنزاهة لا تتزعزع.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm tracking-wide">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-primary-foreground/70 text-sm">
              <li className="hover:text-secondary cursor-pointer transition-colors">
                البحث عن محامي
              </li>
              <li className="hover:text-secondary cursor-pointer transition-colors">
                المقالات القانونية
              </li>
              <li className="hover:text-secondary cursor-pointer transition-colors">
                مراجعة العقود بالذكاء الاصطناعي
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm tracking-wide">قانوني</h4>
            <ul className="space-y-2 text-primary-foreground/70 text-sm">
              <li className="hover:text-secondary cursor-pointer transition-colors">
                سياسة الخصوصية
              </li>
              <li className="hover:text-secondary cursor-pointer transition-colors">
                شروط الخدمة
              </li>
              <li className="hover:text-secondary cursor-pointer transition-colors">
                سياسة ملفات تعريف الارتباط
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm tracking-wide">
              اتصل بنا
            </h4>
            <div className="space-y-2 text-primary-foreground/70 text-sm">
              <p>القاهرة، مصر</p>
              <p>support@wakilak.com</p>
              <p>+20 123 456 7890</p>
            </div>
          </div>
        </div>
        <Separator className="my-8 bg-primary-foreground/20" />
        <p className="text-center text-primary-foreground/50 text-sm">
          &copy; 2024 وكيلك. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
};
export default BlueFooter;
