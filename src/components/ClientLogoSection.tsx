// components/ClientLogoSection.tsx
'use client';

import { useRef } from 'react';
import { Icons, WCLogo } from './Icons';
import { FallbackImg } from './FallbackImg';
import { TitleMode } from '@/lib/types';
import { extractDomain } from '@/lib/utils';

interface ClientLogoSectionProps {
  clientName: string;
  titleMode: TitleMode;
  setTitleMode: (mode: TitleMode) => void;
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
  titleMode,
  setTitleMode,
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

  return (
    <div className="mb-4">
      <label className="block text-slate-300 text-sm font-medium mb-3">
        Client Logo for Title Slide
      </label>

      {/* Three option cards */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* Option 1: Text Name */}
        <button
          onClick={() => setTitleMode('text')}
          className={`relative rounded-xl p-3 border-2 transition-all text-left ${
            titleMode === 'text'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
          }`}
        >
          {titleMode === 'text' && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <Icons.Check />
            </div>
          )}
          <div className={`mb-2 ${titleMode === 'text' ? 'text-blue-400' : 'text-slate-400'}`}>
            <Icons.Type />
          </div>
          <p className={`text-sm font-medium ${titleMode === 'text' ? 'text-white' : 'text-slate-300'}`}>Text Name</p>
          <p className="text-xs text-slate-500 mt-1">Use "{clientName || 'PSP name'}" as text</p>
        </button>

        {/* Option 2: From Website */}
        <button
          onClick={() => setTitleMode('website')}
          className={`relative rounded-xl p-3 border-2 transition-all text-left ${
            titleMode === 'website'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
          }`}
        >
          {/* Blue checkmark - only when selected */}
          {titleMode === 'website' && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <Icons.Check />
            </div>
          )}
          {/* Icon - blue only when selected */}
          <div className={`mb-2 ${titleMode === 'website' ? 'text-blue-400' : 'text-slate-400'}`}>
            <Icons.Globe />
          </div>
          <p className={`text-sm font-medium ${titleMode === 'website' ? 'text-white' : 'text-slate-300'}`}>From Website</p>
          {/* Status text with green checkmark when fetched */}
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

        {/* Option 3: Upload Logo */}
        <button
          onClick={() => setTitleMode('upload')}
          className={`relative rounded-xl p-3 border-2 transition-all text-left ${
            titleMode === 'upload'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
          }`}
        >
          {/* Blue checkmark - only when selected */}
          {titleMode === 'upload' && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <Icons.Check />
            </div>
          )}
          {/* Icon - blue only when selected */}
          <div className={`mb-2 ${titleMode === 'upload' ? 'text-blue-400' : 'text-slate-400'}`}>
            <Icons.Upload />
          </div>
          <p className={`text-sm font-medium ${titleMode === 'upload' ? 'text-white' : 'text-slate-300'}`}>Upload Logo</p>
          {/* Status text with green checkmark when uploaded */}
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
      <div className="min-h-[52px]">
        {titleMode === 'website' && (
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

        {titleMode === 'upload' && (
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

        {titleMode === 'text' && (
          <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-500 text-sm">
            <Icons.Type />
            <span>Title slide will display "<span className="text-slate-300">{clientName || 'Client Name'}</span>" as text</span>
          </div>
        )}

        {/* Show disabled upload area when not on upload mode but no logo uploaded yet */}
        {titleMode !== 'upload' && !processedLogo && titleMode !== 'text' && titleMode !== 'website' && (
          <div className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-600 text-sm opacity-50 cursor-not-allowed">
            <Icons.Upload /> Click to upload logo file
          </div>
        )}
      </div>

      {logoError && <p className="text-amber-400 text-xs mt-2">{logoError}</p>}

      {/* Live mini-preview */}
      <div className="mt-3 relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '28%' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a6bff 0%, #3b8bff 30%, #59a0ff 60%, #7ab8ff 100%)' }}>
          <div className="flex flex-col items-center justify-center h-full gap-1">
            <div className="flex items-center gap-2">
              <WCLogo className="h-5" />
              <span className="text-white text-base font-semibold">WalletConnect Pay</span>
            </div>
            <span className="text-white/60 text-xs">x</span>
            {/* Show content based on selected mode */}
            {titleMode === 'text' && (
              <span className="text-white text-lg font-bold">{clientName || 'Client Name'}</span>
            )}
            {titleMode === 'website' && (
              fetchedLogo ? (
                <FallbackImg
                  sources={fetchedLogo}
                  alt={clientName}
                  style={{ maxHeight: 40, maxWidth: 160, objectFit: 'contain' }}
                  onAllFailed={() => { setTitleMode('text'); setFetchedLogo(null); setLogoError('Could not load logo — switched to text'); }}
                />
              ) : (
                <span className="text-white text-lg font-bold">{clientName || 'Client Name'}</span>
              )
            )}
            {titleMode === 'upload' && (
              processedLogo ? (
                <img src={processedLogo} alt={clientName} style={{ maxHeight: 40, maxWidth: 160, objectFit: 'contain' }} />
              ) : (
                <span className="text-white text-lg font-bold">{clientName || 'Client Name'}</span>
              )
            )}
          </div>
        </div>
        <div className="absolute bottom-1 right-2 text-white/40 text-[10px]">Preview</div>
      </div>
    </div>
  );
}