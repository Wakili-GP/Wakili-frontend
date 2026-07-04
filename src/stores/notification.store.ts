import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import * as signalR from "@microsoft/signalr";
import notificationServices, {
  type NotificationDto,
} from "@/services/notification-services";

export interface NotificationState {
  notifications: NotificationDto[];
  unreadCount: number;
  isConnected: boolean;
  hubConnection: signalR.HubConnection | null;

  connect: (token: string) => Promise<void>;
  disconnect: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  // Called by components when they load paginated data to keep store in sync if needed
  setNotifications: (notifications: NotificationDto[]) => void;
}

export type NotificationContextType = Omit<NotificationState, "setNotifications">;

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  hubConnection: null,

  connect: async (token: string) => {
    // If already connected, do nothing
    if (get().hubConnection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    const hubBase =
      import.meta.env.MODE === "development"
        ? ""
        : (import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "") ||
          "http://wakili.runasp.net");

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${hubBase}/hubs/notifications`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    // Event: Receive single new notification
    connection.on("ReceiveNotification", (notification: NotificationDto) => {
      set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
      }));
    });

    // Event: Receive all unread notifications upon connection
    connection.on("UnreadNotifications", (unreadList: NotificationDto[]) => {
      set((state) => {
        // Merge with existing, avoiding duplicates
        const existingIds = new Set(state.notifications.map((n) => n.id));
        const newNotifications = unreadList.filter((n) => !existingIds.has(n.id));
        return {
          notifications: [...newNotifications, ...state.notifications].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
          unreadCount: unreadList.length,
        };
      });
    });

    // Event: Single marked as read (e.g. from another tab)
    connection.on("NotificationRead", (notificationId: string) => {
      set((state) => {
        const target = state.notifications.find((n) => n.id === notificationId);
        if (!target || target.isRead) return state; // already read or not in memory

        return {
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        };
      });
    });

    // Event: All marked as read (from another tab)
    connection.on("AllNotificationsRead", () => {
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    });

    try {
      await connection.start();
      set({ hubConnection: connection, isConnected: true });
      console.log("SignalR Connected to Notifications Hub");

      // We might have missed some while disconnected, let's fetch count
      await get().fetchUnreadCount();
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
      // Auto-reconnect builder will handle retries, but we mark as disconnected
      set({ isConnected: false });
    }

    // Reconnection events
    connection.onreconnecting(() => set({ isConnected: false }));
    connection.onreconnected(() => set({ isConnected: true }));
    connection.onclose(() => set({ isConnected: false }));
  },

  disconnect: async () => {
    const { hubConnection } = get();
    if (hubConnection) {
      await hubConnection.stop();
      set({
        hubConnection: null,
        isConnected: false,
        notifications: [],
        unreadCount: 0,
      });
      console.log("SignalR Disconnected");
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await notificationServices.getUnreadCount();
      if (res.success && res.data !== undefined) {
        set({ unreadCount: res.data });
      }
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  },

  markAsRead: async (id: string) => {
    try {
      // Optimistic update
      set((state) => {
        const target = state.notifications.find((n) => n.id === id);
        if (!target || target.isRead) return state;

        return {
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n,
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        };
      });

      await notificationServices.markAsRead(id);
    } catch (err) {
      console.error("Failed to mark as read", err);
      // Ideally revert optimistic update here, but we can just re-fetch count
      await get().fetchUnreadCount();
    }
  },

  markAllAsRead: async () => {
    try {
      // Optimistic update
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));

      await notificationServices.markAllAsRead();
    } catch (err) {
      console.error("Failed to mark all as read", err);
      await get().fetchUnreadCount();
    }
  },

  setNotifications: (notifications: NotificationDto[]) => {
    set({ notifications });
  },
}));

export const useNotifications = (): NotificationContextType =>
  useNotificationStore(
    useShallow((state) => ({
      notifications: state.notifications,
      unreadCount: state.unreadCount,
      isConnected: state.isConnected,
      hubConnection: state.hubConnection,
      connect: state.connect,
      disconnect: state.disconnect,
      fetchUnreadCount: state.fetchUnreadCount,
      markAsRead: state.markAsRead,
      markAllAsRead: state.markAllAsRead,
    })),
  );
