# 📘 MeineFinanceGuru — Complete User Manual & Guide

> **Your Local-First, Zero-Knowledge Financial Intelligence Companion**  
> Everything you need to know about setting up your private vault, importing bank statements, configuring BYOK AI, and tracking your wealth.

---

## 📑 Table of Contents

1. [Introduction & Privacy Guarantee](#1-introduction--privacy-guarantee)
2. [Getting Started & Vault Modes](#2-getting-started--vault-modes)
   - [2.1 Decrypting with Master PIN](#21-decrypting-with-master-pin)
   - [2.2 1-Click Demo Mode](#22-1-click-demo-mode)
   - [2.3 Importing a JSON Backup](#23-importing-a-json-backup)
   - [2.4 Starting Fresh with an Empty Vault](#24-starting-fresh-with-an-empty-vault)
3. [BYOK (Bring Your Own Key) Setup](#3-byok-bring-your-own-key-setup)
   - [3.1 Getting a Free Google Gemini API Key](#31-getting-a-free-google-gemini-api-key)
   - [3.2 Activating BYOK in Settings](#32-activating-byok-in-settings)
4. [Universal Statement Import (AI Semantic Parser)](#4-universal-statement-import-ai-semantic-parser)
   - [4.1 Supported File Formats](#41-supported-file-formats)
   - [4.2 How Semantic Parsing Works](#42-how-semantic-parsing-works)
   - [4.3 On-Device PII Scrubbing](#43-on-device-pii-scrubbing)
5. [Exploring the Dashboards](#5-exploring-the-dashboards)
   - [5.1 Financial Overview & KPIs](#51-financial-overview--kpis)
   - [5.2 Cashflow & Multi-Category Breakdown](#52-cashflow--multi-category-breakdown)
   - [5.3 Monthly Trends & Historical Run-Rates](#53-monthly-trends--historical-run-rates)
   - [5.4 Amazon & E-Commerce Expenditure](#54-amazon--e-commerce-expenditure)
   - [5.5 Salary & Tax Retention Breakdown](#55-salary--tax-retention-breakdown)
6. [Interactive AI Financial Advisor (Ask AI)](#6-interactive-ai-financial-advisor-ask-ai)
7. [Data Portability, Backups & Lock Security](#7-data-portability-backups--lock-security)
8. [Installing as a Mobile PWA](#8-installing-as-a-mobile-pwa)
9. [Frequently Asked Questions (FAQ)](#9-frequently-asked-questions-faq)

---

## 1. Introduction & Privacy Guarantee

Traditional personal finance apps require you to share your online banking credentials with cloud aggregators, exposing your full financial history to remote databases and third-party tracking.

**MeineFinanceGuru operates on a strict Zero-Knowledge, Local-First principle:**
- **No Database:** We do not operate a user database.
- **Client-Side AES-256-GCM:** Decryption happens exclusively in your device's memory (RAM) via the Web Crypto API.
- **Client-Side Sanitization:** Your name, IBAN, phone number, and physical street address are stripped out directly on your device before any AI analysis.

---

## 2. Getting Started & Vault Modes

When you first open MeineFinanceGuru, you are greeted by the **Private Vault Screen**. You have four ways to begin:

### 2.1 Decrypting with Master PIN
If you are running the default repository build:
- Enter the default demo PIN: `123456`
- Click **"Decrypt Vault"**. The in-memory decryptor derives your key using PBKDF2 (100,000 rounds) and unlocks the dashboard.

### 2.2 1-Click Demo Mode
Want to explore all charts, graphs, and features immediately without entering a password?
- Click the **"Load Demo Data (1-Click)"** button.
- Instantly hydrates the app with realistic, anonymized sample data showing cashflow distributions, liabilities, and monthly trends.

### 2.3 Importing a JSON Backup
If you previously exported a backup from MeineFinanceGuru or created your own financial data file:
- Click **"Import JSON Backup"**.
- Select your `.json` file. The app validates the schema and unlocks your dashboard immediately.

### 2.4 Starting Fresh with an Empty Vault
Want to start clean with your own real finances?
- Click **"Start with Empty Vault"**.
- All metrics initialize to `0.00 €`. You can now navigate to **AI Sync** to drop your bank statements.

---

## 3. BYOK (Bring Your Own Key) Setup

MeineFinanceGuru uses Google Gemini AI for semantic statement parsing and financial advisory. To ensure complete privacy and zero monthly subscription costs, you bring your own API key.

### 3.1 Getting a Free Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **"Create API Key"**.
4. Copy the generated key (starts with `AIzaSy...`).

### 3.2 Activating BYOK in Settings
1. Open the app and navigate to **Settings** (gear icon).
2. In the **"BYOK: Google Gemini API Key"** card, paste your key.
3. Your key is stored securely in your browser's private `localStorage`. It is never uploaded to any central server.

---

## 4. Universal Statement Import (AI Semantic Parser)

The **AI Document Sync** tab allows you to import records from any bank in the world without creating manual spreadsheet templates.

### 4.1 Supported File Formats
- **PDF Statements:** Official bank statement exports (e.g., Deutsche Bank, Sparkasse, N26, Revolut, Garanti, Chase).
- **CSV & TSV:** Table exports with comma, semicolon, or tab separators.
- **TXT:** Plain-text transaction receipts or email transaction notices.
- **JSON:** Native MeineFinanceGuru backups or structured exports.

### 4.2 How Semantic Parsing Works
Unlike rigid budgeting tools that fail when bank column headers change, our AI understands language semantics:
- **Global Dates:** Normalizes `01.06.2026`, `2026-06-01`, and `06/01/2026` to standard ISO format.
- **Localized Numbers:** Automatically handles European comma decimals (`1.250,50 €`) and US dot decimals (`$1,250.50`).
- **Credit vs. Debit Indicators:** Understands German (*Gutschrift/Lastschrift*, *Haben/Soll*), English (*Credit/Debit*, *Inflow/Outflow*), and Turkish (*Alacak/Borç*, *Gelen/Giden*).
- **Auto-Categorization:** Maps transactions automatically into standard buckets (`Housing & Rent`, `Groceries`, `Utilities & Bills`, `Transportation`, `Healthcare`, `Discretionary`, `Debt Repayment`, `Income`).
- **Delta Sync:** Checks existing transactions to ensure no duplicate records are added.

### 4.3 On-Device PII Scrubbing
Before any statement text is sent to the Gemini AI API, the client-side scrubber automatically redacts:
- IBANs and Account Numbers: Replaced with `[REDACTED_IBAN]`
- BIC / SWIFT codes: Replaced with `[BIC_REDACTED]`
- Phone numbers: Replaced with `[PHONE_REDACTED]`
- Email addresses: Replaced with `[EMAIL_REDACTED]`
- Postal Codes & Street Addresses: Replaced with `[ZIP_CITY_REDACTED]`

---

## 5. Exploring the Dashboards

### 5.1 Financial Overview & KPIs
- **Net Income:** Your average monthly take-home earnings.
- **Free Cashflow:** Your true unallocated monthly buffer after all living costs, loan installments, and discretionary spending.
- **Total Debt & Liabilities:** Real-time balance of active loans, overdrafts, and payment plans. Click any card to view detailed category breakdowns in a modal.

### 5.2 Cashflow & Multi-Category Breakdown
- An interactive donut chart displaying proportional expenditure across all essential and non-essential categories.
- Hover or tap any slice on mobile to see exact Euro amounts and percentage shares contained safely within screen boundaries.

### 5.3 Monthly Trends & Historical Run-Rates
- Multi-year bar and line comparisons showing monthly income against total expenses.
- Identifies seasonal spikes, bonus months, and high-expenditure periods.

### 5.4 Amazon & E-Commerce Expenditure
- Dedicated tracking for online shopping orders, lifetime gross spending, and return/refund deductions.
- Inspect item-by-item purchases for any chosen year.

### 5.5 Salary & Tax Retention Breakdown
- Gross vs. Net salary comparisons.
- Social security, health insurance, and tax retention rates.

---

## 6. Interactive AI Financial Advisor (Ask AI)

Navigate to **Ask AI** to have natural conversations about your finances:
- *"What were my top 3 grocery expenses last quarter?"*
- *"If I pay an extra €200/month toward my personal loan, when will I be debt-free?"*
- *"Welche Abonnements kosten mich am meisten Geld?"* (German)
- *"Aylık nakit akışımı nasıl optimize edebilirim?"* (Turkish)

The AI responds strictly in the language you ask, grounded only in your anonymized financial records.

---

## 7. Data Portability, Backups & Lock Security

- **Exporting a Backup:** Go to **Settings** ➡️ click **"Download Backup"** to save your complete financial state as a JSON file.
- **Restoring a Backup:** Go to **Settings** ➡️ click **"Import Backup"** to restore your data on any device or browser.
- **Locking Your Vault:** Click **"Lock Vault"** in the sidebar or mobile menu at any time. This immediately wipes all decrypted financial state from browser RAM.

---

## 8. Installing as a Mobile PWA

MeineFinanceGuru is built as an offline-first Progressive Web App (PWA):

### iOS (iPhone & iPad)
1. Open the website in **Safari**.
2. Tap the **Share** button (box with an arrow pointing up).
3. Scroll down and tap **"Add to Home Screen"**.
4. The app installs as a full-screen, standalone native app with gesture-friendly navigation.

### Android
1. Open the website in **Chrome**.
2. Tap the three dots menu in the top-right corner.
3. Tap **"Install app"** or **"Add to Home screen"**.

---

## 9. Frequently Asked Questions (FAQ)

#### Q: Where is my data hosted?
**A:** Nowhere! Your data is never saved on a remote server database. It exists encrypted on your device and inside your own exported backup files.

#### Q: What if I lose my Master PIN?
**A:** Because MeineFinanceGuru utilizes zero-knowledge AES-256-GCM encryption, there is no "Forgot Password" backdoor. Always keep an unencrypted JSON backup in a secure offline storage location (e.g., password manager or encrypted drive).

#### Q: Is the Google Gemini API free?
**A:** Yes! Google provides a generous free tier for Google AI Studio API keys, more than sufficient for personal monthly statement parsing and financial chats.

#### Q: How do I switch languages?
**A:** Tap **DE**, **EN**, or **TR** at the top-right of the lock screen, the mobile header, or in the **Settings** menu.
