import { useState, useMemo } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Trash2,
  Scale,
  Settings,
  Clock,
  Edit2,
  Check,
  X,
  Home,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/stores/auth.store";
import { getInitials, getAvatarColor } from "@/lib/avatarHelpers";
import chatbotService, { type ChatMeta } from "@/services/chatbot-services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AiChatLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id: activeChatId } = useParams();

  const queryClient = useQueryClient();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  // Fetching Health
  const { data: healthStatus } = useQuery({
    queryKey: ["chatbotHealth"],
    queryFn: () => chatbotService.healthCheck(),
    refetchInterval: 30_000,
  });

  // Fetching Chat History
  const { data: rawChatHistory } = useQuery({
    queryKey: ["chatHistory", user?.id],
    queryFn: () => chatbotService.getUserChatHistory(user?.id as string),
  });

  const chatHistory = useMemo(() => {
    if (!rawChatHistory) return [];
    return [...rawChatHistory].sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
  }, [rawChatHistory]);

  // Get a new Session Id
  const getSessionIdMutation = useMutation({
    mutationFn: () => chatbotService.getSessionId(),
    onMutate: () => setIsCreating(true),
    onSuccess: (session_id) => {
      const newChat: ChatMeta = {
        session_id: session_id,
        title: "محادثة جديدة",
        updated_at: new Date().toISOString(),
        last_message: "",
      };

      queryClient.setQueryData<ChatMeta[]>(
        ["chatHistory", user?.id],
        (old = []) => [newChat, ...old],
      );
      navigate(`/ai-chat/${session_id}`);
    },
    onError: (error) => {
      console.error("Failed to get session ID:", error);
      toast.error("حدث خطأ أثناء إنشاء المحادثة");
    },
    onSettled: () => setIsCreating(false),
  });

  // Delete Chat Mutation
  const deleteChatMutation = useMutation({
    mutationFn: (session_id: string) => chatbotService.deleteChat(session_id),
    onMutate: async (session_id) => {
      await queryClient.cancelQueries({ queryKey: ["chatHistory", user?.id] });
      const previousChats = queryClient.getQueryData<ChatMeta[]>([
        "chatHistory",
        user?.id,
      ]);

      queryClient.setQueryData<ChatMeta[]>(
        ["chatHistory", user?.id],
        (old) => old?.filter((c) => c.session_id !== session_id) ?? [],
      );

      return { previousChats };
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(
        ["chatHistory", user?.id],
        context?.previousChats,
      );
      console.error("Failed to delete chat:", err);
      toast.error("حدث خطأ أثناء حذف المحادثة");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory", user?.id] });
    },
    onSuccess: (_, session_id) => {
      toast.success("تم حذف المحادثة بنجاح");
      if (activeChatId === session_id) {
        navigate("/ai-chat");
      }
    },
  });

  const handleDelete = (e: React.MouseEvent, session_id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setChatToDelete(session_id);
  };

  const confirmDelete = () => {
    if (chatToDelete) {
      deleteChatMutation.mutate(chatToDelete);
      setChatToDelete(null);
    }
  };

  // Rename Chat Mutation
  const renameChatMutation = useMutation({
    mutationFn: ({
      session_id,
      newTitle,
    }: {
      session_id: string;
      newTitle: string;
    }) => chatbotService.renameChat(session_id, newTitle),
    onMutate: async ({ session_id, newTitle }) => {
      await queryClient.cancelQueries({ queryKey: ["chatHistory", user?.id] });
      const previousChats = queryClient.getQueryData<ChatMeta[]>([
        "chatHistory",
        user?.id,
      ]);

      queryClient.setQueryData<ChatMeta[]>(
        ["chatHistory", user?.id],
        (old) =>
          old?.map((c) =>
            c.session_id === session_id ? { ...c, title: newTitle } : c,
          ) ?? [],
      );

      return { previousChats };
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(
        ["chatHistory", user?.id],
        context?.previousChats,
      );
      console.error("Failed to rename chat:", err);
      toast.error("حدث خطأ أثناء تعديل المحادثة");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory", user?.id] });
    },
    onSuccess: () => {
      toast.success("تم تعديل عنوان المحادثة بنجاح");
    },
  });

  const startEdit = (e: React.MouseEvent, chat: ChatMeta) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(chat.session_id);
    setEditTitle(chat.title);
  };

  const confirmEdit = (e: React.MouseEvent, session_id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editTitle.trim()) return;

    renameChatMutation.mutate({ session_id, newTitle: editTitle.trim() });
    setEditingId(null);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(null);
  };

  // Time Formatting: Use from utils later
  const formatDate = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    if (diff < 60_000) return "الآن";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} د`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} س`;
    return d.toLocaleDateString("ar-SA");
  };

  const initials = getInitials(user?.firstName ?? "", user?.lastName ?? "");
  const avatarColor = getAvatarColor(
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
  );

  return (
    <div
      className="flex h-screen w-full bg-background overflow-hidden"
      dir="rtl"
    >
      <div className="absolute left-4 top-4 z-50 flex items-center gap-2">
        <button
          onClick={() => navigate("/")}
          className={cn(
            "cursor-pointer flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-all",
          )}
          aria-label="الرئيسية"
          title="الرئيسية"
        >
          <Home className="w-4 h-4" />
          <span className="text-[11px] font-medium">الرئيسية</span>
        </button>

        <button
          onClick={() => {
            if (user?.userType === "Lawyer") {
              navigate(`/dashboard`);
            } else {
              navigate(`/profile`);
            }
          }}
          disabled={!user?.id}
          className={cn(
            "cursor-pointer flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-all",
            !user?.id && "opacity-50 cursor-not-allowed",
          )}
          aria-label="ملفي العام"
          title="ملفي العام"
        >
          <Eye className="w-4 h-4" />
          <span className="text-[11px] font-medium">ملفي</span>
        </button>
      </div>
      <aside className="flex flex-col w-74 shrink-0 border-l border-border bg-sidebar h-full">
        {/* Brand */}
        <div className="flex items-center justify-between px-4 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-colors duration-500",
                healthStatus === true
                  ? "bg-emerald-500/10 border-emerald-500/20"
                  : healthStatus === false
                    ? "bg-rose-500/10 border-rose-500/20"
                    : "bg-primary/15 border-primary/25",
              )}
            >
              <Scale
                className={cn(
                  "w-3.5 h-3.5 transition-colors duration-500",
                  healthStatus === true
                    ? "text-emerald-500"
                    : healthStatus === false
                      ? "text-rose-500"
                      : "text-primary",
                )}
              />
            </div>
            <span className="font-semibold text-sm text-foreground tracking-tight">
              وكيلي
            </span>
          </div>

          {healthStatus !== undefined && (
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background border border-border/50"
              title={healthStatus ? "الخادم متصل ومستقر" : "الخادم غير متصل"}
            >
              <span
                className={cn(
                  "text-[9px] font-bold tracking-wider",
                  healthStatus ? "text-emerald-500" : "text-rose-500",
                )}
              >
                {healthStatus ? "متصل" : "غير متصل"}
              </span>
              <span className="relative flex h-1.5 w-1.5">
                {healthStatus && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={cn(
                    "relative inline-flex rounded-full h-1.5 w-1.5",
                    healthStatus ? "bg-emerald-500" : "bg-rose-500",
                  )}
                ></span>
              </span>
            </div>
          )}
        </div>

        {/* New Chat button */}
        <div className="px-3 mb-2">
          <button
            onClick={() => navigate("/ai-chat")}
            disabled={isCreating || getSessionIdMutation.isPending}
            className={cn(
              "cursor-pointer w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              "text-foreground/70 hover:text-foreground hover:bg-muted",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>محادثة جديدة</span>
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {chatHistory && chatHistory.length > 0 && (
            <p className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
              المحادثات
            </p>
          )}

          <AnimatePresence initial={false}>
            {chatHistory?.map((chat) => (
              <motion.div
                key={chat.session_id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
              >
                <NavLink
                  to={`/ai-chat/${chat.session_id}`}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-start gap-2.5 w-full px-2.5 py-2 rounded-lg text-right transition-colors",
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-foreground/70 hover:bg-muted/60 hover:text-foreground",
                    )
                  }
                >
                  <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-60" />

                  <div className="flex-1 min-w-0">
                    {editingId === chat.session_id ? (
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.preventDefault()}
                      >
                        <input
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              confirmEdit(
                                e as unknown as React.MouseEvent,
                                chat.session_id,
                              );
                            if (e.key === "Escape")
                              cancelEdit(e as unknown as React.MouseEvent);
                          }}
                          className="flex-1 min-w-0 text-xs bg-background border border-primary/30 rounded px-1.5 py-0.5 outline-none focus:border-primary/60 text-foreground"
                        />
                        <button
                          onClick={(e) => confirmEdit(e, chat.session_id)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-medium truncate leading-snug">
                          {chat.title}
                        </p>
                        {chat.last_message && (
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5 leading-snug">
                            {chat.last_message}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground/70">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{formatDate(chat.updated_at)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions — show on hover */}
                  {editingId !== chat.session_id && (
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => startEdit(e, chat)}
                        className="cusor-pointer p-1 rounded text-muted-foreground hover:text-foreground hover:bg-background/80"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, chat.session_id)}
                        className="cursor-pointer p-1 rounded text-muted-foreground hover:text-rose-500 hover:bg-background/80"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </AnimatePresence>

          {chatHistory && chatHistory.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-30" />
              <p className="text-xs opacity-60">لا توجد محادثات بعد</p>
            </div>
          )}
        </div>

        {/* User footer */}
        <div className="border-t border-border px-3 py-3 flex items-center gap-2.5">
          <div
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0",
              user?.profileImage
                ? "bg-primary/10 border border-primary/20 text-primary"
                : avatarColor,
            )}
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-[11px]">{initials}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {user?.email ?? ""}
            </p>
          </div>
          <button
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="الإعدادات"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <Outlet />
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!chatToDelete}
        onOpenChange={(open) => !open && setChatToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف المحادثة</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذه المحادثة؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <button
              onClick={() => setChatToDelete(null)}
              className="px-4 py-2 text-sm font-medium rounded-md border border-border bg-background hover:bg-muted transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleteChatMutation.isPending}
              className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md bg-rose-500 text-white hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteChatMutation.isPending ? "جارٍ الحذف..." : "حذف"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
