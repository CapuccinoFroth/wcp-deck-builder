// lib/config.ts

export const CONFIG = {
  clientId: '931056766416-dtq4re68d9o0p1ih5iun55u8jt7b5kjp.apps.googleusercontent.com',
  templates: {
    deck: '1XlIzFETAQqA0tl1zYHHFofSEQCiypYKJmJG8BiAwQ9Q',
  },
  scopes: 'https://www.googleapis.com/auth/presentations https://www.googleapis.com/auth/drive',
};

export const CLIENT_TYPES = [
  { id: 'type1', label: 'Type 1: No crypto payments and no offramp today', description: 'Payments companies with NO crypto capabilities (e.g., Ingenico) - we own the entire flow' },
  { id: 'type2', label: 'Type 2: Has off-ramp or is a crypto to crypto flow', description: 'has off-ramp or is a crypto to crypto flow.' },
  { id: 'type3', label: 'Type 3: Distribution partners, hardware, crypto service providers', description: 'Hardware manufacturers (e.g., Imin, Lunu) or Stablecoin issuers/Chains - channel partners who push WCP to acquirers' },
  { id: 'type4', label: 'Type 4: Direct to Merchant', description: 'Merchants integrating WalletConnect Pay directly' },
];

export function getTemplateId(): string {
  return CONFIG.templates.deck;
}