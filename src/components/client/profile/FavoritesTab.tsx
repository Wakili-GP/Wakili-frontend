import { useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Building2, Heart, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAvatarColor } from "@/lib/avatarHelpers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import favoritesService from "@/services/favorites-services";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/stores/auth.store";

const FavoritesTab = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  // Remove Favorite Mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: (lawyerId: string) => favoritesService.removeFavorite(lawyerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success("تم إزالة المحامي من المفضلة بنجاح");
    },
    onError: () => {
      toast.error("تعذر إزالة المحامي من المفضلة");
    },
  });
  // Fetching Favorites Data
  const {
    data: favorites,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["favorites", userId],
    queryFn: () => favoritesService.getFavorites(),
  });
  useEffect(() => {
    if (!isError) return;
    toast.error("خطأ في تحميل المفضلة");
  }, [isError]);

  if (!favorites) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Heart className="w-5 h-5 text-destructive" />
        المحامون المفضلون
      </h2>

      {isLoading ? (
        <p className="text-muted-foreground text-center py-12">
          جاري تحميل المفضلة...
        </p>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((lawyer, index) => (
            <motion.div
              key={lawyer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/30">
                <div className="flex p-4 gap-4">
                  <div className="relative w-16 h-16 shrink-0">
                    <div
                      className={`w-full h-full rounded-full flex items-center justify-center text-lg font-bold ${getAvatarColor(lawyer.fullName)}`}
                    >
                      {lawyer.fullName.charAt(0)}
                    </div>
                    <button
                      onClick={() => removeFavoriteMutation.mutate(lawyer.id)}
                      disabled={removeFavoriteMutation.isPending}
                      className="absolute -top-1 -right-1 p-1.5 rounded-full bg-background/90 hover:bg-destructive/10 transition-colors shadow-sm"
                    >
                      <Heart className="w-4 h-4 text-destructive fill-destructive" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-2 min-w-0">
                    <div>
                      <h3 className="font-bold text-base group-hover:text-primary transition-colors truncate">
                        {lawyer.fullName}
                      </h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lawyer.specializations.slice(0, 2).map((s) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="text-xs"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {lawyer.city}، {lawyer.country}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {lawyer.yearsOfExperience} سنة خبرة
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {lawyer.sessionTypes.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type === 0 ? (
                            <Building2 className="w-3 h-3 ml-1" />
                          ) : (
                            <Phone className="w-3 h-3 ml-1" />
                          )}
                          {type === 0 ? "مكتب" : "هاتف"}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm font-bold text-primary">
                        {lawyer.phoneSessionPrice > 0 && (
                          <span>
                            {lawyer.phoneSessionPrice} ج.م
                            <span className="text-xs font-normal text-muted-foreground">
                              /هاتف
                            </span>
                          </span>
                        )}
                        {lawyer.inOfficeSessionPrice > 0 && (
                          <span className="mr-2">
                            {lawyer.inOfficeSessionPrice} ج.م
                            <span className="text-xs font-normal text-muted-foreground">
                              /مكتب
                            </span>
                          </span>
                        )}
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
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              لا يوجد محامون في المفضلة
            </h3>
            <p className="text-sm mb-4">
              ابحث عن محامين وأضفهم إلى قائمة المفضلة للوصول إليهم بسهولة
            </p>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary-hover"
              onClick={() => navigate("/")}
            >
              ابحث عن محامي
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FavoritesTab;
