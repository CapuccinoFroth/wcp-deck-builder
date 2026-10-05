// lib/diagrams.ts

const MERMAID_THEME = `%%{init: {"theme": "base", "themeVariables": {"actorBkg": "#EEF1FF", "actorBorder": "#9AA7FF", "actorTextColor": "#1F2A44", "noteBkgColor": "#FFF6BF", "noteBorderColor": "#E6D87A", "noteTextColor": "#2B2B2B", "signalColor": "#6B7280", "signalTextColor": "#374151", "altSectionBkgColor": "#FFF6BF", "altSectionBorderColor": "#E6D87A"}}}%%`;

interface DiagramParams {
  clientName: string;
  clientType: string;
  localCurrency: string;
  offRampProvider: string;
  type2Flow: string;
}

export function generateTxFlowDiagram({ clientName, clientType }: DiagramParams): string {
  if (clientType !== 'type4') {
    const psp = clientType === 'type3' ? 'PSP' : (clientName || 'PSP');
    return `${MERMAID_THEME}
sequenceDiagram
    autonumber

    participant User as Shopper
    participant Merchant as Merchant
    participant PSP as ${psp}
    participant WCP as WalletConnect Pay
    participant Wallet as User Wallet
    participant MTA as MTA (Blockchain)

    %% Checkout
    User ->> Merchant: Start checkout
    Merchant ->> User: Show payment methods
    User ->> Merchant: Select crypto payment

    %% Payment creation
    Merchant ->> PSP: Create payment<br/>(referenceId, fiatAmount)
    PSP ->> WCP: createPayment(referenceId, fiatAmount)
    WCP -->> PSP: paymentId + gatewayUrl<br/>(requires_action)
    PSP -->> Merchant: Payment session / gatewayUrl

    %% Wallet connection
    Merchant ->> User: Display payment experience
    User ->> WCP: Open gateway / scan QR
    WCP ->> Wallet: Connect wallet

    %% Payment options
    WCP ->> WCP: Determine available<br/>chains, tokens & routes
    WCP -->> Wallet: Present payment options
    User ->> Wallet: Select option & approve payment

    %% Authorization
    Wallet ->> WCP: Sign off-chain<br/>payment authorization

    %% On-chain execution
    WCP ->> MTA: Relayer constructs &<br/>broadcasts transaction
    MTA -->> WCP: Transaction confirmed

    %% Status
    WCP -->> PSP: Get payment status / webhook
    PSP -->> Merchant: Payment confirmed
    Merchant -->> User: Payment successful`;
  }

  const merchant = clientName || 'Merchant';
  return `${MERMAID_THEME}
sequenceDiagram
    autonumber

    participant User as Shopper
    participant Merchant as ${merchant}
    participant WCP as WalletConnect Pay
    participant Wallet as User Wallet
    participant MTA as MTA (Blockchain)

    %% Checkout
    User ->> Merchant: Start checkout
    Merchant ->> User: Show payment methods
    User ->> Merchant: Select crypto payment

    %% Payment creation
    Merchant ->> WCP: createPayment(referenceId, fiatAmount)
    WCP -->> Merchant: paymentId + gatewayUrl<br/>(requires_action)
    Merchant ->> User: Display payment experience / QR

    %% Wallet connection
    User ->> WCP: Open gateway / scan QR
    WCP ->> Wallet: Connect wallet

    %% Payment options
    WCP ->> WCP: Determine available<br/>chains, tokens & routes
    WCP -->> Wallet: Present payment options
    User ->> Wallet: Select option & approve payment

    %% Authorization
    Wallet ->> WCP: Sign off-chain<br/>payment authorization

    %% On-chain execution
    WCP ->> MTA: Relayer constructs &<br/>broadcasts transaction
    MTA -->> WCP: Transaction confirmed

    %% Status
    WCP -->> Merchant: Get payment status / webhook
    Merchant -->> User: Payment successful`;
}

export function generateOffRampDiagram({ clientName, clientType, localCurrency, type2Flow }: DiagramParams): string {
  const curr = localCurrency || 'USD';
  const name = clientName || 'PSP';
  const cryptoToCrypto = clientType === 'type2' && type2Flow === 'crypto-to-crypto';

  let offRampLabel: string;
  if (clientType === 'type1') {
    offRampLabel = 'offramp';
  } else if (clientType === 'type2') {
    offRampLabel = name;
  } else if (clientType === 'type3') {
    offRampLabel = '3rd Party Off-Ramp';
  } else {
    offRampLabel = 'off-ramp';
  }

  const merchantLabel = clientType === 'type4' ? (clientName || 'Merchant') : 'Merchant';

  return `${MERMAID_THEME}
sequenceDiagram
    autonumber
    participant chain as WCP Relayer
    participant WCP as MTA
    participant OffRamp as ${offRampLabel}<br/>(Liquidity Account)
    participant M as ${merchantLabel}${cryptoToCrypto ? '' : `
    participant Bank as ${curr} Bank Rails`}
    Note over chain,WCP: User payment settles<br/>on-chain into WC Pay Transit
    chain-->>WCP: Transfer confirmed<br/>(funds in Transit Acc)
    Note over WCP,OffRamp: Immediate or Batch settlement 
    WCP->>OffRamp: Transfer stablecoin<br/>(e.g. USDC) to Liquidity
    OffRamp-->>WCP: Transfer confirmed
    ${cryptoToCrypto ? `OffRamp->>M: Send crypto to merchant wallet` : `alt Crypto settlement
        OffRamp->>M: Send crypto to merchant wallet
    else Fiat settlement (${curr})
        OffRamp->>Bank: Send ${curr} fiat payout<br/>to merchant bank account
        Bank-->>M: Payout confirmation
    end`}`;
}

export function generateKybDiagram({ clientName, clientType, offRampProvider }: DiagramParams): string {
  const name = clientName || 'PSP';
  
  let offRampLabel: string;
  if (clientType === 'type1' || clientType === 'type3') {
    offRampLabel = 'OffRamp Provider (KYB)';
  } else if (clientType === 'type2' && offRampProvider === 'wcp') {
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