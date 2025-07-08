import { z } from "zod";

/**
 * Helper function to check if a date is at least 18 years ago
 *
 * @param {Date} date - The date to check
 * @returns {boolean} True if the date is at least 18 years ago, false otherwise
 */
const isAtLeast18YearsAgo = (date: Date) => {
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  return date <= eighteenYearsAgo;
};

/**
 * French name regex (allows accents, hyphens, spaces)
 */
const nameRegex = /^[a-zA-ZÀ-ÿ\-\s']+$/;

/**
 * French postal code regex (5 digits)
 */
const postalCodeRegex = /^[0-9]{5}$/;

/**
 * Zod schema for user registration form validation
 *
 * @type {z.ZodObject}
 * @property {z.ZodString} firstName - User's first name (min 2 chars, French name format)
 * @property {z.ZodString} lastName - User's last name (min 2 chars, French name format)
 * @property {z.ZodString} email - User's email address
 * @property {z.ZodDate} birthDate - User's birth date (must be at least 18 years ago)
 * @property {z.ZodString} city - User's city (min 2 chars, French name format)
 * @property {z.ZodString} postalCode - User's postal code (5 digits)
 */
export const registrationSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must contain at least 2 characters")
    .regex(nameRegex, "First name contains invalid characters"),
  lastName: z
    .string()
    .min(2, "Last name must contain at least 2 characters")
    .regex(nameRegex, "Last name contains invalid characters"),
  email: z.string().email("Email is not valid"),
  birthDate: z
    .date()
    .refine(isAtLeast18YearsAgo, "You must be at least 18 years old"),
  city: z
    .string()
    .min(2, "City must contain at least 2 characters")
    .regex(nameRegex, "City contains invalid characters"),
  postalCode: z
    .string()
    .regex(postalCodeRegex, "Postal code must contain 5 digits"),
});

/**
 * Type definition for the registration form data
 *
 * @typedef {Object} RegistrationFormData
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} email - User's email address
 * @property {Date} birthDate - User's birth date
 * @property {string} city - User's city
 * @property {string} postalCode - User's postal code
 */
export type RegistrationFormData = z.infer<typeof registrationSchema>;
