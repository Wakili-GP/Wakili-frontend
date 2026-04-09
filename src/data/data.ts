import lawyer_1 from "../assets/lawyer-1.jpg";
import lawyer_2 from "../assets/lawyer-2.jpg";
import lawyer_3 from "../assets/lawyer-3.jpg";
// import { type Specialization } from "@/services/specialization-services";

export interface Testimonial {
  id: string;
  clientName: string;
  clientImage?: string;
  testimonialText: string;
  rating: number;
  lawyerName?: string;
  serviceCategory?: string;
  date?: string;
}

export interface Lawyer {
  id: string;
  fullName: string;
  profileImage?: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  hourlyRate?: number;
  isVerified?: boolean;
  yearsOfExperience?: number;
  bio?: string;
}

export interface FeatureStatistic {
  id: string;
  label: string;
  value: string | number;
  description?: string;
  icon?: string;
}

export const featuredLawyers = [
  {
    id: 1,
    name: "د. أحمد سليمان",
    specialty: "قانون تجاري",
    rating: 4.9,
    reviewCount: 127,
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop",
    yearsExperience: 15,
  },
  {
    id: 2,
    name: "أ. سارة محمود",
    specialty: "قانون الأسرة",
    rating: 4.8,
    reviewCount: 89,
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop",
    yearsExperience: 10,
  },
  {
    id: 3,
    name: "أ. محمد علي",
    specialty: "قانون جنائي",
    rating: 4.7,
    reviewCount: 156,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    yearsExperience: 20,
  },
  {
    id: 4,
    name: "د. فاطمة حسن",
    specialty: "قانون العمل",
    rating: 4.9,
    reviewCount: 203,
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop",
    yearsExperience: 12,
  },
  {
    id: 5,
    name: "د. نورا عبدالله",
    specialty: "قانون تجاري",
    rating: 4.8,
    reviewCount: 145,
    image:
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&h=300&fit=crop",
    yearsExperience: 14,
  },
  {
    id: 6,
    name: "أ. سارة محمود",
    specialty: "قانون الأسرة",
    rating: 4.8,
    reviewCount: 89,
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop",
    yearsExperience: 10,
  },
];

export const testimonials = [
  {
    id: 1,
    name: "أحمد محمود",
    role: "رجل أعمال",
    quote:
      "وجدت المحامي المثالي لشركتي خلال دقائق. الخدمة ممتازة والمحامون محترفون جداً.",
    rating: 5,
    caseType: "قانون تجاري",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
  },
  {
    id: 2,
    name: "سارة علي",
    role: "موظفة",
    quote: "ساعدني المحامي في حل نزاع عمالي معقد. أنصح بشدة باستخدام المنصة.",
    rating: 5,
    caseType: "قانون العمل",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
  },
  {
    id: 3,
    name: "محمد خالد",
    role: "مستثمر عقاري",
    quote:
      "تجربة سلسة من البداية للنهاية. المحامي كان متعاوناً جداً وأنجز المهمة بكفاءة.",
    rating: 5,
    caseType: "قانون العقارات",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
  },
  {
    id: 4,
    name: "فاطمة حسن",
    role: "سيدة أعمال",
    quote: "المنصة وفرت علي الكثير من الوقت والجهد في البحث عن محامي متخصص.",
    rating: 5,
    caseType: "قانون الشركات",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop",
  },
  {
    id: 5,
    name: "عمر ياسر",
    role: "مغترب",
    quote:
      "حصلت على استشارة قانونية ممتازة لإجراءات الهجرة. شكراً لفريق وكيلك!",
    rating: 5,
    caseType: "قانون الهجرة",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop",
  },
  {
    id: 6,
    name: "نورا سمير",
    role: "أم",
    quote: "تمكنت من حل قضية الحضانة بفضل المحامي الذي وجدته عبر المنصة.",
    rating: 5,
    caseType: "قانون الأسرة",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop",
  },
];

