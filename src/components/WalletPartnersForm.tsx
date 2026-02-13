// components/WalletPartnersForm.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';

interface WalletPartnersFormProps {
  onCreateDeck: (walletName: string, logoBlob: Blob | null) => Promise<void>;
  isCreating: boolean;
  accessToken: string | null;
  onGoogleLogin: () => void;
  createdDeckUrl: string | null;
  setCreatedDeckUrl: (url: string | null) => void;
  error: string | null;
  statusMsg: string;
}

export function WalletPartnersForm({
  onCreateDeck,
  isCreating,
  accessToken,
  onGoogleLogin,
  createdDeckUrl,
  setCreatedDeckUrl,
  error,
  statusMsg,
}: WalletPartnersFormProps) {
  const [walletName, setWalletName] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [processedLogo, setProcessedLogo] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [generated, setGenerated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset generated state when logo or name changes
  useEffect(() => {
    setGenerated(false);
    if (createdDeckUrl) {
      setCreatedDeckUrl(null);
    }
  }, [logoPreview, walletName]);

  const makeTransparent = (imageSrc: string): Promise<{ dataUrl: string; blob: Blob }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Remove white/near-white backgrounds
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          if (r > 240 && g > 240 && b > 240) {
            data[i + 3] = 0;
          } else if (r > 220 && g > 220 && b > 220) {
            data[i + 3] = 0;
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        
        canvas.toBlob((blob) => {
          resolve({ dataUrl, blob: blob! });
        }, 'image/png');
      };
      img.onerror = () => {
        fetch(imageSrc)
          .then(r => r.blob())
          .then(blob => resolve({ dataUrl: imageSrc, blob }));
      };
      img.src = imageSrc;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProcessing(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const src = event.target?.result as string;
        const { dataUrl, blob } = await makeTransparent(src);
        setLogoPreview(dataUrl);
        setProcessedLogo(blob);
        setProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    setLogoPreview(null);
    setProcessedLogo(null);
    setGenerated(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadLogo = () => {
    if (logoPreview) {
      const a = document.createElement('a');
      a.download = `${walletName || 'wallet'}-logo-transparent.png`;
      a.href = logoPreview;
      a.click();
    }
  };

  const handleGenerate = () => {
    if (walletName.trim() && processedLogo) {
      setGenerated(true);
    }
  };

  const handleCreate = () => {
    if (walletName.trim() && processedLogo) {
      onCreateDeck(walletName, processedLogo);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-5 mb-5 border border-slate-700">
      <div className="mb-4">
        <label className="block text-slate-300 text-sm font-medium mb-2">Wallet Name *</label>
        <input
          type="text"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
          placeholder="e.g., MetaMask, Rainbow, Trust Wallet"
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-slate-300 text-sm font-medium mb-2">Wallet Logo *</label>
        <p className="text-slate-500 text-xs mb-3">Upload the wallet logo — white backgrounds will be made transparent automatically</p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {logoPreview ? (
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-600 rounded-lg px-3 py-3">
            <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-700 p-2">
              {processing ? (
                <Icons.Loader />
              ) : (
                <img src={logoPreview} alt="" className="max-w-full max-h-full object-contain" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-300 text-sm">Logo uploaded</p>
              <p className="text-green-400 text-xs flex items-center gap-1">
                <Icons.Check /> Background removed
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-xs transition-colors"
            >
              <Icons.Upload /> Replace
            </button>
            <button
              onClick={downloadLogo}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-xs transition-colors"
            >
              <Icons.Download /> Download
            </button>
            <button
              onClick={clearLogo}
              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Icons.X />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/5 text-sm transition-all"
          >
            <Icons.Upload /> Click to upload wallet logo (PNG, JPG, SVG)
          </button>
        )}
      </div>

      {/* Generate Preview Button */}
      <button
        onClick={handleGenerate}
        disabled={!walletName.trim() || !processedLogo}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mb-4"
      >
        <Icons.Sparkles /> Generate Preview
      </button>

      {/* Slide Preview - only shown after Generate */}
      {generated && logoPreview && (
        <div className="space-y-4">
          <div className="mb-4">
            <label className="block text-slate-300 text-sm font-medium mb-2">📌 Slide Preview</label>
            <div className="relative w-full rounded-lg overflow-hidden border border-slate-700" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0 bg-white flex flex-col">
                {/* Main content area */}
                <div className="flex-1 grid grid-cols-2 gap-2 p-3">
                  {/* Left: Blue gradient with Pay logo */}
                  <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur rounded-full px-6 py-3 flex items-center gap-2">
                      <svg viewBox="0 0 81 65" fill="white" className="w-6 h-6">
                        <path d="M17.2 19.5c12.8-12.5 33.6-12.5 46.4 0l1.5 1.5c.6.6.6 1.7 0 2.3l-5.2 5.1c-.3.3-.8.3-1.2 0l-2.1-2.1c-8.9-8.7-23.4-8.7-32.4 0l-2.3 2.2c-.3.3-.8.3-1.2 0l-5.2-5.1c-.6-.6-.6-1.7 0-2.3l1.7-1.6zm57.3 10.7l4.6 4.5c.6.6.6 1.7 0 2.3L57.8 58c-.7.6-1.7.6-2.3 0L42 44.4c-.2-.2-.4-.2-.6 0L27.9 58c-.7.6-1.7.6-2.3 0L4.3 37c-.6-.6-.6-1.7 0-2.3l4.6-4.5c.7-.6 1.7-.6 2.3 0L24.7 43.8c.2.2.4.2.6 0l13.5-13.6c.7-.6 1.7-.6 2.3 0L54.6 43.8c.2.2.4.2.6 0l13.5-13.6c.3-.3.8-.3 1.2-.3.2 0 .4.1.6.3z" />
                      </svg>
                      <span className="text-white font-semibold text-lg">Pay</span>
                    </div>
                  </div>
                  {/* Right: Placeholder areas */}
                  <div className="flex flex-col gap-2">
                    <div className="flex-1 rounded-xl bg-slate-100"></div>
                    <div className="flex-1 rounded-xl bg-slate-200"></div>
                  </div>
                </div>
                {/* Bottom bar with WalletConnect Pay + Logo */}
                <div className="px-4 py-3 flex items-center gap-3">
                  <svg viewBox="0 0 81 65" fill="#3B82F6" className="w-6 h-6">
                    <path d="M17.2 19.5c12.8-12.5 33.6-12.5 46.4 0l1.5 1.5c.6.6.6 1.7 0 2.3l-5.2 5.1c-.3.3-.8.3-1.2 0l-2.1-2.1c-8.9-8.7-23.4-8.7-32.4 0l-2.3 2.2c-.3.3-.8.3-1.2 0l-5.2-5.1c-.6-.6-.6-1.7 0-2.3l1.7-1.6zm57.3 10.7l4.6 4.5c.6.6.6 1.7 0 2.3L57.8 58c-.7.6-1.7.6-2.3 0L42 44.4c-.2-.2-.4-.2-.6 0L27.9 58c-.7.6-1.7.6-2.3 0L4.3 37c-.6-.6-.6-1.7 0-2.3l4.6-4.5c.7-.6 1.7-.6 2.3 0L24.7 43.8c.2.2.4.2.6 0l13.5-13.6c.7-.6 1.7-.6 2.3 0L54.6 43.8c.2.2.4.2.6 0l13.5-13.6c.3-.3.8-.3 1.2-.3.2 0 .4.1.6.3z" />
                  </svg>
                  <span className="text-blue-500 font-semibold">WalletConnect Pay</span>
                  <span className="text-slate-400">+</span>
                  {/* Wallet logo */}
                  <div className="h-8 flex items-center">
                    <img src={logoPreview} alt={walletName} className="max-h-8 object-contain" />
                  </div>
                  <span className="ml-auto text-slate-400 text-xs">@ WalletConnect Pay</span>
                </div>
              </div>
              <div className="absolute bottom-1 right-2 text-slate-400 text-[10px]">Preview</div>
            </div>
          </div>

          {/* Create Deck Section */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-purple-400"><Icons.FileSliders /></div>
                <div>
                  <h3 className="text-white font-semibold">Create Wallet Partner Deck</h3>
                  <p className="text-slate-400 text-sm">
                    {statusMsg || 'Logo will be placed on every slide'}
                  </p>
                </div>
              </div>
              {!accessToken ? (
                <button
                  onClick={onGoogleLogin}
                  className="flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  <Icons.LogIn /> Connect Google
                </button>
              ) : createdDeckUrl ? (
                <a
                  href={createdDeckUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  <Icons.ExternalLink /> Open Deck
                </a>
              ) : (
                <button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                  {isCreating ? <Icons.Loader /> : <Icons.FileSliders />}
                  {isCreating ? 'Creating...' : 'Create Deck'}
                </button>
              )}
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            {createdDeckUrl && <p className="text-green-400 text-sm mt-2">✓ Deck created with wallet logo!</p>}
          </div>
        </div>
      )}
    </div>
  );
}