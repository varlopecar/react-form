/**
 * Calculate a person's age in years
 * @param {object} p An object representing a person, implementing a birth Date parameter
 * @return {number} The age of the person (p) in years
 */

export function calculateAge(p: { birthDate: Date }): number {
  if (!p) {
    throw new Error("missing param p");
  }
  if (typeof p !== "object") {
    throw new Error("Object expected");
  }
  if (!p.birthDate) {
    throw new Error("Birth date is required");
  }
  if (!(p.birthDate instanceof Date)) {
    throw new Error("Birth date must be a Date object");
  }
  if (isNaN(p.birthDate.getTime())) {
    throw new Error("Birth date is not correct");
  }
  if (p.birthDate > new Date()) {
    throw new Error("Birth date is not correct");
  }

  const dateDiff = new Date(Date.now() - p.birthDate.getTime());
  const age = Math.abs(dateDiff.getUTCFullYear() - 1970);

  return age;
}
