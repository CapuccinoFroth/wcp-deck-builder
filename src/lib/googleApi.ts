// lib/googleApi.ts

import { CONFIG, getTemplateId } from './config';
import { GoogleUser, TitleMode } from './types';

export async function fetchUserInfo(token: string): Promise<GoogleUser> {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function uploadImageToDrive(
  accessToken: string,
  blob: Blob,
  filename: string
): Promise<string> {
  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify({ name: filename, mimeType: 'image/png' })], {
      type: 'application/json',
    })
  );
  form.append('file', blob);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    }
  );
  if (!res.ok) throw new Error('Failed to upload image');

  const { id } = await res.json();

  // Make file publicly readable
  await fetch(`https://www.googleapis.com/drive/v3/files/${id}/permissions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: 'reader', type: 'anyone' }),
  });

  return id;
}

// Convert base64 data URL to Blob
export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// Generate text as a PNG image (for title slide when text mode is selected)
export function generateTextImage(text: string): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 200;
    
    // Transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Configure text style (white text to match the blue slide background)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 72px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw text
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/png');
  });
}

// Fetch image from URL and convert to Blob using canvas (works around CORS for many images)
export function fetchImageViaCanvas(imageUrl: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to convert to blob'));
      }, 'image/png');
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

export async function copyTemplate(
  accessToken: string,
  clientType: string,
  clientName: string
): Promise<string> {
  const templateId = getTemplateId(clientType);
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${templateId}/copy`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: `WalletConnect Pay x ${clientName}` }),
    }
  );
  if (!res.ok) throw new Error('Failed to copy template');
  const { id } = await res.json();
  return id;
}

interface UpdateSlidesParams {
  txImgId: string;
  offImgId: string;
  kybImgId: string;
  logoImgId?: string | null;
  logoUrl?: string | null;  // For external URLs (from website)
  titleMode: TitleMode;
}

export async function updateSlides(
  accessToken: string,
  deckId: string,
  clientName: string,
  localCurrency: string,
  params: UpdateSlidesParams
): Promise<void> {
  const { txImgId, offImgId, kybImgId, logoImgId, logoUrl, titleMode } = params;

  // First batch: text replacements and diagram images
  const requests: any[] = [
    {
      replaceAllText: {
        containsText: { text: '{{PSP_NAME}}', matchCase: true },
        replaceText: clientName,
      },
    },
    {
      replaceAllText: {
        containsText: { text: '{{PSP_name}}', matchCase: true },
        replaceText: clientName,
      },
    },
    {
      replaceAllText: {
        containsText: { text: '{{local_curr}}', matchCase: true },
        replaceText: localCurrency,
      },
    },
    {
      replaceAllText: {
        containsText: { text: '{{Template do not touch}}', matchCase: false },
        replaceText: 'Generated by SolEngAgent - you can delete this first slide',
      },
    },
    {
      replaceAllShapesWithImage: {
        imageUrl: `https://drive.google.com/uc?id=${txImgId}`,
        replaceMethod: 'CENTER_INSIDE',
        containsText: { text: '[[IMG:DIAGRAM_TRNXFLOW]]', matchCase: false },
      },
    },
    {
      replaceAllShapesWithImage: {
        imageUrl: `https://drive.google.com/uc?id=${offImgId}`,
        replaceMethod: 'CENTER_INSIDE',
        containsText: { text: '[[IMG:DIAGRAM_OFFRAMPFLOW]]', matchCase: false },
      },
    },
    {
      replaceAllShapesWithImage: {
        imageUrl: `https://drive.google.com/uc?id=${kybImgId}`,
        replaceMethod: 'CENTER_INSIDE',
        containsText: { text: '[[IMG:DIAGRAM_MERCHANTKYBFLOW]]', matchCase: false },
      },
    },
  ];

  // Handle title slide logo/text
  if (logoImgId) {
    // Uploaded to Drive (text image or uploaded logo) - most reliable
    requests.push({
      replaceAllShapesWithImage: {
        imageUrl: `https://drive.google.com/uc?id=${logoImgId}`,
        replaceMethod: 'CENTER_INSIDE',
        containsText: { text: '[[IMG:CLIENT_LOGO]]', matchCase: false },
      },
    });
  } else if (logoUrl) {
    // External URL (from website) - try this
    requests.push({
      replaceAllShapesWithImage: {
        imageUrl: logoUrl,
        replaceMethod: 'CENTER_INSIDE',
        containsText: { text: '[[IMG:CLIENT_LOGO]]', matchCase: false },
      },
    });
  }

  // Always add text fallback at the end - this will replace any remaining [[IMG:CLIENT_LOGO]] 
  // placeholders that weren't replaced by image (either because it's a text box or image failed)
  requests.push({
    replaceAllText: {
      containsText: { text: '[[IMG:CLIENT_LOGO]]', matchCase: false },
      replaceText: clientName,
    },
  });

  await fetch(
    `https://slides.googleapis.com/v1/presentations/${deckId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    }
  );
}

export function initGoogleAuth(onSuccess: (token: string) => void): void {
  const client = window.google.accounts.oauth2.initTokenClient({
    client_id: CONFIG.clientId,
    scope: CONFIG.scopes,
    callback: (response: any) => {
      if (response.access_token) {
        onSuccess(response.access_token);
      }
    },
  });
  client.requestAccessToken();
}