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
  ChevronLeft,
  X,
  Users,
  ArrowRight,
  Calendar,
  BadgeCheck,
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
// Mocked Lawyer Interface & Service for UI testing
export interface Lawyer {
  id: string;
  firstName: string;
  specialty: string;
  specialties?: string[];
  city: string;
  rating: number;
  reviewCount: number;
  sessionTypes: string[];
  yearsOfExperience: number;
  hourlyRate: number;
  phoneSessionPrice?: number;
  officeSessionPrice?: number;
  joiningDate?: string;
  profileImage: string | null;
}

const mockLawyers: Lawyer[] = [
  {
    id: "1",
    firstName: "أحمد",
    lastName: "محمود",
    specialty: "قانون تجاري",
    specialties: ["قانون تجاري", "شركات", "ضرائب"],
    city: "القاهرة",
    rating: 4.8,
    reviewCount: 124,
    sessionTypes: ["مكتب", "هاتف"],
    yearsOfExperience: 15,
    hourlyRate: 500,
    phoneSessionPrice: 350,
    officeSessionPrice: 600,
    joiningDate: "يناير 2023",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
  },
  {
    id: "2",
    firstName: "سارة",
    lastName: "علي",
    specialty: "أحوال شخصية",
    specialties: ["أحوال شخصية", "أسرة"],
    city: "الإسكندرية",
    rating: 4.9,
    reviewCount: 89,
    sessionTypes: ["مكتب"],
    yearsOfExperience: 8,
    hourlyRate: 350,
    phoneSessionPrice: 200,
    officeSessionPrice: 400,
    joiningDate: "مارس 2022",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
  },
  {
    id: "3",
    firstName: "محمد",
    lastName: "حسن",
    specialty: "قانون جنائي",
    specialties: ["قانون جنائي", "جرائم إلكترونية"],
    city: "الجيزة",
    rating: 4.7,
    reviewCount: 210,
    sessionTypes: ["هاتف"],
    yearsOfExperience: 20,
    hourlyRate: 800,
    phoneSessionPrice: 500,
    officeSessionPrice: 850,
    joiningDate: "أغسطس 2021",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed",
  }
];

