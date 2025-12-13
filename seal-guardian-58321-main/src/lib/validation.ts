/**
 * Validation utilities for form inputs
 * Using regex patterns for Indian mobile numbers and email addresses
 */

// Indian mobile number: 10 digits, starts with 6, 7, 8, or 9
// Examples: 9876543210, 7890123456
export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

// Standard email regex pattern
// Matches: user@domain.com, user.name@domain.co.in, etc.
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Pincode regex: 6 digits
export const PINCODE_REGEX = /^\d{6}$/;

/**
 * Validate Indian mobile number
 * @param phone - Phone number string (with or without country code)
 * @returns true if valid, false otherwise
 */
export const validateIndianMobile = (phone: string): boolean => {
    // Remove any spaces, dashes, or country code prefix
    const cleaned = phone.replace(/[\s\-+]/g, '').replace(/^91/, '').replace(/^0/, '');
    return INDIAN_MOBILE_REGEX.test(cleaned);
};

/**
 * Validate email address
 * @param email - Email string
 * @returns true if valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email.trim());
};

/**
 * Validate Indian pincode
 * @param pincode - Pincode string
 * @returns true if valid, false otherwise
 */
export const validatePincode = (pincode: string): boolean => {
    return PINCODE_REGEX.test(pincode.trim());
};

/**
 * Format phone number for display (add spaces)
 * @param phone - Raw phone number
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 5) return cleaned;
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 10)}`;
};

/**
 * Clean phone number (remove non-digits and country code)
 * @param phone - Phone number to clean
 * @returns Cleaned 10-digit phone number
 */
export const cleanPhoneNumber = (phone: string): string => {
    return phone.replace(/\D/g, '').replace(/^91/, '').replace(/^0/, '').slice(0, 10);
};

/**
 * Get validation error message for phone number
 * @param phone - Phone number to validate
 * @returns Error message or empty string if valid
 */
export const getPhoneError = (phone: string): string => {
    if (!phone) return '';
    const cleaned = cleanPhoneNumber(phone);
    if (cleaned.length < 10) return 'Phone number must be 10 digits';
    if (!INDIAN_MOBILE_REGEX.test(cleaned)) return 'Invalid Indian mobile number (must start with 6-9)';
    return '';
};

/**
 * Get validation error message for email
 * @param email - Email to validate
 * @returns Error message or empty string if valid
 */
export const getEmailError = (email: string): string => {
    if (!email) return '';
    if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email address';
    return '';
};

/**
 * Get validation error message for pincode
 * @param pincode - Pincode to validate
 * @returns Error message or empty string if valid
 */
export const getPincodeError = (pincode: string): string => {
    if (!pincode) return '';
    if (!PINCODE_REGEX.test(pincode.trim())) return 'Pincode must be 6 digits';
    return '';
};
