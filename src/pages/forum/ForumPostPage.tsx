import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  User,
  Clock,
  Heart,
  Eye,
  MessageCircle,
  Share2,
  Bookmark,
  Loader
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ForumCommentSection from "@/components/forum/ForumCommentSection";

import type { ForumPost, ForumComment, ReactionType } from "@/types/forum.types";
import { forumService } from "@/services/forum-services";
import { useAuth } from "@/stores/auth.store";
import { useAuthModalStore } from "@/stores/auth-modal.store";
import { toast } from "sonner";

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
  return new Date(dateStr).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
}

const ForumPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const openLogin = useAuthModalStore((s) => s.openLogin);

  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Optimistic UI states
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);
    setLoading(true);

    Promise.all([
      forumService.getPostById(id),
      forumService.getComments(id),
    ]).then(([postRes, commentsRes]) => {
      if (postRes.success && postRes.data) {
        setPost(postRes.data);
        setIsLiked(postRes.data.isLiked);
        setLikesCount(postRes.data.likesCount);

        // Fetch related
        forumService.getPosts({ category: postRes.data.category.slug, limit: 4 }).then((relRes) => {
          if (relRes.success && relRes.data) {
            setRelatedPosts(relRes.data.posts.filter((p) => p.id !== id).slice(0, 3));
          }
        });
      }
      if (commentsRes.success && commentsRes.data) {
        setComments(commentsRes.data);
      }
      setLoading(false);
    });
  }, [id]);

  const handleLikePost = () => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount((prev) => (newIsLiked ? prev + 1 : Math.max(0, prev - 1)));
    if (id) forumService.reactToPost(id, "like");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("تم نسخ الرابط بنجاح");
  };

  const handleAddComment = async (body: string, parentId?: string) => {
    if (!id) return;
    const res = await forumService.createComment(id, body, parentId);
    if (res.success && res.data) {
      if (parentId) {
        // Recursive function to add reply
        const addReply = (commentsList: ForumComment[]): ForumComment[] => {
          return commentsList.map(c => {
            if (c.id === parentId) {
              return { ...c, replies: [...(c.replies || []), res.data!] };
            }
            if (c.replies && c.replies.length > 0) {
              return { ...c, replies: addReply(c.replies) };
            }
            return c;
          });
        };
        setComments(addReply(comments));
      } else {
        setComments([...comments, res.data]);
      }
      toast.success("تم إضافة تعليقك بنجاح");
    }
  };

  const handleReactToComment = async (commentId: string, reaction: ReactionType) => {
    // Optimistic UI for comments would go here, 
    // for now we just call the API
    await forumService.reactToComment(commentId, reaction);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">لم يتم العثور على السؤال</h2>
        <Button onClick={() => navigate("/forum/search")}>العودة للأسئلة</Button>
      </div>
    );
  }

  return (
    <div className="bg-muted/10 min-h-screen pb-20">
      <div className="container mx-auto px-4 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowRight className="w-4 h-4" />
          العودة
        </button>

        <div className="w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm"
          >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {post.author.profileImage ? (
                      <img src={post.author.profileImage} alt={post.author.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        {post.author.firstName} {post.author.lastName}
                      </span>
                      <span className={`forum-author-badge ${post.author.userType === 'Lawyer' ? 'forum-author-badge--lawyer' : 'forum-author-badge--client'}`}>
                        {post.author.userType === 'Lawyer' ? 'محامي' : 'عميل'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-0.5 gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatRelativeTime(post.createdAt)}
                    </div>
                  </div>
                </div>

                <Badge variant="outline" style={{ borderColor: post.category.color, color: post.category.color }}>
                  {post.category.nameAr}
                </Badge>
              </div>

              {post.status !== 'approved' && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                  post.status === 'pending' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {post.status === 'pending' 
                    ? 'هذا السؤال قيد المراجعة ولن يظهر للعامة حتى يتم الموافقة عليه.' 
                    : 'تم رفض هذا السؤال لعدم استيفائه لشروط النشر.'}
                </div>
              )}

              <h1 className="text-2xl md:text-3xl font-bold mb-6 leading-relaxed">
                {post.title}
              </h1>

              <div className="text-foreground/90 leading-loose whitespace-pre-wrap text-lg mb-8">
                {post.body}
              </div>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-muted px-3 py-1.5 rounded-md text-muted-foreground text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between pt-6 border-t border-border">
                <div className="flex items-center gap-6">
                  <button
                    className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                    onClick={handleLikePost}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{likesCount} إعجاب</span>
                  </button>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">{post.commentsCount} تعليق</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="w-5 h-5" />
                    <span className="font-medium">{post.viewsCount} مشاهدة</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={handleShare}>
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Bookmark className="w-5 h-5" />
                  </Button>
                </div>
              </div>
          </motion.div>

          <ForumCommentSection
            postId={post.id}
            comments={comments}
            onAddComment={handleAddComment}
            onReact={handleReactToComment}
          />

          {relatedPosts.length > 0 && (
            <div className="w-full bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm">
              <h3 className="font-bold text-lg mb-4">أسئلة ذات صلة</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map((rel) => (
                  <div
                    key={rel.id}
                    className="group cursor-pointer rounded-xl border border-border p-4 hover:border-primary/30 hover:shadow-sm transition-all"
                    onClick={() => navigate(`/forum/${rel.id}`)}
                  >
                    <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors text-sm mb-2 leading-relaxed">
                      {rel.title}
                    </h4>
                    <div className="flex items-center text-xs text-muted-foreground gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {rel.likesCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" /> {rel.commentsCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate(`/forum/search?category=${post.category.slug}`)}
              >
                عرض المزيد في هذا التخصص
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPostPage;
