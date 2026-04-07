import { type Specialization } from "@/services/specialization-services";

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
