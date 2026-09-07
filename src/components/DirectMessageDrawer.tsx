import React, { useState } from 'react';
import { X, Search, ChevronLeft, Send, CheckCheck, Sparkles, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatConversation, Creator } from '../types';

interface DirectMessageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: ChatConversation[];
  activeCreatorChat: Creator | null;
  onSendMessage: (conversationId: string, text: string) => void;
  onSelectCreator: (creator: Creator) => void;
  onViewProfile: (creator: Creator) => void;
}

export const DirectMessageDrawer: React.FC<DirectMessageDrawerProps> = ({
  isOpen,
  onClose,
  conversations,
  activeCreatorChat,
  onSendMessage,
  onSelectCreator,
  onViewProfile,
}) => {
  const [selectedConvoId, setSelectedConvoId] = useState<string | null>(
    activeCreatorChat ? null : conversations[0]?.id || null
  );
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // If opened directly with an activeCreatorChat that doesn't have a conversation yet, find or mock
  const activeConversation = conversations.find(
    (c) =>
      c.id === selectedConvoId ||
      (activeCreatorChat && c.creator.handle === activeCreatorChat.handle)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const convoId = activeConversation ? activeConversation.id : 'chat-' + Date.now();
    onSendMessage(convoId, inputText.trim());
    setInputText('');
  };

  const handleQuickQuestion = (q: string) => {
    const convoId = activeConversation ? activeConversation.id : 'chat-' + Date.now();
    onSendMessage(convoId, q);
  };

  // Filter conversations
  const filteredConversations = conversations.filter(
    (c) =>
      c.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.creator.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-[#121212] border border-[#2A2A2A] rounded-3xl text-[#F8F8F8] shadow-2xl h-[85vh] max-h-[640px] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#242424] bg-[#0E0E0E] shrink-0">
          {activeConversation || activeCreatorChat ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedConvoId(null);
                }}
                className="p-1 rounded-full hover:bg-[#222] text-[#8E8E93] hover:text-[#F8F8F8] cursor-pointer"
                title="Back to all chats"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div
                onClick={() => {
                  const targetCreator = activeConversation?.creator || activeCreatorChat;
                  if (targetCreator) onViewProfile(targetCreator);
                }}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <img
                  src={activeConversation?.creator.avatar || activeCreatorChat?.avatar}
                  alt="Creator"
                  className="w-8 h-8 rounded-full object-cover border border-[#FFE100]"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#F8F8F8] group-hover:text-[#FFE100] transition-colors leading-tight">
                    {activeConversation?.creator.name || activeCreatorChat?.name}
                  </span>
                  <span className="text-[10px] text-[#8E8E93] leading-none">
                    {activeConversation?.creator.handle || activeCreatorChat?.handle}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-black font-['Space_Grotesk'] text-[#F8F8F8]">
                Direct Messages
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFE100]/20 text-[#FFE100] font-bold">
                PikPok Inbox
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#222] text-[#8E8E93] hover:text-[#F8F8F8] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content: Conversation List OR Active Chat Thread */}
        {!activeConversation && !activeCreatorChat ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-[#222222]">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#8E8E93]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search creators & messages..."
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] focus:border-[#FFE100] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#F8F8F8] placeholder:text-[#8E8E93] focus:outline-none"
                />
              </div>
            </div>

            {/* List of Conversations */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#1F1F1F]">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvoId(conv.id)}
                  className="flex items-center gap-3 p-3.5 hover:bg-[#1A1A1A] cursor-pointer transition-colors"
                >
                  <div className="relative">
                    <img
                      src={conv.creator.avatar}
                      alt={conv.creator.name}
                      className="w-11 h-11 rounded-full object-cover border border-[#2E2E2E]"
                    />
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#FF3B30] border-2 border-[#121212]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F8F8F8] truncate">
                        {conv.creator.name}
                      </span>
                      <span className="text-[10px] text-[#8E8E93] shrink-0 font-mono">
                        {conv.lastMessageTime}
                      </span>
                    </div>
                    <p
                      className={`text-xs truncate mt-0.5 ${
                        conv.unreadCount > 0 ? 'text-[#F8F8F8] font-bold' : 'text-[#8E8E93]'
                      }`}
                    >
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Active Chat Thread */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              <div className="text-center py-2">
                <span className="text-[10px] text-[#8E8E93] bg-[#0A0A0A] px-3 py-1 rounded-full border border-[#222]">
                  End-to-end encrypted creator chat
                </span>
              </div>

              {activeConversation?.messages.map((msg) => {
                const isMe = msg.senderId === 'me';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#FFE100] text-[#0A0A0A] font-medium rounded-br-none shadow-sm'
                          : 'bg-[#1C1C1E] text-[#F8F8F8] rounded-bl-none border border-[#2A2A2A]'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[9px] text-[#8E8E93] font-mono px-1">
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-[#FFE100]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Ask Chips */}
            <div className="px-3 py-1.5 bg-[#0C0C0C] border-t border-[#202020] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-bold text-[#FFE100] shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Quick Ask:
              </span>
              {[
                'Is this in stock?',
                'What is the delivery time?',
                'Any discount promo code?',
                'Can you review more colors?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="px-2.5 py-1 rounded-full bg-[#181818] hover:bg-[#222] border border-[#2E2E2E] text-[10px] text-[#D4D4D4] whitespace-nowrap cursor-pointer transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-[#242424] bg-[#0E0E0E] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Message creator..."
                className="flex-1 bg-[#181818] border border-[#2E2E2E] focus:border-[#FFE100] rounded-full px-3.5 py-2 text-xs text-[#F8F8F8] placeholder:text-[#8E8E93] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-full bg-[#FFE100] hover:bg-[#F5D700] disabled:opacity-30 text-[#0A0A0A] cursor-pointer disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4 fill-current" />
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
