// lib/config.ts

export const CONFIG = {
    clientId: '931056766416-dtq4re68d9o0p1ih5iun55u8jt7b5kjp.apps.googleusercontent.com',
    templates: {
      type1: '1BJ3kyDPPQXEzywYajaIQsybx9yFlZwT-Hw7oZXZa1Gk',
      type2: '1LKxo5vc7F43fGzsikv9-exB6_DQfvGRHoxNi8WIOK-s',
    },
    scopes: 'https://www.googleapis.com/auth/presentations https://www.googleapis.com/auth/drive',
  };
  
  export const CLIENT_TYPES = [
    { id: 'type1', label: 'Type 1: No Crypto', description: 'Payments companies with NO crypto capabilities (e.g., Ingenico) - we own the entire flow' },
    { id: 'type2a', label: 'Type 2a: Offers crypto payments to merchants - needs improvements', description: 'Payments companies with SOME crypto capabilities (e.g., Ezeebit) - they already have merchants using crypto for payments and want to improve their offering with better UX, typically have licences for off-ramping' },
    { id: 'type2b', label: 'Type 2b: Neobanks, crypto-platform (no merchant payment offering yet)', description: 'Off-ramps / B2B payments companies (e.g., Banks) - well versed in crypto, typically have licences, but don\'t yet offer crypto payments to merchants. They may offer crypto custody and want to expand their product offering and generate more revenue' },
    { id: 'type3', label: 'Type 3: Distribution partners, hardware, crypto service providers', description: 'Hardware manufacturers (e.g., Imin, Lunu) or Stablecoin issuers/Chains - channel partners who push WCP to acquirers' },
  ];
  
  export const TEMPLATE_LABELS: Record<string, string> = {
    type1: 'Type 1 template (No Crypto)',
    type2a: 'Type 2a template (Some Crypto)',
    type2b: 'Type 2b — uses Type 2a template',
    type3: 'Type 3 — uses Type 1 template',
  };
  
  export function getTemplateId(clientType: string): string {
    return (clientType === 'type1' || clientType === 'type3') 
      ? CONFIG.templates.type1 
      : CONFIG.templates.type2;
  }