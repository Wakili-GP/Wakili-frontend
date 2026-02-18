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
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

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
      <section ref={setSectionRef} id="upload-section">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ارفع عقدك القانوني
          </h2>
          <p className="text-lg text-muted-foreground">
            قم برفع ملف العقد وسنتولى الباقي
          </p>
        </div>

        <Card className="border-2 border-dashed border-primary/30 bg-linear-to-br from-primary/5 to-muted/30 max-w-3xl mx-auto">
          <CardContent className="p-8">
            {!file ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                className={`flex flex-col items-center justify-center py-16 rounded-xl transition-all duration-300 cursor-pointer ${
                  isDragOver
                    ? "bg-primary/10 border-2 border-primary/50"
                    : "hover:bg-primary/5"
                }`}
                onClick={() =>
                  document.getElementById("contract-file-input")?.click()
                }
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                  <Upload className="w-16 h-16 text-primary relative z-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  اسحب الملف هنا أو انقر للرفع
                </h3>
                <p className="text-muted-foreground mb-4">
                  PDF, DOC, DOCX — حتى 20 ميجابايت
                </p>
                <Button
                  variant="outline"
                  className="cursor-pointer border-primary/50 hover:bg-primary/10"
                >
                  <Upload className="w-4 h-4 ml-2" />
                  اختر ملفاً
                </Button>
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
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-background/80 rounded-xl p-4 border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                    onClick={handleRemoveFile}
                    disabled={
                      uploadState === "uploading" || uploadState === "analyzing"
                    }
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {uploadState === "uploading" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>جارٍ رفع الملف...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {uploadState === "analyzing" && (
                  <div className="flex items-center justify-center gap-3 py-8">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="text-lg font-medium">
                      جارٍ تحليل العقد...
                    </span>
                  </div>
                )}

                {errorMessage && uploadState === "error" && (
                  <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                    <p className="text-destructive flex-1">{errorMessage}</p>
                    <Button variant="outline" size="sm" onClick={handleRetry}>
                      <RefreshCw className="w-4 h-4 ml-1" />
                      إعادة المحاولة
                    </Button>
                  </div>
                )}

                {uploadState === "idle" && (
                  <div className="text-center">
                    <Button
                      size="lg"
                      onClick={handleAnalyze}
                      className="cursor-pointer text-lg px-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <FileText className="w-5 h-5 ml-2" />
                      تحليل العقد
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    );
  },
);

UploadSection.displayName = "UploadSection";
export default UploadSection;
