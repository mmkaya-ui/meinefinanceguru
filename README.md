# MeineFinanceGuru 💎

> **The zero-knowledge, local-first financial intelligence engine.**  
> Drag & drop bank statements from any bank worldwide. Decrypt in RAM. Zero cloud databases. Zero subscriptions.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Serwist-emerald)](https://serwist.pages.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

[📖 **Read the Complete Step-by-Step User Manual (`USER_MANUAL.md`) →**](USER_MANUAL.md)

---

## ⚡ Why MeineFinanceGuru?

Most budgeting apps want your bank credentials, charge \$100+/year, and store your entire financial life on unencrypted remote databases. 

**MeineFinanceGuru takes the opposite approach:**

1. **Air-Gapped Privacy (Zero-Knowledge):** Your financial data is encrypted using client-side **AES-256-GCM** derived with **PBKDF2 (100,000 iterations)**. Decryption happens strictly in your browser’s volatile memory (RAM). When you lock the vault or refresh, memory is wiped.
2. **Universal Statement Ingestion:** No manual spreadsheet formatting, no rigid column-mapping wizards. Drag and drop any statement (**PDF, CSV, TSV, TXT, JSON**) from Sparkasse, Deutsche Bank, N26, Revolut, Garanti, İş Bankası, Chase, or any institution. The AI semantically normalizes dates, currencies, and debit/credit signs.
3. **Client-Side PII Redaction:** Before any text touches an AI model, names, IBANs, phone numbers, and physical street addresses are stripped out on your device.
4. **BYOK (Bring Your Own Key):** Zero subscription fees. Plug in your free Google Gemini API key directly in your browser's `localStorage`. No middleman markup, no server proxying your requests.
5. **Native PWA Feel:** Installable on iOS and Android with full offline caching via Serwist Service Workers, touch-safe chart viewports, and dedicated bottom/top navigation.

---

## 🥊 How It Compares

| Feature | MeineFinanceGuru | YNAB / Monarch | FinAPI / Bank Aggregators | Google Sheets / Excel |
|:---|:---:|:---:|:---:|:---:|
| **Where your data lives** | **Your device (Client RAM)** | Cloud database | Third-party cloud servers | Google/Microsoft cloud |
| **Banking Credentials Needed?** | ❌ **Never** | Plaid / Bank login | Open Banking (PSD2) login | ❌ No |
| **Statement Import** | ⚡ **Drop PDF/CSV/TXT directly** | Plaid sync or rigid CSV | Direct bank sync | 🐌 Manual data entry |
| **PII Redaction** | 🛡️ **Automated on-device** | ❌ Raw details stored | ❌ Full KYC identity linked | ❌ Unprotected |
| **Pricing** | 💚 **Free & Open Source** | 🔴 \$100+/year | 🔴 €4–€8/month | 💚 Free |
| **Data Lock-in** | ❌ **1-Click JSON export** | 🔴 Locked behind paywall | 🔴 Hard to export clean history | ❌ None |

---

## 📸 Key Capabilities

### 1. Universal Semantic Statement Parser
Banks format statements inconsistently. German banks use comma decimals (`1.250,50 €`) and labels like *Gutschrift* or *Lastschrift*; Turkish banks use *Alacak/Borç*; US banks use negative prefixes. 

MeineFinanceGuru's semantic parser handles all of them without configuration:
- Standardizes diverse date formats (`DD.MM.YYYY`, `YYYY-MM-DD`, `MM/DD/YYYY`).
- Reconciles debit/credit indicators into signed numbers.
- Categorizes spending into normalized buckets: *Housing & Rent, Groceries, Utilities & Bills, Transportation, Healthcare, Discretionary, Debt Repayment, Income*.
- Runs automatic delta-detection to prevent duplicate transaction entries.

### 2. High-Resolution Cashflow & Debt Modeling
- **Free Cashflow Buffer:** See your true discretionary monthly margin after fixed contracts, leasing, and debt installments are fulfilled.
- **Liability Paydown Engine:** Track credit cards, loans, and overdraft facilities with priority liquidation metrics.
- **E-Commerce Leak Analysis:** Dedicated breakdowns for online marketplace spending, return deductions, and net historical outlays.
- **Salary & Tax Retention:** Track gross-to-net retention rates and statutory social deductions.

### 3. Ask AI (Grounded Financial Advisor)
Ask targeted questions about your budget directly in **English**, **German**, or **Turkish**:
- *"What is my average monthly burn rate across the last 6 months?"*
- *"Welche wiederkehrenden Verträge belasten meinen monatlichen Puffer am stärksten?"*
- *"Nakit akışımda en hızlı tasarruf yapabileceğim 3 harcama kalemi hangisi?"*

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/mmkaya-ui/meinefinanceguru.git
cd meinefinanceguru
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

- **Default Demo PIN:** `123456`
- **Or click:** **"Load Demo Data (1-Click)"** on the vault lock screen to test drive all charts and features with anonymized data.

---

## 🔐 Cryptographic Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Client Browser Environment                  │
│                                                             │
│  [Master PIN] ──► PBKDF2 (100k iterations) ──► AES-256-GCM  │
│                                                     │       │
│                                            Decrypted State  │
│                                           (Volatile RAM)    │
│                                                     │       │
│  [Raw Statement] ──► Client PII Masking ──► Sanitized AI    │
│                     (Redacts IBAN/Names/    (Gemini BYOK)   │
│                      Addresses Locally)                     │
└─────────────────────────────────────────────────────────────┘
```

1. **Zero External Persistence:** The app operates without a database backend. State is hydrated in-memory on unlock and exported as client-encrypted JSON.
2. **PBKDF2 Key Derivation:** Keys are derived client-side with 100,000 SHA-256 rounds and a unique salt.
3. **AES-GCM Authenticated Encryption:** Prevents payload tampering via an integrated 128-bit authentication tag.

---

## 📱 Mobile PWA Installation

- **iOS (Safari):** Tap **Share** ➡️ **Add to Home Screen**.
- **Android (Chrome):** Tap **Menu** (three dots) ➡️ **Install App**.

Includes standalone status bar styling, touch-optimized tooltip boundaries (`allowEscapeViewBox`), and persistent bottom utility controls.

---

## 🛠️ Deploy to Vercel

Click below to deploy your own instance with zero configuration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmmkaya-ui%2Fmeinefinanceguru)

*(Optional: configure `ADMIN_LICENSE_KEY` in your Vercel Project Settings for private administration).*

---

## 📄 License

Distributed under the [MIT License](LICENSE). Free for personal and commercial use.
