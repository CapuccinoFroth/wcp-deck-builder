// lib/types.ts

export type LogoMode = 'website' | 'upload';
export type ViewMode = 'preview' | 'code';
export type OffRampProvider = 'client' | 'wcp';

export interface GoogleUser {
  email: string;
  given_name?: string;
  picture?: string;
}

export interface DiagramViewModes {
  tx: ViewMode;
  offramp: ViewMode;
  kyb: ViewMode;
}

export interface ExpandedPanels {
  tx: boolean;
  offramp: boolean;
  kyb: boolean;
}

export interface CopiedState {
  title: boolean;
  tx: boolean;
  offramp: boolean;
  kyb: boolean;
}

// For Google API responses
export interface DriveFileResponse {
  id: string;
}

declare global {
  interface Window {
    google: any;
    mermaid: any;
  }
}