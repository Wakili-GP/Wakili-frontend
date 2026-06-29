import { useState } from "react";
import { motion } from "framer-motion";
import { User, ThumbsUp, MessageSquare, Reply } from "lucide-react";
import type { ForumComment, ReactionType } from "@/types/forum.types";
import { useAuth } from "@/stores/auth.store";
import { useAuthModalStore } from "@/stores/auth-modal.store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ForumCommentSectionProps {
  postId: string;
  comments: ForumComment[];
  onAddComment: (body: string, parentId?: string) => void;
  onReact: (commentId: string, reaction: ReactionType) => void;
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
  return new Date(dateStr).toLocaleDateString("ar-EG");
}

const CommentItem = ({ 
  comment, 
  onReply, 
  onReact, 
  isReply = false 
}: { 
  comment: ForumComment; 
  onReply: (body: string, parentId: string) => void; 
  onReact: (id: string, reaction: ReactionType) => void;
  isReply?: boolean;
}) => {
  const { isAuthenticated } = useAuth();
  const openLogin = useAuthModalStore((s) => s.openLogin);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyBody, setReplyBody] = useState("");

  const handleReact = (reaction: ReactionType) => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }
    onReact(comment.id, reaction);
  };

  const submitReply = () => {
    if (!replyBody.trim()) return;
    onReply(replyBody, comment.id);
    setReplyBody("");
    setShowReplyForm(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`forum-comment ${isReply ? 'forum-comment--reply' : ''}`}
    >
      <div className="forum-comment__header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            {comment.author.profileImageUrl ? (
              <img src={comment.author.profileImageUrl} alt={comment.author.firstName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-primary" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">
                {comment.author.firstName} {comment.author.lastName}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {formatRelativeTime(comment.createdAt)}
            </div>
          </div>
        </div>
      </div>

      <div className="forum-comment__body">
        {comment.body}
      </div>

      <div className="forum-comment__footer">
        <div className="flex flex-wrap items-center gap-2">
          <button 
            className={`forum-reaction-btn forum-reaction-btn--like ${comment.isLiked ? 'active text-primary' : ''}`}
            onClick={() => handleReact('like')}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{comment.likesCount}</span>
          </button>
        </div>

        <button 
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mr-auto"
          onClick={() => {
            if (!isAuthenticated) openLogin();
            else setShowReplyForm(!showReplyForm);
          }}
        >
          <Reply className="w-3.5 h-3.5" />
          رد
        </button>
      </div>

      {showReplyForm && (
        <div className="forum-reply-form">
          <Textarea 
            placeholder="اكتب ردك هنا..." 
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            className="min-h-[80px] text-right text-sm resize-none mb-3 bg-background"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowReplyForm(false)}>إلغاء</Button>
            <Button size="sm" onClick={submitReply}>إرسال الرد</Button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="forum-comment__replies">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              onReply={onReply} 
              onReact={onReact} 
              isReply={true} 
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const ForumCommentSection = ({ comments, onAddComment, onReact }: ForumCommentSectionProps) => {
  const { isAuthenticated } = useAuth();
  const openLogin = useAuthModalStore((s) => s.openLogin);
  const [newCommentBody, setNewCommentBody] = useState("");

  const submitComment = () => {
    if (!newCommentBody.trim()) return;
    onAddComment(newCommentBody);
    setNewCommentBody("");
  };

  const totalCommentsCount = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);

  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden space-y-6">
      <div className="flex items-center gap-2 border-b border-border/50 pb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">الإجابات والتعليقات ({totalCommentsCount})</h3>
      </div>

      <div className="w-full bg-muted/10 rounded-xl p-4 border border-border/50">
        {!isAuthenticated ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">يجب تسجيل الدخول لإضافة إجابة أو تعليق</p>
            <Button onClick={() => openLogin()}>سجل دخولك للإجابة</Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Textarea
              placeholder="هل لديك إجابة أو إضافة؟ شاركها مع المجتمع..."
              value={newCommentBody}
              onChange={(e) => setNewCommentBody(e.target.value)}
              className="min-h-[100px] text-right resize-none bg-background"
            />
            <div className="flex justify-end">
              <Button onClick={submitComment} disabled={!newCommentBody.trim()}>
                إضافة تعليق
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-full min-w-0 space-y-4 pt-4 overflow-hidden">
        {comments.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            لا توجد إجابات بعد — كن أول من يجيب!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onReply={onAddComment}
              onReact={onReact}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ForumCommentSection;
