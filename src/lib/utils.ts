// lib/utils.ts

export function extractDomain(url: string): string {
    try {
      let d = url.trim();
      if (!d.startsWith('http')) d = 'https://' + d;
      return new URL(d).hostname.replace('www.', '');
    } catch {
      return url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    }
  }
  
  export function getLogoSources(domain: string): string[] {
    return [
      `https://logo.clearbit.com/${domain}`,
      `https://img.logo.dev/${domain}?token=pk_anonymous&size=200&format=png`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    ];
  }
  
  export function removeBackground(imageSrc: string): Promise<string> {
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
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) data[i + 3] = 0;
          else if (data[i] > 220 && data[i + 1] > 220 && data[i + 2] > 220) data[i + 3] = 0;
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(imageSrc);
      img.src = imageSrc;
    });
  }
  
  export function svgToPngBlob(
    svgString: string,
    targetWidth: number = 1920,
    targetHeight: number = 1080
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
      const svgEl = svgDoc.querySelector('svg');
      if (svgEl) {
        let viewBox = svgEl.getAttribute('viewBox');
        const ow = parseFloat(svgEl.getAttribute('width') || '800');
        const oh = parseFloat(svgEl.getAttribute('height') || '600');
        if (!viewBox) {
          viewBox = `0 0 ${ow} ${oh}`;
          svgEl.setAttribute('viewBox', viewBox);
        }
        const ar = ow / oh;
        let fw = targetWidth,
          fh = targetWidth / ar;
        if (fh > targetHeight) {
          fh = targetHeight;
          fw = targetHeight * ar;
        }
        svgEl.setAttribute('width', String(fw));
        svgEl.setAttribute('height', String(fh));
      }
      const scaled = new XMLSerializer().serializeToString(svgDoc);
      const url = URL.createObjectURL(new Blob([scaled], { type: 'image/svg+xml' }));
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            blob ? resolve(blob) : reject(new Error('Blob fail'));
          },
          'image/png',
          1.0
        );
      };
      img.onerror = () => reject(new Error('SVG load fail'));
      img.src = url;
    });
  }
  
  export function downloadDiagramAsPng(svgString: string, filename: string, clientName: string) {
    const url = URL.createObjectURL(new Blob([svgString], { type: 'image/svg+xml' }));
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(2, 2);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = `${clientName || 'client'}-${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }