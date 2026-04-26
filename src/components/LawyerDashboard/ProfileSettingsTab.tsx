import {
  Camera,
  Globe,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  User,
  DollarSign,
  Upload,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CITIES_BY_COUNTRY, DEGREE_TYPES, COUNTRIES } from "@/data/onboarding";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import lawyerSettingsServices, {
  type LawyerProfile,
  type UpdateLawyerProfilePayload,
} from "@/services/lawyerSettings-services";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/schemas/lawyerSettings.schema";

const CURRENT_YEAR = new Date().getFullYear();
const GRADUATION_YEARS = Array.from({ length: 60 }, (_, i) =>
  (CURRENT_YEAR - i).toString(),
);

type EducationRecord = {
  id: string;
  degree: string;
  field: string;
  university: string;
  year: string;
  documentName?: string;
  documentUrl?: string;
  status: "verified" | "pending";
};

type CertificateRecord = {
  id: string;
  name: string;
  issuer: string;
  year: string;
  documentName?: string;
  documentUrl?: string;
  status: "verified" | "pending";
};

type ExperienceRecord = {
  id: string;
  title: string;
  company: string;
  startYear: string;
  endYear: string;
  description: string;
  documentName?: string;
  documentUrl?: string;
  status: "verified" | "pending";
};

const LawyerProfileSettingsTab = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["lawyerProfile"],
    queryFn: () => lawyerSettingsServices.getProfile(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground text-sm">
        جاري التحميل...
      </div>
    );
  }

  if (!user) return null;

  return <ProfileForm user={user} />;
};

