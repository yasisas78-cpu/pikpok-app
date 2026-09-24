import React from 'react';
import { CheckCircle2, Package, Truck, ArrowRight, X, ExternalLink } from 'lucide-react';
import { OrderItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface OrderSuccessModalProps {
  order: OrderItem | null;
  isOpen: boolean;
  onClose: () => void;
  onViewOrders: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  onViewOrders,
}) => {
  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#121212] border border-[#2A2A2A] rounded-3xl p-6 text-[#F8F8F8] shadow-2xl z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#222222] text-[#8E8E93] hover:text-[#F8F8F8] cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h2 className="text-xl font-black text-[#F8F8F8] font-['Space_Grotesk']">Order Confirmed! 🎉</h2>
              <p className="text-xs text-[#8E8E93] mt-1">
                Thank you for shopping on <span className="text-[#FFE100] font-black">PikPok</span>!
              </p>
              <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#2E2E2E] rounded-full text-xs font-mono text-[#FFE100] font-bold mt-2.5">
                Order #{order.orderNumber}
              </div>
            </div>

            {/* Order Card Preview */}
            <div className="mt-5 p-3.5 bg-[#171717] rounded-2xl border border-[#2A2A2A] flex items-center gap-3 text-left">
              <img
                src={order.product.images[0]}
                alt={order.product.title}
                className="w-14 h-14 rounded-xl object-cover bg-[#1E1E1E] shrink-0 border border-[#2E2E2E]"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-[#F8F8F8] truncate">{order.product.title}</h4>
                <div className="text-[11px] text-[#8E8E93] mt-0.5">
                  Qty: {order.quantity}
                  {order.selectedColor && ` • ${order.selectedColor}`}
                  {order.selectedSize && ` • ${order.selectedSize}`}
                </div>
                <div className="text-[#FFE100] font-black text-xs mt-1 font-['Space_Grotesk']">
                  Paid: ${order.totalPrice.toFixed(2)} via {order.paymentMethod}
                </div>
              </div>
            </div>

            {/* Delivery Timeline Preview */}
            <div className="mt-4 p-3 bg-[#1A1A1A] rounded-xl text-xs space-y-2 border border-[#2E2E2E]">
              <div className="flex items-center justify-between text-[#E5E5E5] font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Package className="w-3.5 h-3.5" /> Order Preparing
                </span>
                <span className="text-[11px] text-[#8E8E93]">Est. 2-3 days</span>
              </div>
              <div className="w-full bg-[#2A2A2A] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#FFE100] h-full w-1/3 rounded-full" />
              </div>
              <p className="text-[11px] text-[#8E8E93]">
                Shipping to: {order.shippingAddress.street}, {order.shippingAddress.city}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={onViewOrders}
                className="w-full py-3.5 rounded-xl bg-[#FFE100] hover:bg-[#F5D700] text-[#0A0A0A] font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(255,225,0,0.25)]"
              >
                <span>View in My Orders</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#242424] text-[#E5E5E5] hover:text-[#F8F8F8] font-bold text-xs border border-[#2E2E2E] transition-colors cursor-pointer"
              >
                Keep Browsing PikPok Feed
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
