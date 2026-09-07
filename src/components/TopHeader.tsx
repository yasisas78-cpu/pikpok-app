import React from 'react';
import { ShoppingBag, Search, Sparkles } from 'lucide-react';

interface TopHeaderProps {
  activeTab: 'following' | 'foryou' | 'live';
  onChangeTab: (tab: 'following' | 'foryou' | 'live') => void;
  ordersCount: number;
  onOpenOrders: () => void;
  onOpenSearch: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onChangeTab,
  ordersCount,
  onOpenOrders,
  onOpenSearch,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-b from-[#0A0A0A]/95 via-[#0A0A0A]/60 to-transparent pointer-events-auto select-none">
      {/* PikPok Brand Logo */}
      <div 
        onClick={() => onChangeTab('foryou')}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="w-7 h-7 rounded-lg bg-[#FFE100] flex items-center justify-center text-[#0A0A0A] font-black text-sm shadow-[0_0_12px_rgba(255,225,0,0.35)] transition-transform group-hover:scale-105">
          ⚡
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-base tracking-tight text-[#F8F8F8] font-['Space_Grotesk'] leading-none">
            Pik<span className="text-[#FFE100]">Pok</span>
          </span>
          <span className="text-[8px] uppercase tracking-widest text-[#8E8E93] font-bold mt-0.5">
            REELS & SHOP
          </span>
        </div>
      </div>

      {/* Center Feed Tabs: Following | For You | Live */}
      <div className="flex items-center gap-1 bg-[#121212]/85 backdrop-blur-md px-1.5 py-1 rounded-full border border-[#2A2A2A] text-xs font-bold shadow-md">
        <button
          id="tab-following-btn"
          onClick={() => onChangeTab('following')}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            activeTab === 'following'
              ? 'bg-[#F8F8F8] text-[#0A0A0A] shadow-sm font-extrabold'
              : 'text-[#8E8E93] hover:text-[#F8F8F8]'
          }`}
        >
          Following
        </button>

        <button
          id="tab-foryou-btn"
          onClick={() => onChangeTab('foryou')}
          className={`px-3 py-1 rounded-full transition-all cursor-pointer relative ${
            activeTab === 'foryou'
              ? 'bg-[#F8F8F8] text-[#0A0A0A] shadow-sm font-extrabold'
              : 'text-[#8E8E93] hover:text-[#F8F8F8]'
          }`}
        >
          For You
          {activeTab === 'foryou' && (
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FFE100]" />
          )}
        </button>

        <button
          id="tab-live-btn"
          onClick={() => onChangeTab('live')}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'live'
              ? 'bg-[#FF3B30] text-white shadow-sm font-black'
              : 'text-[#FF453A] hover:text-[#FF6961]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#FF3B30] inline-block animate-pulse ring-2 ring-[#FF3B30]/40" />
          <span>Live</span>
        </button>
      </div>

      {/* Right Actions: Search & Orders Bag */}
      <div className="flex items-center gap-2">
        <button
          id="header-search-btn"
          onClick={onOpenSearch}
          className="p-2 rounded-full bg-[#121212]/70 hover:bg-[#1E1E1E] backdrop-blur-md text-[#E5E5E5] hover:text-[#F8F8F8] border border-[#2A2A2A] hover:border-[#3A3A3C] transition-all cursor-pointer"
          title="Search products & tags"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          id="header-orders-btn"
          onClick={onOpenOrders}
          className="relative p-2 rounded-full bg-[#FFE100]/10 hover:bg-[#FFE100]/20 backdrop-blur-md text-[#FFE100] border border-[#FFE100]/30 hover:border-[#FFE100]/60 transition-all cursor-pointer"
          title="My Orders & Cart"
          aria-label="Orders"
        >
          <ShoppingBag className="w-4 h-4 text-[#FFE100]" />
          {ordersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FFE100] text-[#0A0A0A] font-black text-[10px] flex items-center justify-center shadow-md">
              {ordersCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
