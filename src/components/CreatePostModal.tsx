import React, { useState } from 'react';
import { X, Upload, Video, ShoppingBag, Music, Tag, Sparkles, Check, Image as ImageIcon, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { VideoItem, Product, Creator } from '../types';
import { MOCK_TRENDING_SOUNDS, CURRENT_USER } from '../data/mockSocialData';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (newVideo: VideoItem) => void;
  currentUser: Creator;
  preselectedSound?: string;
}

const PRESET_VIDEO_CLIPS = [
  {
    label: 'Cyber Neon Lights',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-1232-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
    category: 'Tech & Vibe',
  },
  {
    label: 'Streetwear Model',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-neon-illuminated-room-39875-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    category: 'Fashion',
  },
  {
    label: 'Skater Tricks NYC',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-skater-doing-tricks-in-a-skatepark-42485-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1520045884218-a66e632822bb?w=800&q=80',
    category: 'Social Reel',
  },
  {
    label: 'Morning Running Sprint',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-camera-on-a-running-track-40953-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    category: 'Fitness & Reel',
  },
  {
    label: 'Artisan Coffee Pour',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-serving-a-cup-of-black-coffee-42417-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
    category: 'Lifestyle',
  },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
  currentUser,
  preselectedSound,
}) => {
  // Dual Post Type: 'reel' vs 'shopping'
  const [postType, setPostType] = useState<'reel' | 'shopping'>('reel');

  // Video source
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(PRESET_VIDEO_CLIPS[0].videoUrl);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState(PRESET_VIDEO_CLIPS[0].posterUrl);

  // Caption & Sound
  const [caption, setCaption] = useState('');
  const [selectedSound, setSelectedSound] = useState(
    preselectedSound || MOCK_TRENDING_SOUNDS[0].title
  );

  // Tagged Product State (for E-Commerce Video)
  const [productTitle, setProductTitle] = useState('');
  const [productBrand, setProductBrand] = useState('My Studio');
  const [productPrice, setProductPrice] = useState('29.99');
  const [productOriginalPrice, setProductOriginalPrice] = useState('59.99');
  const [productCategory, setProductCategory] = useState('Tech & Gadgets');
  const [productBadge, setProductBadge] = useState('⚡ Flash Deal 50% OFF');
  const [productImageUrl, setProductImageUrl] = useState(
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80'
  );

  if (!isOpen) return null;

  // Handle preset select
  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    setVideoPreviewUrl(PRESET_VIDEO_CLIPS[idx].videoUrl);
    setPosterPreviewUrl(PRESET_VIDEO_CLIPS[idx].posterUrl);
  };

  // Handle local file upload preview
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(objectUrl);
      setPosterPreviewUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80');
    }
  };

  // Insert hashtag
  const handleAddTag = (tag: string) => {
    if (!caption.includes(tag)) {
      setCaption((prev) => (prev ? `${prev} ${tag}` : tag));
    }
  };

  // Submit Post
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    const currentSoundObj = MOCK_TRENDING_SOUNDS.find((s) => s.title === selectedSound);
    const isEcommerce = postType === 'shopping';

    let taggedProduct: Product | undefined = undefined;
    if (isEcommerce) {
      const priceNum = parseFloat(productPrice) || 29.99;
      const origNum = parseFloat(productOriginalPrice) || priceNum * 1.5;
      const discount = Math.max(10, Math.round(((origNum - priceNum) / origNum) * 100));

      taggedProduct = {
        id: 'prod-user-' + Date.now(),
        title: productTitle || 'Featured Creator Pick Item',
        brand: productBrand || currentUser.name,
        brandAvatar: currentUser.avatar,
        price: priceNum,
        originalPrice: origNum,
        discountPercent: discount,
        rating: 5.0,
        reviewCount: 1,
        salesCount: '1 sold',
        images: [productImageUrl || posterPreviewUrl],
        description: 'Exclusive product find featured on PikPok Shop Feed.',
        features: [
          'Direct creator recommendation with certified quality assurance',
          'Fast expedited shipping with tracking protection',
          'PikPok authentic verified purchase guarantee',
        ],
        variants: [
          {
            name: 'Standard Option',
            options: [{ label: 'Default', value: 'default', inStock: true }],
          },
        ],
        stock: 50,
        category: productCategory,
        freeShipping: true,
      };
    }

    const newVideoItem: VideoItem = {
      id: 'vid-user-' + Date.now(),
      videoUrl: videoPreviewUrl,
      posterUrl: posterPreviewUrl,
      creator: currentUser,
      caption: caption || (isEcommerce ? 'Check out this viral find on my shop! 🔥' : 'New reel vibes ✨ #fyp'),
      tags: caption.match(/#[a-zA-Z0-9_]+/g) || ['#pikpok', '#fyp', '#viral'],
      soundTitle: currentSoundObj?.title || selectedSound,
      soundArtist: currentSoundObj?.artist || 'Trending Audio',
      soundCoverUrl: currentSoundObj?.coverUrl,
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      viewsCount: '1',
      postType,
      isEcommerce,
      product: taggedProduct,
      badgeText: isEcommerce ? productBadge : undefined,
    };

    onPostCreated(newVideoItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-[#121212] border border-[#2A2A2A] rounded-3xl p-5 text-[#F8F8F8] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#242424] shrink-0">
          <div>
            <h2 className="text-base font-black font-['Space_Grotesk'] text-[#F8F8F8] flex items-center gap-2">
              <span>Create New Post</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFE100]/20 text-[#FFE100] border border-[#FFE100]/30">
                Creator Studio
              </span>
            </h2>
            <p className="text-[11px] text-[#8E8E93]">Choose post type: Pure Social Reel or Tagged E-Commerce</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#222222] text-[#8E8E93] hover:text-[#F8F8F8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body Scrollable */}
        <form onSubmit={handlePublish} className="flex-1 overflow-y-auto space-y-4 pt-3 pr-1">
          {/* Dual Post Type Selector Tabs */}
          <div className="p-1 rounded-2xl bg-[#0A0A0A] border border-[#2A2A2A] flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPostType('reel')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                postType === 'reel'
                  ? 'bg-[#1E1E1E] text-[#FFE100] border border-[#FFE100]/40 shadow-sm'
                  : 'text-[#8E8E93] hover:text-[#F8F8F8]'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Social Reel</span>
            </button>

            <button
              type="button"
              onClick={() => setPostType('shopping')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                postType === 'shopping'
                  ? 'bg-[#FFE100] text-[#0A0A0A] shadow-md'
                  : 'text-[#8E8E93] hover:text-[#F8F8F8]'
              }`}
            >
              <ShoppingBag className="w-4 h-4 fill-current" />
              <span>Tagged E-Commerce</span>
            </button>
          </div>

          {/* Type Explainer Badge */}
          <div className="text-[11px] p-2 rounded-xl bg-[#171717] border border-[#242424] text-[#D4D4D4] flex items-center gap-2">
            {postType === 'reel' ? (
              <>
                <Sparkles className="w-4 h-4 text-[#FFE100] shrink-0" />
                <span>Regular social video reel. <strong>Yellow Buy button is hidden</strong>.</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#FFE100] shrink-0" />
                <span>Tagged video shop item. Displays the <strong>Yellow Buy Now pod</strong> on screen!</span>
              </>
            )}
          </div>

          {/* Video Preview & Presets */}
          <div>
            <label className="text-xs font-bold text-[#E5E5E5] block mb-1.5">
              Select Video Reel Source
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* Mini Video Preview */}
              <div className="relative aspect-[9/12] rounded-xl bg-black overflow-hidden border border-[#2A2A2A]">
                <video
                  src={videoPreviewUrl}
                  poster={posterPreviewUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-[9px] font-mono text-[#FFE100] border border-[#333]">
                  Preview
                </div>
              </div>

              {/* Presets + File Upload */}
              <div className="flex flex-col gap-1.5 overflow-y-auto max-h-48 pr-1">
                <span className="text-[10px] uppercase font-bold text-[#8E8E93]">Choose Preset Clip:</span>
                {PRESET_VIDEO_CLIPS.map((clip, i) => (
                  <button
                    key={clip.label}
                    type="button"
                    onClick={() => handleSelectPreset(i)}
                    className={`p-1.5 rounded-lg text-left text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                      selectedPresetIndex === i
                        ? 'bg-[#1E1E1E] border-[#FFE100] text-[#FFE100]'
                        : 'bg-[#0E0E0E] border-[#222222] text-[#8E8E93] hover:text-[#F8F8F8]'
                    }`}
                  >
                    <span className="truncate">{clip.label}</span>
                    {selectedPresetIndex === i && <Check className="w-3 h-3 text-[#FFE100]" />}
                  </button>
                ))}

                {/* Upload Custom Video Button */}
                <label className="mt-1 p-2 rounded-lg bg-[#1A1A1A] border border-dashed border-[#3A3A3C] hover:border-[#FFE100] text-[#D4D4D4] text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#FFE100]" />
                  <span>Upload Local File</span>
                  <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Caption & Hashtags */}
          <div>
            <label className="text-xs font-bold text-[#E5E5E5] block mb-1">
              Caption & Hashtags
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write an engaging caption, reply to a comment, or share tips..."
              className="w-full bg-[#0A0A0A] border border-[#2E2E2E] focus:border-[#FFE100] rounded-xl p-2.5 text-xs text-[#F8F8F8] placeholder:text-[#8E8E93] focus:outline-none transition-colors"
            />
            {/* Quick Hashtag Chips */}
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {['#fyp', '#viral', '#trending', '#pikpokfinds', '#dance', '#tech', '#streetwear'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="px-2 py-0.5 rounded-md bg-[#1A1A1A] hover:bg-[#262626] text-[#8E8E93] hover:text-[#FFE100] text-[10px] font-bold border border-[#2E2E2E] cursor-pointer transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Trending Audio Selection */}
          <div>
            <label className="text-xs font-bold text-[#E5E5E5] flex items-center gap-1 mb-1">
              <Music className="w-3.5 h-3.5 text-[#FFE100]" />
              <span>Select Trending Sound Track</span>
            </label>
            <select
              value={selectedSound}
              onChange={(e) => setSelectedSound(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2E2E2E] focus:border-[#FFE100] rounded-xl px-3 py-2 text-xs text-[#F8F8F8] focus:outline-none"
            >
              {MOCK_TRENDING_SOUNDS.map((snd) => (
                <option key={snd.id} value={snd.title}>
                  ♫ {snd.title} — {snd.artist} ({snd.usageCount})
                </option>
              ))}
            </select>
          </div>

          {/* Tagged E-Commerce Fields (Only when postType === 'shopping') */}
          {postType === 'shopping' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-[#FFE100]/30 space-y-3"
            >
              <div className="flex items-center justify-between pb-1 border-b border-[#242424]">
                <span className="text-xs font-black text-[#FFE100] font-['Space_Grotesk'] flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 fill-current" />
                  <span>Product Tag Details (Yellow Cart)</span>
                </span>
                <span className="text-[10px] font-bold text-[#8E8E93]">Appears on video</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">Product Title</label>
                <input
                  type="text"
                  required={postType === 'shopping'}
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  placeholder="e.g. Wireless RGB Mechanical Gaming Keyboard"
                  className="w-full bg-[#171717] border border-[#2E2E2E] focus:border-[#FFE100] rounded-xl px-3 py-1.5 text-xs text-[#F8F8F8] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">Discounted Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required={postType === 'shopping'}
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="29.99"
                    className="w-full bg-[#171717] border border-[#2E2E2E] focus:border-[#FFE100] rounded-xl px-3 py-1.5 text-xs text-[#FFE100] font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productOriginalPrice}
                    onChange={(e) => setProductOriginalPrice(e.target.value)}
                    placeholder="59.99"
                    className="w-full bg-[#171717] border border-[#2E2E2E] focus:border-[#FFE100] rounded-xl px-3 py-1.5 text-xs text-[#8E8E93] line-through focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={productBrand}
                    onChange={(e) => setProductBrand(e.target.value)}
                    placeholder="Studio Brand"
                    className="w-full bg-[#171717] border border-[#2E2E2E] focus:border-[#FFE100] rounded-xl px-3 py-1.5 text-xs text-[#F8F8F8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">Promo Badge</label>
                  <input
                    type="text"
                    value={productBadge}
                    onChange={(e) => setProductBadge(e.target.value)}
                    placeholder="⚡ Flash Deal 50% OFF"
                    className="w-full bg-[#171717] border border-[#2E2E2E] focus:border-[#FFE100] rounded-xl px-3 py-1.5 text-xs text-[#F8F8F8] focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Publish Buttons */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#FFE100] hover:bg-[#F5D700] text-[#0A0A0A] font-black text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(255,225,0,0.25)] transition-all cursor-pointer"
            >
              {postType === 'shopping' ? (
                <>
                  <ShoppingBag className="w-4 h-4 fill-[#0A0A0A]" />
                  <span>Publish Shoppable Video</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Social Reel</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
