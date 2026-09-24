import React, { useState } from 'react';
import { X, Check, MessageSquare, Share2, Grid, ShoppingBag, Heart, Eye, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Creator, VideoItem, Product } from '../types';

interface CreatorProfileModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
  isFollowing: boolean;
  onToggleFollow: (handle: string) => void;
  onOpenDirectMessage: (creator: Creator) => void;
  allVideos: VideoItem[];
  onSelectVideo: (videoId: string) => void;
  onOpenCheckout: (product: Product) => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  creator,
  isOpen,
  onClose,
  isFollowing,
  onToggleFollow,
  onOpenDirectMessage,
  allVideos,
  onSelectVideo,
  onOpenCheckout,
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'shop' | 'liked'>('videos');
  const [copiedShare, setCopiedShare] = useState(false);

  if (!isOpen || !creator) return null;

  // Filter creator's videos
  const creatorVideos = allVideos.filter(
    (v) => v.creator.handle.toLowerCase() === creator.handle.toLowerCase()
  );

  // If none found for this creator, show related reels
  const displayVideos = creatorVideos.length > 0 ? creatorVideos : allVideos.slice(0, 4);

  // Filter creator's shop products
  const creatorProducts = displayVideos
    .filter((v) => v.product)
    .map((v) => v.product as Product);

  const handleShareProfile = () => {
    navigator.clipboard.writeText(`https://pikpok.app/${creator.handle}`);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-[#121212] border border-[#2A2A2A] rounded-3xl text-[#F8F8F8] shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Banner Area */}
        <div className="relative h-28 w-full bg-gradient-to-r from-[#242424] via-[#1A1A1A] to-[#2E2E2E] overflow-hidden shrink-0">
          {creator.bannerUrl && (
            <img
              src={creator.bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212]" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-[#0A0A0A]/70 hover:bg-[#1A1A1A] text-[#8E8E93] hover:text-[#F8F8F8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Details Area */}
        <div className="relative px-5 pb-3 shrink-0 -mt-10">
          {/* Avatar and Action Buttons Row */}
          <div className="flex items-end justify-between gap-3">
            <div className="relative">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-[#121212] shadow-xl bg-black"
              />
              {creator.isVerified && (
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#FFE100] text-[#0A0A0A] font-black text-xs flex items-center justify-center shadow-md">
                  ✓
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 pb-1">
              <button
                id="creator-follow-btn"
                onClick={() => onToggleFollow(creator.handle)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm ${
                  isFollowing
                    ? 'bg-[#1E1E1E] text-[#D4D4D4] border border-[#2E2E2E] hover:bg-[#252525]'
                    : 'bg-[#FFE100] hover:bg-[#F5D700] text-[#0A0A0A]'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>

              <button
                id="creator-message-btn"
                onClick={() => {
                  onClose();
                  onOpenDirectMessage(creator);
                }}
                className="p-2 rounded-xl bg-[#1E1E1E] hover:bg-[#252525] border border-[#2E2E2E] text-[#F8F8F8] cursor-pointer transition-colors"
                title="Send Direct Message"
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              <button
                onClick={handleShareProfile}
                className="p-2 rounded-xl bg-[#1E1E1E] hover:bg-[#252525] border border-[#2E2E2E] text-[#F8F8F8] cursor-pointer transition-colors"
                title="Share Creator Profile"
              >
                {copiedShare ? <Check className="w-4 h-4 text-[#FFE100]" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Name, Handle & Bio */}
          <div className="mt-2.5">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-[#F8F8F8] font-['Space_Grotesk']">
                {creator.name}
              </h2>
            </div>
            <p className="text-xs text-[#8E8E93] font-medium">{creator.handle}</p>
            <p className="text-xs text-[#D4D4D4] mt-2 leading-relaxed">
              {creator.bio || 'Creator on PikPok sharing viral trends, reels, and top curated finds.'}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-6 mt-3.5 py-2.5 px-4 rounded-2xl bg-[#0A0A0A] border border-[#222222]">
            <div className="text-center">
              <div className="text-sm font-black text-[#F8F8F8] font-['Space_Grotesk']">
                {creator.followers || '1.2M'}
              </div>
              <div className="text-[10px] text-[#8E8E93] uppercase font-bold">Followers</div>
            </div>
            <div className="w-[1px] h-6 bg-[#242424]" />
            <div className="text-center">
              <div className="text-sm font-black text-[#F8F8F8] font-['Space_Grotesk']">
                {creator.followingCount || '180'}
              </div>
              <div className="text-[10px] text-[#8E8E93] uppercase font-bold">Following</div>
            </div>
            <div className="w-[1px] h-6 bg-[#242424]" />
            <div className="text-center">
              <div className="text-sm font-black text-[#FFE100] font-['Space_Grotesk']">
                {creator.likesCount || '8.4M'}
              </div>
              <div className="text-[10px] text-[#8E8E93] uppercase font-bold">Total Likes</div>
            </div>
          </div>
        </div>

        {/* Profile Content Tabs */}
        <div className="flex items-center border-b border-[#242424] px-5 bg-[#0E0E0E] shrink-0">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
              activeTab === 'videos'
                ? 'border-[#FFE100] text-[#FFE100]'
                : 'border-transparent text-[#8E8E93] hover:text-[#F8F8F8]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Videos ({displayVideos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
              activeTab === 'shop'
                ? 'border-[#FFE100] text-[#FFE100]'
                : 'border-transparent text-[#8E8E93] hover:text-[#F8F8F8]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shop Showcase ({creatorProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('liked')}
            className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
              activeTab === 'liked'
                ? 'border-[#FFE100] text-[#FFE100]'
                : 'border-transparent text-[#8E8E93] hover:text-[#F8F8F8]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Liked</span>
          </button>
        </div>

        {/* Tab Content Display Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {activeTab === 'videos' && (
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
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Play views count */}
                  <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[10px] text-white font-bold">
                    <Eye className="w-3 h-3 text-[#FFE100]" />
                    <span>{vid.viewsCount || `${Math.round(vid.likesCount / 1000)}k`}</span>
                  </div>

                  {/* E-Commerce Yellow Cart Tag icon */}
                  {vid.isEcommerce && vid.product && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md bg-[#FFE100] text-[#0A0A0A] flex items-center justify-center shadow-md">
                      <ShoppingBag className="w-3 h-3 fill-current" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shop' && (
            <div className="space-y-2.5">
              {creatorProducts.length === 0 ? (
                <div className="text-center py-8 text-[#8E8E93] text-xs">
                  This creator has not tagged any shop products yet.
                </div>
              ) : (
                creatorProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-[#0A0A0A] border border-[#2A2A2A] hover:border-[#FFE100]/60 flex items-center gap-3 transition-colors"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-14 h-14 rounded-xl object-cover bg-black shrink-0 border border-[#2E2E2E]"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#F8F8F8] truncate">{p.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-black text-[#FFE100] font-['Space_Grotesk']">
                          ${p.price.toFixed(2)}
                        </span>
                        <span className="text-[11px] line-through text-[#8E8E93]">
                          ${p.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FFE100]/20 text-[#FFE100] font-bold">
                          {p.discountPercent}% OFF
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenCheckout(p);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#FFE100] hover:bg-[#F5D700] text-[#0A0A0A] font-black text-xs shrink-0 cursor-pointer shadow-md transition-all"
                    >
                      Buy Now
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'liked' && (
            <div className="grid grid-cols-3 gap-2">
              {allVideos.slice(0, 3).map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => {
                    onSelectVideo(vid.id);
                    onClose();
                  }}
                  className="relative aspect-[9/14] rounded-xl bg-[#1A1A1A] overflow-hidden border border-[#242424] cursor-pointer"
                >
                  <img src={vid.posterUrl} alt="Liked reel" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[10px] text-[#FF3B30] font-bold">
                    <Heart className="w-3 h-3 fill-current" />
                    <span>{vid.likesCount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
