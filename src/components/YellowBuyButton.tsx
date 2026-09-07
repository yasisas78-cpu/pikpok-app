import React from 'react';
import { ShoppingBag, Star, ChevronRight, Zap } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';

interface YellowBuyButtonProps {
  product: Product;
  onOpenCheckout: (product: Product) => void;
  badgeText?: string;
}

export const YellowBuyButton: React.FC<YellowBuyButtonProps> = ({
  product,
  onOpenCheckout,
  badgeText,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-[calc(100%-80px)] z-30 mb-2.5"
    >
      {/* Mini banner badge if available */}
      {badgeText && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mb-1.5 rounded-md bg-[#FFE100] text-[#0A0A0A] text-[11px] font-black uppercase tracking-wider shadow-md">
          <Zap className="w-3 h-3 fill-current text-[#0A0A0A]" />
          <span>{badgeText}</span>
        </div>
      )}

      {/* Main Yellow Interactive Product Overlay */}
      <div
        id={`product-overlay-${product.id}`}
        onClick={() => onOpenCheckout(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenCheckout(product);
          }
        }}
        className="group relative flex items-center justify-between p-2.5 rounded-2xl bg-[#0A0A0A]/90 hover:bg-[#121212]/95 border border-[#FFE100]/50 hover:border-[#FFE100] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-200 cursor-pointer select-none"
      >
        {/* Product preview thumbnail with yellow ring */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#1A1A1A] border-2 border-[#FFE100] shadow-sm">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute top-0 right-0 bg-[#FF3B30] text-white text-[9px] font-black px-1 rounded-bl">
              -{product.discountPercent}%
            </div>
          </div>

          <div className="min-w-0 flex-1 pr-2">
            <h4 className="text-[#F8F8F8] text-xs sm:text-sm font-bold truncate leading-tight group-hover:text-[#FFE100] transition-colors">
              {product.title}
            </h4>
            <div className="flex items-center gap-2 mt-0.5 text-[11px]">
              <span className="text-[#FFE100] font-black text-sm sm:text-base tracking-tight font-['Space_Grotesk']">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-[#8E8E93] line-through text-[11px]">
                ${product.originalPrice.toFixed(2)}
              </span>
              <div className="hidden xs:flex items-center text-[#E5E5E5] gap-0.5 text-[10px]">
                <Star className="w-2.5 h-2.5 fill-[#FFE100] text-[#FFE100]" />
                <span className="font-semibold">{product.rating}</span>
                <span className="text-[#8E8E93]">({product.salesCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* The Signature Yellow Buy Button Overlay */}
        <motion.button
          id={`buy-now-btn-${product.id}`}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenCheckout(product);
          }}
          className="relative shrink-0 flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#FFE100] hover:bg-[#F5D700] active:bg-[#E5C900] text-[#0A0A0A] font-black text-xs sm:text-sm tracking-tight shadow-[0_4px_16px_rgba(255,225,0,0.3)] transition-all cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5 fill-current text-[#0A0A0A]" />
          <span className="whitespace-nowrap font-bold">Buy Now</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
        </motion.button>
      </div>
    </motion.div>
  );
};
