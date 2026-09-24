import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  ShoppingBag,
  Store,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  Search,
  MessageSquare,
  Truck
} from 'lucide-react';
import { Language, Conversation, Product } from '../types';
import { translations } from '../data/translations';

interface InboxViewProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string | null) => void;
  onSendMessage: (conversationId: string, text: string) => void;
  onBuyProduct?: (product: Product) => void;
  allProducts: Product[];
  lang: Language;
}

export const InboxView: React.FC<InboxViewProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  allProducts,
  lang
}) => {
  const t = translations[lang];
  const [inputText, setInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSend = (textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim() || !activeConversationId) return;

    onSendMessage(activeConversationId, content.trim());
    if (!textToSend) {
      setInputText('');
    }
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.sellerName.toLowerCase().includes(q) ||
      c.sellerShopName.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
    );
  });

  // Quick inquiry chips
  const quickQuestions = [
    t.quickAskAvailable,
    t.quickAskPrice,
    t.quickAskDelivery,
    t.quickAskCOD
  ];

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 text-white overflow-hidden pb-16">
      {/* If viewing a specific conversation */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Active Chat Header */}
          <div className="px-4 py-3 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between z-10 backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <button
                id="inbox-back-btn"
                onClick={() => onSelectConversation(null)}
                className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative">
                <img
                  src={activeConversation.sellerAvatar}
                  alt={activeConversation.sellerName}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-neutral-900" />
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-white">
                    {activeConversation.sellerShopName}
                  </span>
                  {activeConversation.sellerVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                  )}
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t.sellerStatusOnline}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-lg text-[10px] text-neutral-300 font-semibold flex items-center space-x-1">
                <Store className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">{activeConversation.sellerName}</span>
              </div>
            </div>
          </div>

          {/* Product Context Banner (if message relates to a product) */}
          {activeConversation.product && (
            <div className="px-4 py-2 bg-neutral-900/60 border-b border-neutral-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <img
                  src={activeConversation.product.image}
                  alt={activeConversation.product.title}
                  className="w-9 h-9 rounded-lg object-cover border border-neutral-700 flex-shrink-0"
                />
                <div className="overflow-hidden">
                  <p className="text-[11px] font-bold text-neutral-200 truncate">
                    {activeConversation.product.title}
                  </p>
                  <p className="text-[10px] font-extrabold text-pink-400">
                    Rs. {activeConversation.product.pricePKR.toLocaleString()} (COD)
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0 ml-2">
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-bold border border-pink-500/30">
                  Product Inquiry
                </span>
              </div>
            </div>
          )}

          {/* Messages Scrollable List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 no-scrollbar">
            {activeConversation.messages.map((msg) => {
              const isBuyer = msg.sender === 'buyer';
              const isSystem = msg.sender === 'system';

              if (isSystem || msg.isOrderUpdate) {
                return (
                  <div
                    key={msg.id}
                    id={`chat-msg-${msg.id}`}
                    className="flex justify-center my-2"
                  >
                    <div className="max-w-[85%] bg-amber-950/30 border border-amber-500/30 rounded-2xl px-3.5 py-2 text-center shadow-sm">
                      <div className="flex items-center justify-center space-x-1 text-[10px] font-bold text-amber-400 mb-0.5">
                        <Truck className="w-3 h-3" />
                        <span>{t.orderUpdateBadge}</span>
                      </div>
                      <p className="text-[11px] text-amber-200/90 leading-tight">
                        {msg.text}
                      </p>
                      <span className="text-[9px] text-neutral-500 block mt-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  id={`chat-msg-${msg.id}`}
                  className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                      isBuyer
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-br-none'
                        : 'bg-neutral-800 text-neutral-100 rounded-bl-none border border-neutral-700/60'
                    }`}
                  >
                    <p className="break-words">{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-neutral-500 mt-1 px-1 flex items-center space-x-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{msg.timestamp}</span>
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Response Chips (Inquiry Shortcuts) */}
          <div className="px-3 py-1.5 bg-neutral-900 border-t border-neutral-800 flex items-center space-x-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-neutral-400 flex items-center space-x-1 flex-shrink-0">
              <Sparkles className="w-3 h-3 text-pink-400" />
              <span>Quick:</span>
            </span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="flex-shrink-0 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-full text-[10px] text-neutral-200 transition active:scale-95 whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center space-x-2"
          >
            <input
              id="inbox-message-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.typeMessagePlaceholder}
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-full px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500 transition"
            />
            <button
              type="submit"
              id="inbox-send-btn"
              disabled={!inputText.trim()}
              className={`p-2.5 rounded-full transition ${
                inputText.trim()
                  ? 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-600/30'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Conversations List View */
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-base font-extrabold text-white">
                    {t.inboxTab}
                  </h1>
                  <p className="text-[10px] text-neutral-400">
                    Direct inquiries & verified Pakistani sellers
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 font-bold">
                {conversations.length} {t.messages}
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
              <input
                id="inbox-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shops or messages..."
                className="w-full pl-9 pr-3 py-2 bg-neutral-800 border border-neutral-700/80 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/80 no-scrollbar">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-neutral-300">
                  {t.noMessages}
                </p>
                <p className="text-xs text-neutral-500 max-w-xs">
                  {t.noMessagesSub}
                </p>
              </div>
            ) : (
              filteredConversations.map((c) => (
                <div
                  key={c.id}
                  id={`conversation-item-${c.id}`}
                  onClick={() => onSelectConversation(c.id)}
                  className="p-3.5 flex items-start space-x-3 hover:bg-neutral-900/80 cursor-pointer transition active:bg-neutral-900"
                >
                  {/* Seller Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={c.sellerAvatar}
                      alt={c.sellerName}
                      className="w-12 h-12 rounded-full object-cover border border-neutral-700"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-neutral-950" />
                  </div>

                  {/* Conversation Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5 truncate">
                        <span className="text-xs font-bold text-white truncate">
                          {c.sellerShopName}
                        </span>
                        {c.sellerVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400 flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-500 flex-shrink-0">
                        {c.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-1">
                      {c.lastMessage}
                    </p>

                    {/* Linked Product Chip if any */}
                    {c.product && (
                      <div className="mt-1.5 flex items-center space-x-1.5 text-[10px] text-neutral-300 bg-neutral-900 px-2 py-0.5 rounded-md border border-neutral-800 w-fit max-w-full truncate">
                        <ShoppingBag className="w-3 h-3 text-pink-400 flex-shrink-0" />
                        <span className="truncate">{c.product.title}</span>
                      </div>
                    )}
                  </div>

                  {/* Unread indicator */}
                  {c.unreadCount > 0 && (
                    <div className="flex-shrink-0 self-center">
                      <span className="w-5 h-5 rounded-full bg-pink-500 text-white font-bold text-[10px] flex items-center justify-center shadow-sm">
                        {c.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
