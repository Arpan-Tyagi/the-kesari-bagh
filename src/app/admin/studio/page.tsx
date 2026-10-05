'use client';

// Gemini Content Studio: Google Gemini 1.5 Pro Marketing Editorial Assistant
import { useState } from 'react';
import { publishBlogAction } from '@/actions/blog-actions';
import { Sparkles } from 'lucide-react';
import { StudioPreviewEditor } from './StudioPreviewEditor';

type EditorialTone = 'editorial_luxury' | 'poetic_countryside' | 'architectural_heritage' | 'epicurean_gastronomy';

export default function GeminiStudioPage() {
  const [topic, setTopic] = useState('Equestrian Serenity: Morning Walks with Elly');
  const [tone, setTone] = useState<EditorialTone>('editorial_luxury');
  const [keywords, setKeywords] = useState('Marwari horse, Aravalli hills, French-colonial, Manesar luxury retreat');
  const [notes, setNotes] = useState('Focus on the sensory details of the 1-acre manicured lawn and morning birdsong');

  const [generating, setGenerating] = useState(false);
  const [article, setArticle] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
  } | null>(null);

  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setPublished(false);

    try {
      const res = await fetch('/api/admin/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          tone,
          targetKeywords: keywords.split(',').map((k) => k.trim()),
          additionalNotes: notes,
        }),
      });

      const data = await res.json();
      setArticle(data);
    } catch {
      alert('Generation encountered an issue.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!article) return;
    setPublishing(true);

    const res = await publishBlogAction({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      coverImage: article.coverImage,
      authorName: 'The Estate Editorial Desk',
      published: true,
    });

    setPublishing(false);
    if (res.success) {
      setPublished(true);
    } else {
      alert(res.message || 'Publishing failed');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="border-b border-[#E0CDB7] pb-6">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#9E7F55]">
          AI Editorial Assistant
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#142019] mt-1 font-light">
          Gemini Content Studio
        </h1>
        <p className="text-xs text-[#5F635F] mt-1">
          Powered by Google Gemini 1.5 Pro to draft French-colonial estate literature and guest dispatches.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Directives Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E0CDB7] shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#142019]">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <span>Editorial Directives</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#5F635F]">
                Editorial Topic / Headline
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-xl border border-[#E0CDB7] bg-[#FBF9F5] px-3.5 py-2 text-xs font-medium text-[#142019] outline-hidden focus:border-[#C5A880]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#5F635F]">
                Tone &amp; Register
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as EditorialTone)}
                className="w-full rounded-xl border border-[#E0CDB7] bg-[#FBF9F5] px-3.5 py-2 text-xs font-mono text-[#142019] outline-hidden focus:border-[#C5A880]"
              >
                <option value="editorial_luxury">Editorial Luxury (Quiet Elegance)</option>
                <option value="poetic_countryside">Poetic Countryside (Atmospheric)</option>
                <option value="architectural_heritage">Architectural Heritage (French Symmetry)</option>
                <option value="epicurean_gastronomy">Epicurean Gastronomy (Chandelier Dining)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#5F635F]">
                Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full rounded-xl border border-[#E0CDB7] bg-[#FBF9F5] px-3.5 py-2 text-xs font-mono text-[#142019] outline-hidden focus:border-[#C5A880]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#5F635F]">
                Sensory Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-[#E0CDB7] bg-[#FBF9F5] px-3.5 py-2 text-xs text-[#142019] outline-hidden focus:border-[#C5A880]"
              />
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#142019] py-3 text-xs font-semibold uppercase tracking-wider text-[#FBF9F5] hover:bg-[#23342A] transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{generating ? 'Gemini 1.5 Pro Composing...' : 'Generate Dispatch'}</span>
            </button>
          </form>
        </div>

        {/* Live Split-Pane Editor (7 Cols) */}
        <div className="lg:col-span-7">
          <StudioPreviewEditor
            article={article}
            onUpdateArticle={setArticle}
            onPublish={handlePublish}
            publishing={publishing}
            published={published}
          />
        </div>
      </div>
    </div>
  );
}
