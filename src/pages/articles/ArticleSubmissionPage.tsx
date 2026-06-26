import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { motion } from "framer-motion";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Code, Minus, Image, Link2, Undo, Redo,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Save, Send, Eye, FileText, CheckCircle2, XCircle,
  Upload, X, Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ARTICLE_CATEGORIES } from "@/types/article.types";
import type { ArticleStatus } from "@/types/article.types";
import { articleService } from "@/services/article-services";
import { toast } from "@/components/ui/sonner";

// ── Toolbar Button ──
function ToolbarBtn({
  onClick, active, children, title,
}: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? "is-active" : ""}
      title={title}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="toolbar-divider" />;
}

// ── Word count helper ──
function getWordCount(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.split(/\s+/).length : 0;
}

const ArticleSubmissionPage = ({ onNavigate }: { onNavigate?: (section: string) => void }) => {
  const navigate = useNavigate();
  
  const handleNavigate = (path: string) => {
    if (onNavigate && path === "/dashboard/articles") {
      onNavigate("articles");
    } else {
      navigate(path);
    }
  };
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [status] = useState<ArticleStatus>("draft");
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false }),
      ImageExt,
      Placeholder.configure({ placeholder: "ابدأ كتابة مقالك هنا..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
    editorProps: {
      attributes: { class: "focus:outline-none min-h-[400px]" },
    },
  });

  const wordCount = editor ? getWordCount(editor.getHTML()) : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Auto-save to localStorage every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      if (editor && title) {
        const draft = {
          title, excerpt, coverImage, categoryId, tags,
          body: editor.getHTML(),
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem("article-draft", JSON.stringify(draft));
        setLastSaved(new Date());
        toast.success("تم حفظ المسودة تلقائياً", { duration: 2000 });
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [editor, title, excerpt, coverImage, categoryId, tags]);

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem("article-draft");
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        setTitle(draft.title || "");
        setExcerpt(draft.excerpt || "");
        setCoverImage(draft.coverImage || "");
        setCoverPreview(draft.coverImage || "");
        setCategoryId(draft.categoryId || "");
        setTags(draft.tags || []);
        if (draft.body && editor) {
          editor.commands.setContent(draft.body);
        }
      } catch { /* ignore */ }
    }
  }, [editor]);

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (t && tags.length < 5 && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const handleCoverImageUrl = (url: string) => {
    setCoverImage(url);
    setCoverPreview(url);
  };

  const handleSaveDraft = useCallback(async () => {
    if (!title.trim()) { toast.error("يرجى إدخال عنوان المقال"); return; }
    setSaving(true);
    try {
      await articleService.createArticle({
        title, excerpt, body: editor?.getHTML() || "",
        coverImage, categoryId, tags,
      });
      toast.success("تم حفظ المسودة بنجاح");
      setLastSaved(new Date());
    } catch { toast.error("فشل حفظ المسودة"); }
    setSaving(false);
  }, [title, excerpt, editor, coverImage, categoryId, tags]);

  const handleSubmit = async () => {
    if (!title.trim() || !categoryId || wordCount < 50) {
      toast.error("يرجى ملء جميع الحقول المطلوبة (عنوان، تخصص، ٥٠ كلمة على الأقل)");
      return;
    }
    setSubmitting(true);
    try {
      const res = await articleService.createArticle({
        title, excerpt, body: editor?.getHTML() || "",
        coverImage, categoryId, tags,
      });
      if (res.success && res.data) {
        await articleService.submitForReview(res.data.id);
        localStorage.removeItem("article-draft");
        toast.success("تم إرسال المقال للمراجعة بنجاح");
        handleNavigate("/dashboard/articles");
      }
    } catch { toast.error("فشل إرسال المقال"); }
    setSubmitting(false);
    setShowSubmitModal(false);
  };

  const insertImage = () => {
    const url = window.prompt("أدخل رابط الصورة:");
    if (url && editor) editor.chain().focus().setImage({ src: url }).run();
  };

  const insertLink = () => {
    const url = window.prompt("أدخل الرابط:");
    if (url && editor) editor.chain().focus().setLink({ href: url }).run();
  };

  // Checklist
  const checklist = [
    { label: "العنوان", ok: title.trim().length > 0 },
    { label: "صورة الغلاف", ok: !!coverImage },
    { label: "التخصص", ok: !!categoryId },
    { label: "٥٠ كلمة على الأقل", ok: wordCount >= 50 },
  ];

  const statusLabels: Record<ArticleStatus, { label: string; class: string }> = {
    draft: { label: "مسودة", class: "status-badge--draft" },
    under_review: { label: "قيد المراجعة", class: "status-badge--under_review" },
    published: { label: "منشور", class: "status-badge--published" },
    rejected: { label: "مرفوض", class: "status-badge--rejected" },
  };

  return (
    <div className="pb-16 w-full">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold">مقال جديد</h1>
            <span className={`status-badge ${statusLabels[status].class}`}>
              {statusLabels[status].label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={saving} className="gap-1">
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              حفظ المسودة
            </Button>
            <Button variant="default" size="sm" onClick={() => setShowSubmitModal(true)} disabled={submitting} className="gap-1">
              <Send className="w-4 h-4" /> إرسال للمراجعة
            </Button>
          </div>
        </motion.div>

        {lastSaved && (
          <p className="text-xs text-muted-foreground mb-4">
            آخر حفظ: {lastSaved.toLocaleTimeString("ar-EG")}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Main Editor Area */}
          <div className="space-y-4">
            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان المقال *"
              maxLength={120}
              className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50 px-0"
            />

            {/* Cover Image */}
            <div className="border border-dashed border-border rounded-xl p-4 bg-card">
              {coverPreview ? (
                <div className="relative rounded-lg overflow-hidden aspect-video mb-2">
                  <img src={coverPreview} alt="غلاف" className="w-full h-full object-cover" />
                  <button
                    onClick={() => { setCoverImage(""); setCoverPreview(""); }}
                    className="absolute top-2 left-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Upload className="w-8 h-8 mb-2" />
                  <p className="text-sm">أضف صورة الغلاف</p>
                </div>
              )}
              <input
                type="url"
                value={coverImage}
                onChange={(e) => handleCoverImageUrl(e.target.value)}
                placeholder="أدخل رابط صورة الغلاف..."
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">التخصص *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">اختر التخصص</option>
                  {ARTICLE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameAr}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">الوسوم (حد أقصى ٥)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="أدخل وسم..."
                    className="flex-1 h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <Button variant="outline" size="sm" onClick={handleAddTag} className="h-10">إضافة</Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((t) => (
                      <Badge key={t} variant="secondary" className="gap-1 pr-1">
                        {t}
                        <button onClick={() => setTags(tags.filter((x) => x !== t))}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="text-sm font-medium mb-1 block">ملخص المقال</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="ملخص قصير يظهر في بطاقة المقال (300 حرف كحد أقصى)"
                maxLength={300}
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1 text-left">{excerpt.length}/300</p>
            </div>

            {/* Rich Text Editor */}
            <div className="tiptap-editor border border-border rounded-xl bg-card overflow-hidden">
              {editor && (
                <div className="tiptap-toolbar">
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="غامق">
                    <Bold className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="مائل">
                    <Italic className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="تحته خط">
                    <UnderlineIcon className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="يتوسطه خط">
                    <Strikethrough className="w-4 h-4" />
                  </ToolbarBtn>
                  <Divider />
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="عنوان 1">
                    <Heading1 className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="عنوان 2">
                    <Heading2 className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="عنوان 3">
                    <Heading3 className="w-4 h-4" />
                  </ToolbarBtn>
                  <Divider />
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="قائمة نقطية">
                    <List className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="قائمة مرقمة">
                    <ListOrdered className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="اقتباس">
                    <Quote className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="كود">
                    <Code className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="خط فاصل">
                    <Minus className="w-4 h-4" />
                  </ToolbarBtn>
                  <Divider />
                  <ToolbarBtn onClick={insertImage} title="صورة">
                    <Image className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={insertLink} active={editor.isActive("link")} title="رابط">
                    <Link2 className="w-4 h-4" />
                  </ToolbarBtn>
                  <Divider />
                  <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="يمين">
                    <AlignRight className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="وسط">
                    <AlignCenter className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="يسار">
                    <AlignLeft className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="ضبط">
                    <AlignJustify className="w-4 h-4" />
                  </ToolbarBtn>
                  <Divider />
                  <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="تراجع">
                    <Undo className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="إعادة">
                    <Redo className="w-4 h-4" />
                  </ToolbarBtn>
                </div>
              )}
              <EditorContent editor={editor} />
            </div>

            {/* Word count bar */}
            <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
              <span>{wordCount} كلمة</span>
              <span>~{readTime} دقيقة قراءة</span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Checklist */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" /> قائمة التحقق
              </h3>
              <div className="space-y-2">
                {checklist.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    {item.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground/40" />
                    )}
                    <span className={item.ok ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Preview */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" /> معاينة البطاقة
              </h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="aspect-video bg-muted">
                  {coverPreview && (
                    <img src={coverPreview} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <p className="font-semibold text-sm line-clamp-2">{title || "عنوان المقال"}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{excerpt || "ملخص المقال..."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg font-bold mb-2">إرسال المقال للمراجعة</h3>
            <p className="text-muted-foreground text-sm mb-6">
              سيتم مراجعة مقالك من قبل فريقنا التحريري قبل النشر. ستتلقى إشعاراً عند اعتماده.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowSubmitModal(false)} className="flex-1">
                إلغاء
              </Button>
              <Button onClick={handleSubmit} disabled={submitting} className="flex-1 gap-1">
                {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                إرسال
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ArticleSubmissionPage;