export const specializations: Specialization[] = [
  {
    id: 10,
    name: "الأحوال الشخصية لغير المسلمين",
    description:
      "قضايا الأحوال الشخصية الخاصة بغير المسلمين وفقاً للشرائع المعتمدة.",
    isActive: false,
    createdAt: "0001-01-01T00:00:00",
    createdBy: null,
    updatedAt: null,
    updatedBy: null,
  },
  {
    id: 9,
    name: "الملكية الفكرية",
    description:
      "يشمل حقوق النشر، العلامات التجارية، براءات الاختراع، وحماية الأفكار.",
    isActive: false,
    createdAt: "0001-01-01T00:00:00",
    createdBy: null,
    updatedAt: null,
    updatedBy: null,
  },
  {
    id: 8,
    name: "قانون العقارات",
    description:
      "يشمل البيع والشراء، الإيجارات، التسجيل العقاري، والنزاعات على الملكية.",
    isActive: false,
    createdAt: "0001-01-01T00:00:00",
    createdBy: null,
    updatedAt: null,
    updatedBy: null,
  },
  {
    id: 7,
    name: "القانون الإداري",
    description:
      "ينظم العلاقة بين الأفراد والجهات الحكومية والطعن على القرارات الإدارية.",
    isActive: false,
    createdAt: "0001-01-01T00:00:00",
    createdBy: null,
    updatedAt: null,
    updatedBy: null,
  },
  {
    id: 6,
    name: "قانون الشركات",
    description:
      "يتعلق بتأسيس الشركات، إدارتها، اندماجها، وحل النزاعات بين الشركاء.",
    isActive: false,
    createdAt: "0001-01-01T00:00:00",
    createdBy: null,
    updatedAt: null,
    updatedBy: null,
  },
  {
    id: 5,
    name: "القانون التجاري",
    description: "يشمل معاملات الشركات، العقود التجارية، الإفلاس، والشراكات.",
    isActive: true,
    createdAt: "0001-01-01T00:00:00",
    createdBy: null,
    updatedAt: null,
    updatedBy: null,
  },
  {
    id: 4,
    name: "قانون العمل",
    description:
      "ينظم العلاقة بين العامل وصاحب العمل مثل الأجور، الفصل التعسفي، والتأمينات.",
    isActive: true,
    createdAt: "0001-01-01T00:00:00",
    createdBy: null,
    updatedAt: null,
    updatedBy: null,
  },
  {
    id: 3,
    name: "القانون المدني",
    description:
      "يشمل النزاعات بين الأفراد مثل العقود، التعويضات، والمسؤولية المدنية.",
    isActive: true,
    createdAt: "0001-01-01T00:00:00",
    createdBy: null,
    updatedAt: null,
    updatedBy: null,
  },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    clientName: "أحمد محمد",
    testimonialText: "خدمة رائعة وموثوقة جداً. ساعدوني في قضيتي بشكل احترافي",
    rating: 5,
    lawyerName: "المحامي علي عبدالله",
    serviceCategory: "قانون العمل",
    date: "2024-01-15",
  },
  {
    id: "2",
    clientName: "فاطمة علي",
    testimonialText: "أفضل منصة قانونية استخدمتها. الاستشارات سريعة وفعالة",
    rating: 5,
    lawyerName: "المحامية سارة محمود",
    serviceCategory: "قانون الأسرة",
    date: "2024-01-20",
  },
  {
    id: "3",
    clientName: "محمد حسن",
    testimonialText: "تجربة ممتازة من البداية. المحامون محترفون جداً",
    rating: 4,
    lawyerName: "المحامي أحمد فرج",
    serviceCategory: "القانون التجاري",
    date: "2024-01-25",
  },
  {
    id: "4",
    clientName: "ليلى خالد",
    testimonialText: "منصة موثوقة جداً ونصائح قانونية قيمة",
    rating: 5,
    lawyerName: "المحامية منى إبراهيم",
    serviceCategory: "الملكية الفكرية",
    date: "2024-02-01",
  },
  {
    id: "5",
    clientName: "ياسر عطا",
    testimonialText: "الدعم رائع والمحامون خبراء في تخصصاتهم",
    rating: 5,
    lawyerName: "المحامي خالد محمد",
    serviceCategory: "قانون العقود",
    date: "2024-02-05",
  },
  {
    id: "6",
    clientName: "نور أحمد",
    testimonialText: "أنصح بشدة باستخدام وكيلي. خدمة احترافية وسريعة",
    rating: 4,
    lawyerName: "المحامي إبراهيم سالم",
    serviceCategory: "القانون الإداري",
    date: "2024-02-10",
  },
];

