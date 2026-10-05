'use server';

// Next.js Server Actions for Estate Dispatches & Blog Publishing
import { blogPostSchema } from '@/lib/validations/blog';
import { BlogEntity } from '@/types/database';
import { revalidatePath } from 'next/cache';
import { isSupabaseConfigured, createServerSupabaseClient } from '@/lib/supabase/server';

const memoryBlogs: BlogEntity[] = [
  {
    id: 'blog-1',
    slug: 'french-colonial-charm-in-manesar',
    title: 'The Architectural Symphony of French Colonial Heritage at The Kesari Bagh',
    excerpt: 'Discover how symmetry, brass hairlines, and French crystal chandeliers meet the ancient whispers of the Aravalli range in Manesar.',
    content: `# The Architectural Symphony of French Colonial Heritage

Tucked gently within the folds of Manesar's Aravalli foothills lies **The Kesari Bagh**, an intimate countryside sanctuary spread across 1.25 manicured acres.

Unlike conventional hospitality properties, The Kesari Bagh holds only **four keys**, guaranteeing unparalleled privacy for an estate capacity of no more than 16 distinguished guests.

### French Elegance Meets Countryside Solitude
Each suite is an intentional study in restraint:
- High French windows welcoming the morning mist
- Polished teak woodwork accented with brushed brass hairlines
- Private stone terraces overlooking our manicured lawns and the Aravalli horizon

Whether dining under the 12-seater crystal chandelier or watching the twilight descend over the pool, here time slows to an exquisite cadence.`,
    cover_image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80',
    author_name: 'The Estate Concierge',
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'blog-2',
    slug: 'encounter-with-elly-marwari-heritage',
    title: 'Elly: The Majestic Marwari Bloodline of The Kesari Bagh',
    excerpt: 'Standing 6ft 7in with distinctive inward-curling ears, meet Elly—our resident Marwari bloodline mare and estate symbol.',
    content: `# Elly: The Spirit of the Aravallis

At The Kesari Bagh, mornings are punctuated by the rhythmic hoofbeats of **Elly**, our magnificent 6ft 7in black Marwari mare. 

Distinguished by the lyrical inward-curving lyre-shaped ears that define pure Marwari lineage, Elly represents centuries of royal equestrian heritage. Guests are invited to participate in sunrise grooming sessions, serene paddock walks, and equestrian portraiture against the backdrop of ancient neem trees.`,
    cover_image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1600&q=80',
    author_name: 'The Equestrian Master',
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

export async function getBlogsAction(): Promise<BlogEntity[]> {
  return memoryBlogs;
}

export async function publishBlogAction(input: unknown) {
  try {
    const parsed = blogPostSchema.parse(input);
    const newBlog: BlogEntity = {
      id: `blog-${Date.now()}`,
      slug: parsed.slug,
      title: parsed.title,
      excerpt: parsed.excerpt,
      content: parsed.content,
      cover_image: parsed.coverImage,
      author_name: parsed.authorName,
      published: parsed.published,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    memoryBlogs.unshift(newBlog);

    if (isSupabaseConfigured()) {
      createServerSupabaseClient()
        .then((supabase) =>
          supabase.from('blogs').insert({
            id: newBlog.id,
            slug: newBlog.slug,
            title: newBlog.title,
            excerpt: newBlog.excerpt,
            content: newBlog.content,
            cover_image: newBlog.cover_image,
            author_name: newBlog.author_name,
            published: newBlog.published,
          })
        )
        .catch((err) => console.warn('[Supabase Sync Warn]:', err));
    }

    revalidatePath('/admin/studio');
    revalidatePath('/');
    return { success: true, blog: newBlog, message: 'Article published to estate dispatches' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Publishing failed';
    return { success: false, message: msg };
  }
}
