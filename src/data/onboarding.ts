export const SESSION_TYPE_OPTIONS = [
  { id: 0, label: "استشارة هاتفية" },
  { id: 1, label: "استشارة مكتبية" },
];

export const COUNTRIES = [
  "مصر",
  "السعودية",
  "الإمارات",
  "الكويت",
  "قطر",
  "البحرين",
  "عمان",
  "الأردن",
];

export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  مصر: ["القاهرة", "الإسكندرية", "الجيزة", "المنصورة", "طنطا", "أسيوط"],
  السعودية: ["الرياض", "جدة", "مكة", "المدينة", "الدمام"],
  الإمارات: ["دبي", "أبوظبي", "الشارقة", "عجمان"],
  الكويت: ["مدينة الكويت", "حولي", "الفروانية"],
  قطر: ["الدوحة", "الوكرة", "الخور"],
  البحرين: ["المنامة", "المحرق", "الرفاع"],
  عمان: ["مسقط", "صلالة", "صحار"],
  الأردن: ["عمان", "إربد", "الزرقاء"],
};

export const PHONE_CODES = [
  { code: "+20", country: "مصر" },
  { code: "+966", country: "السعودية" },
  { code: "+971", country: "الإمارات" },
  { code: "+965", country: "الكويت" },
  { code: "+974", country: "قطر" },
  { code: "+973", country: "البحرين" },
  { code: "+968", country: "عمان" },
  { code: "+962", country: "الأردن" },
];

export const DEGREE_TYPES = [
  "دكتوراه",
  "ماجستير",
  "بكالوريوس",
  "دبلوم عالي",
  "دبلوم",
];

const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: 50 }, (_, i) =>
  (CURRENT_YEAR - i).toString(),
);
export const EMPTY_DOC = { file: null, status: "pending" as const };

export const SESSION_TYPE_LABELS: Record<number, string> = {
  0: "استشارة هاتفية",
  1: "استشارة مكتبية",
};
