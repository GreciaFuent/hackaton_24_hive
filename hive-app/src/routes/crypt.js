import crypto from 'crypto';
import key from './key.js';
import { copyFileSync } from 'fs';

const algorithm = 'aes-256-cbc'; // Algoritmo de cifrado
const iv = crypto.randomBytes(16); // Vector de inicialización (16 bytes)

export function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex'),
  };
}

export function decrypt(encrypted) {
  const iv = Buffer.from(encrypted.iv, 'hex');
  const encryptedText = Buffer.from(encrypted.encryptedData, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}