import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("App Component", () => {
  it("should increment the counter on button click", () => {
    render(<App />);

    const button = screen.getByRole("button", { name: /click me/i });
    const counter = screen.getByTestId("count");

    expect(button).toBeInTheDocument();
    expect(counter).toBeInTheDocument();
    expect(counter).toHaveTextContent("0");

    fireEvent.click(button);
    expect(counter).toHaveTextContent("1");
  });
});