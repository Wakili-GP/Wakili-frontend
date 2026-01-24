import { useState } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Phone,
  Building2,
  DollarSign,
  Scale,
  Heart,
  ChevronDown,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";

interface Lawyer {
  id: number;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  sessionTypes: string[];
  image: string;
  yearsExperience: number;
}
const mockLawyers: Lawyer[] = [
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
    id: 3,
    name: "أ. محمد علي",
    specialty: "قانون جنائي",
    location: "الجيزة",
    rating: 4.7,
    reviewCount: 156,
    price: 600,
    sessionTypes: ["مكتب"],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    yearsExperience: 20,
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
  {
    id: 5,
    name: "أ. عمر خالد",
    specialty: "قانون مدني",
    location: "المنصورة",
    rating: 4.6,
    reviewCount: 78,
    price: 300,
    sessionTypes: ["مكتب", "هاتف"],
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    yearsExperience: 8,
  },
  {
    id: 6,
    name: "د. نورا عبدالله",
    specialty: "قانون تجاري",
    location: "القاهرة",
    rating: 4.8,
    reviewCount: 145,
    price: 550,
    sessionTypes: ["مكتب"],
    image:
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&h=200&fit=crop",
    yearsExperience: 14,
  },
  {
    id: 7,
    name: "أ. كريم مصطفى",
    specialty: "قانون الهجرة",
    location: "الإسكندرية",
    rating: 4.5,
    reviewCount: 67,
    price: 400,
    sessionTypes: ["هاتف"],
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
    yearsExperience: 6,
  },
  {
    id: 8,
    name: "د. هند السيد",
    specialty: "قانون الأسرة",
    location: "طنطا",
    rating: 4.7,
    reviewCount: 112,
    price: 380,
    sessionTypes: ["مكتب", "هاتف"],
    image:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=200&h=200&fit=crop",
    yearsExperience: 11,
  },
];

const practiceAreas = [
  "قانون تجاري",
  "قانون الأسرة",
  "قانون جنائي",
  "قانون العمل",
  "قانون مدني",
  "قانون الهجرة",
  "قانون العقارات",
  "قانون الشركات",
];

const locations = [
  "القاهرة",
  "الإسكندرية",
  "الجيزة",
  "المنصورة",
  "طنطا",
  "أسيوط",
  "الأقصر",
];
const LawyerSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [sessionTypes, setSessionTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("rating");
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem("favoriteLawyers");
    return saved ? JSON.parse(saved) : [];
  });
  const toggleSessionType = (type: string) => {
    setSessionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedArea("all");
    setSelectedLocation("all");
    setPriceRange([0, 1000]);
    setMinRating(0);
    setSessionTypes([]);
  };
  const activeFiltersCount = [
    selectedArea && selectedArea !== "all",
    selectedLocation && selectedLocation !== "all",
    priceRange[0] > 0 || priceRange[1] < 1000,
    minRating > 0,
    sessionTypes.length > 0,
  ].filter(Boolean).length;

  const areaFilter = (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
        <span className="flex items-center gap-2">
          <Scale className="w-4 h-4" />
          التخصص القانوني
        </span>
        <ChevronDown className="cursor-pointer w-4 h-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <Select value={selectedArea} onValueChange={setSelectedArea}>
          <SelectTrigger className="cursor-pointer w-full flex-row-reverse text-right">
            <SelectValue placeholder="اختر التخصص" />
          </SelectTrigger>

          <SelectContent
            align="end"
            className="w-full min-w-[--radix-select-trigger-width] text-right"
          >
            <SelectItem value="all">جميع التخصصات</SelectItem>
            {practiceAreas.map((area) => (
              <SelectItem className="cursor-pointer " key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CollapsibleContent>
    </Collapsible>
  );
  const locationFilter = (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
        <span className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          الموقع
        </span>
        <ChevronDown className="cursor-pointer w-4 h-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="cursor-pointer w-full flex-row-reverse text-right">
            <SelectValue placeholder="اختر المدينة" />
          </SelectTrigger>

          <SelectContent
            align="end"
            className="w-full min-w-[--radix-select-trigger-width] text-right"
          >
            <SelectItem value="all">جميع المدن</SelectItem>
            {locations.map((location) => (
              <SelectItem
                className="cursor-pointer "
                key={location}
                value={location}
              >
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CollapsibleContent>
    </Collapsible>
  );
  const priceFilter = (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
        <span className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          سعر الجلسة
        </span>
        <ChevronDown className="cursor-pointer w-4 h-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 space-y-4">
        <Slider
          value={priceRange}
          max={1000}
          min={0}
          step={50}
          className="w-full space-x-reverse"
          onValueChange={setPriceRange}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{priceRange[0]} ج.م</span>
          <span>{priceRange[1]} ج.م</span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
  const ratingFilter = (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
        <span className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          التقييم
        </span>
        <ChevronDown className="cursor-pointer w-4 h-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 space-y-2">
        {[4, 3, 2, 1].map((rating) => (
          <label
            key={rating}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
              minRating === rating ? "bg-primary/10" : "hover:bg-muted"
            }`}
            onClick={() => setMinRating(minRating === rating ? 0 : rating)}
          >
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                />
              ))}
            </div>
            <span className="text-sm">وأعلى</span>
          </label>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
  const sessionTypeFilter = (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
        <span className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          نوع الجلسة
        </span>
        <ChevronDown className="cursor-pointer w-4 h-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 space-y-2">
        <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
          <Checkbox
            checked={sessionTypes.includes("مكتب")}
            onCheckedChange={() => toggleSessionType("مكتب")}
          />
          <Building2 className="w-4 h-4" />
          <span>جلسة في المكتب</span>
        </label>
        <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
          <Checkbox
            checked={sessionTypes.includes("هاتف")}
            onCheckedChange={() => toggleSessionType("هاتف")}
          />
          <Phone className="w-4 h-4" />
          <span>جلسة هاتفية</span>
        </label>
      </CollapsibleContent>
    </Collapsible>
  );
  return (
    <div className="space-y-8">
      <Header />
      {/* Main Search bar */}
      <div className="relative max-w-3xl mx-auto">
        <div className="flex items-center gap-2 bg-background border-2 border-primary/20 rounded-2xl p-2 focus-within:border-primary/50 transition-all shadow-lg">
          <Search className="w-6 h-6 text-muted-foreground mr-3" />
          <Input
            type="text"
            placeholder="ابحث بالاسم أو التخصص..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-0 text-lg focus-visible:ring-0 bg-transparent"
          />
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="cursor-pointer relative"
          >
            <Filter className="w-5 h-5 ml-2" />
            الفلاتر
            {activeFiltersCount > 0 && (
              <Badge className="absolute -top-2 -left-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
      {/* Fitlers */}
      <div className="flex flex-col lg:flex-row gap-8">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="lg:w-80 shrink-0"
          >
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    تصفية النتائج
                  </h3>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="cursor-pointer"
                    >
                      <X className="w-4 h-4 ml-1" /> مسح الكل
                    </Button>
                  )}
                </div>
                {/* Practice Area Filter */}
                {areaFilter}
                {locationFilter}
                {priceFilter}
                {ratingFilter}
                {sessionTypeFilter}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Results Section */}
    </div>
  );
};
const Header = () => (
  <div className="text-center space-y-4">
    <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent leading-tight">
      ابحث عن محاميك المثالي
    </h1>
    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
      اعثر على محامين متخصصين وموثوقين حسب احتياجاتك القانونية
    </p>
  </div>
);
export default LawyerSearch;
