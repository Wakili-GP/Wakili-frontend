import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Bell,
  Check,
  CheckCircle2,
  Calendar,
  CreditCard,
  Clock,
  Info,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications, useNotificationStore } from "@/stores/notification.store";
import notificationServices, {
  NotificationType,
} from "@/services/notification-services";

const getIconForType = (type: NotificationType) => {
  switch (type) {
    case NotificationType.AppointmentBooked:
    case NotificationType.AppointmentConfirmed:
    case NotificationType.AppointmentRejected:
    case NotificationType.AppointmentCompleted:
      return <Calendar className="h-5 w-5 text-blue-500" />;
    case NotificationType.NewReview:
      return <Star className="h-5 w-5 text-yellow-500" />;
    case NotificationType.PaymentSuccess:
      return <CreditCard className="h-5 w-5 text-green-500" />;
    case NotificationType.General:
      return <Info className="h-5 w-5 text-primary" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const NotificationsPage = () => {
  const {
    notifications: storeNotifications,
    markAsRead,
    markAllAsRead,
    unreadCount,
  } = useNotifications();
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isLoading, setIsLoading] = useState(true);

  // We load initial page here
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const res = await notificationServices.getNotifications({
          page: 1,
          pageSize: 50,
        });
        if (res.success && res.data) {
          setNotifications(res.data);
        }
      } catch (error) {
        console.error("Failed to load notifications", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [setNotifications]);

  const filteredNotifications = storeNotifications.filter((n) =>
    filter === "unread" ? !n.isRead : true,
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/50 py-10">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary" />
              مركز الإشعارات
              {unreadCount > 0 && (
                <Badge variant="destructive" className="rounded-full px-2">
                  {unreadCount} جديد
                </Badge>
              )}
            </h1>
            <p className="text-gray-500 mt-2">
              تابع جميع التحديثات والمواعيد الخاصة بك في مكان واحد
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsRead()}
              disabled={unreadCount === 0}
              className="flex-1 md:flex-none cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4 ml-2" />
              تحديد الكل كمقروء
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Tabs
          defaultValue="all"
          value={filter}
          onValueChange={(v) => setFilter(v as "all" | "unread")}
          className="mb-6"
        >
          <TabsList className="grid w-full md:w-[400px] grid-cols-2 h-12">
            <TabsTrigger value="all" className="cursor-pointer text-base">
              الكل
            </TabsTrigger>
            <TabsTrigger value="unread" className="cursor-pointer text-base">
              غير مقروءة
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
              جاري التحميل...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Bell className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-lg font-medium text-gray-600">لا توجد إشعارات</p>
              <p className="text-sm">لم تتلق أي إشعارات حتى الآن.</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-5 transition-all duration-200 flex gap-4 ${!notification.isRead
                      ? "bg-primary/5 hover:bg-primary/10"
                      : "hover:bg-gray-50"
                    }`}
                  onClick={() => {
                    if (!notification.isRead) markAsRead(notification.id);
                  }}
                >
                  <div className="mt-1 flex-shrink-0 relative">
                    <div className="w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center">
                      {getIconForType(notification.type)}
                    </div>
                    {!notification.isRead && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3
                        className={`text-base font-semibold ${!notification.isRead ? "text-gray-900" : "text-gray-700"
                          }`}
                      >
                        {notification.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 whitespace-nowrap flex-shrink-0 gap-1 bg-gray-100 px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3" />
                        <span dir="ltr">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: ar,
                          })}
                        </span>
                      </div>
                    </div>
                    <p
                      className={`mt-1.5 text-sm leading-relaxed ${!notification.isRead ? "text-gray-800" : "text-gray-600"
                        }`}
                    >
                      {notification.message}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <div className="flex items-center justify-center pl-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-primary hover:bg-primary/10 cursor-pointer"
                        title="تحديد كمقروء"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
