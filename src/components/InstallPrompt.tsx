import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallPrompt: React.FC = () => {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    setIsInstalled(standalone);
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallEvent(null);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (isInstalled || dismissed || !installEvent) return null;

  const install = async () => {
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') setIsInstalled(true);
    setInstallEvent(null);
  };

  return <div className="fixed bottom-20 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border border-pink-500/30 bg-neutral-950/95 p-3 text-white shadow-2xl backdrop-blur-xl"><img src="/icon-512.png" alt="PikPok" className="h-10 w-10 rounded-xl" /><div className="min-w-0 flex-1"><p className="text-xs font-black">Install PikPok</p><p className="truncate text-[10px] text-neutral-400">Add PikPok to your home screen</p></div><button onClick={install} className="flex items-center gap-1 rounded-xl bg-pink-600 px-3 py-2 text-[10px] font-black"><Download className="h-3 w-3" />Install</button><button onClick={() => setDismissed(true)} className="rounded-full p-1 text-neutral-500 hover:text-white" aria-label="Dismiss install prompt"><X className="h-4 w-4" /></button></div>;
};
