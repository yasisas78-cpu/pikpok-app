import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  ShoppingBag,
  ShoppingCart,
  Plus,
  Check,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Search,
  Settings,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  Truck,
  ShieldCheck,
  Sparkles,
  Star,
  Copy,
  PackageCheck,
  Globe,
  MapPin,
  User,
  Tag,
  CheckCircle2,
  Phone,
  Flame,
  ArrowRight,
  RefreshCw,
  Gift,
  Bookmark,
  House,
  Music2,
  Clock,
  PlusCircle,
  Users,
  MessageSquare,
  LogIn,
  LogOut
} from 'lucide-react';

import {
  Language,
  Product,
  CommentItem,
  VideoPost,
  CartItem,
  OrderDetails,
  UserProfile,
  UserUploadedVideo,
  ReelTab,
  PaymentMethod,
  AuthUser,
  Conversation
} from './types';
import { translations } from './data/translations';
import {
  PAKISTANI_CITIES,
  INITIAL_PRODUCTS,
  INITIAL_VIDEOS,
  INITIAL_USER_PROFILE,
  INITIAL_USER_VIDEOS,
  INITIAL_CONVERSATIONS
} from './data/products';
import { ProfileView } from './components/ProfileView';
import { StreakModal } from './components/StreakModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { InboxView } from './components/InboxView';
import { VideoUploadModal } from './components/VideoUploadModal';
import { ProductReviews } from './components/ProductReviews';
import { supabase } from './lib/supabase';
import { calculateDeliveryQuote } from './lib/marketplace';

const DEMO_AUTH_STORAGE_KEY = 'pikpok_demo_auth_user';

