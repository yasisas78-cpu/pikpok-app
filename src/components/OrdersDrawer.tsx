import React from 'react';
import { X, Package, Clock, ShoppingBag, ChevronRight, ExternalLink } from 'lucide-react';
import { OrderItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface OrdersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderItem[];
  onSelectProductForCheckout: (order: OrderItem) => void;
}

export const OrdersDrawer: React.FC<OrdersDrawerProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectProductForCheckout,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-xs cursor-pointer"
          />

          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-lg max-h-[85vh] h-[80vh] bg-[#121212] border border-[#2A2A2A] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col text-[#F8F8F8] z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#242424] shrink-0 bg-[#0E0E0E]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#FFE100]" />
                <h3 className="text-base font-bold font-['Space_Grotesk'] text-[#F8F8F8]">
                  My PikPok Orders ({orders.length})
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#222222] text-[#8E8E93] hover:text-[#F8F8F8] cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Orders list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-[#8E8E93] mb-3">
                    <Package className="w-8 h-8 text-[#FFE100]" />
                  </div>
                  <h4 className="text-sm font-bold text-[#F8F8F8]">No orders yet</h4>
                  <p className="text-xs text-[#8E8E93] mt-1 max-w-xs leading-relaxed">
                    Tap the yellow buy button on any video in your feed to checkout trending items!
                  </p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-[#171717] border border-[#2A2A2A] rounded-2xl space-y-3"
                  >
                    {/* Order header line */}
                    <div className="flex items-center justify-between text-xs border-b border-[#242424] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#8E8E93] text-[11px]">
                          {order.orderNumber}
                        </span>
                        <span className="text-[#3A3A3C]">•</span>
                        <span className="text-[#8E8E93]">{order.date}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                        {order.status}
                      </span>
                    </div>

                    {/* Product preview */}
                    <div className="flex gap-3 items-center">
                      <img
                        src={order.product.images[0]}
                        alt={order.product.title}
                        className="w-16 h-16 rounded-xl object-cover bg-[#1E1E1E] shrink-0 border border-[#333333]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#F8F8F8] truncate">
                          {order.product.title}
                        </div>
                        <div className="text-[11px] text-[#8E8E93] mt-0.5">
                          Quantity: {order.quantity}
                          {order.selectedColor && ` • ${order.selectedColor}`}
                          {order.selectedSize && ` • ${order.selectedSize}`}
                        </div>
                        <div className="text-[#FFE100] font-black text-sm mt-1 font-['Space_Grotesk']">
                          ${order.totalPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Delivery & Payment note */}
                    <div className="pt-2 border-t border-[#242424] flex items-center justify-between text-[11px] text-[#8E8E93]">
                      <span>Paid via {order.paymentMethod}</span>
                      <button
                        onClick={() => {
                          onClose();
                          onSelectProductForCheckout(order);
                        }}
                        className="text-[#FFE100] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        Buy Again <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
