import React, { useEffect, useState } from 'react';
import { Download, MoreVertical, PlusSquare, Share, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const isIosDevice = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

export const InstallPrompt: React.FC = () => {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('pikpok_install_dismissed') === '1');

  useEffect(() => {
    setIsInstalled(isStandalone());
    setIsIos(isIosDevice());
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallEvent(null);
      setShowIosGuide(false);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('pikpok_install_dismissed', '1');
    setDismissed(true);
    setShowIosGuide(false);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') setIsInstalled(true);
    setInstallEvent(null);
  };

  if (isInstalled || dismissed || (!installEvent && !isIos)) return null;

  return (
    <>
      <div className="fixed bottom-20 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border border-pink-500/30 bg-neutral-950/95 p-3 text-white shadow-2xl backdrop-blur-xl">
        <img src="/icon-512.png" alt="PikPok" className="h-10 w-10 rounded-xl" />
        <div className="min-w-0 flex-1"><p className="text-xs font-black">Install PikPok</p><p className="truncate text-[10px] text-neutral-400">A faster TikTok-style app on your home screen</p></div>
        {installEvent ? <button onClick={install} className="flex items-center gap-1 rounded-xl bg-pink-600 px-3 py-2 text-[10px] font-black"><Download className="h-3 w-3" />Install</button> : <button onClick={() => setShowIosGuide(true)} className="rounded-xl bg-pink-600 px-3 py-2 text-[10px] font-black">Add to Home</button>}
        <button onClick={dismiss} className="rounded-full p-1 text-neutral-500 hover:text-white" aria-label="Dismiss install prompt"><X className="h-4 w-4" /></button>
      </div>

      {showIosGuide && <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setShowIosGuide(false)}><div className="w-full max-w-sm rounded-3xl border border-white/10 bg-neutral-950 p-5 text-white shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="mb-4 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-400">PikPok PWA</p><h2 className="text-lg font-black">Add to Home Screen</h2></div><button onClick={() => setShowIosGuide(false)} className="rounded-full bg-white/10 p-2" aria-label="Close instructions"><X className="h-4 w-4" /></button></div><div className="space-y-3 text-xs text-neutral-300"><p className="flex items-center gap-3 rounded-xl bg-white/5 p-3"><Share className="h-5 w-5 shrink-0 text-sky-400" /><span>Tap the <strong>Share</strong> button in Safari.</span></p><p className="flex items-center gap-3 rounded-xl bg-white/5 p-3"><PlusSquare className="h-5 w-5 shrink-0 text-pink-400" /><span>Choose <strong>Add to Home Screen</strong>.</span></p><p className="flex items-center gap-3 rounded-xl bg-white/5 p-3"><MoreVertical className="h-5 w-5 shrink-0 text-amber-400" /><span>Tap <strong>Add</strong> to install PikPok with its native icon.</span></p></div><button onClick={dismiss} className="mt-5 w-full rounded-xl bg-pink-600 py-3 text-xs font-black">Got it</button></div></div>}
    </>
  );
};
