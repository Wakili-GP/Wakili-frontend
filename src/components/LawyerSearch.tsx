import { useState, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";

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
  isFavorite?: boolean;
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
  {
    id: 9,
    name: "أ. ياسر إبراهيم",
    specialty: "قانون جنائي",
    location: "القاهرة",
    rating: 4.6,
    reviewCount: 95,
    price: 480,
    sessionTypes: ["مكتب"],
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    yearsExperience: 9,
  },
  {
    id: 10,
    name: "د. ليلى أحمد",
    specialty: "قانون العمل",
    location: "الجيزة",
    rating: 4.8,
    reviewCount: 178,
    price: 520,
    sessionTypes: ["مكتب", "هاتف"],
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
    yearsExperience: 13,
  },
  {
    id: 11,
    name: "أ. حسام محمد",
    specialty: "قانون مدني",
    location: "أسيوط",
    rating: 4.4,
    reviewCount: 45,
    price: 280,
    sessionTypes: ["هاتف"],
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    yearsExperience: 5,
  },
  {
    id: 12,
    name: "د. رانيا سمير",
    specialty: "قانون تجاري",
    location: "الأقصر",
    rating: 4.7,
    reviewCount: 88,
    price: 420,
    sessionTypes: ["مكتب"],
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    yearsExperience: 10,
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

const ITEMS_PER_PAGE = 6;

export default function LawyerSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [sessionTypes, setSessionTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem("favoriteLawyers");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (lawyerId: number) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(lawyerId)
        ? prev.filter((id) => id !== lawyerId)
        : [...prev, lawyerId];
      localStorage.setItem("favoriteLawyers", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const toggleSessionType = (type: string) => {
    setSessionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const filteredLawyers = mockLawyers
    .filter((lawyer) => {
      if (
        searchQuery &&
        !lawyer.name.includes(searchQuery) &&
        !lawyer.specialty.includes(searchQuery)
      )
        return false;
      if (
        selectedArea &&
        selectedArea !== "all" &&
        lawyer.specialty !== selectedArea
      )
        return false;
      if (
        selectedLocation &&
        selectedLocation !== "all" &&
        lawyer.location !== selectedLocation
      )
        return false;
      if (lawyer.price < priceRange[0] || lawyer.price > priceRange[1])
        return false;
      if (lawyer.rating < minRating) return false;
      if (
        sessionTypes.length > 0 &&
        !sessionTypes.some((t) => lawyer.sessionTypes.includes(t))
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredLawyers.length / ITEMS_PER_PAGE);
  const paginatedLawyers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLawyers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLawyers, currentPage]);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedArea("all");
    setSelectedLocation("all");
    setPriceRange([0, 1000]);
    setMinRating(0);
    setSessionTypes([]);
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    selectedArea && selectedArea !== "all",
    selectedLocation && selectedLocation !== "all",
    priceRange[0] > 0 || priceRange[1] < 1000,
    minRating > 0,
    sessionTypes.length > 0,
  ].filter(Boolean).length;

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "ellipsis", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "ellipsis", currentPage, "ellipsis", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
          ابحث عن محاميك المثالي
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          اعثر على محامين متخصصين وموثوقين حسب احتياجاتك القانونية
        </p>
      </div>

      {/* Main Search Bar */}
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
            className="relative"
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

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="lg:w-80 flex-shrink-0"
            >
              <Card className="sticky top-4">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      تصفية النتائج
                    </h3>
                    {activeFiltersCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="w-4 h-4 ml-1" />
                        مسح الكل
                      </Button>
                    )}
                  </div>

                  {/* Practice Area Filter */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
                      <span className="flex items-center gap-2">
                        <Scale className="w-4 h-4" />
                        التخصص القانوني
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <Select
                        value={selectedArea}
                        onValueChange={setSelectedArea}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر التخصص" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع التخصصات</SelectItem>
                          {practiceAreas.map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Location Filter */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        الموقع
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <Select
                        value={selectedLocation}
                        onValueChange={setSelectedLocation}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المدينة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع المدن</SelectItem>
                          {locations.map((loc) => (
                            <SelectItem key={loc} value={loc}>
                              {loc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Price Range Filter */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
                      <span className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        سعر الجلسة
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 space-y-4">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={1000}
                        min={0}
                        step={50}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{priceRange[0]} ج.م</span>
                        <span>{priceRange[1]} ج.م</span>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Rating Filter */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
                      <span className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        التقييم
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2 space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <label
                          key={rating}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                            minRating === rating
                              ? "bg-primary/10"
                              : "hover:bg-muted"
                          }`}
                          onClick={() =>
                            setMinRating(minRating === rating ? 0 : rating)
                          }
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

                  {/* Session Type Filter */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
                      <span className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        نوع الجلسة
                      </span>
                      <ChevronDown className="w-4 h-4" />
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
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <div className="flex-1 space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-muted-foreground">
              عرض{" "}
              <span className="font-bold text-foreground">
                {filteredLawyers.length}
              </span>{" "}
              محامي
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">الأعلى تقييماً</SelectItem>
                <SelectItem value="reviews">الأكثر تقييمات</SelectItem>
                <SelectItem value="price-low">
                  السعر: من الأقل للأعلى
                </SelectItem>
                <SelectItem value="price-high">
                  السعر: من الأعلى للأقل
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lawyer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="wait">
              {paginatedLawyers.map((lawyer, index) => (
                <motion.div
                  key={lawyer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/30">
                    <CardContent className="p-0">
                      <div className="flex">
                        {/* Lawyer Image */}
                        <div className="relative w-32 h-40 flex-shrink-0">
                          <img
                            src={lawyer.image}
                            alt={lawyer.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(lawyer.id);
                            }}
                            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                          >
                            <Heart
                              className={`w-5 h-5 transition-colors ${
                                favorites.includes(lawyer.id)
                                  ? "text-red-500 fill-red-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Lawyer Info */}
                        <div className="flex-1 p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                {lawyer.name}
                              </h3>
                              <Badge variant="secondary" className="mt-1">
                                {lawyer.specialty}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {lawyer.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-semibold text-foreground">
                                {lawyer.rating}
                              </span>
                              <span>({lawyer.reviewCount})</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {lawyer.sessionTypes.map((type) => (
                              <Badge
                                key={type}
                                variant="outline"
                                className="text-xs"
                              >
                                {type === "مكتب" ? (
                                  <Building2 className="w-3 h-3 ml-1" />
                                ) : (
                                  <Phone className="w-3 h-3 ml-1" />
                                )}
                                {type}
                              </Badge>
                            ))}
                            <span className="text-sm text-muted-foreground">
                              • {lawyer.yearsExperience} سنة خبرة
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="text-lg font-bold text-primary">
                              {lawyer.price} ج.م
                              <span className="text-sm font-normal text-muted-foreground">
                                /جلسة
                              </span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => navigate(`/lawyer/${lawyer.id}`)}
                            >
                              عرض الملف
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {filteredLawyers.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Page Info */}
          {filteredLawyers.length > 0 && totalPages > 1 && (
            <p className="text-center text-sm text-muted-foreground">
              صفحة {currentPage} من {totalPages}
            </p>
          )}

          {filteredLawyers.length === 0 && (
            <Card className="p-12 text-center">
              <Scale className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground mb-4">
                جرب تعديل معايير البحث للعثور على محامين مناسبين
              </p>
              <Button variant="outline" onClick={clearFilters}>
                مسح الفلاتر
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
