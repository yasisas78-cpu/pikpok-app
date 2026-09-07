import React from 'react';
import { Home, Radio, Plus, MessageSquare, User } from 'lucide-react';

interface BottomNavBarProps {
  currentTab: 'feed' | 'live' | 'inbox' | 'profile';
  onSelectTab: (tab: 'feed' | 'live' | 'inbox' | 'profile') => void;
  onOpenCreatePost: () => void;
  unreadMessagesCount: number;
  userAvatar: string;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCreatePost,
  unreadMessagesCount,
  userAvatar,
}) => {
  return (
    <nav className="relative z-40 w-full bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-[#242424] px-4 py-1.5 flex items-center justify-between text-[#8E8E93] select-none shrink-0">
      {/* Home Feed */}
      <button
        id="nav-home-btn"
        onClick={() => onSelectTab('feed')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors cursor-pointer ${
          currentTab === 'feed' ? 'text-[#F8F8F8] font-black' : 'hover:text-[#F8F8F8]'
        }`}
      >
        <Home className={`w-5 h-5 ${currentTab === 'feed' ? 'stroke-[2.5] text-[#FFE100]' : ''}`} />
        <span className="text-[10px] font-medium tracking-tight">Home</span>
      </button>

      {/* Live Streams */}
      <button
        id="nav-live-btn"
        onClick={() => onSelectTab('live')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors cursor-pointer relative ${
          currentTab === 'live' ? 'text-[#F8F8F8] font-black' : 'hover:text-[#F8F8F8]'
        }`}
      >
        <div className="relative">
          <Radio className={`w-5 h-5 ${currentTab === 'live' ? 'text-[#FF3B30] stroke-[2.5]' : ''}`} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF3B30] animate-ping" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF3B30]" />
        </div>
        <span className="text-[10px] font-medium tracking-tight">Live</span>
      </button>

      {/* Post / Create Dual Mode (+) */}
      <button
        id="nav-create-post-btn"
        onClick={onOpenCreatePost}
        className="group relative -my-2 p-1 focus:outline-none cursor-pointer"
        title="Post Video (Social Reel or Shopping Video)"
        aria-label="Create Post"
      >
        <div className="w-11 h-8 rounded-xl bg-gradient-to-r from-[#FF3B30] via-[#FFE100] to-[#00F2FE] p-[2px] transition-transform group-hover:scale-105 active:scale-95 shadow-md">
          <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center">
            <Plus className="w-5 h-5 text-[#F8F8F8] stroke-[3]" />
          </div>
        </div>
      </button>

      {/* Inbox / DMs */}
      <button
        id="nav-inbox-btn"
        onClick={() => onSelectTab('inbox')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors cursor-pointer relative ${
          currentTab === 'inbox' ? 'text-[#F8F8F8] font-black' : 'hover:text-[#F8F8F8]'
        }`}
      >
        <div className="relative">
          <MessageSquare className={`w-5 h-5 ${currentTab === 'inbox' ? 'stroke-[2.5] text-[#FFE100]' : ''}`} />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-[#FF3B30] text-white text-[9px] font-black leading-tight border border-[#0A0A0A]">
              {unreadMessagesCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium tracking-tight">Inbox</span>
      </button>

      {/* Profile */}
      <button
        id="nav-profile-btn"
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors cursor-pointer ${
          currentTab === 'profile' ? 'text-[#F8F8F8] font-black' : 'hover:text-[#F8F8F8]'
        }`}
      >
        <div className={`w-5 h-5 rounded-full overflow-hidden border ${currentTab === 'profile' ? 'border-[#FFE100] ring-1 ring-[#FFE100]' : 'border-[#444]'}`}>
          <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <span className="text-[10px] font-medium tracking-tight">Profile</span>
      </button>
    </nav>
  );
};
