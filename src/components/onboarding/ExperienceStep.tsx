import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Briefcase } from "lucide-react";

interface WorkExperience {
  id: string;
  jobTitle: string;
  organizationName: string;
  startYear: string;
  endYear: string;
  isCurrentJob: boolean;
  description: string;
}

interface ExperienceData {
  workExperiences: WorkExperience[];
}

interface ExperienceStepProps {
  data: ExperienceData;
  onChange: (data: ExperienceData) => void;
  onNext: () => void;
  onBack: () => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) =>
  (currentYear - i).toString(),
);

const generateId = () => Math.random().toString(36).substr(2, 9);

const ExperienceStep = ({
  data,
  onChange,
  onNext,
  onBack,
}: ExperienceStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: generateId(),
      jobTitle: "",
      organizationName: "",
      startYear: "",
      endYear: "",
      isCurrentJob: false,
      description: "",
    };
    onChange({
      ...data,
      workExperiences: [...data.workExperiences, newExperience],
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      workExperiences: data.workExperiences.filter((e) => e.id !== id),
    });
  };

  const updateExperience = (
    id: string,
    field: keyof WorkExperience,
    value: string | boolean,
  ) => {
    onChange({
      ...data,
      workExperiences: data.workExperiences.map((e) => {
        if (e.id === id) {
          const updated = { ...e, [field]: value };
          // Clear endYear if isCurrentJob is true
          if (field === "isCurrentJob" && value === true) {
            updated.endYear = "";
          }
          return updated;
        }
        return e;
      }),
    });
  };
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (data.workExperiences.length === 0) {
      newErrors.experiences = "أضف خبرة عملية واحدة على الأقل";
    } else {
      data.workExperiences.forEach((exp) => {
        if (!exp.jobTitle) newErrors[`exp_${exp.id}_jobTitle`] = "مطلوب";
        if (!exp.organizationName)
          newErrors[`exp_${exp.id}_organizationName`] = "مطلوب";
        if (!exp.startYear) newErrors[`exp_${exp.id}_startYear`] = "مطلوب";
        if (!exp.isCurrentJob && !exp.endYear)
          newErrors[`exp_${exp.id}_endYear`] = "مطلوب";
        if (!exp.description || exp.description.length < 20) {
          newErrors[`exp_${exp.id}_description`] =
            "الوصف مطلوب (20 حرف على الأقل)";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };
  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">الخبرات العملية</h2>
        <p className="text-muted-foreground mt-1">
          أضف خبراتك المهنية السابقة والحالية
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">الخبرات العملية</h3>
          </div>
          <Button
            className="cursor-pointer"
            variant="outline"
            size="sm"
            onClick={addExperience}
          >
            <Plus className="w-4 h-4 ml-1" />
            إضافة خبرة
          </Button>
        </div>
        {errors.experiences && (
          <p className="text-sm text-destructive">{errors.experiences}</p>
        )}
        {data.workExperiences.map((experience, index) => (
          <Card key={experience.id} className="border-border">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  الخبرة {index + 1}
                </span>
                {data.workExperiences.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExperience(experience.id)}
                    className="cursor-pointer text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المسمى الوظيفي *</Label>
                  <Input
                    value={experience.jobTitle}
                    onChange={(e) =>
                      updateExperience(
                        experience.id,
                        "jobTitle",
                        e.target.value,
                      )
                    }
                    placeholder="مثال: محامي أول"
                    className={
                      errors[`exp_${experience.id}_jobTitle`]
                        ? "border-destructive"
                        : ""
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>اسم المكتب / الجهة *</Label>
                  <Input
                    value={experience.organizationName}
                    onChange={(e) =>
                      updateExperience(
                        experience.id,
                        "organizationName",
                        e.target.value,
                      )
                    }
                    placeholder="اسم مكتب المحاماة أو الشركة"
                    className={
                      errors[`exp_${experience.id}_organizationName`]
                        ? "border-destructive"
                        : ""
                    }
                  />
                </div>
                <div className="space-y-3">
                  <Label>سنة البداية *</Label>
                  <Select
                    dir="rtl"
                    value={experience.startYear}
                    onValueChange={(value) =>
                      updateExperience(experience.id, "startYear", value)
                    }
                  >
                    <SelectTrigger
                      className={
                        errors[`exp_${experience.id}_startYear`]
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
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>سنة الانتهاء</Label>
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`current-${experience.id}`}
                        checked={experience.isCurrentJob}
                        onCheckedChange={(checked) =>
                          updateExperience(
                            experience.id,
                            "isCurrentJob",
                            checked,
                          )
                        }
                      />
                      <Label
                        htmlFor={`current-${experience.id}`}
                        className="text-[12px] text-muted-foreground"
                      >
                        حتى الآن
                      </Label>
                    </div>
                  </div>
                  <Select
                    dir="rtl"
                    value={experience.endYear}
                    onValueChange={(value) =>
                      updateExperience(experience.id, "endYear", value)
                    }
                    disabled={experience.isCurrentJob}
                  >
                    <SelectTrigger
                      className={
                        !experience.isCurrentJob &&
                        errors[`exp_${experience.id}_endYear`]
                          ? "cursor-pointer border-destructive"
                          : "cursor-pointer"
                      }
                    >
                      <SelectValue
                        placeholder={
                          experience.isCurrentJob ? "حتى الآن" : "اختر السنة"
                        }
                      />
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
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>وصف الدور والمسؤوليات * (100 حرف على الأقل)</Label>
                  <Textarea
                    value={experience.description}
                    onChange={(e) =>
                      updateExperience(
                        experience.id,
                        "description",
                        e.target.value,
                      )
                    }
                    placeholder="اكتب وصفاً مختصراً لدورك ومسؤولياتك في هذا المنصب..."
                    className={`min-h-[100px] ${
                      errors[`exp_${experience.id}_description`]
                        ? "border-destructive"
                        : ""
                    }`}
                  />
                  <p
                    className={`text-xs ${
                      experience.description.length < 20
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {experience.description.length}/100 حرف
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {data.workExperiences.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <Briefcase className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">لم تضف أي خبرات عملية بعد</p>
            <Button variant="link" onClick={addExperience} className="mt-2">
              إضافة خبرة
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
export default ExperienceStep;
