import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  CreditCard,
  Smartphone,
  Banknote,
  Sparkles,
  ChevronRight,
  Plus,
  Minus,
  Lock,
} from 'lucide-react';
import { Product, OrderItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface ProductCheckoutDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (order: OrderItem) => void;
}

export const ProductCheckoutDrawer: React.FC<ProductCheckoutDrawerProps> = ({
  product,
  isOpen,
  onClose,
  onOrderPlaced,
}) => {
  // Selected variant state
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isVoucherApplied, setIsVoucherApplied] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'pikpok_pay' | 'apple_pay' | 'card' | 'cod'>('pikpok_pay');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address fields
  const [shippingAddress, setShippingAddress] = useState({
    fullName: 'Alex Morgan',
    street: '742 Evergreen Terrace, Apt 4B',
    city: 'San Francisco, CA',
    zipCode: '94107',
  });

  React.useEffect(() => {
    if (product) {
      const initial: Record<string, string> = {};
      product.variants.forEach((v) => {
        const firstInStock = v.options.find((o) => o.inStock) || v.options[0];
        if (firstInStock) {
          initial[v.name] = firstInStock.value;
        }
      });
      setSelectedVariants(initial);
      setQuantity(1);
      setActiveImageIndex(0);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  // Calculations
  const itemSubtotal = product.price * quantity;
  const voucherDiscount = isVoucherApplied && product.voucher ? product.voucher.discountAmount : 0;
  const shippingFee = 0; // Free shipping
  const finalTotal = Math.max(0, itemSubtotal - voucherDiscount + shippingFee);

  const handleSelectOption = (variantName: string, optionValue: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: optionValue,
    }));
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);

    // Simulate swift network payment processing
    setTimeout(() => {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981'],
        });
      } catch (err) {
        // Fallback silently if canvas is not ready
      }

      const newOrder: OrderItem = {
        id: 'ord-' + Date.now(),
        product,
        selectedColor: selectedVariants['Color'] || selectedVariants['Colorway'] || selectedVariants['Color Finish'],
        selectedSize: selectedVariants['Size'] || selectedVariants['US Men Size'] || selectedVariants['Package Option'] || selectedVariants['Edition'],
        quantity,
        totalPrice: finalTotal,
        orderNumber: 'PKP-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Processing',
        shippingAddress,
        paymentMethod:
          paymentMethod === 'pikpok_pay'
            ? 'PikPok 1-Tap Pay'
            : paymentMethod === 'apple_pay'
            ? 'Apple Pay'
            : paymentMethod === 'card'
            ? 'Credit Card (••4242)'
            : 'Cash on Delivery',
      };

      setIsSubmitting(false);
      onOrderPlaced(newOrder);
      onClose();
    }, 900);
  };

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
            className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Content */}
          <motion.div
            id="product-checkout-drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-lg max-h-[88vh] bg-[#121212] border-t border-[#2A2A2A] rounded-t-3xl shadow-2xl flex flex-col text-[#F8F8F8] z-10 overflow-hidden"
          >
            {/* Grab Handle & Close Bar */}
            <div className="flex items-center justify-between px-5 pt-3 pb-2.5 border-b border-[#242424] shrink-0 bg-[#0E0E0E]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FFE100] animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-[#FFE100] font-['Space_Grotesk']">
                  PikPok Shop Checkout
                </span>
              </div>
              <button
                id="close-checkout-drawer"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#222222] text-[#8E8E93] hover:text-[#F8F8F8] transition-colors cursor-pointer"
                aria-label="Close checkout"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto px-5 py-4 space-y-5 flex-1 custom-scrollbar">
              {/* Product Header Card */}
              <div className="flex gap-4 items-start bg-[#171717] p-3.5 rounded-2xl border border-[#2A2A2A]">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#1E1E1E] shrink-0 border border-[#333333]">
                  <img
                    src={product.images[activeImageIndex] || product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-[#FFE100] text-[#0A0A0A] text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                    -{product.discountPercent}%
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-[#8E8E93] font-medium">
                    <span>{product.brand}</span>
                    <span className="text-[#3A3A3C]">•</span>
                    <span className="text-emerald-400 flex items-center gap-0.5 font-semibold">
                      <Truck className="w-3 h-3 text-[#FFE100]" /> Free Express
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#F8F8F8] mt-1 line-clamp-2 leading-snug">
                    {product.title}
                  </h3>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-black text-[#FFE100] font-['Space_Grotesk']">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-[#8E8E93] line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-[#D4D4D4] flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-[#FFE100] text-[#FFE100]" />
                      {product.rating} ({product.salesCount})
                    </span>
                  </div>
                </div>
              </div>

              {/* Thumbnails Gallery */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#FFE100] scale-105 shadow-md'
                          : 'border-[#2A2A2A] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Product view" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Variant Selectors */}
              {product.variants.map((variant) => (
                <div key={variant.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#D4D4D4]">Select {variant.name}</span>
                    <span className="text-[#FFE100] font-bold">
                      {variant.options.find((o) => o.value === selectedVariants[variant.name])?.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((opt) => {
                      const isSelected = selectedVariants[variant.name] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          disabled={!opt.inStock}
                          onClick={() => handleSelectOption(variant.name, opt.value)}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            !opt.inStock
                              ? 'opacity-30 bg-[#141414] border-[#222222] cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-[#FFE100]/15 border-[#FFE100] text-[#FFE100] shadow-sm font-bold'
                              : 'bg-[#1A1A1A] border-[#2E2E2E] text-[#D4D4D4] hover:border-[#4A4A4A]'
                          }`}
                        >
                          {opt.colorHex && (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm shrink-0"
                              style={{ backgroundColor: opt.colorHex }}
                            />
                          )}
                          <span>{opt.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#FFE100] ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity Selector */}
              <div className="flex items-center justify-between py-2.5 border-y border-[#242424]">
                <div>
                  <span className="text-xs font-bold text-[#E5E5E5]">Quantity</span>
                  <span className="block text-[11px] text-[#8E8E93]">
                    {product.stock} items in local warehouse
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-[#1A1A1A] rounded-xl p-1 border border-[#2E2E2E]">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#E5E5E5] hover:bg-[#2A2A2A] disabled:opacity-30 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-sm w-6 text-center text-[#F8F8F8]">{quantity}</span>
                  <button
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#E5E5E5] hover:bg-[#2A2A2A] disabled:opacity-30 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Instant Voucher / Coupon Banner */}
              {product.voucher && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFE100]/10 border border-[#FFE100]/40">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-[#FFE100] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#FFE100] flex items-center gap-1.5">
                        <span>PikPok Voucher Applied</span>
                        <span className="px-1.5 py-0.2 rounded bg-[#FFE100] text-[#0A0A0A] text-[10px] font-black">
                          {product.voucher.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#D4D4D4]">{product.voucher.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsVoucherApplied(!isVoucherApplied)}
                    className="text-xs font-bold text-[#FFE100] hover:underline cursor-pointer ml-2 shrink-0"
                  >
                    {isVoucherApplied ? 'Remove' : 'Apply'}
                  </button>
                </div>
              )}

              {/* Shipping Address Summary */}
              <div className="p-3.5 bg-[#171717] rounded-xl border border-[#2A2A2A] text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[#8E8E93] font-semibold flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#FFE100]" />
                    Delivering to:
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold">
                    Standard (2-3 Business Days)
                  </span>
                </div>
                <p className="font-bold text-[#F8F8F8]">{shippingAddress.fullName}</p>
                <p className="text-[#8E8E93] text-[11px] mt-0.5">
                  {shippingAddress.street}, {shippingAddress.city} {shippingAddress.zipCode}
                </p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#D4D4D4]">Payment Method</span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pikpok_pay')}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'pikpok_pay'
                        ? 'bg-[#FFE100]/15 border-[#FFE100] text-[#F8F8F8] shadow-sm'
                        : 'bg-[#1A1A1A] border-[#2E2E2E] text-[#D4D4D4] hover:border-[#444444]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#FFE100] flex items-center justify-center text-[#0A0A0A] font-black text-xs shrink-0">
                      ⚡
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">PikPok 1-Tap</div>
                      <div className="text-[10px] text-[#8E8E93] truncate">Instant checkout</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'apple_pay'
                        ? 'bg-[#FFE100]/15 border-[#FFE100] text-[#F8F8F8] shadow-sm'
                        : 'bg-[#1A1A1A] border-[#2E2E2E] text-[#D4D4D4] hover:border-[#444444]'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-[#D4D4D4] shrink-0 ml-1" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">Apple / GPay</div>
                      <div className="text-[10px] text-[#8E8E93] truncate">Fast biometric</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-[#FFE100]/15 border-[#FFE100] text-[#F8F8F8] shadow-sm'
                        : 'bg-[#1A1A1A] border-[#2E2E2E] text-[#D4D4D4] hover:border-[#444444]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#D4D4D4] shrink-0 ml-1" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">Credit Card</div>
                      <div className="text-[10px] text-[#8E8E93] truncate">Visa / MC / Amex</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'bg-[#FFE100]/15 border-[#FFE100] text-[#F8F8F8] shadow-sm'
                        : 'bg-[#1A1A1A] border-[#2E2E2E] text-[#D4D4D4] hover:border-[#444444]'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-[#D4D4D4] shrink-0 ml-1" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">Cash on Del.</div>
                      <div className="text-[10px] text-[#8E8E93] truncate">Pay upon arrival</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Order Cost Breakdown */}
              <div className="space-y-1.5 pt-2.5 border-t border-[#242424] text-xs">
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold text-[#F8F8F8]">${itemSubtotal.toFixed(2)}</span>
                </div>
                {isVoucherApplied && voucherDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount Voucher</span>
                    <span className="font-bold">-${voucherDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Shipping Fee</span>
                  <span className="text-emerald-400 font-bold uppercase">Free</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#F8F8F8] pt-2 border-t border-[#242424]">
                  <span>Total Due</span>
                  <span className="text-xl text-[#FFE100] font-black font-['Space_Grotesk']">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-around py-2.5 text-[11px] text-[#8E8E93] bg-[#171717] rounded-xl border border-[#242424]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FFE100]" /> Buyer Protection
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-[#FFE100]" /> 30-Day Returns
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#FFE100]" /> 256-Bit SSL
                </span>
              </div>
            </div>

            {/* Bottom Sticky Action Footer */}
            <div className="p-4 bg-[#0A0A0A] border-t border-[#242424] shrink-0 flex items-center justify-between gap-4">
              <div className="shrink-0">
                <div className="text-[11px] text-[#8E8E93]">Final Price</div>
                <div className="text-xl font-black text-[#FFE100] leading-tight font-['Space_Grotesk']">
                  ${finalTotal.toFixed(2)}
                </div>
              </div>

              <button
                id="confirm-place-order-btn"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#FFE100] hover:bg-[#F5D700] active:bg-[#E5C900] text-[#0A0A0A] font-black text-sm tracking-wide shadow-[0_4px_20px_rgba(255,225,0,0.25)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Place Order & Pay</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
