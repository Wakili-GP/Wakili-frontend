import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  FileText,
  Trash2,
  IdCard,
  Award,
  GraduationCap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DocumentUpload {
  file: string | null;
  fileName: string | null;
  status: "pending" | "uploaded";
}

interface VerificationData {
  nationalIdFront: DocumentUpload;
  nationalIdBack: DocumentUpload;
  lawyerLicense: DocumentUpload;
  educationalCertificates: DocumentUpload[];
  professionalCertificates: DocumentUpload[];
  licenseNumber: string;
  issuingAuthority: string;
  yearOfIssue: string;
}

interface VerificationStepProps {
  data: VerificationData;
  onChange: (data: VerificationData) => void;
  onNext: () => void;
  onBack: () => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) =>
  (currentYear - i).toString(),
);
const VerificationStep = ({
  data,
  onChange,
  onNext,
  onBack,
}: VerificationStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleFileUpload = (
    field: keyof VerificationData,
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (index !== undefined) {
          const arrayField = field as
            | "educationalCertificates"
            | "professionalCertificates";
          const newArray = [...data[arrayField]];
          newArray[index] = {
            file: reader.result as string,
            fileName: file.name,
            status: "uploaded",
          };
          onChange({ ...data, [field]: newArray });
        } else {
          onChange({
            ...data,
            [field]: {
              file: reader.result as string,
              fileName: file.name,
              status: "uploaded",
            },
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (field: keyof VerificationData, index?: number) => {
    if (index !== undefined) {
      const arrayField = field as
        | "educationalCertificates"
        | "professionalCertificates";
      const newArray = [...data[arrayField]];
      newArray[index] = { file: null, fileName: null, status: "pending" };
      onChange({ ...data, [field]: newArray });
    } else {
      onChange({
        ...data,
        [field]: { file: null, fileName: null, status: "pending" },
      });
    }
  };

  const addCertificateSlot = (
    field: "educationalCertificates" | "professionalCertificates",
  ) => {
    onChange({
      ...data,
      [field]: [
        ...data[field],
        { file: null, fileName: null, status: "pending" },
      ],
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.nationalIdFront.file) newErrors.nationalIdFront = "مطلوب";
    if (!data.nationalIdBack.file) newErrors.nationalIdBack = "مطلوب";
    if (!data.lawyerLicense.file) newErrors.lawyerLicense = "مطلوب";
    if (!data.licenseNumber.trim()) newErrors.licenseNumber = "مطلوب";
    if (!data.issuingAuthority.trim()) newErrors.issuingAuthority = "مطلوب";
    if (!data.yearOfIssue) newErrors.yearOfIssue = "مطلوب";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };
  const renderUploadBox = (
    label: string,
    field: keyof VerificationData,
    icon: React.ReactNode,
    index?: number,
  ) => {
    const uploadData =
      index !== undefined
        ? (data[
            field as "educationalCertificates" | "professionalCertificates"
          ][index] as DocumentUpload)
        : (data[field] as DocumentUpload);
    const hasError = errors[field];
    return (
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          {icon}
          {label}
        </Label>
        {uploadData.file ? (
          <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted">
            <CheckCircle className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">{uploadData.fileName}</p>
              <p className="text-xs text-muted-foreground">تم الرفع بنجاح</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFile(field, index)}
              className="cursor-pointer text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <label
            className={`flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
              hasError ? "border-destructive" : "border-border"
            }`}
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              اضغط لرفع ملف
              <br />
              <span className="text-xs">PDF أو صورة</span>
            </p>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => handleFileUpload(field, e, index)}
              className="hidden"
            />
          </label>
        )}
        {hasError && <p className="text-sm text-destructive">{hasError}</p>}
      </div>
    );
  };
  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          التحقق من الهوية والترخيص
        </h2>
        <p className="text-muted-foreground mt-1">
          ارفع المستندات المطلوبة للتحقق من هويتك وترخيصك المهني
        </p>
      </div>
      <Alert className="bg-amber-500/10 border-amber-500/20">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          يتم مراجعة المستندات من قبل فريق الإدارة. لن يظهر ملفك الشخصي للعملاء
          حتى تتم الموافقة على التوثيق.
        </AlertDescription>
      </Alert>
      {/* National ID */}
      <Card className="border-border">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <IdCard className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">الهوية الوطنية *</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderUploadBox(
              "الوجه الأمامي",
              "nationalIdFront",
              <FileText className="w-4 h-4" />,
            )}
            {renderUploadBox(
              "الوجه الخلفي",
              "nationalIdBack",
              <FileText className="w-4 h-4" />,
            )}
          </div>
        </CardContent>
      </Card>
      {/* Lawyer License */}
      <Card className="border-border">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">رخصة المحاماة *</h3>
          </div>

          {renderUploadBox(
            "رخصة المحاماة / كارنيه النقابة",
            "lawyerLicense",
            <FileText className="w-4 h-4" />,
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="space-y-2">
              <Label>رقم الترخيص *</Label>
              <Input
                value={data.licenseNumber}
                onChange={(e) =>
                  onChange({ ...data, licenseNumber: e.target.value })
                }
                placeholder="رقم القيد بالنقابة"
                className={errors.licenseNumber ? "border-destructive" : ""}
              />
              {errors.licenseNumber && (
                <p className="text-sm text-destructive">
                  {errors.licenseNumber}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>الجهة المصدرة *</Label>
              <Input
                value={data.issuingAuthority}
                onChange={(e) =>
                  onChange({ ...data, issuingAuthority: e.target.value })
                }
                placeholder="مثال: نقابة المحامين"
                className={errors.issuingAuthority ? "border-destructive" : ""}
              />
              {errors.issuingAuthority && (
                <p className="text-sm text-destructive">
                  {errors.issuingAuthority}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>سنة الإصدار *</Label>
              <Select
                dir="rtl"
                value={data.yearOfIssue}
                onValueChange={(value) =>
                  onChange({ ...data, yearOfIssue: value })
                }
              >
                <SelectTrigger
                  className={
                    errors.yearOfIssue
                      ? "cursor-pointer border-destructive"
                      : "cursor-pointer"
                  }
                >
                  <SelectValue placeholder="اختر السنة" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem
                      className="cursor-pointer justify-end"
                      key={year}
                      value={year}
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.yearOfIssue && (
                <p className="text-sm text-destructive">{errors.yearOfIssue}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Educational Certificates */}
      <Card className="border-border">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">
                الشهادات العلمية (اختياري)
              </h3>
            </div>
            <Button
              className="cursor-pointer"
              variant="outline"
              size="sm"
              onClick={() => addCertificateSlot("educationalCertificates")}
            >
              إضافة شهادة
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.educationalCertificates.map((_, index) =>
              renderUploadBox(
                `الشهادة ${index + 1}`,
                "educationalCertificates",
                <FileText className="w-4 h-4" />,
                index,
              ),
            )}
          </div>
        </CardContent>
      </Card>
      {/* Professional Certificates */}
      <Card className="border-border">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">
                الشهادات المهنية (اختياري)
              </h3>
            </div>
            <Button
              className="cursor-pointer"
              variant="outline"
              size="sm"
              onClick={() => addCertificateSlot("professionalCertificates")}
            >
              إضافة شهادة
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.professionalCertificates.map((_, index) =>
              renderUploadBox(
                `الشهادة ${index + 1}`,
                "professionalCertificates",
                <FileText className="w-4 h-4" />,
                index,
              ),
            )}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between pt-4">
        <Button className="cursor-pointer" variant="outline" onClick={onBack}>
          السابق
        </Button>
        <Button className="cursor-pointer" onClick={handleNext}>
          التالي
        </Button>
      </div>
    </div>
  );
};
export default VerificationStep;
