// lib/diagrams.ts

const MERMAID_THEME = `%%{init: {"theme": "base", "themeVariables": {"actorBkg": "#EEF1FF", "actorBorder": "#9AA7FF", "actorTextColor": "#1F2A44", "noteBkgColor": "#FFF6BF", "noteBorderColor": "#E6D87A", "noteTextColor": "#2B2B2B", "signalColor": "#6B7280", "signalTextColor": "#374151", "altSectionBkgColor": "#FFF6BF", "altSectionBorderColor": "#E6D87A"}}}%%`;

interface DiagramParams {
  clientName: string;
  clientType: string;
  localCurrency: string;
  offRampProvider: string;
}

export function generateTxFlowDiagram({ clientName, clientType }: DiagramParams): string {
  const psp = (clientType === 'type1' || clientType === 'type2a' || clientType === 'type2b') 
    ? (clientName || 'PSP') 
    : 'PSP';
    
  return `${MERMAID_THEME}
sequenceDiagram
    autonumber
    participant Shopper
    participant Wallet
    participant PSP as ${psp}
    participant WCPay as WC Pay Engine
    participant Chain as Merchant Transit Acc
    Shopper ->> PSP: Choose WalletConnect Pay
    PSP ->> WCPay: Create payment embedded<br/>(amount, reference)
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
}

export function generateOffRampDiagram({ clientName, clientType, localCurrency, offRampProvider }: DiagramParams): string {
  const curr = localCurrency || 'USD';
  const name = clientName || 'PSP';
  
  let offRampLabel: string;
  if (clientType === 'type1' || clientType === 'type3') {
    offRampLabel = '3rd Party Off-Ramp';
  } else if ((clientType === 'type2a' || clientType === 'type2b') && offRampProvider === 'wcp') {
    offRampLabel = 'Off-Ramp Provider';
  } else {
    offRampLabel = name;
  }

  return `${MERMAID_THEME}
sequenceDiagram
    autonumber
    participant chain as Blockchain
    participant WCP as WC Pay<br/>(Relayer + MTA)
    participant OffRamp as ${offRampLabel}<br/>(Liquidity Account)
    participant M as Merchant
    participant Bank as ${curr} Bank Rails
    Note over chain,WCP: User payment settles<br/>on-chain into WC Pay Transit
    chain-->>WCP: Transfer confirmed<br/>(funds in Transit Acc)
    Note over WCP,OffRamp: Batch settlement (T+0 / T+1)
    WCP->>OffRamp: Transfer stablecoin<br/>(e.g. USDC) to Liquidity
    OffRamp-->>WCP: Transfer confirmed
    alt Crypto settlement
        OffRamp->>M: Send crypto to merchant wallet
    else Fiat settlement (${curr})
        OffRamp->>Bank: Send ${curr} fiat payout<br/>to merchant bank account
        Bank-->>M: Payout confirmation
    end`;
}

export function generateKybDiagram({ clientName, clientType, offRampProvider }: DiagramParams): string {
  const name = clientName || 'PSP';
  
  let offRampLabel: string;
  if (clientType === 'type1' || clientType === 'type3') {
    offRampLabel = 'OffRamp Provider (KYB)';
  } else if ((clientType === 'type2a' || clientType === 'type2b') && offRampProvider === 'wcp') {
    offRampLabel = 'Off-Ramp Provider (KYB)';
  } else {
    offRampLabel = name + ' (KYB)';
  }

  return `${MERMAID_THEME}
sequenceDiagram
    autonumber
    participant Merchant
    participant WC_Dashboard as WC Pay Dashboard
    participant WC_Core as WC Pay Core
    participant OffRamp as ${offRampLabel}
    Merchant->>WC_Dashboard: Create account<br/>(email/password)
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
}