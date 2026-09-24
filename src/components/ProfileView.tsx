import React, { useState } from 'react';
import {
  User,
  Heart,
  Video,
  Bookmark,
  Flame,
  Clock,
  PlusCircle,
  ShoppingBag,
  Trash2,
  CheckCircle2,
  Edit3,
  Play,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';
import { UserProfile, UserUploadedVideo, Product, Language, VideoPost } from '../types';
import { translations } from '../data/translations';
import { SellerWallet } from './SellerWallet';

interface ProfileViewProps {
  profile: UserProfile;
  uploadedVideos: UserUploadedVideo[];
  likedVideos: VideoPost[];
  savedVideos: VideoPost[];
  savedProducts: Product[];
  onSelectVideo?: (video: VideoPost) => void;
  onRemoveSavedProduct: (id: string) => void;
  onBuyNowProduct: (product: Product) => void;
  onOpenStreakModal: () => void;
  onOpenCreateVideo: () => void;
  onUpdateProfile: (name: string, bio: string) => void;
  availableProducts: Product[];
  sellerId?: string;
  lang: Language;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  uploadedVideos,
  likedVideos,
  savedVideos,
  savedProducts,
  onSelectVideo,
  onRemoveSavedProduct,
  onBuyNowProduct,
  onOpenStreakModal,
  onOpenCreateVideo,
  onUpdateProfile,
  availableProducts,
  sellerId,
  lang
}) => {
  const t = translations[lang];
  const [activeProfileTab, setActiveProfileTab] = useState<'liked' | 'saved' | 'my_posts' | 'saved_products'>('liked');

  // Modals inside profile
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editBio, setEditBio] = useState(profile.bio[lang]);


  // Video preview modal
  const [previewVideo, setPreviewVideo] = useState<UserUploadedVideo | null>(null);

  // Expiration calculation for badge
  const expiry = profile.lastActiveTimestamp + 24 * 60 * 60 * 1000;
  const diffMs = Math.max(0, expiry - Date.now());
  const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
  const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const isExpiringSoon = diffMs > 0 && diffMs < 6 * 60 * 60 * 1000;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim()) {
      onUpdateProfile(editName.trim(), editBio.trim());
      setIsEditProfileOpen(false);
    }
  };

  return (
    <div className="w-full h-full bg-neutral-950 overflow-y-auto no-scrollbar pt-16 pb-20 px-4 text-white flex flex-col">
      {/* Profile Header Card */}
      <div className="flex flex-col items-center text-center relative pb-3 border-b border-neutral-800">
        {/* Avatar with Streak Flame Ring */}
        <div className="relative mb-2">
          <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-rose-500 to-pink-500 shadow-xl shadow-rose-500/20">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-full h-full rounded-full object-cover border-2 border-neutral-900"
            />
          </div>
          {/* Flame streak badge overlay */}
          <button
            onClick={onOpenStreakModal}
            className="absolute -bottom-1 -right-1 bg-neutral-900 border border-amber-500 text-amber-400 px-1.5 py-0.5 rounded-full text-[10px] font-black flex items-center space-x-0.5 shadow-lg animate-pulse"
            title="Click to view Streak & 24h Expiration Timer"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{profile.streakScore}</span>
          </button>
        </div>

        {/* Name and Handle */}
        <h2 className="text-base font-black text-white flex items-center space-x-1.5">
          <span>{profile.name}</span>
          <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[8px] font-black">
            ✓
          </span>
        </h2>
        <span className="text-xs text-neutral-400 font-medium">{profile.handle}</span>

        {/* Bio */}
        <p className="text-xs text-neutral-300 max-w-xs mt-2 leading-relaxed px-2">
          {profile.bio[lang]}
        </p>

        {/* Stats Row: Followers, Following, Total Likes */}
        <div className="flex items-center justify-center space-x-6 my-3 py-2 px-4 bg-neutral-900/80 rounded-2xl border border-neutral-800/80 w-full max-w-sm">
          <div className="flex flex-col items-center">
            <span className="text-sm font-black text-white">{profile.followersCount}</span>
            <span className="text-[10px] text-neutral-400">{t.followers}</span>
          </div>
          <div className="w-px h-6 bg-neutral-800" />
          <div className="flex flex-col items-center">
            <span className="text-sm font-black text-white">{profile.followingCount}</span>
            <span className="text-[10px] text-neutral-400">{t.followingCount}</span>
          </div>
          <div className="w-px h-6 bg-neutral-800" />
          <div className="flex flex-col items-center">
            <span className="text-sm font-black text-rose-400">{profile.totalLikesCount}</span>
            <span className="text-[10px] text-neutral-400">{t.totalLikes}</span>
          </div>
        </div>

        {/* SNAPCHAT-STYLE DAILY STREAK RETENTION HERO CARD */}
        <div
          id="profile-streak-hero-card"
          onClick={onOpenStreakModal}
          className={`w-full max-w-sm p-3 rounded-2xl border transition cursor-pointer shadow-lg relative overflow-hidden text-left mb-2 ${
            isExpiringSoon
              ? 'bg-gradient-to-r from-rose-950/80 to-amber-950/80 border-rose-500/60 shadow-rose-600/20'
              : 'bg-gradient-to-r from-neutral-900 to-neutral-900/90 border-amber-500/40 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md">
                <Flame className="w-6 h-6 fill-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-black text-white">
                    {profile.streakScore} {t.streakScoreLabel}
                  </span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded font-bold">
                    Level 2
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-neutral-300 mt-0.5">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>
                    ⏳ {hoursLeft}h {minutesLeft}m {t.hoursRemaining}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenStreakModal();
              }}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black rounded-lg transition"
            >
              Check Perks
            </button>
          </div>
        </div>

        {/* Profile Action Buttons */}
        <div className="flex items-center space-x-2 w-full max-w-sm">
          <button
            id="edit-profile-btn"
            onClick={() => setIsEditProfileOpen(true)}
            className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl border border-neutral-700 transition flex items-center justify-center space-x-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t.editProfile}</span>
          </button>

          <button
            id="profile-post-video-btn"
            onClick={onOpenCreateVideo}
            className="flex-1 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-extrabold rounded-xl shadow-md shadow-pink-600/20 transition flex items-center justify-center space-x-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.postVideoBtn}</span>
          </button>
        </div>

        {profile.role === 'seller' && sellerId && <div className="mt-3 w-full max-w-sm"><SellerWallet sellerId={sellerId} /></div>}
      </div>

      {/* DISTINCT PROFILE TABS: LIKED VIDEOS vs SAVED VIDEOS vs MY POSTS vs WISHLIST */}
      <div className="my-3 flex items-center justify-around border-b border-neutral-800 px-1 gap-1 overflow-x-auto no-scrollbar">
        {/* TAB 1: Liked Videos (Requirement 2) */}
        <button
          id="profile-tab-liked-videos"
          onClick={() => setActiveProfileTab('liked')}
          className={`flex-1 min-w-[76px] py-2.5 text-xs font-bold transition flex items-center justify-center space-x-1 border-b-2 ${
            activeProfileTab === 'liked'
              ? 'text-rose-500 border-rose-500'
              : 'text-neutral-400 border-transparent hover:text-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${activeProfileTab === 'liked' ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>
            {t.likedVideosTab} ({likedVideos.length})
          </span>
        </button>

        {/* TAB 2: Saved Videos (Requirement 2) */}
        <button
          id="profile-tab-saved-videos"
          onClick={() => setActiveProfileTab('saved')}
          className={`flex-1 min-w-[76px] py-2.5 text-xs font-bold transition flex items-center justify-center space-x-1 border-b-2 ${
            activeProfileTab === 'saved'
              ? 'text-amber-400 border-amber-400'
              : 'text-neutral-400 border-transparent hover:text-white'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${activeProfileTab === 'saved' ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>
            {t.savedVideosTab} ({savedVideos.length})
          </span>
        </button>

        {/* TAB 3: My Uploads */}
        <button
          id="profile-tab-uploaded-videos"
          onClick={() => setActiveProfileTab('my_posts')}
          className={`flex-1 min-w-[76px] py-2.5 text-xs font-bold transition flex items-center justify-center space-x-1 border-b-2 ${
            activeProfileTab === 'my_posts'
              ? 'text-pink-500 border-pink-500'
              : 'text-neutral-400 border-transparent hover:text-white'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>
            {t.uploadedVideosTab} ({uploadedVideos.length})
          </span>
        </button>

        {/* TAB 4: Saved Products Wishlist */}
        <button
          id="profile-tab-saved-products"
          onClick={() => setActiveProfileTab('saved_products')}
          className={`flex-1 min-w-[76px] py-2.5 text-xs font-bold transition flex items-center justify-center space-x-1 border-b-2 ${
            activeProfileTab === 'saved_products'
              ? 'text-cyan-400 border-cyan-400'
              : 'text-neutral-400 border-transparent hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>
            {t.savedProductsTab} ({savedProducts.length})
          </span>
        </button>
      </div>

      {/* TAB CONTENT 1: LIKED VIDEOS (Requirement 2: Dynamically render thumbnails & titles, clicking opens video) */}
      {activeProfileTab === 'liked' && (
        <div className="flex-1">
          {likedVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500 space-y-2 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <Heart className="w-6 h-6 text-neutral-600 stroke-1" />
              </div>
              <p className="text-xs font-bold text-neutral-300">{t.noLikedVideos}</p>
              <p className="text-[11px] text-neutral-500 max-w-xs">{t.noLikedVideosSub}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {likedVideos.map((vid) => (
                <div
                  key={vid.id}
                  id={`liked-video-${vid.id}`}
                  onClick={() => onSelectVideo ? onSelectVideo(vid) : setPreviewVideo({
                    id: vid.id,
                    title: vid.description[lang] || vid.description.en,
                    thumbnail: vid.posterUrl,
                    videoUrl: vid.videoUrl,
                    views: `${vid.sharesCount} shares`,
                    likes: vid.likesCount,
                    date: 'Saved from feed'
                  })}
                  className="relative aspect-[9/16] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800/80 cursor-pointer group hover:border-rose-500 transition shadow-sm hover:scale-[1.02]"
                >
                  <img
                    src={vid.posterUrl}
                    alt={vid.creator.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Play Indicator */}
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white shadow">
                    <Play className="w-3 h-3 fill-white translate-x-0.2" />
                  </div>

                  {/* Creator Avatar & Heart Badge */}
                  <div className="absolute top-2 left-2 flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-white/10">
                    <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                    <span className="text-[9px] font-bold text-white">
                      {vid.likesCount >= 1000 ? `${(vid.likesCount / 1000).toFixed(1)}k` : vid.likesCount}
                    </span>
                  </div>

                  {/* Video Title / Product Caption at bottom */}
                  <div className="absolute bottom-2 left-2 right-2 text-left">
                    <p className="text-[10px] font-bold text-white line-clamp-2 leading-tight drop-shadow">
                      {vid.product.title[lang] || vid.creator.name}
                    </p>
                    <span className="text-[9px] font-semibold text-rose-300 drop-shadow block mt-0.5">
                      {vid.creator.handle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: SAVED VIDEOS (Requirement 2: Dynamically render thumbnails & titles, clicking opens video) */}
      {activeProfileTab === 'saved' && (
        <div className="flex-1">
          {savedVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500 space-y-2 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-neutral-600 stroke-1" />
              </div>
              <p className="text-xs font-bold text-neutral-300">{t.noSavedVideos}</p>
              <p className="text-[11px] text-neutral-500 max-w-xs">{t.noSavedVideosSub}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {savedVideos.map((vid) => (
                <div
                  key={vid.id}
                  id={`saved-video-${vid.id}`}
                  onClick={() => onSelectVideo ? onSelectVideo(vid) : setPreviewVideo({
                    id: vid.id,
                    title: vid.description[lang] || vid.description.en,
                    thumbnail: vid.posterUrl,
                    videoUrl: vid.videoUrl,
                    views: `${vid.sharesCount} shares`,
                    likes: vid.likesCount,
                    date: 'Saved video'
                  })}
                  className="relative aspect-[9/16] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800/80 cursor-pointer group hover:border-amber-400 transition shadow-sm hover:scale-[1.02]"
                >
                  <img
                    src={vid.posterUrl}
                    alt={vid.creator.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Play Indicator */}
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white shadow">
                    <Play className="w-3 h-3 fill-white translate-x-0.2" />
                  </div>

                  {/* Bookmark Badge */}
                  <div className="absolute top-2 left-2 flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-white/10">
                    <Bookmark className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span className="text-[9px] font-bold text-amber-300">Saved</span>
                  </div>

                  {/* Video Title / Product Caption at bottom */}
                  <div className="absolute bottom-2 left-2 right-2 text-left">
                    <p className="text-[10px] font-bold text-white line-clamp-2 leading-tight drop-shadow">
                      {vid.product.title[lang] || vid.creator.name}
                    </p>
                    <span className="text-[9px] font-semibold text-amber-300 drop-shadow block mt-0.5">
                      Rs. {vid.product.pricePKR.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: UPLOADED VIDEOS GRID */}
      {activeProfileTab === 'my_posts' && (
        <div className="flex-1">
          {uploadedVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-neutral-500 space-y-2">
              <Video className="w-10 h-10 stroke-1" />
              <p className="text-xs font-semibold">{t.noUploadedVideos}</p>
              <button
                onClick={onOpenCreateVideo}
                className="mt-2 px-3 py-1.5 bg-pink-600 text-white rounded-xl text-xs font-bold"
              >
                {t.postVideoBtn}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5">
              {uploadedVideos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => setPreviewVideo(vid)}
                  className="relative aspect-[9/16] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer group hover:border-pink-500 transition shadow-sm"
                >
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Play Icon */}
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
                    <Play className="w-3 h-3 fill-white translate-x-0.2" />
                  </div>

                  {/* Views counter on bottom */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[10px] text-neutral-200">
                    <span className="font-bold flex items-center space-x-0.5">
                      <Play className="w-2.5 h-2.5" />
                      <span>{vid.views}</span>
                    </span>
                    <span className="font-bold flex items-center space-x-0.5 text-rose-400">
                      <Heart className="w-2.5 h-2.5 fill-rose-400" />
                      <span>{vid.likes}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: SAVED PRODUCTS WISHLIST */}
      {activeProfileTab === 'saved_products' && (
        <div className="flex-1">
          {savedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-neutral-500 space-y-2 text-center">
              <Bookmark className="w-10 h-10 stroke-1" />
              <p className="text-xs font-semibold">{t.noSavedProducts}</p>
              <p className="text-[11px] text-neutral-400 max-w-xs">{t.noSavedProductsSub}</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {savedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-2.5 flex items-center space-x-3 shadow-md"
                >
                  <img
                    src={prod.image}
                    alt={prod.title[lang]}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-neutral-800"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-pink-400 block">
                      {prod.categoryLabel[lang]}
                    </span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">
                      {prod.title[lang]}
                    </h4>
                    <div className="flex items-baseline space-x-1.5 mt-0.5">
                      <span className="text-xs font-black text-rose-400">
                        {t.pkr} {prod.pricePKR.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-neutral-500 line-through">
                        {t.pkr} {prod.originalPricePKR.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Buy Now (COD) & Remove */}
                  <div className="flex flex-col space-y-1 shrink-0">
                    <button
                      onClick={() => onBuyNowProduct(prod)}
                      className="px-3 py-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-[10px] font-black rounded-lg shadow-md transition"
                    >
                      {t.buyNow}
                    </button>
                    <button
                      onClick={() => onRemoveSavedProduct(prod.id)}
                      className="p-1 text-neutral-500 hover:text-rose-400 self-center transition"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: EDIT PROFILE */}
      {isEditProfileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsEditProfileOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800 mb-3">
              <h3 className="text-sm font-bold text-white">{t.editProfile}</h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl transition"
              >
                {t.saveChanges}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIDEO PREVIEW */}
      {previewVideo && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewVideo(null)}
        >
          <div
            className="w-full max-w-xs bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[9/16] bg-black">
              <video
                src={previewVideo.videoUrl}
                poster={previewVideo.thumbnail}
                className="w-full h-full object-cover"
                autoPlay
                loop
                playsInline
                controls
              />
              <button
                onClick={() => setPreviewVideo(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3">
              <h4 className="text-xs font-bold text-white line-clamp-1">{previewVideo.title}</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                {previewVideo.views} views • {previewVideo.likes} likes • {previewVideo.date}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
