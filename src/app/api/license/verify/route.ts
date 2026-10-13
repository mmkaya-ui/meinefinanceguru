import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key } = body;

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ valid: false, error: 'Key is required' }, { status: 400 });
    }

    const trimmedKey = key.trim();
    const adminKey = process.env.ADMIN_LICENSE_KEY;

    // 1. Verify against Vercel / server-side Environment Variable
    if (adminKey && trimmedKey === adminKey) {
      // Generate a signed session token
      const token = crypto
        .createHmac('sha256', adminKey)
        .update(`pro_granted_${new Date().toISOString().slice(0, 7)}`)
        .digest('hex');

      return NextResponse.json({
        valid: true,
        tier: 'admin',
        token,
        features: ['tax_optimizer', 'contract_cancellation', 'executive_dossier', 'unlimited_ai']
      });
    }

    // 2. Algorithmic Pro License Format check: MFG-PRO-XXXX-XXXX
    // Allows generating valid client licenses without a database
    if (trimmedKey.startsWith('MFG-PRO-')) {
      const parts = trimmedKey.split('-');
      if (parts.length === 4 && parts[2].length === 4 && parts[3].length === 4) {
        return NextResponse.json({
          valid: true,
          tier: 'pro',
          features: ['tax_optimizer', 'contract_cancellation', 'executive_dossier']
        });
      }
    }

    return NextResponse.json({ valid: false, error: 'Invalid license or admin key' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 });
  }
}
