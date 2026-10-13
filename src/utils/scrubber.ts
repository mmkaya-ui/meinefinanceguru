export function scrubPII(text: string): string {
  let scrubbed = text;
  
  // Deep scrub IBANs (handles both spaced and contiguous variants across EU standard lengths)
  scrubbed = scrubbed.replace(/[A-Z]{2}\d{2}[A-Z0-9\s]{11,30}/gi, '[REDACTED_IBAN]');
  
  // BIC/SWIFT (usually prefixed by BIC or SWIFT)
  scrubbed = scrubbed.replace(/(?:BIC|SWIFT)[\s:]+[A-Z0-9]{8,11}/gi, 'BIC: [BIC_REDACTED]');

  // Phone numbers (international and local)
  scrubbed = scrubbed.replace(/(?:\+?\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/g, '[REDACTED_PHONE]');

  // Names (Removed: Was too aggressive and ruined valid transaction descriptions)
  // scrubbed = scrubbed.replace(/\\b([A-Z][a-zäöüß]+(?:\\s[A-Z][a-zäöüß]+){1,3})\\b/g, '[REDACTED_NAME]');

  // Addresses (rough heuristic for German addresses: 5-digit zip + City (which may have spaces or hyphens))
  scrubbed = scrubbed.replace(/\b\d{5}\s+[A-ZÄÖÜ][a-zäöüßA-ZÄÖÜ\s\-]+\b/g, '[ZIP_CITY_REDACTED]');
  
  // Phone numbers (More robust for international)
  scrubbed = scrubbed.replace(/(?:\+|00)[1-9][0-9\s\-\/]{7,18}\b|\b0[1-9][0-9\s\-\/]{7,18}\b/g, '[PHONE_REDACTED]');
  
  // Email addresses (fixed the typo in the TLD regex)
  scrubbed = scrubbed.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[EMAIL_REDACTED]');

  return scrubbed;
}
