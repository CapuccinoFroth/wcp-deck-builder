# WCP Deck Builder

A web app that builds a WalletConnect Pay proposal deck for a BD prospect. It copies one Google Slides template into the signed-in user’s Drive, fills in the client details, and drops in sequence diagrams for that client type.

**Live app:** https://wcp-deck-builder.vercel.app/

---

## How it works

1. You enter the client name, client type, currency (when it applies), the Solutions Engineer email, and the thank-you slide email.
2. The app draws three Mermaid sequence diagrams: transaction flow, off-ramp flow, and merchant KYB.
3. You connect a Google account. That account must be able to open the template.
4. The app copies the template into that account’s Drive, uploads the diagrams as images, and replaces the placeholders in the copy.

The new deck is named `WalletConnect Pay x {client name}`. Diagram images are uploaded to the same Drive and shared as “anyone with the link” so Google Slides can place them.

There is no Drive folder in the setup. The copy and the diagram files are created in the signed-in user’s My Drive. Connecting Google is required. Pointing the app at a specific folder is not.

---

## Google setup

The OAuth client ID lives in `src/lib/config.ts`. The app asks for the Google Slides and Google Drive scopes, then uses the signed-in account to copy the deck and upload images.

To use another Google Cloud project:

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project.
3. Enable the **Google Slides API** and the **Google Drive API**.
4. Create an OAuth 2.0 client ID for a web application.
5. Add authorized JavaScript origins:
   - `http://localhost:3000`
   - the production URL, for example `https://wcp-deck-builder.vercel.app`
6. Put that client ID in `clientId` in `src/lib/config.ts`.

The template is one Google Slides file. Its ID is `templates.deck` in `src/lib/config.ts`. Every client type copies that same file. Share the template with the Google account that will generate decks, or share it as “anyone with the link” can view.

### Placeholders in the template

Text the app replaces:

| Placeholder | Replaced with |
|---|---|
| `{{PSP_NAME}}` | Client name |
| `{{PSP_name}}` | Client name, or `PSP` for Type 3 |
| `{{local_curr}}` | Local currency |
| `{{CLIENT_TITLE_NAME}` | Client name on the title slide |
| `{Contact_email}` | Solutions Engineer email |
| `{Contact_Role}` | `Solutions Engineer` |
| `{Contact2_email}` | Thank-you slide email |

Diagram images must sit in shapes (Insert → Shape), not text boxes. The shape text is:

| Shape text | Replaced with |
|---|---|
| `[[IMG:DIAGRAM_TRNXFLOW]]` | Transaction flow |
| `[[IMG:DIAGRAM_OFFRAMPFLOW]]` | Off-ramp flow |
| `[[IMG:DIAGRAM_MERCHANTKYBFLOW]]` | Merchant KYB flow |

---

## Client types and flows

All four types use the same slide template. The sequence diagrams change with the type.

**Type 1 — No crypto payments and no offramp today.** The transaction diagram names the PSP participant after the client. The off-ramp participant is `offramp`. The off-ramp diagram includes both crypto settlement and fiat settlement.

**Type 2 — Has an off-ramp, or is crypto to crypto.** The form asks which one. The transaction diagram names the PSP after the client, and the off-ramp participant is the client name.

- **Off-ramp** keeps local currency, the currency bank participant, and both the crypto and fiat settlement steps.
- **Crypto to crypto** hides local currency. The off-ramp diagram keeps only the crypto settlement step and drops the bank participant.

**Type 3 — Distribution partners, hardware, crypto service providers.** The transaction diagram keeps the generic labels `PSP` and `Merchant`. The off-ramp participant is `3rd Party Off-Ramp`. On the slides, `{{PSP_name}}` becomes `PSP` rather than the client name.

**Type 4 — Direct to merchant.** The transaction diagram has no PSP. The merchant participant is the client name. In the off-ramp diagram the off-ramp participant is `off-ramp` and the merchant is the client name.

---

## Tech stack

- Next.js 16 (App Router) and TypeScript
- Tailwind CSS
- Mermaid.js for the sequence diagrams
- Google Slides API and Google Drive API
- Vercel

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx            # Form and deck creation
│   └── globals.css
├── components/
│   ├── DiagramPanel.tsx    # Diagram preview
│   └── Icons.tsx
└── lib/
    ├── config.ts           # OAuth client ID, template ID, client types
    ├── diagrams.ts         # Sequence diagrams per client type
    ├── googleApi.ts        # Google auth, Drive copy, Slides updates
    ├── types.ts
    └── utils.ts
```

---

## Local development

Node.js 18 or newer.

```bash
git clone https://github.com/CapuccinoFroth/wcp-deck-builder.git
cd wcp-deck-builder
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No `.env` file is required for the OAuth client ID.

---

## Deployment

The production app is on Vercel. Pushing `main` can be deployed with the Vercel project connected to this repo, or from the CLI:

```bash
vercel --prod
```
