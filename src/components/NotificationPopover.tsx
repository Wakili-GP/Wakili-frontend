import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications } from "@/stores/notification.store";

export const NotificationPopover = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer relative">
          <Bell className="h-7 w-7 text-foreground" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="center">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">الإشعارات</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              لا توجد إشعارات
            </div>
          ) : (
            notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                onClick={() => {
                  if (!notification.isRead) markAsRead(notification.id);
                }}
                className={`p-4 border-b last:border-b-0 cursor-pointer transition-colors ${
                  !notification.isRead
                    ? "bg-primary/5 hover:bg-primary/10"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-medium text-sm ${
                        !notification.isRead ? "text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {notification.title}
                    </h4>
                    <p
                      className={`text-xs mt-1 truncate ${
                        !notification.isRead
                          ? "text-gray-800"
                          : "text-muted-foreground"
                      }`}
                    >
                      {notification.message}
                    </p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span
                      className="text-[10px] text-muted-foreground whitespace-nowrap"
                      dir="ltr"
                    >
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: ar,
                      })}
                    </span>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-red-500 mt-2"></span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {notifications.length > 0 && (
          <div className="p-2 border-t bg-gray-50 text-center">
            <Button
              variant="ghost"
              className="w-full text-sm text-primary hover:text-primary/80 cursor-pointer"
              onClick={() => {
                navigate("/notifications");
                // Close popover hack:
                document.body.click();
              }}
            >
              عرض جميع الإشعارات
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
