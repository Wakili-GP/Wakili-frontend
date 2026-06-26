import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Eye, User, Clock } from "lucide-react";
import type { ForumPost } from "@/types/forum.types";
import { useAuth } from "@/stores/auth.store";
import { useAuthModalStore } from "@/stores/auth-modal.store";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ForumPostCardProps {
  post: ForumPost;
  onLike?: (postId: string) => void;
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "الآن";
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسبوع`;
  return new Date(dateStr).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });
}

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}

const ForumPostCard = ({ post, onLike }: ForumPostCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const openLogin = useAuthModalStore((s) => s.openLogin);
  const [localLiked, setLocalLiked] = useState(post.isLiked);
  const [localLikesCount, setLocalLikesCount] = useState(post.likesCount);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    // Optimistic UI
    if (localLiked) {
      setLocalLikesCount((v) => Math.max(0, v - 1));
      setLocalLiked(false);
    } else {
      setLocalLikesCount((v) => v + 1);
      setLocalLiked(true);
    }

    onLike?.(post.id);
  };

  return (
    <motion.div
      className="forum-post-card group block h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onClick={() => navigate(`/forum/${post.id}`)}
    >
      <div className="forum-post-card__header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            {post.author.profileImage ? (
              <img
                src={post.author.profileImage}
                alt={post.author.firstName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">
                {post.author.firstName} {post.author.lastName}
              </span>
              <span className={`forum-author-badge ${post.author.userType === 'Lawyer' ? 'forum-author-badge--lawyer' : 'forum-author-badge--client'}`}>
                {post.author.userType === 'Lawyer' ? 'محامي' : 'عميل'}
              </span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-0.5 gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(post.createdAt)}
            </div>
          </div>
        </div>
        {post.status !== 'approved' && (
          <span className={`forum-status-badge ${post.status === 'pending' ? 'forum-status-badge--pending' : 'forum-status-badge--rejected'}`}>
            {post.status === 'pending' ? 'قيد المراجعة' : 'مرفوض'}
          </span>
        )}
      </div>

      <div className="forum-post-card__body">
        <div className="mb-3">
          <Badge 
            variant="outline" 
            style={{ borderColor: post.category.color, color: post.category.color }}
            className="mb-2"
          >
            {post.category.nameAr}
          </Badge>
          <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
          {post.body}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] bg-muted px-2 py-1 rounded-md text-muted-foreground">
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
             <span className="text-[10px] bg-muted px-2 py-1 rounded-md text-muted-foreground">
               +{post.tags.length - 3}
             </span>
          )}
        </div>
      </div>

      <div className="forum-post-card__footer">
        <button
          className={`flex items-center gap-1.5 transition-colors ${localLiked ? 'text-red-500' : 'hover:text-red-500'}`}
          onClick={handleLike}
        >
          <Heart className={`w-4 h-4 ${localLiked ? 'fill-current' : ''}`} />
          <span>{formatNumber(localLikesCount)}</span>
        </button>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" />
            {formatNumber(post.commentsCount)}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            {formatNumber(post.viewsCount)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ForumPostCard;
