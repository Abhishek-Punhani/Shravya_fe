// Polyfill for window.crypto in Jest/Node
const { Crypto } = require('@peculiar/webcrypto');
global.crypto = new Crypto();
global.window = { crypto: global.crypto };

// Polyfill for TextEncoder/TextDecoder in Node.js
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import * as cryptoUtils from './crypto';

describe('E2EE Crypto Utilities', () => {
  it('generates and imports DH key pairs', async () => {
    const keyPair = await cryptoUtils.generateDHKeyPair();
    expect(keyPair).toHaveProperty('publicKey');
    expect(keyPair).toHaveProperty('privateKey');
    const jwk = await cryptoUtils.exportDHPublicKey(keyPair.publicKey);
    const imported = await cryptoUtils.importDHPublicKey(jwk);
    expect(imported.type).toBe('public');
  });

  it('generates and imports RSA key pairs', async () => {
    const keyPair = await cryptoUtils.generateRSAKeyPair();
    expect(keyPair).toHaveProperty('publicKey');
    expect(keyPair).toHaveProperty('privateKey');
    const pubJwk = await cryptoUtils.exportRSAPublicKey(keyPair.publicKey);
    const privJwk = await cryptoUtils.exportRSAPrivateKey(keyPair.privateKey);
    const importedPub = await cryptoUtils.importRSAPublicKey(pubJwk);
    const importedPriv = await cryptoUtils.importRSAPrivateKey(privJwk);
    expect(importedPub.type).toBe('public');
    expect(importedPriv.type).toBe('private');
  });

  it('derives a shared secret and encrypts/decrypts with AES-GCM', async () => {
    const alice = await cryptoUtils.generateDHKeyPair();
    const bob = await cryptoUtils.generateDHKeyPair();
    const alicePubJwk = await cryptoUtils.exportDHPublicKey(alice.publicKey);
    const bobPubJwk = await cryptoUtils.exportDHPublicKey(bob.publicKey);
    const alicePrivJwk = await window.crypto.subtle.exportKey('jwk', alice.privateKey);
    const bobPrivJwk = await window.crypto.subtle.exportKey('jwk', bob.privateKey);

    const alicePriv = await cryptoUtils.importDHPrivateKey(alicePrivJwk);
    const bobPriv = await cryptoUtils.importDHPrivateKey(bobPrivJwk);
    const alicePub = await cryptoUtils.importDHPublicKey(alicePubJwk);
    const bobPub = await cryptoUtils.importDHPublicKey(bobPubJwk);

    const aliceSecret = await cryptoUtils.deriveSharedSecret(alicePriv, bobPub);
    const bobSecret = await cryptoUtils.deriveSharedSecret(bobPriv, alicePub);

    const message = 'Secret message!';
    const { ciphertext, iv } = await cryptoUtils.encryptWithAESGCM(aliceSecret, message);
    const decrypted = await cryptoUtils.decryptWithAESGCM(bobSecret, ciphertext, iv);
    expect(decrypted).toBe(message);
  });

  it('encrypts and decrypts with RSA-OAEP', async () => {
    const { publicKey, privateKey } = await cryptoUtils.generateRSAKeyPair();
    const message = 'RSA secret!';
    const encrypted = await cryptoUtils.encryptWithRSAPublicKey(publicKey, message);
    const decrypted = await cryptoUtils.decryptWithRSAPrivateKey(privateKey, encrypted);
    expect(decrypted).toBe(message);
  });

  it('stores and retrieves keys correctly', () => {
    const conversationId = 'test_convo';
    const dhPrivateJwk = { kty: 'EC', crv: 'P-256', d: 'abc' };
    const rsaPrivateJwk = { kty: 'RSA', n: 'xyz' };
    cryptoUtils.storeKeys(conversationId, dhPrivateJwk, rsaPrivateJwk);
    const keys = cryptoUtils.getKeys(conversationId);
    expect(keys.dhPrivateJwk).toEqual(dhPrivateJwk);
    expect(keys.rsaPrivateJwk).toEqual(rsaPrivateJwk);
    cryptoUtils.clearKeys(conversationId);
    expect(cryptoUtils.getKeys(conversationId)).toBeNull();
  });
}); 