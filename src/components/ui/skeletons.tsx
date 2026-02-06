/**
 * Skeleton Loaders for various card types
 * Used to show loading states instead of spinners
 */

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Lawyer Card Skeleton
 * Used in LawyerSearch and IndexPage
 */
export const LawyerCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border hover:shadow-lg transition-shadow">
      <div className="flex">
        <div className="relative w-48 shrink-0">
          <Skeleton className="w-full h-48" />
        </div>

        <div className="flex-1 p-4 space-y-3">
          <div className="flex justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>

          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    </Card>
  );
};

/**
 * Favorite Lawyer Card Skeleton
 * Used in ClientProfile favorites tab
 */
export const FavoriteLawyerCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border">
      <div className="flex">
        <div className="relative w-48 shrink-0">
          <Skeleton className="w-full h-full" />
        </div>

        <div className="flex-1 p-4 space-y-2">
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-6" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
          </div>

          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    </Card>
  );
};

/**
 * Lawyer Card Skeleton for Marquee
 * Used in IndexPage top lawyers section
 */
export const MarqueeLawyerCardSkeleton = () => {
  return (
    <Card className="min-w-[320px] px-7 py-6 mx-4 bg-gradient-card border-0 shadow-card">
      <CardContent className="p-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <Skeleton className="w-14 h-14 rounded-full" />
          </div>

          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <div className="mb-3 space-y-2">
          <Skeleton className="h-4 w-32" />

          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="w-4 h-4" />
            ))}
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Booking Row Skeleton
 * Used in ClientProfile bookings tab
 */
export const BookingRowSkeleton = () => {
  return (
    <tr className="border-b">
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-16" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-12" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-16" />
      </td>
      <td className="p-4">
        <Skeleton className="h-6 w-16 rounded-full" />
      </td>
      <td className="p-4">
        <Skeleton className="h-8 w-16" />
      </td>
    </tr>
  );
};

/**
 * Testimonial Card Skeleton
 * Used in IndexPage testimonials section
 */
export const TestimonialCardSkeleton = () => {
  return (
    <Card className="bg-gradient-card border-0 shadow-card h-full">
      <CardContent className="p-6 space-y-4">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-4 h-4" />
          ))}
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
