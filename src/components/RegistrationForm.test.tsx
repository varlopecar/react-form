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
        const submitButton = screen.getByText("Register");
        expect(submitButton).toBeDisabled();
    });

    it("should show error messages when form is submitted with errors", async () => {
        render(<RegistrationForm onSubmit={mockOnSubmit} />);

        // Fill in some fields but leave others empty to trigger validation errors
        fireEvent.input(screen.getByLabelText("First Name"), {
            target: { value: "John" },
        });
        fireEvent.input(screen.getByLabelText("Last Name"), {
            target: { value: "Doe" },
        });
        fireEvent.input(screen.getByLabelText("Email"), {
            target: { value: "john@example.com" },
        });
        fireEvent.input(screen.getByLabelText("Birth Date"), {
            target: { value: "1990-01-01" },
        });
        fireEvent.input(screen.getByLabelText("City"), {
            target: { value: "New York" },
        });
        // Leave postal code empty or invalid
        fireEvent.input(screen.getByLabelText("Postal Code"), {
            target: { value: "" },
        });

        // Wait for form to be in enabled state and then submit
        await waitFor(() => {
            // Button should be disabled due to empty postal code
            expect(screen.getByText("Register")).toBeDisabled();
        });

        // Try to submit the form directly
        const form = screen.getByRole('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalled();
        });
    });

    it("should save data to localStorage and show success toast on successful submission", async () => {
        render(<RegistrationForm onSubmit={mockOnSubmit} />);

        // Fill in valid data
        fireEvent.input(screen.getByLabelText("First Name"), {
            target: { value: "John" },
        });
        fireEvent.input(screen.getByLabelText("Last Name"), {
            target: { value: "Doe" },
        });
        fireEvent.input(screen.getByLabelText("Email"), {
            target: { value: "john@example.com" },
        });
        fireEvent.input(screen.getByLabelText("Birth Date"), {
            target: { value: "1990-01-01" },
        });
        fireEvent.input(screen.getByLabelText("City"), {
            target: { value: "New York" },
        });
        fireEvent.input(screen.getByLabelText("Postal Code"), {
            target: { value: "12345" },
        });

        // Check that button is now enabled
        await waitFor(() => {
            expect(screen.getByText("Register")).not.toBeDisabled();
        });

        fireEvent.click(screen.getByText("Register"));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("Registration successful!");
            expect(mockOnSubmit).toHaveBeenCalled();

            // Verify data was saved to localStorage
            expect(localStorageMock.setItem).toHaveBeenCalled();
            const savedData = localStorageMock.setItem.mock.calls[0][1];
            expect(JSON.parse(savedData)).toEqual(expect.objectContaining({
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                city: "New York",
                postalCode: "12345",
            }));
        });
    });

    it("should show error for invalid postal code", async () => {
        render(<RegistrationForm onSubmit={mockOnSubmit} />);

        // Fill in all fields to enable the button
        fireEvent.input(screen.getByLabelText("First Name"), {
            target: { value: "John" },
        });
        fireEvent.input(screen.getByLabelText("Last Name"), {
            target: { value: "Doe" },
        });
        fireEvent.input(screen.getByLabelText("Email"), {
            target: { value: "john@example.com" },
        });
        fireEvent.input(screen.getByLabelText("Birth Date"), {
            target: { value: "1990-01-01" },
        });
        fireEvent.input(screen.getByLabelText("City"), {
            target: { value: "New York" },
        });

        // Set invalid postal code
        fireEvent.input(screen.getByLabelText("Postal Code"), {
            target: { value: "123" },
        });

        // Check that button is now enabled with all fields filled
        await waitFor(() => {
            expect(screen.getByText("Register")).not.toBeDisabled();
        });

        // Submit form
        fireEvent.click(screen.getByText("Register"));

        await waitFor(() => {
            // Use a function matcher to find the error text even if it's split or wrapped
            expect(screen.getByText((content) =>
                content.includes("Postal code must be at least 4 characters")
            )).toBeInTheDocument();
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
        fireEvent.input(screen.getByLabelText("First Name"), {
            target: { value: "John" },
        });
        fireEvent.input(screen.getByLabelText("Last Name"), {
            target: { value: "Doe" },
        });
        fireEvent.input(screen.getByLabelText("Email"), {
            target: { value: "john@example.com" },
        });
        fireEvent.input(screen.getByLabelText("Birth Date"), {
            target: { value: "1990-01-01" },
        });
        fireEvent.input(screen.getByLabelText("City"), {
            target: { value: "New York" },
        });
        fireEvent.input(screen.getByLabelText("Postal Code"), {
            target: { value: "12345" },
        });

        await waitFor(() => {
            expect(screen.getByText("Register")).not.toBeDisabled();
        });

        fireEvent.click(screen.getByText("Register"));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("An error occurred during registration");
            expect(mockErrorOnSubmit).toHaveBeenCalled();
        });
    });
}); 