import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Eye, BookOpen, User } from "lucide-react";
import type { Article, VoteType } from "@/types/article.types";
import { useAuth } from "@/stores/auth.store";
import { useAuthModalStore } from "@/stores/auth-modal.store";
import { useState } from "react";

interface ArticleCardProps {
  article: Article;
  onVote?: (articleId: string, vote: VoteType) => void;
}

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const ArticleCard = ({ article, onVote }: ArticleCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const openLogin = useAuthModalStore((s) => s.openLogin);
  const [localVote, setLocalVote] = useState<VoteType | null>(article.userVote ?? null);
  const [localUpvotes, setLocalUpvotes] = useState(article.upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(article.downvotes);

  const handleVote = (e: React.MouseEvent, vote: VoteType) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    // Optimistic UI
    if (localVote === vote) {
      // Remove vote
      if (vote === "up") setLocalUpvotes((v) => v - 1);
      else setLocalDownvotes((v) => v - 1);
      setLocalVote(null);
    } else {
      // Change or new vote
      if (localVote === "up") setLocalUpvotes((v) => v - 1);
      if (localVote === "down") setLocalDownvotes((v) => v - 1);
      if (vote === "up") setLocalUpvotes((v) => v + 1);
      else setLocalDownvotes((v) => v + 1);
      setLocalVote(vote);
    }

    onVote?.(article.id, vote);
  };

  const netScore = localUpvotes - localDownvotes;

  return (
    <motion.div
      className="article-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onClick={() => navigate(`/articles/${article.id}`)}
    >
      {/* Cover Image */}
      <div className="article-card__cover">
        {article.coverImage ? (
          <img
            src={article.coverImage}
            alt={article.title}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-primary/30" />
          </div>
        )}
        <span
          className="article-card__category"
          style={{ backgroundColor: article.category.color + "dd" }}
        >
          {article.category.nameAr}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-lg leading-snug line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Author Row */}
        <div className="flex items-center gap-2 pt-1">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            {article.author.profileImage ? (
              <img
                src={article.author.profileImage}
                alt={article.author.firstName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">
              {article.author.firstName} {article.author.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(article.publishedAt || article.createdAt)}
            </p>
          </div>
        </div>

        {/* Vote & Stats Row */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <button
              className={`vote-btn vote-btn--up ${localVote === "up" ? "active" : ""}`}
              onClick={(e) => handleVote(e, "up")}
              aria-label="تصويت إيجابي"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold min-w-[2rem] text-center">
              {formatNumber(netScore)}
            </span>
            <button
              className={`vote-btn vote-btn--down ${localVote === "down" ? "active" : ""}`}
              onClick={(e) => handleVote(e, "down")}
              aria-label="تصويت سلبي"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(article.totalReads)}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {article.readTimeMinutes} د
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleCard;
