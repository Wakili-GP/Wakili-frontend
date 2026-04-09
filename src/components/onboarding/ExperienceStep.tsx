import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Plus, Trash2, Briefcase, Loader } from "lucide-react";
import { type ExperienceData } from "@/services/onboarding-services";
import {
  experienceSchema,
  type ExperienceFormData,
} from "@/schemas/onboarding.schemas";

import { YEARS } from "@/data/onboarding";

const EMPTY_EXPERIENCE = {
  jobTitle: "",
  organizationName: "",
  startYear: "",
  endYear: "",
  isCurrentJob: false,
  description: "",
};

interface ExperienceStepProps {
  defaultValues: ExperienceData;
  onNext: (data: ExperienceData) => void;
  onBack: () => void;
  isLoading: boolean;
}

const ExperienceStep = ({
  defaultValues,
  onNext,
  onBack,
  isLoading,
}: ExperienceStepProps) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      workExperiences: defaultValues.workExperiences.length
        ? defaultValues.workExperiences
        : [EMPTY_EXPERIENCE],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperiences",
  });

  const onSubmit = (data: ExperienceFormData) => {
    onNext(data as ExperienceData);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">الخبرات العملية</h2>
        <p className="text-muted-foreground mt-1">
          أضف خبراتك المهنية السابقة والحالية
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">الخبرات العملية</h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => append(EMPTY_EXPERIENCE)}
            >
              <Plus className="w-4 h-4 ml-1" />
              إضافة خبرة
            </Button>
          </div>

          {errors.workExperiences?.message && (
            <p className="text-sm text-destructive">
              {errors.workExperiences.message}
            </p>
          )}

          {fields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <Briefcase className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">لم تضف أي خبرات عملية بعد</p>
              <Button
                type="button"
                variant="link"
                className="cursor-pointer mt-2"
                onClick={() => append(EMPTY_EXPERIENCE)}
              >
                إضافة خبرة
              </Button>
            </div>
          ) : (
            fields.map((field, index) => {
              const isCurrentJob = watch(
                `workExperiences.${index}.isCurrentJob`,
              );
              const description = watch(`workExperiences.${index}.description`);

              return (
                <Card key={field.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm font-medium text-muted-foreground">
                        الخبرة {index + 1}
                      </span>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer text-destructive hover:text-destructive"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>المسمى الوظيفي *</Label>
                        <Input
                          {...register(`workExperiences.${index}.jobTitle`)}
                          placeholder="مثال: محامي أول"
                          className={
                            errors.workExperiences?.[index]?.jobTitle
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.workExperiences?.[index]?.jobTitle && (
                          <p className="text-sm text-destructive">
                            {errors.workExperiences[index].jobTitle.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>اسم المكتب / الجهة *</Label>
                        <Input
                          {...register(
                            `workExperiences.${index}.organizationName`,
                          )}
                          placeholder="اسم مكتب المحاماة أو الشركة"
                          className={
                            errors.workExperiences?.[index]?.organizationName
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.workExperiences?.[index]?.organizationName && (
                          <p className="text-sm text-destructive">
                            {
                              errors.workExperiences[index].organizationName
                                .message
                            }
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>سنة البداية *</Label>
                        <Controller
                          name={`workExperiences.${index}.startYear`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              dir="rtl"
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                className={`cursor-pointer ${errors.workExperiences?.[index]?.startYear ? "border-destructive" : ""}`}
                              >
                                <SelectValue placeholder="اختر السنة" />
                              </SelectTrigger>
                              <SelectContent>
                                {YEARS.map((year) => (
                                  <SelectItem
                                    key={year}
                                    value={year}
                                    className="cursor-pointer justify-end"
                                  >
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.workExperiences?.[index]?.startYear && (
                          <p className="text-sm text-destructive">
                            {errors.workExperiences[index].startYear.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>سنة الانتهاء</Label>
                          <div className="flex items-center gap-2">
                            <Controller
                              name={`workExperiences.${index}.isCurrentJob`}
                              control={control}
                              render={({ field }) => (
                                <Switch
                                  id={`current-${field.name}`}
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked);
                                    if (checked)
                                      setValue(
                                        `workExperiences.${index}.endYear`,
                                        "",
                                      );
                                  }}
                                />
                              )}
                            />
                            <Label
                              htmlFor={`current-workExperiences.${index}.isCurrentJob`}
                              className="text-xs text-muted-foreground"
                            >
                              حتى الآن
                            </Label>
                          </div>
                        </div>
                        <Controller
                          name={`workExperiences.${index}.endYear`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              dir="rtl"
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isCurrentJob}
                            >
                              <SelectTrigger
                                className={`cursor-pointer ${!isCurrentJob && errors.workExperiences?.[index]?.endYear ? "border-destructive" : ""}`}
                              >
                                <SelectValue
                                  placeholder={
                                    isCurrentJob ? "حتى الآن" : "اختر السنة"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {YEARS.map((year) => (
                                  <SelectItem
                                    key={year}
                                    value={year}
                                    className="cursor-pointer justify-end"
                                  >
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {!isCurrentJob &&
                          errors.workExperiences?.[index]?.endYear && (
                            <p className="text-sm text-destructive">
                              {errors.workExperiences[index].endYear.message}
                            </p>
                          )}
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label>
                          وصف الدور والمسؤوليات * (100 حرف على الأقل)
                        </Label>
                        <Textarea
                          {...register(`workExperiences.${index}.description`)}
                          placeholder="اكتب وصفاً مختصراً لدورك ومسؤولياتك في هذا المنصب..."
                          className={`min-h-[100px] ${errors.workExperiences?.[index]?.description ? "border-destructive" : ""}`}
                        />
                        <div className="flex justify-between">
                          <p
                            className={`text-xs ${(description?.length ?? 0) < 100 ? "text-destructive" : "text-muted-foreground"}`}
                          >
                            {description?.length ?? 0}/100 حرف
                          </p>
                          {errors.workExperiences?.[index]?.description && (
                            <p className="text-sm text-destructive">
                              {
                                errors.workExperiences[index].description
                                  .message
                              }
                            </p>
                          )}
                        </div>
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

export default ExperienceStep;
