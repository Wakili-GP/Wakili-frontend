import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface CoverImageEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCover: string;
  onSave: (imageUrl: string) => void;
}

export function CoverImageEditModal({
  open,
  onOpenChange,
  currentCover,
  onSave,
}: CoverImageEditModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setPreviewImage(null);
    }
  }, [open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("الملف يجب أن يكون صورة");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!previewImage) return;

    onSave(previewImage);
    toast.success("تم تحديث صورة الغلاف بنجاح");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="mt-3">تعديل صورة الغلاف</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>معاينة صورة الغلاف</Label>
            <div className="w-full h-60 rounded-lg overflow-hidden border">
              <img
                src={previewImage || currentCover}
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="cover-image"
              className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-md hover:border-primary transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span>انقر لاختيار صورة</span>
            </Label>

            <Input
              id="cover-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <DialogFooter dir="ltr">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSave} disabled={!previewImage}>
            حفظ التغييرات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CoverImageEditModal;
