import { ExternalLink, FileText, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FileUploadFieldProps {
  label?: string;
  icon?: React.ReactNode;
  file: File | string | null | undefined;
  error?: string;
  accept?: string;
  onFile: (file: File) => void;
  onRemove: () => void;
  hint?: string;
}

const FileUploadField = ({
  label,
  icon,
  file,
  error,
  accept = ".pdf,image/*",
  onFile,
  onRemove,
  hint = "PDF أو صورة — الحد الأقصى 5 ميجابايت",
}: FileUploadFieldProps) => {
  const fileName =
    file instanceof File ? file.name : file ? "المستند المرفق" : null;

  const openPreview = () => {
    if (!file) return;
    const url = file instanceof File ? URL.createObjectURL(file) : file;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <Label className="flex items-center gap-1.5 text-sm font-medium">
          {icon}
          {label}
        </Label>
      )}

      {fileName ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-muted/40 transition-colors">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{fileName}</p>
            <p className="text-xs text-muted-foreground">تم الرفع بنجاح</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-primary hover:bg-primary/10"
              onClick={openPreview}
              title="معاينة الملف"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-destructive hover:bg-destructive/10"
              onClick={onRemove}
              title="حذف الملف"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        <label
          className={`group flex flex-col items-center gap-2 px-4 py-5 rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:bg-muted/30 ${
            error ? "border-destructive/60 bg-destructive/5" : "border-border"
          }`}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
            <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">اضغط للرفع</p>
            <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
          </div>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
        </label>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default FileUploadField;
