import React, { useEffect, useState } from 'react';
import { Clock3, LockKeyhole, WalletCards } from 'lucide-react';
import { SellerWalletBalances } from '../types';
import { supabase } from '../lib/supabase';

interface SellerWalletProps { sellerId: string; }

export const SellerWallet: React.FC<SellerWalletProps> = ({ sellerId }) => {
  const [balances, setBalances] = useState<SellerWalletBalances>({ inEscrow: 0, processingSettlement: 0, availableBalance: 0 });

  useEffect(() => {
    if (!supabase) return;
    void supabase.from('seller_wallets').select('escrow_pkr, processing_settlement_pkr, available_balance_pkr').eq('seller_id', sellerId).maybeSingle().then(({ data }) => {
      if (data) setBalances({ inEscrow: data.escrow_pkr, processingSettlement: data.processing_settlement_pkr, availableBalance: data.available_balance_pkr });
    });
  }, [sellerId]);

  const cards = [
    { label: 'In Escrow', detail: '9-day return / claim window', value: balances.inEscrow, icon: LockKeyhole, color: 'text-amber-400' },
    { label: 'Processing Settlement', detail: '3-4 days after returns close', value: balances.processingSettlement, icon: Clock3, color: 'text-cyan-400' },
    { label: 'Available Balance', detail: 'Ready for payout', value: balances.availableBalance, icon: WalletCards, color: 'text-emerald-400' }
  ];

  return <section className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950 p-3"><div className="flex items-center justify-between"><h3 className="text-xs font-black text-white">Seller Wallet</h3><span className="text-[10px] text-neutral-500">Pakistan settlement</span></div>{cards.map(({ label, detail, value, icon: Icon, color }) => <div key={label} className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-3"><Icon className={`h-5 w-5 ${color}`} /><div className="min-w-0 flex-1"><p className="text-xs font-bold text-white">{label}</p><p className="text-[10px] text-neutral-500">{detail}</p></div><span className="text-sm font-black text-white">Rs. {value.toLocaleString()}</span></div>)}</section>;
};
