import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegistrationForm } from "./RegistrationForm";
import { toast } from "react-hot-toast";

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
    toast: {
        success: vi.fn(),
    },
}));

describe("RegistrationForm", () => {
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should show error messages for empty fields", async () => {
        render(<RegistrationForm onSubmit={mockOnSubmit} />);

        fireEvent.click(screen.getByText("S'inscrire"));
        await waitFor(() => {
            expect(screen.getAllByText(/doit contenir/i).length).toBe(4);
        });
    });

    it("should show success toast and reset form on successful submission", async () => {
        render(<RegistrationForm onSubmit={mockOnSubmit} />);

        // Fill in valid data
        fireEvent.input(screen.getByLabelText(/prénom/i), {
            target: { value: "Jean" },
        });
        fireEvent.input(screen.getByLabelText(/nom/i), {
            target: { value: "Dupont" },
        });
        fireEvent.input(screen.getByLabelText(/email/i), {
            target: { value: "jean@example.com" },
        });
        fireEvent.input(screen.getByLabelText(/date de naissance/i), {
            target: { value: "1990-01-01" },
        });
        fireEvent.input(screen.getByLabelText(/ville/i), {
            target: { value: "Paris" },
        });
        fireEvent.input(screen.getByLabelText(/code postal/i), {
            target: { value: "75001" },
        });

        fireEvent.click(screen.getByText("S'inscrire"));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("Inscription réussie !");
            expect(mockOnSubmit).toHaveBeenCalled();
        });
    });

    it("should show error for invalid postal code", async () => {
        render(<RegistrationForm onSubmit={mockOnSubmit} />);

        fireEvent.input(screen.getByLabelText(/code postal/i), {
            target: { value: "123" },
        });
        fireEvent.click(screen.getByText("S'inscrire"));

        await waitFor(() => {
            expect(screen.getByText(/Le code postal doit contenir 5 chiffres/i)).toBeInTheDocument();
        });
    });
}); 