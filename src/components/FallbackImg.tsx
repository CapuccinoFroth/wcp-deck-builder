// components/FallbackImg.tsx
'use client';

import { useState, useEffect } from 'react';

interface FallbackImgProps {
  sources: string | string[];
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
  onAllFailed?: () => void;
}

export function FallbackImg({
  sources,
  alt,
  style,
  className,
  onAllFailed,
}: FallbackImgProps) {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIdx(0);
    setFailed(false);
  }, [sources]);

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
        if (idx < list.length - 1) {
          setIdx(idx + 1);
        } else {
          setFailed(true);
          if (onAllFailed) onAllFailed();
        }
      }}
    />
  );
}