import React, { useState } from 'react';
import { X, Play, Pause, Bookmark, Music, Sparkles, Video, Share2, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { VideoItem } from '../types';

interface AudioDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundTitle: string;
  soundArtist: string;
  soundCoverUrl?: string;
  onUseSound: (soundTitle: string) => void;
  allVideos: VideoItem[];
  onSelectVideo: (videoId: string) => void;
}

export const AudioDetailModal: React.FC<AudioDetailModalProps> = ({
  isOpen,
  onClose,
  soundTitle,
  soundArtist,
  soundCoverUrl,
  onUseSound,
  allVideos,
  onSelectVideo,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Find videos using this sound or related
  const soundVideos = allVideos.filter(
    (v) =>
      v.soundTitle.toLowerCase().includes(soundTitle.toLowerCase()) ||
      soundTitle.toLowerCase().includes(v.soundTitle.toLowerCase())
  );
  const displayVideos = soundVideos.length > 0 ? soundVideos : allVideos.slice(0, 4);

  const handleShareSound = () => {
    navigator.clipboard.writeText(`https://pikpok.app/sound/${encodeURIComponent(soundTitle)}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-[#121212] border border-[#2A2A2A] rounded-3xl text-[#F8F8F8] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#242424] bg-[#0E0E0E] shrink-0">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-[#FFE100]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#8E8E93]">
              Trending Audio
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#222] text-[#8E8E93] hover:text-[#F8F8F8] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sound Showcase Card */}
        <div className="p-5 flex items-center gap-4 bg-gradient-to-b from-[#181818] to-[#121212] border-b border-[#242424] shrink-0">
          {/* Animated Rotating Vinyl Disc */}
          <div className="relative shrink-0">
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-tr from-[#111] via-[#222] to-[#0A0A0A] p-2 border-2 border-[#333] shadow-xl flex items-center justify-center ${
                isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
              }`}
            >
              {/* Disc Grooves */}
              <div className="w-full h-full rounded-full border border-[#444]/40 flex items-center justify-center overflow-hidden">
                <img
                  src={
                    soundCoverUrl ||
                    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80'
                  }
                  alt={soundTitle}
                  className="w-10 h-10 rounded-full object-cover border border-[#FFE100]"
                />
              </div>
            </div>

            {/* Play/Pause center overlay */}
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="absolute inset-0 m-auto w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-[#FFE100] cursor-pointer hover:scale-110 transition-transform"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>
          </div>

          {/* Info & Sound Stats */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-black text-[#F8F8F8] font-['Space_Grotesk'] truncate">
              {soundTitle}
            </h3>
            <p className="text-xs text-[#8E8E93] font-medium mt-0.5">{soundArtist}</p>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-[#FFE100] font-mono">
              <span>🔥 1.4M videos created</span>
            </div>

            {/* Waveform Equalizer Bars */}
            <div className="flex items-end gap-0.5 h-4 mt-2">
              {[60, 90, 40, 100, 70, 30, 85, 95, 50, 75, 100, 45, 80, 60, 90, 35].map(
                (h, i) => (
                  <span
                    key={i}
                    style={{ height: isPlaying ? `${h}%` : '20%' }}
                    className="w-1 bg-[#FFE100] rounded-full transition-all duration-300"
                  />
                )
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons: Use this sound & Bookmark */}
        <div className="p-4 flex items-center gap-2 border-b border-[#242424] bg-[#0A0A0A] shrink-0">
          <button
            onClick={() => {
              onClose();
              onUseSound(soundTitle);
            }}
            className="flex-1 py-2.5 rounded-xl bg-[#FFE100] hover:bg-[#F5D700] text-[#0A0A0A] font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Video className="w-4 h-4 fill-[#0A0A0A]" />
            <span>Use this Sound</span>
          </button>

          <button
            onClick={() => setIsSaved((s) => !s)}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isSaved
                ? 'bg-[#FFE100]/20 border-[#FFE100] text-[#FFE100]'
                : 'bg-[#181818] border-[#2A2A2A] text-[#8E8E93] hover:text-[#F8F8F8]'
            }`}
            title="Save to Favorites"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleShareSound}
            className="p-2.5 rounded-xl bg-[#181818] hover:bg-[#222] border border-[#2A2A2A] text-[#8E8E93] hover:text-[#F8F8F8] transition-colors cursor-pointer"
            title="Share Audio"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#FFE100]" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Videos Using this Sound Grid */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">
              Popular Videos with this sound
            </span>
            <span className="text-xs text-[#FFE100] font-mono">{displayVideos.length} trending</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {displayVideos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => {
                  onSelectVideo(vid.id);
                  onClose();
                }}
                className="group relative aspect-[9/14] rounded-xl bg-[#1A1A1A] overflow-hidden border border-[#242424] hover:border-[#FFE100] cursor-pointer transition-all"
              >
                <img
                  src={vid.posterUrl}
                  alt={vid.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 text-[10px] text-white font-bold flex items-center gap-1">
                  <Play className="w-3 h-3 fill-current text-[#FFE100]" />
                  <span>{vid.viewsCount || `${Math.round(vid.likesCount / 1000)}k`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
