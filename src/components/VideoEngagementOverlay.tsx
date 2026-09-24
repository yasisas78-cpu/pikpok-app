import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Plus,
  Check,
  Music2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { VideoItem, Creator } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface VideoEngagementOverlayProps {
  video: VideoItem;
  isLiked: boolean;
  likesCount: number;
  isSaved: boolean;
  isFollowing: boolean;
  isMuted: boolean;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onToggleFollow: () => void;
  onOpenComments: () => void;
  onOpenShare: () => void;
  onToggleMute: () => void;
  onOpenProfile: (creator: Creator) => void;
  onOpenAudio: (title: string, artist: string, cover?: string) => void;
}

export const VideoEngagementOverlay: React.FC<VideoEngagementOverlayProps> = ({
  video,
  isLiked,
  likesCount,
  isSaved,
  isFollowing,
  isMuted,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
  onOpenComments,
  onOpenShare,
  onToggleMute,
  onOpenProfile,
  onOpenAudio,
}) => {
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  const formatCount = (count: number) => {
    if (count >= 1_000_000) {
      return (count / 1_000_000).toFixed(1) + 'M';
    }
    if (count >= 1_000) {
      return (count / 1_000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const audioCover =
    video.soundCoverUrl ||
    video.product?.images[0] ||
    video.posterUrl;

  const handleAudioClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenAudio(video.soundTitle, video.soundArtist, audioCover);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenProfile(video.creator);
  };

  return (
    <>
      {/* Top Controls: Sound toggle & Live tag */}
      <div className="absolute top-16 right-3.5 z-30 flex flex-col items-end gap-2">
        <button
          id="sound-toggle-btn"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className="p-2.5 rounded-full bg-[#121212]/80 hover:bg-[#1E1E1E] backdrop-blur-md text-[#F8F8F8] border border-[#2A2A2A] transition-all shadow-lg active:scale-90 cursor-pointer"
          title={isMuted ? 'Unmute Video' : 'Mute Video'}
          aria-label={isMuted ? 'Unmute Video' : 'Mute Video'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-[#8E8E93]" />
          ) : (
            <Volume2 className="w-5 h-5 text-[#FFE100] animate-pulse" />
          )}
        </button>
      </div>

      {/* Right Side Vertical Action Rail */}
      <div className="absolute right-3 bottom-14 z-30 flex flex-col items-center gap-3.5 select-none">
        {/* Creator Profile Avatar + Follow Badge */}
        <div className="relative mb-1">
          <div
            onClick={handleProfileClick}
            className="w-12 h-12 rounded-full p-0.5 bg-[#FFE100] shadow-lg overflow-hidden border border-[#0A0A0A] cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src={video.creator.avatar}
              alt={video.creator.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <button
            id={`follow-creator-${video.creator.handle}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFollow();
            }}
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-transform active:scale-75 shadow-md cursor-pointer ${
              isFollowing
                ? 'bg-[#222222] text-[#E5E5E5] border border-[#3A3A3C]'
                : 'bg-[#FFE100] text-[#0A0A0A] hover:bg-[#F5D700]'
            }`}
            title={isFollowing ? 'Following' : 'Follow Creator'}
            aria-label={isFollowing ? 'Following' : 'Follow Creator'}
          >
            {isFollowing ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3 stroke-[3]" />}
          </button>
        </div>

        {/* Like Button */}
        <div className="flex flex-col items-center">
          <motion.button
            id="video-like-btn"
            whileTap={{ scale: 1.35 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike();
            }}
            className="p-2.5 rounded-full bg-[#121212]/75 hover:bg-[#1E1E1E] backdrop-blur-md border border-[#2A2A2A] transition-colors cursor-pointer text-[#F8F8F8]"
            aria-label="Like video"
          >
            <Heart
              className={`w-6 h-6 transition-colors duration-200 ${
                isLiked
                  ? 'fill-[#FF3B30] text-[#FF3B30] scale-110 drop-shadow-[0_0_12px_rgba(255,59,48,0.7)]'
                  : 'text-[#F8F8F8] stroke-[2]'
              }`}
            />
          </motion.button>
          <span className="text-[#F8F8F8] text-xs font-bold mt-1 tracking-tight drop-shadow-md">
            {formatCount(likesCount)}
          </span>
        </div>

        {/* Comments Button */}
        <div className="flex flex-col items-center">
          <motion.button
            id="video-comments-btn"
            whileTap={{ scale: 1.15 }}
            onClick={(e) => {
              e.stopPropagation();
              onOpenComments();
            }}
            className="p-2.5 rounded-full bg-[#121212]/75 hover:bg-[#1E1E1E] backdrop-blur-md border border-[#2A2A2A] transition-colors cursor-pointer text-[#F8F8F8]"
            aria-label="Open comments"
          >
            <MessageCircle className="w-6 h-6 text-[#F8F8F8] stroke-[2]" />
          </motion.button>
          <span className="text-[#F8F8F8] text-xs font-bold mt-1 tracking-tight drop-shadow-md">
            {formatCount(video.commentsCount)}
          </span>
        </div>

        {/* Bookmark / Save Button */}
        <div className="flex flex-col items-center">
          <motion.button
            id="video-save-btn"
            whileTap={{ scale: 1.2 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            className="p-2.5 rounded-full bg-[#121212]/75 hover:bg-[#1E1E1E] backdrop-blur-md border border-[#2A2A2A] transition-colors cursor-pointer text-[#F8F8F8]"
            aria-label="Save video"
          >
            <Bookmark
              className={`w-6 h-6 transition-colors duration-200 ${
                isSaved
                  ? 'fill-[#FFE100] text-[#FFE100] drop-shadow-[0_0_10px_rgba(255,225,0,0.8)]'
                  : 'text-[#F8F8F8] stroke-[2]'
              }`}
            />
          </motion.button>
          <span className="text-[#F8F8F8] text-xs font-bold mt-1 tracking-tight drop-shadow-md">
            {formatCount(isSaved ? video.savesCount + 1 : video.savesCount)}
          </span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center">
          <motion.button
            id="video-share-btn"
            whileTap={{ scale: 1.15 }}
            onClick={(e) => {
              e.stopPropagation();
              onOpenShare();
            }}
            className="p-2.5 rounded-full bg-[#121212]/75 hover:bg-[#1E1E1E] backdrop-blur-md border border-[#2A2A2A] transition-colors cursor-pointer text-[#F8F8F8]"
            aria-label="Share video"
          >
            <Share2 className="w-6 h-6 text-[#F8F8F8] stroke-[2]" />
          </motion.button>
          <span className="text-[#F8F8F8] text-xs font-bold mt-1 tracking-tight drop-shadow-md">
            {formatCount(video.sharesCount)}
          </span>
        </div>

        {/* Rotating Music Disc with Trending Audio Track */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          onClick={handleAudioClick}
          className="relative mt-1 w-11 h-11 rounded-full p-1 bg-gradient-to-tr from-[#111] via-[#222] to-[#0A0A0A] border-2 border-[#333] shadow-xl overflow-hidden cursor-pointer hover:scale-110 transition-transform"
          title={`Trending Sound: ${video.soundTitle} - ${video.soundArtist}`}
        >
          <img
            src={audioCover}
            alt="Audio Disc"
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-[#FFE100] border border-[#0A0A0A]" />
        </motion.div>
      </div>

      {/* Bottom Left Creator & Caption Info */}
      <div className="absolute left-3.5 bottom-3.5 z-20 max-w-[calc(100%-80px)] pr-2 text-[#F8F8F8] drop-shadow-md select-none">
        {/* Creator Handle and Verified Check */}
        <div 
          onClick={handleProfileClick}
          className="flex items-center gap-1.5 mb-1.5 cursor-pointer group w-fit"
        >
          <span className="font-extrabold text-sm sm:text-base tracking-tight group-hover:text-[#FFE100] transition-colors">
            {video.creator.name}
          </span>
          <span className="text-[#8E8E93] text-xs font-medium">
            {video.creator.handle}
          </span>
          {video.creator.isVerified && (
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#FFE100] text-[#0A0A0A] text-[9px] font-black">
              ✓
            </span>
          )}
        </div>

        {/* Caption with Expand toggle */}
        <p className="text-xs sm:text-sm text-[#E5E5E5] leading-relaxed font-normal">
          {isCaptionExpanded ? (
            video.caption
          ) : (
            <>
              {video.caption.slice(0, 85)}
              {video.caption.length > 85 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCaptionExpanded(true);
                  }}
                  className="font-bold text-[#FFE100] ml-1 hover:underline cursor-pointer"
                >
                  ...more
                </button>
              )}
            </>
          )}
        </p>

        {/* Audio Marquee Ticker */}
        <div
          onClick={handleAudioClick}
          className="flex items-center gap-2 mt-2 text-[#D4D4D4] text-xs cursor-pointer hover:text-[#FFE100] transition-colors group w-fit"
        >
          <Music2 className="w-3.5 h-3.5 text-[#FFE100] shrink-0 group-hover:scale-110 transition-transform" />
          <div className="overflow-hidden whitespace-nowrap w-48 text-[11px] font-medium tracking-wide">
            <span className="inline-block animate-[marquee_12s_linear_infinite]">
              {video.soundTitle} • {video.soundArtist} ♫ Trending Sound
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
