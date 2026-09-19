#!/usr/bin/env node

/**
 * Aeethod Studio — Admin Password Hash Generator
 * 
 * Usage:
 *   node scripts/generate-hash.js "YourSecurePassword"
 */

import { hashPassword, verifyPassword } from '../lib/auth.js';
import crypto from 'node:crypto';

const password = process.argv[2];

if (!password) {
  console.error('\n❌ Please provide a password to hash.');
  console.error('Usage: node scripts/generate-hash.js "YourSecurePassword"\n');
  process.exit(1);
}

const hash = hashPassword(password);
const isValid = verifyPassword(password, hash);
const generatedSecret = crypto.randomBytes(32).toString('hex');

console.log('\n======================================================');
console.log('       AEETHOD STUDIO ADMIN CREDENTIAL GENERATOR      ');
console.log('======================================================\n');
console.log('Password provided:    ', password);
console.log('Generated Hash:       ', hash);
console.log('Verification test:    ', isValid ? 'PASSED ✅' : 'FAILED ❌');
console.log('\n------------------------------------------------------');
console.log('Add the following to your .env.local file:');
console.log('------------------------------------------------------\n');
console.log(`AEETHOD_ADMIN_EMAIL=studio@aeethod.com`);
console.log(`AEETHOD_ADMIN_PASSWORD_HASH=${hash}`);
console.log(`AEETHOD_AUTH_SECRET=${generatedSecret}`);
console.log('\n======================================================\n');
