import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Wallet, TrendingUp, Clock, CheckCircle } from "lucide-react";
import financialService from "@/services/financial.service";
import { Loader2 } from "lucide-react";

const FinancialsTab = () => {
  const { data: summary, isLoading, isError } = useQuery({
    queryKey: ["myEarnings"],
    queryFn: financialService.getMyEarnings,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="text-center py-20 text-red-500">
        خطأ في تحميل البيانات المالية
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-600">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{summary.availableBalance}ج.م</p>
          <p className="text-xs text-muted-foreground mt-1">الرصيد المتاح</p>
        </Card>

        <Card className="p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{summary.paidBalance}ج.م</p>
          <p className="text-xs text-muted-foreground mt-1">الرصيد المدفوع</p>
        </Card>

        <Card className="p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{summary.pendingBalance}ج.م</p>
          <p className="text-xs text-muted-foreground mt-1">قيد الانتظار</p>
        </Card>

        <Card className="p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{summary.totalEarnings}ج.م</p>
          <p className="text-xs text-muted-foreground mt-1">إجمالي الأرباح</p>
        </Card>
      </div>

      {/* Earnings Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-secondary" />
            سجل الأرباح
          </h3>
        </div>

        {summary.earnings.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-xl">
            <p className="text-sm text-muted-foreground">لا توجد أرباح حتى الآن</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="text-xs text-muted-foreground bg-muted/50">
                <tr>
                  <th className="px-4 py-3 rounded-tr-lg">التاريخ</th>
                  <th className="px-4 py-3">العميل</th>
                  <th className="px-4 py-3">المبلغ الإجمالي</th>
                  <th className="px-4 py-3">رسوم المنصة</th>
                  <th className="px-4 py-3">الصافي</th>
                  <th className="px-4 py-3 rounded-tl-lg">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {summary.earnings.map((earning) => (
                  <tr key={earning.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      {new Date(earning.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-4 py-3">{earning.clientName}</td>
                    <td className="px-4 py-3">{earning.grossAmount}ج.م</td>
                    <td className="px-4 py-3 text-red-500">-{earning.platformFee}ج.م</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{earning.netAmount}ج.م</td>
                    <td className="px-4 py-3">
                      <Badge variant={earning.status === "Paid" ? "default" : "outline"} className={
                        earning.status === "Paid"
                          ? "bg-emerald-500/10 text-emerald-700 border-emerald-200"
                          : "bg-amber-500/10 text-amber-700 border-amber-200"
                      }>
                        {earning.status === "Paid" ? "تم الدفع" : "قيد الانتظار"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FinancialsTab;
