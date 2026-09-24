import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShieldAlert, Award, X, Sparkles, RefreshCw, CheckCircle2, Gift } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakScore: number;
  lastActiveTimestamp: number;
  onExtendStreak: () => void;
  onSimulateExpiry: () => void;
  onResetStreak: () => void;
  lang: Language;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  streakScore,
  lastActiveTimestamp,
  onExtendStreak,
  onSimulateExpiry,
  onResetStreak,
  lang
}) => {
  const t = translations[lang];
  const [timeLeftMs, setTimeLeftMs] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const expiry = lastActiveTimestamp + 24 * 60 * 60 * 1000;
      const diff = expiry - Date.now();
      setTimeLeftMs(Math.max(0, diff));
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [lastActiveTimestamp]);

  if (!isOpen) return null;

  const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);

  const isExpired = timeLeftMs === 0 && streakScore > 0;
  const isExpiringSoon = timeLeftMs > 0 && timeLeftMs < 6 * 60 * 60 * 1000; // less than 6 hours

  return (
    <div
      id="streak-modal-backdrop"
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="streak-modal-content"
        className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-2xl overflow-hidden relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">{t.streakScoreLabel}</h3>
              <p className="text-[10px] text-neutral-400">Snapchat-Style Retention</p>
            </div>
          </div>
          <button
            id="close-streak-modal-btn"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Streak Hero Banner */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-b from-neutral-800/80 to-neutral-950 border border-neutral-700/60 text-center relative overflow-hidden">
          <div className="flex items-center justify-center space-x-2">
            <Flame className="w-10 h-10 text-rose-500 fill-rose-500 animate-bounce" />
            <span className="text-4xl font-black tracking-tight text-white">
              {streakScore}
            </span>
          </div>

          <div className="text-xs font-bold text-amber-400 mt-1">
            {isExpired
              ? t.streakBroken
              : isExpiringSoon
              ? t.streakExpiringSoon
              : t.streakActive}
          </div>

          {/* 24h Countdown Timer Display */}
          <div className="mt-3 py-2 px-3 bg-neutral-900/90 rounded-xl border border-neutral-800 inline-flex items-center space-x-2 text-xs">
            <Clock className={`w-3.5 h-3.5 ${isExpiringSoon ? 'text-rose-500 animate-spin' : 'text-neutral-400'}`} />
            <span className={`font-mono font-bold ${isExpiringSoon ? 'text-rose-400' : 'text-white'}`}>
              {String(hours).padStart(2, '0')}h : {String(minutes).padStart(2, '0')}m : {String(seconds).padStart(2, '0')}s
            </span>
            <span className="text-[10px] text-neutral-400">{t.hoursRemaining}</span>
          </div>

          {isExpiringSoon && (
            <div className="mt-2 text-[11px] text-rose-400 font-semibold flex items-center justify-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Extend your streak now before the 24h timer expires!</span>
            </div>
          )}
        </div>

        {/* Streak Extend CTA Button */}
        <div className="space-y-2">
          <button
            id="extend-streak-btn"
            onClick={() => {
              onExtendStreak();
            }}
            className="w-full py-3 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition transform active:scale-98"
          >
            <Flame className="w-4 h-4 fill-white" />
            <span>{t.extendStreakBtn}</span>
          </button>

          {/* Streak Rules Accordion / Card */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1.5 text-[11px] text-neutral-300">
            <div className="font-bold text-white flex items-center space-x-1 mb-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.streakRulesTitle}</span>
            </div>
            <p className="flex items-start space-x-1.5 text-[10px] text-neutral-400">
              <span className="text-pink-400">•</span>
              <span>{t.streakRule1}</span>
            </p>
            <p className="flex items-start space-x-1.5 text-[10px] text-neutral-400">
              <span className="text-pink-400">•</span>
              <span>{t.streakRule2}</span>
            </p>
            <p className="flex items-start space-x-1.5 text-[10px] text-neutral-400">
              <span className="text-pink-400">•</span>
              <span>{t.streakRule3}</span>
            </p>
          </div>

          {/* Streak Perks */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1.5 text-[10px] text-neutral-300">
            <div className="font-bold text-white flex items-center space-x-1">
              <Gift className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.streakPerksTitle}</span>
            </div>
            <div className="grid grid-cols-2 gap-1 pt-1">
              <span className="bg-neutral-900 px-2 py-1 rounded text-neutral-300">🔥 3d: 5% Off</span>
              <span className="bg-neutral-900 px-2 py-1 rounded text-neutral-300">🔥 7d: 10% Off + Free COD</span>
              <span className="bg-neutral-900 px-2 py-1 rounded text-neutral-300">🔥 14d: 15% VIP</span>
              <span className="bg-neutral-900 px-2 py-1 rounded text-neutral-300">🔥 30d: Rs. 1000 Gift</span>
            </div>
          </div>

          {/* Testing / Simulation Buttons for User/Reviewer convenience */}
          <div className="pt-2 flex items-center space-x-2">
            <button
              id="simulate-expiry-btn"
              onClick={onSimulateExpiry}
              className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-bold rounded-lg transition"
              title="Test the countdown expiration behavior"
            >
              ⏱️ {t.simulateExpiryBtn}
            </button>
            <button
              id="reset-streak-btn"
              onClick={onResetStreak}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-rose-950/60 text-neutral-400 hover:text-rose-400 text-[10px] font-bold rounded-lg transition"
            >
              {t.resetStreakBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
