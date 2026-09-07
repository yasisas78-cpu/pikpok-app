import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { VideoItem, Product, CommentItem, OrderItem, Creator, ChatConversation } from '../types';
import { VideoCard } from './VideoCard';
import { TopHeader } from './TopHeader';
import { BottomNavBar } from './BottomNavBar';
import { LiveStreamView } from './LiveStreamView';
import { CreatePostModal } from './CreatePostModal';
import { CreatorProfileModal } from './CreatorProfileModal';
import { DirectMessageDrawer } from './DirectMessageDrawer';
import { AudioDetailModal } from './AudioDetailModal';
import { ProductCheckoutDrawer } from './ProductCheckoutDrawer';
import { CommentsDrawer } from './CommentsDrawer';
import { ShareModal } from './ShareModal';
import { OrdersDrawer } from './OrdersDrawer';
import { SearchModal } from './SearchModal';
import { OrderSuccessModal } from './OrderSuccessModal';
import { INITIAL_VIDEOS, MOCK_COMMENTS } from '../data/mockVideos';
import {
  CURRENT_USER,
  MOCK_LIVE_STREAMS,
  MOCK_CHAT_CONVERSATIONS,
  MOCK_CREATOR_PROFILES,
} from '../data/mockSocialData';

export const VideoFeed: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [activeTab, setActiveTab] = useState<'following' | 'foryou' | 'live'>('foryou');
  const [bottomNavTab, setBottomNavTab] = useState<'feed' | 'live' | 'inbox' | 'profile'>('feed');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Audio mute state
  const [isMuted, setIsMuted] = useState(false);

  // Engagement states
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likesCountMap, setLikesCountMap] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    INITIAL_VIDEOS.forEach((v) => {
      map[v.id] = v.likesCount;
    });
    return map;
  });
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    INITIAL_VIDEOS.forEach((v) => {
      map[v.creator.handle] = !!v.creator.isFollowing;
    });
    return map;
  });

  // Comments state
  const [commentsMap, setCommentsMap] = useState<Record<string, CommentItem[]>>(MOCK_COMMENTS);

  // Direct Messages state
  const [conversations, setConversations] = useState<ChatConversation[]>(MOCK_CHAT_CONVERSATIONS);
  const [isDirectMessagesOpen, setIsDirectMessagesOpen] = useState(false);
  const [activeDMCreator, setActiveDMCreator] = useState<Creator | null>(null);

  // Creator Profile state
  const [selectedCreatorForProfile, setSelectedCreatorForProfile] = useState<Creator | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Audio Detail modal state
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [selectedAudioInfo, setSelectedAudioInfo] = useState<{
    title: string;
    artist: string;
    cover?: string;
  } | null>(null);

  // Create Post Modal state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [preselectedSoundForPost, setPreselectedSoundForPost] = useState<string | undefined>(undefined);

  // Modals & Drawers for E-Commerce
  const [selectedProductForCheckout, setSelectedProductForCheckout] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<OrderItem | null>(null);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);

  // Toast notification for new post or action
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Orders stored in localStorage
  const [orders, setOrders] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('pikpok_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pikpok_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Tab Filtering (Following vs For You vs Live)
  const filteredVideos = React.useMemo(() => {
    if (activeTab === 'following') {
      const followed = videos.filter((v) => followingMap[v.creator.handle]);
      return followed.length > 0 ? followed : [];
    }
    return videos;
  }, [activeTab, videos, followingMap]);

  // Adjust index if filtered list changes
  useEffect(() => {
    if (currentIndex >= filteredVideos.length) {
      setCurrentIndex(Math.max(0, filteredVideos.length - 1));
    }
  }, [filteredVideos.length, currentIndex]);

  const currentVideo = filteredVideos[currentIndex] || videos[0];

  // Navigation handlers
  const goToNextVideo = useCallback(() => {
    if (currentIndex < filteredVideos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, filteredVideos.length]);

  const goToPrevVideo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        isCheckoutOpen ||
        isCommentsOpen ||
        isShareOpen ||
        isOrdersOpen ||
        isSearchOpen ||
        isProfileOpen ||
        isDirectMessagesOpen ||
        isCreatePostOpen ||
        isAudioModalOpen ||
        activeTab === 'live'
      ) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        goToNextVideo();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        goToPrevVideo();
      } else if (e.key === 'm') {
        setIsMuted((m) => !m);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    goToNextVideo,
    goToPrevVideo,
    isCheckoutOpen,
    isCommentsOpen,
    isShareOpen,
    isOrdersOpen,
    isSearchOpen,
    isProfileOpen,
    isDirectMessagesOpen,
    isCreatePostOpen,
    isAudioModalOpen,
    activeTab,
  ]);

  // Touch Gesture handling
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 45) {
      if (deltaY > 0) {
        goToNextVideo();
      } else {
        goToPrevVideo();
      }
    }
    touchStartY.current = null;
    touchStartX.current = null;
  };

  // Wheel scrolling with throttle
  const wheelLockRef = useRef(false);
  const handleWheel = (e: React.WheelEvent) => {
    if (
      isCheckoutOpen ||
      isCommentsOpen ||
      isShareOpen ||
      isOrdersOpen ||
      isSearchOpen ||
      isProfileOpen ||
      isDirectMessagesOpen ||
      isCreatePostOpen ||
      isAudioModalOpen ||
      activeTab === 'live'
    ) {
      return;
    }
    if (wheelLockRef.current) return;

    if (Math.abs(e.deltaY) > 40) {
      wheelLockRef.current = true;
      if (e.deltaY > 0) {
        goToNextVideo();
      } else {
        goToPrevVideo();
      }
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 450);
    }
  };

  // Like Toggle
  const handleToggleLike = (videoId: string) => {
    setLikedMap((prev) => {
      const isCurrentlyLiked = !!prev[videoId];
      const nextLiked = !isCurrentlyLiked;

      setLikesCountMap((counts) => ({
        ...counts,
        [videoId]: (counts[videoId] || 0) + (nextLiked ? 1 : -1),
      }));

      return { ...prev, [videoId]: nextLiked };
    });
  };

  // Save Toggle
  const handleToggleSave = (videoId: string) => {
    setSavedMap((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
  };

  // Follow Toggle
  const handleToggleFollow = (handle: string) => {
    setFollowingMap((prev) => {
      const next = !prev[handle];
      showToast(next ? `Followed ${handle} ✨` : `Unfollowed ${handle}`);
      return { ...prev, [handle]: next };
    });
  };

  // Add Comment
  const handleAddComment = (videoId: string, text: string) => {
    const newComment: CommentItem = {
      id: 'comm-' + Date.now(),
      user: {
        name: CURRENT_USER.name,
        avatar: CURRENT_USER.avatar,
        badge: 'Verified Creator ⚡',
      },
      text,
      timeAgo: 'Just now',
      likes: 1,
      isLiked: true,
    };

    setCommentsMap((prev) => ({
      ...prev,
      [videoId]: [newComment, ...(prev[videoId] || [])],
    }));
  };

  const handleToggleCommentLike = (videoId: string, commentId: string) => {
    setCommentsMap((prev) => {
      const list = prev[videoId] || [];
      return {
        ...prev,
        [videoId]: list.map((c) =>
          c.id === commentId
            ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
            : c
        ),
      };
    });
  };

  // Open Creator Profile
  const handleOpenCreatorProfile = (creator: Creator) => {
    // Enrich with profile metadata if in dictionary
    const fullProfile = MOCK_CREATOR_PROFILES[creator.handle] || creator;
    setSelectedCreatorForProfile(fullProfile);
    setIsProfileOpen(true);
  };

  // Open Direct Message with a Creator
  const handleOpenDM = (creator: Creator) => {
    setActiveDMCreator(creator);
    setIsDirectMessagesOpen(true);
  };

  // Send DM message
  const handleSendMessage = (convoId: string, text: string) => {
    const newMsg = {
      id: 'msg-' + Date.now(),
      senderId: 'me',
      text,
      timestamp: 'Just now',
    };

    setConversations((prev) => {
      const existing = prev.find((c) => c.id === convoId);
      if (existing) {
        return prev.map((c) =>
          c.id === convoId
            ? {
                ...c,
                lastMessage: text,
                lastMessageTime: 'Just now',
                messages: [...c.messages, newMsg],
              }
            : c
        );
      }

      // Create new conversation
      const targetCreator = activeDMCreator || CURRENT_USER;
      const newConvo: ChatConversation = {
        id: convoId,
        creator: targetCreator,
        unreadCount: 0,
        lastMessage: text,
        lastMessageTime: 'Just now',
        messages: [newMsg],
      };
      return [newConvo, ...prev];
    });

    // Automated realistic response after 900ms
    setTimeout(() => {
      const replies = [
        'Thanks so much for messaging! Yes, it is in stock and shipping daily ⚡',
        'Appreciate you watching the videos! Let me know if you need sizing tips 🛍️',
        'Drop a comment on my latest reel and I will pin it! ✨',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convoId
            ? {
                ...c,
                lastMessage: randomReply,
                lastMessageTime: 'Just now',
                messages: [
                  ...c.messages,
                  {
                    id: 'reply-' + Date.now(),
                    senderId: c.creator.handle,
                    text: randomReply,
                    timestamp: 'Just now',
                  },
                ],
              }
            : c
        )
      );
    }, 900);
  };

  // Open Audio Detail Modal
  const handleOpenAudioModal = (title: string, artist: string, cover?: string) => {
    setSelectedAudioInfo({ title, artist, cover });
    setIsAudioModalOpen(true);
  };

  // "Use this Sound" handler
  const handleUseSound = (soundTitle: string) => {
    setPreselectedSoundForPost(soundTitle);
    setIsCreatePostOpen(true);
  };

  // Handle Post Creation (Dual Mode: Reel or Shoppable)
  const handlePostCreated = (newVideo: VideoItem) => {
    setVideos((prev) => [newVideo, ...prev]);
    setActiveTab('foryou');
    setBottomNavTab('feed');
    setCurrentIndex(0);
    showToast(
      newVideo.postType === 'shopping'
        ? '🛍️ Shoppable Video Published with Yellow Cart!'
        : '🎬 Social Reel Published to Feed!'
    );
  };

  // Open Checkout for a product
  const handleOpenCheckout = (product: Product) => {
    setSelectedProductForCheckout(product);
    setIsCheckoutOpen(true);
  };

  // Handle Order placed
  const handleOrderPlaced = (order: OrderItem) => {
    setOrders((prev) => [order, ...prev]);
    setLastCompletedOrder(order);
    setIsOrderSuccessOpen(true);
  };

  // Bottom Nav selector
  const handleSelectBottomTab = (tab: 'feed' | 'live' | 'inbox' | 'profile') => {
    setBottomNavTab(tab);
    if (tab === 'feed') {
      setActiveTab('foryou');
    } else if (tab === 'live') {
      setActiveTab('live');
    } else if (tab === 'inbox') {
      setActiveDMCreator(null);
      setIsDirectMessagesOpen(true);
    } else if (tab === 'profile') {
      setSelectedCreatorForProfile(CURRENT_USER);
      setIsProfileOpen(true);
    }
  };

  // Top header tab switcher
  const handleTopTabChange = (tab: 'following' | 'foryou' | 'live') => {
    setActiveTab(tab);
    if (tab === 'live') {
      setBottomNavTab('live');
    } else {
      setBottomNavTab('feed');
    }
  };

  // All extracted products for quick search/live
  const allInitialProducts = videos
    .filter((v) => v.product)
    .map((v) => v.product as Product);

  // Total unread messages
  const totalUnreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div
      className="relative w-full h-screen bg-[#0A0A0A] flex items-center justify-center overflow-hidden font-sans select-none"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Subtle Background Ambience on Desktop */}
      <div className="absolute inset-0 bg-radial from-[#FFE100]/5 via-[#0A0A0A] to-[#0A0A0A] pointer-events-none" />

      {/* Main Container (Mobile App Frame) */}
      <div className="relative w-full h-full max-w-[440px] md:h-[95vh] md:max-h-[860px] md:rounded-[32px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.9)] border border-[#2A2A2A] bg-black flex flex-col">
        {/* Top Floating Navigation Header */}
        <TopHeader
          activeTab={activeTab}
          onChangeTab={handleTopTabChange}
          ordersCount={orders.length}
          onOpenOrders={() => setIsOrdersOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Content View: Live Stream OR Vertical Video Stack */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          {activeTab === 'live' ? (
            /* Live Stream Experience */
            <LiveStreamView
              streams={MOCK_LIVE_STREAMS}
              onClose={() => handleTopTabChange('foryou')}
              onOpenCheckout={handleOpenCheckout}
              followingMap={followingMap}
              onToggleFollow={handleToggleFollow}
              initialProducts={allInitialProducts}
            />
          ) : filteredVideos.length === 0 ? (
            /* Empty Following state */
            <div className="flex flex-col items-center justify-center h-full text-[#F8F8F8] p-6 text-center">
              <Sparkles className="w-12 h-12 text-[#FFE100] mb-3" />
              <h3 className="text-base font-bold font-['Space_Grotesk']">
                No videos in Following feed
              </h3>
              <p className="text-xs text-[#8E8E93] mt-1 max-w-xs leading-relaxed">
                Follow creators by tapping the + icon on their profile avatars to see their social reels and shopping posts here!
              </p>
              <button
                onClick={() => handleTopTabChange('foryou')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#FFE100] hover:bg-[#F5D700] text-[#0A0A0A] font-black text-xs cursor-pointer shadow-md transition-all"
              >
                Back to For You Feed
              </button>
            </div>
          ) : (
            /* Vertical Video Stack */
            filteredVideos.map((video, idx) => (
              <div
                key={video.id}
                className={`absolute inset-0 w-full h-full transition-all duration-300 ease-out ${
                  idx === currentIndex
                    ? 'translate-y-0 opacity-100 z-10 pointer-events-auto'
                    : idx < currentIndex
                    ? '-translate-y-full opacity-0 z-0 pointer-events-none'
                    : 'translate-y-full opacity-0 z-0 pointer-events-none'
                }`}
              >
                <VideoCard
                  video={video}
                  isActive={idx === currentIndex && activeTab !== 'live'}
                  isLiked={!!likedMap[video.id]}
                  likesCount={likesCountMap[video.id] ?? video.likesCount}
                  isSaved={!!savedMap[video.id]}
                  isFollowing={!!followingMap[video.creator.handle]}
                  isMuted={isMuted}
                  onToggleLike={() => handleToggleLike(video.id)}
                  onToggleSave={() => handleToggleSave(video.id)}
                  onToggleFollow={() => handleToggleFollow(video.creator.handle)}
                  onOpenCheckout={handleOpenCheckout}
                  onOpenComments={() => setIsCommentsOpen(true)}
                  onOpenShare={() => setIsShareOpen(true)}
                  onToggleMute={() => setIsMuted((m) => !m)}
                  onOpenProfile={handleOpenCreatorProfile}
                  onOpenAudio={handleOpenAudioModal}
                />
              </div>
            ))
          )}
        </div>

        {/* TikTok Bottom Navigation Bar */}
        <BottomNavBar
          currentTab={bottomNavTab}
          onSelectTab={handleSelectBottomTab}
          onOpenCreatePost={() => {
            setPreselectedSoundForPost(undefined);
            setIsCreatePostOpen(true);
          }}
          unreadMessagesCount={totalUnreadMessages}
          userAvatar={CURRENT_USER.avatar}
        />
      </div>

      {/* Desktop Feed Next / Prev Navigation Buttons */}
      {activeTab !== 'live' && (
        <div className="hidden md:flex flex-col gap-3 absolute right-8 lg:right-16 z-40">
          <button
            id="prev-video-desktop-btn"
            disabled={currentIndex === 0}
            onClick={goToPrevVideo}
            className="p-3.5 rounded-full bg-[#121212]/90 hover:bg-[#1E1E1E] disabled:opacity-30 disabled:cursor-not-allowed text-[#F8F8F8] border border-[#2A2A2A] hover:border-[#FFE100] shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Previous Video (Up Arrow)"
            aria-label="Previous Video"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <button
            id="next-video-desktop-btn"
            disabled={currentIndex >= filteredVideos.length - 1}
            onClick={goToNextVideo}
            className="p-3.5 rounded-full bg-[#121212]/90 hover:bg-[#1E1E1E] disabled:opacity-30 disabled:cursor-not-allowed text-[#F8F8F8] border border-[#2A2A2A] hover:border-[#FFE100] shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Next Video (Down Arrow)"
            aria-label="Next Video"
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          {/* Video feed counter indicator */}
          <div className="px-3 py-1.5 rounded-full bg-[#121212]/90 text-[#8E8E93] text-xs font-mono font-bold text-center border border-[#2A2A2A] shadow-md">
            <span className="text-[#FFE100]">{currentIndex + 1}</span> / {filteredVideos.length}
          </div>
        </div>
      )}

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[#FFE100] text-[#0A0A0A] font-black text-xs shadow-2xl border border-[#0A0A0A] animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Create Post Modal (Dual Mode: Reel or Shopping Video) */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={handlePostCreated}
        currentUser={CURRENT_USER}
        preselectedSound={preselectedSoundForPost}
      />

      {/* Creator Profile Modal */}
      <CreatorProfileModal
        creator={selectedCreatorForProfile}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        isFollowing={
          selectedCreatorForProfile ? !!followingMap[selectedCreatorForProfile.handle] : false
        }
        onToggleFollow={handleToggleFollow}
        onOpenDirectMessage={handleOpenDM}
        allVideos={videos}
        onSelectVideo={(vidId) => {
          const targetIndex = videos.findIndex((v) => v.id === vidId);
          if (targetIndex !== -1) {
            setActiveTab('foryou');
            setBottomNavTab('feed');
            setCurrentIndex(targetIndex);
          }
        }}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* Direct Messaging Drawer */}
      <DirectMessageDrawer
        isOpen={isDirectMessagesOpen}
        onClose={() => setIsDirectMessagesOpen(false)}
        conversations={conversations}
        activeCreatorChat={activeDMCreator}
        onSendMessage={handleSendMessage}
        onSelectCreator={handleOpenDM}
        onViewProfile={handleOpenCreatorProfile}
      />

      {/* Trending Audio Detail Modal */}
      {selectedAudioInfo && (
        <AudioDetailModal
          isOpen={isAudioModalOpen}
          onClose={() => setIsAudioModalOpen(false)}
          soundTitle={selectedAudioInfo.title}
          soundArtist={selectedAudioInfo.artist}
          soundCoverUrl={selectedAudioInfo.cover}
          onUseSound={handleUseSound}
          allVideos={videos}
          onSelectVideo={(vidId) => {
            const targetIndex = videos.findIndex((v) => v.id === vidId);
            if (targetIndex !== -1) {
              setActiveTab('foryou');
              setBottomNavTab('feed');
              setCurrentIndex(targetIndex);
            }
          }}
        />
      )}

      {/* Product Checkout Drawer */}
      <ProductCheckoutDrawer
        product={selectedProductForCheckout}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Comments Drawer */}
      <CommentsDrawer
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        comments={commentsMap[currentVideo?.id] || []}
        onAddComment={(text) => handleAddComment(currentVideo.id, text)}
        onToggleCommentLike={(commentId) => handleToggleCommentLike(currentVideo.id, commentId)}
        totalCommentsCount={
          (commentsMap[currentVideo?.id]?.length || 0) + (currentVideo?.commentsCount || 0)
        }
      />

      {/* Share Modal */}
      <ShareModal
        video={currentVideo}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* Orders Drawer */}
      <OrdersDrawer
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onSelectProductForCheckout={(order) => handleOpenCheckout(order.product)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        videos={videos}
        onSelectVideo={(idx) => {
          setActiveTab('foryou');
          setBottomNavTab('feed');
          setCurrentIndex(idx);
        }}
      />

      {/* Order Success Confirmation Modal */}
      <OrderSuccessModal
        order={lastCompletedOrder}
        isOpen={isOrderSuccessOpen}
        onClose={() => setIsOrderSuccessOpen(false)}
        onViewOrders={() => {
          setIsOrderSuccessOpen(false);
          setIsOrdersOpen(true);
        }}
      />
    </div>
  );
};
