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
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .regex(nameRegex, "Le prénom contient des caractères invalides"),
  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .regex(nameRegex, "Le nom contient des caractères invalides"),
  email: z.string().email("L'email n'est pas valide"),
  birthDate: z
    .date()
    .refine(isAtLeast18YearsAgo, "Vous devez avoir au moins 18 ans"),
  city: z
    .string()
    .min(2, "La ville doit contenir au moins 2 caractères")
    .regex(nameRegex, "La ville contient des caractères invalides"),
  postalCode: z
    .string()
    .regex(postalCodeRegex, "Le code postal doit contenir 5 chiffres"),
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
