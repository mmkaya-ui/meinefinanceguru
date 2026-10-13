import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse, NextRequest } from 'next/server';
import { checkRateLimit } from '@/utils/rateLimiter';

function extractJSON(text: string): string {
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenced) return fenced[1].trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);
  return text;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  
  if (!checkRateLimit(ip, "sync")) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  // BYOK (Bring Your Own Key) Support
  const authHeader = req.headers.get("Authorization");
  const bearerKey = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "").trim() : null;
  const apiKey = bearerKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ 
      error: 'Gemini API Key missing. Please provide your API key in Settings (BYOK) or configure GEMINI_API_KEY in the environment.' 
    }, { status: 401 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const body = await req.json();
    const { text, currentData, lang = 'en' } = body;

    if (!text || text.length > 500000) {
      return NextResponse.json({ error: 'Invalid or excessively large text payload.' }, { status: 400 });
    }

    const systemInstruction = `You are a Universal Financial Semantic Parser AI.
Your purpose is to parse financial records from ANY bank, country, format, or language (including German, English, Turkish, French, Spanish) and integrate them into the user's financial dashboard.

CORE CAPABILITIES:
1. SEMANTIC FORMAT RECOGNITION:
   - Identify transaction dates across global formats (e.g., DD.MM.YYYY, YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY). Normalize all dates to standard "YYYY-MM-DD".
   - Identify transaction amounts, resolving localized decimal commas vs dots (e.g., German "1.250,50 €" -> 1250.50, Turkish "1.250,50 TL" -> 1250.50, US "$1,250.50" -> 1250.50).
   - Discern credits/inflows (+) vs debits/outflows (-).
     - German: Haben / Gutschrift / Eingang / Zinsgutschrift (+) vs. Soll / Lastschrift / Kartenzahlung / Überweisung (-)
     - English: Credit / Inflow / Deposit / Refund (+) vs. Debit / Outflow / Charge / Withdrawal (-)
     - Turkish: Alacak / Gelen Havale / EFT / Maaş / İade (+) vs. Borç / Giden / Harcama / POS / Çekim (-)

2. SEMANTIC CATEGORIZATION:
   Categorize transactions into standardized categories:
   - "Housing & Rent" (Rent, mortgage, Hausgeld, Miete, Kira)
   - "Groceries" (Supermarkets, food stores, Rewe, Edeka, Aldi, Lidl, Migros, Carrefour, Trader Joe's, Netto)
   - "Utilities & Bills" (Electricity, water, gas, internet, telecom, Stadtwerke, Vodafone, Telekom)
   - "Transportation" (Fuel, transit, tickets, Bahn, Tankstelle, Uber, BVG, Akbil)
   - "Healthcare" (Pharmacies, doctors, Apotheke, health insurance)
   - "Discretionary" (Shopping, restaurants, entertainment, Amazon, cafes, subscriptions)
   - "Debt Repayment" (Loan installments, credit card settlements, Tilgung, Raten)
   - "Income" (Salary, wages, bonuses, Gehalt, Lohn, dividends)

3. DATA HYDRATION & RECALCULATION:
   Extract all valid transactions. Compare with currentData.transactions_data to avoid duplicates.
   Merge new transactions into transactions_data (sorted by date descending).
   Recalculate or update:
   - monthly_data: Array of { month: "YYYY-MM", income: number, expenses: { [category]: number }, net: number }
   - data.kpis: { netIncome: number, freeCashflow: number, totalExpenses: number, totalDebt: number, targetBudget: number }

Output format: Return ONLY raw valid JSON representing the updated or merged data. No markdown fences, no conversational text.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction,
    });

    const prompt = `CURRENT STATE:
${JSON.stringify(currentData || {})}

INPUT TEXT TO PARSE:
${text}

PREFERRED LANGUAGE: ${lang}

Please parse the input, extract all new transactions, and return the complete updated financial data state as JSON.`;

    const result = await model.generateContent(prompt);
    let aiResponse = result.response.text();
    aiResponse = extractJSON(aiResponse);

    let parsed: any;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (e) {
      return NextResponse.json({ error: 'AI returned invalid JSON format.' }, { status: 502 });
    }

    return NextResponse.json({ data: parsed });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'An error occurred during AI processing.' }, { status: 500 });
  }
}
