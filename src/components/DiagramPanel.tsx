// components/DiagramPanel.tsx
'use client';

import { Icons } from './Icons';
import { ViewMode } from '@/lib/types';
import { downloadDiagramAsPng } from '@/lib/utils';

interface DiagramPanelProps {
  title: string;
  expanded: boolean;
  onToggleExpand: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  svgContent: string;
  mermaidCode: string;
  clientName: string;
  filename: string;
  copied: boolean;
  onCopy: () => void;
}

export function DiagramPanel({
  title,
  expanded,
  onToggleExpand,
  viewMode,
  onViewModeChange,
  svgContent,
  mermaidCode,
  clientName,
  filename,
  copied,
  onCopy,
}: DiagramPanelProps) {
  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <button onClick={onToggleExpand} className="flex items-center gap-2 text-white">
          <span className="font-semibold text-sm">📊 {title}</span>
          {expanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
        </button>
        {expanded && (
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-900 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('preview')}
                className={`px-2 py-1 rounded text-xs ${viewMode === 'preview' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}
              >
                <Icons.Eye />
              </button>
              <button
                onClick={() => onViewModeChange('code')}
                className={`px-2 py-1 rounded text-xs ${viewMode === 'code' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}
              >
                <Icons.Code />
              </button>
            </div>
            {viewMode === 'preview' && svgContent && (
              <button
                onClick={() => downloadDiagramAsPng(svgContent, filename, clientName)}
                className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs"
              >
                <Icons.Download /> PNG
              </button>
            )}
            {viewMode === 'code' && (
              <button
                onClick={onCopy}
                className="flex items-center gap-1 px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs"
              >
                {copied ? <Icons.Check /> : <Icons.Copy />}
              </button>
            )}
          </div>
        )}
      </div>
      {expanded && (
        <div className="p-4">
          {viewMode === 'preview' ? (
            <div className="bg-white rounded-lg p-4 overflow-x-auto max-h-[500px] overflow-y-auto flex items-start justify-center">
              {svgContent ? (
                <div
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                  className="flex justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[460px]"
                />
              ) : (
                <p className="text-slate-400 text-center py-8">Loading...</p>
              )}
            </div>
          ) : (
            <pre className="bg-slate-900 rounded-lg p-4 text-xs text-slate-300 overflow-auto max-h-64 font-mono">
              {mermaidCode}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}