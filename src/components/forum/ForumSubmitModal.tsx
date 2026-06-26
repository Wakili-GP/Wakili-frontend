import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FORUM_CATEGORIES } from "@/types/forum.types";
import type { ForumPostSubmission } from "@/types/forum.types";

interface ForumSubmitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ForumPostSubmission) => void;
}

const ForumSubmitModal = ({ open, onOpenChange, onSubmit }: ForumSubmitModalProps) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !body.trim() || !categoryId) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const tags = tagsInput
      .split("،")
      .map(t => t.split(","))
      .flat()
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onSubmit({
      title: title.trim(),
      body: body.trim(),
      categoryId,
      tags
    });

    // Reset form
    setTitle("");
    setBody("");
    setCategoryId("");
    setTagsInput("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">اطرح سؤالك القانوني</DialogTitle>
          <DialogDescription>
            شارك سؤالك بوضوح وتفصيل للحصول على أفضل إجابة من الخبراء القانونيين.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && <div className="text-sm text-destructive font-medium bg-destructive/10 p-2 rounded">{error}</div>}

          <div className="space-y-2">
            <label className="text-sm font-medium">عنوان السؤال <span className="text-destructive">*</span></label>
            <Input
              placeholder="مثال: هل يحق للمالك رفع الإيجار بدون إنذار؟"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">التخصص <span className="text-destructive">*</span></label>
            <Select value={categoryId} onValueChange={setCategoryId} dir="rtl">
              <SelectTrigger>
                <SelectValue placeholder="اختر التخصص القانوني" />
              </SelectTrigger>
              <SelectContent>
                {FORUM_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">التفاصيل <span className="text-destructive">*</span></label>
            <Textarea
              placeholder="اشرح سؤالك بالتفصيل (متى حدث، ماذا حدث، الخ...)"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[120px] text-right resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">الكلمات المفتاحية (اختياري)</label>
            <Input
              placeholder="إيجار، عقارات، محكمة... (مفصولة بفاصلة)"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="text-right"
            />
          </div>

          <div className="pt-4 border-t flex flex-col gap-3">
            <p className="text-xs text-muted-foreground text-center">
              سيتم مراجعة سؤالك من قبل الإدارة قبل نشره للحفاظ على جودة المحتوى.
            </p>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                إرسال السؤال
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForumSubmitModal;
