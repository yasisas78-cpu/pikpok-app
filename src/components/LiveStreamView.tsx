import React, { useState, useEffect, useRef } from 'react';
import { Radio, X, Heart, Send, Gift, ShoppingBag, Eye, Users, ChevronRight, ChevronLeft, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LiveStreamItem, Product } from '../types';

interface LiveStreamViewProps {
  streams: LiveStreamItem[];
  onClose: () => void;
  onOpenCheckout: (product: Product) => void;
  followingMap: Record<string, boolean>;
  onToggleFollow: (handle: string) => void;
  initialProducts: Product[];
}

interface FloatingReaction {
  id: number;
  emoji: string;
  x: number;
}

export const LiveStreamView: React.FC<LiveStreamViewProps> = ({
  streams,
  onClose,
  onOpenCheckout,
  followingMap,
  onToggleFollow,
  initialProducts,
}) => {
  const [activeStreamIndex, setActiveStreamIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const currentStream = streams[activeStreamIndex] || streams[0];

  // Simulated live chat comments stream
  const [liveComments, setLiveComments] = useState<
    { id: string; user: string; text: string; badge?: string; isGift?: boolean }[]
  >([
    { id: '1', user: 'Liam_G', text: 'Does this come with the USB-C charger in the box?', badge: 'Top Fan 🏆' },
    { id: '2', user: 'Zoe_Aesthetic', text: 'Just copped!! The discount code actually worked 🔥' },
    { id: '3', user: 'TechSamurai', text: 'The sound quality on this is crazy good for 35 bucks' },
    { id: '4', user: 'Mia_99', text: 'Sent a Rose! 🌹🌹🌹', isGift: true },
  ]);

  const [inputComment, setInputComment] = useState('');
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Automatic incoming comments simulation
  useEffect(() => {
    const mockNames = ['Nova_K', 'Rider_09', 'Aria_V', 'Leo_Tokyo', 'Zara_Fit', 'PixelPete', 'Chloe_R'];
    const mockPhrases = [
      'Show the back ports please!! 🙏',
      'The neon RGB ring looks insane in dark room 💡',
      'How fast is shipping to Chicago? 📦',
      'Buying this for my sister birthday 🎁',
      'Sent ⚡ Lightning Boost!!',
      'Is there warranty on this? ⭐',
      'Obsessed with this livestream energy! ✨',
    ];

    const interval = setInterval(() => {
      const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
      const randomText = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
      const isGift = randomText.includes('Sent');

      setLiveComments((prev) => [
        ...prev.slice(-25),
        {
          id: 'live-' + Date.now(),
          user: randomName,
          text: randomText,
          isGift,
        },
      ]);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Auto scroll chat
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveComments]);

  // Send user comment
  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputComment.trim()) return;

    setLiveComments((prev) => [
      ...prev,
      {
        id: 'me-' + Date.now(),
        user: 'You ⚡',
        text: inputComment.trim(),
        badge: 'Shopper 🛍️',
      },
    ]);
    setInputComment('');
  };

  // Tap heart reaction
  const handleAddReaction = (emoji: string = '❤️') => {
    const id = Date.now() + Math.random();
    const x = Math.random() * 60 - 30; // slight random horizontal spread
    setFloatingReactions((prev) => [...prev, { id, emoji, x }]);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 1600);
  };

  // Associated product
  const pinnedProduct = initialProducts[0];

  return (
    <div className="relative w-full h-full bg-black flex flex-col justify-between overflow-hidden select-none">
      {/* Background Live Video */}
      <video
        key={currentStream.videoUrl}
        src={currentStream.videoUrl}
        poster={currentStream.posterUrl}
        autoPlay
        loop
        playsInline
        muted={isMuted}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Dim vignette gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none z-10" />

      {/* Top Header Bar */}
      <div className="relative z-20 flex items-center justify-between p-3.5 pt-4">
        {/* Creator Info Pill */}
        <div className="flex items-center gap-2 bg-[#0A0A0A]/75 backdrop-blur-md p-1 pr-3 rounded-full border border-[#2A2A2A]">
          <img
            src={currentStream.creator.avatar}
            alt={currentStream.creator.name}
            className="w-8 h-8 rounded-full object-cover border border-[#FFE100]"
          />
          <div className="flex flex-col min-w-0 max-w-[120px]">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-[#F8F8F8] truncate leading-tight">
                {currentStream.creator.name}
              </span>
            </div>
            <span className="text-[10px] text-[#FFE100] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-ping" />
              LIVE
            </span>
          </div>

          <button
            onClick={() => onToggleFollow(currentStream.creator.handle)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
              followingMap[currentStream.creator.handle]
                ? 'bg-[#222222] text-[#8E8E93]'
                : 'bg-[#FF3B30] text-white hover:bg-[#E02D22]'
            }`}
          >
            {followingMap[currentStream.creator.handle] ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Viewers & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A0A0A]/70 backdrop-blur-md border border-[#2A2A2A] text-xs font-mono font-bold text-[#D4D4D4]">
            <Eye className="w-3.5 h-3.5 text-[#FF3B30]" />
            <span>{currentStream.viewersCount}</span>
          </div>

          <button
            onClick={() => setIsMuted((m) => !m)}
            className="p-2 rounded-full bg-[#0A0A0A]/70 text-[#F8F8F8] border border-[#2A2A2A] hover:border-[#FFE100] transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#FF3B30]" /> : <Volume2 className="w-4 h-4 text-[#FFE100]" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#0A0A0A]/70 hover:bg-[#1A1A1A] text-[#F8F8F8] border border-[#2A2A2A] transition-colors cursor-pointer"
            title="Exit Live Stream"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stream Switcher Badges (if multiple streams) */}
      <div className="relative z-20 px-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {streams.map((st, idx) => (
            <button
              key={st.id}
              onClick={() => setActiveStreamIndex(idx)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                idx === activeStreamIndex
                  ? 'bg-[#FF3B30] text-white shadow-md'
                  : 'bg-[#121212]/80 text-[#8E8E93] border border-[#2A2A2A] hover:text-[#F8F8F8]'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>{st.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Center Spacer */}
      <div className="flex-1" />

      {/* Bottom Area: Pinned Product, Live Chat & Actions */}
      <div className="relative z-20 p-3.5 space-y-2.5">
        {/* Pinned Live Shopping Deal Banner */}
        {pinnedProduct && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-2.5 rounded-2xl bg-[#121212]/95 backdrop-blur-xl border border-[#FFE100]/40 flex items-center justify-between gap-3 shadow-[0_8px_24px_rgba(0,0,0,0.8)]"
          >
            <img
              src={pinnedProduct.images[0]}
              alt={pinnedProduct.title}
              className="w-11 h-11 rounded-xl object-cover bg-black shrink-0 border border-[#2E2E2E]"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-[#FF3B30] text-white uppercase tracking-wider">
                  Live Deal
                </span>
                <span className="text-xs font-bold text-[#F8F8F8] truncate">{pinnedProduct.title}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-black text-[#FFE100] font-['Space_Grotesk']">
                  ${pinnedProduct.price.toFixed(2)}
                </span>
                <span className="text-[11px] line-through text-[#8E8E93]">
                  ${pinnedProduct.originalPrice.toFixed(2)}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                  {pinnedProduct.discountPercent}% OFF
                </span>
              </div>
            </div>

            <button
              onClick={() => onOpenCheckout(pinnedProduct)}
              className="px-3.5 py-2 rounded-xl bg-[#FFE100] hover:bg-[#F5D700] text-[#0A0A0A] font-black text-xs shrink-0 flex items-center gap-1 transition-transform active:scale-95 cursor-pointer shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5 fill-[#0A0A0A]" />
              <span>Claim</span>
            </button>
          </motion.div>
        )}

        {/* Live Chat Comments Stream */}
        <div className="h-36 overflow-y-auto space-y-1.5 text-xs pr-2 scrollbar-none flex flex-col justify-end">
          {liveComments.map((c) => (
            <div
              key={c.id}
              className={`p-1.5 rounded-xl max-w-[85%] text-left backdrop-blur-md ${
                c.isGift
                  ? 'bg-gradient-to-r from-[#FF3B30]/30 to-[#FFE100]/20 border border-[#FFE100]/30 text-[#FFE100]'
                  : 'bg-[#0A0A0A]/65 text-[#F8F8F8] border border-[#242424]/60'
              }`}
            >
              <span className="font-bold text-[#FFE100] mr-1.5">
                {c.user}
                {c.badge && <span className="text-[9px] text-[#8E8E93] ml-1">[{c.badge}]</span>}:
              </span>
              <span className="text-[#E5E5E5] leading-tight">{c.text}</span>
            </div>
          ))}
          <div ref={commentsEndRef} />
        </div>

        {/* Bottom Input & Reactions Bar */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSendComment} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={inputComment}
              onChange={(e) => setInputComment(e.target.value)}
              placeholder="Chat with host or ask about deal..."
              className="w-full bg-[#121212]/80 border border-[#2A2A2A] focus:border-[#FFE100] rounded-full px-3.5 py-2 text-xs text-[#F8F8F8] placeholder:text-[#8E8E93] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputComment.trim()}
              className="p-2 rounded-full bg-[#FFE100] hover:bg-[#F5D700] disabled:opacity-30 text-[#0A0A0A] shrink-0 cursor-pointer disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-3.5 h-3.5 fill-current" />
            </button>
          </form>

          {/* Quick Gift Tip */}
          <button
            onClick={() => handleAddReaction('🎁')}
            className="p-2.5 rounded-full bg-[#1A1A1A]/80 hover:bg-[#2A2A2A] border border-[#2A2A2A] text-[#FFE100] shrink-0 cursor-pointer transition-transform active:scale-90"
            title="Send Gift"
          >
            <Gift className="w-4 h-4" />
          </button>

          {/* Floating Heart Reactions Generator */}
          <button
            onClick={() => handleAddReaction('❤️')}
            className="p-2.5 rounded-full bg-[#FF3B30]/20 hover:bg-[#FF3B30]/30 border border-[#FF3B30]/40 text-[#FF3B30] shrink-0 cursor-pointer transition-transform active:scale-125"
            title="Send Hearts"
          >
            <Heart className="w-4 h-4 fill-[#FF3B30]" />
          </button>
        </div>
      </div>

      {/* Floating Reactions Rising Up Right Edge */}
      <div className="absolute right-6 bottom-20 z-30 pointer-events-none w-16 h-72 overflow-hidden flex flex-col justify-end">
        <AnimatePresence>
          {floatingReactions.map((reaction) => (
            <motion.div
              key={reaction.id}
              initial={{ opacity: 1, y: 0, scale: 0.8, x: reaction.x }}
              animate={{ opacity: 0, y: -220, scale: 1.4, x: reaction.x + (Math.random() * 20 - 10) }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute text-2xl select-none"
            >
              {reaction.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
