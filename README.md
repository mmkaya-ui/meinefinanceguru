# MeineFinanceGuru 💎

> **Local-First, Zero-Knowledge Personal Finance & Wealth Intelligence Platform**  
> Built with Next.js 16, React 19, Tailwind CSS, Recharts, and Web Crypto API.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Serwist-emerald)](https://serwist.pages.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

[📖 **Read the Complete User Manual & Setup Guide →**](USER_MANUAL.md)

---

## 🌟 Overview

**MeineFinanceGuru** is an enterprise-grade, privacy-first personal finance platform. Unlike cloud budgeting tools that store your sensitive banking credentials and financial history in third-party databases, MeineFinanceGuru operates on a **Local-First, Zero-Knowledge Architecture**:

- **No Remote Database:** Your financial records are never saved to an external database.
- **Client-Side AES-256-GCM Encryption:** Data payloads are encrypted using PBKDF2 (100,000 iterations, SHA-256) and AES-256-GCM directly in your browser.
- **In-Memory Decryption:** The vault is decrypted only in client-side RAM when you enter your Master PIN, and wiped when you lock or reload.
- **Local PII Scrubbing:** PDF statement extraction and parsing scrub all personally identifiable information (IBANs, names, street addresses) on-device before querying AI models.

---

## 🚀 Key Features

- **📊 Comprehensive Financial Analytics:**
  - Net cashflow and savings rate projections.
  - Categorized monthly expenditure trends (housing, groceries, utilities, transportation, discretionary).
  - Liability paydown schedules and priority debt liquidation tracking.
  - Detailed discretionary spending and e-commerce analytics.
  - Gross-to-net salary retention and tax deduction analysis.

- **📱 Mobile-First PWA (Progressive Web App):**
  - Offline-first caching via Serwist service worker.
  - Native feel on iOS and Android with standalone display, status bar integration, and touch-optimized boundaries.
  - Distinct mobile navigation: top horizontal utility ribbon and persistent bottom quick-action bar.

- **📂 Import, Export & Demo Mode:**
  - **1-Click Demo Mode:** Instantly explore the complete UI and charts with realistic, anonymized sample data.
  - **JSON Backup & Restore:** Export and import your entire financial state with a single click.
  - **Start Fresh:** Initialize an empty vault and populate it over time.

- **🔑 BYOK (Bring Your Own Key) Architecture:**
  - Zero server dependency: simply plug in your free Google Gemini API key in Settings.
  - Key is stored exclusively in your browser's `localStorage` and never saved to any database.

- **🤖 Universal Semantic AI Parser:**
  - Drop statements in **PDF, CSV, TSV, TXT, or JSON** from ANY bank worldwide (Sparkasse, Deutsche Bank, N26, Revolut, Garanti, İş Bankası, Chase, BoA, etc.).
  - Semantically understands dates, credit/debit indicators (*Haben/Soll*, *Alacak/Borç*, *Credit/Debit*), and auto-categorizes expenses into normalized buckets.
  - Client-side PII scrubber automatically redacts IBANs, phone numbers, emails, and street addresses before AI analysis.

- **🌐 Tri-Lingual Support:**
  - Full instant interface translation in **English 🇬🇧**, **Deutsch 🇩🇪**, and **Türkçe 🇹🇷**, switchable from the lock screen, navigation bar, or settings.

---

## 🛠️ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/mmkaya-ui/meinefinanceguru.git
cd meinefinanceguru
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- Default Demo PIN: `123456`
- Or click **"Load Demo Data (1-Click)"** on the lock screen to preview immediately!

---

## 📦 Production Build & Deployment

### Build locally
```bash
npm run build
npm run start
```

### Deploy to Vercel
MeineFinanceGuru is ready for zero-configuration deployment to [Vercel](https://vercel.com/):

1. Import the repository into your Vercel dashboard.
2. (Optional) Set `GEMINI_API_KEY` in environment variables if you wish to provide a global server-side key. Users can also provide their own keys in the app Settings.
3. Deploy!

---

## 🔐 Security Architecture

```
+-------------------------------------------------------------+
|                      Browser / Client                       |
|                                                             |
|  [Master PIN] ----> PBKDF2 (100k rounds) ---> AES-256-GCM   |
|                                                   |         |
|                                         Decrypted State     |
|                                        (RAM Only, No DB)    |
|                                                   |         |
|  [PDF Statement] --> Client PII Masking --> Sanitized AI    |
+-------------------------------------------------------------+
```

1. **Key Derivation:** Web Crypto API derives an AES-256 key from your passphrase using PBKDF2 with SHA-256 and a random cryptographic salt.
2. **Integrity Verification:** AES-GCM includes an authentication tag (`authTag`) preventing payload tampering.
3. **Privacy by Design:** No cookies, no telemetry trackers, no database connections.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
