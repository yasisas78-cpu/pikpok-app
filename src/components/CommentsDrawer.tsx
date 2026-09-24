import React, { useState } from 'react';
import { X, Heart, Send, Sparkles } from 'lucide-react';
import { CommentItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comments: CommentItem[];
  onAddComment: (text: string) => void;
  onToggleCommentLike: (commentId: string) => void;
  totalCommentsCount: number;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  isOpen,
  onClose,
  comments,
  onAddComment,
  onToggleCommentLike,
  totalCommentsCount,
}) => {
  const [newCommentText, setNewCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(newCommentText.trim());
    setNewCommentText('');
  };

  const quickEmojis = ['🔥', '😍', '💸', '🛍️', '🙌', '✨'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Sheet */}
          <motion.div
            id="comments-drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-lg max-h-[72vh] h-[68vh] bg-[#121212] border-t border-[#2A2A2A] rounded-t-3xl shadow-2xl flex flex-col text-[#F8F8F8] z-10"
          >
            {/* Header */}
            <div className="relative flex items-center justify-center px-4 py-3.5 border-b border-[#242424] shrink-0 bg-[#0E0E0E]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4D4D4] font-['Space_Grotesk']">
                {totalCommentsCount.toLocaleString()} Comments
              </h3>
              <button
                onClick={onClose}
                className="absolute right-4 p-1.5 rounded-full hover:bg-[#222222] text-[#8E8E93] hover:text-[#F8F8F8] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3 text-xs">
                  <img
                    src={c.user.avatar}
                    alt={c.user.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#2E2E2E]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#F8F8F8]">{c.user.name}</span>
                      {c.user.badge && (
                        <span className="px-1.5 py-0.2 text-[9px] rounded bg-[#FFE100]/15 text-[#FFE100] font-bold border border-[#FFE100]/30">
                          {c.user.badge}
                        </span>
                      )}
                      <span className="text-[10px] text-[#8E8E93]">{c.timeAgo}</span>
                    </div>
                    <p className="text-[#D4D4D4] mt-1 leading-relaxed">{c.text}</p>
                    <div className="flex items-center gap-4 mt-1.5 text-[11px] text-[#8E8E93] font-semibold">
                      <button className="hover:text-[#F8F8F8] cursor-pointer">Reply</button>
                    </div>
                  </div>

                  {/* Comment Like button */}
                  <div className="flex flex-col items-center shrink-0">
                    <button
                      onClick={() => onToggleCommentLike(c.id)}
                      className="p-1 hover:text-[#FF3B30] transition-colors cursor-pointer"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          c.isLiked ? 'fill-[#FF3B30] text-[#FF3B30]' : 'text-[#8E8E93]'
                        }`}
                      />
                    </button>
                    <span className="text-[10px] text-[#8E8E93]">{c.likes}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick emoji reaction bar */}
            <div className="px-4 py-2 flex items-center gap-2 border-t border-[#242424] bg-[#0E0E0E]">
              <span className="text-[10px] text-[#8E8E93] font-medium mr-1">Quick:</span>
              {quickEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setNewCommentText((prev) => prev + emoji)}
                  className="hover:scale-125 transition-transform text-sm cursor-pointer p-0.5"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-[#0A0A0A] border-t border-[#242424] shrink-0 flex items-center gap-2"
            >
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Add a comment or ask about product..."
                className="flex-1 bg-[#1A1A1A] border border-[#2E2E2E] rounded-full px-4 py-2.5 text-xs text-[#F8F8F8] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#FFE100] transition-colors"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="p-2.5 rounded-full bg-[#FFE100] hover:bg-[#F5D700] disabled:opacity-30 text-[#0A0A0A] transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4 fill-current text-[#0A0A0A]" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
