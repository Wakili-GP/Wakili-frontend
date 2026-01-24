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
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

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
  const activeFiltersCount = [
    selectedArea && selectedArea !== "all",
    selectedLocation && selectedLocation !== "all",
    priceRange[0] > 0 || priceRange[1] < 1000,
    minRating > 0,
    sessionTypes.length > 0,
  ].filter(Boolean).length;
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
