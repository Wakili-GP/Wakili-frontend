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
  Plus,
  Trash2,
  GraduationCap,
  Award,
  Upload,
  FileText,
} from "lucide-react";
interface AcademicQualification {
  id: string;
  degreeType: string;
  fieldOfStudy: string;
  universityName: string;
  graduationYear: string;
}

interface ProfessionalCertification {
  id: string;
  certificateName: string;
  issuingOrganization: string;
  yearObtained: string;
  document: string | null;
}

interface EducationData {
  academicQualifications: AcademicQualification[];
  professionalCertifications: ProfessionalCertification[];
}

interface EducationStepProps {
  data: EducationData;
  onChange: (data: EducationData) => void;
  onNext: () => void;
  onBack: () => void;
}
const degreeTypes = ["دكتوراه", "ماجستير", "بكالوريوس", "دبلوم عالي", "دبلوم"];
const generateId = () => Math.random().toString(36).substr(2, 9);
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) =>
  (currentYear - i).toString(),
);

const EducationStep = ({
  data,
  onChange,
  onNext,
  onBack,
}: EducationStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const addQualification = () => {
    const newQualification: AcademicQualification = {
      id: generateId(),
      degreeType: "",
      fieldOfStudy: "",
      universityName: "",
      graduationYear: "",
    };
    onChange({
      ...data,
      academicQualifications: [
        ...data.academicQualifications,
        newQualification,
      ],
    });
  };
  const removeQualification = (id: string) => {
    onChange({
      ...data,
      academicQualifications: data.academicQualifications.filter(
        (q) => q.id !== id,
      ),
    });
  };

  const updateQualification = (
    id: string,
    field: keyof AcademicQualification,
    value: string,
  ) => {
    onChange({
      ...data,
      academicQualifications: data.academicQualifications.map((q) =>
        q.id === id ? { ...q, [field]: value } : q,
      ),
    });
  };

  const addCertification = () => {
    const newCertification: ProfessionalCertification = {
      id: generateId(),
      certificateName: "",
      issuingOrganization: "",
      yearObtained: "",
      document: null,
    };
    onChange({
      ...data,
      professionalCertifications: [
        ...data.professionalCertifications,
        newCertification,
      ],
    });
  };
  const removeCertification = (id: string) => {
    onChange({
      ...data,
      professionalCertifications: data.professionalCertifications.filter(
        (c) => c.id !== id,
      ),
    });
  };

  const updateCertification = (
    id: string,
    field: keyof ProfessionalCertification,
    value: string | null,
  ) => {
    onChange({
      ...data,
      professionalCertifications: data.professionalCertifications.map((c) =>
        c.id === id ? { ...c, [field]: value } : c,
      ),
    });
  };

  const handleDocumentUpload = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCertification(id, "document", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (data.academicQualifications.length === 0) {
      newErrors.qualifications = "أضف مؤهل علمي واحد على الأقل";
    } else {
      data.academicQualifications.forEach((q, index) => {
        if (!q.degreeType) newErrors[`q_${q.id}_degreeType`] = "مطلوب";
        if (!q.fieldOfStudy) newErrors[`q_${q.id}_fieldOfStudy`] = "مطلوب";
        if (!q.universityName) newErrors[`q_${q.id}_universityName`] = "مطلوب";
        if (!q.graduationYear) newErrors[`q_${q.id}_graduationYear`] = "مطلوب";
      });
    }

    data.professionalCertifications.forEach((c) => {
      if (c.certificateName && !c.issuingOrganization) {
        newErrors[`c_${c.id}_issuingOrganization`] = "مطلوب";
      }
      if (c.certificateName && !c.yearObtained) {
        newErrors[`c_${c.id}_yearObtained`] = "مطلوب";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };
  return (
    <div className="space-y-8" dir="rtl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          المؤهلات والشهادات
        </h2>
        <p className="text-muted-foreground mt-1">
          أضف مؤهلاتك العلمية وشهاداتك المهنية
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">المؤهلات العلمية</h3>{" "}
          </div>
          <Button
            className="cursor-pointer"
            variant="outline"
            size="sm"
            onClick={addQualification}
          >
            <Plus className="w-4 h-4 ml-1" />
            إضافة مؤهل
          </Button>
        </div>
        {errors.qualifications && (
          <p className="text-sm text-destructive">{errors.qualifications}</p>
        )}
        {data.academicQualifications.map((qualification, index) => (
          <Card key={qualification.id} className="border-border">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  المؤهل {index + 1}
                </span>
                {data.academicQualifications.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQualification(qualification.id)}
                    className="cursor-pointer text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نوع الدرجة *</Label>
                  <Select
                    dir="rtl"
                    value={qualification.degreeType}
                    onValueChange={(value) =>
                      updateQualification(qualification.id, "degreeType", value)
                    }
                  >
                    <SelectTrigger
                      className={
                        errors[`q_${qualification.id}_degreeType`]
                          ? "cursor-pointer border-destructive"
                          : "cursor-pointer"
                      }
                    >
                      <SelectValue placeholder="اختر نوع الدرجة" />
                    </SelectTrigger>
                    <SelectContent>
                      {degreeTypes.map((type) => (
                        <SelectItem
                          className="justify-end cursor-pointer"
                          key={type}
                          value={type}
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>التخصص *</Label>
                  <Input
                    value={qualification.fieldOfStudy}
                    onChange={(e) =>
                      updateQualification(
                        qualification.id,
                        "fieldOfStudy",
                        e.target.value,
                      )
                    }
                    placeholder="مثال: القانون التجاري"
                    className={
                      errors[`q_${qualification.id}_fieldOfStudy`]
                        ? "border-destructive"
                        : ""
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>اسم الجامعة *</Label>
                  <Input
                    value={qualification.universityName}
                    onChange={(e) =>
                      updateQualification(
                        qualification.id,
                        "universityName",
                        e.target.value,
                      )
                    }
                    placeholder="اسم الجامعة"
                    className={
                      errors[`q_${qualification.id}_universityName`]
                        ? "border-destructive"
                        : ""
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>سنة التخرج *</Label>
                  <Select
                    dir="rtl"
                    value={qualification.graduationYear}
                    onValueChange={(value) =>
                      updateQualification(
                        qualification.id,
                        "graduationYear",
                        value,
                      )
                    }
                  >
                    <SelectTrigger
                      className={
                        errors[`q_${qualification.id}_graduationYear`]
                          ? "cursor-pointer border-destructive"
                          : "cursor-pointer"
                      }
                    >
                      <SelectValue placeholder="اختر السنة" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem
                          className="justify-end cursor-pointer"
                          key={year}
                          value={year}
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {data.academicQualifications.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <GraduationCap className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">لم تضف أي مؤهلات علمية بعد</p>
            <Button
              variant="link"
              onClick={addQualification}
              className="cursor-pointer mt-2"
            >
              إضافة مؤهل
            </Button>
          </div>
        )}
      </div>
      {/* Professional Certifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">الشهادات المهنية</h3>
          </div>
          <Button
            className="cursor-pointer"
            variant="outline"
            size="sm"
            onClick={addCertification}
          >
            <Plus className="w-4 h-4 ml-1" />
            إضافة شهادة
          </Button>
        </div>
        {data.professionalCertifications.map((certification, index) => (
          <Card key={certification.id} className="border-border">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  الشهادة {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCertification(certification.id)}
                  className="cursor-pointer text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم الشهادة *</Label>
                  <Input
                    value={certification.certificateName}
                    onChange={(e) =>
                      updateCertification(
                        certification.id,
                        "certificateName",
                        e.target.value,
                      )
                    }
                    placeholder="مثال: شهادة التحكيم التجاري الدولي"
                  />
                </div>

                <div className="space-y-2">
                  <Label>الجهة المانحة *</Label>
                  <Input
                    value={certification.issuingOrganization}
                    onChange={(e) =>
                      updateCertification(
                        certification.id,
                        "issuingOrganization",
                        e.target.value,
                      )
                    }
                    placeholder="اسم المنظمة أو الجهة"
                    className={
                      errors[`c_${certification.id}_issuingOrganization`]
                        ? "border-destructive"
                        : ""
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>سنة الحصول *</Label>
                  <Select
                    dir="rtl"
                    value={certification.yearObtained}
                    onValueChange={(value) =>
                      updateCertification(
                        certification.id,
                        "yearObtained",
                        value,
                      )
                    }
                  >
                    <SelectTrigger
                      className={
                        errors[`c_${certification.id}_yearObtained`]
                          ? "cursor-pointer border-destructive"
                          : "cursor-pointer"
                      }
                    >
                      <SelectValue placeholder="اختر السنة" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem
                          className="justify-end cursor-pointer"
                          key={year}
                          value={year}
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>المستند (اختياري)</Label>
                  <div className="relative">
                    {certification.document ? (
                      <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="text-sm flex-1">تم رفع المستند</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateCertification(
                              certification.id,
                              "document",
                              null,
                            )
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          رفع ملف PDF أو صورة
                        </span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) =>
                            handleDocumentUpload(certification.id, e)
                          }
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {data.professionalCertifications.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <Award className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              لم تضف أي شهادات مهنية بعد (اختياري)
            </p>
            <Button
              variant="link"
              onClick={addCertification}
              className="cursor-pointer mt-2"
            >
              إضافة شهادة
            </Button>
          </div>
        )}
      </div>
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
export default EducationStep;
