# WCP Deck Builder

A web app to generate customized WalletConnect Pay proposal decks with auto-generated Mermaid sequence diagrams.

🔗 **Live App:** https://wcp-deck-builder.vercel.app/

---

## Features

- 🎨 **Dynamic Title Slides** — Text, auto-fetched logo, or manual upload
- 📊 **Auto-generated Diagrams** — Transaction flow, off-ramp flow, merchant KYB
- 📝 **Template-based Generation** — Copies and customizes Google Slides templates
- 🔐 **Google OAuth** — Creates decks directly in user's Drive
- ⚡ **Instant Preview** — See diagrams and title slide before generating

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Diagrams:** Mermaid.js
- **APIs:** Google Slides API, Google Drive API
- **Deployment:** Vercel

---

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main app page
│   └── globals.css         # Global styles
├── components/
│   ├── Icons.tsx           # SVG icons & WC logo
│   ├── FallbackImg.tsx     # Image with fallback sources
│   ├── DiagramPanel.tsx    # Reusable diagram viewer
│   ├── ClientLogoSection.tsx   # Logo picker UI
│   └── TitleSlidePreview.tsx   # Title slide preview
├── lib/
│   ├── config.ts           # App config, client types, templates
│   ├── types.ts            # TypeScript interfaces
│   ├── utils.ts            # Helper functions
│   ├── diagrams.ts         # Mermaid diagram generators
│   └── googleApi.ts        # Google auth, Drive, Slides API
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Google Cloud Console project with OAuth credentials
- Google Slides templates (see [Template Setup](#template-setup))

### Installation

```bash
# Clone the repository
git clone https://github.com/CapuccinoFroth/wcp-deck-builder.git
cd wcp-deck-builder

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

No `.env` file needed — the Google OAuth client ID is in `lib/config.ts`.

To use your own Google Cloud project:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable **Google Slides API** and **Google Drive API**
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://your-domain.vercel.app` (production)
6. Update `clientId` in `lib/config.ts`

---

## Template Setup

The app uses Google Slides templates with placeholders:

### Text Placeholders (replaced with text)
| Placeholder | Replaced With |
|-------------|---------------|
| `{{PSP_NAME}}` | Client name |
| `{{PSP_name}}` | Client name |
| `{{local_curr}}` | Local currency |

### Image Placeholders (replaced with images)
| Placeholder | Replaced With |
|-------------|---------------|
| `[[IMG:CLIENT_LOGO]]` | Client logo or text image |
| `[[IMG:DIAGRAM_TRNXFLOW]]` | Transaction flow diagram |
| `[[IMG:DIAGRAM_OFFRAMPFLOW]]` | Off-ramp flow diagram |
| `[[IMG:DIAGRAM_MERCHANTKYBFLOW]]` | Merchant KYB diagram |

**Important:** Image placeholders must be inside **shapes** (Insert → Shape → Rectangle), not text boxes.

### Template IDs

Update template IDs in `lib/config.ts`:

```typescript
templates: {
  type1: 'YOUR_TYPE1_TEMPLATE_ID',
  type2: 'YOUR_TYPE2_TEMPLATE_ID',
}
```

Templates must be shared as "Anyone with the link" (Viewer access).

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## Usage Guide

For end-user documentation on how to use the app, see [USAGE.md](./USAGE.md).

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT

---

## Contact

Built by the WalletConnect Solutions Engineering team.