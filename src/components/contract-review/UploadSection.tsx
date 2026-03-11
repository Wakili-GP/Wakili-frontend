import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import {
  Upload,
  FileText,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { motion } from "framer-motion";

export interface ContractAnalysis {
  summary: string;
  risks: string[];
  obligations: Record<string, string[]>;
  comparison_table: Record<string, string>[];
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const mockAnalysis: ContractAnalysis = {
  summary:
    "هذا عقد بيع سيارة بين بائع ومشتري ويتضمن شروط دفع ونقل ملكية السيارة، كما يحتوي على بنود عمل بين صاحب عمل وعامل. العقد من نوع عقد بيع سيارة ويشمل التزامات متبادلة بين الأطراف المعنية.",
  risks: [
    "خطر فسخ العقد دون إبداء أسباب",
    "خطر تحمل مصاريف السفر",
    "خطر تحمل رسوم نقل الترخيص",
    "خطر النزاع حول تفسير بنود العقد",
  ],
  obligations: {
    بائع: ["بيع السيارة للمشتري", "تسليم السيارة بحالة قانونية سليمة"],
    مشتري: ["دفع ثمن السيارة", "تحمل رسوم نقل الترخيص"],
    "صاحب عمل": ["توفير العمل المتفق عليه", "تحمل مسؤولية الأمانة المهنية"],
    عامل: ["العمل لدى صاحب العمل بمهنة محددة", "الالتزام بتعليمات العمل"],
  },
  comparison_table: [
    {
      البند: "مصاريف السفر",
      "شروط البائع": "يتحمل مصاريف السفر",
      "شروط المشتري": "يتحمل في بعض الحالات",
    },
    {
      البند: "نقل الملكية",
      "شروط البائع": "يسلم السيارة قانونيًا",
      "شروط المشتري": "يدفع رسوم نقل الترخيص",
    },
  ],
};

type UploadState = "idle" | "uploading" | "analyzing" | "done" | "error";

interface UploadSectionProps {
  onAnalysisComplete: (analysis: ContractAnalysis, filename: string) => void;
}

export interface UploadSectionRef {
  scrollIntoView: () => void;
}

const UploadSection = forwardRef<UploadSectionRef, UploadSectionProps>(
  ({ onAnalysisComplete }, ref) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadState, setUploadState] = useState<UploadState>("idle");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragOver, setIsDragOver] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [sectionRef, setSectionRef] = useState<HTMLElement | null>(null);

    useImperativeHandle(ref, () => ({
      scrollIntoView: () =>
        sectionRef?.scrollIntoView({ behavior: "smooth", block: "center" }),
    }));

    const validateFile = (f: File): string | null => {
      if (!ACCEPTED_TYPES.includes(f.type))
        return "نوع الملف غير مدعوم. يرجى رفع ملف PDF أو Word.";
      if (f.size > MAX_FILE_SIZE)
        return "حجم الملف كبير جداً. الحد الأقصى هو 20 ميجابايت.";
      return null;
    };

    const handleFile = useCallback((f: File) => {
      const error = validateFile(f);
      if (error) {
        toast.error(error);
        setErrorMessage(error);
        return;
      }
      setFile(f);
      setErrorMessage("");
      setUploadState("idle");
    }, []);

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
      },
      [handleFile],
    );

    const handleRemoveFile = () => {
      setFile(null);
      setUploadState("idle");
      setUploadProgress(0);
      setErrorMessage("");
    };

    const handleAnalyze = async () => {
      if (!file) return;
      setUploadState("uploading");
      setUploadProgress(0);
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((r) => setTimeout(r, 150));
        setUploadProgress(i);
      }
      setUploadState("analyzing");
      await new Promise((r) => setTimeout(r, 2500));
      onAnalysisComplete(mockAnalysis, file.name);
      setUploadState("done");
      toast.success("تم تحليل العقد بنجاح");
    };

    const handleRetry = () => {
      setErrorMessage("");
      setUploadState("idle");
      if (file) handleAnalyze();
    };

    const formatFileSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    if (uploadState === "done") return null;

    return (
      <section ref={setSectionRef} id="upload-section" className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-sm font-semibold text-secondary tracking-wide mb-3 block">
            ابدأ الآن
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ارفع عقدك القانوني
          </h2>
          <p className="text-muted-foreground text-lg">
            قم برفع ملف العقد وسنتولى الباقي
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          {!file ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onClick={() =>
                document.getElementById("contract-file-input")?.click()
              }
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer p-12 text-center ${
                isDragOver
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border hover:border-primary/40 hover:bg-muted/30"
              }`}
            >
              <motion.div
                animate={isDragOver ? { y: -8 } : { y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  اسحب العقد هنا أو اضغط للرفع
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  PDF / DOCX — حتى 20 ميجابايت
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/30 text-primary hover:bg-primary/5"
                >
                  اختر ملفاً
                </Button>
              </motion.div>
              <input
                id="contract-file-input"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = "";
                }}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-background p-6 space-y-5">
              {/* File info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  disabled={
                    uploadState === "uploading" || uploadState === "analyzing"
                  }
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {uploadState === "uploading" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>جارٍ رفع الملف...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-1.5" />
                </div>
              )}

              {uploadState === "analyzing" && (
                <div className="flex items-center justify-center gap-3 py-6">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <span className="text-sm font-medium text-muted-foreground">
                    جارٍ تحليل العقد...
                  </span>
                </div>
              )}

              {errorMessage && uploadState === "error" && (
                <div className="flex items-center gap-3 bg-destructive/5 border border-destructive/20 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                  <p className="text-sm text-destructive flex-1">
                    {errorMessage}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRetry}
                    className="text-xs"
                  >
                    <RefreshCw className="w-3 h-3 ml-1" />
                    إعادة
                  </Button>
                </div>
              )}

              {uploadState === "idle" && (
                <Button
                  onClick={handleAnalyze}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary-hover font-bold"
                  size="lg"
                >
                  <FileText className="w-4 h-4 ml-2" />
                  تحليل العقد
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </section>
    );
  },
);

UploadSection.displayName = "UploadSection";
export default UploadSection;
