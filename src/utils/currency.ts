const ECB_API_BASE = 'https://data-api.ecb.europa.eu/service/data/EXR/D.';

/**
 * Fetches the historical exchange rate from the ECB API.
 * The ECB rate is quoted as 1 EUR = X Foreign Currency.
 * @param currency The target currency, e.g., 'USD' or 'TRY'
 * @param date A date string (YYYY-MM-DD)
 * @returns The exchange rate (1 EUR = X currency), or a fallback rate if API fails.
 */
export async function getHistoricalRate(currency: 'USD' | 'TRY', date: string): Promise<number> {
  if (!isValidDate(date)) {
    return getFallbackRate(currency);
  }

  try {
    // We request the rate for the specific day up to a few days ago (to account for weekends/holidays)
    // The ECB API allows fetching a range. We'll fetch the last 7 days leading up to the date.
    const endDate = date;
    const d = new Date(date + "T12:00:00Z"); // Set to midday UTC to avoid boundary issues
    d.setUTCDate(d.getUTCDate() - 7);
    const startDate = d.toISOString().split('T')[0];
    
    // EXR/D.[CURRENCY].EUR.SP00.A
    const url = `${ECB_API_BASE}${currency}.EUR.SP00.A?startPeriod=${startDate}&endPeriod=${endDate}&detail=dataonly&format=jsondata`;
    
    const response = await fetch(url);
    if (!response.ok) {
      // Suppressed log
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // The ECB jsondata format structure:
    // data.dataSets[0].series["0:0:0:0:0"].observations["0"] -> [rate]
    // The observations are keyed by index. We want the last available observation (latest in the requested period).
    const series = Object.values(data?.dataSets?.[0]?.series || {})[0] as any;
    const observations = series?.observations;
    
    if (!observations) {
      return getFallbackRate(currency);
    }
    
    const keys = Object.keys(observations);
    if (keys.length === 0) {
      return getFallbackRate(currency);
    }
    
    // The highest index corresponds to the latest date in the range (which is closest to our target date)
    const lastKey = keys[keys.length - 1];
    const rate = observations[lastKey][0];
    
    return rate;
  } catch (error) {
    // Suppressed log
    throw new Error(`Failed to fetch rate: ${error}`);
  }
}

export function formatCurrency(value: number, currency: string = 'EUR'): string {
  // Fix floating point issues by applying EPSILON rounding before fixing
  const safeValue = Math.round((value + Number.EPSILON) * 100) / 100;
  
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeValue);
}

export function parseAmount(amountStr: string | number): number {
  if (typeof amountStr === 'number') return amountStr;
  if (!amountStr) return 0;
  
  // Handle European number formats (e.g., 1.234,56 -> 1234.56)
  const cleanStr = amountStr.toString().replace(/[^\d.,-]/g, '');
  if (cleanStr.includes(',') && cleanStr.includes('.')) {
    // Has both, usually means thousand separator is dot and decimal is comma
    return parseFloat(cleanStr.replace(/\./g, '').replace(',', '.'));
  } else if (cleanStr.includes(',')) {
    // Only comma, could be decimal
    return parseFloat(cleanStr.replace(',', '.'));
  }
  
  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? 0 : parsed;
}

export function isValidDate(dateString: string): boolean {
  if (!dateString) return false;
  const d = new Date(dateString);
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * Converts an amount from a foreign currency to EUR using the given rate.
 * @param amount The amount in foreign currency
 * @param rate The rate where 1 EUR = X foreign currency
 */
export function convertToEUR(amount: number, rate: number): number {
  if (!rate || rate <= 0) {
    throw new Error(`Invalid exchange rate: ${rate}`);
  }
  // Use Number.EPSILON to fix IEEE 754 precision issues (e.g., 1.005 * 100)
  return Math.round((amount / rate + Number.EPSILON) * 100) / 100;
}

// Simple fallback rates roughly around 2024 if API fails
function getFallbackRate(currency: 'USD' | 'TRY'): number {
  if (currency === 'USD') return 1.08;
  if (currency === 'TRY') return 34.5;
  return 1;
}
