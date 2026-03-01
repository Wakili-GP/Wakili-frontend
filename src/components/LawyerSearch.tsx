import { useState, useEffect, useRef } from "react";
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
  Users,
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
import { toast } from "@/components/ui/sonner";
import {
  lawyerSearchService,
  type Lawyer,
  type PracticeArea,
  type LocationResponse,
} from "@/services/lawyerSearch-services";
import { LawyerCardSkeleton } from "@/components/ui/skeletons";

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

const ITEMS_PER_PAGE = 8;

// Scroll to Top Button Component
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handleClick}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <motion.svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7-7m0 0L5 14m7-7v12"
            />
          </motion.svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default function LawyerSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [sessionTypes, setSessionTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoriteLawyers");
    return saved ? JSON.parse(saved) : [];
  });

  // Data fetching states
  const [practiceAreasData, setPracticeAreasData] = useState<PracticeArea[]>(
    [],
  );
  const [locationsData, setLocationsData] = useState<LocationResponse[]>([]);
  const [searchResults, setSearchResults] = useState<Lawyer[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch practice areas and locations on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [areasRes, locationsRes] = await Promise.all([
          lawyerSearchService.getPracticeAreas(),
          lawyerSearchService.getLocations(),
        ]);

        if (areasRes.success && areasRes.data) {
          setPracticeAreasData(areasRes.data);
        }
        if (locationsRes.success && locationsRes.data) {
          setLocationsData(locationsRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        toast.error("فشل تحميل البيانات");
      }
    };

    fetchInitialData();
  }, []);

  // Scroll to results when page changes
  useEffect(() => {
    if (currentPage > 1 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [currentPage]);

  // Search lawyers when filters change
  useEffect(() => {
    const searchLawyers = async () => {
      setIsLoading(true);
      try {
        const response = await lawyerSearchService.searchLawyers({
          query: searchQuery,
          practiceArea: selectedArea !== "all" ? selectedArea : undefined,
          location: selectedLocation !== "all" ? selectedLocation : undefined,
          minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
          maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
          minRating: minRating > 0 ? minRating : undefined,
          sessionTypes: sessionTypes.length > 0 ? sessionTypes : undefined,
          sortBy,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });

        if (response.success && response.data) {
          setSearchResults(response.data.data);
          setTotalItems(response.data.pagination.totalItems);
        }
      } catch (error) {
        console.error("Search failed:", error);
        toast.error("فشل البحث عن محامين");
      } finally {
        setIsLoading(false);
      }
    };

    searchLawyers();
  }, [
    searchQuery,
    selectedArea,
    selectedLocation,
    priceRange,
    minRating,
    sessionTypes,
    sortBy,
    currentPage,
  ]);

  const toggleFavorite = async (lawyerId: string) => {
    const isFavorite = favorites.includes(lawyerId);

    try {
      if (isFavorite) {
        const res = await lawyerSearchService.removeFromFavorites(lawyerId);
        if (res.success) {
          setFavorites((prev) => prev.filter((id) => id !== lawyerId));
          toast.success("تم إزالة المحامي من المفضلة");
        }
      } else {
        const res = await lawyerSearchService.addToFavorites(lawyerId);
        if (res.success) {
          setFavorites((prev) => [...prev, lawyerId]);
          toast.success("تم إضافة المحامي إلى المفضلة");
        }
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("فشل تحديث المفضلة");
    }
  };

  const toggleSessionType = (type: string) => {
    setSessionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
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

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

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
      <div
        className="relative -mx-4 -mt-8 overflow-hidden"
        style={{
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          width: "100vw",
        }}
      >
        <div className="relative min-h-[50vh] md:min-h-[65vh] flex items-center justify-center bg-linear-to-br from-primary via-primary/90 to-primary/70">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary-glow)) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(var(--secondary)) 0%, transparent 50%)`,
              }}
            />
          </div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTJ2LTZoMnptMC0xMHY2aC0ydi02aDJ6bTAtMTB2NmgtMlY4aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

          {/* Content */}
          <div className="relative z-10 text-center px-4 py-16 md:py-24 max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                ابحث عن محاميك المثالي
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                اعثر على محامين متخصصين وموثوقين حسب احتياجاتك القانونية
              </p>
            </motion.div>

            {/* Search Bar inside Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative max-w-3xl mx-auto"
            >
              <div className="flex items-center gap-2 bg-background/95 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-2 shadow-2xl focus-within:border-white/40 transition-all">
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
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-8 text-white/70 text-sm"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>500+ محامي</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-current" />
                <span>تقييم 4.8+</span>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4" />
                <span>جميع التخصصات</span>
              </div>
            </motion.div>
          </div>

          {/* Bottom Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent" />
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
              className="lg:w-80  shrink-0"
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
                        className="cursor-pointer"
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                      >
                        <X className="w-4 h-4 ml-1" />
                        مسح الكل
                      </Button>
                    )}
                  </div>

                  {/* Practice Area Filter */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger
                      dir="rtl"
                      className="cursor-pointer flex items-center justify-between w-full py-2 font-semibold"
                    >
                      <span className="flex items-center gap-2">
                        <Scale className="w-4 h-4" />
                        التخصص القانوني
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <Select
                        value={selectedArea}
                        onValueChange={(value) => {
                          setSelectedArea(value);
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger dir="rtl" className="cursor-pointer">
                          <SelectValue placeholder="اختر التخصص" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem className="cursor-pointer" value="all">
                            جميع التخصصات
                          </SelectItem>
                          {practiceAreasData.length > 0
                            ? practiceAreasData.map((area) => (
                                <SelectItem
                                  className="cursor-pointer"
                                  key={area.id}
                                  value={area.name}
                                >
                                  {area.name}
                                </SelectItem>
                              ))
                            : practiceAreas.map((area) => (
                                <SelectItem
                                  className="cursor-pointer"
                                  key={area}
                                  value={area}
                                >
                                  {area}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Location Filter */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold cursor-pointer">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        الموقع
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <Select
                        value={selectedLocation}
                        onValueChange={(value) => {
                          setSelectedLocation(value);
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger dir="rtl" className="cursor-pointer">
                          <SelectValue placeholder="اختر المدينة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem className="cursor-pointer" value="all">
                            جميع المدن
                          </SelectItem>
                          {locationsData.length > 0
                            ? locationsData.map((loc) => (
                                <SelectItem
                                  className="cursor-pointer"
                                  key={loc.id}
                                  value={loc.city}
                                >
                                  {loc.name}
                                </SelectItem>
                              ))
                            : locations.map((loc) => (
                                <SelectItem
                                  className="cursor-pointer"
                                  key={loc}
                                  value={loc}
                                >
                                  {loc}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Price Range Filter */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold cursor-pointer">
                      <span className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        سعر الجلسة
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 space-y-4">
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => {
                          setPriceRange(value);
                          setCurrentPage(1);
                        }}
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
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold cursor-pointer">
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
                          onClick={() => {
                            setMinRating(minRating === rating ? 0 : rating);
                            setCurrentPage(1);
                          }}
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
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold cursor-pointer">
                      <span className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        نوع الجلسة
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2 space-y-2">
                      <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                        <Checkbox
                          className="cursor-pointer"
                          checked={sessionTypes.includes("مكتب")}
                          onCheckedChange={() => toggleSessionType("مكتب")}
                        />
                        <Building2 className="w-4 h-4" />
                        <span>جلسة في المكتب</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                        <Checkbox
                          className="cursor-pointer"
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
        <div
          ref={resultsRef}
          className="flex-1 space-y-6"
          style={{ scrollBehavior: "smooth" }}
        >
          {/* Results Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-muted-foreground">
              عرض{" "}
              <span className="font-bold text-foreground">{totalItems}</span>{" "}
              محامي
            </p>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger dir="rtl" className="w-48 cursor-pointer">
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value="rating">
                  الأعلى تقييماً
                </SelectItem>
                <SelectItem className="cursor-pointer" value="reviews">
                  الأكثر تقييمات
                </SelectItem>
                <SelectItem className="cursor-pointer" value="price-low">
                  السعر: من الأقل للأعلى
                </SelectItem>
                <SelectItem className="cursor-pointer" value="price-high">
                  السعر: من الأعلى للأقل
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <LawyerCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Lawyer Cards Grid */}
          {!isLoading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="wait">
                  {searchResults.map((lawyer, index) => (
                    <motion.div
                      key={lawyer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className="
  group relative overflow-hidden
  border border-border/40
  bg-linear-to-br from-background via-background to-muted/30
  backdrop-blur-xl
  shadow-md hover:shadow-2xl
  transition-all duration-500
  hover:-translate-y-1
  hover:border-primary/40
"
                      >
                        <CardContent className="p-0">
                          <div className="flex h-full">
                            {/* Lawyer Image */}
                            <div className="relative w-32 h-40 shrink-0 overflow-hidden">
                              <img
                                src={
                                  lawyer.profileImage ||
                                  "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                                }
                                alt={`${lawyer.firstName} ${lawyer.lastName}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />

                              {/* Image gradient overlay */}
                              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-70" />

                              {/* Favorite Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(lawyer.id);
                                }}
                                className="cursor-pointer absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md bg-background/60 border border-border/40 shadow-md transition-all duration-300 hover:scale-110 hover:bg-background active:scale-95"
                              >
                                <Heart
                                  className={`
      w-5 h-5 transition-all duration-300
      ${
        favorites.includes(lawyer.id)
          ? "text-red-500 fill-red-500 scale-110 drop-shadow-sm"
          : "text-muted-foreground group-hover:text-primary"
      }
    `}
                                />
                              </button>
                            </div>

                            {/* Lawyer Info */}
                            <div className="flex-1 p-5 flex flex-col">
                              {/* Name + Specialty */}
                              <div>
                                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                  {lawyer.firstName} {lawyer.lastName}
                                </h3>

                                <Badge
                                  variant="secondary"
                                  className="mt-2 text-xs px-3 py-1 rounded-full"
                                >
                                  {lawyer.specialty}
                                </Badge>
                              </div>

                              {/* Location + Rating */}
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4 text-primary/70" />
                                  {lawyer.city}
                                </div>

                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-warning-amber fill-warning-amber" />
                                  <span className="font-semibold text-foreground">
                                    {lawyer.rating}
                                  </span>
                                  <span className="text-xs">
                                    ({lawyer.reviewCount})
                                  </span>
                                </div>
                              </div>

                              {/* Session Types + Experience */}
                              <div className="flex items-center gap-2 flex-wrap mt-3">
                                {lawyer.sessionTypes.map((type) => (
                                  <Badge
                                    key={type}
                                    variant="outline"
                                    className="text-xs px-2 py-1 rounded-full"
                                  >
                                    {type === "مكتب" ? (
                                      <Building2 className="w-3 h-3 ml-1" />
                                    ) : (
                                      <Phone className="w-3 h-3 ml-1" />
                                    )}
                                    {type}
                                  </Badge>
                                ))}

                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                  {lawyer.yearsOfExperience} سنة خبرة
                                </span>
                              </div>

                              {/* Bottom Section */}
                              <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="text-xl font-bold text-primary">
                                    {lawyer.hourlyRate} ج.م
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    لكل جلسة
                                  </span>
                                </div>

                                <Button
                                  size="sm"
                                  className="
            cursor-pointer
            rounded-full px-5
            transition-all duration-300
            group-hover:shadow-md
          "
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
              {!isLoading && searchResults.length > 0 && totalPages > 1 && (
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
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1),
                            )
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
              {!isLoading && searchResults.length > 0 && totalPages > 1 && (
                <p className="text-center text-sm text-muted-foreground">
                  صفحة {currentPage} من {totalPages}
                </p>
              )}

              {/* No Results */}
              {!isLoading && searchResults.length === 0 && (
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
            </>
          )}
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}
