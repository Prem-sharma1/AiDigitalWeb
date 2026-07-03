/**
 * Central input validation utility functions for email, phone, and other formats.
 */

/**
 * Validates if an email contains a '@' sign, valid prefix, and a domain name.
 * Format: user@domain.tld
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  // Standard robust email regex requiring domain format and @ sign
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed);
}

/**
 * Validates Indian Mobile Numbers (10 digits starting with 6, 7, 8, or 9).
 * Automatically handles standard prefixes like country code (+91 or 91) or a leading zero.
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidMobileNumber(phone) {
  if (!phone || typeof phone !== "string") return false;
  // Strip out all non-digit characters
  const digits = phone.replace(/\D/g, "");
  
  // Standard Indian formatting adjustments:
  // If it starts with country code 91 and has 12 digits, check core 10 digits
  if (digits.startsWith("91") && digits.length === 12) {
    return /^[6-9]\d{9}$/.test(digits.substring(2));
  }
  // If it starts with 0 (trunk prefix) and has 11 digits, check core 10 digits
  if (digits.startsWith("0") && digits.length === 11) {
    return /^[6-9]\d{9}$/.test(digits.substring(1));
  }
  
  // Strict Indian 10-digit mobile pattern starting with 6, 7, 8, or 9
  return /^[6-9]\d{9}$/.test(digits);
}

/**
 * Validates a name (must be at least 2 characters, alphabetic characters and spaces/hyphens).
 * @param {string} name
 * @returns {boolean}
 */
export function isValidName(name) {
  if (!name || typeof name !== "string") return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && /^[a-zA-Z\s]+$/.test(trimmed);
}

/**
 * Validates Indian Pin Code (exactly 6 digits).
 * @param {string} pin
 * @returns {boolean}
 */
export function isValidPinCode(pin) {
  if (!pin || typeof pin !== "string") return false;
  const digits = pin.replace(/\D/g, "");
  return digits.length === 6;
}

/**
 * Validates Indian GSTIN (exactly 15 alphanumeric characters).
 * Format: 22AAAAA1111A1Z5
 * @param {string} gstin
 * @returns {boolean}
 */
export function isValidGstin(gstin) {
  if (!gstin || typeof gstin !== "string") return false;
  const trimmed = gstin.trim().toUpperCase();
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(trimmed);
}
