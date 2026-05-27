// components/ClientLogoSection.tsx
'use client';

import { useRef } from 'react';
import { Icons, WCLogo } from './Icons';
import { FallbackImg } from './FallbackImg';
import { LogoMode } from '@/lib/types';
import { extractDomain } from '@/lib/utils';

interface ClientLogoSectionProps {
  clientName: string;
  addLogoImage: boolean;
  setAddLogoImage: (v: boolean) => void;
  logoMode: LogoMode;
  setLogoMode: (mode: LogoMode) => void;
  clientWebsite: string;
  setClientWebsite: (url: string) => void;
  fetchedLogo: string[] | null;
  setFetchedLogo: (logos: string[] | null) => void;
  processedLogo: string | null;
  processing: boolean;
  logoError: string | null;
  setLogoError: (error: string | null) => void;
  onFetchLogo: (url: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearUpload: () => void;
  onDownloadLogo: () => void;
}

export function ClientLogoSection({
  clientName,
  addLogoImage,
  setAddLogoImage,
  logoMode,
  setLogoMode,
  clientWebsite,
  setClientWebsite,
  fetchedLogo,
  setFetchedLogo,
  processedLogo,
  processing,
  logoError,
  setLogoError,
  onFetchLogo,
  onFileUpload,
  onClearUpload,
  onDownloadLogo,
}: ClientLogoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // The logo that's ready to preview
  const previewLogoSrc = logoMode === 'upload' ? processedLogo : null;
  const previewLogoSources = logoMode === 'website' ? fetchedLogo : null;

  return (
    <div className="mb-4">
      <div className="mb-3">
        <span className="text-blue-400 text-xs font-semibold">5. CLIENT LOGO</span>
      </div>
      <label className="block text-slate-300 text-sm font-medium mb-3">
        Client Logo for Title Slide
      </label>

      {/* Text name is always on */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-400 text-sm mb-3">
        <Icons.Type />
        <span>Title slide will always display "<span className="text-slate-300">{clientName || 'Client Name'}</span>" as text</span>
      </div>

      {/* Checkbox: add logo image */}
      <label className="flex items-center gap-3 cursor-pointer mb-3 group">
        <div
          onClick={() => setAddLogoImage(!addLogoImage)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
            addLogoImage ? 'bg-blue-500 border-blue-500' : 'border-slate-600 bg-slate-900 group-hover:border-slate-400'
          }`}
        >
          {addLogoImage && <Icons.Check />}
        </div>
        <span className="text-slate-300 text-sm select-none" onClick={() => setAddLogoImage(!addLogoImage)}>
          Also add logo image to top-right corner
        </span>
      </label>

      {/* Logo options — only shown when checkbox is checked */}
      {addLogoImage && (
        <div>
          {/* Two option cards */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Option 1: From Website */}
            <button
              onClick={() => setLogoMode('website')}
              className={`relative rounded-xl p-3 border-2 transition-all text-left ${
                logoMode === 'website'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
              }`}
            >
              {logoMode === 'website' && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Icons.Check />
                </div>
              )}
              <div className={`mb-2 ${logoMode === 'website' ? 'text-blue-400' : 'text-slate-400'}`}>
                <Icons.Globe />
              </div>
              <p className={`text-sm font-medium ${logoMode === 'website' ? 'text-white' : 'text-slate-300'}`}>From Website</p>
              <p className="text-xs mt-1 flex items-center gap-1">
                {fetchedLogo ? (
                  <>
                    <span className="text-green-400">Fetched ({extractDomain(clientWebsite)})</span>
                    <span className="text-green-400"><Icons.Check /></span>
                  </>
                ) : (
                  <span className="text-slate-500">Auto-fetch from URL</span>
                )}
              </p>
            </button>

            {/* Option 2: Upload Logo */}
            <button
              onClick={() => setLogoMode('upload')}
              className={`relative rounded-xl p-3 border-2 transition-all text-left ${
                logoMode === 'upload'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
              }`}
            >
              {logoMode === 'upload' && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Icons.Check />
                </div>
              )}
              <div className={`mb-2 ${logoMode === 'upload' ? 'text-blue-400' : 'text-slate-400'}`}>
                <Icons.Upload />
              </div>
              <p className={`text-sm font-medium ${logoMode === 'upload' ? 'text-white' : 'text-slate-300'}`}>Upload Logo</p>
              <p className="text-xs mt-1 flex items-center gap-1">
                {processedLogo ? (
                  <>
                    <span className="text-green-400">Logo ready</span>
                    <span className="text-green-400"><Icons.Check /></span>
                  </>
                ) : (
                  <span className="text-slate-500">PNG, SVG, JPG...</span>
                )}
              </p>
            </button>
          </div>

          {/* Contextual input area */}
          <div className="min-h-[52px] mb-3">
            {logoMode === 'website' && (
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-slate-900 border border-slate-600 rounded-lg px-3 focus-within:border-blue-500 transition-colors">
                  <Icons.Globe />
                  <input
                    type="text"
                    value={clientWebsite}
                    onChange={(e) => setClientWebsite(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') onFetchLogo(clientWebsite); }}
                    placeholder="Enter website (e.g., stripe.com)"
                    className="flex-1 bg-transparent py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none"
                    autoFocus
                  />
                  {fetchedLogo && (
                    <button
                      onClick={() => { setFetchedLogo(null); setClientWebsite(''); setLogoError(null); }}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Icons.X />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => onFetchLogo(clientWebsite)}
                  disabled={!clientWebsite.trim()}
                  className="px-5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 shrink-0 transition-colors"
                >
                  <Icons.Globe /> Fetch
                </button>
              </div>
            )}

            {logoMode === 'upload' && (
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileUpload} className="hidden" />
                {processedLogo ? (
                  <div className="flex items-center gap-3 bg-slate-900 border border-blue-500 rounded-lg px-3 py-2">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-700">
                      {processing ? <Icons.Loader /> : <img src={processedLogo} alt="" className="max-w-full max-h-full object-contain" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300 text-sm truncate">Logo uploaded</p>
                      <p className="text-slate-500 text-xs">Background removed</p>
                    </div>
                    <button onClick={onDownloadLogo} className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-xs transition-colors">
                      <Icons.Download /> Download
                    </button>
                    <button onClick={onClearUpload} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Icons.X />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-blue-500 rounded-lg text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 text-sm transition-all"
                  >
                    <Icons.Upload /> Click to upload logo file
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {logoError && <p className="text-amber-400 text-xs mt-2 mb-2">{logoError}</p>}

      {/* Live mini-preview — fixed inner canvas scaled to fit */}
      <div className="mt-3 w-full rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <div className="w-full h-full flex" style={{ background: 'radial-gradient(ellipse 70% 55% at 85% 0%, #f0f5ff 0%, transparent 55%), radial-gradient(ellipse 55% 55% at 20% 85%, #ddeaff 0%, transparent 50%), radial-gradient(ellipse 45% 65% at 60% 50%, #7799ff 0%, transparent 55%), #3d62cc' }}>
          {/* Left column: WC Pay logo vertically centered */}
          <div className="flex-1 flex items-center p-[5%]">
            <div className="flex items-center gap-2">
              <WCLogo className="h-[1.1em]" />
              <span className="text-white font-semibold" style={{ fontSize: 'clamp(9px, 1.8cqi, 16px)' }}>WalletConnect Pay</span>
            </div>
          </div>

          {/* Right column */}
          <div className="flex-1 flex flex-col p-[5%] relative">
            {/* Logo image — top-right corner */}
            {addLogoImage && (
              <div className="absolute top-[5%] right-[3%] flex items-center justify-center" style={{ width: '17%', height: '8.1%' }}>
                {previewLogoSrc ? (
                  <img src={previewLogoSrc} alt={clientName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : previewLogoSources ? (
                  <FallbackImg
                    sources={previewLogoSources}
                    alt={clientName}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onAllFailed={() => { setFetchedLogo(null); setLogoError('Could not load logo preview'); }}
                  />
                ) : (
                  <div className="border border-dashed border-white/30 rounded px-1.5 py-0.5">
                    <span className="text-white/30 italic" style={{ fontSize: 'clamp(5px, 0.9cqi, 8px)' }}>logo here</span>
                  </div>
                )}
              </div>
            )}

            {/* Title + client name — vertically centered as a group */}
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-[8%]">
                <span className="text-white/80 font-medium" style={{ fontSize: 'clamp(7px, 1.4cqi, 13px)' }}>Technical & Integration Overview for:</span>
                <span className="text-white font-bold" style={{ fontSize: 'clamp(10px, 2.2cqi, 20px)' }}>{clientName || 'Client Name'}</span>
              </div>
            </div>

            <div className="text-white/30 text-right" style={{ fontSize: 'clamp(6px, 1cqi, 10px)' }}>Preview</div>
          </div>
        </div>
      </div>
    </div>
  );
}