export default function App() {
  // Navigation & Language
  const [currentTab, setCurrentTab] = useState<'feed' | 'shop' | 'inbox' | 'profile'>('feed');
  const [lang, setLang] = useState<Language>('en');
  const [topFeedTab, setTopFeedTab] = useState<'following' | 'for-you' | 'friends'>('for-you');

  // Authentication State
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    if (supabase) return null;
    try {
      const stored = localStorage.getItem(DEMO_AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!supabase) return;

    const syncSessionUser = (sessionUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null) => {
      if (!sessionUser) {
        setAuthUser(null);
        return;
      }

      const metadataName = typeof sessionUser.user_metadata?.username === 'string'
        ? sessionUser.user_metadata.username
        : typeof sessionUser.user_metadata?.name === 'string' ? sessionUser.user_metadata.name : '';
      const metadataAvatar = typeof sessionUser.user_metadata?.avatar_url === 'string'
        ? sessionUser.user_metadata.avatar_url
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80';
      setAuthUser({
        id: sessionUser.id,
        name: metadataName || sessionUser.email?.split('@')[0] || 'PikPok User',
        emailOrPhone: sessionUser.email || '',
        avatar: metadataAvatar,
        role: sessionUser.user_metadata?.role === 'seller' ? 'seller' : 'buyer',
        method: 'email'
      });
    };

    supabase.auth.getSession().then(({ data }) => syncSessionUser(data.session?.user || null));
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      syncSessionUser(session?.user || null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // In-App Messaging & Conversations State
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const stored = localStorage.getItem('pikpok_conversations');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_CONVERSATIONS;
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Persist conversations
  useEffect(() => {
    try {
      localStorage.setItem('pikpok_conversations', JSON.stringify(conversations));
    } catch (e) {}
  }, [conversations]);

  // User Profile & Streak State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('pikpok_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_USER_PROFILE;
  });

  const [uploadedVideos, setUploadedVideos] = useState<UserUploadedVideo[]>(() => {
    const saved = localStorage.getItem('pikpok_uploaded_videos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_USER_VIDEOS;
  });

  const [savedProducts, setSavedProducts] = useState<Product[]>(() => {
    return [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[3]]; // initial saved items
  });

  // Requirement 1: Separate state arrays (likedVideos and savedVideos) to store the IDs of videos the user interacts with
  const [likedVideoIds, setLikedVideoIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('pikpok_liked_video_ids');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    // Default initial liked video (v1 and v3)
    return ['v1', 'v3'];
  });

  const [savedVideoIds, setSavedVideoIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('pikpok_saved_video_ids');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    // Default initial saved video (v2 and v4)
    return ['v2', 'v4'];
  });

  // Sync liked & saved IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pikpok_liked_video_ids', JSON.stringify(likedVideoIds));
    } catch (e) {}
  }, [likedVideoIds]);

  useEffect(() => {
    try {
      localStorage.setItem('pikpok_saved_video_ids', JSON.stringify(savedVideoIds));
    } catch (e) {}
  }, [savedVideoIds]);

  const [isStreakModalOpen, setIsStreakModalOpen] = useState<boolean>(false);

  // Video Feed State
  const [videos, setVideos] = useState<VideoPost[]>(() => {
    return INITIAL_VIDEOS.map((vid) => ({
      ...vid,
      isLiked: ['v1', 'v3'].includes(vid.id),
      isSaved: ['v2', 'v4'].includes(vid.id)
    }));
  });
  const [reelTab, setReelTab] = useState<ReelTab>('foryou');
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [showHeartOverlay, setShowHeartOverlay] = useState<boolean>(false);
  const [soundToast, setSoundToast] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(false);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState<boolean>(false);
  const [isVideoUploadOpen, setIsVideoUploadOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Checkout & Order State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutProductDirect, setCheckoutProductDirect] = useState<Product | null>(null);
  const [orderConfirmedData, setOrderConfirmedData] = useState<OrderDetails | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([
    { product: INITIAL_PRODUCTS[0], quantity: 1 }
  ]);
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [isPromoApplied, setIsPromoApplied] = useState<boolean>(false);

  // Comments & Toast
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);
  const [shareCopiedToast, setShareCopiedToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Shop View Filters
  const [shopCategory, setShopCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Video Ref
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const t = translations[lang];

  // Persist Profile to LocalStorage
  useEffect(() => {
    localStorage.setItem('pikpok_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('pikpok_uploaded_videos', JSON.stringify(uploadedVideos));
  }, [uploadedVideos]);

  // Toast Trigger
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;

    const refreshLikeCount = (videoId: string) => {
      void client.from('video_likes').select('video_id', { count: 'exact', head: true }).eq('video_id', videoId).then(({ count }) => {
        if (typeof count !== 'number') return;
        setVideos((prev) => prev.map((video) => video.id === videoId ? { ...video, likesCount: count } : video));
      });
    };

    const channel = client
      .channel('pikpok-video-engagement')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'video_likes' }, (payload) => {
        const row = (payload.new || payload.old) as { video_id?: string };
        if (row.video_id) refreshLikeCount(row.video_id);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'video_comments' }, (payload) => {
        const row = (payload.new || payload.old) as {
          id?: string;
          video_id?: string;
          body?: string;
          user_name?: string;
          user_avatar?: string;
        };
        if (!row.video_id || !row.id) return;
        const commentId = row.id;
        setVideos((prev) => prev.map((video) => {
          if (video.id !== row.video_id) return video;
          if (payload.eventType === 'DELETE') {
            const comments = video.commentsList.filter((comment) => comment.id !== commentId);
            return { ...video, commentsList: comments, commentsCount: comments.length };
          }
          if (video.commentsList.some((comment) => comment.id === commentId)) return video;
          const comment: CommentItem = {
            id: commentId,
            user: row.user_name || 'PikPok User',
            avatar: row.user_avatar || userProfile.avatar,
            city: 'Pakistan',
            text: row.body || '',
            likes: 1,
            timeAgo: 'Just now',
            verifiedBuyer: false
          };
          return { ...video, commentsList: [comment, ...video.commentsList], commentsCount: video.commentsCount + 1 };
        }));
      })
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [userProfile.avatar]);

  useEffect(() => {
    if (!supabase || !authUser) return;
    const client = supabase;
    void client.from('video_likes').select('video_id').eq('user_id', authUser.id).then(({ data }) => {
      if (!data) return;
      const remoteLikedIds = data.map((row) => row.video_id as string);
      setLikedVideoIds(remoteLikedIds);
      setVideos((prev) => prev.map((video) => ({ ...video, isLiked: remoteLikedIds.includes(video.id) })));
    });
  }, [authUser]);

  // Streak Expiry Countdown Monitoring
  const [streakTimeLeftMs, setStreakTimeLeftMs] = useState<number>(0);
  useEffect(() => {
    const checkTimer = () => {
      const expiry = userProfile.lastActiveTimestamp + 24 * 60 * 60 * 1000;
      const diff = expiry - Date.now();
      setStreakTimeLeftMs(Math.max(0, diff));

      // If timer reached 0 and streak was > 0, break streak to 0
      if (diff <= 0 && userProfile.streakScore > 0) {
        setUserProfile((prev) => ({
          ...prev,
          streakScore: 0
        }));
      }
    };

    checkTimer();
    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, [userProfile.lastActiveTimestamp, userProfile.streakScore]);

  // Daily Streak Handlers
  const handleExtendStreak = () => {
    setUserProfile((prev) => ({
      ...prev,
      streakScore: prev.streakScore + 1,
      lastActiveTimestamp: Date.now()
    }));
    triggerToast(t.streakExtendedSuccess);
  };

  const handleSimulateExpiry = () => {
    // Fast forward timestamp to 25 hours ago
    setUserProfile((prev) => ({
      ...prev,
      lastActiveTimestamp: Date.now() - 25 * 60 * 60 * 1000,
      streakScore: 0
    }));
    triggerToast(lang === 'ur' ? "24 گھنٹے کا وقت ختم ہو گیا! اسٹریک صفر ہو گئی۔" : "24h passed without activity! Streak reset to 0.");
  };

  const handleResetStreak = () => {
    setUserProfile((prev) => ({
      ...prev,
      streakScore: 0,
      lastActiveTimestamp: Date.now()
    }));
    triggerToast("Streak reset to 0.");
  };

  // User Post New Video & Boost Streak
  const handleCreateVideo = async (file: File, title: string, tags: string[], linkedProduct: Product) => {
    if (!authUser) throw new Error('Please sign in before publishing a video.');

    let videoId: string;
    let videoUrl: string;
    if (supabase) {
      const extension = file.name.split('.').pop() || 'mp4';
      const storagePath = `${authUser.id}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from('videos').upload(storagePath, file, {
        contentType: file.type,
        upsert: false
      });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('videos').getPublicUrl(storagePath);
      const { data: insertedVideo, error: insertError } = await supabase
        .from('videos')
        .insert({
          creator_id: authUser.id,
          title,
          tags,
          video_url: publicUrlData.publicUrl,
          poster_url: linkedProduct.image,
          product_id: linkedProduct.id
        })
        .select('id')
        .single();
      if (insertError || !insertedVideo) throw insertError || new Error('Video record could not be created.');
      videoId = insertedVideo.id;
      videoUrl = publicUrlData.publicUrl;
    } else {
      videoId = `demo_video_${Date.now()}`;
      videoUrl = URL.createObjectURL(file);
    }

    const newVideo: VideoPost = {
      id: videoId,
      videoUrl,
      posterUrl: linkedProduct.image,
      creator: {
        name: authUser.name,
        handle: `@${authUser.name.toLowerCase().replace(/\s+/g, '')}`,
        avatar: authUser.avatar,
        verified: false
      },
      description: { en: title, ru: title, ur: title },
      tags,
      soundTitle: 'Original sound',
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isSaved: false,
      isFollowed: false,
      product: linkedProduct,
      commentsList: []
    };
    setVideos((prev) => [newVideo, ...prev]);
    setUploadedVideos((prev) => [{
      id: videoId,
      title,
      thumbnail: linkedProduct.image,
      videoUrl,
      views: '0',
      likes: 0,
      date: 'Just now',
      linkedProductName: linkedProduct.title[lang]
    }, ...prev]);
    setUserProfile((prev) => ({ ...prev, streakScore: prev.streakScore + 1, lastActiveTimestamp: Date.now() }));
    triggerToast(`Video posted! Daily streak extended to ${userProfile.streakScore + 1}`);
  };

  // Update Profile Name / Bio
  const handleUpdateProfile = (name: string, bioText: string) => {
    setUserProfile((prev) => ({
      ...prev,
      name,
      bio: {
        ...prev.bio,
        [lang]: bioText
      }
    }));
    triggerToast(lang === 'ur' ? "پروفائل تبدیل ہو گئی!" : "Profile updated successfully!");
  };

  // Saved Products Bookmark Handlers
  const handleToggleSaveProduct = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isAlreadySaved = savedProducts.some((p) => p.id === product.id);
    if (isAlreadySaved) {
      setSavedProducts((prev) => prev.filter((p) => p.id !== product.id));
      triggerToast(t.savedItemRemoved);
    } else {
      setSavedProducts((prev) => [product, ...prev]);
      triggerToast(t.savedItemAdded);
    }
  };

  // Toggle Mute with visual sound toast
  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsMuted((prev) => {
      const next = !prev;
      setSoundToast(
        next
          ? lang === 'ur'
            ? 'آواز بند'
            : lang === 'ru'
            ? 'Awaz Band'
            : 'Muted'
          : lang === 'ur'
          ? 'آواز آن'
          : lang === 'ru'
          ? 'Awaz On'
          : 'Sound On'
      );
      return next;
    });
  };

  // Auto hide sound toast
  useEffect(() => {
    if (!soundToast) return;
    const timer = setTimeout(() => {
      setSoundToast(null);
    }, 1400);
    return () => clearTimeout(timer);
  }, [soundToast]);

  // Keyboard navigation for video reels
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentTab !== 'feed') return;
      if (isCommentsOpen || isShareOpen || isCheckoutOpen || isCartOpen || isProductDetailOpen || isStreakModalOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToNextVideo();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevVideo();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTab, currentVideoIndex, isCommentsOpen, isShareOpen, isCheckoutOpen, isCartOpen, isProductDetailOpen, isStreakModalOpen, lang]);

  // Filtered videos based on active Reel tab
  const filteredVideos = videos.filter((vid) => {
    if (reelTab === 'foryou') return true;
    if (reelTab === 'following') {
      return vid.isFollowed || (vid.feedCategory && vid.feedCategory.includes('following'));
    }
    if (reelTab === 'friends') {
      return vid.isFriend || (vid.feedCategory && vid.feedCategory.includes('friends'));
    }
    return true;
  });

  // Video playback management
  useEffect(() => {
    if (currentTab !== 'feed') {
      videoRefs.current.forEach((v) => v?.pause());
      return;
    }

    videoRefs.current.forEach((v, idx) => {
      if (!v) return;
      if (idx === currentVideoIndex) {
        v.muted = isMuted;
        if (isPlaying) {
          const playPromise = v.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else {
          v.pause();
        }
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [currentVideoIndex, isPlaying, isMuted, currentTab, reelTab]);

  const handleSelectReelTab = (tab: ReelTab) => {
    videoRefs.current.forEach((v) => {
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    });
    setReelTab(tab);
    setCurrentVideoIndex(0);
    setIsPlaying(true);
    setVideoProgress(0);
    setIsVideoLoading(false);
  };

  const currentVideo = filteredVideos[currentVideoIndex] || filteredVideos[0] || videos[0];

  const goToNextVideo = () => {
    if (currentVideoIndex < filteredVideos.length - 1) {
      setCurrentVideoIndex((prev) => prev + 1);
      setIsPlaying(true);
      setVideoProgress(0);
      setIsVideoLoading(false);
    }
  };

  const goToPrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex((prev) => prev - 1);
      setIsPlaying(true);
      setVideoProgress(0);
      setIsVideoLoading(false);
    }
  };

  // Wheel and swipe support for smooth reel flipping
  const isScrollingRef = useRef<boolean>(false);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (currentTab !== 'feed') return;
    if (isCommentsOpen || isShareOpen || isCheckoutOpen || isCartOpen || isProductDetailOpen || isStreakModalOpen) return;
    if (isScrollingRef.current) return;

    if (e.deltaY > 25) {
      isScrollingRef.current = true;
      goToNextVideo();
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 350);
    } else if (e.deltaY < -25) {
      isScrollingRef.current = true;
      goToPrevVideo();
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 350);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (currentTab !== 'feed') return;
    touchStartYRef.current = e.touches[0].clientY;
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null || touchStartXRef.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const diffY = touchStartYRef.current - touchEndY;
    const diffX = touchStartXRef.current - touchEndX;
    touchStartYRef.current = null;
    touchStartXRef.current = null;

    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 35) {
      if (diffY > 0) {
        goToNextVideo();
      } else {
        goToPrevVideo();
      }
    } else if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 55) {
      const tabs: ReelTab[] = ['foryou', 'following', 'friends'];
      const curIdx = tabs.indexOf(reelTab);
      if (diffX > 0 && curIdx < tabs.length - 1) {
        handleSelectReelTab(tabs[curIdx + 1]);
      } else if (diffX < 0 && curIdx > 0) {
        handleSelectReelTab(tabs[curIdx - 1]);
      }
    }
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    if (v.duration) {
      setVideoProgress((v.currentTime / v.duration) * 100);
    }
  };

  // Like Toggle by Target Video ID with Supabase persistence.
  const handleToggleLike = (targetId: string) => {
    if (!requireAuth() || !authUser || !supabase) return;
    const targetVideo = videos.find((video) => video.id === targetId);
    if (!targetVideo) return;
    const nowLiked = !targetVideo.isLiked;

    setVideos((prev) => prev.map((item) => item.id === targetId
      ? { ...item, isLiked: nowLiked, likesCount: nowLiked ? item.likesCount + 1 : Math.max(0, item.likesCount - 1) }
      : item));
    setLikedVideoIds((prev) => nowLiked ? [targetId, ...prev.filter((id) => id !== targetId)] : prev.filter((id) => id !== targetId));
    triggerToast(nowLiked ? t.videoLikedToast : t.videoUnlikedToast);

    if (nowLiked) {
      void supabase.from('video_likes').insert({ video_id: targetId, user_id: authUser.id }).then(({ error }) => {
        if (error) {
          setVideos((prev) => prev.map((item) => item.id === targetId ? { ...item, isLiked: false, likesCount: Math.max(0, item.likesCount - 1) } : item));
          setLikedVideoIds((prev) => prev.filter((id) => id !== targetId));
          triggerToast('Like could not be saved.');
        }
      });
    } else {
      void supabase.from('video_likes').delete().eq('video_id', targetId).eq('user_id', authUser.id).then(({ error }) => {
        if (error) triggerToast('Like could not be removed.');
      });
    }

    if (nowLiked) {
      setShowHeartOverlay(true);
      setTimeout(() => setShowHeartOverlay(false), 800);
    }
  };

  // Save Toggle by Target Video ID (Requirement 1: Add to savedVideos list; if un-saved, remove ID)
  const handleToggleSaveVideo = (targetId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let nowSaved = false;

    setVideos((prev) =>
      prev.map((item) => {
        if (item.id === targetId) {
          nowSaved = !item.isSaved;
          return {
            ...item,
            isSaved: nowSaved
          };
        }
        return item;
      })
    );

    setSavedVideoIds((prev) => {
      if (prev.includes(targetId)) {
        triggerToast(t.videoUnsavedToast);
        return prev.filter((id) => id !== targetId);
      } else {
        triggerToast(t.videoSavedToast);
        return [targetId, ...prev];
      }
    });
  };

  // Follow Creator Toggle by Target Video ID
  const handleToggleFollow = (targetId: string) => {
    setVideos((prev) =>
      prev.map((item) => {
        if (item.id === targetId) {
          const nextFollow = !item.isFollowed;
          triggerToast(
            nextFollow
              ? `Following ${item.creator.handle}`
              : `Unfollowed ${item.creator.handle}`
          );
          return {
            ...item,
            isFollowed: nextFollow
          };
        }
        return item;
      })
    );
  };

  // Add Comment with Supabase persistence and realtime delivery.
  const handleAddComment = async () => {
    if (!newCommentText.trim() || !currentVideo || !requireAuth() || !authUser || !supabase) return;
    setIsSubmittingComment(true);
    const { data, error } = await supabase.from('video_comments').insert({
      video_id: currentVideo.id,
      user_id: authUser.id,
      body: newCommentText.trim(),
      user_name: userProfile.name,
      user_avatar: userProfile.avatar
    }).select('id, body, user_name, user_avatar, created_at').single();
    setIsSubmittingComment(false);

    if (error || !data) {
      triggerToast(error?.message || 'Comment could not be posted.');
      return;
    }

    const newComment: CommentItem = {
      id: data.id,
      user: data.user_name,
      avatar: data.user_avatar,
      city: 'Pakistan',
      text: data.body,
      likes: 1,
      timeAgo: 'Just now',
      verifiedBuyer: false
    };
    setVideos((prev) => prev.map((item) => item.id === currentVideo.id && !item.commentsList.some((comment) => comment.id === newComment.id)
      ? { ...item, commentsCount: item.commentsCount + 1, commentsList: [newComment, ...item.commentsList] }
      : item));
    setNewCommentText('');
    triggerToast(lang === 'ur' ? 'تبصرہ بھیج دیا گیا!' : lang === 'ru' ? 'Tabsara shamil ho gaya!' : 'Comment posted!');
  };

  // Cart Operations
  const requireAuth = () => {
    if (authUser) return true;
    setIsAuthModalOpen(true);
    triggerToast('Please sign in to continue');
    return false;
  };

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!requireAuth()) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    triggerToast(
      lang === 'ur'
        ? `${product.title[lang].slice(0, 24)}... کارٹ میں شامل ہو گیا!`
        : `Added ${product.title[lang].slice(0, 24)}... to Cart!`
    );
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    if (!requireAuth()) return;
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    if (!requireAuth()) return;
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    triggerToast(lang === 'ur' ? "کارٹ سے نکال دیا گیا" : "Removed from Cart");
  };

  // Buy Now direct checkout
  const handleBuyNowDirect = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!requireAuth()) return;
    setCheckoutProductDirect(product);
    setIsProductDetailOpen(false);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Pricing Calculations
  const activeCheckoutItems: CartItem[] = checkoutProductDirect
    ? [{ product: checkoutProductDirect, quantity: 1 }]
    : cart;

  const subtotal = activeCheckoutItems.reduce(
    (acc, curr) => acc + curr.product.pricePKR * curr.quantity,
    0
  );

  const deliveryQuote = calculateDeliveryQuote({ zone: 'major-intercity', weightKg: 1 });
  const isFreeDelivery = false;
  const deliveryFee = deliveryQuote.total;
  const promoDiscount = isPromoApplied ? Math.round(subtotal * 0.1) : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - promoDiscount);
  const cartTotalItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleApplyPromo = () => {
    if (promoCodeInput.trim().toUpperCase() === 'PIKPOK10') {
      setIsPromoApplied(true);
      triggerToast(t.promoApplied);
    } else {
      triggerToast(lang === 'ur' ? "غلط کوڈ۔ 'PIKPOK10' استعمال کریں" : "Invalid Code. Try 'PIKPOK10'");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setShareCopiedToast(true);
    setTimeout(() => setShareCopiedToast(false), 2000);
    triggerToast(t.copied);
  };

  const handleShareWhatsApp = () => {
    if (!currentVideo) return;
    const text = encodeURIComponent(
      `Check out this viral deal on PikPok!\n🛍️ ${currentVideo.product.title[lang]}\n💰 Only Rs. ${currentVideo.product.pricePKR.toLocaleString()} (Cash on Delivery Available)\nWatch here: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const filteredProducts = INITIAL_PRODUCTS.filter((prod) => {
    const matchesCategory = shopCategory === 'all' || prod.category === shopCategory;
    const matchesSearch =
      prod.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.title.ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.title.ur.includes(searchQuery) ||
      prod.categoryLabel.en.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Chat & Messaging Handlers
  const handleSendMessage = (conversationId: string, text: string) => {
    const newMsg = {
      id: `m_${Date.now()}`,
      sender: 'buyer' as const,
      text,
      timestamp: 'Just now'
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );
    triggerToast(t.messageSentToast);

    // Simulate Seller automatic response after 1.5s
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            const replies = [
              "Ji bilkul available hai! Aap foran order book kar lein, COD parcel kal dispatch ho jayega.",
              "Special discount deal active hai! Aap cash on delivery par confirm karein.",
              "TCS / Leopards courier ke zariye 2-3 dino mein deliver ho jayega. Shukriya!",
              "Ji 100% original product hai with 7 days money back replacement guarantee."
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const sellerReply = {
              id: `m_${Date.now() + 1}`,
              sender: 'seller' as const,
              text: randomReply,
              timestamp: 'Just now'
            };
            return {
              ...c,
              lastMessage: randomReply,
              lastMessageTime: 'Just now',
              messages: [...c.messages, sellerReply]
            };
          }
          return c;
        })
      );
    }, 1500);
  };

  // Open or create a chat with seller regarding a product
  const handleOpenChatForProduct = (product: Product, sellerName?: string) => {
    // Check if conversation already exists for this product
    const existing = conversations.find((c) => c.product?.id === product.id);
    if (existing) {
      setActiveConversationId(existing.id);
      setCurrentTab('inbox');
      setIsProductDetailOpen(false);
      return;
    }

    // Create new conversation
    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      sellerId: `seller_${product.id}`,
      sellerName: sellerName || "Verified Shopkeeper PK",
      sellerShopName: `${product.categoryLabel.en} Store`,
      sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      sellerVerified: true,
      product: {
        id: product.id,
        title: product.title[lang] || product.title.en,
        image: product.image,
        pricePKR: product.pricePKR
      },
      lastMessage: "Conversation started about this product",
      lastMessageTime: "Just now",
      unreadCount: 0,
      messages: [
        {
          id: `m_init_${Date.now()}`,
          sender: 'system',
          text: `Inquiring about ${product.title[lang] || product.title.en} (Rs. ${product.pricePKR.toLocaleString()})`,
          timestamp: 'Just now'
        }
      ]
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setCurrentTab('inbox');
    setIsProductDetailOpen(false);
  };

  // Authentication Handlers
  const handleLoginSuccess = (user: AuthUser) => {
    setAuthUser(user);
    if (!supabase) {
      localStorage.setItem(DEMO_AUTH_STORAGE_KEY, JSON.stringify(user));
    }
    setUserProfile((prev) => ({
      ...prev,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      emailOrPhone: user.emailOrPhone
    }));
    triggerToast(t.authSuccessToast);
  };

  const handleSignOut = () => {
    void supabase?.auth.signOut();
    localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
    setAuthUser(null);
    triggerToast(t.authSignOutToast);
  };

  return (
    <div
      dir={lang === 'ur' ? 'rtl' : 'ltr'}
      className={`h-screen overflow-hidden bg-neutral-950 text-white flex flex-col items-center justify-start select-none relative ${
        lang === 'ur' ? "font-['Noto_Sans_Arabic',sans-serif]" : "font-sans"
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast-notification"
          className="fixed top-6 z-50 px-4 py-2 bg-neutral-900/95 border border-pink-500 text-white rounded-full shadow-2xl backdrop-blur-md text-xs font-bold flex items-center space-x-2 animate-bounce"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CLEAN TIKTOK-STYLE TOP HEADER */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-gradient-to-b from-black/70 via-black/25 to-transparent px-4 text-white">
        <button onClick={() => setCurrentTab('feed')} className="flex items-center gap-2" aria-label="PikPok home">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-400 text-lg font-black shadow-lg shadow-pink-500/20">P</span>
          <span className="text-sm font-black tracking-wide">PikPok</span>
        </button>

        {currentTab === 'feed' && (
          <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3 text-xs font-bold">
            {([
              ['following', 'Following'],
              ['for-you', 'For You'],
              ['friends', 'Friends']
            ] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => {
                  setTopFeedTab(id);
                  handleSelectReelTab(id === 'following' ? 'following' : id === 'friends' ? 'friends' : 'foryou');
                }}
                className={`relative whitespace-nowrap px-1 py-2 ${topFeedTab === id ? 'text-white' : 'text-white/55 hover:text-white'}`}
              >
                {label}
                {topFeedTab === id && <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.9)]" />}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1">
          <button onClick={() => setCurrentTab('shop')} className="rounded-full p-2 text-white/90 hover:bg-white/10" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
          <button onClick={() => setCurrentTab('shop')} className="rounded-full p-2 text-white/90 hover:bg-white/10" aria-label="Open shop">
            <ShoppingBag className="h-5 w-5" />
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="rounded-full p-2 text-white/90 hover:bg-white/10" aria-label="Open settings">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main
        className="relative flex h-screen min-h-screen w-full max-w-none flex-1 flex-col items-center justify-center overflow-hidden bg-black"
      >
        {/* VIEW 1: VIDEO FEED */}
        {currentTab === 'feed' && (
          <div className="relative w-full h-full bg-black overflow-hidden flex flex-col justify-between">
            {filteredVideos.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-neutral-950">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-pink-500 mb-3 shadow-lg">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  {reelTab === 'following' ? t.noFollowingVideos : t.noFriendsVideos}
                </h3>
                <p className="text-xs text-neutral-400 max-w-xs mb-4">
                  {reelTab === 'following'
                    ? 'Follow creators in the For You feed to see their latest product reels here.'
                    : 'Connect with friends on PikPok to watch and share reels together.'}
                </p>
                <button
                  id="empty-feed-explore-btn"
                  onClick={() => handleSelectReelTab('foryou')}
                  className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-full text-xs font-bold transition shadow-lg shadow-pink-600/30 flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.followToSeeMore}</span>
                </button>
              </div>
            ) : (
              <>
                <div
                  className="absolute inset-0 z-0 bg-neutral-950 cursor-pointer select-none"
                  onClick={togglePlayPause}
                  onWheel={handleWheel}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {filteredVideos.map((vid, idx) => (
                    <div
                      key={vid.id}
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        idx === currentVideoIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <video
                        ref={(el) => {
                          videoRefs.current[idx] = el;
                        }}
                        src={vid.videoUrl}
                        poster={vid.posterUrl}
                        className="w-full h-full object-cover"
                        loop
                        playsInline
                        preload={idx === currentVideoIndex ? 'auto' : 'metadata'}
                        muted={isMuted}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={goToNextVideo}
                        onWaiting={() => {
                          if (idx === currentVideoIndex) setIsVideoLoading(true);
                        }}
                        onPlaying={() => {
                          if (idx === currentVideoIndex) setIsVideoLoading(false);
                        }}
                        onLoadedData={() => {
                          if (idx === currentVideoIndex) setIsVideoLoading(false);
                        }}
                      />
                      <div
                        className="absolute inset-0 bg-cover bg-center -z-10 filter blur-xl opacity-40 scale-105"
                        style={{ backgroundImage: `url(${vid.posterUrl})` }}
                      />
                    </div>
                  ))}

                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/90 z-10" />

                  {/* Video Buffering Spinner */}
                  {isVideoLoading && isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                      <div className="w-12 h-12 rounded-full border-3 border-pink-500/30 border-t-pink-500 animate-spin" />
                    </div>
                  )}

                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-110 shadow-2xl transition">
                        <Play className="w-8 h-8 fill-white translate-x-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Sound Indicator Overlay Toast */}
                  {soundToast && (
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs font-bold flex items-center space-x-2 shadow-2xl transition duration-200 pointer-events-none">
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-neutral-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-pink-400" />
                      )}
                      <span>{soundToast}</span>
                    </div>
                  )}

                  {showHeartOverlay && (
                    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                      <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-[0_0_25px_rgba(244,63,94,0.9)] animate-heart" />
                    </div>
                  )}
                </div>

                {/* Top Video Controls: Sound Mute */}
                <div className="relative z-20 pt-14 px-4 flex items-center justify-between pointer-events-auto">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-600/90 text-white backdrop-blur-sm border border-pink-400/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping mr-1" />
                      LIVE DEAL
                    </span>
                    <span className="text-[11px] font-medium text-neutral-300 drop-shadow">
                      {currentVideoIndex + 1} / {filteredVideos.length}
                    </span>
                  </div>

                  <button
                    id="mute-unmute-btn"
                    onClick={toggleMute}
                    className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition"
                    aria-label="Toggle Sound"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-neutral-300" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-pink-400" />
                    )}
                  </button>
                </div>

                {/* Vertical Video Navigation Arrows */}
                <div className="absolute top-1/2 -translate-y-1/2 left-2 z-20 flex flex-col space-y-2 pointer-events-auto opacity-70 hover:opacity-100 transition">
                  <button
                    id="btn-prev-video"
                    disabled={currentVideoIndex === 0}
                    onClick={goToPrevVideo}
                    className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-black/70 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Previous Video"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    id="btn-next-video"
                    disabled={currentVideoIndex === filteredVideos.length - 1}
                    onClick={goToNextVideo}
                    className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-black/70 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Next Video"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Right Sidebar Overlay Controls */}
                <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center space-y-2.5 pointer-events-auto">
                  {/* Creator Profile Avatar */}
                  <div className="relative mb-1">
                    <img
                      src={currentVideo.creator.avatar}
                      alt={currentVideo.creator.name}
                      className="w-11 h-11 rounded-full border-2 border-pink-500 object-cover shadow-lg"
                    />
                    <button
                      id="feed-follow-btn"
                      onClick={() => handleToggleFollow(currentVideo.id)}
                      className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center transition shadow-md ${
                        currentVideo.isFollowed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-red-500 text-white hover:scale-110'
                      }`}
                      aria-label="Follow Creator"
                    >
                      {currentVideo.isFollowed ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <Plus className="w-3 h-3 stroke-[3]" />
                      )}
                    </button>
                  </div>

                  {/* Like Button */}
                  <div className="flex flex-col items-center">
                    <button
                      id="feed-like-btn"
                      onClick={() => handleToggleLike(currentVideo.id)}
                      className={`w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center transition active:scale-75 ${
                        currentVideo.isLiked || likedVideoIds.includes(currentVideo.id)
                          ? 'text-rose-500'
                          : 'text-white hover:text-rose-400'
                      }`}
                      aria-label="Like Video"
                    >
                      <Heart
                        className={`w-6 h-6 transition-all ${
                          currentVideo.isLiked || likedVideoIds.includes(currentVideo.id)
                            ? 'fill-rose-500 text-rose-500 scale-110 drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]'
                            : ''
                        }`}
                      />
                    </button>
                    <span className="text-[11px] font-bold text-white mt-0.5 drop-shadow-md">
                      {currentVideo.likesCount >= 1000
                        ? `${(currentVideo.likesCount / 1000).toFixed(1)}k`
                        : currentVideo.likesCount}
                    </span>
                  </div>

              {/* Comment Button */}
              <div className="flex flex-col items-center">
                <button
                  id="feed-comment-btn"
                  onClick={() => setIsCommentsOpen(true)}
                  className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-cyan-400 transition active:scale-75"
                  aria-label="Open Comments"
                >
                  <MessageCircle className="w-6 h-6" />
                </button>
                <span className="text-[11px] font-bold text-white mt-0.5 drop-shadow-md">
                  {currentVideo.commentsCount}
                </span>
              </div>

              {/* Bookmark / Save Video (Requirement 1: When user clicks Save, video is added to savedVideos list, un-saving removes it) */}
              <div className="flex flex-col items-center">
                <button
                  id="feed-save-video-btn"
                  onClick={(e) => handleToggleSaveVideo(currentVideo.id, e)}
                  className={`w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center transition active:scale-75 ${
                    savedVideoIds.includes(currentVideo.id)
                      ? 'text-amber-400'
                      : 'text-white hover:text-amber-400'
                  }`}
                  title="Save video to Profile"
                  aria-label="Save Video"
                >
                  <Bookmark
                    className={`w-6 h-6 ${
                      savedVideoIds.includes(currentVideo.id)
                        ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                        : ''
                    }`}
                  />
                </button>
                    <span className="text-[10px] font-semibold text-white mt-0.5 drop-shadow-md">
                      {savedVideoIds.includes(currentVideo.id) ? 1 : 0}
                </span>
              </div>

              {/* Share Button */}
              <div className="flex flex-col items-center">
                <button
                  id="feed-share-btn"
                  onClick={() => setIsShareOpen(true)}
                  className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-amber-400 transition active:scale-75"
                  aria-label="Share Video"
                >
                  <Share2 className="w-6 h-6" />
                </button>
                <span className="text-[11px] font-bold text-white mt-0.5 drop-shadow-md">
                  {currentVideo.sharesCount >= 1000
                    ? `${(currentVideo.sharesCount / 1000).toFixed(1)}k`
                    : currentVideo.sharesCount}
                </span>
              </div>

              {/* Spinning Sound Disc */}
              <div className="w-9 h-9 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center p-1 shadow-xl animate-spin-slow">
                <img
                  src={currentVideo.product.image}
                  alt="Track"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            {/* Bottom Floating Product Overlay */}
            <div className="absolute left-0 bottom-7 z-20 w-[calc(100%-5.5rem)] px-3 pb-1 flex flex-col justify-end pointer-events-auto space-y-1.5">
              <div
                id="floating-product-card"
                className="bg-black/60 hover:bg-black/75 backdrop-blur-xl border border-white/15 rounded-xl p-1.5 shadow-2xl transition duration-200 cursor-pointer group"
                onClick={() => {
                  setSelectedProduct(currentVideo.product);
                  setIsProductDetailOpen(true);
                }}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-800 border border-white/10">
                    <img
                      src={currentVideo.product.image}
                      alt={currentVideo.product.title[lang]}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute top-0.5 left-0.5 bg-rose-600 text-[9px] font-black text-white px-1 py-0.2 rounded shadow">
                      -{currentVideo.product.discountPercent}%
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center space-x-1 mb-0.5">
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded flex items-center">
                        <Star className="w-2.5 h-2.5 fill-amber-400 mr-0.5" />
                        {currentVideo.product.rating} ({currentVideo.product.soldCount} {t.sold})
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1 leading-snug">
                      {currentVideo.product.title[lang]}
                    </h4>

                    <div className="flex items-baseline space-x-1.5 mt-0.5">
                      <span className="text-sm font-black text-rose-400">
                        {t.pkr} {currentVideo.product.pricePKR.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-neutral-400 line-through">
                        {t.pkr} {currentVideo.product.originalPricePKR.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1 shrink-0">
                    <button
                      id="feed-buy-now-btn"
                      onClick={(e) => handleBuyNowDirect(currentVideo.product, e)}
                      className="px-2 py-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-[10px] font-extrabold rounded-lg shadow-lg shadow-pink-600/30 transition transform active:scale-95 whitespace-nowrap"
                    >
                      {t.buyNow}
                    </button>
                    <button
                      id="feed-add-cart-btn"
                      onClick={(e) => handleAddToCart(currentVideo.product, e)}
                      className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[9px] font-bold rounded-lg transition flex items-center justify-center space-x-1"
                    >
                      <ShoppingCart className="w-3 h-3 text-neutral-200" />
                      <span>+ {t.cartTab}</span>
                    </button>
                  </div>
                </div>

                <div className="mt-1 pt-1 border-t border-white/10 flex items-center justify-between text-[9px] text-neutral-300">
                  <span className="flex items-center text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    {t.codBadge}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      id="feed-chat-seller-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenChatForProduct(currentVideo.product, currentVideo.creator.name);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 font-bold flex items-center space-x-1 transition"
                    >
                      <MessageSquare className="w-2.5 h-2.5" />
                      <span>{t.chatWithSeller}</span>
                    </button>
                    <span className="text-neutral-400 truncate max-w-[70px]">
                      {currentVideo.product.badge[lang]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Creator Caption */}
              <div className="space-y-0.5 px-0.5">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-xs text-white drop-shadow">
                    {currentVideo.creator.handle}
                  </span>
                  {currentVideo.creator.verified && (
                    <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[8px] font-black">
                      ✓
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-white line-clamp-2 leading-snug drop-shadow">
                  {currentVideo.description[lang]}
                </p>

                <div className="flex flex-wrap gap-1 pt-0.5">
                  {currentVideo.tags.map((tg, i) => (
                    <span key={i} className="text-[10px] font-medium text-pink-300">
                      {tg}
                    </span>
                  ))}
                </div>

                <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-white/80">
                  <Music2 className="h-3 w-3 animate-pulse text-pink-300" />
                  <span className="max-w-[220px] truncate">{currentVideo.soundTitle}</span>
                </div>
              </div>
            </div>

            {/* Video Progress Line */}
            <div className="absolute bottom-0 left-0 z-30 w-full bg-white/20 h-1">
              <div
                className="bg-pink-500 h-full transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          </>
        )}
      </div>
    )}

        {/* VIEW 2: SHOP CATALOG */}
        {currentTab === 'shop' && (
          <div className="w-full h-full bg-neutral-950 overflow-y-auto no-scrollbar flex flex-col pt-16 pb-20 px-3">
            <div className="mb-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-white">{t.trendingPicks}</h2>
                  <p className="text-[11px] text-neutral-400">
                    {t.freeDeliveryThreshold} • Cash on Delivery
                  </p>
                </div>

                <button
                  id="shop-view-cart-trigger"
                  onClick={() => setIsCartOpen(true)}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-white/10"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-pink-400" />
                  <span>
                    {cartTotalItems} {t.cartTab}
                  </span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="shop-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Pakistan Doorstep Delivery */}
              <div className="bg-neutral-900/90 border border-neutral-800 p-2.5 rounded-xl">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="flex items-center text-neutral-300 font-semibold">
                    <Truck className="w-3.5 h-3.5 text-pink-400 mr-1.5" />
                    Doorstep delivery across Pakistan
                  </span>
                  <span className="text-[10px] text-pink-400 font-bold">From Rs. {deliveryFee}</span>
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-rose-400 h-full rounded-full transition-all duration-300"
                    style={{
                      width: '100%'
                    }}
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
                {[
                  { id: 'all', label: t.allCategories },
                  { id: 'tech', label: lang === 'ur' ? 'ٹیک گیجٹس' : 'Tech & Gadgets' },
                  { id: 'beauty', label: lang === 'ur' ? 'خوبصورتی' : 'Beauty & Skin' },
                  { id: 'decor', label: lang === 'ur' ? 'کمرے کی سجاوٹ' : 'Room Decor' },
                  { id: 'kitchen', label: lang === 'ur' ? 'کچن اور فٹنس' : 'Kitchen & Fit' },
                  { id: 'fashion', label: lang === 'ur' ? 'فیشن اور جوتے' : 'Fashion & Joote' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setShopCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition ${
                      shopCategory === cat.id
                        ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 text-neutral-500">
                <Search className="w-10 h-10 mb-2 stroke-1" />
                <p className="text-sm font-semibold">{t.noProductsFound}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 pb-6">
                {filteredProducts.map((product) => {
                  const isInCart = cart.some((c) => c.product.id === product.id);
                  const isSaved = savedProducts.some((p) => p.id === product.id);

                  return (
                    <div
                      key={product.id}
                      id={`product-card-${product.id}`}
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsProductDetailOpen(true);
                      }}
                      className="bg-neutral-900 border border-neutral-800/80 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-pink-500/40 transition cursor-pointer shadow-md"
                    >
                      <div className="relative aspect-square w-full bg-neutral-800 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.title[lang]}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute top-2 left-2 bg-rose-600 text-[10px] font-black text-white px-1.5 py-0.5 rounded-md shadow">
                          -{product.discountPercent}%
                        </span>

                        <button
                          onClick={(e) => handleToggleSaveProduct(product, e)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:text-amber-400 transition"
                          title="Bookmark Product"
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`}
                          />
                        </button>

                        <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-[10px] font-bold text-amber-400 px-1.5 py-0.5 rounded-md flex items-center space-x-0.5">
                          <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                          <span>{product.rating}</span>
                        </span>
                      </div>

                      <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <span className="text-[10px] font-semibold text-neutral-400 block mb-0.5">
                            {product.categoryLabel[lang]}
                          </span>
                          <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-pink-300 transition">
                            {product.title[lang]}
                          </h3>
                        </div>

                        <div>
                          <div className="flex items-baseline space-x-1.5">
                            <span className="text-sm font-black text-white">
                              {t.pkr} {product.pricePKR.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-neutral-500 line-through">
                              {t.pkr} {product.originalPricePKR.toLocaleString()}
                            </span>
                          </div>

                          <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
                            {t.codBadge}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <button
                            id={`shop-add-cart-${product.id}`}
                            onClick={(e) => handleAddToCart(product, e)}
                            className={`py-1.5 rounded-xl text-[11px] font-bold transition flex items-center justify-center space-x-1 ${
                              isInCart
                                ? 'bg-neutral-800 text-pink-400 border border-pink-500/30'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                            }`}
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>{isInCart ? t.inCart : '+ ' + t.cartTab}</span>
                          </button>
                          <button
                            id={`shop-buy-now-${product.id}`}
                            onClick={(e) => handleBuyNowDirect(product, e)}
                            className="py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-[11px] font-extrabold shadow-md shadow-pink-600/20 active:scale-95 transition"
                          >
                            {t.buyNow}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: INBOX / DIRECT MESSAGING TAB (Requirement 2) */}
        {currentTab === 'inbox' && (
          <InboxView
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={(id) => setActiveConversationId(id)}
            onSendMessage={handleSendMessage}
            onBuyProduct={(product) => handleBuyNowDirect(product)}
            allProducts={INITIAL_PRODUCTS}
            lang={lang}
          />
        )}

        {/* VIEW 4: ENHANCED PROFILE SCREEN (Requirement 2: Distinct Liked Videos & Saved Videos tabs) */}
        {currentTab === 'profile' && (
          <ProfileView
            profile={userProfile}
            uploadedVideos={uploadedVideos}
            likedVideos={videos.filter((v) => likedVideoIds.includes(v.id))}
            savedVideos={videos.filter((v) => savedVideoIds.includes(v.id))}
            savedProducts={savedProducts}
            onSelectVideo={(selectedVid) => {
              // Switch to 'foryou' reel tab so all videos are accessible
              setReelTab('foryou');
              const foundIdx = videos.findIndex((v) => v.id === selectedVid.id);
              if (foundIdx !== -1) {
                setCurrentVideoIndex(foundIdx);
              }
              setCurrentTab('feed');
              setIsPlaying(true);
              setVideoProgress(0);
            }}
            onRemoveSavedProduct={(id) => {
              setSavedProducts((prev) => prev.filter((p) => p.id !== id));
              triggerToast(t.savedItemRemoved);
            }}
            onBuyNowProduct={(product) => handleBuyNowDirect(product)}
            onOpenStreakModal={() => setIsStreakModalOpen(true)}
            onOpenCreateVideo={() => {
              if (requireAuth()) setIsVideoUploadOpen(true);
            }}
            onUpdateProfile={handleUpdateProfile}
            availableProducts={INITIAL_PRODUCTS}
            sellerId={authUser?.id}
            lang={lang}
          />
        )}

        {/* BOTTOM FIXED NAVIGATION BAR */}
        <nav className="fixed inset-x-0 bottom-0 z-40 h-16 border-t border-white/10 bg-black/55 px-4 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl flex items-center justify-around">
          <button
            id="tab-btn-home"
            onClick={() => {
              setCurrentTab('feed');
              setTopFeedTab('for-you');
              handleSelectReelTab('foryou');
            }}
            className={`flex flex-col items-center space-y-0.5 transition ${
              currentTab === 'feed' ? 'text-pink-500 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <House className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            id="tab-btn-friends"
            onClick={() => {
              setCurrentTab('feed');
              setTopFeedTab('friends');
              handleSelectReelTab('friends');
            }}
            className={`flex flex-col items-center space-y-0.5 transition ${
              currentTab === 'feed' && reelTab === 'friends' ? 'text-pink-500 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px]">Friends</span>
          </button>

          <button
            id="tab-btn-create-video"
            onClick={() => {
              if (requireAuth()) setIsVideoUploadOpen(true);
            }}
            className="-mt-5 flex h-12 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 via-white to-pink-500 p-[2px] shadow-[0_0_18px_rgba(236,72,153,0.45)] transition hover:scale-105"
            aria-label="Create video"
            title="Create video"
          >
            <span className="flex h-full w-full items-center justify-center rounded-[10px] bg-white text-black">
              <Plus className="h-7 w-7" />
            </span>
          </button>

          {/* Inbox / Direct Messaging Tab (Requirement 2) */}
          <button
            id="tab-btn-inbox"
            onClick={() => setCurrentTab('inbox')}
            className={`flex flex-col items-center space-y-0.5 transition relative ${
              currentTab === 'inbox' ? 'text-pink-500 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5" />
              {conversations.reduce((acc, c) => acc + c.unreadCount, 0) > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-pink-500 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {conversations.reduce((acc, c) => acc + c.unreadCount, 0)}
                </span>
              )}
            </div>
            <span className="text-[10px]">{t.inboxTab}</span>
          </button>

          {/* User Profile Tab */}
          <button
            id="tab-btn-profile"
            onClick={() => {
              if (requireAuth()) setCurrentTab('profile');
            }}
            className={`flex flex-col items-center space-y-0.5 transition relative ${
              currentTab === 'profile' ? 'text-pink-500 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <img
                src={authUser?.avatar || userProfile.avatar}
                alt="Profile"
                className={`w-5 h-5 rounded-full object-cover border ${
                  currentTab === 'profile' ? 'border-pink-500' : 'border-neutral-600'
                }`}
              />
              <span className="absolute -top-1 -right-1.5 bg-amber-500 text-black text-[8px] font-black px-1 rounded-full">
                🔥
              </span>
            </div>
            <span className="text-[10px]">{t.profileTab}</span>
          </button>
        </nav>

        {/* MODAL: COMMENTS SHEET */}
        {isCommentsOpen && (
          <div
            id="comments-sheet-backdrop"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm z-40 flex flex-col justify-end"
            onClick={() => setIsCommentsOpen(false)}
          >
            <div
              id="comments-sheet-content"
              className="bg-neutral-900 border-t border-neutral-800 rounded-t-3xl max-h-[75%] h-[75%] flex flex-col p-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="w-8" />
                <div className="flex flex-col items-center">
                  <div className="w-10 h-1 bg-neutral-700 rounded-full mb-2" />
                  <h3 className="text-xs font-bold text-white">
                    {t.commentsTitle} ({currentVideo.commentsCount})
                  </h3>
                </div>
                <button
                  id="close-comments-btn"
                  onClick={() => setIsCommentsOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-3.5">
                {currentVideo.commentsList.map((comm) => (
                  <div key={comm.id} className="flex items-start space-x-2.5">
                    <img
                      src={comm.avatar}
                      alt={comm.user}
                      className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-white">{comm.user}</span>
                        {comm.verifiedBuyer && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded font-semibold flex items-center">
                            ✓ {t.verifiedBuyer}
                          </span>
                        )}
                        <span className="text-[10px] text-neutral-500">{comm.city}</span>
                        <span className="text-[10px] text-neutral-500">• {comm.timeAgo}</span>
                      </div>
                      <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
                        {comm.text}
                      </p>
                    </div>

                    <button className="flex flex-col items-center text-neutral-500 hover:text-rose-500 transition shrink-0 pl-1">
                      <Heart className="w-3.5 h-3.5" />
                      <span className="text-[9px] mt-0.5">{comm.likes}</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-neutral-800 flex items-center space-x-2">
                <input
                  id="add-comment-input"
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder={t.addCommentPlaceholder}
                  className="flex-1 bg-neutral-800 border border-neutral-700/80 rounded-full px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500"
                />
                <button
                  id="submit-comment-btn"
                  onClick={handleAddComment}
                  disabled={!newCommentText.trim()}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-40 text-white rounded-full text-xs font-bold transition"
                >
                  {t.postComment}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: SHARE SHEET */}
        {isShareOpen && (
          <div
            id="share-sheet-backdrop"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm z-40 flex flex-col justify-end"
            onClick={() => setIsShareOpen(false)}
          >
            <div
              id="share-sheet-content"
              className="bg-neutral-900 border-t border-neutral-800 rounded-t-3xl p-5 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{t.shareTitle}</h3>
                <button
                  id="close-share-btn"
                  onClick={() => setIsShareOpen(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-3 py-2 overflow-x-auto no-scrollbar">
                <button
                  id="share-whatsapp-btn"
                  onClick={handleShareWhatsApp}
                  className="flex flex-col items-center space-y-1.5 shrink-0"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white shadow-lg transition">
                    <Phone className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] text-neutral-300">WhatsApp</span>
                </button>

                <button
                  id="share-copy-link-btn"
                  onClick={handleCopyLink}
                  className="flex flex-col items-center space-y-1.5 shrink-0"
                >
                  <div className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 flex items-center justify-center text-white shadow-lg transition">
                    <Copy className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] text-neutral-300">
                    {shareCopiedToast ? t.copied : t.copyLink}
                  </span>
                </button>

                <button
                  id="share-direct-order-btn"
                  onClick={() => {
                    setIsShareOpen(false);
                    handleBuyNowDirect(currentVideo.product);
                  }}
                  className="flex flex-col items-center space-y-1.5 shrink-0"
                >
                  <div className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white shadow-lg transition">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] text-neutral-300">{t.buyNow}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PRODUCT DETAIL INSPECTION */}
        {isProductDetailOpen && selectedProduct && (
          <div
            id="product-detail-modal"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end"
            onClick={() => setIsProductDetailOpen(false)}
          >
            <div
              className="bg-neutral-900 border-t border-neutral-800 rounded-t-3xl max-h-[85%] h-[85%] flex flex-col p-5 overflow-y-auto no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-xs font-bold text-pink-400">
                  {selectedProduct.categoryLabel[lang]}
                </span>
                <button
                  onClick={() => setIsProductDetailOpen(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="my-3 flex items-center space-x-3">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title[lang]}
                  className="w-24 h-24 rounded-2xl object-cover border border-neutral-700 shrink-0"
                />
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-2">
                    {selectedProduct.title[lang]}
                  </h3>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-base font-black text-rose-400">
                      {t.pkr} {selectedProduct.pricePKR.toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-500 line-through">
                      {t.pkr} {selectedProduct.originalPricePKR.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-black bg-rose-600/30 text-rose-400 px-1.5 py-0.5 rounded">
                      -{selectedProduct.discountPercent}%
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-400 flex items-center mt-1">
                    <Star className="w-3 h-3 fill-amber-400 mr-1" />
                    <span>
                      {selectedProduct.rating} ({selectedProduct.reviewsCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs text-neutral-300">
                <p className="leading-relaxed bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                  {selectedProduct.description[lang]}
                </p>

                <div>
                  <h4 className="text-xs font-bold text-white mb-2 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400 mr-1.5" />
                    Highlights:
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedProduct.features[lang].map((f, i) => (
                      <li key={i} className="flex items-start space-x-2 text-[11px] text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <ProductReviews
                  productId={selectedProduct.id}
                  rating={selectedProduct.rating}
                  reviewCount={selectedProduct.reviewsCount}
                  userId={authUser?.id}
                />

                <div className="bg-neutral-800/60 border border-neutral-700/80 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-[11px]">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{t.openParcelAllowed}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-[11px]">
                    <RefreshCw className="w-4 h-4 shrink-0" />
                    <span>{t.sevenDayReturn}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-amber-400 font-semibold text-[11px]">
                    <Truck className="w-4 h-4 shrink-0" />
                    <span>{t.inStock}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800 space-y-2">
                <button
                  id="modal-chat-seller-btn"
                  onClick={() => handleOpenChatForProduct(selectedProduct)}
                  className="w-full py-2 bg-pink-950/40 hover:bg-pink-900/60 border border-pink-500/40 text-pink-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition"
                >
                  <MessageSquare className="w-4 h-4 text-pink-400" />
                  <span>{t.chatWithSeller}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="modal-add-to-cart-btn"
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border border-white/10"
                  >
                    <ShoppingCart className="w-4 h-4 text-pink-400" />
                    <span>{t.addToCart}</span>
                  </button>
                  <button
                    id="modal-buy-now-btn"
                    onClick={() => handleBuyNowDirect(selectedProduct)}
                    className="py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-pink-600/30 flex items-center justify-center space-x-1.5"
                  >
                    <span>{t.buyNow} (COD)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CART DRAWER */}
        {isCartOpen && (
          <div
            id="cart-drawer-backdrop"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end"
            onClick={() => setIsCartOpen(false)}
          >
            <div
              id="cart-drawer-content"
              className="bg-neutral-900 border-t border-neutral-800 rounded-t-3xl max-h-[88%] h-[88%] flex flex-col p-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-pink-500" />
                  <h3 className="text-sm font-bold text-white">
                    {t.cartTab} ({cartTotalItems})
                  </h3>
                </div>
                <button
                  id="close-cart-btn"
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="my-2 p-2 bg-neutral-950 rounded-xl border border-neutral-800 text-[11px] flex items-center justify-between">
                <span className="text-neutral-300 font-medium">Pakistan doorstep delivery</span>
                <span className="font-bold text-pink-400">Rs. {deliveryFee}</span>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-400 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-white">{t.cartEmpty}</h4>
                  <p className="text-xs text-neutral-400 max-w-xs">{t.cartEmptySub}</p>
                  <button
                    id="cart-start-shopping-btn"
                    onClick={() => {
                      setIsCartOpen(false);
                      setCurrentTab('feed');
                    }}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl transition"
                  >
                    {t.startShopping}
                  </button>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-2.5">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="bg-neutral-950 border border-neutral-800/90 rounded-2xl p-2.5 flex items-center space-x-3"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title[lang]}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white line-clamp-1">
                          {item.product.title[lang]}
                        </h4>
                        <div className="text-xs font-black text-rose-400 mt-0.5">
                          {t.pkr} {item.product.pricePKR.toLocaleString()}
                        </div>

                        <div className="flex items-center space-x-2 mt-1.5">
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, -1)}
                            className="w-6 h-6 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 flex items-center justify-center text-xs font-black"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-white px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, 1)}
                            className="w-6 h-6 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 flex items-center justify-center text-xs font-black"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveFromCart(item.product.id)}
                        className="p-2 text-neutral-500 hover:text-rose-400 transition"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="pt-2 flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        placeholder="Promo (PIKPOK10)"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white uppercase placeholder-neutral-500 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <button
                      onClick={handleApplyPromo}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold transition"
                    >
                      {t.apply}
                    </button>
                  </div>
                </div>
              )}

              {cart.length > 0 && (
                <div className="pt-3 border-t border-neutral-800 space-y-2">
                  <div className="space-y-1 text-xs text-neutral-300">
                    <div className="flex justify-between">
                      <span>{t.subtotal}</span>
                      <span className="font-bold text-white">
                        {t.pkr} {subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>{t.deliveryFee}</span>
                      <span className="font-bold text-emerald-400">
                        {isFreeDelivery ? t.free : `${t.pkr} ${deliveryFee}`}
                      </span>
                    </div>

                    {isPromoApplied && (
                      <div className="flex justify-between text-rose-400 font-semibold">
                        <span>{t.promoDiscount} (10%)</span>
                        <span>
                          -{t.pkr} {promoDiscount.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-black text-white pt-1 border-t border-neutral-800">
                      <span>{t.total}</span>
                      <span className="text-pink-400">
                        {t.pkr} {grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    id="cart-proceed-checkout-btn"
                    onClick={() => {
                      if (!requireAuth()) return;
                      setCheckoutProductDirect(null);
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold rounded-2xl shadow-xl shadow-pink-600/30 flex items-center justify-center space-x-2 transition transform active:scale-98"
                  >
                    <span>{t.checkoutTitle}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: CHECKOUT WITH LOCAL PAKISTANI PAYMENT GATEWAYS */}
        {isCheckoutOpen && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            activeCheckoutItems={activeCheckoutItems}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            deliveryZone={deliveryQuote.zone}
            packageWeightKg={deliveryQuote.weightKg}
            isFreeDelivery={isFreeDelivery}
            isPromoApplied={isPromoApplied}
            promoDiscount={promoDiscount}
            grandTotal={grandTotal}
            lang={lang}
            triggerToast={triggerToast}
            onOrderPlaced={(newOrder) => {
              setOrderConfirmedData(newOrder);
              setIsCheckoutOpen(false);
              if (!checkoutProductDirect) {
                setCart([]);
              }
              setCheckoutProductDirect(null);
              // Ordering also boosts streak!
              handleExtendStreak();
            }}
          />
        )}

        {/* MODAL: ORDER CONFIRMATION CELEBRATION */}
        {orderConfirmedData && (
          <div
            id="order-success-modal"
            className="absolute inset-0 bg-neutral-950/95 backdrop-blur-lg z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300"
          >
            <div
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mb-3 animate-bounce ${
                orderConfirmedData.paymentMethod === 'cod'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                  : orderConfirmedData.paymentMethod === 'bank'
                  ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]'
                  : orderConfirmedData.paymentMethod === 'jazzcash'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)]'
                  : 'bg-teal-500/20 border-teal-400 text-teal-400 shadow-[0_0_30px_rgba(45,212,191,0.3)]'
              }`}
            >
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <span
              className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-1 ${
                orderConfirmedData.paymentMethod === 'cod'
                  ? 'text-emerald-400 bg-emerald-400/10'
                  : orderConfirmedData.paymentMethod === 'bank'
                  ? 'text-blue-400 bg-blue-400/10'
                  : orderConfirmedData.paymentMethod === 'jazzcash'
                  ? 'text-amber-400 bg-amber-400/10'
                  : 'text-teal-400 bg-teal-400/10'
              }`}
            >
              {orderConfirmedData.paymentMethod === 'cod'
                ? 'Cash on Delivery Confirmed'
                : orderConfirmedData.paymentMethod === 'bank'
                ? 'Bank Transfer Submitted • Verifying'
                : orderConfirmedData.paymentMethod === 'jazzcash'
                ? 'JazzCash Payment Submitted • Verifying'
                : 'EasyPaisa Payment Submitted • Verifying'}
            </span>

            <h2 className="text-base font-black text-white">{t.orderConfirmed}</h2>
            <p className="text-xs text-neutral-400 max-w-xs mt-1">
              {orderConfirmedData.paymentMethod === 'cod'
                ? t.orderSuccessSub
                : 'Your advance payment proof has been received and will be verified within 15 minutes.'}
            </p>

            <div className="w-full max-w-xs bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 my-3 text-left space-y-2 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-[10px] font-bold text-neutral-400">{t.trackingNumber}</span>
                <span className="text-xs font-black text-pink-400 tracking-wider font-mono">
                  {orderConfirmedData.trackingId}
                </span>
              </div>

              <div className="space-y-1 text-xs text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Customer:</span>
                  <span className="font-bold text-white">{orderConfirmedData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Destination:</span>
                  <span className="font-bold text-white">{orderConfirmedData.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Payment:</span>
                  <span className="font-bold text-white">
                    {orderConfirmedData.paymentMethod === 'cod'
                      ? 'Cash on Delivery (COD)'
                      : orderConfirmedData.paymentMethod === 'bank'
                      ? 'Bank Transfer (Meezan/HBL)'
                      : orderConfirmedData.paymentMethod === 'jazzcash'
                      ? 'JazzCash Mobile Account'
                      : 'EasyPaisa Mobile Account'}
                  </span>
                </div>

                {orderConfirmedData.paymentProof && (
                  <div className="mt-1.5 p-2 bg-black/50 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-neutral-400">Transaction ID:</span>
                      <span className="font-mono font-bold text-pink-400">
                        {orderConfirmedData.paymentProof.transactionId}
                      </span>
                    </div>
                    {orderConfirmedData.paymentProof.screenshotUrl && (
                      <div className="flex items-center space-x-2 pt-1 border-t border-neutral-800">
                        <img
                          src={orderConfirmedData.paymentProof.screenshotUrl}
                          alt="Receipt"
                          className="w-8 h-8 rounded object-cover border border-neutral-700"
                        />
                        <span className="text-[10px] text-emerald-400 font-bold truncate">
                          ✓ Receipt Attached ({orderConfirmedData.paymentProof.screenshotName || 'Image'})
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between pt-1">
                  <span className="text-neutral-400">Total Payable:</span>
                  <span className="font-black text-emerald-400">
                    {t.pkr} {orderConfirmedData.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center">
                <Truck className="w-3.5 h-3.5 text-pink-400 mr-1.5 shrink-0" />
                <span>{t.estimatedDelivery}</span>
              </div>
            </div>

            <div className="w-full max-w-xs space-y-2">
              <button
                id="whatsapp-support-btn"
                onClick={() => {
                  const paymentInfo =
                    orderConfirmedData.paymentMethod === 'cod'
                      ? 'Payment: Cash on Delivery'
                      : `Payment: ${orderConfirmedData.paymentMethod.toUpperCase()} (TID: ${
                          orderConfirmedData.paymentProof?.transactionId || 'Attached'
                        })`;
                  const text = encodeURIComponent(
                    `Hello PikPok! My order tracking ID is ${orderConfirmedData.trackingId} for ${orderConfirmedData.customerName}.\n${paymentInfo}\nAmount: Rs. ${orderConfirmedData.total.toLocaleString()}\nPlease update me on delivery dispatch.`
                  );
                  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-lg shadow-emerald-600/20"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t.trackOnWhatsApp}</span>
              </button>

              <button
                id="continue-shopping-btn"
                onClick={() => {
                  setOrderConfirmedData(null);
                  setCurrentTab('feed');
                }}
                className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold transition"
              >
                {t.continueShopping}
              </button>
            </div>
          </div>
        )}

        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}>
            <aside
              className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-neutral-950/95 p-5 text-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-400">PikPok</p>
                  <h2 className="text-lg font-black">Settings</h2>
                </div>
                <button onClick={() => setIsSettingsOpen(false)} className="rounded-full bg-white/10 p-2 text-white/70 hover:text-white" aria-label="Close settings">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="border-b border-white/10 py-5">
                <p className="mb-2 text-xs font-bold text-white/60">Language</p>
                <div className="grid grid-cols-3 gap-2">
                  {([['en', 'English'], ['ru', 'Русский'], ['ur', 'اردو']] as const).map(([value, label]) => (
                    <button key={value} onClick={() => setLang(value)} className={`rounded-xl border px-2 py-2 text-xs font-bold ${lang === value ? 'border-pink-500 bg-pink-500/20 text-white' : 'border-white/10 bg-white/5 text-white/60'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 py-5">
                {authUser ? (
                  <>
                    <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
                      <img src={authUser.avatar} alt={authUser.name} className="h-10 w-10 rounded-full object-cover" />
                      <div className="min-w-0"><p className="truncate text-sm font-bold">{authUser.name}</p><p className="truncate text-xs text-white/50">{authUser.emailOrPhone}</p></div>
                    </div>
                    <button onClick={() => { setIsSettingsOpen(false); setCurrentTab('profile'); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold hover:bg-white/10"><User className="h-4 w-4 text-pink-400" />Account profile</button>
                    <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-rose-300 hover:bg-rose-500/10"><LogOut className="h-4 w-4" />{t.signOutBtn}</button>
                  </>
                ) : (
                  <button onClick={() => { setIsSettingsOpen(false); setIsAuthModalOpen(true); }} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-3 py-3 text-sm font-black"><LogIn className="h-4 w-4" />{t.signInBtn}</button>
                )}
                <button onClick={() => setIsStreakModalOpen(true)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold hover:bg-white/10"><Flame className="h-4 w-4 text-amber-400" />Daily streak and rewards</button>
                <button onClick={() => { if (requireAuth()) { setIsSettingsOpen(false); setIsCartOpen(true); } }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold hover:bg-white/10"><ShoppingCart className="h-4 w-4 text-pink-400" />Shopping cart</button>
              </div>
            </aside>
          </div>
        )}

        {/* MODAL: SNAPCHAT-STYLE DAILY STREAK DETAILS & PERKS */}
        <StreakModal
          isOpen={isStreakModalOpen}
          onClose={() => setIsStreakModalOpen(false)}
          streakScore={userProfile.streakScore}
          lastActiveTimestamp={userProfile.lastActiveTimestamp}
          onExtendStreak={handleExtendStreak}
          onSimulateExpiry={handleSimulateExpiry}
          onResetStreak={handleResetStreak}
          lang={lang}
        />

        <VideoUploadModal
          isOpen={isVideoUploadOpen}
          onClose={() => setIsVideoUploadOpen(false)}
          onSubmit={handleCreateVideo}
          products={INITIAL_PRODUCTS}
          lang={lang}
        />

        {/* MODAL: AUTHENTICATION & ONBOARDING (Requirement 1) */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          lang={lang}
        />
      </main>
    </div>
  );
}
