"use client";

import { useState, useRef, useEffect } from 'react';

// CONFIG
const CONFIG = {
  clientId: '931056766416-dtq4re68d9o0p1ih5iun55u8jt7b5kjp.apps.googleusercontent.com',
  templates: {
    type1: '1BJ3kyDPPQXEzywYajaIQsybx9yFlZwT-Hw7oZXZa1Gk',
    type2: '1LKxo5vc7F43fGzsikv9-exB6_DQfvGRHoxNi8WIOK-s',
  },
  scopes: 'https://www.googleapis.com/auth/presentations https://www.googleapis.com/auth/drive',
};

const Icons = {
  Sparkles: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Copy: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  ChevronDown: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  ChevronUp: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>,
  Upload: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
  X: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Eye: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Code: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  LogIn: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>,
  FileSliders: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  ExternalLink: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
  Loader: () => <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  CreditCard: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  Building: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Wallet: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1M6 19h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Template: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Globe: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Image: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Type: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" /></svg>,
};

declare global {
  interface Window {
    google: any;
    mermaid: any;
  }
}

// ——— FallbackImg: tries multiple sources in order ———
function FallbackImg({
  sources, alt, style, className, onAllFailed,
}: {
  sources: string | string[];
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
  onAllFailed?: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => { setIdx(0); setFailed(false); }, [sources]);

  if (failed) return null;
  const list = Array.isArray(sources) ? sources : [sources];
  if (idx >= list.length) {
    if (onAllFailed) onAllFailed();
    return null;
  }

  return (
    <img
      src={list[idx]}
      alt={alt || ''}
      style={style}
      className={className}
      onError={() => {
        if (idx < list.length - 1) setIdx(idx + 1);
        else { setFailed(true); if (onAllFailed) onAllFailed(); }
      }}
    />
  );
}

function extractDomain(url: string): string {
  try {
    let d = url.trim();
    if (!d.startsWith('http')) d = 'https://' + d;
    return new URL(d).hostname.replace('www.', '');
  } catch {
    return url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  }
}

function getLogoSources(domain: string): string[] {
  return [
    `https://logo.clearbit.com/${domain}`,
    `https://img.logo.dev/${domain}?token=pk_anonymous&size=200&format=png`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  ];
}