const ProfileForm = ({ user }: { user: LawyerProfile }) => {
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      country: user.country,
      city: user.city,
      bio: user.bio ?? "",
      summary: user.summary ?? "",
      phoneSessionPrice: user.phoneSessionPrice,
      inOfficeSessionPrice: user.inOfficeSessionPrice,
      profileImage: user.profileImage ?? "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateLawyerProfilePayload) =>
      lawyerSettingsServices.updateProfile(payload),
    onSuccess: () => {
      toast.success("تم تحديث الإعدادات بنجاح");
      queryClient.invalidateQueries({ queryKey: ["lawyerProfile"] });
      setIsEditingSettings(false);
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث الإعدادات");
    },
  });

  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [educationRecords, setEducationRecords] = useState<EducationRecord[]>([
    {
      id: "e1",
      degree: "ماجستير في القانون (LL.M.)",
      field: "حل النزاعات الدولية",
      university: "كينغز كوليج لندن",
      year: "2008",
      status: "verified",
    },
  ]);
  const [certificateRecords, setCertificateRecords] = useState<
    CertificateRecord[]
  >([
    {
      id: "c1",
      name: "محترف تحكيم معتمد",
      issuer: "رابطة المحامين الدولية (IBA)",
      year: "2012",
      status: "verified",
    },
  ]);
  const [experienceRecords, setExperienceRecords] = useState<
    ExperienceRecord[]
  >([
    {
      id: "x1",
      title: "شريك أول",
      company: "مكتب سليمان وشركاه",
      startYear: "2012",
      endYear: "حتى الآن",
      description: "قيادة قسم التحكيم الدولي",
      status: "verified",
    },
  ]);

  // ── Modal form state ──────────────────────────
  const [newEducation, setNewEducation] = useState({
    degree: "",
    university: "",
    year: "",
  });
  const [newEducationFile, setNewEducationFile] = useState<File | null>(null);

  const [newCertificate, setNewCertificate] = useState({
    name: "",
    issuer: "",
    year: "",
  });
  const [newCertificateFile, setNewCertificateFile] = useState<File | null>(
    null,
  );

  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    startYear: "",
    endYear: "",
    description: "",
  });
  const [newExperienceFile, setNewExperienceFile] = useState<File | null>(null);

  // ── Handlers ─────────────────────────────────
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setIsImageModalOpen(true);
  };

  const handleImageConfirm = () => {
    if (imageFile) {
      form.setValue("profileImage", imageFile, {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success("تم تحديث الصورة بنجاح");
    }
    setIsImageModalOpen(false);
  };

  const onProfileSubmit = (values: ProfileFormValues) => {
    const payload = { ...values };
    if (imageFile) {
      payload.profileImage = imageFile;
    } else {
      delete payload.profileImage;
    }
    updateProfileMutation.mutate(
      payload as unknown as UpdateLawyerProfilePayload,
    );
  };

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Main card ── */}
      <Card className="lg:col-span-2 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-secondary" />
            إعدادات الملف الشخصي
          </h3>
          <Button
            variant={isEditingSettings ? "default" : "outline"}
            disabled={updateProfileMutation.isPending}
            onClick={() => {
              if (isEditingSettings) {
                form.handleSubmit(onProfileSubmit)();
              } else {
                setIsEditingSettings(true);
              }
            }}
          >
            {isEditingSettings ? (
              updateProfileMutation.isPending ? (
                "جاري الحفظ..."
              ) : (
                <>
                  <Save className="w-4 h-4 ml-1" /> حفظ
                </>
              )
            ) : (
              "تعديل"
            )}
          </Button>
        </div>

        {/* Profile image */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 bg-muted/20 rounded-xl border border-dashed border-border/60 hover:border-border transition-colors">
          <div className="relative group shrink-0">
            <img
              src={imagePreview || user.profileImage || ""}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-sm"
            />
            {isEditingSettings && (
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform">
                <Camera className="w-4 h-4 text-primary-foreground" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageFileSelect}
                />
              </label>
            )}
          </div>
          <div className="text-center sm:text-right flex-1 pt-2">
            <h4 className="font-bold text-base mb-1">الصورة الشخصية</h4>
            <p className="text-xs text-muted-foreground mb-4">
              أضف صورة احترافية تظهر فيها ملامح الوجه بوضوح. الصور الاحترافية
              تزيد من ثقة العملاء بنسبة 70٪.
            </p>
            {isEditingSettings && (
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-medium border border-border bg-background rounded-lg px-4 py-2 hover:bg-muted transition-colors shadow-sm">
                <Camera className="w-3.5 h-3.5" />
                تغيير الصورة
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageFileSelect}
                />
              </label>
            )}
          </div>
        </div>

        <form
          onSubmit={form.handleSubmit(onProfileSubmit)}
          className="space-y-5"
        >
          {/* First Name & Last Name — always disabled */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">
                الاسم الأول
              </label>
              <Input
                disabled
                {...form.register("firstName")}
                placeholder="الاسم الأول"
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">
                اسم العائلة
              </label>
              <Input
                disabled
                {...form.register("lastName")}
                placeholder="اسم العائلة"
                className="bg-muted/30"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> البريد الإلكتروني
              </label>
              <Input
                disabled
                {...form.register("email")}
                placeholder="البريد الإلكتروني"
                className="bg-muted/30"
                dir="ltr"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> رقم الهاتف
              </label>
              <Input
                disabled={!isEditingSettings}
                {...form.register("phoneNumber")}
                placeholder="رقم الهاتف مع مفتاح الدولة"
                dir="ltr"
              />
              {form.formState.errors.phoneNumber && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Country & City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> الدولة
              </label>
              <Controller
                control={form.control}
                name="country"
                render={({ field }) => (
                  <Select
                    dir="rtl"
                    disabled={!isEditingSettings}
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue("city", "");
                    }}
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="اختر الدولة" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem
                          className="cursor-pointer justify-end"
                          key={c}
                          value={c}
                        >
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.country && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.country.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> المدينة
              </label>
              <Controller
                control={form.control}
                name="city"
                render={({ field }) => (
                  <Select
                    dir="rtl"
                    disabled={!isEditingSettings}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        CITIES_BY_COUNTRY[form.watch("country") || ""] || []
                      ).map((c) => (
                        <SelectItem
                          className="cursor-pointer justify-end"
                          key={c}
                          value={c}
                        >
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">
              النبذة المهنية
            </label>
            <Textarea
              disabled={!isEditingSettings}
              {...form.register("bio")}
              rows={5}
              placeholder="نبذة مهنية..."
              className="resize-none"
            />
            {isEditingSettings && (
              <p className="text-xs text-muted-foreground text-left">
                {form.watch("bio")?.length || 0} / 600 حرف
              </p>
            )}
            {form.formState.errors.bio && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.bio.message}
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">
              الملخص الاستعراضي
            </label>
            <Textarea
              disabled={!isEditingSettings}
              {...form.register("summary")}
              rows={3}
              placeholder="ملخص عنك..."
              className="resize-none"
            />
            {isEditingSettings && (
              <p className="text-xs text-muted-foreground text-left">
                {(form.watch("summary") || "").length} / 200 حرف
              </p>
            )}
            {form.formState.errors.summary && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.summary.message}
              </p>
            )}
          </div>

          {/* Prices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" /> سعر الاستشارة المكتبية
                (ج.م)
              </label>
              <Input
                disabled={!isEditingSettings}
                {...form.register("inOfficeSessionPrice", {
                  valueAsNumber: true,
                })}
                placeholder="مثال: 500"
                type="number"
              />
              {form.formState.errors.inOfficeSessionPrice && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.inOfficeSessionPrice.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> سعر الاستشارة الهاتفية (ج.م)
              </label>
              <Input
                disabled={!isEditingSettings}
                {...form.register("phoneSessionPrice", { valueAsNumber: true })}
                placeholder="مثال: 300"
                type="number"
              />
              {form.formState.errors.phoneSessionPrice && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.phoneSessionPrice.message}
                </p>
              )}
            </div>
          </div>
        </form>
      </Card>

      {/* ── Sidebar ── */}
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold">المؤهلات</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEducationModalOpen(true)}
            >
              <Plus className="w-4 h-4 ml-1" /> إضافة
            </Button>
          </div>
          <div className="space-y-2">
            {educationRecords.map((r) => (
              <div key={r.id} className="p-2 border rounded-md">
                <p className="text-sm font-medium">{r.degree}</p>
                <p className="text-xs text-muted-foreground">
                  {r.university} - {r.year}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold">الشهادات</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCertificateModalOpen(true)}
            >
              <Plus className="w-4 h-4 ml-1" /> إضافة
            </Button>
          </div>
          <div className="space-y-2">
            {certificateRecords.map((r) => (
              <div key={r.id} className="p-2 border rounded-md">
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">
                  {r.issuer} - {r.year}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold">الخبرات</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsExperienceModalOpen(true)}
            >
              <Plus className="w-4 h-4 ml-1" /> إضافة
            </Button>
          </div>
          <div className="space-y-2">
            {experienceRecords.map((r) => (
              <div key={r.id} className="p-2 border rounded-md">
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">
                  {r.company} ({r.startYear} - {r.endYear})
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-secondary" /> تغيير كلمة المرور
          </h4>
          <div className="space-y-3 mb-3">
            <Input type="password" placeholder="كلمة المرور الحالية" />
            <Input type="password" placeholder="كلمة المرور الجديدة" />
            <Input
              className="mb-5"
              type="password"
              placeholder="تأكيد كلمة المرور"
            />
            <Button
              className="w-full"
              onClick={() => toast.success("تم تحديث كلمة المرور")}
            >
              تحديث كلمة المرور
            </Button>
          </div>
        </Card>
      </div>

      {/* ─── Image Modal ─── */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent dir="rtl" className="max-w-sm">
          <DialogHeader>
            <DialogTitle>معاينة الصورة</DialogTitle>
            <DialogDescription>
              تأكد من أن الصورة واضحة وملائمة للملف المهني
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3">
              <img
                src={imagePreview ?? user.profileImage ?? ""}
                alt="preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-border shadow-md"
              />
              <p className="text-xs text-muted-foreground">
                {imagePreview ? "هذه هي صورتك الجديدة" : "الصورة الحالية"}
              </p>
            </div>
            <label className="w-full cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageFileSelect}
              />
              <span className="w-full inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted transition-colors">
                <Camera className="w-4 h-4" /> اختر صورة أخرى
              </span>
            </label>
            {imagePreview && (
              <Button className="w-full" onClick={handleImageConfirm}>
                <CheckCircle className="w-4 h-4 ml-1" /> حفظ الصورة
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Education Modal ─── */}
      <Dialog
        open={isEducationModalOpen}
        onOpenChange={setIsEducationModalOpen}
      >
        <DialogContent dir="rtl">
          <DialogHeader className="mt-4">
            <DialogTitle>إضافة مؤهل جديد</DialogTitle>
            <DialogDescription className="text-center">
              أضف بيانات مؤهلك العلمي
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Select
              dir="rtl"
              value={newEducation.degree}
              onValueChange={(value) =>
                setNewEducation((p) => ({ ...p, degree: value }))
              }
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="اختر الدرجة العلمية" />
              </SelectTrigger>
              <SelectContent>
                {DEGREE_TYPES.map((degree) => (
                  <SelectItem
                    key={degree}
                    value={degree}
                    className="justify-end cursor-pointer"
                  >
                    {degree}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="الجامعة"
              value={newEducation.university}
              onChange={(e) =>
                setNewEducation((p) => ({ ...p, university: e.target.value }))
              }
            />
            <Select
              dir="rtl"
              value={newEducation.year}
              onValueChange={(value) =>
                setNewEducation((p) => ({ ...p, year: value }))
              }
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="اختر سنة التخرج" />
              </SelectTrigger>
              <SelectContent>
                {GRADUATION_YEARS.map((year) => (
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
            <label className="block cursor-pointer rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:bg-muted/40">
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) =>
                  setNewEducationFile(e.target.files?.[0] ?? null)
                }
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-muted-foreground" />
                <p className="text-sm font-medium">رفع مستند داعم (اختياري)</p>
                <p className="text-xs text-muted-foreground">
                  PDF أو صورة للشهادة
                </p>
                {newEducationFile && (
                  <div className="mt-2 rounded-md bg-muted px-3 py-1 text-xs text-foreground">
                    {newEducationFile.name}
                  </div>
                )}
              </div>
            </label>
            <Button
              className="w-full"
              onClick={() => {
                if (
                  !newEducation.degree ||
                  !newEducation.university ||
                  !newEducation.year
                ) {
                  toast.error("يرجى تعبئة جميع حقول المؤهل");
                  return;
                }
                setEducationRecords((p) => [
                  ...p,
                  {
                    id: crypto.randomUUID(),
                    degree: newEducation.degree,
                    field: "",
                    university: newEducation.university,
                    year: newEducation.year,
                    documentName: newEducationFile?.name,
                    documentUrl: newEducationFile
                      ? URL.createObjectURL(newEducationFile)
                      : undefined,
                    status: "pending",
                  },
                ]);
                setNewEducation({ degree: "", university: "", year: "" });
                setNewEducationFile(null);
                setIsEducationModalOpen(false);
                toast.success("تمت إضافة المؤهل بنجاح");
              }}
            >
              حفظ المؤهل
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Certificate Modal ─── */}
      <Dialog
        open={isCertificateModalOpen}
        onOpenChange={setIsCertificateModalOpen}
      >
        <DialogContent dir="rtl">
          <DialogHeader className="mt-4">
            <DialogTitle>إضافة شهادة جديدة</DialogTitle>
            <DialogDescription className="text-center">
              أضف بيانات الشهادة المهنية
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="اسم الشهادة"
              value={newCertificate.name}
              onChange={(e) =>
                setNewCertificate((p) => ({ ...p, name: e.target.value }))
              }
            />
            <Input
              placeholder="الجهة المانحة"
              value={newCertificate.issuer}
              onChange={(e) =>
                setNewCertificate((p) => ({ ...p, issuer: e.target.value }))
              }
            />
            <Select
              dir="rtl"
              value={newCertificate.year}
              onValueChange={(value) =>
                setNewCertificate((p) => ({ ...p, year: value }))
              }
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="اختر سنة الحصول" />
              </SelectTrigger>
              <SelectContent>
                {GRADUATION_YEARS.map((year) => (
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
            <label className="block cursor-pointer rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:bg-muted/40">
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) =>
                  setNewCertificateFile(e.target.files?.[0] ?? null)
                }
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-muted-foreground" />
                <p className="text-sm font-medium">رفع مستند داعم (اختياري)</p>
                <p className="text-xs text-muted-foreground">
                  PDF أو صورة للشهادة
                </p>
                {newCertificateFile && (
                  <div className="mt-2 rounded-md bg-muted px-3 py-1 text-xs text-foreground">
                    {newCertificateFile.name}
                  </div>
                )}
              </div>
            </label>
            <Button
              className="w-full"
              onClick={() => {
                if (
                  !newCertificate.name ||
                  !newCertificate.issuer ||
                  !newCertificate.year
                ) {
                  toast.error("يرجى تعبئة جميع حقول الشهادة");
                  return;
                }
                setCertificateRecords((p) => [
                  ...p,
                  {
                    id: crypto.randomUUID(),
                    name: newCertificate.name,
                    issuer: newCertificate.issuer,
                    year: newCertificate.year,
                    documentName: newCertificateFile?.name,
                    documentUrl: newCertificateFile
                      ? URL.createObjectURL(newCertificateFile)
                      : undefined,
                    status: "pending",
                  },
                ]);
                setNewCertificate({ name: "", issuer: "", year: "" });
                setNewCertificateFile(null);
                setIsCertificateModalOpen(false);
                toast.success("تمت إضافة الشهادة بنجاح");
              }}
            >
              حفظ الشهادة
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Experience Modal ─── */}
      <Dialog
        open={isExperienceModalOpen}
        onOpenChange={setIsExperienceModalOpen}
      >
        <DialogContent dir="rtl">
          <DialogHeader className="mt-4">
            <DialogTitle>إضافة خبرة عملية</DialogTitle>
            <DialogDescription className="text-center">
              أضف بيانات خبرة جديدة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="المسمى الوظيفي"
              value={newExperience.title}
              onChange={(e) =>
                setNewExperience((p) => ({ ...p, title: e.target.value }))
              }
            />
            <Input
              placeholder="اسم الجهة"
              value={newExperience.company}
              onChange={(e) =>
                setNewExperience((p) => ({ ...p, company: e.target.value }))
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                dir="rtl"
                value={newExperience.startYear}
                onValueChange={(value) =>
                  setNewExperience((p) => ({ ...p, startYear: value }))
                }
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="من سنة" />
                </SelectTrigger>
                <SelectContent>
                  {GRADUATION_YEARS.map((year) => (
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
              <Select
                dir="rtl"
                value={newExperience.endYear}
                onValueChange={(value) =>
                  setNewExperience((p) => ({ ...p, endYear: value }))
                }
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="إلى سنة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="حتى الآن"
                    className="justify-end cursor-pointer"
                  >
                    حتى الآن
                  </SelectItem>
                  {GRADUATION_YEARS.map((year) => (
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
            </div>
            <Textarea
              placeholder="وصف مختصر"
              value={newExperience.description}
              onChange={(e) =>
                setNewExperience((p) => ({ ...p, description: e.target.value }))
              }
              rows={3}
            />
            <label className="block cursor-pointer rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:bg-muted/40">
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) =>
                  setNewExperienceFile(e.target.files?.[0] ?? null)
                }
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-muted-foreground" />
                <p className="text-sm font-medium">رفع مستند داعم (اختياري)</p>
                <p className="text-xs text-muted-foreground">
                  PDF أو صورة لإثبات الخبرة
                </p>
                {newExperienceFile && (
                  <div className="mt-2 rounded-md bg-muted px-3 py-1 text-xs text-foreground">
                    {newExperienceFile.name}
                  </div>
                )}
              </div>
            </label>
            <Button
              className="w-full"
              onClick={() => {
                if (
                  !newExperience.title ||
                  !newExperience.company ||
                  !newExperience.startYear
                ) {
                  toast.error("يرجى تعبئة الحقول الأساسية للخبرة");
                  return;
                }
                setExperienceRecords((p) => [
                  ...p,
                  {
                    id: crypto.randomUUID(),
                    title: newExperience.title,
                    company: newExperience.company,
                    startYear: newExperience.startYear,
                    endYear: newExperience.endYear || "حتى الآن",
                    description: newExperience.description,
                    documentName: newExperienceFile?.name,
                    documentUrl: newExperienceFile
                      ? URL.createObjectURL(newExperienceFile)
                      : undefined,
                    status: "pending",
                  },
                ]);
                setNewExperience({
                  title: "",
                  company: "",
                  startYear: "",
                  endYear: "",
                  description: "",
                });
                setNewExperienceFile(null);
                setIsExperienceModalOpen(false);
                toast.success("تمت إضافة الخبرة بنجاح");
              }}
            >
              حفظ الخبرة
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LawyerProfileSettingsTab;
