import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-2 rounded-full font-medium transition active:scale-95 shadow-md ${
          compact
            ? 'bg-[#E50914] text-white px-3 py-1.5 text-xs hover:bg-[#B20710]'
            : 'bg-[#E50914] text-white px-4 py-2 text-sm hover:bg-[#B20710]'
        }`}
        title="Install FlixDairy app"
      >
        <Download className="w-4 h-4" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-900/80 text-neutral-300 transition hover:bg-neutral-800 ${
            compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
          }`}
          title="Install on iOS"
        >
          <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
          <span>Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#181818] border border-neutral-800 p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#E50914]" />
                  Install on iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-neutral-300">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-white shrink-0">1</span>
                  <p>Tap the <span className="font-semibold text-white">Share</span> button in Safari's bottom toolbar.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-white shrink-0">2</span>
                  <p>Scroll down and select <span className="font-semibold text-white">"Add to Home Screen"</span>.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-white shrink-0">3</span>
                  <p>Tap <span className="font-semibold text-[#E50914]">Add</span> in the top right to get the FlixDairy icon!</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-neutral-800 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
