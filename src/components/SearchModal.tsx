import React, { useState } from 'react';
import { Search, X, TrendingUp, Sparkles } from 'lucide-react';
import { VideoItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: VideoItem[];
  onSelectVideo: (index: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  videos,
  onSelectVideo,
}) => {
  const [query, setQuery] = useState('');

  const filteredVideos = videos.filter((v) => {
    const q = query.toLowerCase();
    const matchesProduct = v.product
      ? v.product.title.toLowerCase().includes(q) ||
        v.product.category.toLowerCase().includes(q)
      : false;
    return (
      matchesProduct ||
      v.creator.name.toLowerCase().includes(q) ||
      v.caption.toLowerCase().includes(q) ||
      v.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const popularTags = ['#pikpokfinds', '#aesthetictech', '#streetwear', '#glassskin', '#sneakers'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="relative w-full max-w-lg bg-[#121212] border border-[#2A2A2A] rounded-3xl p-4 text-[#F8F8F8] shadow-2xl z-10 space-y-4"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-2 px-3 py-2 bg-[#0A0A0A] rounded-2xl border border-[#2E2E2E] focus-within:border-[#FFE100] transition-colors">
              <Search className="w-4 h-4 text-[#FFE100] shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, viral tags, creators..."
                className="flex-1 bg-transparent text-sm text-[#F8F8F8] focus:outline-none placeholder:text-[#8E8E93]"
              />
              {query ? (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 hover:text-[#F8F8F8] text-[#8E8E93] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="text-xs text-[#8E8E93] hover:text-[#F8F8F8] cursor-pointer px-1 font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Trending tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[#8E8E93] flex items-center gap-1 text-[11px] font-bold shrink-0">
                <TrendingUp className="w-3 h-3 text-[#FFE100]" /> Trending:
              </span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag.replace('#', ''))}
                  className="px-2.5 py-1 rounded-full bg-[#1A1A1A] hover:bg-[#242424] text-[#D4D4D4] hover:text-[#FFE100] border border-[#2E2E2E] transition-colors shrink-0 text-[11px] font-bold cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div className="max-h-72 overflow-y-auto space-y-2 custom-scrollbar">
              {filteredVideos.length === 0 ? (
                <div className="text-center py-8 text-[#8E8E93] text-xs">
                  No matching video finds for "{query}"
                </div>
              ) : (
                filteredVideos.map((video) => {
                  const origIndex = videos.findIndex((v) => v.id === video.id);
                  return (
                    <div
                      key={video.id}
                      onClick={() => {
                        onSelectVideo(origIndex);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1A1A1A] transition-colors cursor-pointer border border-transparent hover:border-[#2E2E2E]"
                    >
                      <img
                        src={video.product ? video.product.images[0] : video.posterUrl}
                        alt={video.product ? video.product.title : video.caption}
                        className="w-12 h-12 rounded-lg object-cover bg-[#1E1E1E] shrink-0 border border-[#2E2E2E]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#F8F8F8] truncate">
                          {video.product ? video.product.title : video.caption}
                        </div>
                        <div className="text-[11px] text-[#8E8E93] mt-0.5 flex items-center gap-2">
                          {video.product ? (
                            <span className="text-[#FFE100] font-black font-['Space_Grotesk']">
                              ${video.product.price.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-[#8E8E93] text-[10px] uppercase font-bold px-1 py-0.2 rounded bg-[#222]">
                              Reel
                            </span>
                          )}
                          <span>by {video.creator.name}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black px-2 py-1 bg-[#FFE100] text-[#0A0A0A] rounded-lg shrink-0">
                        {video.product ? 'View Find' : 'Watch Reel'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
