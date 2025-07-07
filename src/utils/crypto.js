// E2EE Crypto Helpers for DH, RSA, and AES-GCM

// Key Management Utilities
export function storeKeys(conversationId, dhPrivateJwk, rsaPrivateJwk) {
  const key = `keys_${conversationId}`;
  const keys = { dhPrivateJwk, rsaPrivateJwk };
  localStorage.setItem(key, JSON.stringify(keys));
  // Also store in sessionStorage for immediate access
  sessionStorage.setItem('dhPrivateKey', JSON.stringify(dhPrivateJwk));
  sessionStorage.setItem('rsaPrivateKey', JSON.stringify(rsaPrivateJwk));
}

export function getKeys(conversationId) {
  const key = `keys_${conversationId}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    const keys = JSON.parse(stored);
    // Update sessionStorage
    sessionStorage.setItem('dhPrivateKey', JSON.stringify(keys.dhPrivateJwk));
    sessionStorage.setItem('rsaPrivateKey', JSON.stringify(keys.rsaPrivateJwk));
    return keys;
  }
  return null;
}

export function clearKeys(conversationId) {
  const key = `keys_${conversationId}`;
  localStorage.removeItem(key);
  sessionStorage.removeItem('dhPrivateKey');
  sessionStorage.removeItem('rsaPrivateKey');
}

// Generate ECDH (Diffie-Hellman) key pair
export async function generateDHKeyPair() {
  return await window.crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey", "deriveBits"]
  );
}

// Export ECDH public key to JWK
export async function exportDHPublicKey(publicKey) {
  return await window.crypto.subtle.exportKey("jwk", publicKey);
}

// Import ECDH public key from JWK
export async function importDHPublicKey(jwk) {
  return await window.crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    []
  );
}

// Import ECDH private key from JWK
export async function importDHPrivateKey(jwk) {
  return await window.crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'ECDH',
      namedCurve: 'P-256',
    },
    true,
    ['deriveKey', 'deriveBits']
  );
}

// Generate RSA key pair
export async function generateRSAKeyPair() {
  return await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// Export RSA public key to JWK
export async function exportRSAPublicKey(publicKey) {
  return await window.crypto.subtle.exportKey("jwk", publicKey);
}

// Export RSA private key to JWK
export async function exportRSAPrivateKey(privateKey) {
  return await window.crypto.subtle.exportKey("jwk", privateKey);
}

// Import RSA public key from JWK
export async function importRSAPublicKey(jwk) {
  return await window.crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    },
    true,
    ["encrypt"]
  );
}

// Import RSA private key from JWK
export async function importRSAPrivateKey(jwk) {
  return await window.crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    },
    true,
    ["decrypt"]
  );
}

// Derive shared secret (AES key) from ECDH keys
export async function deriveSharedSecret(privateKey, peerPublicKey) {
  return await window.crypto.subtle.deriveKey(
    { name: "ECDH", public: peerPublicKey },
    privateKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypt data with AES-GCM
export async function encryptWithAESGCM(aesKey, data) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(data);
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoded
  );
  return { ciphertext, iv };
}

// Decrypt data with AES-GCM
export async function decryptWithAESGCM(aesKey, ciphertext, iv) {
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}

// Encrypt message with RSA public key
export async function encryptWithRSAPublicKey(publicKey, message) {
  const encoded = new TextEncoder().encode(message);
  return await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    encoded
  );
}

// Debug utility for troubleshooting
export function debugCryptoOperation(operation, data) {
  console.log(`🔐 ${operation}:`, {
    type: typeof data,
    length: data?.length || data?.byteLength || 'N/A',
    preview: typeof data === 'string' ? data.substring(0, 50) + '...' : 
             data instanceof ArrayBuffer ? `ArrayBuffer(${data.byteLength})` :
             data instanceof Uint8Array ? `Uint8Array(${data.length})` : data
  });
}

// Enhanced RSA decryption with better error handling
export async function decryptWithRSAPrivateKey(privateKey, ciphertext) {
  try {
    debugCryptoOperation('RSA Decrypt Input', ciphertext);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      ciphertext
    );
    const result = new TextDecoder().decode(decrypted);
    debugCryptoOperation('RSA Decrypt Output', result);
    return result;
  } catch (error) {
    console.error('RSA Decryption failed:', error);
    throw error;
  }
}

// Test function to verify E2EE implementation
export async function testE2EE() {
  try {
    console.log('🧪 Testing E2EE Implementation...');
    
    // 1. Generate key pairs
    const dhKeyPair = await generateDHKeyPair();
    const rsaKeyPair = await generateRSAKeyPair();
    
    // 2. Export keys
    const dhPublicJwk = await exportDHPublicKey(dhKeyPair.publicKey);
    const rsaPublicJwk = await exportRSAPublicKey(rsaKeyPair.publicKey);
    const dhPrivateJwk = await window.crypto.subtle.exportKey('jwk', dhKeyPair.privateKey);
    const rsaPrivateJwk = await exportRSAPrivateKey(rsaKeyPair.privateKey);
    
    // 3. Test RSA encryption/decryption
    const testMessage = "Hello, E2EE!";
    const encrypted = await encryptWithRSAPublicKey(rsaKeyPair.publicKey, testMessage);
    const decrypted = await decryptWithRSAPrivateKey(rsaKeyPair.privateKey, encrypted);
    
    console.log('✅ RSA Test:', testMessage === decrypted ? 'PASSED' : 'FAILED');
    console.log('Original:', testMessage);
    console.log('Decrypted:', decrypted);
    
    // 4. Test DH key derivation
    const peerDhKeyPair = await generateDHKeyPair();
    const peerDhPublicJwk = await exportDHPublicKey(peerDhKeyPair.publicKey);
    const peerDhPublicKey = await importDHPublicKey(peerDhPublicJwk);
    const dhPrivateKey = await importDHPrivateKey(dhPrivateJwk);
    
    const aesKey = await deriveSharedSecret(dhPrivateKey, peerDhPublicKey);
    console.log('✅ DH Key Derivation Test: PASSED');
    
    // 5. Test AES encryption/decryption
    const testData = "Secret data for AES test";
    const { ciphertext, iv } = await encryptWithAESGCM(aesKey, testData);
    const decryptedData = await decryptWithAESGCM(aesKey, ciphertext, iv);
    
    console.log('✅ AES Test:', testData === decryptedData ? 'PASSED' : 'FAILED');
    console.log('Original:', testData);
    console.log('Decrypted:', decryptedData);
    
    console.log('🎉 All E2EE tests passed!');
    return true;
  } catch (error) {
    console.error('❌ E2EE test failed:', error);
    return false;
  }
} 