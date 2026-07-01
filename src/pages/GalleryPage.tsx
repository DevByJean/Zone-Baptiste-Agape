import { useEffect, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { GalleryItem, Department } from '../types/database';

const DEPARTMENTS: Department[] = ['Tous', 'Hommes', 'Femmes', 'Jeunesse', 'Enfants'];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<Department>('Tous');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = supabase.from('gallery').select('*').order('created_at', { ascending: false });
    (filter === 'Tous' ? query : query.eq('department', filter))
      .then(({ data }) => { setItems(data ?? []); setLoading(false); });
  }, [filter]);

  return (
    <>
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xl flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X size={28} />
          </button>
          <img
            src={`${lightbox.image_url}?auto=compress&cs=tinysrgb&w=1400`}
            alt={lightbox.caption || ''}
            className="max-w-full max-h-full rounded-xl object-contain animate-slide-up"
            onClick={e => e.stopPropagation()}
          />
          {lightbox.caption && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2">
              {lightbox.caption}
            </div>
          )}
        </div>
      )}

      <section className="relative pt-32 pb-20 bg-teal-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-teal-300 mb-4">Photothèque</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-4">Notre galerie</h1>
          <p className="text-teal-200 text-lg max-w-xl">
            Revivez les moments forts de la vie de notre zone en images.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex flex-wrap gap-1 p-1 bg-gray-100 rounded-xl mb-10">
            {DEPARTMENTS.map(d => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ease-ios ${
                  filter === d
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-xl skeleton" style={{ height: `${150 + (i % 3) * 60}px` }} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <ZoomIn size={40} className="mx-auto mb-4 opacity-40" />
              <p>Aucune photo disponible pour ce filtre.</p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="relative break-inside-avoid rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setLightbox(item)}
                >
                  <img
                    src={`${item.image_url}?auto=compress&cs=tinysrgb&w=600`}
                    alt={item.caption || ''}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-teal-900/0 group-hover:bg-teal-900/50 transition-colors flex items-center justify-center">
                    <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
