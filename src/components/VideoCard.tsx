import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, AlertCircle } from 'lucide-react';
import { VideoItem, Product, Creator } from '../types';
import { YellowBuyButton } from './YellowBuyButton';
import { VideoEngagementOverlay } from './VideoEngagementOverlay';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

interface VideoCardProps {
  video: VideoItem;
  isActive: boolean;
  isLiked: boolean;
  likesCount: number;
  isSaved: boolean;
  isFollowing: boolean;
  isMuted: boolean;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onToggleFollow: () => void;
  onOpenCheckout: (product: Product) => void;
  onOpenComments: () => void;
  onOpenShare: () => void;
  onToggleMute: () => void;
  onOpenProfile: (creator: Creator) => void;
  onOpenAudio: (title: string, artist: string, cover?: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isActive,
  isLiked,
  likesCount,
  isSaved,
  isFollowing,
  isMuted,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
  onOpenCheckout,
  onOpenComments,
  onOpenShare,
  onToggleMute,
  onOpenProfile,
  onOpenAudio,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

  // Double tap detection
  const lastTapRef = useRef<number>(0);

  // Auto-play / pause when card becomes active or inactive
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isActive) {
      vid.currentTime = 0;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasError(false);
          })
          .catch((err) => {
            console.log('Video autoplay prevented or pending:', err);
            setIsPlaying(false);
          });
      }
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Track progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 1;
      setVideoProgress((current / duration) * 100);
    }
  };

  // Tap handler (Single tap: play/pause; Double tap: like + floating heart)
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap triggered
      if (!isLiked) {
        onToggleLike();
      }

      // Add floating heart at tap location
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newHeart: FloatingHeart = { id: now, x, y };
        setFloatingHearts((prev) => [...prev, newHeart]);

        setTimeout(() => {
          setFloatingHearts((prev) => prev.filter((h) => h.id !== now));
        }, 1000);
      }
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      // Single tap toggle play/pause after brief delay
      setTimeout(() => {
        if (lastTapRef.current === now) {
          togglePlayPause();
        }
      }, DOUBLE_TAP_DELAY + 20);
    }
  };

  const togglePlayPause = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      vid.play().then(() => setIsPlaying(true));
      setShowPlayIcon(false);
    } else {
      vid.pause();
      setIsPlaying(false);
      setShowPlayIcon(true);
    }
  };

  return (
    <div
      ref={containerRef}
      id={`video-card-${video.id}`}
      onClick={handleCardClick}
      className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden select-none cursor-pointer"
    >
      {/* Video Element with Fallback Poster */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.posterUrl}
        playsInline
        loop
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />

      {/* Fallback Poster & Ambient Simulation if video fails */}
      {hasError && (
        <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center">
          <img
            src={video.posterUrl}
            alt={video.caption}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
      )}

      {/* Gradient Overlays for readable text and TikTok atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-transparent to-[#0A0A0A]/85 pointer-events-none" />

      {/* Centered Play/Pause Overlay Indicator */}
      <AnimatePresence>
        {(!isPlaying || showPlayIcon) && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#121212]/75 backdrop-blur-md flex items-center justify-center text-[#F8F8F8] pointer-events-none z-30 shadow-2xl border border-[#2A2A2A]"
          >
            <Play className="w-8 h-8 fill-[#F8F8F8] ml-1 text-[#F8F8F8]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Double Tap Floating Heart Particles */}
      {floatingHearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ scale: 0, opacity: 1, y: 0 }}
          animate={{ scale: [0, 1.4, 1.2], opacity: [1, 1, 0], y: -80, rotate: [-10, 15] }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ left: heart.x - 30, top: heart.y - 30 }}
          className="absolute z-40 pointer-events-none text-[#FF3B30] drop-shadow-[0_0_15px_rgba(255,59,48,0.9)]"
        >
          <svg className="w-16 h-16 fill-[#FF3B30]" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}

      {/* Yellow Buy Button Overlay (Only for tagged e-commerce shopping videos) */}
      {video.isEcommerce && video.product && (
        <div className="absolute left-3.5 bottom-24 z-30 w-full">
          <YellowBuyButton
            product={video.product}
            badgeText={video.badgeText}
            onOpenCheckout={onOpenCheckout}
          />
        </div>
      )}

      {/* Video Engagement Overlay (Right Rail + Creator Info) */}
      <VideoEngagementOverlay
        video={video}
        isLiked={isLiked}
        likesCount={likesCount}
        isSaved={isSaved}
        isFollowing={isFollowing}
        isMuted={isMuted}
        onToggleLike={onToggleLike}
        onToggleSave={onToggleSave}
        onToggleFollow={onToggleFollow}
        onOpenComments={onOpenComments}
        onOpenShare={onOpenShare}
        onToggleMute={onToggleMute}
        onOpenProfile={onOpenProfile}
        onOpenAudio={onOpenAudio}
      />

      {/* Bottom Video Playback Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15 z-40">
        <div
          className="h-full bg-[#FFE100] transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(255,225,0,0.6)]"
          style={{ width: `${videoProgress}%` }}
        />
      </div>
    </div>
  );
};
