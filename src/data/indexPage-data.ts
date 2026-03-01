import lawyer_1 from "../assets/lawyer-1.jpg";
import lawyer_2 from "../assets/lawyer-2.jpg";
import lawyer_3 from "../assets/lawyer-3.jpg";
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