const lawyerSearchService = {
  searchLawyers: async (_params: any) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      data: {
        data: (_params.query || _params.practiceArea) ? mockLawyers.slice(0, 1) : mockLawyers,
        pagination: { totalItems: (_params.query || _params.practiceArea) ? 1 : mockLawyers.length, totalPages: 1, currentPage: 1 }
      }
    };
  },
  addToFavorites: async (_id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  },
  removeFromFavorites: async (_id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  }
};
import { LawyerCardSkeleton } from "@/components/ui/skeletons";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SpecializationService, {
  type Specialization,
} from "@/services/specializations-services";
import { type ApiResponse } from "@/services/api/httpClient";
import { COUNTRIES, CITIES_BY_COUNTRY } from "@/data/onboarding";

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialSearch = searchParams.get("search") || "";
  const initialSpecialty = searchParams.get("specialty") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedArea, setSelectedArea] = useState<string>(
    initialSpecialty || "all",
  );
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

  // Fetch specializations from API
  const { data: specializations = [] } =
    useQuery<ApiResponse<Specialization[]>, Error, Specialization[]>({
      queryKey: ["specializations"],
      queryFn: () => SpecializationService.getSpecializations(),
      select: (response) => response.data ?? [],
    });

  // Only Egyptian cities for the location filter
  const allCities = CITIES_BY_COUNTRY["مصر"] || [];

  // Data fetching states
  const [searchResults, setSearchResults] = useState<Lawyer[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="space-y-8 pb-12 bg-linear-to-b from-background to-muted/20 min-h-screen">
      {/* Search Hero Header */}
      <div className="w-full relative bg-linear-to-br from-primary via-primary/95 to-primary/80 py-16 px-4 shadow-xl overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, hsl(var(--primary-glow)) 0%, transparent 40%), radial-gradient(circle at 80% 70%, hsl(var(--secondary)) 0%, transparent 40%)`,
            }}
          />
        </div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>

        <div className="relative z-10 container mx-auto flex flex-col items-center max-w-4xl space-y-6">
          {/* Back link + title */}
          <div className="w-full flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/20 transition-all font-semibold rounded-full px-4"
              onClick={() => navigate("/find-lawyers")}
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للرئيسية
            </Button>
          </div>
          
          <div className="w-full space-y-2 text-right">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-md">
              نتائج البحث
            </h1>
            {(initialSearch || initialSpecialty) && (
              <p className="text-white/80 text-lg md:text-xl font-medium">
                {initialSearch && (
                  <span className="mr-1">عن "{initialSearch}"</span>
                )}
                {initialSpecialty && (
                  <span className="mr-1">في تخصص {initialSpecialty}</span>
                )}
              </p>
            )}
          </div>

          {/* Search Bar */}
          <div className="w-full flex items-center gap-2 bg-background/95 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl focus-within:border-white/50 focus-within:shadow-primary/30 transition-all duration-300">
            <Search className="w-6 h-6 text-muted-foreground mr-3" />
            <Input
              type="text"
              placeholder="ابحث بالاسم أو التخصص القانوني..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 text-lg focus-visible:ring-0 bg-transparent h-12 placeholder:text-muted-foreground/70"
            />
            <Button
              variant={showFilters ? "default" : "outline"}
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
              className="relative cursor-pointer transition-colors shadow-sm h-12 px-6 rounded-xl border-primary/20"
            >
              <Filter className="w-5 h-5 ml-2" />
              فلاتر
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -left-2 h-5 w-5 p-0 flex items-center justify-center text-xs animate-in zoom-in">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
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
                          {specializations.map((area) => (
                                <SelectItem
                                  className="cursor-pointer"
                                  key={area.id}
                                  value={area.name}
                                >
                                  {area.name}
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
                          {allCities.map((city) => (
                                <SelectItem
                                  className="cursor-pointer"
                                  key={city}
                                  value={city}
                                >
                                  {city}
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
                      <div dir="ltr">
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
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{priceRange[1]} ج.م</span>
                        <span>{priceRange[0]} ج.م</span>
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
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                <AnimatePresence mode="wait">
                  {searchResults.map((lawyer, index) => (
                    <motion.div
                      key={lawyer.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Card
                        className="group relative overflow-hidden border border-border/40 bg-card/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] transition-all duration-[800ms] ease-out hover:-translate-y-2 hover:border-primary/40 cursor-pointer flex flex-col sm:flex-row items-stretch overflow-hidden"
                        onClick={() => navigate(`/lawyers/${lawyer.id}`)}
                      >
                        {/* Image Section — Right Side in RTL */}
                        <div className="relative w-full sm:w-48 xl:w-52 h-56 sm:h-auto shrink-0 overflow-hidden border-b sm:border-b-0 sm:border-l border-border/20">
                          <img
                            src={
                              lawyer.profileImage ||
                              "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                            }
                            alt={`${lawyer.firstName} ${lawyer.lastName}`}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent sm:bg-gradient-to-l sm:from-transparent sm:via-black/10 sm:to-black/60 opacity-90 transition-opacity duration-700 group-hover:opacity-70" />

                          {/* Floating Favorite Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(lawyer.id);
                            }}
                            className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-background/30 backdrop-blur-xl border border-white/20 shadow-lg text-white hover:bg-white hover:text-red-500 transition-all duration-500 hover:scale-110 active:scale-95 z-10"
                          >
                            <Heart
                              className={`w-4 h-4 transition-all duration-300 ${
                                favorites.includes(lawyer.id)
                                  ? "text-red-500 fill-red-500"
                                  : ""
                              }`}
                            />
                          </button>

                          {/* Image Badges */}
                          <div className="absolute bottom-5 right-5 left-5 flex flex-wrap gap-2 items-end justify-between z-10">
                            <div className="flex gap-2">
                              <Badge className="bg-white/20 text-white backdrop-blur-md border border-white/30 font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl">
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                {lawyer.rating}
                                <span className="opacity-70 font-normal">({lawyer.reviewCount})</span>
                              </Badge>
                            </div>
                            <div className="bg-primary p-2 rounded-full shadow-lg border border-white/20 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                               <ArrowRight className="w-4 h-4 text-white -rotate-45" />
                            </div>
                          </div>
                        </div>

                        {/* Content Section — Left Side in RTL */}
                        <CardContent className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                          
                          {/* Header Block */}
                          <div className="space-y-2.5">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="font-extrabold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-500 flex items-center gap-2">
                                  {lawyer.firstName} {lawyer.lastName}
                                  <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                                </h3>
                                
                                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[13px] text-muted-foreground font-medium">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-primary/70" />
                                    <span>{lawyer.city}</span>
                                  </div>
                                  <span className="w-1 h-1 rounded-full bg-border" />
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-primary/70" />
                                    <span>انضم {lawyer.joiningDate || "يناير 2023"}</span>
                                  </div>
                                  <span className="w-1 h-1 rounded-full bg-border" />
                                  <span className="text-secondary-foreground font-bold">{lawyer.yearsOfExperience} سنوات خبرة</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Categories */}
                            <div className="flex flex-wrap gap-1.5">
                              {(lawyer.specialties || [lawyer.specialty]).map((cat, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="bg-muted hover:bg-primary/10 transition-colors duration-300 text-foreground border-border/50 font-bold px-2 py-0.5 rounded-lg text-[10px]"
                                >
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Pricing Grid */}
                          <div className="flex flex-wrap gap-2 pt-3 border-t border-border/40">
                            <div className="flex-1 min-w-[110px] flex items-center gap-2 bg-card/40 rounded-xl p-2 border border-border/50 shadow-sm transition-all duration-300 group-hover:border-primary/20 group-hover:bg-primary/5">
                              <div className="w-8 h-8 rounded-lg bg-background shadow-sm flex items-center justify-center text-primary shrink-0">
                                <Phone className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">استشارة هاتفية</span>
                                <span className="font-extrabold text-foreground text-sm">
                                  {lawyer.phoneSessionPrice || lawyer.hourlyRate} <span className="text-[10px] text-muted-foreground font-normal">ج.م</span>
                                </span>
                              </div>
                            </div>

                            <div className="flex-1 min-w-[110px] flex items-center gap-2 bg-card/40 rounded-xl p-2 border border-border/50 shadow-sm transition-all duration-300 group-hover:border-primary/20 group-hover:bg-primary/5">
                              <div className="w-8 h-8 rounded-lg bg-background shadow-sm flex items-center justify-center text-primary shrink-0">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">استشارة مكتبية</span>
                                <span className="font-extrabold text-foreground text-sm">
                                  {lawyer.officeSessionPrice || (lawyer.hourlyRate + 200)} <span className="text-[10px] text-muted-foreground font-normal">ج.م</span>
                                </span>
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
      </div>
      <ScrollToTopButton />
    </div>
  );
}
