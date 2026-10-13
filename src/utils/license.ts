export interface LicenseStatus {
  isPro: boolean;
  tier?: 'admin' | 'pro' | 'free';
  token?: string;
  features?: string[];
}

const STORAGE_KEY = 'mfg_pro_license';

export function getCachedLicense(): LicenseStatus {
  if (typeof window === 'undefined') return { isPro: false, tier: 'free' };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { isPro: false, tier: 'free' };
    const parsed = JSON.parse(raw);
    return parsed.isPro ? parsed : { isPro: false, tier: 'free' };
  } catch {
    return { isPro: false, tier: 'free' };
  }
}

export async function verifyLicenseKey(key: string): Promise<LicenseStatus> {
  try {
    const res = await fetch('/api/license/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: key.trim() })
    });

    const data = await res.json();
    if (res.ok && data.valid) {
      const status: LicenseStatus = {
        isPro: true,
        tier: data.tier,
        token: data.token,
        features: data.features
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
      }
      return status;
    }
    return { isPro: false, tier: 'free' };
  } catch {
    return { isPro: false, tier: 'free' };
  }
}

export function clearLicense() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
