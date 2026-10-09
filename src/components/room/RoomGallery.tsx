'use client';

// High-End Interactive Photography Gallery with Double-Bezel Framing
import { useState } from 'react';
import Image from 'next/image';
import { Camera, Eye } from 'lucide-react';
import { RoomDetailSpec } from '@/lib/data/room-details-data';

interface RoomGalleryProps {
  detail: RoomDetailSpec;
  roomName: string;
}

export function RoomGallery({ detail, roomName }: RoomGalleryProps) {
  const images = detail.galleryImages;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880]">
            Visual Chronicle
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#142019] font-light">
            Suite Architecture & Perspectives
          </h2>
        </div>
        <div className="text-xs font-mono text-[#5F635F] uppercase flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#C5A880]" />
          <span>Plate {activeIndex + 1} of {images.length}</span>
        </div>
      </div>

      {/* Primary Featured Frame with Double-Bezel */}
      <div className="rounded-[2rem] p-1.5 bg-[#F0EBE1] border border-[#C5A880]/30 shadow-md">
        <div className="relative h-[340px] sm:h-[480px] lg:h-[560px] w-full rounded-[calc(2rem-0.375rem)] overflow-hidden bg-black/5">
          <Image
            src={images[activeIndex].src}
            alt={images[activeIndex].alt}
            fill
            className="object-cover transition-all duration-700 ease-out"
            sizes="(max-width: 1024px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

          {/* Caption Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880] block">
                {roomName} • View Angle
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-light">
                {images[activeIndex].caption}
              </h3>
            </div>
            <div className="text-xs font-mono text-white/70">
              The Kesari Bagh Photography Archive
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation Strip */}
      <div className="grid grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`group text-left rounded-2xl p-1 transition-all duration-300 ${
              activeIndex === idx
                ? 'bg-[#142019] ring-2 ring-[#C5A880]'
                : 'bg-[#F0EBE1] hover:bg-[#C5A880]/40'
            }`}
          >
            <div className="relative h-20 sm:h-28 w-full rounded-xl overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 33vw, 20vw"
              />
              <div
                className={`absolute inset-0 transition-opacity ${
                  activeIndex === idx ? 'bg-transparent' : 'bg-black/25 group-hover:bg-transparent'
                }`}
              />
            </div>
            <div className="p-2 hidden sm:block">
              <span
                className={`text-[11px] font-mono truncate block ${
                  activeIndex === idx ? 'text-[#FBF9F5]' : 'text-[#5F635F]'
                }`}
              >
                0{idx + 1} • {img.alt}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
