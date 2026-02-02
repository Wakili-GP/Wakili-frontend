import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileText,
  GraduationCap,
  Award,
  Briefcase,
  Plus,
  Upload,
  CheckCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
// import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  status: "verified" | "pending" | "rejected";
  uploadedAt: string;
}

interface Education {
  id: string;
  degree: string;
  field: string;
  university: string;
  year: string;
  status: "verified" | "pending";
}

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  year: string;
  documentUrl?: string;
  status: "verified" | "pending";
}

interface Experience {
  id: string;
  title: string;
  company: string;
  startYear: string;
  endYear: string;
  description: string;
  status: "verified" | "pending";
}

interface VerificationDocumentsTabProps {
  documents: Document[];
  education: Education[];
  certificates: Certificate[];
  experience: Experience[];
  licenseNumber: string;
  issuingAuthority: string;
  issueYear: string;
  onAddEducation: (edu: Omit<Education, "id" | "status">) => void;
  onAddCertificate: (cert: Omit<Certificate, "id" | "status">) => void;
  onAddExperience: (exp: Omit<Experience, "id" | "status">) => void;
}

const VerificationDocumentsTab: React.FC<VerificationDocumentsTabProps> = ({
  documents,
  education,
  certificates,
  experience,
  licenseNumber,
  issuingAuthority,
  issueYear,
  onAddEducation,
  onAddCertificate,
  onAddExperience,
}) => {
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);

  // Education form state
  const [eduDegree, setEduDegree] = useState("");
  const [eduField, setEduField] = useState("");
  const [eduUniversity, setEduUniversity] = useState("");
  const [eduYear, setEduYear] = useState("");

  // Certificate form state
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certYear, setCertYear] = useState("");
  const [certFile, setCertFile] = useState<File | null>(null);

  // Experience form state
  const [expTitle, setExpTitle] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expStartYear, setExpStartYear] = useState("");
  const [expEndYear, setExpEndYear] = useState("");
  const [expDescription, setExpDescription] = useState("");

  const handleAddEducation = () => {
    if (!eduDegree || !eduField || !eduUniversity || !eduYear) {
      //   toast.error("يرجى ملء جميع الحقول");
      return;
    }
    onAddEducation({
      degree: eduDegree,
      field: eduField,
      university: eduUniversity,
      year: eduYear,
    });
    setEduDegree("");
    setEduField("");
    setEduUniversity("");
    setEduYear("");
    setShowEducationModal(false);
    // toast.success("تمت إضافة المؤهل وسيتم مراجعته من قبل الإدارة");
  };

  const handleAddCertificate = () => {
    if (!certName || !certIssuer || !certYear) {
      //   toast.error("يرجى ملء جميع الحقول");
      return;
    }
    onAddCertificate({
      name: certName,
      issuer: certIssuer,
      year: certYear,
      documentUrl: certFile ? URL.createObjectURL(certFile) : undefined,
    });
    setCertName("");
    setCertIssuer("");
    setCertYear("");
    setCertFile(null);
    setShowCertificateModal(false);
    // toast.success("تمت إضافة الشهادة وسيتم مراجعتها من قبل الإدارة");
  };

  const handleAddExperience = () => {
    if (!expTitle || !expCompany || !expStartYear) {
      //   toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    onAddExperience({
      title: expTitle,
      company: expCompany,
      startYear: expStartYear,
      endYear: expEndYear || "حتى الآن",
      description: expDescription,
    });
    setExpTitle("");
    setExpCompany("");
    setExpStartYear("");
    setExpEndYear("");
    setExpDescription("");
    setShowExperienceModal(false);
    // toast.success("تمت إضافة الخبرة وسيتم مراجعتها من قبل الإدارة");
  };

  const StatusBadge = ({
    status,
  }: {
    status: "verified" | "pending" | "rejected";
  }) => {
    if (status === "verified") {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 ml-1" />
          موثق
        </Badge>
      );
    }
    if (status === "pending") {
      return (
        <Badge
          variant="secondary"
          className="bg-amber-100 text-amber-800 hover:bg-amber-100"
        >
          <Clock className="w-3 h-3 ml-1" />
          قيد المراجعة
        </Badge>
      );
    }
    return <Badge variant="destructive">مرفوض</Badge>;
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6" />
        <span>التحقق والمستندات</span>
      </h2>

      <div className="space-y-8">
        {/* License Information */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-4">معلومات الترخيص</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">رقم الترخيص</p>
              <p className="font-medium">{licenseNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الجهة المصدرة</p>
              <p className="font-medium">{issuingAuthority}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">سنة الإصدار</p>
              <p className="font-medium">{issueYear}</p>
            </div>
          </div>
        </div>

        {/* Uploaded Documents */}
        <div>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            المستندات المرفوعة
          </h3>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.type} • {doc.uploadedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={doc.status} />
                  <Button variant="ghost" size="sm" asChild>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              المؤهلات العلمية
            </h3>
            <Button
              className="cursor-pointer"
              size="sm"
              variant="outline"
              onClick={() => setShowEducationModal(true)}
            >
              <Plus className="w-4 h-4 ml-1" />
              إضافة مؤهل
            </Button>
          </div>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold">
                      {edu.degree} في {edu.field}
                    </p>
                    <p className="text-muted-foreground">{edu.university}</p>
                    <p className="text-sm text-muted-foreground">{edu.year}</p>
                  </div>
                  <StatusBadge status={edu.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Award className="w-5 h-5" />
              الشهادات المهنية
            </h3>
            <Button
              className="cursor-pointer"
              size="sm"
              variant="outline"
              onClick={() => setShowCertificateModal(true)}
            >
              <Plus className="w-4 h-4 ml-1" />
              إضافة شهادة
            </Button>
          </div>
          <div className="space-y-3">
            {certificates.map((cert) => (
              <div key={cert.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold">{cert.name}</p>
                    <p className="text-muted-foreground">{cert.issuer}</p>
                    <p className="text-sm text-muted-foreground">{cert.year}</p>
                  </div>
                  <StatusBadge status={cert.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              الخبرات العملية
            </h3>
            <Button
              className="cursor-pointer"
              size="sm"
              variant="outline"
              onClick={() => setShowExperienceModal(true)}
            >
              <Plus className="w-4 h-4 ml-1" />
              إضافة خبرة
            </Button>
          </div>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold">{exp.title}</p>
                    <p className="text-muted-foreground">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">
                      {exp.startYear} - {exp.endYear}
                    </p>
                    {exp.description && (
                      <p className="text-sm mt-2">{exp.description}</p>
                    )}
                  </div>
                  <StatusBadge status={exp.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Education Modal */}
      <Dialog open={showEducationModal} onOpenChange={setShowEducationModal}>
        <DialogContent dir="rtl">
          <DialogHeader className="mt-5">
            <DialogTitle>إضافة مؤهل علمي</DialogTitle>
            <DialogDescription className="text-center">
              أضف مؤهلك العلمي وسيتم مراجعته من قبل الإدارة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>نوع الشهادة</Label>
              <Input
                value={eduDegree}
                onChange={(e) => setEduDegree(e.target.value)}
                placeholder="مثال: دكتوراه، ماجستير، بكالوريوس"
              />
            </div>
            <div className="space-y-2">
              <Label>التخصص</Label>
              <Input
                value={eduField}
                onChange={(e) => setEduField(e.target.value)}
                placeholder="مثال: القانون التجاري"
              />
            </div>
            <div className="space-y-2">
              <Label>الجامعة</Label>
              <Input
                value={eduUniversity}
                onChange={(e) => setEduUniversity(e.target.value)}
                placeholder="اسم الجامعة"
              />
            </div>
            <div className="space-y-2">
              <Label>سنة التخرج</Label>
              <Input
                value={eduYear}
                onChange={(e) => setEduYear(e.target.value)}
                placeholder="مثال: 2020"
              />
            </div>
            <Button
              onClick={handleAddEducation}
              className="w-full cursor-pointer"
            >
              إضافة المؤهل
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Certificate Modal */}
      <Dialog
        open={showCertificateModal}
        onOpenChange={setShowCertificateModal}
      >
        <DialogContent dir="rtl">
          <DialogHeader className="mt-4">
            <DialogTitle>إضافة شهادة مهنية</DialogTitle>
            <DialogDescription className="text-center">
              أضف شهادتك المهنية وسيتم مراجعتها من قبل الإدارة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>اسم الشهادة</Label>
              <Input
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                placeholder="مثال: شهادة التحكيم التجاري الدولي"
              />
            </div>
            <div className="space-y-2">
              <Label>الجهة المانحة</Label>
              <Input
                value={certIssuer}
                onChange={(e) => setCertIssuer(e.target.value)}
                placeholder="اسم الجهة المانحة"
              />
            </div>
            <div className="space-y-2">
              <Label>سنة الحصول</Label>
              <Input
                value={certYear}
                onChange={(e) => setCertYear(e.target.value)}
                placeholder="مثال: 2020"
              />
            </div>
            <div className="space-y-2">
              <Label>رفع الشهادة (اختياري)</Label>
              <Input
                className="cursor-pointer"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setCertFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button
              onClick={handleAddCertificate}
              className="w-full cursor-pointer"
            >
              إضافة الشهادة
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Experience Modal */}
      <Dialog open={showExperienceModal} onOpenChange={setShowExperienceModal}>
        <DialogContent dir="rtl">
          <DialogHeader className="mt-4">
            <DialogTitle>إضافة خبرة عملية</DialogTitle>
            <DialogDescription className="text-center">
              أضف خبرتك العملية وسيتم مراجعتها من قبل الإدارة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>المسمى الوظيفي</Label>
              <Input
                value={expTitle}
                onChange={(e) => setExpTitle(e.target.value)}
                placeholder="مثال: محامي أول"
              />
            </div>
            <div className="space-y-2">
              <Label>اسم المكتب / الشركة</Label>
              <Input
                value={expCompany}
                onChange={(e) => setExpCompany(e.target.value)}
                placeholder="اسم المكتب أو الشركة"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>سنة البداية</Label>
                <Input
                  value={expStartYear}
                  onChange={(e) => setExpStartYear(e.target.value)}
                  placeholder="مثال: 2015"
                />
              </div>
              <div className="space-y-2">
                <Label>سنة النهاية</Label>
                <Input
                  value={expEndYear}
                  onChange={(e) => setExpEndYear(e.target.value)}
                  placeholder="اتركه فارغاً إذا لا زلت تعمل"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>الوصف (اختياري)</Label>
              <Input
                value={expDescription}
                onChange={(e) => setExpDescription(e.target.value)}
                placeholder="وصف مختصر للمسؤوليات"
              />
            </div>
            <Button
              onClick={handleAddExperience}
              className="w-full cursor-pointer"
            >
              إضافة الخبرة
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VerificationDocumentsTab;
