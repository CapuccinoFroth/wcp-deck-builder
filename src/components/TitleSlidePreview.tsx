// components/TitleSlidePreview.tsx
'use client';

import { WCLogo } from './Icons';
import { FallbackImg } from './FallbackImg';
import { TitleMode } from '@/lib/types';

interface TitleSlidePreviewProps {
  clientName: string;
  titleMode: TitleMode;
  fetchedLogo: string[] | null;
  processedLogo: string | null;
  onLogoFailed?: () => void;
}

export function TitleSlidePreview({
  clientName,
  titleMode,
  fetchedLogo,
  processedLogo,
  onLogoFailed,
}: TitleSlidePreviewProps) {
  
  // Determine what to show based on selected mode
  const renderClientIdentity = () => {
    switch (titleMode) {
      case 'website':
        // Show fetched logo if available, otherwise show text
        if (fetchedLogo) {
          return (
            <FallbackImg
              sources={fetchedLogo}
              alt={clientName}
              style={{ maxWidth: 320, maxHeight: 120, objectFit: 'contain' }}
              onAllFailed={onLogoFailed}
            />
          );
        }
        // No logo fetched yet, show text with hint
        return (
          <div className="flex flex-col items-center gap-1">
            <span className="text-white text-4xl font-bold">{clientName || 'Client Name'}</span>
            <span className="text-white/40 text-sm">(Fetch a logo to display it here)</span>
          </div>
        );

      case 'upload':
        // Show uploaded logo if available, otherwise show text
        if (processedLogo) {
          return (
            <img
              src={processedLogo}
              alt={clientName}
              style={{ maxWidth: 320, maxHeight: 120, objectFit: 'contain' }}
            />
          );
        }
        // No logo uploaded yet, show text with hint
        return (
          <div className="flex flex-col items-center gap-1">
            <span className="text-white text-4xl font-bold">{clientName || 'Client Name'}</span>
            <span className="text-white/40 text-sm">(Upload a logo to display it here)</span>
          </div>
        );

      case 'text':
      default:
        // Always show text
        return (
          <span className="text-white text-4xl font-bold">{clientName || 'Client Name'}</span>
        );
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm">📌 Title Slide Preview</h3>
        <span className="text-xs text-slate-500">
          Mode: {titleMode === 'text' ? 'Text Name' : titleMode === 'website' ? 'From Website' : 'Upload Logo'}
        </span>
      </div>
      <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #1a6bff 0%, #3b8bff 30%, #59a0ff 60%, #7ab8ff 100%)' }}
        >
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className="flex items-center gap-3">
              <WCLogo className="h-10" />
              <span className="text-white text-3xl font-semibold">WalletConnect Pay</span>
            </div>
            <span className="text-white/70 text-xl font-medium my-2">x</span>
            {renderClientIdentity()}
          </div>
        </div>
      </div>
    </div>
  );
}