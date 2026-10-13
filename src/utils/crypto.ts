export async function decryptPayload(password: string, payload: any) {
  const enc = new TextEncoder();
  const toUint8 = (b64: string) => Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const salt = toUint8(payload.salt);
  const iv = toUint8(payload.iv);
  const authTag = toUint8(payload.authTag);
  const ciphertext = toUint8(payload.ciphertext);

  const combinedCiphertext = new Uint8Array(ciphertext.length + authTag.length);
  combinedCiphertext.set(ciphertext);
  combinedCiphertext.set(authTag, ciphertext.length);

  const keyMaterial = await window.crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]);
  const key = await window.crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial, { name: "AES-GCM", length: 256 }, true, ["decrypt"]
  );

  const decryptedBuffer = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv, tagLength: 128 }, key, combinedCiphertext);
  const dec = new TextDecoder();
  return JSON.parse(dec.decode(decryptedBuffer));
}
