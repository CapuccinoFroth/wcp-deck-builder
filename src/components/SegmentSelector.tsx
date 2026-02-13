// components/SegmentSelector.tsx
'use client';

export type Segment = 'bd' | 'wallet';

interface SegmentSelectorProps {
  segment: Segment;
  onChange: (segment: Segment) => void;
}

export function SegmentSelector({ segment, onChange }: SegmentSelectorProps) {
  return (
    <div className="flex bg-slate-800 rounded-xl p-1 mb-5">
      <button
        onClick={() => onChange('bd')}
        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
          segment === 'bd'
            ? 'bg-blue-500 text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        BD Prospects
      </button>
      <button
        onClick={() => onChange('wallet')}
        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
          segment === 'wallet'
            ? 'bg-blue-500 text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        Wallet Partners
      </button>
    </div>
  );
}