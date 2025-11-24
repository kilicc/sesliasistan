/**
 * Retell AI webhook signature verification utilities
 */

/**
 * Verify Retell AI webhook signature
 * Retell AI sends webhooks with a signature header that can be verified
 * 
 * @param payload - Raw request body as string
 * @param signature - Signature from Retell-AI-Signature header
 * @param publicKey - Retell AI public key (from environment)
 * @returns boolean - true if signature is valid
 */
export function verifyRetellSignature(
  payload: string,
  signature: string | null,
  publicKey: string | undefined
): boolean {
  // If no public key is configured, skip verification (development mode)
  if (!publicKey) {
    console.warn('[Retell] Public key not configured, skipping signature verification');
    return true; // Allow in development
  }

  if (!signature) {
    console.warn('[Retell] No signature provided in request');
    return false;
  }

  // Retell AI typically uses HMAC-SHA256 for webhook signatures
  // Implementation depends on Retell AI's specific signature format
  // This is a placeholder - adjust based on Retell AI documentation
  
  try {
    // TODO: Implement actual signature verification based on Retell AI docs
    // Example structure (adjust as needed):
    // const crypto = require('crypto');
    // const expectedSignature = crypto
    //   .createHmac('sha256', publicKey)
    //   .update(payload)
    //   .digest('hex');
    // return crypto.timingSafeEqual(
    //   Buffer.from(signature),
    //   Buffer.from(expectedSignature)
    // );
    
    console.log('[Retell] Signature verification placeholder - implement based on Retell AI docs');
    return true; // Placeholder - implement actual verification
  } catch (error) {
    console.error('[Retell] Signature verification error:', error);
    return false;
  }
}

/**
 * Extract Retell AI signature from request headers
 */
export function getRetellSignature(headers: Headers): string | null {
  // Retell AI typically sends signature in a custom header
  // Common header names: 'X-Retell-Signature', 'Retell-AI-Signature', etc.
  return (
    headers.get('x-retell-signature') ||
    headers.get('retell-ai-signature') ||
    headers.get('x-signature') ||
    null
  );
}

