import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDownUp, Calendar, Filter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAvatarColor } from "@/lib/avatarHelpers";
import { getTimeRemaining } from "@/lib/utils";
import BookingStatusBadge from "@/components/client/profile/BookingStatusBadge";
import type { ClientBookingInterface } from "@/services/clientProfile-services";

interface BookingsTabProps {
  bookings: ClientBookingInterface[];
  onOpenBookingDetails: (booking: ClientBookingInterface) => void;
}

const ITEMS_PER_PAGE = 5;

const BookingsTab = ({ bookings, onOpenBookingDetails }: BookingsTabProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        const lawyerName = `${b.lawyerFirstName} ${b.lawyerLastName}`;
        const matchesSearch = lawyerName.includes(search);
        const matchesStatus =
          statusFilter === "الكل" || b.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.sessionDate} ${a.startTime}`).getTime();
        const dateB = new Date(`${b.sessionDate} ${b.startTime}`).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [bookings, search, statusFilter, sortOrder]);

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-secondary" />
          حجوزات الاستشارات
        </h2>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary-hover"
          onClick={() => navigate("/find-lawyers")}
        >
          احجز استشارة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "مؤكدة",
            count: bookings.filter((b) => b.status === "مؤكد").length,
            color: "bg-success-green/10 text-success-green",
          },
          {
            label: "مكتملة",
            count: bookings.filter((b) => b.status === "مكتمل").length,
            color: "bg-primary/10 text-primary",
          },
          {
            label: "قيد الانتظار",
            count: bookings.filter((b) => b.status === "قيد الانتظار").length,
            color: "bg-warning-amber/10 text-warning-amber",
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-xl p-4 text-center ${item.color}`}
          >
            <div className="text-3xl font-bold">{item.count}</div>
            <div className="text-xs font-semibold mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="ابحث عن محامي أو تخصص..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pr-10 bg-background w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="w-full sm:w-48 relative">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="cursor-pointer w-full relative pr-3 pl-10 h-10">
                <SelectValue placeholder="كل الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value="الكل">
                  كل الحالات
                </SelectItem>
                <SelectItem className="cursor-pointer" value="مؤكد">
                  مؤكد
                </SelectItem>
                <SelectItem className="cursor-pointer" value="مكتمل">
                  مكتمل
                </SelectItem>
                <SelectItem className="cursor-pointer" value="قيد الانتظار">
                  قيد الانتظار
                </SelectItem>
                <SelectItem className="cursor-pointer" value="ملغي">
                  ملغي
                </SelectItem>
              </SelectContent>
            </Select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
          </div>

          <Button
            variant="outline"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-background md:px-6"
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            <ArrowDownUp className="w-4 h-4" />
            {sortOrder === "asc" ? "الأقدم أولاً" : "الأحدث أولاً"}
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-right pr-20 font-bold">
                المحامي
              </TableHead>
              <TableHead className="text-center font-bold">
                نوع الاستشارة
              </TableHead>
              <TableHead className="text-center font-bold">التخصص</TableHead>
              <TableHead className="text-center font-bold">التاريخ</TableHead>
              <TableHead className="text-center font-bold">الوقت</TableHead>
              <TableHead className="text-center font-bold">الحالة</TableHead>
              <TableHead className="text-center font-bold">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBookings.map((booking) => {
              const lawyerName = `${booking.lawyerFirstName} ${booking.lawyerLastName}`;
              return (
                <TableRow
                  key={booking.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-2 pr-8">
                      {booking.lawyerProfileImage ? (
                        <img
                          src={booking.lawyerProfileImage}
                          alt={lawyerName}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getAvatarColor(
                            lawyerName,
                          )}`}
                        >
                          {lawyerName
                            .replace(/^(د\.|أ\.|م\.)\s*/, "")
                            .charAt(0)}
                        </div>
                      )}
                      <span>{lawyerName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {booking.sessionType === 0 ? "مكتبي" : "هاتفي"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-xs">
                      غير متوفر
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-center">
                    <div className="font-medium text-foreground">
                      {booking.sessionDate}
                    </div>
                    <div className="text-xs text-secondary mt-1 font-semibold">
                      {getTimeRemaining(booking.sessionDate, booking.startTime)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-center">
                    {booking.startTime}
                  </TableCell>
                  <TableCell className="text-center">
                    <BookingStatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => onOpenBookingDetails(booking)}
                      >
                        التفاصيل
                      </Button>
                      {booking.status === "مكتمل" && (
                        <Button
                          variant="default"
                          size="sm"
                          className={`text-xs text-white ${
                            booking.isReviewed 
                              ? "bg-secondary hover:bg-secondary-hover" 
                              : "bg-primary hover:bg-primary-hover"
                          }`}
                          onClick={() => navigate(`/appointments/${booking.id}/review`)}
                        >
                          {booking.isReviewed ? "عرض التقييم" : "تقييم الجلسة"}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-4">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              السابق
            </Button>
            <span className="text-sm">
              صفحة {currentPage} من {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              التالي
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BookingsTab;
