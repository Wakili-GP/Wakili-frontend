import { useCallback, useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  analyzeContractService,
  type AnalysisResult,
} from "@/services/ai-review.service/ai-review.service";
import { isAxiosError } from "axios";
import {
  ACCEPTED_CONTRACT_FILE_TYPES,
  contractUploadSchema,
  type ContractUploadFormValues,
} from "@/schemas/contract-review";

type UploadState = "idle" | "uploading" | "analyzing" | "done" | "error";
export type ContractAnalysis = AnalysisResult;

interface UploadSectionProps {
  onAnalysisComplete?: (
    analysis: ContractAnalysis,
    filename: string,
    analysisId: string,
  ) => void;
}

const UploadSection = ({ onAnalysisComplete }: UploadSectionProps) => {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    setValue,
    watch,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ContractUploadFormValues>({
    resolver: zodResolver(contractUploadSchema),
  });

  const file = watch("file");

  const { mutate: analyze, isPending } = useMutation({
    mutationFn: analyzeContractService.analyzeContract,
    onMutate: () => {
      setUploadState("uploading");
      setUploadProgress(30);
      setErrorMessage("");
    },
    onSuccess: (data) => {
      setUploadProgress(100);
      setUploadState("done");
      onAnalysisComplete?.(data.analysis, data.filename, data.analysis_id);
      toast.success("تم تحليل العقد بنجاح!");
    },
    onError: (error) => {
      setUploadState("error");
      setUploadProgress(0);
      const message =
        isAxiosError(error) && typeof error.response?.data === "object"
          ? "فشل تحليل العقد. تأكد من الملف وحاول مرة أخرى."
          : "حدث خطأ أثناء تحليل العقد. يرجى المحاولة مرة أخرى.";
      setErrorMessage(message);
      toast.error(message);
    },
  });

  const handleFile = useCallback(
    (f: File) => {
      setValue("file", f, { shouldValidate: true, shouldDirty: true });
      setErrorMessage("");
      clearErrors("file");
      setUploadState("idle");
    },
    [clearErrors, setValue],
  );

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
    reset();
    setUploadState("idle");
    setUploadProgress(0);
    setErrorMessage("");
  };

  const onSubmit = (values: ContractUploadFormValues) => {
    analyze({ file: values.file, history: [] });
  };

  const handleAnalyze = handleSubmit(onSubmit, (formErrors) => {
    const fileError = formErrors.file?.message;
    if (fileError) {
      setUploadState("error");
      setErrorMessage(fileError);
      toast.error(fileError);
    }
  });

  const handleRetry = () => {
    setErrorMessage("");
    setUploadState("idle");
    if (!file) {
      setError("file", {
        type: "manual",
        message: "يرجى اختيار ملف أولاً.",
      });
      return;
    }
    handleAnalyze();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (uploadState === "done") return null;

  return (
    <section id="upload-section" className="py-20">
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
                PDF / DOCX — حتى 1 ميجابايت
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/30 text-primary hover:bg-primary/5"
              >
                اختر ملفاً
              </Button>
              {errors.file?.message && (
                <p className="text-destructive text-sm mt-3">
                  {errors.file.message}
                </p>
              )}
            </motion.div>
            <input
              id="contract-file-input"
              type="file"
              accept={ACCEPTED_CONTRACT_FILE_TYPES.join(",")}
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
                disabled={isPending}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {isPending && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>جارٍ رفع الملف...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1.5" />
              </div>
            )}

            {isPending && (
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
                  disabled={isPending}
                >
                  <RefreshCw className="w-3 h-3 ml-1" />
                  إعادة
                </Button>
              </div>
            )}

            {uploadState === "idle" && (
              <Button
                onClick={handleAnalyze}
                className="w-full bg-secondary text-primary hover:bg-secondary-hover font-bold"
                size="default"
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
};

export default UploadSection;
