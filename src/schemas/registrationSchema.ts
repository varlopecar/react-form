import { z } from "zod";

// Helper function to check if date is at least 18 years ago
const isAtLeast18YearsAgo = (date: Date) => {
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  return date <= eighteenYearsAgo;
};

// French name regex (allows accents, hyphens, spaces)
const nameRegex = /^[a-zA-ZÀ-ÿ\-\s']+$/;

// French postal code regex
const postalCodeRegex = /^[0-9]{5}$/;

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

export type RegistrationFormData = z.infer<typeof registrationSchema>;
