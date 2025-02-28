import { calculateAge } from ".";
import { Person } from "../models/Person";
import { beforeEach, describe, expect, it } from "vitest";

/**
 *
 * @function calculateAge
 *
 */
let person: Person;

beforeEach(async () => {
  const date = new Date();
  person = {
    name: "Carlos",
    birthDate: new Date(date.setFullYear(date.getFullYear() - 23)),
  };
});

describe("calculateAge", () => {
  it("should calculate the age of a person", () => {
    const age = calculateAge(person);

    expect(age).toBe(23);
  });

  // it("should throw an error if no argument is provided", () => {
  //   expect(() => calculateAge()).toThrow("missing param p");
  // });

  // it("should throw an error if argument is not an object", () => {
  //   expect(() => calculateAge("")).toThrow("Object expected");
  // });

  // it("should throw an error if argument is not an object", () => {
  //   expect(() => calculateAge(122)).toThrow("Object expected");
  // });

  // it("should throw an error if the object does not have a birthDate property", () => {
  //   expect(() => calculateAge({ name: "John" })).toThrow("Birth date is required");
  // });

  // it("should throw an error if the birthDate is not a Date object", () => {
  //   expect(() => calculateAge({ birthDate: "2024-01-01" })).toThrow("Birth date must be a Date object");
  // });

  it("should throw an error if the birthDate does not exist", () => {
    expect(() =>
      calculateAge({ birthDate: new Date(NaN) })
    ).toThrow("Birth date is not correct");
  });
});
