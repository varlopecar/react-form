import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegistrationForm } from "./RegistrationForm";
import { toast } from "react-hot-toast";

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
});

describe("RegistrationForm", () => {
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();
    });

    it("should have the submit button disabled when fields are empty", () => {
        render(<RegistrationForm onSubmit={mockOnSubmit} />);
        const submitButton = screen.getByText("S'inscrire");
        expect(submitButton).toBeDisabled();
    });

    it("should show error messages when form is submitted with errors", async () => {
        render(<RegistrationForm onSubmit={mockOnSubmit} />);

        // Mock the form submission directly without clicking the button
        const form = screen.getByRole('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalled();
        });
    });

    it("should save data to localStorage and show success toast on successful submission", async () => {
        render(<RegistrationForm onSubmit={mockOnSubmit} />);

        // Fill in valid data
        fireEvent.input(screen.getByLabelText("Prénom"), {
            target: { value: "Jean" },
        });
        fireEvent.input(screen.getByLabelText("Nom"), {
            target: { value: "Dupont" },
        });
        fireEvent.input(screen.getByLabelText("Email"), {
            target: { value: "jean@example.com" },
        });
        fireEvent.input(screen.getByLabelText("Date de naissance"), {
            target: { value: "1990-01-01" },
        });
        fireEvent.input(screen.getByLabelText("Ville"), {
            target: { value: "Paris" },
        });
        fireEvent.input(screen.getByLabelText("Code postal"), {
            target: { value: "75001" },
        });

        // Check that button is now enabled
        await waitFor(() => {
            expect(screen.getByText("S'inscrire")).not.toBeDisabled();
        });

        fireEvent.click(screen.getByText("S'inscrire"));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("Inscription réussie !");
            expect(mockOnSubmit).toHaveBeenCalled();

            // Verify data was saved to localStorage
            expect(localStorageMock.setItem).toHaveBeenCalled();
            const savedData = localStorageMock.setItem.mock.calls[0][1];
            expect(JSON.parse(savedData)).toEqual(expect.objectContaining({
                firstName: "Jean",
                lastName: "Dupont",
                email: "jean@example.com",
                city: "Paris",
                postalCode: "75001",
            }));
        });
    });

    it("should show error for invalid postal code", async () => {
        render(<RegistrationForm onSubmit={mockOnSubmit} />);

        // Fill in all fields to enable the button
        fireEvent.input(screen.getByLabelText("Prénom"), {
            target: { value: "Jean" },
        });
        fireEvent.input(screen.getByLabelText("Nom"), {
            target: { value: "Dupont" },
        });
        fireEvent.input(screen.getByLabelText("Email"), {
            target: { value: "jean@example.com" },
        });
        fireEvent.input(screen.getByLabelText("Date de naissance"), {
            target: { value: "1990-01-01" },
        });
        fireEvent.input(screen.getByLabelText("Ville"), {
            target: { value: "Paris" },
        });

        // Set invalid postal code
        fireEvent.input(screen.getByLabelText("Code postal"), {
            target: { value: "123" },
        });

        // Check that button is now enabled with all fields filled
        await waitFor(() => {
            expect(screen.getByText("S'inscrire")).not.toBeDisabled();
        });

        // Submit form
        fireEvent.click(screen.getByText("S'inscrire"));

        await waitFor(() => {
            expect(screen.getByText(/Le code postal doit contenir 5 chiffres/i)).toBeInTheDocument();
            expect(toast.error).toHaveBeenCalled();
        });
    });

    it("should handle errors during form submission", async () => {
        // Mock an error being thrown during onSubmit
        const mockErrorOnSubmit = vi.fn().mockImplementation(() => {
            throw new Error("Test error");
        });

        render(<RegistrationForm onSubmit={mockErrorOnSubmit} />);

        // Fill in valid data
        fireEvent.input(screen.getByLabelText("Prénom"), {
            target: { value: "Jean" },
        });
        fireEvent.input(screen.getByLabelText("Nom"), {
            target: { value: "Dupont" },
        });
        fireEvent.input(screen.getByLabelText("Email"), {
            target: { value: "jean@example.com" },
        });
        fireEvent.input(screen.getByLabelText("Date de naissance"), {
            target: { value: "1990-01-01" },
        });
        fireEvent.input(screen.getByLabelText("Ville"), {
            target: { value: "Paris" },
        });
        fireEvent.input(screen.getByLabelText("Code postal"), {
            target: { value: "75001" },
        });

        await waitFor(() => {
            expect(screen.getByText("S'inscrire")).not.toBeDisabled();
        });

        fireEvent.click(screen.getByText("S'inscrire"));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Une erreur est survenue lors de l'inscription");
            expect(mockErrorOnSubmit).toHaveBeenCalled();
        });
    });
}); 