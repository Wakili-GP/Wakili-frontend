import { Calendar, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getAvatarColor } from "@/lib/avatarHelpers";
import { getTimeRemaining } from "@/lib/utils";
import BookingStatusBadge from "@/components/client/Profile/BookingStatusBadge";
import type { ClientBookingInterface } from "@/services/clientProfile-services";

interface BookingDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBooking: ClientBookingInterface | null;
  onCancelBooking?: () => void;
}

const BookingDetailsDialog = ({
  open,
  onOpenChange,
  selectedBooking,
  onCancelBooking,
}: BookingDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mt-2">
            تفاصيل الحجز
          </DialogTitle>
        </DialogHeader>

        {selectedBooking &&
          (() => {
            const lawyerName = `${selectedBooking.lawyerFirstName} ${selectedBooking.lawyerLastName}`;
            return (
              <div className="space-y-4 mt-2 mb-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground flex items-center gap-2">
                    محامي الاستشارة
                  </span>
                  <span className="font-semibold flex items-center gap-2">
                    {selectedBooking.lawyerProfileImage ? (
                      <img
                        src={selectedBooking.lawyerProfileImage}
                        alt={lawyerName}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div
                        className={`w-6 h-6 rounded-full flex items-center shrink-0 justify-center text-[10px] font-bold ${getAvatarColor(
                          lawyerName,
                        )}`}
                      >
                        {lawyerName.replace(/^(د\.|أ\.|م\.)\s*/, "").charAt(0)}
                      </div>
                    )}
                    {lawyerName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">نوع الاستشارة</span>
                  <span className="font-semibold">
                    {selectedBooking.sessionType === 0 ? "مكتبي" : "هاتفي"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">تاريخ الموعد</span>
                  <span className="font-semibold flex items-center gap-2 text-primary">
                    <Calendar className="w-4 h-4" />
                    {selectedBooking.sessionDate}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">توقيت الموعد</span>
                  <span className="font-semibold flex items-center gap-2 text-primary">
                    <Clock className="w-4 h-4" />
                    {selectedBooking.startTime} - {selectedBooking.endTime}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">الحالة</span>
                  <span className="font-semibold">
                    <BookingStatusBadge status={selectedBooking.status} />
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mt-4 bg-muted/20 p-3 rounded-lg">
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs">
                      تاريخ الإنشاء
                    </span>
                    <span className="font-medium">
                      {new Date(selectedBooking.createdAt).toLocaleDateString(
                        "ar-EG",
                      )}
                    </span>
                  </div>
                  {selectedBooking.confirmedAt && (
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-xs">
                        تاريخ التأكيد
                      </span>
                      <span className="font-medium">
                        {new Date(
                          selectedBooking.confirmedAt,
                        ).toLocaleDateString("ar-EG")}
                      </span>
                    </div>
                  )}
                  {selectedBooking.completedAt && (
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-xs">
                        تاريخ الاكتمال
                      </span>
                      <span className="font-medium">
                        {new Date(
                          selectedBooking.completedAt,
                        ).toLocaleDateString("ar-EG")}
                      </span>
                    </div>
                  )}
                  {selectedBooking.cancelledAt && (
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-xs">
                        تاريخ الإلغاء
                      </span>
                      <span className="font-medium">
                        {new Date(
                          selectedBooking.cancelledAt,
                        ).toLocaleDateString("ar-EG")}
                      </span>
                    </div>
                  )}
                </div>

                {(selectedBooking.status === "قيد الانتظار" ||
                  selectedBooking.status === "مؤكد") && (
                    <div className="bg-muted/40 p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground">
                          الوقت المتبقي
                        </div>
                        <div className="text-sm font-bold mt-1 text-secondary">
                          {getTimeRemaining(
                            selectedBooking.sessionDate,
                            selectedBooking.startTime,
                          )}
                        </div>
                      </div>
                      <Clock className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
              </div>
            );
          })()}

        <DialogFooter className="sm:justify-start flex gap-2 w-full pt-4 border-t border-border mt-4">
          <Button
            className="flex-1 sm:flex-none"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            إغلاق
          </Button>
          {selectedBooking &&
            (selectedBooking.status === "قيد الانتظار" ||
              selectedBooking.status === "مؤكد") && (
              <Button
                variant="destructive"
                className="flex-1 sm:flex-none"
                onClick={onCancelBooking}
              >
                إلغاء الحجز
              </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsDialog;
