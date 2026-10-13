import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse, NextRequest } from 'next/server';
import { FinancialDataSchema } from '@/types/schema';
import { checkRateLimit } from '@/utils/rateLimiter';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

function extractJSON(text: string): string {
  // Try markdown-wrapped JSON first
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenced) return fenced[1].trim();
  // Fallback: find first { to last }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);
  return text;
}

export async function POST(req: NextRequest) {
  if (!genAI) {
    return NextResponse.json({ error: 'Gemini API Key is not configured on the server.' }, { status: 500 });
  }

  const ip = req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  
  if (!checkRateLimit(ip, "sync")) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  // Security: Server-side Authorization Check
  const authHeader = req.headers.get("Authorization");
  const apiSecret = process.env.API_SECRET;
  if (apiSecret && authHeader !== `Bearer ${apiSecret}`) {
    return NextResponse.json({ error: "Unauthorized request." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { text, currentData } = body;

    if (!text || text.length > 400000) {
      return NextResponse.json({ error: 'Invalid or excessively large text payload.' }, { status: 400 });
    }

    const systemInstruction = `You are a strict data extraction AI.
You are given a raw text string of bank transactions (often German) and the user's CURRENT JSON state.
Your job is to identify NEW transactions in the text that are NOT in the current state, and return a JSON object with the DELTA.
The structure MUST match the FinancialDataSchema exactly. Do not overwrite arrays, only provide the new items or updated fields to merge.
Return ONLY valid JSON. No markdown, no explanations, no preamble.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction,
    });

    const prompt = `CURRENT STATE:
${JSON.stringify(currentData)}

NEW TEXT:
${text}

Please return the JSON object representing the new data to be merged.`;

    const result = await model.generateContent(prompt);
    let aiResponse = result.response.text();
    
    aiResponse = extractJSON(aiResponse);
    
    let parsed: any;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (e) {
      return NextResponse.json({ error: 'AI returned invalid JSON format.' }, { status: 502 });
    }

    // Validate with Zod
    const validation = FinancialDataSchema.safeParse(parsed);
    if (!validation.success) {
      return NextResponse.json({ error: 'AI returned data that failed schema validation.' }, { status: 502 });
    }

    return NextResponse.json({ data: validation.data });
  } catch (err: any) {
    // Suppressed log
    return NextResponse.json({ error: err.message || 'An error occurred during AI processing.' }, { status: 500 });
  }
}
