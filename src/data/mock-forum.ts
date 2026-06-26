import type { ForumPost, ForumComment, ForumCategory } from "@/types/forum.types";
import { FORUM_CATEGORIES } from "@/types/forum.types";

const getCategory = (slug: string): ForumCategory => {
  return FORUM_CATEGORIES.find((c) => c.slug === slug) || FORUM_CATEGORIES[0];
};

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: "f1",
    title: "هل يحق للمالك رفع الإيجار بدون إنذار مسبق؟",
    body: "أنا مستأجر لشقة منذ 3 سنوات، وفجأة طلب مني المالك زيادة الإيجار بنسبة 20% اعتباراً من الشهر القادم دون أي إنذار مسبق أو عقد جديد. هل هذا الإجراء قانوني؟ وما هي حقوقي في هذه الحالة؟",
    category: getCategory("real-estate"),
    author: {
      id: "u1",
      firstName: "أحمد",
      lastName: "محمود",
      profileImage: null,
      userType: "Client",
    },
    status: "approved",
    tags: ["إيجار", "عقارات", "زيادة الإيجار", "حقوق المستأجر"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likesCount: 15,
    commentsCount: 3,
    viewsCount: 120,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "f2",
    title: "ما هي إجراءات الحصول على الجنسية التركية عن طريق الاستثمار؟",
    body: "أفكر في شراء عقار في تركيا بغرض الحصول على الجنسية. ما هي الشروط الحالية والمبلغ المطلوب؟ وما هي الخطوات القانونية لضمان سلامة العملية؟",
    category: getCategory("immigration"),
    author: {
      id: "u2",
      firstName: "سالم",
      lastName: "العبدالله",
      profileImage: null,
      userType: "Client",
    },
    status: "approved",
    tags: ["الجنسية التركية", "الاستثمار العقاري", "هجرة"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    likesCount: 42,
    commentsCount: 5,
    viewsCount: 350,
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: "f3",
    title: "كيف أحمي علامتي التجارية من التقليد في السوق المحلي؟",
    body: "لدي مشروع ناشئ وبدأت ألاحظ ظهور منتجات تقلد علامتي التجارية بشكل كبير. لم أقم بتسجيل العلامة بعد. ما هي الخطوات التي يجب علي اتخاذها لحماية حقوقي؟",
    category: getCategory("intellectual-property"),
    author: {
      id: "u3",
      firstName: "منى",
      lastName: "سعيد",
      profileImage: "https://i.pravatar.cc/150?img=5",
      userType: "Client",
    },
    status: "approved",
    tags: ["علامة تجارية", "حماية", "ملكية فكرية", "شركات"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    likesCount: 28,
    commentsCount: 2,
    viewsCount: 210,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "f4",
    title: "حقوق الموظف عند الفصل التعسفي",
    body: "تم فصلي من العمل يوم أمس بحجة 'إعادة الهيكلة' دون سابق إنذار أو إعطائي فترة شهر الإنذار المنصوص عليها في العقد. عملت معهم لمدة 4 سنوات. ما هي مستحقاتي القانونية وكيف أطالب بها؟",
    category: getCategory("labor-law"),
    author: {
      id: "u4",
      firstName: "خالد",
      lastName: "الشهري",
      profileImage: null,
      userType: "Client",
    },
    status: "approved",
    tags: ["فصل تعسفي", "قانون العمل", "مكافأة نهاية الخدمة"],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    likesCount: 5,
    commentsCount: 1,
    viewsCount: 45,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "f5",
    title: "إجراءات تأسيس شركة ذات مسؤولية محدودة (LLC)",
    body: "أرغب في تحويل مؤسستي الفردية إلى شركة ذات مسؤولية محدودة بمشاركة شريكين آخرين. ما هي الخطوات القانونية المطلوبة؟ وما هي أفضل طريقة لتوزيع الحصص وصياغة عقد التأسيس لحماية حقوق الجميع؟",
    category: getCategory("corporate"),
    author: {
      id: "u5",
      firstName: "طارق",
      lastName: "عمر",
      profileImage: "https://i.pravatar.cc/150?img=11",
      userType: "Client",
    },
    status: "approved",
    tags: ["تأسيس شركات", "شركة ذات مسؤولية محدودة", "عقود تجارية"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    likesCount: 56,
    commentsCount: 8,
    viewsCount: 420,
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: "f6",
    title: "النفقة بعد الطلاق - من يستحقها وكم المقدار؟",
    body: "تم الطلاق بيني وبين زوجي ولدينا ثلاثة أطفال في حضانتي. أريد معرفة كيفية حساب النفقة الشهرية للأطفال ونفقة السكن، وهل يحق لي المطالبة بمصاريف المدارس الخاصة التي كانوا يرتادونها قبل الطلاق؟",
    category: getCategory("family-law"),
    author: {
      id: "u6",
      firstName: "سارة",
      lastName: "أحمد",
      profileImage: "https://i.pravatar.cc/150?img=9",
      userType: "Client",
    },
    status: "pending", // Example of a pending post
    tags: ["طلاق", "نفقة", "حضانة", "أحوال شخصية"],
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    likesCount: 0,
    commentsCount: 0,
    viewsCount: 0,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "f7",
    title: "كيف أرفع دعوى تعويض عن حادث مروري؟",
    body: "تعرضت لحادث مروري تسبب به شخص قطع الإشارة الحمراء، ونتج عن ذلك إصابات بالغة أدت إلى تعطلي عن العمل لمدة شهرين بالإضافة إلى تلف سيارتي بالكامل. شركة التأمين تماطل في دفع التعويض. كيف أرفع دعوى قانونية لضمان حقوقي؟",
    category: getCategory("criminal-law"),
    author: {
      id: "u7",
      firstName: "محمد",
      lastName: "عبدالرحمن",
      profileImage: null,
      userType: "Client",
    },
    status: "approved",
    tags: ["حوادث", "تعويض", "تأمين", "دعوى"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    likesCount: 34,
    commentsCount: 4,
    viewsCount: 280,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "f8",
    title: "صياغة عقد شراكة في تطبيق الكتروني",
    body: "لدي فكرة تطبيق وقمت بتطويره بالكامل، وهناك مستثمر يريد الدخول معي مقابل نسبة 30% مع التكفل بمصاريف التسويق والتشغيل. كيف يمكن صياغة عقد يضمن ملكيتي للفكرة والكود المصدري، ويحدد التزامات المستثمر بوضوح؟",
    category: getCategory("corporate"),
    author: {
      id: "u8",
      firstName: "يوسف",
      lastName: "كمال",
      profileImage: "https://i.pravatar.cc/150?img=33",
      userType: "Client",
    },
    status: "approved",
    tags: ["عقود", "شراكة", "تطبيقات", "استثمار"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    likesCount: 67,
    commentsCount: 6,
    viewsCount: 510,
    isLiked: true,
    isBookmarked: true,
  },
];

// Reusable lawyer author for answers
const mockLawyer: ForumComment['author'] = {
  id: "l1",
  firstName: "مروان",
  lastName: "الخطيب",
  profileImage: "https://i.pravatar.cc/150?img=60",
  userType: "Lawyer",
  specialization: "مستشار قانوني",
};

export const MOCK_FORUM_COMMENTS: Record<string, ForumComment[]> = {
  "f1": [
    {
      id: "c1",
      postId: "f1",
      parentId: null,
      body: "أهلاً بك أستاذ أحمد. لا يحق للمالك رفع الإيجار دون إنذار مسبق بمدة كافية (عادة تكون محددة في العقد أو بالقانون المحلي، وغالباً ما تكون شهرين أو ثلاثة قبل نهاية العقد). إذا لم يرسل لك إشعاراً مكتوباً ورسمياً بالزيادة، فإن العقد يتجدد تلقائياً بنفس الشروط السابقة. أنصحك بالاستمرار في دفع الإيجار المعتاد بإيداعه في حسابه أو عن طريق المحكمة إذا رفض استلامه.",
      author: mockLawyer,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
      reactions: { like: 12, helpful: 25, insightful: 3 },
      userReaction: "helpful",
      replies: [
        {
          id: "r1",
          postId: "f1",
          parentId: "c1",
          body: "شكراً جزيلاً أستاذ مروان على الرد الوافي. سأقوم بالتواصل معه كتابياً لتثبيت الموقف.",
          author: MOCK_FORUM_POSTS[0].author,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
          reactions: { like: 2, helpful: 0, insightful: 0 },
          userReaction: null,
          replies: []
        }
      ]
    },
    {
      id: "c2",
      postId: "f1",
      parentId: null,
      body: "بالإضافة لما ذكره الزميل، يجب مراجعة ما إذا كان هناك سقف قانوني لنسبة الزيادة في مدينتك. بعض المدن تحدد الزيادة القصوى بـ 5% إلى 10% كل ثلاث سنوات، لذلك نسبة 20% قد تكون غير قانونية أصلاً حتى لو تم الإنذار بها.",
      author: {
        id: "l2",
        firstName: "سمير",
        lastName: "عبدالله",
        profileImage: null,
        userType: "Lawyer",
        specialization: "محامي عقارات",
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      reactions: { like: 8, helpful: 15, insightful: 12 },
      userReaction: null,
      replies: []
    }
  ],
  "f2": [
    {
      id: "c3",
      postId: "f2",
      parentId: null,
      body: "مرحباً أستاذ سالم. حالياً، الحد الأدنى للاستثمار العقاري المؤهل للحصول على الجنسية التركية هو 400,000 دولار أمريكي. يجب الاحتفاظ بالعقار لمدة لا تقل عن 3 سنوات. من الضروري جداً التأكد من استخراج شهادة مطابقة (Uygunluk Belgesi) والتأكد من عدم وجود أي رهونات أو ديون على العقار قبل الشراء، ويفضل أن يتم تحويل المبلغ عبر البنك واستخراج إيصال الصرف (Döviz Alım Belgesi).",
      author: mockLawyer,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      reactions: { like: 30, helpful: 45, insightful: 10 },
      userReaction: "helpful",
      replies: []
    }
  ],
  "f4": [
    {
      id: "c4",
      postId: "f4",
      parentId: null,
      body: "يحق لك أخي الكريم المطالبة بـ: 1) أجر شهر الإنذار الذي لم يمنح لك. 2) مكافأة نهاية الخدمة كاملة عن 4 سنوات. 3) بدل الإجازات السنوية غير المستنفدة. 4) تعويض عن الفصل التعسفي (عادة يكون راتب شهرين إلى ثلاثة أو حسب العقد). ننصحك برفع دعوى عمالية فوراً لدى مكتب العمل.",
      author: mockLawyer,
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      reactions: { like: 15, helpful: 12, insightful: 2 },
      userReaction: "like",
      replies: []
    }
  ]
};
