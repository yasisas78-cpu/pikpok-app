import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Truck,
  Landmark,
  Smartphone,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  PackageCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { Language, CartItem, OrderDetails, PaymentMethod, AdvancePaymentProof } from '../types';
import { translations } from '../data/translations';
import { PAKISTANI_CITIES } from '../data/products';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCheckoutItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  isFreeDelivery: boolean;
  isPromoApplied: boolean;
  promoDiscount: number;
  grandTotal: number;
  lang: Language;
  onOrderPlaced: (order: OrderDetails) => void;
  triggerToast: (msg: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  activeCheckoutItems,
  subtotal,
  deliveryFee,
  isFreeDelivery,
  isPromoApplied,
  promoDiscount,
  grandTotal,
  lang,
  onOrderPlaced,
  triggerToast
}) => {
  const t = translations[lang];

  // Customer Delivery Info
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerCity, setCustomerCity] = useState<string>('Lahore');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Payment Method Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Advance Payment Verification Fields
  const [senderBankName, setSenderBankName] = useState<string>('');
  const [senderAccountTitle, setSenderAccountTitle] = useState<string>('');
  const [senderWalletNumber, setSenderWalletNumber] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedKey(key);
    triggerToast(`${text} - ${t.detailsCopied}`);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotUrl(reader.result as string);
        triggerToast(t.screenshotUploaded);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachSampleReceipt = () => {
    // High-resolution simulated Pakistani mobile banking receipt
    setScreenshotUrl('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80');
    setScreenshotName('Payment_Receipt_PK.jpg');
    if (!transactionId.trim()) {
      const randomTid = `PK${paymentMethod.toUpperCase()}${Math.floor(10000000 + Math.random() * 90000000)}`;
      setTransactionId(randomTid);
    }
    triggerToast(t.screenshotUploaded);
  };

  const handleRemoveScreenshot = () => {
    setScreenshotUrl(null);
    setScreenshotName('');
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!customerName.trim()) {
      errors.name = lang === 'ur' ? 'براہ کرم اپنا پورا نام درج کریں' : (lang === 'ru' ? 'Mukammal naam likhein' : 'Full name is required');
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      errors.phone = lang === 'ur' ? 'درست موبائل نمبر درج کریں (0300-1234567)' : (lang === 'ru' ? 'Durust mobile number darj karein' : 'Enter a valid Pakistani mobile number');
    }

    if (!customerAddress.trim() || customerAddress.trim().length < 8) {
      errors.address = lang === 'ur' ? 'براہ کرم گھر کا مکمل پتہ درج کریں' : (lang === 'ru' ? 'Ghar ka mukammal pata likhein' : 'Complete street address is required');
    }

    if (paymentMethod !== 'cod') {
      if (!transactionId.trim() && !screenshotUrl) {
        errors.transactionId = lang === 'ur' 
          ? 'براہ کرم ٹرانزیکشن آئی ڈی درج کریں یا رسید کا اسکرین شاٹ منسلک کریں'
          : (lang === 'ru' ? 'Transaction ID ya receipt screenshot lazmi hai' : 'Please provide Transaction ID or upload receipt screenshot');
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);

    setTimeout(() => {
      let paymentProof: AdvancePaymentProof | undefined = undefined;

      if (paymentMethod !== 'cod') {
        paymentProof = {
          method: paymentMethod,
          transactionId: transactionId.trim() || `TID-${Math.floor(10000000 + Math.random() * 90000000)}`,
          senderAccount: paymentMethod === 'bank' ? senderAccountTitle.trim() : senderWalletNumber.trim(),
          bankName: paymentMethod === 'bank' ? senderBankName.trim() : undefined,
          screenshotUrl: screenshotUrl || undefined,
          screenshotName: screenshotName || undefined
        };
      }

      const newOrder: OrderDetails = {
        trackingId: `PK-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName: customerName.trim(),
        phone: customerPhone.trim(),
        city: customerCity,
        address: customerAddress.trim(),
        notes: customerNotes.trim(),
        items: activeCheckoutItems,
        subtotal,
        deliveryFee: isFreeDelivery ? 0 : deliveryFee,
        discount: isPromoApplied ? promoDiscount : 0,
        total: grandTotal,
        date: new Date().toLocaleDateString('en-GB'),
        paymentMethod,
        paymentProof
      };

      setIsProcessing(false);
      onOrderPlaced(newOrder);
    }, 1200);
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col justify-end"
      onClick={onClose}
    >
      <div
        id="checkout-modal-content"
        className="bg-neutral-900 border-t border-neutral-800 rounded-t-3xl max-h-[92%] h-[92%] flex flex-col p-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-xs font-black text-white">{t.checkoutTitle}</h3>
              <p className="text-[10px] text-neutral-400">
                {paymentMethod === 'cod' ? t.payOnDeliveryNote : t.advancePaymentNote}
              </p>
            </div>
          </div>
          <button
            id="close-checkout-btn"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-3.5"
        >
          {/* Order Bill Summary */}
          <div className="bg-neutral-950 p-2.5 rounded-2xl border border-neutral-800">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 flex justify-between">
              <span>{t.orderSummary} ({activeCheckoutItems.length} items)</span>
              <span className="text-emerald-400 font-semibold">{isFreeDelivery ? t.free : `+${t.pkr} ${deliveryFee}`}</span>
            </div>
            <div className="space-y-1.5 max-h-24 overflow-y-auto no-scrollbar">
              {activeCheckoutItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-neutral-200 line-clamp-1 max-w-[200px]">
                    {item.quantity}x {item.product.title[lang]}
                  </span>
                  <span className="font-bold text-white shrink-0">
                    {t.pkr} {(item.product.pricePKR * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-2 pt-1.5 border-t border-neutral-800/80 flex justify-between text-xs font-black">
              <span className="text-neutral-300">{t.total}:</span>
              <span className="text-pink-400 text-sm">{t.pkr} {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* PAYMENT METHOD SELECTION TABS */}
          <div>
            <label className="text-xs font-black text-neutral-200 flex items-center mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-pink-400" />
              {t.paymentMethodTitle} *
            </label>

            <div className="grid grid-cols-2 gap-2">
              {/* Option 1: Cash on Delivery (COD) */}
              <button
                type="button"
                id="payment-method-cod-btn"
                onClick={() => setPaymentMethod('cod')}
                className={`p-2.5 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                  paymentMethod === 'cod'
                    ? 'bg-neutral-800/90 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  {paymentMethod === 'cod' && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[10px] font-black">
                      ✓
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">{t.paymentMethodCod}</h4>
                  <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">{t.paymentMethodCodDesc}</p>
                </div>
                <span className="mt-1 inline-block text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded-md border border-emerald-800/60 self-start">
                  Nationwide COD
                </span>
              </button>

              {/* Option 2: Bank Transfer (IBAN) */}
              <button
                type="button"
                id="payment-method-bank-btn"
                onClick={() => setPaymentMethod('bank')}
                className={`p-2.5 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                  paymentMethod === 'bank'
                    ? 'bg-neutral-800/90 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Landmark className="w-4 h-4" />
                  </div>
                  {paymentMethod === 'bank' && (
                    <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-black">
                      ✓
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">{t.paymentMethodBank}</h4>
                  <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">Meezan Bank & HBL IBAN</p>
                </div>
                <span className="mt-1 inline-block text-[9px] font-bold text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded-md border border-blue-800/60 self-start">
                  Direct Transfer
                </span>
              </button>

              {/* Option 3: JazzCash */}
              <button
                type="button"
                id="payment-method-jazzcash-btn"
                onClick={() => setPaymentMethod('jazzcash')}
                className={`p-2.5 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                  paymentMethod === 'jazzcash'
                    ? 'bg-neutral-800/90 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-600 to-red-600 text-white flex items-center justify-center font-black text-[11px]">
                    JC
                  </div>
                  {paymentMethod === 'jazzcash' && (
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center text-[10px] font-black">
                      ✓
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">{t.paymentMethodJazzCash}</h4>
                  <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">0300-8457912</p>
                </div>
                <span className="mt-1 inline-block text-[9px] font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded-md border border-amber-800/60 self-start">
                  JazzCash App / Shop
                </span>
              </button>

              {/* Option 4: EasyPaisa */}
              <button
                type="button"
                id="payment-method-easypaisa-btn"
                onClick={() => setPaymentMethod('easypaisa')}
                className={`p-2.5 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                  paymentMethod === 'easypaisa'
                    ? 'bg-neutral-800/90 border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.2)]'
                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-black text-[11px]">
                    EP
                  </div>
                  {paymentMethod === 'easypaisa' && (
                    <span className="w-4 h-4 rounded-full bg-teal-400 text-black flex items-center justify-center text-[10px] font-black">
                      ✓
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">{t.paymentMethodEasyPaisa}</h4>
                  <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">0345-9871234</p>
                </div>
                <span className="mt-1 inline-block text-[9px] font-bold text-teal-400 bg-teal-950/60 px-1.5 py-0.5 rounded-md border border-teal-800/60 self-start">
                  Instant Wallet
                </span>
              </button>
            </div>
          </div>

          {/* ADVANCE PAYMENT DETAILS & ACCOUNT INFO CARD */}
          {paymentMethod === 'bank' && (
            <div className="bg-blue-950/30 border border-blue-500/40 rounded-2xl p-3 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-1.5 border-b border-blue-500/20">
                <div className="flex items-center space-x-1.5 text-blue-400 font-black text-xs">
                  <Landmark className="w-4 h-4" />
                  <span>PikPok Official Bank Details</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                  Total: {t.pkr} {grandTotal.toLocaleString()}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center bg-black/40 p-2 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Bank Name</span>
                    <span className="text-white font-bold">{t.storeBankName}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-black/40 p-2 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Account Title</span>
                    <span className="text-white font-bold">{t.storeAccountTitle}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText('bank-title', t.storeAccountTitle)}
                    className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs flex items-center space-x-1"
                  >
                    {copiedKey === 'bank-title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex justify-between items-center bg-black/40 p-2 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">IBAN (Meezan Bank)</span>
                    <span className="text-pink-400 font-mono font-bold text-xs">{t.storeIban}</span>
                  </div>
                  <button
                    type="button"
                    id="copy-iban-btn"
                    onClick={() => handleCopyText('bank-iban', t.storeIban)}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold flex items-center space-x-1"
                  >
                    {copiedKey === 'bank-iban' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{t.copyDetails}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'jazzcash' && (
            <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-3 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-1.5 border-b border-amber-500/20">
                <div className="flex items-center space-x-1.5 text-amber-400 font-black text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>JazzCash Official Mobile Account</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                  Total: {t.pkr} {grandTotal.toLocaleString()}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center bg-black/40 p-2 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">JazzCash Number</span>
                    <span className="text-white font-mono font-black text-sm">{t.storeJazzCashNo}</span>
                  </div>
                  <button
                    type="button"
                    id="copy-jazzcash-btn"
                    onClick={() => handleCopyText('jazzcash-no', t.storeJazzCashNo)}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-black font-extrabold rounded-lg text-[10px] flex items-center space-x-1"
                  >
                    {copiedKey === 'jazzcash-no' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{t.copyDetails}</span>
                  </button>
                </div>

                <div className="flex justify-between items-center bg-black/40 p-2 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Account Title</span>
                    <span className="text-white font-bold">{t.storeJazzCashTitle}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'easypaisa' && (
            <div className="bg-teal-950/30 border border-teal-500/40 rounded-2xl p-3 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-1.5 border-b border-teal-500/20">
                <div className="flex items-center space-x-1.5 text-teal-400 font-black text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>EasyPaisa Official Mobile Account</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                  Total: {t.pkr} {grandTotal.toLocaleString()}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center bg-black/40 p-2 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">EasyPaisa Number</span>
                    <span className="text-white font-mono font-black text-sm">{t.storeEasyPaisaNo}</span>
                  </div>
                  <button
                    type="button"
                    id="copy-easypaisa-btn"
                    onClick={() => handleCopyText('easypaisa-no', t.storeEasyPaisaNo)}
                    className="px-2.5 py-1 bg-teal-500 hover:bg-teal-400 text-black font-extrabold rounded-lg text-[10px] flex items-center space-x-1"
                  >
                    {copiedKey === 'easypaisa-no' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{t.copyDetails}</span>
                  </button>
                </div>

                <div className="flex justify-between items-center bg-black/40 p-2 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Account Title</span>
                    <span className="text-white font-bold">{t.storeEasyPaisaTitle}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADVANCE PAYMENT VERIFICATION INPUTS (FOR BANK, JAZZCASH, EASYPAISA) */}
          {paymentMethod !== 'cod' && (
            <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
                <h4 className="text-xs font-black text-white flex items-center">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400 mr-1.5" />
                  Advance Payment Verification
                </h4>
                <button
                  type="button"
                  id="sample-receipt-btn"
                  onClick={handleAttachSampleReceipt}
                  className="text-[10px] text-pink-400 hover:text-pink-300 underline font-bold"
                  title="Automatically fills simulated receipt & TID for testing"
                >
                  ⚡ Attach Sample Receipt
                </button>
              </div>

              {/* Bank-Specific Field: Sender Bank */}
              {paymentMethod === 'bank' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                      {t.senderBankNameLabel}
                    </label>
                    <input
                      type="text"
                      value={senderBankName}
                      onChange={(e) => setSenderBankName(e.target.value)}
                      placeholder={t.senderBankPlaceholder}
                      className="w-full bg-neutral-900 border border-neutral-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                      {t.senderAccountTitleLabel}
                    </label>
                    <input
                      type="text"
                      value={senderAccountTitle}
                      onChange={(e) => setSenderAccountTitle(e.target.value)}
                      placeholder={t.senderAccountTitlePlaceholder}
                      className="w-full bg-neutral-900 border border-neutral-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Wallet-Specific Field: Sender Mobile Number */}
              {(paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && (
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    {t.senderWalletNumberLabel}
                  </label>
                  <input
                    type="tel"
                    value={senderWalletNumber}
                    onChange={(e) => setSenderWalletNumber(e.target.value)}
                    placeholder={t.senderWalletPlaceholder}
                    className="w-full bg-neutral-900 border border-neutral-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500"
                  />
                </div>
              )}

              {/* Transaction ID / TID */}
              <div>
                <label className="text-[11px] font-bold text-neutral-300 flex items-center justify-between mb-1">
                  <span>{t.transactionIdLabel} *</span>
                  <span className="text-[10px] text-neutral-400 font-normal">Found in SMS / Mobile App</span>
                </label>
                <input
                  id="checkout-tid-input"
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder={t.transactionIdPlaceholder}
                  className="w-full bg-neutral-900 border border-neutral-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-pink-500"
                />
                {formErrors.transactionId && (
                  <span className="text-[10px] text-rose-500 font-semibold mt-1 block flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {formErrors.transactionId}
                  </span>
                )}
              </div>

              {/* Screenshot / Receipt Upload */}
              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  {t.uploadScreenshotLabel}
                </label>

                {screenshotUrl ? (
                  <div className="relative bg-neutral-900 border border-pink-500/50 rounded-xl p-2 flex items-center space-x-3">
                    <img
                      src={screenshotUrl}
                      alt="Payment Receipt"
                      className="w-14 h-14 rounded-lg object-cover border border-neutral-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-emerald-400 block truncate">
                        ✓ {screenshotName || t.screenshotUploaded}
                      </span>
                      <span className="text-[10px] text-neutral-400">Ready for instant dispatch verification</span>
                    </div>
                    <button
                      type="button"
                      id="remove-screenshot-btn"
                      onClick={handleRemoveScreenshot}
                      className="text-xs text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded bg-neutral-800"
                    >
                      {t.removeScreenshot}
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-neutral-700 hover:border-pink-500 rounded-xl cursor-pointer bg-neutral-900/60 transition group">
                    <Upload className="w-5 h-5 text-neutral-400 group-hover:text-pink-400 mb-1 transition" />
                    <span className="text-[11px] text-neutral-300 font-semibold">
                      {t.uploadScreenshotPrompt}
                    </span>
                    <input
                      id="receipt-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* CUSTOMER DELIVERY DETAILS */}
          <div className="space-y-2.5">
            <div>
              <label className="text-xs font-bold text-neutral-300 flex items-center mb-1">
                <User className="w-3.5 h-3.5 mr-1 text-pink-400" />
                {t.fullName} *
              </label>
              <input
                id="checkout-name-input"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t.fullNamePlaceholder}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500"
              />
              {formErrors.name && (
                <span className="text-[10px] text-rose-500 font-semibold mt-0.5 block">
                  {formErrors.name}
                </span>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 flex items-center mb-1">
                <Phone className="w-3.5 h-3.5 mr-1 text-pink-400" />
                {t.phone} *
              </label>
              <input
                id="checkout-phone-input"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500"
              />
              {formErrors.phone && (
                <span className="text-[10px] text-rose-500 font-semibold mt-0.5 block">
                  {formErrors.phone}
                </span>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 flex items-center mb-1">
                <MapPin className="w-3.5 h-3.5 mr-1 text-pink-400" />
                {t.city} *
              </label>
              <select
                id="checkout-city-select"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
              >
                {PAKISTANI_CITIES.map((c) => (
                  <option key={c} value={c} className="bg-neutral-900 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 flex items-center mb-1">
                <MapPin className="w-3.5 h-3.5 mr-1 text-pink-400" />
                {t.address} *
              </label>
              <textarea
                id="checkout-address-input"
                rows={2}
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder={t.addressPlaceholder}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500 resize-none"
              />
              {formErrors.address && (
                <span className="text-[10px] text-rose-500 font-semibold mt-0.5 block">
                  {formErrors.address}
                </span>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-400 flex items-center mb-1">
                {t.orderNotes}
              </label>
              <input
                id="checkout-notes-input"
                type="text"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder={t.orderNotesPlaceholder}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Payment Guarantee Note */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-2xl space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-extrabold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                {paymentMethod === 'cod'
                  ? '100% Cash on Delivery Guarantee'
                  : 'Fast-Track Priority Verification Dispatch'}
              </span>
            </div>
            <p className="text-[10px] text-neutral-300 leading-tight">
              {paymentMethod === 'cod'
                ? t.openParcelAllowed
                : 'Your payment proof will be verified within 15 minutes by our Lahore dispatch hub.'}
            </p>
          </div>

          {/* Submit Order Button */}
          <button
            id="confirm-checkout-order-btn"
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3 text-white font-black text-xs rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition transform active:scale-98 disabled:opacity-50 ${
              paymentMethod === 'cod'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30'
                : paymentMethod === 'bank'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30'
                : paymentMethod === 'jazzcash'
                ? 'bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 shadow-amber-600/30'
                : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 shadow-teal-500/30'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t.processingOrder}</span>
              </div>
            ) : (
              <>
                <PackageCheck className="w-4 h-4" />
                <span>
                  {paymentMethod === 'cod'
                    ? `${t.placeOrder} (COD)`
                    : `${t.placeOrder} (${paymentMethod === 'bank' ? 'Bank' : paymentMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'})`}
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