export const MOCK_TOP_LAWYERS: Lawyer[] = [
  {
    id: "1",
    fullName: "علي عبدالله",
    profileImage: lawyer_1,
    specialties: ["قانون العمل", "القانون التجاري"],
    rating: 4.9,
    reviewCount: 248,
    hourlyRate: 250,
    isVerified: true,
    yearsOfExperience: 15,
    bio: "محام متخصص في قانون العمل والعقود",
  },
  {
    id: "2",
    fullName: "سارة محمود",
    profileImage: lawyer_3,
    specialties: ["قانون الأسرة", "قانون الأحوال الشخصية"],
    rating: 4.8,
    reviewCount: 312,
    hourlyRate: 200,
    isVerified: true,
    yearsOfExperience: 12,
    bio: "متخصصة في قضايا الأسرة والأحوال الشخصية",
  },
  {
    id: "3",
    fullName: "أحمد فرج",
    profileImage: lawyer_2,
    specialties: ["القانون التجاري", "العقود"],
    rating: 4.7,
    reviewCount: 189,
    hourlyRate: 300,
    isVerified: true,
    yearsOfExperience: 18,
    bio: "خبير في المعاملات التجارية والعقود المعقدة",
  },
];

export const MOCK_STATISTICS: FeatureStatistic[] = [
  {
    id: "1",
    label: "محامي معتمدين",
    value: "500+",
    description: "محامي موثقين ومعتمدين",
  },
  {
    id: "2",
    label: "قضية تم حلها",
    value: "2500+",
    description: "قضايا نجح فيها عملائنا",
  },
  {
    id: "3",
    label: "رضا العملاء",
    value: "98%",
    description: "معدل رضا عملائنا",
  },
  {
    id: "4",
    label: "ساعات استشارة",
    value: "10K+",
    description: "ساعات استشارة قانونية",
  },
];

export const mockBookings = [
  {
    id: 1,
    lawyer: "د. أحمد سليمان",
    type: "استشارة قانونية",
    date: "2024-10-15",
    time: "10:00 ص",
    status: "مؤكد",
    specialty: "القانون التجاري",
  },
  {
    id: 2,
    lawyer: "أ. سارة محمود",
    type: "استشارة جنائية",
    date: "2024-10-10",
    time: "2:00 م",
    status: "مكتمل",
    specialty: "القانون الجنائي",
  },
  {
    id: 3,
    lawyer: "أ. محمد علي",
    type: "مراجعة عقد",
    date: "2026-04-20",
    time: "11:00 ص",
    status: "قيد الانتظار",
    specialty: "القانون التجاري",
  },
];

export const mockDocuments = [
  {
    id: 1,
    name: "عقد تأسيس شركة.pdf",
    uploadDate: "2024-10-01",
    size: "2.5 MB",
    type: "عقد",
  },
  {
    id: 2,
    name: "مستندات قانونية.pdf",
    uploadDate: "2024-09-28",
    size: "1.8 MB",
    type: "مستندات",
  },
  {
    id: 3,
    name: "استشارة سابقة.pdf",
    uploadDate: "2024-09-15",
    size: "890 KB",
    type: "استشارة",
  },
];

export const mockActivity = [
  {
    id: 1,
    type: "question",
    content: "ما هي إجراءات تأسيس شركة في مصر؟",
    date: "2024-10-05",
    responses: 3,
  },
  {
    id: 2,
    type: "article",
    content: "قرأت مقال: دليل القانون التجاري للشركات الناشئة",
    date: "2024-10-03",
  },
  {
    id: 3,
    type: "chatbot",
    content: "استفسار عبر الشات بوت عن الأحوال الشخصية",
    date: "2024-09-30",
  },
];

export const mockFavoriteLawyers = [
  {
    id: 1,
    name: "د. أحمد سليمان",
    specialty: "قانون تجاري",
    location: "القاهرة",
    rating: 4.9,
    reviewCount: 127,
    price: 500,
    sessionTypes: ["مكتب", "هاتف"],
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    yearsExperience: 15,
  },
  {
    id: 2,
    name: "أ. سارة محمود",
    specialty: "قانون الأسرة",
    location: "الإسكندرية",
    rating: 4.8,
    reviewCount: 89,
    price: 350,
    sessionTypes: ["مكتب", "هاتف"],
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    yearsExperience: 10,
  },
  {
    id: 4,
    name: "د. فاطمة حسن",
    specialty: "قانون العمل",
    location: "القاهرة",
    rating: 4.9,
    reviewCount: 203,
    price: 450,
    sessionTypes: ["هاتف"],
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    yearsExperience: 12,
  },
];
