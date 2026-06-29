import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Specialization } from "@/services/specializations-services";

interface ForumFilterBarProps {
  keyword: string;
  onKeywordChange: (kw: string) => void;
  specializationId: string | number;
  onSpecializationChange: (id: string | number) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  specializations: Specialization[];
}

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "most_liked", label: "الأكثر إعجاباً" },
  { value: "most_commented", label: "الأكثر تعليقاً" },
  { value: "unanswered", label: "بدون إجابة" },
];

const ForumFilterBar = ({
  keyword,
  onKeywordChange,
  specializationId,
  onSpecializationChange,
  sortBy,
  onSortChange,
  specializations,
}: ForumFilterBarProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full">
      {/* Search Input Box */}
      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="ابحث عن سؤال أو كلمة مفتاحية..."
          className="w-full h-13 pr-12 pl-14 rounded-xl border border-white/20 bg-white/95 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all shadow-lg shadow-black/10"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 hover:bg-black/5"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4"
          >
            <div className="bg-card border border-border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-sm text-right">
              {/* Category Select */}
              <div>
                <label className="text-sm font-medium mb-1 block text-foreground">التخصص</label>
                <select
                  value={specializationId}
                  onChange={(e) => onSpecializationChange(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  dir="rtl"
                >
                  <option value="">جميع التخصصات</option>
                  {specializations.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Select */}
              <div>
                <label className="text-sm font-medium mb-1 block text-foreground">ترتيب حسب</label>
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  dir="rtl"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForumFilterBar;

