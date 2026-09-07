import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send, MessageSquare, QrCode } from 'lucide-react';
import { VideoItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ShareModalProps {
  video: VideoItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ video, isOpen, onClose }) => {
  if (!video) return null;

  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/video/${video.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTargets = [
    { name: 'WhatsApp', color: 'bg-emerald-600', icon: '💬' },
    { name: 'Instagram', color: 'bg-gradient-to-tr from-yellow-500 to-fuchsia-600', icon: '📸' },
    { name: 'Messenger', color: 'bg-blue-600', icon: '⚡' },
    { name: 'X / Twitter', color: 'bg-zinc-800', icon: '𝕏' },
    { name: 'Messages', color: 'bg-green-500', icon: '✉️' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-lg bg-[#121212] border-t border-[#2A2A2A] rounded-t-3xl p-5 text-[#F8F8F8] z-10"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <h3 className="text-sm font-bold font-['Space_Grotesk'] text-[#F8F8F8]">Share PikPok Find</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#222222] text-[#8E8E93] hover:text-[#F8F8F8] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video preview mini */}
            <div className="flex items-center gap-3 p-2.5 my-3 bg-[#171717] rounded-xl border border-[#2A2A2A]">
              <img
                src={video.product ? video.product.images[0] : video.posterUrl}
                alt="Video preview"
                className="w-12 h-12 rounded-lg object-cover bg-[#1E1E1E] border border-[#2E2E2E]"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#F8F8F8] truncate">
                  {video.product ? video.product.title : video.caption}
                </div>
                <div className="text-[11px] text-[#FFE100] font-bold mt-0.5 font-['Space_Grotesk']">
                  {video.product
                    ? `$${video.product.price.toFixed(2)} • Shared by ${video.creator.handle}`
                    : `Reel • Shared by ${video.creator.handle}`}
                </div>
              </div>
            </div>

            {/* Share targets icons row */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto py-3">
              {shareTargets.map((target) => (
                <button
                  key={target.name}
                  onClick={handleCopy}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div
                    className={`w-12 h-12 rounded-full ${target.color} flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform`}
                  >
                    {target.icon}
                  </div>
                  <span className="text-[10px] text-[#8E8E93] group-hover:text-[#F8F8F8] transition-colors">
                    {target.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Copy Link Input Bar */}
            <div className="mt-2 flex items-center gap-2 p-2 bg-[#0A0A0A] rounded-xl border border-[#2E2E2E]">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-xs text-[#D4D4D4] px-2 focus:outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-lg bg-[#FFE100] hover:bg-[#F5D700] text-[#0A0A0A] font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