export default function WCPDeckBuilder() {
  const [clientName, setClientName] = useState('');
  const [clientType, setClientType] = useState('type1');
  const [localCurrency, setLocalCurrency] = useState('USD');
  const [offRampProvider, setOffRampProvider] = useState('client');
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState({ title: false, tx: false, offramp: false, kyb: false });
  const [expanded, setExpanded] = useState({ tx: true, offramp: true, kyb: true });
  const [viewMode, setViewMode] = useState({ tx: 'preview', offramp: 'preview', kyb: 'preview' });

  // Google Auth
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [creatingDeck, setCreatingDeck] = useState(false);
  const [createdDeckUrl, setCreatedDeckUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>('');

  // Title slide mode: 'text' | 'website' | 'upload'
  const [titleMode, setTitleMode] = useState<'text' | 'website' | 'upload'>('text');

  // Logo from website
  const [clientWebsite, setClientWebsite] = useState('');
  const [fetchedLogo, setFetchedLogo] = useState<string[] | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  // Logo from manual upload
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [processedLogo, setProcessedLogo] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mermaid
  const [txSvg, setTxSvg] = useState('');
  const [offrampSvg, setOfframpSvg] = useState('');
  const [kybSvg, setKybSvg] = useState('');
  const [mermaidLoaded, setMermaidLoaded] = useState(false);

  // ——— Load scripts ———
  useEffect(() => {
    const mermaidScript = document.createElement('script');
    mermaidScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js';
    mermaidScript.onload = () => {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        sequence: {
          diagramMarginX: 50, diagramMarginY: 30, actorMargin: 100,
          width: 200, height: 65, boxMargin: 15, boxTextMargin: 8,
          noteMargin: 20, messageMargin: 50, mirrorActors: true,
          useMaxWidth: false, wrap: true, wrapPadding: 15,
        },
        fontSize: 16,
      });
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
    if (generated && mermaidLoaded && window.mermaid) renderDiagrams();
  }, [generated, mermaidLoaded, clientName, clientType, localCurrency, offRampProvider]);

  const renderDiagrams = async () => {
    try {
      const { svg: tx } = await window.mermaid.render('tx-' + Date.now(), generateTxFlowDiagram());
      const { svg: offramp } = await window.mermaid.render('offramp-' + Date.now(), generateOffRampDiagram());
      const { svg: kyb } = await window.mermaid.render('kyb-' + Date.now(), generateKybDiagram());
      setTxSvg(tx); setOfframpSvg(offramp); setKybSvg(kyb);
    } catch (err) { console.error('Mermaid error:', err); }
  };

  // ——— Google Auth ———
  const handleGoogleLogin = () => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CONFIG.clientId, scope: CONFIG.scopes,
      callback: (response: any) => {
        if (response.access_token) { setAccessToken(response.access_token); fetchUserInfo(response.access_token); }
      },
    });
    client.requestAccessToken();
  };

  const fetchUserInfo = async (token: string) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', { headers: { Authorization: `Bearer ${token}` } });
      setUser(await res.json());
    } catch (err) { console.error('User info error:', err); }
  };

  const handleLogout = () => { setAccessToken(null); setUser(null); setCreatedDeckUrl(null); };

  // ——— Fetch logo from website ———
  const fetchClientLogo = (url: string) => {
    if (!url.trim()) return;
    const domain = extractDomain(url);
    setLogoError(null);
    setFetchedLogo(getLogoSources(domain));
    setTitleMode('website');
  };

  // ——— SVG to PNG ———
  const svgToPngBlob = (svgString: string, targetWidth: number = 1920, targetHeight: number = 1080): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
      const svgEl = svgDoc.querySelector('svg');
      if (svgEl) {
        let viewBox = svgEl.getAttribute('viewBox');
        const ow = parseFloat(svgEl.getAttribute('width') || '800');
        const oh = parseFloat(svgEl.getAttribute('height') || '600');
        if (!viewBox) { viewBox = `0 0 ${ow} ${oh}`; svgEl.setAttribute('viewBox', viewBox); }
        const ar = ow / oh;
        let fw = targetWidth, fh = targetWidth / ar;
        if (fh > targetHeight) { fh = targetHeight; fw = targetHeight * ar; }
        svgEl.setAttribute('width', String(fw)); svgEl.setAttribute('height', String(fh));
      }
      const scaled = new XMLSerializer().serializeToString(svgDoc);
      const url = URL.createObjectURL(new Blob([scaled], { type: 'image/svg+xml' }));
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => { URL.revokeObjectURL(url); blob ? resolve(blob) : reject(new Error('Blob fail')); }, 'image/png', 1.0);
      };
      img.onerror = () => reject(new Error('SVG load fail'));
      img.src = url;
    });
  };

  const uploadImageToDrive = async (blob: Blob, filename: string): Promise<string> => {
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify({ name: filename, mimeType: 'image/png' })], { type: 'application/json' }));
    form.append('file', blob);
    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
      method: 'POST', headers: { Authorization: `Bearer ${accessToken}` }, body: form,
    });
    if (!res.ok) throw new Error('Failed to upload image');
    const { id } = await res.json();
    await fetch(`https://www.googleapis.com/drive/v3/files/${id}/permissions`, {
      method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'reader', type: 'anyone' }),
    });
    return id;
  };

  // ——— Create Deck ———
  const createDeck = async () => {
    if (!accessToken || !clientName) return;
    setCreatingDeck(true); setError(null); setCreatedDeckUrl(null); setStatusMsg('Generating diagrams...');
    try {
      let txSvgC = txSvg, offSvgC = offrampSvg, kybSvgC = kybSvg;
      if (!txSvgC || !offSvgC || !kybSvgC) {
        if (window.mermaid) {
          const { svg: tx } = await window.mermaid.render('tx-create-' + Date.now(), generateTxFlowDiagram());
          const { svg: off } = await window.mermaid.render('offramp-create-' + Date.now(), generateOffRampDiagram());
          const { svg: kyb } = await window.mermaid.render('kyb-create-' + Date.now(), generateKybDiagram());
          txSvgC = tx; offSvgC = off; kybSvgC = kyb;
        }
      }
      setStatusMsg('Copying template...');
      const templateId = (clientType === 'type1' || clientType === 'type3') ? CONFIG.templates.type1 : CONFIG.templates.type2;
      const copyRes = await fetch(`https://www.googleapis.com/drive/v3/files/${templateId}/copy`, {
        method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `WalletConnect Pay x ${clientName}` }),
      });
      if (!copyRes.ok) throw new Error('Failed to copy template');
      const { id: newDeckId } = await copyRes.json();
      setStatusMsg('Uploading diagrams...');
      const txBlob = await svgToPngBlob(txSvgC, 1600, 1280);
      const offBlob = await svgToPngBlob(offSvgC, 1600, 1080);
      const kybBlob = await svgToPngBlob(kybSvgC, 1600, 1080);
      const txImgId = await uploadImageToDrive(txBlob, `${clientName}-transaction-flow.png`);
      const offImgId = await uploadImageToDrive(offBlob, `${clientName}-offramp-flow.png`);
      const kybImgId = await uploadImageToDrive(kybBlob, `${clientName}-kyb-flow.png`);
      setStatusMsg('Updating slides...');
      const requests: any[] = [
        { replaceAllText: { containsText: { text: '{{PSP_NAME}}', matchCase: true }, replaceText: clientName } },
        { replaceAllText: { containsText: { text: '{{PSP_name}}', matchCase: true }, replaceText: clientName } },
        { replaceAllText: { containsText: { text: '{{local_curr}}', matchCase: true }, replaceText: localCurrency } },
        { replaceAllText: { containsText: { text: '{{Template do not touch}}', matchCase: false }, replaceText: 'Generated by SolEngAgent - you can delete this first slide' } },
        { replaceAllShapesWithImage: { imageUrl: `https://drive.google.com/uc?id=${txImgId}`, replaceMethod: 'CENTER_INSIDE', containsText: { text: '[[IMG:DIAGRAM_TRNXFLOW]]', matchCase: false } } },
        { replaceAllShapesWithImage: { imageUrl: `https://drive.google.com/uc?id=${offImgId}`, replaceMethod: 'CENTER_INSIDE', containsText: { text: '[[IMG:DIAGRAM_OFFRAMPFLOW]]', matchCase: false } } },
        { replaceAllShapesWithImage: { imageUrl: `https://drive.google.com/uc?id=${kybImgId}`, replaceMethod: 'CENTER_INSIDE', containsText: { text: '[[IMG:DIAGRAM_MERCHANTKYBFLOW]]', matchCase: false } } },
      ];
      await fetch(`https://slides.googleapis.com/v1/presentations/${newDeckId}:batchUpdate`, {
        method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests }),
      });
      setStatusMsg(''); setCreatedDeckUrl(`https://docs.google.com/presentation/d/${newDeckId}/edit`);
    } catch (err: any) {
      console.error('Create deck error:', err); setError(err.message || 'Failed to create deck'); setStatusMsg('');
    } finally { setCreatingDeck(false); }
  };

  // ——— Client Types ———
  const clientTypes = [
    { id: 'type1', label: 'Type 1: No Crypto', icon: Icons.CreditCard, description: 'Payments companies with NO crypto capabilities (e.g., Ingenico) - we own the entire flow' },
    { id: 'type2a', label: 'Type 2a: Offers crypto payments to merchants - needs improvements', icon: Icons.Building, description: 'Payments companies with SOME crypto capabilities (e.g., Ezeebit) - they already have merchants using crypto for payments and want to improve their offering with better UX, typically have licences for off-ramping' },
    { id: 'type2b', label: 'Type 2b: Neobanks, crypto-platform (no merchant payment offering yet)', icon: Icons.Wallet, description: 'Off-ramps / B2B payments companies (e.g., Banks) - well versed in crypto, typically have licences, but don\'t yet offer crypto payments to merchants. They may offer crypto custody and want to expand their product offering and generate more revenue' },
    { id: 'type3', label: 'Type 3: Distribution partners, hardware, crypto service providers', icon: Icons.Building, description: 'Hardware manufacturers (e.g., Imin, Lunu) or Stablecoin issuers/Chains - channel partners who push WCP to acquirers' },
  ];

  const templateLabels: Record<string, string> = {
    type1: 'Type 1 template (No Crypto)',
    type2a: 'Type 2a template (Some Crypto)',
    type2b: 'Type 2b — uses Type 2a template',
    type3: 'Type 3 — uses Type 1 template',
  };

  // ——— Logo helpers ———
  const removeBackground = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width; canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > 240 && data[i+1] > 240 && data[i+2] > 240) data[i+3] = 0;
          else if (data[i] > 220 && data[i+1] > 220 && data[i+2] > 220) data[i+3] = 0;
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(imageSrc);
      img.src = imageSrc;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const src = event.target?.result as string;
        setLogoPreview(src);
        setProcessing(true);
        setProcessedLogo(await removeBackground(src));
        setProcessing(false);
        setTitleMode('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUploadedLogo = () => { setLogoPreview(null); setProcessedLogo(null); if (titleMode === 'upload') setTitleMode('text'); };

  const downloadProcessedLogo = () => {
    if (processedLogo) {
      const link = document.createElement('a');
      link.download = `${clientName || 'client'}-logo.png`;
      link.href = processedLogo;
      document.body.appendChild(link); link.click(); link.remove();
    }
  };

  // ——— Diagram Generators ———
  const generateTxFlowDiagram = () => {
    const psp = (clientType === 'type1' || clientType === 'type2a' || clientType === 'type2b') ? (clientName || 'PSP') : 'PSP';
    return `%%{init: {"theme": "base", "themeVariables": {"actorBkg": "#EEF1FF", "actorBorder": "#9AA7FF", "actorTextColor": "#1F2A44", "noteBkgColor": "#FFF6BF", "noteBorderColor": "#E6D87A", "noteTextColor": "#2B2B2B", "signalColor": "#6B7280", "signalTextColor": "#374151", "altSectionBkgColor": "#FFF6BF", "altSectionBorderColor": "#E6D87A"}}}%%
sequenceDiagram
    autonumber
    participant Shopper
    participant Wallet
    participant PSP as ${psp}
    participant WCPay as WC Pay Engine
    participant Chain as Merchant Transit Acc
    Shopper ->> PSP: Choose WalletConnect Pay
    PSP ->> WCPay: Create payment<br/> embedded (amount, reference)
    WCPay -->> PSP: paymentId + QR
    PSP ->> Shopper: Show QR
    Shopper ->> Wallet: Scan QR
    Wallet ->> WCPay: Fetch payment details
    WCPay -->> Wallet: Options +<br/>any required steps
    opt Data collection / screening required
        Shopper ->> Wallet: Provide info
        Wallet ->> WCPay: Submit results
    end
    Wallet ->> WCPay: Approve + confirm payment<br/>(signature)
    WCPay ->> Chain: Relay on-chain transaction
    Chain -->> WCPay: Confirmed
    PSP ->> WCPay: Check final status
    WCPay -->> PSP: succeeded / failed / expired
    PSP ->> Shopper: Show result`;
  };

  const generateOffRampDiagram = () => {
    const curr = localCurrency || 'USD';
    const name = clientName || 'PSP';
    const themeInit = `%%{init: {"theme": "base", "themeVariables": {"actorBkg": "#EEF1FF", "actorBorder": "#9AA7FF", "actorTextColor": "#1F2A44", "noteBkgColor": "#FFF6BF", "noteBorderColor": "#E6D87A", "noteTextColor": "#2B2B2B", "signalColor": "#6B7280", "signalTextColor": "#374151"}}}%%`;
    let offRampLabel;
    if (clientType === 'type1' || clientType === 'type3') offRampLabel = '3rd Party Off-Ramp';
    else if ((clientType === 'type2a' || clientType === 'type2b') && offRampProvider === 'wcp') offRampLabel = 'Off-Ramp Provider';
    else offRampLabel = name;
    return `${themeInit}
sequenceDiagram
    autonumber
    participant chain as Blockchain
    participant WCP as WC Pay<br/>(Relayer + MTA)
    participant OffRamp as ${offRampLabel}<br/>(Liquidity Account)
    participant M as Merchant
    participant Bank as ${curr} Bank Rails
    Note over chain,WCP: User payment<br/>settles on-chain<br/>into WC Pay Transit
    chain-->>WCP: Transfer confirmed<br/>(funds in Transit Acc)
    Note over WCP,OffRamp: Batch settlement (T+0 / T+1)
    WCP->>OffRamp: Transfer stablecoin (e.g. USDC)<br/>Transit → ${offRampLabel} Liquidity
    OffRamp-->>WCP: Transfer confirmed
    alt Crypto settlement
        OffRamp->>M: Send crypto to merchant wallet
    else Fiat settlement (${curr})
        OffRamp->>Bank: Send ${curr} fiat payout<br/>to merchant bank account
        Bank-->>M: Payout confirmation
    end`;
  };

  const generateKybDiagram = () => {
    const name = clientName || 'PSP';
    const themeInit = `%%{init: {"theme": "base", "themeVariables": {"actorBkg": "#EEF1FF", "actorBorder": "#9AA7FF", "actorTextColor": "#1F2A44", "noteBkgColor": "#FFF6BF", "noteBorderColor": "#E6D87A", "noteTextColor": "#2B2B2B", "signalColor": "#6B7280", "signalTextColor": "#374151", "altSectionBkgColor": "#FFF6BF", "altSectionBorderColor": "#E6D87A"}}}%%`;
    let offRampLabel;
    if (clientType === 'type1' || clientType === 'type3') offRampLabel = 'OffRamp Provider (KYB)';
    else if ((clientType === 'type2a' || clientType === 'type2b') && offRampProvider === 'wcp') offRampLabel = 'Off-Ramp Provider (KYB)';
    else offRampLabel = `${name} (KYB)`;
    return `${themeInit}
sequenceDiagram
    autonumber
    participant Merchant
    participant WC_Dashboard as WC Pay Dashboard
    participant WC_Core as WC Pay Core
    participant OffRamp as ${offRampLabel}
    Merchant->>WC_Dashboard: Create account (email/password)
    WC_Dashboard->>WC_Core: Create WC Pay Merchant ID
    WC_Dashboard->>OffRamp: Request liquidation account
    OffRamp-->>WC_Core: Liquidation account created
    WC_Dashboard->>Merchant: Request KYB + bank details
    Merchant->>WC_Dashboard: Submit KYB information
    WC_Dashboard->>OffRamp: Submit KYB package
    alt KYB approved
        OffRamp-->>WC_Core: Merchant KYB approved
        WC_Core-->>WC_Dashboard: Merchant enabled for payments
    else KYB rejected
        WC_Dashboard-->>Merchant: Onboarding blocked
    end`;
  };

  // ——— Clipboard & Download ———
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [key]: true });
    setTimeout(() => setCopied({ ...copied, [key]: false }), 2000);
  };

  const downloadDiagramAsPng = (svgString: string, filename: string) => {
    const url = URL.createObjectURL(new Blob([svgString], { type: 'image/svg+xml' }));
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * 2; canvas.height = img.height * 2;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(2, 2); ctx.fillStyle = 'white'; ctx.fillRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = `${clientName || 'client'}-${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link); link.click(); link.remove();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleGenerate = () => { if (clientName.trim()) { setGenerated(true); setCreatedDeckUrl(null); } };

  // ——— Render ———
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-xl text-blue-400"><Icons.Sparkles /></div>
            <div>
              <h1 className="text-xl font-bold text-white">WCP Deck Builder</h1>
              <p className="text-slate-400 text-xs">WalletConnect Pay Proposal Generator</p>
            </div>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-800 rounded-full pl-1 pr-3 py-1">
                {user.picture && <img src={user.picture} alt="" className="w-6 h-6 rounded-full" />}
                <span className="text-slate-300 text-sm">{user.given_name || user.email}</span>
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-white text-sm">Logout</button>
            </div>
          ) : (
            <button onClick={handleGoogleLogin} className="flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100">
              <Icons.LogIn /> Connect Google
            </button>
          )}
        </div>

        {/* Input */}
        <div className="bg-slate-800/50 rounded-2xl p-5 mb-5 border border-slate-700">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Client / PSP Name *</label>
              <input type="text" value={clientName} onChange={(e) => { setClientName(e.target.value); setGenerated(false); }} placeholder="e.g., Stripe, Adyen, Ezeebit" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              <p className="text-slate-500 text-xs mt-1">Populates {'{{PSP_NAME}}'} and {'{{PSP_name}}'} in the deck</p>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Client Type</label>
              <select value={clientType} onChange={(e) => { setClientType(e.target.value); setGenerated(false); }} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                {clientTypes.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
              </select>
              <p className="text-slate-500 text-xs mt-2">{clientTypes.find(t => t.id === clientType)?.description}</p>
              {(clientType === 'type2a' || clientType === 'type2b') && (
                <div className="mt-3">
                  <label className="block text-slate-300 text-sm font-medium mb-2">Who will do the off-ramping?</label>
                  <select value={offRampProvider} onChange={(e) => { setOffRampProvider(e.target.value); setGenerated(false); }} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                    <option value="client">Client</option>
                    <option value="wcp">WCP</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Local Currency *</label>
              <input type="text" value={localCurrency} onChange={(e) => { setLocalCurrency(e.target.value); setGenerated(false); }} placeholder="e.g., USD, ZAR, NGN" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              <p className="text-slate-500 text-xs mt-1">The fiat currency the merchant receives — populates {'{{local_curr}}'}</p>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Template</label>
              <div className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-400 text-sm flex items-center gap-2">
                <Icons.Template /><span>{templateLabels[clientType]}</span>
              </div>
            </div>
          </div>

          {/* ═══════ Client Logo for Title Slide ═══════ */}
          <div className="mb-4">
            <label className="block text-slate-300 text-sm font-medium mb-3">
              Client Logo for Title Slide
            </label>

            {/* Three option cards */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              {/* Option 1: Text */}
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
                <p className="text-xs text-slate-500 mt-1">Use {clientName || 'PSP name'} as text</p>
              </button>

              {/* Option 2: Website auto-fetch */}
              <button
                onClick={() => { if (fetchedLogo) setTitleMode('website'); }}
                className={`relative rounded-xl p-3 border-2 transition-all text-left ${
                  titleMode === 'website'
                    ? 'border-blue-500 bg-blue-500/10'
                    : fetchedLogo
                      ? 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
                      : 'border-slate-800 bg-slate-900/30 opacity-60'
                }`}
              >
                {titleMode === 'website' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Icons.Check />
                  </div>
                )}
                {fetchedLogo && (
                  <div className="absolute top-2 right-2">
                    {titleMode !== 'website' && (
                      <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                        <Icons.Check />
                      </div>
                    )}
                  </div>
                )}
                <div className={`mb-2 ${titleMode === 'website' ? 'text-blue-400' : 'text-slate-400'}`}>
                  <Icons.Globe />
                </div>
                <p className={`text-sm font-medium ${titleMode === 'website' ? 'text-white' : 'text-slate-300'}`}>From Website</p>
                <p className="text-xs text-slate-500 mt-1">
                  {fetchedLogo ? `Ready (${extractDomain(clientWebsite)})` : 'Fetch from URL below'}
                </p>
              </button>

              {/* Option 3: Manual upload */}
              <button
                onClick={() => { if (processedLogo) setTitleMode('upload'); else fileInputRef.current?.click(); }}
                className={`relative rounded-xl p-3 border-2 transition-all text-left ${
                  titleMode === 'upload'
                    ? 'border-blue-500 bg-blue-500/10'
                    : processedLogo
                      ? 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
                      : 'border-dashed border-slate-700 bg-slate-900/30 hover:border-slate-500'
                }`}
              >
                {titleMode === 'upload' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Icons.Check />
                  </div>
                )}
                {processedLogo && titleMode !== 'upload' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                    <Icons.Check />
                  </div>
                )}
                <div className={`mb-2 ${titleMode === 'upload' ? 'text-blue-400' : 'text-slate-400'}`}>
                  <Icons.Upload />
                </div>
                <p className={`text-sm font-medium ${titleMode === 'upload' ? 'text-white' : 'text-slate-300'}`}>Upload Logo</p>
                <p className="text-xs text-slate-500 mt-1">
                  {processedLogo ? 'Logo uploaded ✓' : 'PNG, SVG, JPG...'}
                </p>
              </button>
            </div>

            {/* Website fetch input */}
            <div className="flex gap-2 mb-2">
              <div className="flex-1 flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3">
                <Icons.Globe />
                <input
                  type="text"
                  value={clientWebsite}
                  onChange={(e) => setClientWebsite(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') fetchClientLogo(clientWebsite); }}
                  placeholder="Client website (e.g., ezeebit.com)"
                  className="flex-1 bg-transparent py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none"
                />
                {fetchedLogo && (
                  <button onClick={() => { setFetchedLogo(null); setLogoError(null); if (titleMode === 'website') setTitleMode('text'); }} className="text-slate-500 hover:text-red-400">
                    <Icons.X />
                  </button>
                )}
              </div>
              <button onClick={() => fetchClientLogo(clientWebsite)} disabled={!clientWebsite.trim()} className="px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shrink-0">
                <Icons.Globe /> Fetch
              </button>
            </div>

            {/* Upload row */}
            <div className="flex gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              {processedLogo ? (
                <div className="flex-1 flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
                  <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                    {processing ? <Icons.Loader /> : <img src={processedLogo} alt="" className="max-w-full max-h-full object-contain" />}
                  </div>
                  <span className="text-slate-300 text-sm flex-1 truncate">Uploaded logo</span>
                  <button onClick={downloadProcessedLogo} className="text-green-400 hover:text-green-300 text-xs shrink-0">Download</button>
                  <button onClick={clearUploadedLogo} className="text-slate-500 hover:text-red-400 shrink-0"><Icons.X /></button>
                </div>
              ) : (
                <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-blue-500 hover:text-blue-400 text-sm">
                  <Icons.Upload /> Upload logo file (PNG, SVG, JPG)
                </button>
              )}
            </div>

            {logoError && <p className="text-amber-400 text-xs mt-2">{logoError}</p>}

            {/* Live mini-preview */}
            <div className="mt-3 relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '28%' }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a6bff 0%, #3b8bff 30%, #59a0ff 60%, #7ab8ff 100%)' }}>
                <div className="flex flex-col items-center justify-center h-full gap-1">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 81 65" fill="white" className="h-5">
                      <path d="M17.2 19.5c12.8-12.5 33.6-12.5 46.4 0l1.5 1.5c.6.6.6 1.7 0 2.3l-5.2 5.1c-.3.3-.8.3-1.2 0l-2.1-2.1c-8.9-8.7-23.4-8.7-32.4 0l-2.3 2.2c-.3.3-.8.3-1.2 0l-5.2-5.1c-.6-.6-.6-1.7 0-2.3l1.7-1.6zm57.3 10.7l4.6 4.5c.6.6.6 1.7 0 2.3L57.8 58c-.7.6-1.7.6-2.3 0L42 44.4c-.2-.2-.4-.2-.6 0L27.9 58c-.7.6-1.7.6-2.3 0L4.3 37c-.6-.6-.6-1.7 0-2.3l4.6-4.5c.7-.6 1.7-.6 2.3 0L24.7 43.8c.2.2.4.2.6 0l13.5-13.6c.7-.6 1.7-.6 2.3 0L54.6 43.8c.2.2.4.2.6 0l13.5-13.6c.3-.3.8-.3 1.2-.3.2 0 .4.1.6.3z" />
                    </svg>
                    <span className="text-white text-base font-semibold">WalletConnect Pay</span>
                  </div>
                  <span className="text-white/60 text-xs">x</span>
                  {titleMode === 'website' && fetchedLogo ? (
                    <FallbackImg
                      sources={fetchedLogo}
                      alt={clientName}
                      style={{ maxHeight: 40, maxWidth: 160, objectFit: 'contain' }}
                      onAllFailed={() => { setTitleMode('text'); setFetchedLogo(null); setLogoError('Could not load logo — switched to text'); }}
                    />
                  ) : titleMode === 'upload' && processedLogo ? (
                    <img src={processedLogo} alt={clientName} style={{ maxHeight: 40, maxWidth: 160, objectFit: 'contain' }} />
                  ) : (
                    <span className="text-white text-lg font-bold">{clientName || 'Client Name'}</span>
                  )}
                </div>
              </div>
              <div className="absolute bottom-1 right-2 text-white/40 text-[10px]">Preview</div>
            </div>
          </div>

          <button onClick={handleGenerate} disabled={!clientName.trim()} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
            <Icons.Sparkles /> Generate Deck Assets
          </button>
        </div>

        {/* Output */}
        {generated && (
          <div className="space-y-4">
            {/* Google Slides */}
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-5 border border-green-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-green-400"><Icons.FileSliders /></div>
                  <div>
                    <h3 className="text-white font-semibold">Create Google Slides Deck</h3>
                    <p className="text-slate-400 text-sm">{statusMsg || `Using ${templateLabels[clientType]} • Diagrams auto-inserted`}</p>
                  </div>
                </div>
                {!accessToken ? (
                  <button onClick={handleGoogleLogin} className="flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-medium"><Icons.LogIn /> Connect Google</button>
                ) : createdDeckUrl ? (
                  <a href={createdDeckUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium"><Icons.ExternalLink /> Open Deck</a>
                ) : (
                  <button onClick={createDeck} disabled={creatingDeck} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:bg-slate-600">
                    {creatingDeck ? <Icons.Loader /> : <Icons.FileSliders />} {creatingDeck ? 'Creating...' : 'Create Deck'}
                  </button>
                )}
              </div>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              {createdDeckUrl && <p className="text-green-400 text-sm mt-2">✓ Deck created with diagrams!</p>}
            </div>

            {/* Title Slide Full Preview */}
            <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
              <h3 className="text-white font-semibold text-sm mb-3">📌 Title Slide Preview</h3>
              <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a6bff 0%, #3b8bff 30%, #59a0ff 60%, #7ab8ff 100%)' }}>
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <div className="flex items-center gap-3">
                      <svg viewBox="0 0 81 65" fill="white" className="h-10">
                        <path d="M17.2 19.5c12.8-12.5 33.6-12.5 46.4 0l1.5 1.5c.6.6.6 1.7 0 2.3l-5.2 5.1c-.3.3-.8.3-1.2 0l-2.1-2.1c-8.9-8.7-23.4-8.7-32.4 0l-2.3 2.2c-.3.3-.8.3-1.2 0l-5.2-5.1c-.6-.6-.6-1.7 0-2.3l1.7-1.6zm57.3 10.7l4.6 4.5c.6.6.6 1.7 0 2.3L57.8 58c-.7.6-1.7.6-2.3 0L42 44.4c-.2-.2-.4-.2-.6 0L27.9 58c-.7.6-1.7.6-2.3 0L4.3 37c-.6-.6-.6-1.7 0-2.3l4.6-4.5c.7-.6 1.7-.6 2.3 0L24.7 43.8c.2.2.4.2.6 0l13.5-13.6c.7-.6 1.7-.6 2.3 0L54.6 43.8c.2.2.4.2.6 0l13.5-13.6c.3-.3.8-.3 1.2-.3.2 0 .4.1.6.3z" />
                      </svg>
                      <span className="text-white text-3xl font-semibold">WalletConnect Pay</span>
                    </div>
                    <span className="text-white/70 text-xl font-medium my-2">x</span>
                    {titleMode === 'website' && fetchedLogo ? (
                      <div className="flex items-center justify-center" style={{ maxWidth: 320, maxHeight: 120 }}>
                        <FallbackImg
                          sources={fetchedLogo}
                          alt={clientName}
                          style={{ maxWidth: '100%', maxHeight: 120, objectFit: 'contain' }}
                          onAllFailed={() => { setTitleMode('text'); setFetchedLogo(null); }}
                        />
                      </div>
                    ) : titleMode === 'upload' && processedLogo ? (
                      <div className="flex items-center justify-center" style={{ maxWidth: 320, maxHeight: 120 }}>
                        <img src={processedLogo} alt={clientName} style={{ maxWidth: '100%', maxHeight: 120, objectFit: 'contain' }} />
                      </div>
                    ) : (
                      <span className="text-white text-4xl font-bold">{clientName}</span>
                    )}
                  </div>
                </div>
              </div>
              {(titleMode === 'website' || titleMode === 'upload') && (
                <p className="text-slate-500 text-xs mt-2">Tip: For best results, use a transparent PNG logo so it blends with the blue background</p>
              )}
            </div>

            {/* Transaction Flow */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <button onClick={() => setExpanded({ ...expanded, tx: !expanded.tx })} className="flex items-center gap-2 text-white">
                  <span className="font-semibold text-sm">📊 Transaction Flow</span>
                  {expanded.tx ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                </button>
                {expanded.tx && (
                  <div className="flex items-center gap-2">
                    <div className="flex bg-slate-900 rounded-lg p-1">
                      <button onClick={() => setViewMode({ ...viewMode, tx: 'preview' })} className={`px-2 py-1 rounded text-xs ${viewMode.tx === 'preview' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}><Icons.Eye /></button>
                      <button onClick={() => setViewMode({ ...viewMode, tx: 'code' })} className={`px-2 py-1 rounded text-xs ${viewMode.tx === 'code' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}><Icons.Code /></button>
                    </div>
                    {viewMode.tx === 'preview' && txSvg && <button onClick={() => downloadDiagramAsPng(txSvg, 'transaction-flow')} className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs"><Icons.Download /> PNG</button>}
                    {viewMode.tx === 'code' && <button onClick={() => copyToClipboard(generateTxFlowDiagram(), 'tx')} className="flex items-center gap-1 px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">{copied.tx ? <Icons.Check /> : <Icons.Copy />}</button>}
                  </div>
                )}
              </div>
              {expanded.tx && (
                <div className="p-4">
                  {viewMode.tx === 'preview' ? (
                    <div className="bg-white rounded-lg p-4 overflow-x-auto max-h-[500px] overflow-y-auto flex items-start justify-center">
                      {txSvg ? <div dangerouslySetInnerHTML={{ __html: txSvg }} className="flex justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[460px]" /> : <p className="text-slate-400 text-center py-8">Loading...</p>}
                    </div>
                  ) : (
                    <pre className="bg-slate-900 rounded-lg p-4 text-xs text-slate-300 overflow-auto max-h-64 font-mono">{generateTxFlowDiagram()}</pre>
                  )}
                </div>
              )}
            </div>

            {/* Off-Ramp Flow */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <button onClick={() => setExpanded({ ...expanded, offramp: !expanded.offramp })} className="flex items-center gap-2 text-white">
                  <span className="font-semibold text-sm">📊 Off-Ramp Flow</span>
                  {expanded.offramp ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                </button>
                {expanded.offramp && (
                  <div className="flex items-center gap-2">
                    <div className="flex bg-slate-900 rounded-lg p-1">
                      <button onClick={() => setViewMode({ ...viewMode, offramp: 'preview' })} className={`px-2 py-1 rounded text-xs ${viewMode.offramp === 'preview' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}><Icons.Eye /></button>
                      <button onClick={() => setViewMode({ ...viewMode, offramp: 'code' })} className={`px-2 py-1 rounded text-xs ${viewMode.offramp === 'code' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}><Icons.Code /></button>
                    </div>
                    {viewMode.offramp === 'preview' && offrampSvg && <button onClick={() => downloadDiagramAsPng(offrampSvg, 'offramp-flow')} className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs"><Icons.Download /> PNG</button>}
                    {viewMode.offramp === 'code' && <button onClick={() => copyToClipboard(generateOffRampDiagram(), 'offramp')} className="flex items-center gap-1 px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">{copied.offramp ? <Icons.Check /> : <Icons.Copy />}</button>}
                  </div>
                )}
              </div>
              {expanded.offramp && (
                <div className="p-4">
                  {viewMode.offramp === 'preview' ? (
                    <div className="bg-white rounded-lg p-4 overflow-x-auto max-h-[500px] overflow-y-auto flex items-start justify-center">
                      {offrampSvg ? <div dangerouslySetInnerHTML={{ __html: offrampSvg }} className="flex justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[460px]" /> : <p className="text-slate-400 text-center py-8">Loading...</p>}
                    </div>
                  ) : (
                    <pre className="bg-slate-900 rounded-lg p-4 text-xs text-slate-300 overflow-auto max-h-64 font-mono">{generateOffRampDiagram()}</pre>
                  )}
                </div>
              )}
            </div>

            {/* Merchant KYB Flow */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <button onClick={() => setExpanded({ ...expanded, kyb: !expanded.kyb })} className="flex items-center gap-2 text-white">
                  <span className="font-semibold text-sm">📊 Merchant KYB Flow</span>
                  {expanded.kyb ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                </button>
                {expanded.kyb && (
                  <div className="flex items-center gap-2">
                    <div className="flex bg-slate-900 rounded-lg p-1">
                      <button onClick={() => setViewMode({ ...viewMode, kyb: 'preview' })} className={`px-2 py-1 rounded text-xs ${viewMode.kyb === 'preview' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}><Icons.Eye /></button>
                      <button onClick={() => setViewMode({ ...viewMode, kyb: 'code' })} className={`px-2 py-1 rounded text-xs ${viewMode.kyb === 'code' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}><Icons.Code /></button>
                    </div>
                    {viewMode.kyb === 'preview' && kybSvg && <button onClick={() => downloadDiagramAsPng(kybSvg, 'kyb-flow')} className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs"><Icons.Download /> PNG</button>}
                    {viewMode.kyb === 'code' && <button onClick={() => copyToClipboard(generateKybDiagram(), 'kyb')} className="flex items-center gap-1 px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">{copied.kyb ? <Icons.Check /> : <Icons.Copy />}</button>}
                  </div>
                )}
              </div>
              {expanded.kyb && (
                <div className="p-4">
                  {viewMode.kyb === 'preview' ? (
                    <div className="bg-white rounded-lg p-4 overflow-x-auto max-h-[500px] overflow-y-auto flex items-start justify-center">
                      {kybSvg ? <div dangerouslySetInnerHTML={{ __html: kybSvg }} className="flex justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[460px]" /> : <p className="text-slate-400 text-center py-8">Loading...</p>}
                    </div>
                  ) : (
                    <pre className="bg-slate-900 rounded-lg p-4 text-xs text-slate-300 overflow-auto max-h-64 font-mono">{generateKybDiagram()}</pre>
                  )}
                </div>
              )}
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 text-xs text-slate-400">
              <span className="font-medium text-slate-300">Workflow: </span>
              Enter client name → Generate → Create Deck → Done! 🚀 (Diagrams auto-inserted)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}