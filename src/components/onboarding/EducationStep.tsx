import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Loader,
} from "lucide-react";
import { type EducationData } from "@/services/onboarding-services";
import {
  educationSchema,
  type EducationFormData,
} from "@/schemas/onboarding.schema";

import { DEGREE_TYPES } from "@/data/onboarding";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) =>
  (CURRENT_YEAR - i).toString(),
);

interface EducationStepProps {
  defaultValues: EducationData;
  onNext: (data: EducationData) => void;
  onBack: () => void;
  isLoading: boolean;
}

const EducationStep = ({
  defaultValues,
  onNext,
  onBack,
  isLoading,
}: EducationStepProps) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      academicQualifications: defaultValues.academicQualifications.length
        ? defaultValues.academicQualifications
        : [
            {
              degreeType: "",
              fieldOfStudy: "",
              universityName: "",
              graduationYear: "",
            },
          ],
      professionalCertifications:
        defaultValues.professionalCertifications ?? [],
    },
  });

  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification,
  } = useFieldArray({ control, name: "academicQualifications" });

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({ control, name: "professionalCertifications" });

  const onSubmit = (data: EducationFormData) => {
    onNext(data as EducationData);
  };

  const handleDocumentUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue(
        `professionalCertifications.${index}.document`,
        reader.result as string,
      );
    };
    reader.readAsDataURL(file);
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Academic Qualifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">المؤهلات العلمية</h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() =>
                appendQualification({
                  degreeType: "",
                  fieldOfStudy: "",
                  universityName: "",
                  graduationYear: "",
                })
              }
            >
              <Plus className="w-4 h-4 ml-1" />
              إضافة مؤهل
            </Button>
          </div>

          {errors.academicQualifications?.root && (
            <p className="text-sm text-destructive">
              {errors.academicQualifications.root.message}
            </p>
          )}
          {/* Also show the array-level min error */}
          {errors.academicQualifications?.message && (
            <p className="text-sm text-destructive">
              {errors.academicQualifications.message}
            </p>
          )}

          {qualificationFields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <GraduationCap className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                لم تضف أي مؤهلات علمية بعد
              </p>
              <Button
                type="button"
                variant="link"
                className="cursor-pointer mt-2"
                onClick={() =>
                  appendQualification({
                    degreeType: "",
                    fieldOfStudy: "",
                    universityName: "",
                    graduationYear: "",
                  })
                }
              >
                إضافة مؤهل
              </Button>
            </div>
          ) : (
            qualificationFields.map((field, index) => (
              <Card key={field.id} className="border-border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      المؤهل {index + 1}
                    </span>
                    {qualificationFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer text-destructive hover:text-destructive"
                        onClick={() => removeQualification(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>نوع الدرجة *</Label>
                      <Controller
                        name={`academicQualifications.${index}.degreeType`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            dir="rtl"
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className={`cursor-pointer ${errors.academicQualifications?.[index]?.degreeType ? "border-destructive" : ""}`}
                            >
                              <SelectValue placeholder="اختر نوع الدرجة" />
                            </SelectTrigger>
                            <SelectContent>
                              {DEGREE_TYPES.map((type) => (
                                <SelectItem
                                  key={type}
                                  value={type}
                                  className="justify-end cursor-pointer"
                                >
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.academicQualifications?.[index]?.degreeType && (
                        <p className="text-sm text-destructive">
                          {
                            errors.academicQualifications[index].degreeType
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>التخصص *</Label>
                      <Input
                        {...register(
                          `academicQualifications.${index}.fieldOfStudy`,
                        )}
                        placeholder="مثال: القانون التجاري"
                        className={
                          errors.academicQualifications?.[index]?.fieldOfStudy
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {errors.academicQualifications?.[index]?.fieldOfStudy && (
                        <p className="text-sm text-destructive">
                          {
                            errors.academicQualifications[index].fieldOfStudy
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>اسم الجامعة *</Label>
                      <Input
                        {...register(
                          `academicQualifications.${index}.universityName`,
                        )}
                        placeholder="اسم الجامعة"
                        className={
                          errors.academicQualifications?.[index]?.universityName
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {errors.academicQualifications?.[index]
                        ?.universityName && (
                        <p className="text-sm text-destructive">
                          {
                            errors.academicQualifications[index].universityName
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>سنة التخرج *</Label>
                      <Controller
                        name={`academicQualifications.${index}.graduationYear`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            dir="rtl"
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className={`cursor-pointer ${errors.academicQualifications?.[index]?.graduationYear ? "border-destructive" : ""}`}
                            >
                              <SelectValue placeholder="اختر السنة" />
                            </SelectTrigger>
                            <SelectContent>
                              {YEARS.map((year) => (
                                <SelectItem
                                  key={year}
                                  value={year}
                                  className="justify-end cursor-pointer"
                                >
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.academicQualifications?.[index]
                        ?.graduationYear && (
                        <p className="text-sm text-destructive">
                          {
                            errors.academicQualifications[index].graduationYear
                              .message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
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
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() =>
                appendCertification({
                  certificateName: "",
                  issuingOrganization: "",
                  yearObtained: "",
                  document: null,
                })
              }
            >
              <Plus className="w-4 h-4 ml-1" />
              إضافة شهادة
            </Button>
          </div>

          {certificationFields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <Award className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                لم تضف أي شهادات مهنية بعد (اختياري)
              </p>
              <Button
                type="button"
                variant="link"
                className="cursor-pointer mt-2"
                onClick={() =>
                  appendCertification({
                    certificateName: "",
                    issuingOrganization: "",
                    yearObtained: "",
                    document: null,
                  })
                }
              >
                إضافة شهادة
              </Button>
            </div>
          ) : (
            certificationFields.map((field, index) => {
              const docValue = watch(
                `professionalCertifications.${index}.document`,
              );
              return (
                <Card key={field.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm font-medium text-muted-foreground">
                        الشهادة {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer text-destructive hover:text-destructive"
                        onClick={() => removeCertification(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>اسم الشهادة *</Label>
                        <Input
                          {...register(
                            `professionalCertifications.${index}.certificateName`,
                          )}
                          placeholder="مثال: شهادة التحكيم التجاري الدولي"
                          className={
                            errors.professionalCertifications?.[index]
                              ?.certificateName
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.professionalCertifications?.[index]
                          ?.certificateName && (
                          <p className="text-sm text-destructive">
                            {
                              errors.professionalCertifications[index]
                                .certificateName.message
                            }
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>الجهة المانحة *</Label>
                        <Input
                          {...register(
                            `professionalCertifications.${index}.issuingOrganization`,
                          )}
                          placeholder="اسم المنظمة أو الجهة"
                          className={
                            errors.professionalCertifications?.[index]
                              ?.issuingOrganization
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.professionalCertifications?.[index]
                          ?.issuingOrganization && (
                          <p className="text-sm text-destructive">
                            {
                              errors.professionalCertifications[index]
                                .issuingOrganization.message
                            }
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>سنة الحصول *</Label>
                        <Controller
                          name={`professionalCertifications.${index}.yearObtained`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              dir="rtl"
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                className={`cursor-pointer ${errors.professionalCertifications?.[index]?.yearObtained ? "border-destructive" : ""}`}
                              >
                                <SelectValue placeholder="اختر السنة" />
                              </SelectTrigger>
                              <SelectContent>
                                {YEARS.map((year) => (
                                  <SelectItem
                                    key={year}
                                    value={year}
                                    className="justify-end cursor-pointer"
                                  >
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.professionalCertifications?.[index]
                          ?.yearObtained && (
                          <p className="text-sm text-destructive">
                            {
                              errors.professionalCertifications[index]
                                .yearObtained.message
                            }
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>المستند (اختياري)</Label>
                        {docValue ? (
                          <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted">
                            <FileText className="w-5 h-5 text-primary" />
                            <span className="text-sm flex-1">
                              تم رفع المستند
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setValue(
                                  `professionalCertifications.${index}.document`,
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
                              onChange={(e) => handleDocumentUpload(index, e)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={onBack}
          >
            السابق
          </Button>
          <Button type="submit" className="cursor-pointer" disabled={isLoading}>
            {isLoading && <Loader className="w-4 h-4 animate-spin ml-2" />}
            التالي
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EducationStep;
