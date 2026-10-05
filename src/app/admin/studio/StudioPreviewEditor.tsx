'use client';

// Studio Live Markdown Preview & Editorial Publishing Pane
import { BookOpen, CheckCircle2 } from 'lucide-react';

interface ArticleData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
}

interface StudioPreviewEditorProps {
  article: ArticleData | null;
  onUpdateArticle: (article: ArticleData) => void;
  onPublish: () => void;
  publishing: boolean;
  published: boolean;
}

export function StudioPreviewEditor({
  article,
  onUpdateArticle,
  onPublish,
  publishing,
  published,
}: StudioPreviewEditorProps) {
  if (!article) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0CDB7] shadow-xs text-center space-y-3 py-20">
        <BookOpen className="w-10 h-10 text-[#C5A880] mx-auto opacity-40" />
        <h3 className="font-serif text-xl text-[#142019]">Awaiting Editorial Brief</h3>
        <p className="text-xs text-[#5F635F] max-w-sm mx-auto">
          Configure your topic and let Google Gemini 1.5 Pro generate structured, high-end journal copy.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0CDB7] shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-[#E0CDB7]/60 pb-3">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A880]">
          Live Markdown Editor
        </span>
        <span className="text-[10px] font-mono text-[#5F635F]">Slug: /{article.slug}</span>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={article.title}
          onChange={(e) => onUpdateArticle({ ...article, title: e.target.value })}
          className="w-full font-serif text-2xl font-semibold text-[#142019] outline-hidden border-b border-transparent focus:border-[#C5A880]"
        />
        <textarea
          rows={2}
          value={article.excerpt}
          onChange={(e) => onUpdateArticle({ ...article, excerpt: e.target.value })}
          className="w-full text-xs text-[#5F635F] italic outline-hidden border border-[#E0CDB7] rounded-lg p-2.5"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase tracking-wider text-[#5F635F]">
          Markdown Body
        </label>
        <textarea
          rows={10}
          value={article.content}
          onChange={(e) => onUpdateArticle({ ...article, content: e.target.value })}
          className="w-full font-mono text-xs rounded-xl border border-[#E0CDB7] bg-[#FBF9F5] p-3 text-[#142019] leading-relaxed outline-hidden focus:border-[#C5A880]"
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#E0CDB7]">
        {published ? (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-800">
            <CheckCircle2 className="w-4 h-4" />
            <span>Published to Estate Dispatches</span>
          </div>
        ) : (
          <div />
        )}

        <button
          type="button"
          disabled={publishing || published}
          onClick={onPublish}
          className="rounded-full bg-[#142019] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FBF9F5] hover:bg-[#23342A] disabled:opacity-50"
        >
          {publishing ? 'Publishing...' : published ? 'Published ⚜️' : 'Publish Article'}
        </button>
      </div>
    </div>
  );
}
