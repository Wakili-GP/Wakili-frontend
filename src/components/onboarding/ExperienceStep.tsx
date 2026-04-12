import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Briefcase, Loader, Building2 } from "lucide-react";
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

const FieldGroup = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {label}
    </Label>
    {children}
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

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
    values: {
      workExperiences: defaultValues.workExperiences.length
        ? defaultValues.workExperiences
        : [EMPTY_EXPERIENCE],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperiences",
  });

  const onSubmit = (data: ExperienceFormData) => onNext(data as ExperienceData);

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-3">
          <Briefcase className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          الخبرات العملية
        </h2>
        <p className="text-sm text-muted-foreground">
          أضف خبراتك المهنية السابقة والحالية
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10">
              <Briefcase className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              سجل الخبرات
            </span>
            {fields.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {fields.length}
              </span>
            )}
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="cursor-pointer gap-1.5 text-xs h-8 px-3 rounded-lg border-dashed hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
            onClick={() => append(EMPTY_EXPERIENCE)}
          >
            <Plus className="w-3.5 h-3.5" />
            إضافة خبرة
          </Button>
        </div>

        {errors.workExperiences?.message && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-xs text-destructive">
              {errors.workExperiences.message}
            </p>
          </div>
        )}

        {fields.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-14 rounded-2xl border-2 border-dashed border-border cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
            onClick={() => append(EMPTY_EXPERIENCE)}
          >
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
              <Briefcase className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              لم تضف أي خبرات عملية بعد
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              اضغط هنا لإضافة خبرتك الأولى
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => {
              const isCurrentJob = watch(
                `workExperiences.${index}.isCurrentJob`,
              );
              const description = watch(`workExperiences.${index}.description`);
              const charCount = description?.length ?? 0;

              return (
                <div
                  key={field.id}
                  className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Accent left bar */}
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-linear-to-b from-primary/60 to-primary/20 rounded-r-full" />

                  <div className="p-5 pr-6">
                    {/* Card header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 shrink-0">
                          <span className="text-xs font-bold text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground leading-tight">
                            {watch(`workExperiences.${index}.jobTitle`) ||
                              "خبرة جديدة"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {watch(
                              `workExperiences.${index}.organizationName`,
                            ) || "—"}
                          </p>
                        </div>
                      </div>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FieldGroup
                        label="المسمى الوظيفي *"
                        error={
                          errors.workExperiences?.[index]?.jobTitle?.message
                        }
                      >
                        <div className="relative">
                          <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                          <Input
                            {...register(`workExperiences.${index}.jobTitle`)}
                            placeholder="مثال: محامي أول"
                            className={`pr-9 h-10 text-sm rounded-xl bg-muted/40 border-0 ring-1 focus:ring-2 focus:ring-primary transition-all ${
                              errors.workExperiences?.[index]?.jobTitle
                                ? "ring-destructive focus:ring-destructive"
                                : "ring-border"
                            }`}
                          />
                        </div>
                      </FieldGroup>

                      <FieldGroup
                        label="اسم المكتب / الجهة *"
                        error={
                          errors.workExperiences?.[index]?.organizationName
                            ?.message
                        }
                      >
                        <div className="relative">
                          <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                          <Input
                            {...register(
                              `workExperiences.${index}.organizationName`,
                            )}
                            placeholder="اسم مكتب المحاماة أو الشركة"
                            className={`pr-9 h-10 text-sm rounded-xl bg-muted/40 border-0 ring-1 focus:ring-2 focus:ring-primary transition-all ${
                              errors.workExperiences?.[index]?.organizationName
                                ? "ring-destructive focus:ring-destructive"
                                : "ring-border"
                            }`}
                          />
                        </div>
                      </FieldGroup>

                      <FieldGroup
                        label="سنة البداية *"
                        error={
                          errors.workExperiences?.[index]?.startYear?.message
                        }
                      >
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
                                className={`h-10 text-sm rounded-xl bg-muted/40 border-0 ring-1 cursor-pointer transition-all focus:ring-2 focus:ring-primary ${
                                  errors.workExperiences?.[index]?.startYear
                                    ? "ring-destructive"
                                    : "ring-border"
                                }`}
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
                      </FieldGroup>

                      <FieldGroup
                        label="سنة الانتهاء"
                        error={
                          !isCurrentJob
                            ? errors.workExperiences?.[index]?.endYear?.message
                            : undefined
                        }
                      >
                        <div className="space-y-2">
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
                                  className={`h-10 text-sm rounded-xl bg-muted/40 border-0 ring-1 cursor-pointer transition-all focus:ring-2 focus:ring-primary disabled:opacity-40 ${
                                    !isCurrentJob &&
                                    errors.workExperiences?.[index]?.endYear
                                      ? "ring-destructive"
                                      : "ring-border"
                                  }`}
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
                          <div className="flex items-center gap-2 px-1">
                            <Controller
                              name={`workExperiences.${index}.isCurrentJob`}
                              control={control}
                              render={({ field }) => (
                                <Switch
                                  id={`current-${index}`}
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
                              htmlFor={`current-${index}`}
                              className="text-xs text-muted-foreground cursor-pointer select-none"
                            >
                              أعمل هنا حالياً
                            </Label>
                          </div>
                        </div>
                      </FieldGroup>

                      <div className="md:col-span-2 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            وصف الدور والمسؤوليات *
                          </Label>
                          <span
                            className={`text-xs tabular-nums font-medium transition-colors ${
                              charCount === 0
                                ? "text-muted-foreground/50"
                                : charCount < 100
                                  ? "text-amber-500"
                                  : "text-primary"
                            }`}
                          >
                            {charCount} / 100
                          </span>
                        </div>
                        <Textarea
                          {...register(`workExperiences.${index}.description`)}
                          placeholder="اكتب وصفاً مختصراً لدورك ومسؤولياتك في هذا المنصب..."
                          className={`min-h-[110px] text-sm rounded-xl bg-muted/40 border-0 ring-1 focus:ring-2 focus:ring-primary resize-none transition-all ${
                            errors.workExperiences?.[index]?.description
                              ? "ring-destructive focus:ring-destructive"
                              : "ring-border"
                          }`}
                        />
                        {errors.workExperiences?.[index]?.description && (
                          <p className="text-xs text-destructive">
                            {errors.workExperiences[index].description.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer rounded-xl h-10 px-5"
            onClick={onBack}
          >
            السابق
          </Button>
          <Button
            type="submit"
            className="cursor-pointer rounded-xl h-10 px-6 gap-2"
            disabled={isLoading}
          >
            {isLoading && <Loader className="w-4 h-4 animate-spin" />}
            التالي
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExperienceStep;
