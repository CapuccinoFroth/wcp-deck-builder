"use client";

import { useState, useEffect } from 'react';
import { Icons } from '@/components/Icons';
import { DiagramPanel } from '@/components/DiagramPanel';
import { ClientLogoSection } from '@/components/ClientLogoSection';
import { TitleSlidePreview } from '@/components/TitleSlidePreview';
import { CLIENT_TYPES, TEMPLATE_LABELS } from '@/lib/config';
import { TitleMode, GoogleUser, ViewMode } from '@/lib/types';
import { getLogoSources, extractDomain, removeBackground, svgToPngBlob } from '@/lib/utils';
import { generateTxFlowDiagram, generateOffRampDiagram, generateKybDiagram } from '@/lib/diagrams';
import { initGoogleAuth, fetchUserInfo, uploadImageToDrive, copyTemplate, updateSlides, dataUrlToBlob, generateTextImage, fetchImageViaCanvas } from '@/lib/googleApi';

export default function WCPDeckBuilder() {
  // Form state
  const [clientName, setClientName] = useState('');
  const [clientType, setClientType] = useState('type1');
  const [localCurrency, setLocalCurrency] = useState('USD');
  const [offRampProvider, setOffRampProvider] = useState('client');
  const [generated, setGenerated] = useState(false);

  // UI state
  const [copied, setCopied] = useState({ tx: false, offramp: false, kyb: false });
  const [expanded, setExpanded] = useState({ tx: true, offramp: true, kyb: true });
  const [viewMode, setViewMode] = useState<{ tx: ViewMode; offramp: ViewMode; kyb: ViewMode }>({ tx: 'preview', offramp: 'preview', kyb: 'preview' });

  // Google Auth
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [creatingDeck, setCreatingDeck] = useState(false);
  const [createdDeckUrl, setCreatedDeckUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  // Logo state
  const [titleMode, setTitleMode] = useState<TitleMode>('text');
  const [clientWebsite, setClientWebsite] = useState('');
  const [fetchedLogo, setFetchedLogo] = useState<string[] | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [processedLogo, setProcessedLogo] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Mermaid
  const [txSvg, setTxSvg] = useState('');
  const [offrampSvg, setOfframpSvg] = useState('');
  const [kybSvg, setKybSvg] = useState('');
  const [mermaidLoaded, setMermaidLoaded] = useState(false);

  const diagramParams = { clientName, clientType, localCurrency, offRampProvider };

  // Load scripts
  useEffect(() => {
    const mermaidScript = document.createElement('script');
    mermaidScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js';
    mermaidScript.onload = () => {
      window.mermaid.initialize({ startOnLoad: false, theme: 'base', sequence: { diagramMarginX: 50, diagramMarginY: 30, actorMargin: 100, width: 200, height: 65, boxMargin: 15, boxTextMargin: 8, noteMargin: 20, messageMargin: 50, mirrorActors: true, useMaxWidth: false, wrap: true, wrapPadding: 15 }, fontSize: 16 });
      setMermaidLoaded(true);
    };
    document.head.appendChild(mermaidScript);
    const gsiScript = document.createElement('script');
    gsiScript.src = 'https://accounts.google.com/gsi/client';
    gsiScript.async = true;
    document.head.appendChild(gsiScript);
    return () => { mermaidScript.remove(); gsiScript.remove(); };
  }, []);

  useEffect(() => {
    if (generated && mermaidLoaded && window.mermaid) {
      (async () => {
        const { svg: tx } = await window.mermaid.render('tx-' + Date.now(), generateTxFlowDiagram(diagramParams));
        const { svg: offramp } = await window.mermaid.render('offramp-' + Date.now(), generateOffRampDiagram(diagramParams));
        const { svg: kyb } = await window.mermaid.render('kyb-' + Date.now(), generateKybDiagram(diagramParams));
        setTxSvg(tx); setOfframpSvg(offramp); setKybSvg(kyb);
      })();
    }
  }, [generated, mermaidLoaded, clientName, clientType, localCurrency, offRampProvider]);

  const handleGoogleLogin = () => initGoogleAuth(async (token) => { setAccessToken(token); setUser(await fetchUserInfo(token)); });
  const handleLogout = () => { setAccessToken(null); setUser(null); setCreatedDeckUrl(null); };

  const fetchClientLogo = (url: string) => { if (url.trim()) { setLogoError(null); setFetchedLogo(getLogoSources(extractDomain(url))); } };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => { setProcessing(true); setProcessedLogo(await removeBackground(event.target?.result as string)); setProcessing(false); };
      reader.readAsDataURL(file);
    }
  };
  const clearUploadedLogo = () => setProcessedLogo(null);
  const downloadProcessedLogo = () => { if (processedLogo) { const a = document.createElement('a'); a.download = `${clientName || 'client'}-logo.png`; a.href = processedLogo; a.click(); } };

  const createDeck = async () => {
    if (!accessToken || !clientName) return;
    setCreatingDeck(true); setError(null); setCreatedDeckUrl(null); setStatusMsg('Generating diagrams...');
    try {
      let txC = txSvg, offC = offrampSvg, kybC = kybSvg;
      if (!txC || !offC || !kybC) {
        const { svg: tx } = await window.mermaid.render('tx-c-' + Date.now(), generateTxFlowDiagram(diagramParams));
        const { svg: off } = await window.mermaid.render('off-c-' + Date.now(), generateOffRampDiagram(diagramParams));
        const { svg: kyb } = await window.mermaid.render('kyb-c-' + Date.now(), generateKybDiagram(diagramParams));
        txC = tx; offC = off; kybC = kyb;
      }

      setStatusMsg('Copying template...');
      const deckId = await copyTemplate(accessToken, clientType, clientName);

      setStatusMsg('Uploading diagrams...');
      const [txId, offId, kybId] = await Promise.all([
        uploadImageToDrive(accessToken, await svgToPngBlob(txC, 1600, 1280), `${clientName}-tx.png`),
        uploadImageToDrive(accessToken, await svgToPngBlob(offC, 1600, 1080), `${clientName}-offramp.png`),
        uploadImageToDrive(accessToken, await svgToPngBlob(kybC, 1600, 1080), `${clientName}-kyb.png`),
      ]);

      // Handle logo upload based on titleMode
      let logoImgId: string | null = null;
      let logoUrl: string | null = null;
      
      if (titleMode === 'text') {
        // Generate text as image
        setStatusMsg('Generating title text...');
        const textBlob = await generateTextImage(clientName);
        logoImgId = await uploadImageToDrive(accessToken, textBlob, `${clientName}-title-text.png`);
      } else if (titleMode === 'upload' && processedLogo) {
        setStatusMsg('Uploading client logo...');
        const logoBlob = dataUrlToBlob(processedLogo);
        logoImgId = await uploadImageToDrive(accessToken, logoBlob, `${clientName}-logo.png`);
      } else if (titleMode === 'website' && fetchedLogo && fetchedLogo.length > 0) {
        setStatusMsg('Fetching logo from website...');
        // Try to fetch each logo URL via canvas and upload to Drive
        for (const url of fetchedLogo) {
          try {
            const logoBlob = await fetchImageViaCanvas(url);
            logoImgId = await uploadImageToDrive(accessToken, logoBlob, `${clientName}-logo.png`);
            break; // Success!
          } catch (err) {
            console.warn(`Failed to fetch logo from ${url}:`, err);
            continue; // Try next URL
          }
        }
        // If all canvas fetches failed, try passing URL directly as fallback
        if (!logoImgId) {
          console.warn('Canvas fetch failed, trying direct URL...');
          logoUrl = fetchedLogo[0];
        }
      }

      setStatusMsg('Updating slides...');
      await updateSlides(accessToken, deckId, clientName, localCurrency, {
        txImgId: txId,
        offImgId: offId,
        kybImgId: kybId,
        logoImgId,
        logoUrl,
        titleMode,
      });

      setCreatedDeckUrl(`https://docs.google.com/presentation/d/${deckId}/edit`);
    } catch (err: any) { setError(err.message || 'Failed'); }
    finally { setCreatingDeck(false); setStatusMsg(''); }
  };

  const copyCode = (code: string, key: 'tx' | 'offramp' | 'kyb') => { navigator.clipboard.writeText(code); setCopied({ ...copied, [key]: true }); setTimeout(() => setCopied({ ...copied, [key]: false }), 2000); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-xl text-blue-400"><Icons.Sparkles /></div>
            <div><h1 className="text-xl font-bold text-white">WCP Deck Builder</h1><p className="text-slate-400 text-xs">WalletConnect Pay Proposal Generator</p></div>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-800 rounded-full pl-1 pr-3 py-1">{user.picture && <img src={user.picture} alt="" className="w-6 h-6 rounded-full" />}<span className="text-slate-300 text-sm">{user.given_name || user.email}</span></div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-white text-sm">Logout</button>
            </div>
          ) : <button onClick={handleGoogleLogin} className="flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100"><Icons.LogIn /> Connect Google</button>}
        </div>

        {/* Input Form */}
        <div className="bg-slate-800/50 rounded-2xl p-5 mb-5 border border-slate-700">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Client / PSP Name *</label>
              <input type="text" value={clientName} onChange={(e) => { setClientName(e.target.value); setGenerated(false); }} placeholder="e.g., Stripe, Adyen" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Client Type</label>
              <select value={clientType} onChange={(e) => { setClientType(e.target.value); setGenerated(false); }} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                {CLIENT_TYPES.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
              </select>
              <p className="text-slate-500 text-xs mt-2">{CLIENT_TYPES.find(t => t.id === clientType)?.description}</p>
              {(clientType === 'type2a' || clientType === 'type2b') && (
                <div className="mt-3">
                  <label className="block text-slate-300 text-sm font-medium mb-2">Who will do the off-ramping?</label>
                  <select value={offRampProvider} onChange={(e) => { setOffRampProvider(e.target.value); setGenerated(false); }} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                    <option value="client">Client</option><option value="wcp">WCP</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Local Currency *</label>
              <input type="text" value={localCurrency} onChange={(e) => { setLocalCurrency(e.target.value); setGenerated(false); }} placeholder="e.g., USD, ZAR" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Template</label>
              <div className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-400 text-sm flex items-center gap-2"><Icons.Template />{TEMPLATE_LABELS[clientType]}</div>
            </div>
          </div>

          <ClientLogoSection clientName={clientName} titleMode={titleMode} setTitleMode={setTitleMode} clientWebsite={clientWebsite} setClientWebsite={setClientWebsite} fetchedLogo={fetchedLogo} setFetchedLogo={setFetchedLogo} processedLogo={processedLogo} processing={processing} logoError={logoError} setLogoError={setLogoError} onFetchLogo={fetchClientLogo} onFileUpload={handleFileUpload} onClearUpload={clearUploadedLogo} onDownloadLogo={downloadProcessedLogo} />

          <button onClick={() => { if (clientName.trim()) { setGenerated(true); setCreatedDeckUrl(null); } }} disabled={!clientName.trim()} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
            <Icons.Sparkles /> Generate Deck Assets
          </button>
        </div>

        {/* Output */}
        {generated && (
          <div className="space-y-4">
            {/* Google Slides Card */}
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-5 border border-green-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="text-green-400"><Icons.FileSliders /></div><div><h3 className="text-white font-semibold">Create Google Slides Deck</h3><p className="text-slate-400 text-sm">{statusMsg || `Using ${TEMPLATE_LABELS[clientType]} • Logo: ${titleMode === 'text' ? 'Text' : titleMode === 'website' ? 'From website' : 'Uploaded'}`}</p></div></div>
                {!accessToken ? <button onClick={handleGoogleLogin} className="flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-medium"><Icons.LogIn /> Connect Google</button>
                : createdDeckUrl ? <a href={createdDeckUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium"><Icons.ExternalLink /> Open Deck</a>
                : <button onClick={createDeck} disabled={creatingDeck} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:bg-slate-600">{creatingDeck ? <Icons.Loader /> : <Icons.FileSliders />} {creatingDeck ? 'Creating...' : 'Create Deck'}</button>}
              </div>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              {createdDeckUrl && <p className="text-green-400 text-sm mt-2">✓ Deck created with {titleMode === 'text' ? 'text title' : 'logo'}!</p>}
            </div>

            <TitleSlidePreview clientName={clientName} titleMode={titleMode} fetchedLogo={fetchedLogo} processedLogo={processedLogo} onLogoFailed={() => { setTitleMode('text'); setFetchedLogo(null); }} />

            <DiagramPanel title="Transaction Flow" expanded={expanded.tx} onToggleExpand={() => setExpanded({ ...expanded, tx: !expanded.tx })} viewMode={viewMode.tx} onViewModeChange={(m) => setViewMode({ ...viewMode, tx: m })} svgContent={txSvg} mermaidCode={generateTxFlowDiagram(diagramParams)} clientName={clientName} filename="transaction-flow" copied={copied.tx} onCopy={() => copyCode(generateTxFlowDiagram(diagramParams), 'tx')} />
            <DiagramPanel title="Off-Ramp Flow" expanded={expanded.offramp} onToggleExpand={() => setExpanded({ ...expanded, offramp: !expanded.offramp })} viewMode={viewMode.offramp} onViewModeChange={(m) => setViewMode({ ...viewMode, offramp: m })} svgContent={offrampSvg} mermaidCode={generateOffRampDiagram(diagramParams)} clientName={clientName} filename="offramp-flow" copied={copied.offramp} onCopy={() => copyCode(generateOffRampDiagram(diagramParams), 'offramp')} />
            <DiagramPanel title="Merchant KYB Flow" expanded={expanded.kyb} onToggleExpand={() => setExpanded({ ...expanded, kyb: !expanded.kyb })} viewMode={viewMode.kyb} onViewModeChange={(m) => setViewMode({ ...viewMode, kyb: m })} svgContent={kybSvg} mermaidCode={generateKybDiagram(diagramParams)} clientName={clientName} filename="kyb-flow" copied={copied.kyb} onCopy={() => copyCode(generateKybDiagram(diagramParams), 'kyb')} />

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 text-xs text-slate-400"><span className="font-medium text-slate-300">Workflow: </span>Enter client name → Generate → Create Deck → Done! 🚀</div>
          </div>
        )}
      </div>
    </div>
  );
}